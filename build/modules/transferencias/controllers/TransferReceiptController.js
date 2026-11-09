import TransferReceiptServiceFactory from "../factory/services/TransferReceiptServiceFactory.js";
import { AbstractFastifyController } from "@drax/crud-back";
import TransferReceiptPermissions from "../permissions/TransferReceiptPermissions.js";
class TransferReceiptController extends AbstractFastifyController {
    constructor() {
        super(TransferReceiptServiceFactory.instance, TransferReceiptPermissions);
        this.tenantField = "tenant";
        this.userField = "user";
        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;
        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }
}
export default TransferReceiptController;
export { TransferReceiptController };
