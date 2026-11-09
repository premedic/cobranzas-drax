
const messages = {
  en: {
  
    transferreceipt: {
          entity: 'Transfer receipts',
          menu: 'Transfer receipts',
          crud: 'Transfer receipts',
          field:{
                       externalId:'Portal ID',
           dni:'DNI',
           concept:'Concept',
           billingPeriod:'Billing period',
           paymentDate:'Payment date',
           amount:'Amount',
           receipt:'Receipt',
           syncedAt:'Synced at'
          },
          tabs: {
            
          }
      },
      permission: {
              'transferreceipt:view': 'View TransferReceipt',
              'transferreceipt:create': 'Create TransferReceipt',
              'transferreceipt:update': 'Edit TransferReceipt',
              'transferreceipt:delete': 'Delete TransferReceipt',
              'transferreceipt:manage': 'Manage TransferReceipt',
      }
  },
  es: {
     transferreceipt: {
          entity: 'Comprobante del portal',
          menu: 'Comprobantes del portal',
          crud: 'Comprobantes del portal',
          field:{
                       externalId:'ID del portal',
           dni:'DNI',
           concept:'Concepto',
           billingPeriod:'Período de facturación',
           paymentDate:'Fecha de pago',
           amount:'Importe',
           receipt:'Comprobante',
           syncedAt:'Fecha de sincronización'
          },
          tabs: {
            
          }
      },
     permission: {
              'transferreceipt:view': 'Ver comprobantes del portal',
              'transferreceipt:create': 'Crear comprobantes del portal',
              'transferreceipt:update': 'Editar comprobantes del portal',
              'transferreceipt:delete': 'Eliminar comprobantes del portal',
              'transferreceipt:manage': 'Gestionar comprobantes del portal',
     }
  }
}

export default messages;  
