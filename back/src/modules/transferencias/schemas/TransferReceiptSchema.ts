
import { z } from 'zod';


const TransferReceiptBaseSchema = z.object({
      externalId: z.string().min(1,'validation.required'),
    dni: z.string().min(1,'validation.required'),
    concept: z.enum(['CUOTA', 'COPAGO', 'PUNITORIOS', 'OTRO']),
    billingPeriod: z.coerce.date().nullable().optional(),
    paymentDate: z.coerce.date({error: "validation.date"}),
    amount: z.number().min(0,'validation.required'),
    receipt: z.object({
                filename: z.string().min(1),
                filepath: z.string().min(1),
                size: z.number().positive(),
                mimetype: z.string().optional(),
                url: z.string().url()
                }),
    syncedAt: z.coerce.date({error: "validation.date"})
});

const TransferReceiptSchema = TransferReceiptBaseSchema
    .extend({
      _id: z.coerce.string(),
       
    })

export default TransferReceiptSchema;
export {TransferReceiptSchema, TransferReceiptBaseSchema}
