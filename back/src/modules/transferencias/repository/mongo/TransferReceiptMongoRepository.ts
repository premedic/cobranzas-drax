
import {AbstractMongoRepository} from "@drax/crud-back";
import {TransferReceiptModel} from "../../models/TransferReceiptModel.js";
import type {ITransferReceiptRepository} from '../../interfaces/ITransferReceiptRepository'
import type {ITransferReceipt, ITransferReceiptBase} from "../../interfaces/ITransferReceipt";


class TransferReceiptMongoRepository extends AbstractMongoRepository<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase> implements ITransferReceiptRepository {

    async upsertExternal(data: ITransferReceiptBase): Promise<ITransferReceipt> {
        // Ensure the unique index exists before accepting concurrent retries.
        await TransferReceiptModel.init();
        return TransferReceiptModel.findOneAndUpdate(
            {externalId: data.externalId}, {$set: data},
            {upsert: true, new: true, runValidators: true}
        ).lean() as unknown as Promise<ITransferReceipt>;
    }

    constructor() {
        super();
        this._model = TransferReceiptModel;
        this._searchFields = ['externalId', 'dni'];
        this._populateFields = [];
        this._lean = true
    }

}

export default TransferReceiptMongoRepository
export {TransferReceiptMongoRepository}

