
import BankMovementController from "../controllers/BankMovementController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {BankMovementSchema, BankMovementBaseSchema} from '../schemas/BankMovementSchema.js'

async function BankMovementFastifyRoutes(fastify, options) {

    const controller: BankMovementController = new BankMovementController()
    const schemas = new CrudSchemaBuilder(BankMovementSchema, BankMovementBaseSchema,BankMovementBaseSchema, 'BankMovement', 'openapi-3.0', ['BankMovement']);

    fastify.get('/api/bank-movements', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/bank-movements/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/bank-movements/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/bank-movements/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/bank-movements/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/bank-movements/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/bank-movements', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.post('/api/bank-movements/import-file', (req,rep) => controller.importFile(req,rep))

    fastify.put('/api/bank-movements/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/bank-movements/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/bank-movements/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
    fastify.get('/api/bank-movements/export', (req,rep) =>controller.export(req,rep))
    
}

export default BankMovementFastifyRoutes;
export {BankMovementFastifyRoutes}
