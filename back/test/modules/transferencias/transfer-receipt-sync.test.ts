import {describe, it, expect, vi} from 'vitest';
import TransferReceiptSyncJob from '../../../src/modules/transferencias/processors/TransferReceiptSyncJob.js';
import {TransferReceiptBaseSchema} from '../../../src/modules/transferencias/schemas/TransferReceiptSchema.js';
import TransferReceiptService from '../../../src/modules/transferencias/services/TransferReceiptService.js';
import type {ITransferReceiptRepository} from '../../../src/modules/transferencias/interfaces/ITransferReceiptRepository.js';

const remote = {
    _id: '507f1f77bcf86cd799439011', dni: '30123456', concept: 'CUOTA',
    billingPeriod: '2026-11-01T00:00:00.000Z', paymentDate: '2026-11-06T00:00:00.000Z',
    amount: 125000.5, receipt: {filename: 'comprobante.pdf', size: 3,
        mimetype: 'application/pdf', url: 'https://portal.example.com/api/file/receipt.pdf'},
};
const saved = {filename: 'local.pdf', relativePath: 'uploads/transfer-receipts/2026/11/local.pdf',
    url: 'https://back.example.com/api/file/transfer-receipts/2026/11/local.pdf',
    size: 3, mimetype: 'application/pdf'};

function setup(items: unknown[] = [remote]) {
    const records = new Map<string, any>();
    const service = {
        findOneBy: vi.fn(async (_: string, id: string) => records.get(id) ?? null),
        upsertExternal: vi.fn(async (data: any) => {
            TransferReceiptBaseSchema.parse(data);
            records.set(data.externalId, {...data, _id: 'local-id'});
            return records.get(data.externalId);
        }),
    };
    const media = {saveFile: vi.fn(async () => saved as any), deleteFileByRelativePath: vi.fn(async () => ({} as any))};
    const request = vi.fn(async (url: URL | RequestInfo, options?: RequestInit) => {
        if (String(url).endsWith('/pending')) return Response.json(items);
        if (options?.method === 'PATCH') return Response.json({_id: remote._id, sync: true});
        return new Response(new Uint8Array([1, 2, 3]));
    });
    const job = new TransferReceiptSyncJob('https://portal.example.com', 'secret-test', {
        service, media, request: request as typeof fetch, fileSize: async () => 3,
    });
    return {job, records, service, media, request};
}

