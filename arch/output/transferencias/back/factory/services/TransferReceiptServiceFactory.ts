
import TransferReceiptMongoRepository from '../../repository/mongo/TransferReceiptMongoRepository.js'
import TransferReceiptSqliteRepository from '../../repository/sqlite/TransferReceiptSqliteRepository.js'
import type {ITransferReceiptRepository} from "../../interfaces/ITransferReceiptRepository";
import {TransferReceiptService} from '../../services/TransferReceiptService.js'
import {TransferReceiptBaseSchema, TransferReceiptSchema} from "../../schemas/TransferReceiptSchema.js";
import {COMMON, CommonConfig, DraxConfig} from "@drax/common-back";

class TransferReceiptServiceFactory {
    private static service: TransferReceiptService;

    public static get instance(): TransferReceiptService {
        if (!TransferReceiptServiceFactory.service) {
            
            let repository: ITransferReceiptRepository
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new TransferReceiptMongoRepository()
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile)
                    repository = new TransferReceiptSqliteRepository(dbFile, false)
                    repository.build()
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            
            const baseSchema = TransferReceiptBaseSchema;
            const fullSchema = TransferReceiptSchema;
            TransferReceiptServiceFactory.service = new TransferReceiptService(repository, baseSchema, fullSchema);
        }
        return TransferReceiptServiceFactory.service;
    }
}

export default TransferReceiptServiceFactory
export {
    TransferReceiptServiceFactory
}

