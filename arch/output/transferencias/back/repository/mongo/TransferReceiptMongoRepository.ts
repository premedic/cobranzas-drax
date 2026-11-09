
import {AbstractMongoRepository} from "@drax/crud-back";
import {TransferReceiptModel} from "../../models/TransferReceiptModel.js";
import type {ITransferReceiptRepository} from '../../interfaces/ITransferReceiptRepository'
import type {ITransferReceipt, ITransferReceiptBase} from "../../interfaces/ITransferReceipt";


class TransferReceiptMongoRepository extends AbstractMongoRepository<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase> implements ITransferReceiptRepository {

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

