import type {IEntitySchema} from '@drax/arch';

const entitySchema: IEntitySchema = {
    name: 'TransferReceipt',
    module: 'transferencias',
    apiBasePath: 'transfer-receipts',
    apiTag: 'TransferReceipt',
    schema: {
        externalId: {type: 'string', required: true, unique: true, index: true, search: true, header: true},
        dni: {type: 'string', required: true, index: true, search: true, header: true},
        concept: {type: 'enum', enum: ['CUOTA', 'COPAGO', 'PUNITORIOS', 'OTRO'], required: true, header: true},
        billingPeriod: {type: 'date', required: false, header: true},
        paymentDate: {type: 'date', required: true, header: true},
        amount: {type: 'number', required: true, header: true},
        receipt: {type: 'fullFile', required: true, header: true},
        syncedAt: {type: 'date', required: true, header: true},
    }
};

export default entitySchema;
export {entitySchema};
