
import {AbstractCrudRestProvider} from "@drax/crud-front";
import {HttpRestClientFactory, type IHttpClient} from "@drax/common-front";
import type {IBankMovement, IBankMovementBase} from '../interfaces/IBankMovement'

export type BankMovementImportFile = {
  url?: string
  filename?: string
  filepath?: string
  mimetype?: string
}

export type BankMovementImportBank = "credicoop"

export type BankMovementImportResult = {
  status: "success"
  rowCount: number
  time: number
  message: string
}

class BankMovementProvider extends AbstractCrudRestProvider<IBankMovement, IBankMovementBase, IBankMovementBase> {
    
  static singleton: BankMovementProvider
  httpClient: IHttpClient
    
  constructor() {
   super('/api/bank-movements')
   this.httpClient = HttpRestClientFactory.getInstance()
  }
  
  static get instance() {
    if(!BankMovementProvider.singleton){
      BankMovementProvider.singleton = new BankMovementProvider()
    }
    return BankMovementProvider.singleton
  }

  async importFile(bank: BankMovementImportBank, file: BankMovementImportFile): Promise<BankMovementImportResult> {
    return await this.httpClient.post(
      "/api/bank-movements/import-file",
      {bank, file},
      {timeout: 600000}
    ) as BankMovementImportResult
  }

}

export default BankMovementProvider

