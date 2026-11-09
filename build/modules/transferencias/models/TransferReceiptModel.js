import { mongoose } from '@drax/common-back';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate-v2';
const TransferReceiptSchema = new mongoose.Schema({
    externalId: { type: String, required: true, index: true, unique: true },
    dni: { type: String, required: true, index: true, unique: false },
    concept: { type: String, enum: ['CUOTA', 'COPAGO', 'PUNITORIOS', 'OTRO'], required: true, index: false, unique: false },
    billingPeriod: { type: Date, required: false, index: false, unique: false },
    paymentDate: { type: Date, required: true, index: false, unique: false },
    amount: { type: Number, required: true, index: false, unique: false },
    receipt: {
        filename: { type: String, required: true, index: false, unique: false },
        filepath: { type: String, required: true, index: false, unique: false },
        size: { type: Number, required: true, index: false, unique: false },
        mimetype: { type: String, required: true, index: false, unique: false },
        url: { type: String, required: true, index: false, unique: false },
    },
    syncedAt: { type: Date, required: true, index: false, unique: false }
}, { timestamps: true });
TransferReceiptSchema.plugin(uniqueValidator, { message: 'validation.unique' });
TransferReceiptSchema.plugin(mongoosePaginate);
TransferReceiptSchema.virtual("id").get(function () {
    return this._id.toString();
});
TransferReceiptSchema.set('toJSON', { getters: true, virtuals: true });
TransferReceiptSchema.set('toObject', { getters: true, virtuals: true });
const MODEL_NAME = 'TransferReceipt';
const COLLECTION_NAME = 'TransferReceipt';
const TransferReceiptModel = mongoose.model(MODEL_NAME, TransferReceiptSchema, COLLECTION_NAME);
export { TransferReceiptSchema, TransferReceiptModel };
export default TransferReceiptModel;
