import { AbstractMongoRepository } from "@drax/crud-back";
import { TransferReceiptModel } from "../../models/TransferReceiptModel.js";
class TransferReceiptMongoRepository extends AbstractMongoRepository {
    async upsertExternal(data) {
        // Ensure the unique index exists before accepting concurrent retries.
        await TransferReceiptModel.init();
        return TransferReceiptModel.findOneAndUpdate({ externalId: data.externalId }, { $set: data }, { upsert: true, new: true, runValidators: true }).lean();
    }
    constructor() {
        super();
        this._model = TransferReceiptModel;
        this._searchFields = ['externalId', 'dni'];
        this._populateFields = [];
        this._lean = true;
    }
}
export default TransferReceiptMongoRepository;
export { TransferReceiptMongoRepository };