describe('TransferReceipt synchronization', () => {
    it('saves binary and data before confirming, preserving UTC billing month', async () => {
        const {job, service, media, request} = setup();
        expect(await job.run()).toEqual({synced: 1, failed: 0, skipped: false});
        expect(media.saveFile.mock.invocationCallOrder[0]).toBeLessThan(service.upsertExternal.mock.invocationCallOrder[0]);
        expect(service.upsertExternal.mock.invocationCallOrder[0]).toBeLessThan(request.mock.invocationCallOrder[2]);
        const payload = service.upsertExternal.mock.calls[0][0];
        expect(payload.receipt.filepath).toBe(saved.relativePath);
        expect(payload.billingPeriod.toISOString()).toBe(remote.billingPeriod);
        expect(request.mock.calls[1][1]).not.toHaveProperty('headers');
        expect(request.mock.calls[1][1]?.redirect).toBe('error');
        expect(request.mock.calls[2][1]).toMatchObject({method: 'PATCH', headers: {'X-API-Key': 'secret-test'}});
        expect(request.mock.calls[2][1]).not.toHaveProperty('body');
    });

    it('retries a failed confirmation without duplicate records or downloads', async () => {
        const {job, request, records, media} = setup();
        request.mockImplementationOnce(async () => Response.json([remote]))
            .mockImplementationOnce(async () => new Response(new Uint8Array([1, 2, 3])))
            .mockRejectedValueOnce(new Error('lost acknowledgement'));
        expect((await job.run()).failed).toBe(1);
        expect(records.size).toBe(1);
        expect((await job.run()).synced).toBe(1);
        expect(records.size).toBe(1);
        expect(media.saveFile).toHaveBeenCalledTimes(1);
    });

    it('does not confirm or delete a potentially committed file when persistence fails', async () => {
        const {job, service, request, media} = setup();
        service.upsertExternal.mockRejectedValueOnce(new Error('DB down'));
        expect((await job.run()).failed).toBe(1);
        expect(request.mock.calls.some(([, options]) => options?.method === 'PATCH')).toBe(false);
        expect(media.deleteFileByRelativePath).not.toHaveBeenCalled();
    });

    it.each(['https://external.example.com/receipt', 'https://portal.example.com.evil.test/receipt'])('rejects foreign download origin %s', async url => {
        const {job, request, service} = setup([{...remote, receipt: {...remote.receipt, url}}]);
        expect((await job.run()).failed).toBe(1);
        expect(request).toHaveBeenCalledTimes(1);
        expect(service.upsertExternal).not.toHaveBeenCalled();
    });

    it('rejects a truncated file and continues processing other pending items', async () => {
        const {job, request, service} = setup([{...remote, receipt: {...remote.receipt, size: 4}}, remote]);
        expect(await job.run()).toMatchObject({synced: 1, failed: 1});
        expect(service.upsertExternal).toHaveBeenCalledTimes(1);
        expect(request.mock.calls.filter(([, options]) => options?.method === 'PATCH')).toHaveLength(1);
    });

    it('accepts absent billing period for other concepts and isolates invalid items', async () => {
        const {job, records} = setup([{...remote, amount: -1}, {...remote, concept: 'COPAGO', billingPeriod: null}]);
        expect(await job.run()).toMatchObject({synced: 1, failed: 1});
        expect(records.get(remote._id).billingPeriod).toBeNull();
    });

    it('skips overlapping runs and releases the guard after failure', async () => {
        const {job, request} = setup();
        let reject!: (reason: Error) => void;
        request.mockImplementationOnce(() => new Promise((_resolve, rejectPromise) => {reject = rejectPromise;}));
        const first = job.run();
        expect((await job.run()).skipped).toBe(true);
        reject(new Error('offline'));
        await first;
        expect((await job.run()).synced).toBe(1);
    });

    it('does not confirm or persist if media storage fails', async () => {
        const {job, media, service, request} = setup();
        media.saveFile.mockRejectedValueOnce(new Error('storage unavailable'));
        expect((await job.run()).failed).toBe(1);
        expect(service.upsertExternal).not.toHaveBeenCalled();
        expect(request.mock.calls.some(([, options]) => options?.method === 'PATCH')).toBe(false);
    });

    it('restores a missing local file before confirming a retry', async () => {
        const {job, service, media} = setup();
        service.findOneBy.mockResolvedValueOnce({receipt: {filepath: 'missing.pdf', size: 4}} as any);
        expect((await job.run()).synced).toBe(1);
        expect(media.saveFile).toHaveBeenCalledOnce();
    });

    it('retries when the portal does not confirm sync true', async () => {
        const {job, request} = setup();
        request.mockImplementationOnce(async () => Response.json([remote]))
            .mockImplementationOnce(async () => new Response(new Uint8Array([1, 2, 3])))
            .mockImplementationOnce(async () => Response.json({_id: remote._id, sync: false}));
        expect((await job.run()).failed).toBe(1);
        expect((await job.run()).synced).toBe(1);
    });

    it('starts immediately, repeats every five minutes and stops its timer', async () => {
        vi.useFakeTimers();
        try {
            const {job} = setup([]);
            const run = vi.spyOn(job, 'run').mockResolvedValue({synced: 0, failed: 0, skipped: false});
            job.start();
            job.start();
            expect(run).toHaveBeenCalledTimes(1);
            await vi.advanceTimersByTimeAsync(300_000);
            expect(run).toHaveBeenCalledTimes(2);
            job.stop();
            await vi.advanceTimersByTimeAsync(300_000);
            expect(run).toHaveBeenCalledTimes(2);
        } finally {
            vi.useRealTimers();
        }
    });

    it('handles empty pending lists', async () => {
        const {job, media} = setup([]);
        expect(await job.run()).toEqual({synced: 0, failed: 0, skipped: false});
        expect(media.saveFile).not.toHaveBeenCalled();
    });

    it('validates input before repository upsert', async () => {
        const upsertExternal = vi.fn();
        const service = new TransferReceiptService({upsertExternal} as unknown as ITransferReceiptRepository);
        await expect(service.upsertExternal({...remote, externalId: remote._id, receipt: {}} as any)).rejects.toThrow();
        expect(upsertExternal).not.toHaveBeenCalled();
    });
});
