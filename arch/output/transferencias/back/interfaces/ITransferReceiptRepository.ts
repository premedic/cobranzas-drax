
import type {ITransferReceipt, ITransferReceiptBase} from './ITransferReceipt'
import {IDraxCrudRepository} from "@drax/crud-share";

interface ITransferReceiptRepository extends IDraxCrudRepository<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase>{

}

export {ITransferReceiptRepository}


