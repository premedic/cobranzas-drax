import TransferReceiptController from "../controllers/TransferReceiptController.js";
import { CrudSchemaBuilder } from "@drax/crud-back";
import { TransferReceiptSchema, TransferReceiptBaseSchema } from '../schemas/TransferReceiptSchema.js';
async function TransferReceiptFastifyRoutes(fastify, options) {
    const controller = new TransferReceiptController();
    const schemas = new CrudSchemaBuilder(TransferReceiptSchema, TransferReceiptBaseSchema, TransferReceiptBaseSchema, 'TransferReceipt', 'openapi-3.0', ['TransferReceipt']);
    fastify.get('/api/transfer-receipts', { schema: schemas.paginateSchema }, (req, rep) => controller.paginate(req, rep));
    fastify.get('/api/transfer-receipts/find', { schema: schemas.findSchema }, (req, rep) => controller.find(req, rep));
    fastify.get('/api/transfer-receipts/search', { schema: schemas.searchSchema }, (req, rep) => controller.search(req, rep));
    fastify.get('/api/transfer-receipts/:id', { schema: schemas.findByIdSchema }, (req, rep) => controller.findById(req, rep));
    fastify.get('/api/transfer-receipts/find-one', { schema: schemas.findOneSchema }, (req, rep) => controller.findOne(req, rep));
    fastify.get('/api/transfer-receipts/group-by', { schema: schemas.groupBySchema }, (req, rep) => controller.groupBy(req, rep));
    fastify.post('/api/transfer-receipts', { schema: schemas.createSchema }, (req, rep) => controller.create(req, rep));
    fastify.put('/api/transfer-receipts/:id', { schema: schemas.updateSchema }, (req, rep) => controller.update(req, rep));
    fastify.patch('/api/transfer-receipts/:id', { schema: schemas.updateSchema }, (req, rep) => controller.updatePartial(req, rep));
    fastify.delete('/api/transfer-receipts/:id', { schema: schemas.deleteSchema }, (req, rep) => controller.delete(req, rep));
    fastify.get('/api/transfer-receipts/export', (req, rep) => controller.export(req, rep));
    fastify.post('/api/transfer-receipts/import', (req, rep) => controller.import(req, rep));
}
export default TransferReceiptFastifyRoutes;
export { TransferReceiptFastifyRoutes };
