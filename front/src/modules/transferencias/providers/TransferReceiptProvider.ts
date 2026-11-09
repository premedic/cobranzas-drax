
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {ITransferReceipt, ITransferReceiptBase} from '../interfaces/ITransferReceipt'

class TransferReceiptProvider extends AbstractCrudRestProvider<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase> {
    
  static singleton: TransferReceiptProvider
    
  constructor() {
   super('/api/transfer-receipts')
  }
  
  static get instance() {
    if(!TransferReceiptProvider.singleton){
      TransferReceiptProvider.singleton = new TransferReceiptProvider()
    }
    return TransferReceiptProvider.singleton
  }

}

export default TransferReceiptProvider

