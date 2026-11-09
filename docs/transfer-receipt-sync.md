# Sincronización de comprobantes del portal

`TransferReceipt` replica los comprobantes cargados en el portal público. Es independiente de `TransferEmail`; no modifica su procesamiento ni su auditoría.

## Configuración

Configurar en el backend / worker:

```dotenv
TRANSFER_RECEIPT_PORTAL_URL=https://portal.example.com
TRANSFER_RECEIPT_PORTAL_API_KEY=secreto-del-usuario-sistemas
```

La URL es la raíz del backend del portal, sin `/api`. Las peticiones de integración usan `X-API-Key`. No se registran secretos, URLs de comprobantes ni datos del afiliado en logs.

El worker debe compartir con la API privada la base de datos y el almacenamiento indicado por `DRAX_FILE_DIR`. `DRAX_BASE_URL` debe apuntar a la API privada para generar enlaces locales de descarga. En producción usar HTTPS.

## Ejecución

Desarrollo, desde `back/`:

```sh
npm run back-jobs
```

Producción, después de compilar con el build habitual, desde `out/`:

```sh
npm run prod-jobs
```

El ejemplo `ecosystem.config.example.cjs` utiliza `out/index-jobs.js` con una única instancia. Este worker incluye los dos procesos de correo anteriores y la sincronización de comprobantes. **Reemplazar el worker `index-mail` por `index-jobs`; no ejecutar ambos simultáneamente.** `index-mail.ts` y `back-mail` se conservan para instalaciones anteriores, pero solo procesan correo.

Sin ambas variables del portal, el job queda deshabilitado y el correo sigue funcionando. Si se configura solo una de las dos, el worker rechaza la configuración al iniciar.

Ejecutar **una sola instancia de `index-jobs`** en el despliegue. El job tiene un bloqueo en memoria que evita solapamientos en esa instancia; no implementa exclusión distribuida entre procesos o servidores. Para escalar workers se debe incorporar un bloqueo distribuido antes de aumentar las instancias.

## Flujo y reintentos

Se ejecuta al iniciar y cada cinco minutos:

1. Consulta `GET /api/transfer-receipts/pending`.
2. Valida cada registro con Zod, sin interrumpir los demás si uno es inválido.
3. Descarga el archivo sin credenciales, exige el mismo origen del portal y rechaza redirecciones. Limita la descarga a 50 MB y verifica el tamaño declarado. Los requests tienen timeout.
4. Guarda el binario mediante `MediaService` y hace upsert por `externalId` (índice único en MongoDB).
5. Confirma con `PATCH /api/transfer-receipts/:id/sync`, sin cuerpo. Verifica la respuesta con `sync: true`.

Si falla cualquier paso no se confirma. La próxima consulta vuelve a recibir el pendiente. Si los datos ya estaban guardados, reutiliza el archivo local cuando existe y coincide el tamaño; no duplica el registro ni vuelve a descargar tras una falla de confirmación. Si falta el archivo, lo descarga nuevamente. Se asume que el binario de un comprobante del portal es inmutable; cambiar su contenido por otro del mismo tamaño requiere retirar primero la copia local para volver a descargarlo.

Una falla o interrupción entre el guardado físico y el upsert puede dejar un archivo sin referencia. No se elimina automáticamente ante un error de base de datos porque una respuesta fallida podría corresponder a una escritura ya confirmada internamente. Estos archivos requieren conciliación operativa si se acumulan.

`billingPeriod` se conserva como fecha UTC y se muestra como mes/año UTC. `syncedAt` indica el momento de persistencia local, antes del acuse remoto.

## Backoffice

Acceso desde Transferencias → Comprobantes del portal, o `/crud/transferreceipt`, con permiso `transferreceipt:manage`; la lectura de la API requiere `transferreceipt:view`. Los permisos CRUD se registran en la inicialización de Drax. La pantalla permite consultar y descargar comprobantes PDF o imágenes, filtrar y exportar; la creación, edición y eliminación manual están deshabilitadas en la UI para mantener la réplica.

## Validación

Desde `back/`:

```sh
node node_modules/vitest/vitest.mjs run test/modules/transferencias/transfer-receipt-sync.test.ts
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json
```

Las pruebas usan respuestas HTTP, almacenamiento y repositorio simulados. La integración real requiere configurar el portal, credenciales y el almacenamiento compartido.

## Generación del CRUD

Se siguió `.agent/workflows/drax-crud-workflow.md` con el esquema `arch/src/schemas/transferencias/TransferReceiptSchema.ts`, registrado en `arch/src/index.ts`. Al no estar instaladas las dependencias de `arch/`, se ejecutó el generador Drax disponible en la copia local de desarrollo (3.65.0) sobre esta entidad y se copiaron únicamente sus archivos, sin sobrescribir entidades existentes. Los archivos en `back/` y `front/` incluyen las adaptaciones de sincronización, validaciones y presentación posteriores a la generación.
