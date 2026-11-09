
import type{ITransferReceiptRepository} from "../interfaces/ITransferReceiptRepository";
import type {ITransferReceiptBase, ITransferReceipt} from "../interfaces/ITransferReceipt";
import {AbstractService} from "@drax/crud-back";
import {TransferReceiptBaseSchema} from "../schemas/TransferReceiptSchema.js";
import type {ZodObject, ZodRawShape} from "zod";

class TransferReceiptService extends AbstractService<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase> {

    private receiptRepository: ITransferReceiptRepository;

    async upsertExternal(data: ITransferReceiptBase): Promise<ITransferReceipt> {
        const validated = TransferReceiptBaseSchema.parse(data) as ITransferReceiptBase;
        return this.receiptRepository.upsertExternal(validated);
    }

    constructor(TransferReceiptRepository: ITransferReceiptRepository, baseSchema?: ZodObject<ZodRawShape>, fullSchema?: ZodObject<ZodRawShape>) {
        super(TransferReceiptRepository, baseSchema, fullSchema);
        this.receiptRepository = TransferReceiptRepository;
        
        this._validateOutput = true
        
    }

}

export default TransferReceiptService
export {TransferReceiptService}
