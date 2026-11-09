import { LoadPermissions } from "@drax/identity-back";
import { UserPermissions, RolePermissions, TenantPermissions, UserApiKeyPermissions, UserLoginFailPermissions, UserSessionPermissions } from "@drax/identity-back";
import { MediaPermissions, FilePermissions } from "@drax/media-back";
import { SettingPermissions } from "@drax/settings-back";
import { DashboardPermissions } from "@drax/dashboard-back";
import { AuditPermissions } from "@drax/audit-back";
import { AILogPermissions } from "@drax/ai-back";
import { RecoveryPermissions } from "@drax/recovery-back";
import { BasePermissions } from "../modules/base/permissions/BasePermissions.js";
import { NotificationPermissions } from "../modules/base/permissions/NotificationPermissions.js";
import { PadronPermissions } from "../modules/afilmed/permissions/PadronPermissions.js";
import { CallFailedTypePermissions } from "../modules/caller/permissions/CallFailedTypePermissions.js";
import { CallAttemptPermissions } from "../modules/caller/permissions/CallAttemptPermissions.js";
import { CallListPermissions } from "../modules/caller/permissions/CallListPermissions.js";
import { CallLogPermissions } from "../modules/caller/permissions/CallLogPermissions.js";
import { MultichannelPermissions } from "../modules/caller/permissions/MultichannelPermissions.js";
import { CallSuccessTypePermissions } from "../modules/caller/permissions/CallSuccessTypePermissions.js";
import { WhatsappMessagePermissions } from "../modules/caller/permissions/WhatsappMessagePermissions.js";
import { CovenantPermissions } from "../modules/collections/permissions/CovenantPermissions.js";
import { GroupZonePermissions } from "../modules/collections/permissions/GroupZonePermissions.js";
import { InboundEmailPermissions } from "../modules/mail/permissions/InboundEmailPermissions.js";
import { MailboxPermissions } from "../modules/mail/permissions/MailboxPermissions.js";
import { MailboxUserSettingPermissions } from "../modules/mail/permissions/MailboxUserSettingPermissions.js";
import { OutboundEmailPermissions } from "../modules/mail/permissions/OutboundEmailPermissions.js";
import { SessionEmailPermissions } from "../modules/mail/permissions/SessionEmailPermissions.js";
import { TemplateEmailPermissions } from "../modules/mail/permissions/TemplateEmailPermissions.js";
import { BankMovementPermissions } from "../modules/transferencias/permissions/BankMovementPermissions.js";
import { PayerPermissions } from "../modules/transferencias/permissions/PayerPermissions.js";
import { TransferEmailPermissions } from "../modules/transferencias/permissions/TransferEmailPermissions.js";
import { TransferAuditSessionPermissions } from "../modules/transferencias/permissions/TransferAuditSessionPermissions.js";
import { AffiliatePermissions } from "../modules/premedic/permissions/AffiliatePermissions.js";
import { AffiliateTypePermissions } from "../modules/premedic/permissions/AffiliateTypePermissions.js";
import { BonusPermissions } from "../modules/bajas/permissions/BonusPermissions.js";
import { InternalTransferBonusPermissions } from "../modules/traspasosInternos/permissions/InternalTransferBonusPermissions.js";
import { TransferReceiptPermissions } from "../modules/transferencias/permissions/TransferReceiptPermissions.js";
function InitializePermissions() {
    //Merge All Permissions
    const permissions = [
        ...Object.values(UserPermissions),
        ...Object.values(RolePermissions),
        ...Object.values(TenantPermissions),
        ...Object.values(UserApiKeyPermissions),
        ...Object.values(UserLoginFailPermissions),
        ...Object.values(UserSessionPermissions),
        ...Object.values(MediaPermissions),
        ...Object.values(FilePermissions),
        ...Object.values(SettingPermissions),
        ...Object.values(DashboardPermissions),
        ...Object.values(AuditPermissions),
        ...Object.values(AILogPermissions),
        ...Object.values(RecoveryPermissions),
        //Local modules permissions
        ...Object.values(BasePermissions),
        ...Object.values(NotificationPermissions),
        ...Object.values(PadronPermissions),
        ...Object.values(CallFailedTypePermissions),
        ...Object.values(CallAttemptPermissions),
        ...Object.values(CallListPermissions),
        ...Object.values(CallLogPermissions),
        ...Object.values(MultichannelPermissions),
        ...Object.values(CallSuccessTypePermissions),
        ...Object.values(WhatsappMessagePermissions),
        ...Object.values(CovenantPermissions),
        ...Object.values(GroupZonePermissions),
        ...Object.values(InboundEmailPermissions),
        ...Object.values(MailboxPermissions),
        ...Object.values(MailboxUserSettingPermissions),
        ...Object.values(OutboundEmailPermissions),
        ...Object.values(SessionEmailPermissions),
        ...Object.values(TemplateEmailPermissions),
        ...Object.values(AffiliatePermissions),
        ...Object.values(AffiliateTypePermissions),
        ...Object.values(BankMovementPermissions),
        ...Object.values(PayerPermissions),
        ...Object.values(TransferEmailPermissions),
        ...Object.values(TransferReceiptPermissions),
        ...Object.values(TransferAuditSessionPermissions),
        ...Object.values(BonusPermissions),
        ...Object.values(InternalTransferBonusPermissions),
    ];
    //Load All Permissions
    LoadPermissions(permissions);
}
export default InitializePermissions;
export { InitializePermissions };
