
const messages = {
  en: {
    bankmovement: {
      entity: 'Bank Movement',
      menu: 'Bank Movements',
      crud: 'Manage Bank Movements',
      import: {
        menu: 'Import bank movements',
        title: 'Import bank movements',
        description: 'Select the bank and upload the movements file downloaded from online banking.',
        bank: 'Bank',
        file: 'Movements file',
        submit: 'Import movements',
        success: '{count} bank movements were imported.',
        error: 'Bank movements could not be imported.'
      },
      field: {
        Fecha: 'Bank Date',
        Concepto: 'Concept',
        NroCpbte: 'Receipt Number',
        Debito: 'Debit',
        Credito: 'Credit',
        Saldo: 'Balance',
        Cod: 'Code',
        fecha: 'Normalized Date',
        importe: 'Amount',
        direccion: 'Direction',
        tipoConcepto: 'Concept Type',
        bancoOrigen: 'Source Bank',
        cuilCuitPagador: 'Payer CUIT/CUIL',
        nombrePagador: 'Payer Name',
        numeroCuentaPagador: 'Payer Account Number',
        pagadorDetectadoId: 'Matched Payer',
        afiliadoId: 'Affiliate',
        estado: 'Status'
      }
    },
    permission: {
      'bankmovement:view': 'View Bank Movement',
      'bankmovement:create': 'Create Bank Movement',
      'bankmovement:update': 'Edit Bank Movement',
      'bankmovement:delete': 'Delete Bank Movement',
      'bankmovement:manage': 'Manage Bank Movements',
    }
  },
  es: {
    bankmovement: {
      entity: 'Movimiento bancario',
      menu: 'Movimientos bancarios',
      crud: 'Gestionar movimientos bancarios',
      import: {
        menu: 'Importar movimientos bancarios',
        title: 'Importar movimientos bancarios',
        description: 'Seleccioná el banco y subí el archivo de movimientos descargado desde el home banking.',
        bank: 'Banco',
        file: 'Archivo de movimientos',
        submit: 'Importar movimientos',
        success: 'Se importaron {count} movimientos bancarios.',
        error: 'No se pudieron importar los movimientos bancarios.'
      },
      field: {
        Fecha: 'Fecha banco',
        Concepto: 'Concepto',
        NroCpbte: 'Nro. de comprobante',
        Debito: 'Débito',
        Credito: 'Crédito',
        Saldo: 'Saldo',
        Cod: 'Cód.',
        fecha: 'Fecha normalizada',
        importe: 'Importe',
        direccion: 'Dirección',
        tipoConcepto: 'Tipo de concepto',
        bancoOrigen: 'Banco origen',
        cuilCuitPagador: 'CUIT/CUIL pagador',
        nombrePagador: 'Nombre pagador',
        numeroCuentaPagador: 'Cuenta pagador',
        pagadorDetectadoId: 'Pagador vinculado',
        afiliadoId: 'Afiliado',
        estado: 'Estado'
      }
    },
    permission: {
      'bankmovement:view': 'Ver movimiento bancario',
      'bankmovement:create': 'Crear movimiento bancario',
      'bankmovement:update': 'Editar movimiento bancario',
      'bankmovement:delete': 'Eliminar movimiento bancario',
      'bankmovement:manage': 'Gestionar movimientos bancarios',
    }
  }
}

export default messages;  
