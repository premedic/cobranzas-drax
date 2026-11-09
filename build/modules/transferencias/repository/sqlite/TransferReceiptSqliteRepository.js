import { AbstractSqliteRepository } from "@drax/crud-back";
class TransferReceiptSqliteRepository extends AbstractSqliteRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'TransferReceipt';
        this.searchFields = ['externalId', 'dni'];
        this.booleanFields = [];
        this.jsonFields = ['receipt'];
        this.identifier = '_id';
        this.populateFields = [];
        this.verbose = false;
        this.tableFields = [
            { name: "externalId", type: "TEXT", unique: true, primary: false },
            { name: "dni", type: "TEXT", unique: undefined, primary: false },
            { name: "concept", type: "TEXT", unique: undefined, primary: false },
            { name: "billingPeriod", type: "TEXT", unique: undefined, primary: false },
            { name: "paymentDate", type: "TEXT", unique: undefined, primary: false },
            { name: "amount", type: "NUMERIC", unique: undefined, primary: false },
            { name: "receipt", type: "TEXT", unique: undefined, primary: false },
            { name: "syncedAt", type: "TEXT", unique: undefined, primary: false }
        ];
    }
    async upsertExternal(data) {
        const existing = await this.findOneBy('externalId', data.externalId);
        return existing ? this.update(existing._id, data) : this.create(data);
    }
}
export default TransferReceiptSqliteRepository;
export { TransferReceiptSqliteRepository };
