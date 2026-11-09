import BankMovementServiceFactory from "../factory/services/BankMovementServiceFactory.js";
import { AbstractFastifyController } from "@drax/crud-back";
import BankMovementPermissions from "../permissions/BankMovementPermissions.js";
import { BadRequestError } from "@drax/common-back";
import { BankMovementImportSchema } from "../schemas/BankMovementSchema.js";
class BankMovementController extends AbstractFastifyController {
    constructor() {
        super(BankMovementServiceFactory.instance, BankMovementPermissions);
        this.tenantField = "tenant";
        this.userField = "user";
        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;
        this.userFilter = false;
        this.userSetter = false;
        this.userAssert = false;
    }
    async importFile(request, reply) {
        try {
            request.rbac.assertPermission(BankMovementPermissions.Manage);
            const input = BankMovementImportSchema.safeParse(request.body);
            if (!input.success) {
                throw new BadRequestError("Debe seleccionar un banco y subir un archivo .xls o .xlsx.");
            }
            const result = await BankMovementServiceFactory.instance.importStoredFile(input.data.bank, input.data.file);
            return reply.status(200).send(result);
        }
        catch (error) {
            this.handleError(error, reply);
        }
    }
}
export default BankMovementController;
export { BankMovementController };
