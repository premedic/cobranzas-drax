
import {AbstractSqliteRepository} from "@drax/crud-back";
import type {ITransferReceiptRepository} from '../../interfaces/ITransferReceiptRepository'
import type {ITransferReceipt, ITransferReceiptBase} from "../../interfaces/ITransferReceipt";
import {SqliteTableField} from "@drax/common-back";

class TransferReceiptSqliteRepository extends AbstractSqliteRepository<ITransferReceipt, ITransferReceiptBase, ITransferReceiptBase> implements ITransferReceiptRepository {

    async upsertExternal(data: ITransferReceiptBase): Promise<ITransferReceipt> {
        const existing = await this.findOneBy('externalId', data.externalId);
        return existing ? this.update(existing._id, data) : this.create(data);
    }

    protected db: any;
    protected tableName: string = 'TransferReceipt';
    protected dataBaseFile: string;
    protected searchFields: string[] = ['externalId', 'dni'];
    protected booleanFields: string[] = [];
    protected jsonFields: string[] = ['receipt'];
    protected identifier: string = '_id';
    protected populateFields = [
        
    ]
    protected verbose: boolean = false;
    protected tableFields: SqliteTableField[] = [
        {name: "externalId", type: "TEXT", unique: true, primary: false},
{name: "dni", type: "TEXT", unique: undefined, primary: false},
{name: "concept", type: "TEXT", unique: undefined, primary: false},
{name: "billingPeriod", type: "TEXT", unique: undefined, primary: false},
{name: "paymentDate", type: "TEXT", unique: undefined, primary: false},
{name: "amount", type: "NUMERIC", unique: undefined, primary: false},
{name: "receipt", type: "TEXT", unique: undefined, primary: false},
{name: "syncedAt", type: "TEXT", unique: undefined, primary: false}
    ]
  
}

export default TransferReceiptSqliteRepository
export {TransferReceiptSqliteRepository}

