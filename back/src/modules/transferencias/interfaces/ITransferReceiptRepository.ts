
import type {ITransferReceipt, ITransferReceiptBase} from './ITransferReceipt'
import {IDraxCrudRepository} from "@drax/crud-share";

interface ITransferReceiptRepository extends IDraxCrudRepository<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase>{
    upsertExternal(data: ITransferReceiptBase): Promise<ITransferReceipt>;

}

export {ITransferReceiptRepository}


