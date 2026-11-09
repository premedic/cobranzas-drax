
import type{ITransferReceiptRepository} from "../interfaces/ITransferReceiptRepository";
import type {ITransferReceiptBase, ITransferReceipt} from "../interfaces/ITransferReceipt";
import {AbstractService} from "@drax/crud-back";
import type {ZodObject, ZodRawShape} from "zod";

class TransferReceiptService extends AbstractService<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase> {


    constructor(TransferReceiptRepository: ITransferReceiptRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(TransferReceiptRepository, baseSchema, fullSchema);
        
        this._validateOutput = true
        
    }

}

export default TransferReceiptService
export {TransferReceiptService}
