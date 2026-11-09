import type { MenuItem } from '../types/menu'

const menu: MenuItem[] = [
  {
    icon: 'mdi-home',
    text: 'home',
    link: { name: "Home" },
    gallery: false,
    auth: false
  },

  {
    icon: 'mdi-account-circle',
    text: 'Cobranzas',
    description: 'Gestión y administración de cuentas de cobro, convenios y reportes contables',
    gallery: true,
    children: [
      {
        icon: 'mdi-view-dashboard-variant-outline',
        text: 'Dashboard',
        link: { name: "CovenantDashboardPage" },
        gallery: true,
        permission: 'covenant:manage'
      },
      {
        icon: 'mdi-currency-usd',
        text: 'covenant.menu',
        link: { name: "CovenantCrudPage" },
        gallery: true,
        permission: 'covenant:manage'
      },
      {
        icon: 'mdi-file-excel-outline',
        text: 'covenant.exportMenu',
        link: { name: "CovenantExportPage" },
        gallery: true,
        permission: 'covenant:manage'
      },


    ],
  },
  {
    icon: 'mdi-account-circle',
    text: 'LLamados',
    description: 'Supervisión y control de campañas telefónicas y registro de gestiones',
    gallery: true,
    children: [

      {
        icon: 'mdi-format-list-bulleted',
        text: 'Administrar Listados',
        link: { name: "CallListCrudPage" },
        gallery: true,
        permission: 'calllist:manage'
      },
      {
        icon: 'mdi-phone-log',
        text: 'Gestion de Llamadas',
        link: { name: "CallListDashboardPage" },
        gallery: true,
        permission: 'calllist:view'
      },
      {
        icon: 'mdi-phone-check',
        text: 'callsuccesstype.menu',
        link: { name: "CallSuccessTypeCrudPage" },
        gallery: true,
        permission: 'callsuccesstype:manage'
      },
      {
        icon: 'mdi-phone-remove',
        text: 'callfailedtype.menu',
        link: { name: "CallFailedTypeCrudPage" },
        gallery: true,
        permission: 'callfailedtype:manage'
      },
      {
        icon: 'mdi-whatsapp',
        text: 'whatsappmessage.menu',
        link: { name: "WhatsappMessageCrudPage" },
        gallery: true,
        permission: 'whatsappmessage:manage'
      },
    ],
  },
  {
    icon: 'mdi-account-cancel-outline',
    text: 'Bajas',
    description: 'Carga, seguimiento y exportacion de bonificaciones del sector de bajas',
    gallery: true,
    children: [

      {
        icon: 'mdi-ticket-percent-outline',
        text: 'bonus.menu',
        link: { name: "BonusCrudPage" },
        gallery: true,
        permission: 'bonus:view'
      },
      {
        icon: 'mdi-view-dashboard-variant-outline',
        text: 'Dashboard Bonificaciones',
        link: { name: "BonusDashboardPage" },
        gallery: true,
        permission: 'bonus:view'
      },
      {
        icon: 'mdi-file-excel-outline',
        text: 'bonus.exportMenu',
        link: { name: "BonusExportPage" },
        gallery: true,
        permission: 'bonus:export'
      },
    ],
  },
  {
    icon: 'mdi-account-switch-outline',
    text: 'Traspasos Internos',
    description: 'Carga, seguimiento y exportacion de bonificaciones por traspasos internos',
    gallery: true,
    children: [

      {
        icon: 'mdi-ticket-percent-outline',
        text: 'internaltransferbonus.menu',
        link: { name: "InternalTransferBonusCrudPage" },
        gallery: true,
        permission: 'internaltransferbonus:view'
      },
      {
        icon: 'mdi-view-dashboard-variant-outline',
        text: 'Dashboard Bonificaciones TPI',
        link: { name: "InternalTransferBonusDashboardPage" },
        gallery: true,
        permission: 'internaltransferbonus:view'
      },
      {
        icon: 'mdi-file-excel-outline',
        text: 'internaltransferbonus.exportMenu',
        link: { name: "InternalTransferBonusExportPage" },
        gallery: true,
        permission: 'internaltransferbonus:export'
      },
    ],
  },
  {
    icon: 'mdi-bank-transfer',
    text: 'Transferencias',
    description: 'Conciliación, revisión de comprobantes y validación de cobros transferidos',
    gallery: true,
    children: [
      {
        icon: 'mdi-swap-horizontal',
        text: 'bankmovement.menu',
        link: { name: "BankMovementCrudPage" },
        gallery: true,
        permission: 'bankmovement:manage'
      },
      {
        icon: 'mdi-bank-plus',
        text: 'bankmovement.import.menu',
        link: { name: "BankMovementImport" },
        gallery: true,
        permission: 'bankmovement:manage'
      },
      {
        icon: 'mdi-account-search',
        text: 'payer.menu',
        link: { name: "PayerCrudPage" },
        gallery: true,
        permission: 'payer:manage'
      },
      {
        icon: 'mdi-receipt-text-outline',
        text: 'transferreceipt.menu',
        link: { name: 'TransferReceiptCrudPage' },
        gallery: true,
        permission: 'transferreceipt:manage'
      },
      {
        icon: 'mdi-email-fast-outline',
        text: 'transferemail.menu',
        link: { name: "TransferEmailCrudPage" },
        gallery: true,
        permission: 'transferemail:manage'
      },

      {
        icon: 'mdi-email-seal-outline',
        text: 'Auditar transferencias',
        link: { name: "TransferAuditSessionView" },
        gallery: true,
        permission: 'transferemail:manage'
      },

      {
        icon: 'mdi-view-dashboard-variant-outline',
        text: 'Dashboard Transferencias',
        link: { name: "TransferEmailDashboardPage" },
        gallery: true,
        permission: 'transferemail:view'
      },
      {
        icon: 'mdi-play-circle-outline',
        text: 'Procesar correos de transferencias',
        link: { name: "TransferEmailProcessPage" },
        gallery: true,
        permission: 'transferemail:manage'
      },


    ],
  },



  {
    icon: 'mdi-email-outline',
    text: 'Mail',
    description: 'Buzón de correos entrantes y procesamiento de comprobantes adjuntos',
    gallery: true,
    children: [
      {
        icon: 'mdi-email-outline',
        text: 'mail.module.menu',
        link: { name: "MailModulePage" },
        gallery: true,
        permission: 'inboundemail:view'
      },
      {
        icon: 'mdi-inbox-multiple-outline',
        text: 'Gestión de correos',
        link: { name: "EmailManagementPage" },
        gallery: true,
        permission: 'inboundemail:view'
      },
      {
        icon: 'mdi-monitor-dashboard',
        text: 'mail.supervision.menu',
        link: { name: "EmailSupervisionPage" },
        gallery: true,
        permission: 'inboundemail:manage'
      },
      {
        icon: 'mdi-card-account-mail',
        text: 'mailbox.menu',
        link: { name: "MailboxCrudPage" },
        gallery: true,
        permission: 'mailbox:manage'
      },
      {
        icon: 'mdi-email-arrow-left-outline',
        text: 'inboundemail.menu',
        link: { name: "InboundEmailCrudPage" },
        gallery: true,
        permission: 'inboundemail:manage'
      },
      {
        icon: 'mdi-email-arrow-right-outline',
        text: 'outboundemail.menu',
        link: { name: "OutboundEmailCrudPage" },
        gallery: true,
        permission: 'outboundemail:manage'
      },
      {
        icon: 'mdi-email-edit-outline',
        text: 'templateemail.menu',
        link: { name: "TemplateEmailCrudPage" },
        gallery: true,
        permission: 'templateemail:manage'
      },
      {
        icon: 'mdi-view-dashboard-variant-outline',
        text: 'Dashboard Correos Entrantes',
        link: { name: "InboundEmailDashboardPage" },
        gallery: true,
        permission: 'inboundemail:view'
      },
      {
        icon: 'mdi-sync',
        text: 'Sincronizar correos',
        link: { name: "InboundEmailSyncPage" },
        gallery: true,
        permission: 'mailbox:manage'
      },
    ],
  },
  {
    icon: 'mdi-card-account-details-outline',
    text: 'Premedic',
    description: 'Información y configuración de afiliados y planes médicos Premedic',
    gallery: true,
    children: [
      {
        icon: 'mdi-account-multiple',
        text: 'affiliate.menu',
        link: { name: "AffiliateCrudPage" },
        gallery: true,
        permission: 'affiliate:manage'
      },
      {
        icon: 'mdi-shape-outline',
        text: 'affiliatetype.menu',
        link: { name: "AffiliateTypeCrudPage" },
        gallery: true,
        permission: 'affiliatetype:manage'
      },
    ],
  },
  {
    icon: 'mdi-account-circle',
    text: 'Afilmed',
    description: 'Consulta de padrón y datos registrales de la red Afilmed',
    gallery: true,
    children: [

      {
        icon: 'mdi-format-list-bulleted',
        text: 'padron.menu',
        link: { name: "PadronCrudPage" },
        gallery: true,
        permission: 'padron:manage'
      },
      {
        icon: 'mdi-database-import-outline',
        text: 'padron.importMenu',
        link: { name: "PadronImportPage" },
        gallery: true,
        permission: 'padron:manage'
      },

    ],
  },
  {
    icon: 'mdi-account-circle',
    text: 'Administración',
    description: 'Ajustes del sistema, usuarios, roles y seguridad de la plataforma',
    gallery: true,
    children: [
      {
        icon: 'mdi-database-sync-outline',
        text: 'recovery.menu',
        link: { name: "RecoveryPage" },
        gallery: true
      },
      {
        icon: 'mdi-map-marker-radius',
        text: 'groupzone.menu',
        link: { name: "GroupZoneCrudPage" },
        gallery: true,
        permission: 'groupzone:manage'
      },
      // {
      //   icon: 'mdi-domain',
      //   text: 'tenant.menu',
      //   link: { name: "CrudTenant" },
      //   gallery: true,
      //   permission: 'tenant:manage'
      // },
      {
        icon: 'mdi-table-account',
        text: 'user.menu',
        link: { name: "CrudUser" },
        gallery: true,
        permission: 'user:manage'
      },

      {
        icon: 'mdi-chair-rolling',
        text: 'role.menu',
        link: { name: "CrudRole" },
        gallery: true,
        permission: 'role:manage'
      },


      {
        icon: 'mdi mdi-table-key',
        text: 'userapikey.menu',
        link: { name: "CrudUserApiKey" },
        gallery: true,
        permission: 'userApiKey:manage'
      },
      {
        icon: 'mdi-account-arrow-right',
        text: 'usersession.menu',
        link: { name: "UserSessionCrudPage" },
        gallery: true,
        permission: 'usersession:menu'
      },
      {
        icon: 'mdi-lock-alert-outline',
        text: 'userloginfail.menu',
        link: { name: "UserLoginFailCrudPage" },
        gallery: true,
        permission: 'userloginfail:manage'
      },
      {
        icon: 'mdi mdi-cog',
        text: 'setting.menu',
        link: { name: "SettingPage" },
        gallery: true,
        permission: 'setting:manage'
      },

      {
        icon: 'mdi-view-dashboard-edit',
        text: 'dashboard.menu',
        link: { name: "DashboardCrudPage" },
        gallery: true,
        permission: 'dashboard:manage'
      },
      {
        icon: 'mdi-police-badge',
        text: 'audit.menu',
        link: { name: "AuditCrudPage" },
        gallery: true,
        permission: 'audit:manage'
      },
      {
        icon: 'mdi-file',
        text:'file.menu',
        link: { name: "FileCrudPage" },
        gallery: true,
        permission: 'file:manage'
      },
      {
        icon: 'mdi-robot',
        text:'ailog.menu',
        link: { name: "AILogCrudPage" },
        gallery: true,
        permission: 'ailog:manage'
      },
    ]
  },

]

export default menu

export {
  menu
}
