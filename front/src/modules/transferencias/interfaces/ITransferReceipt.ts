
interface ITransferReceiptBase {
    externalId: string
    dni: string
    concept: string
    billingPeriod?: Date
    paymentDate: Date
    amount: number
    receipt: {
                filename: string,
                filepath: string,
                size: number,
                mimetype?: string,
                url: string
                }
    syncedAt: Date
    createdAt?: Date
    updatedAt?: Date
}

interface ITransferReceipt {
    _id: string
    externalId: string
    dni: string
    concept: string
    billingPeriod?: Date
    paymentDate: Date
    amount: number
    receipt: {
                filename: string,
                filepath: string,
                size: number,
                mimetype?: string,
                url: string
                }
    syncedAt: Date
    createdAt?: Date
    updatedAt?: Date
}

export type {
ITransferReceiptBase, 
ITransferReceipt
}
