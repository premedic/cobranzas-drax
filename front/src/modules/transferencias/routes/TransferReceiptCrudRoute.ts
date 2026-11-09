
import TransferReceiptCrudPage from "../pages/crud/TransferReceiptCrudPage.vue";


const TransferReceiptCrudRoute = [
  {
    name: 'TransferReceiptCrudPage',
    path: '/crud/transferreceipt',
    component: TransferReceiptCrudPage,
    meta: {
      auth: true,
      permission: 'transferreceipt:manage',
    }
  },
]

export default TransferReceiptCrudRoute
export { TransferReceiptCrudRoute }
