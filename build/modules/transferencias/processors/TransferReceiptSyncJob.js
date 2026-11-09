import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';
import { z } from 'zod';
import { MediaService } from '@drax/media-back';
import TransferReceiptServiceFactory from '../factory/services/TransferReceiptServiceFactory.js';
export const PortalTransferReceiptSchema = z.object({
    _id: z.string().regex(/^[a-f\d]{24}$/i),
    dni: z.string().min(1),
    concept: z.enum(['CUOTA', 'COPAGO', 'PUNITORIOS', 'OTRO']),
    billingPeriod: z.string().datetime().nullish(),
    paymentDate: z.string().datetime(),
    amount: z.number().nonnegative().finite(),
    receipt: z.object({
        filename: z.string().min(1),
        url: z.string().url(),
        size: z.number().int().positive(),
        mimetype: z.string().min(1),
    }),
});
const INTERVAL_MS = 5 * 60000;
const MAX_FILE_BYTES = 50000000;
export default class TransferReceiptSyncJob {
    constructor(baseUrl, apiKey, dependencies) {
        this.apiKey = apiKey;
        this.running = false;
        this.base = new URL(baseUrl);
        if (!['https:', 'http:'].includes(this.base.protocol) || this.base.username || this.base.password) {
            throw new Error('Invalid TRANSFER_RECEIPT_PORTAL_URL');
        }
        if (!apiKey.trim())
            throw new Error('Missing TRANSFER_RECEIPT_PORTAL_API_KEY');
        this.deps = {
            service: dependencies?.service ?? TransferReceiptServiceFactory.instance,
            media: dependencies?.media ?? new MediaService(),
            request: dependencies?.request ?? fetch,
            fileSize: dependencies?.fileSize ?? (async (path) => (await stat(path)).size),
        };
    }
    start() {
        if (this.timer)
            return;
        void this.run();
        this.timer = setInterval(() => void this.run(), INTERVAL_MS);
    }
    stop() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = undefined;
    }
    async api(path, method = 'GET') {
        const response = await this.deps.request(new URL(path, this.base), {
            method, headers: { 'X-API-Key': this.apiKey }, redirect: 'error',
            signal: AbortSignal.timeout(30000),
        });
        if (!response.ok)
            throw new Error('Portal request failed');
        return response;
    }
    async download(rawUrl, expectedSize) {
        const url = new URL(rawUrl);
        if (url.origin !== this.base.origin || url.username || url.password) {
            throw new Error('Unexpected receipt origin');
        }
        if (expectedSize > MAX_FILE_BYTES)
            throw new Error('Receipt too large');
        // Binary downloads never carry API credentials, and redirects are rejected.
        const response = await this.deps.request(url, {
            redirect: 'error', signal: AbortSignal.timeout(60000),
        });
        if (!response.ok || !response.body)
            throw new Error('Receipt download failed');
        const reader = response.body.getReader();
        const chunks = [];
        let size = 0;
        try {
            while (true) {
                const next = await reader.read();
                if (next.done)
                    break;
                size += next.value.length;
                if (size > MAX_FILE_BYTES || size > expectedSize)
                    throw new Error('Invalid receipt size');
                chunks.push(Buffer.from(next.value));
            }
        }
        finally {
            await reader.cancel().catch(() => undefined);
        }
        if (size !== expectedSize)
            throw new Error('Incomplete receipt download');
        return Buffer.concat(chunks);
    }
    async run() {
        const result = { synced: 0, failed: 0, skipped: false };
        if (this.running)
            return { ...result, skipped: true };
        this.running = true;
        try {
            const pending = z.array(z.unknown()).parse(await (await this.api('/api/transfer-receipts/pending')).json());
            for (const raw of pending) {
                let stage = 'validation';
                try {
                    const remote = PortalTransferReceiptSchema.parse(raw);
                    stage = 'local lookup';
                    const existing = await this.deps.service.findOneBy('externalId', remote._id);
                    let receipt = existing?.receipt;
                    const storedSize = receipt?.filepath
                        ? await this.deps.fileSize(receipt.filepath).catch(() => -1) : -1;
                    if (!receipt || storedSize !== remote.receipt.size || receipt.size !== remote.receipt.size) {
                        stage = 'download';
                        const buffer = await this.download(remote.receipt.url, remote.receipt.size);
                        stage = 'file storage';
                        const saved = await this.deps.media.saveFile({
                            dir: 'transfer-receipts',
                            file: {
                                filename: remote.receipt.filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '_'),
                                fileStream: Readable.from(buffer), mimetype: remote.receipt.mimetype,
                                encoding: 'binary', size: buffer.length,
                            },
                        });
                        receipt = { filename: saved.filename, filepath: saved.relativePath,
                            size: saved.size, mimetype: saved.mimetype, url: saved.url };
                    }
                    stage = 'database persistence';
                    await this.deps.service.upsertExternal({
                        externalId: remote._id, dni: remote.dni, concept: remote.concept,
                        billingPeriod: remote.billingPeriod ? new Date(remote.billingPeriod) : null,
                        paymentDate: new Date(remote.paymentDate), amount: remote.amount,
                        receipt, syncedAt: new Date(),
                    });
                    stage = 'confirmation';
                    const confirmed = await this.api(`/api/transfer-receipts/${remote._id}/sync`, 'PATCH');
                    const confirmation = z.object({ _id: z.literal(remote._id), sync: z.literal(true) }).parse(await confirmed.json());
                    if (confirmation.sync)
                        result.synced++;
                }
                catch {
                    result.failed++;
                    console.error(`TransferReceipt sync: ${stage} failed; will retry next cycle`);
                }
            }
        }
        catch {
            result.failed++;
            console.error('TransferReceipt sync: pending request failed; will retry next cycle');
        }
        finally {
            this.running = false;
        }
        console.info(`TransferReceipt sync: ${result.synced} synced, ${result.failed} failed`);
        return result;
    }
}
