
import BankMovementCrudRoute from "./BankMovementCrudRoute"
import PayerCrudRoute from "./PayerCrudRoute"
import TransferEmailProcessRoute from "./TransferEmailProcessRoute"
import TransferEmailCrudRoute from "./TransferEmailCrudRoute"
import TransferEmailViewRoute from "./TransferEmailViewRoute"
import TransferEmailDashboardRoute from "./TransferEmailDashboardRoute"
import TransferAuditSessionRoute from "./TransferAuditSessionRoute"
import InboundEmailTransferManagementRoute from "./InboundEmailTransferManagementRoute"
import TransferReceiptTestRoute from "./TransferReceiptTestRoute"
import embeddedRouter from "@/modules/mail/embedded/EmbeddedRouter"

embeddedRouter.register({
  path: "/transferencias/procesar-email",
  permission: "transferemail:view",
  component: () => import("@/modules/transferencias/components/InboundEmailTransferManagement.vue"),
  props: (location) => ({
    inboundEmailId: queryValueToString(location.query?.inboundEmail),
  }),
})

function queryValueToString(value: unknown) {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : ""
  return value ? String(value) : ""
}

import TransferReceiptCrudRoute from "./TransferReceiptCrudRoute"

export const routes = [
...TransferReceiptCrudRoute,
...BankMovementCrudRoute,
...PayerCrudRoute,
...TransferEmailProcessRoute,
...TransferEmailCrudRoute,
...TransferEmailViewRoute,
...TransferEmailDashboardRoute,
...TransferAuditSessionRoute,
...InboundEmailTransferManagementRoute,
...TransferReceiptTestRoute
]

export default routes
