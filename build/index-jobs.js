import SetupDrax from './setup/SetupDrax.js';
import InboundEmailMailboxProvider from './modules/mail/providers/InboundEmailMailboxProvider.js';
import InboundMailTransferProcessor from './modules/transferencias/processors/InboundMailTransferProcessor.js';
import TransferReceiptSyncJob from './modules/transferencias/processors/TransferReceiptSyncJob.js';
await SetupDrax();
const portalUrl = process.env.TRANSFER_RECEIPT_PORTAL_URL;
const portalApiKey = process.env.TRANSFER_RECEIPT_PORTAL_API_KEY;
if (Boolean(portalUrl) !== Boolean(portalApiKey)) {
    throw new Error('Configure both TRANSFER_RECEIPT_PORTAL_URL and TRANSFER_RECEIPT_PORTAL_API_KEY');
}
const transferReceiptJob = portalUrl && portalApiKey ? new TransferReceiptSyncJob(portalUrl, portalApiKey) : undefined;
InboundEmailMailboxProvider.instance.start();
InboundMailTransferProcessor.instance.start();
if (transferReceiptJob)
    transferReceiptJob.start();
else
    console.info('TransferReceipt sync disabled: portal environment variables are not configured');
