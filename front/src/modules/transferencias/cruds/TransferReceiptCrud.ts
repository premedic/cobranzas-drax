
import {EntityCrud} from "@drax/crud-vue";
import type{
  IDraxCrudProvider,
  IEntityCrud,
  IEntityCrudOperation,
  IEntityCrudField,
  IEntityCrudFilter,
  IEntityCrudHeader, 
  IEntityCrudPermissions,
  IEntityCrudRefs,
  IEntityCrudRules
} from "@drax/crud-share";
import TransferReceiptProvider from "../providers/TransferReceiptProvider";

//Import EntityCrud Refs


class TransferReceiptCrud extends EntityCrud implements IEntityCrud {

  static singleton: TransferReceiptCrud

  constructor() {
    super();
    this.name = 'TransferReceipt'
  }
  
  static get instance(): TransferReceiptCrud {
    if(!TransferReceiptCrud.singleton){
      TransferReceiptCrud.singleton = new TransferReceiptCrud()
    }
    return TransferReceiptCrud.singleton
  }

  get permissions(): IEntityCrudPermissions{
    return {
      manage: 'transferreceipt:manage', 
      view: 'transferreceipt:view', 
      create: 'transferreceipt:create', 
      update: 'transferreceipt:update', 
      delete: 'transferreceipt:delete'
    }
  }

  get headers(): IEntityCrudHeader[] {
    return [
        {title: 'externalId',key:'externalId', align: 'start'},
{title: 'dni',key:'dni', align: 'start'},
{title: 'concept',key:'concept', align: 'start'},
{title: 'billingPeriod',key:'billingPeriod', align: 'start'},
{title: 'paymentDate',key:'paymentDate', align: 'start'},
{title: 'amount',key:'amount', align: 'start'},
{title: 'receipt',key:'receipt', align: 'start'},
{title: 'syncedAt',key:'syncedAt', align: 'start'}
    ]
  }
  
  get selectedHeaders(): string[] {
    return this.headers.map(header => header.key)
  }
  
  get actionHeaders():IEntityCrudHeader[]{
    return [
      {
        title: 'action.actions',
        key: 'actions',
        sortable: false,
        align: 'center',
        minWidth: '190px',
        fixed: 'end'
      },
    ]
  }

  get provider(): IDraxCrudProvider<any, any, any>{
    return TransferReceiptProvider.instance
  }
  
  get refs(): IEntityCrudRefs{
    return {
      
    }
  }

  get rules():IEntityCrudRules{
    return {
      externalId: [(v: any) => !!v || 'validation.required'],
dni: [(v: any) => !!v || 'validation.required'],
concept: [(v: any) => !!v || 'validation.required'],
paymentDate: [(v: any) => !!v || 'validation.required'],
amount: [(v: any) => !!v || 'validation.required'],
receipt: [(v: any) => !!v || 'validation.required'],
syncedAt: [(v: any) => !!v || 'validation.required']
    }
  }

  get fields(): IEntityCrudField[]{
    return [
        {name:'externalId',type:'string',label:'externalId',default:''},
{name:'dni',type:'string',label:'dni',default:''},
{name:'concept',type:'enum',label:'concept',default:null,enum: ['CUOTA', 'COPAGO', 'PUNITORIOS', 'OTRO']},
{name:'billingPeriod',type:'date',label:'billingPeriod',default:null},
{name:'paymentDate',type:'date',label:'paymentDate',default:null},
{name:'amount',type:'number',label:'amount',default:null},
{name:'receipt',type:'fullFile',label:'receipt',default:{}},
{name:'syncedAt',type:'date',label:'syncedAt',default:null}
    ]
  }
  
  get filters():IEntityCrudFilter[]{
    return [
      //{name: '_id', type: 'string', label: 'ID', default: '', operator: 'eq' },
    ]
  }
  
  get isViewable(){
    return true
  }

  get isEditable(){
    return false
  }

  get isCreatable(){
    return false
  }

  get isDeletable(){
    return false
  }

  get isExportable(){
    return true
  }

  get exportFormats(){
    return ['CSV', 'JSON']
  }

  get exportHeaders(){
    return ['_id']
  }

  get exportPretty(){
    return true
  }

  get isImportable(){
    return false
  }
  
  get isColumnSelectable() {
    return true
  }

  get isGroupable() {
    return true
  }

  get importFormats(){
    return ['CSV', 'JSON']
  }

  get dialogFullscreen(){
    return false
  }
  
  get tabs() {
    return [
     
    ]
  }
  
  get menus() {
    return [
     
    ]
  }
  
  get searchEnable() {
    return true
  }

   get filtersEnable(){
    return true
  }

  get dynamicFiltersEnable(){
    return true
  }

  get isAiAssistable(){
    return false
  }

  get navigationOperations(): IEntityCrudOperation[]{
    return ['view'] // edit, delete
  }
  
  get isSavedQueriesEnabled(){
    return true
  }
  
  get formActionsFixed(): boolean {
    return true
  }

}

export default TransferReceiptCrud

