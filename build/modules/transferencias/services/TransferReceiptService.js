import { AbstractService } from "@drax/crud-back";
import { TransferReceiptBaseSchema } from "../schemas/TransferReceiptSchema.js";
class TransferReceiptService extends AbstractService {
    async upsertExternal(data) {
        const validated = TransferReceiptBaseSchema.parse(data);
        return this.receiptRepository.upsertExternal(validated);
    }
    constructor(TransferReceiptRepository, baseSchema, fullSchema) {
        super(TransferReceiptRepository, baseSchema, fullSchema);
        this.receiptRepository = TransferReceiptRepository;
        this._validateOutput = true;
    }
}
export default TransferReceiptService;
export { TransferReceiptService };
