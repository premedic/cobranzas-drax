
import BankMovementCrudPage from "../pages/crud/BankMovementCrudPage.vue";
import BankMovementImport from "../pages/BankMovementImport.vue";


const BankMovementCrudRoute = [
  {
    name: 'BankMovementCrudPage',
    path: '/crud/bankmovement',
    component: BankMovementCrudPage,
    meta: {
      auth: true,
      permission: 'bankmovement:manage',
    }
  },
  {
    name: 'BankMovementImport',
    path: '/bank-movements/import',
    component: BankMovementImport,
    meta: {
      auth: true,
      permission: 'bankmovement:manage',
    }
  },
]

export default BankMovementCrudRoute
export { BankMovementCrudRoute }
