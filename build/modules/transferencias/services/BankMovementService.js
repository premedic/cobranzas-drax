import { AbstractService } from "@drax/crud-back";
import { BadRequestError } from "@drax/common-back";
import { FileServiceFactory } from "@drax/media-back";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as XLSX from "xlsx";
export const BANK_CREDICOOP = "credicoop";
const CREDICOOP_NAME = "Banco Credicoop";
const REQUIRED_HEADERS = ["Fecha", "Concepto", "NroCpbte", "Debito", "Credito", "Saldo", "Cod"];
const HEADER_ALIASES = {
    fecha: "Fecha",
    concepto: "Concepto",
    nrocpbte: "NroCpbte",
    nrocomprobante: "NroCpbte",
    debito: "Debito",
    credito: "Credito",
    saldo: "Saldo",
    cod: "Cod",
    codigo: "Cod"
};
class BankMovementService extends AbstractService {
    constructor(BankMovementRepository, baseSchema, fullSchema) {
        super(BankMovementRepository, baseSchema, fullSchema);
        this._validateOutput = true;
    }
    async importFile({ bank, buffer, filename = "" }) {
        const start = Date.now();
        if (bank !== BANK_CREDICOOP) {
            throw new BadRequestError("Banco no soportado.");
        }
        this.assertExcelFile(buffer, filename);
        const rows = this.parseCredicoopWorkbook(buffer);
        if (!rows.length) {
            throw new BadRequestError("El archivo no contiene movimientos para importar.");
        }
        const payloads = [];
        for (const row of rows) {
            payloads.push(await this.validateInputCreate(row));
        }
        for (const payload of payloads) {
            await this.create(payload);
        }
        return {
            status: "success",
            rowCount: payloads.length,
            time: Date.now() - start,
            message: "Import successful"
        };
    }
    async importStoredFile(bank, file) {
        if (!file?.filepath) {
            throw new BadRequestError("Debe subir un archivo .xls o .xlsx.");
        }
        const metadata = await FileServiceFactory.instance.findOneBy("relativePath", file.filepath);
        const absolutePath = metadata?.absolutePath || resolve(process.cwd(), file.filepath);
        const buffer = await readFile(absolutePath);
        return this.importFile({
            bank,
            buffer,
            filename: file.filename || metadata?.filename || file.filepath
        });
    }
    assertExcelFile(buffer, filename) {
        const extension = filename.split(".").pop()?.toLowerCase();
        const isXls = buffer.subarray(0, 8).equals(Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]));
        const isXlsx = buffer[0] === 0x50 && buffer[1] === 0x4B;
        if (!(["xls", "xlsx"].includes(extension || "") && (isXls || isXlsx))) {
            throw new BadRequestError("Formato no soportado. Suba el archivo .xls o .xlsx descargado del banco.");
        }
    }
    parseCredicoopWorkbook(buffer) {
        let workbook;
        try {
            workbook = XLSX.read(buffer, { type: "buffer", raw: false });
        }
        catch (error) {
            throw new BadRequestError(`No se pudo leer el archivo Excel. ${error?.message || ""}`.trim());
        }
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!firstSheet) {
            throw new BadRequestError("El archivo Excel no contiene hojas.");
        }
        const rows = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            raw: false,
            defval: "",
            blankrows: false
        });
        const headerRowIndex = rows.findIndex(row => this.isCredicoopHeader(row));
        if (headerRowIndex < 0) {
            throw new BadRequestError("No se encontraron las columnas requeridas de Banco Credicoop.");
        }
        const headers = rows[headerRowIndex].map(value => this.mapHeader(value));
        return rows
            .slice(headerRowIndex + 1)
            .map(row => this.buildCredicoopMovement(headers, row))
            .filter((movement) => movement !== null);
    }
    isCredicoopHeader(row) {
        const fields = new Set(row.map(value => this.mapHeader(value)).filter(Boolean));
        return REQUIRED_HEADERS.every(field => fields.has(field));
    }
    mapHeader(value) {
        const normalized = String(value ?? "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");
        return HEADER_ALIASES[normalized];
    }
    buildCredicoopMovement(headers, row) {
        const source = {};
        headers.forEach((header, index) => {
            if (header)
                source[header] = row[index];
        });
        const Fecha = this.optionalString(source.Fecha);
        const Concepto = this.optionalString(source.Concepto);
        if (!Fecha && !Concepto)
            return null;
        const Debito = this.parseNumber(source.Debito);
        const Credito = this.parseNumber(source.Credito);
        const debitAmount = Debito && Debito !== 0 ? Math.abs(Debito) : undefined;
        const creditAmount = Credito && Credito !== 0 ? Math.abs(Credito) : undefined;
        const direccion = creditAmount !== undefined ? "credito" : debitAmount !== undefined ? "debito" : undefined;
        return {
            Fecha,
            Concepto,
            NroCpbte: this.optionalString(source.NroCpbte),
            Debito,
            Credito,
            Saldo: this.parseNumber(source.Saldo),
            Cod: this.optionalString(source.Cod),
            fecha: this.parseDate(Fecha),
            importe: creditAmount ?? debitAmount,
            direccion,
            bancoOrigen: CREDICOOP_NAME,
            estado: "pendiente"
        };
    }
    optionalString(value) {
        const result = String(value ?? "").trim();
        return result || undefined;
    }
    parseNumber(value) {
        if (typeof value === "number")
            return Number.isFinite(value) ? value : undefined;
        const raw = String(value ?? "").trim().replace(/\s/g, "");
        if (!raw)
            return undefined;
        let normalized = raw;
        if (raw.includes(",")) {
            normalized = raw.replace(/\./g, "").replace(",", ".");
        }
        else if (/^-?\d{1,3}(\.\d{3})+$/.test(raw)) {
            normalized = raw.replace(/\./g, "");
        }
        const result = Number(normalized);
        return Number.isFinite(result) ? result : undefined;
    }
    parseDate(value) {
        if (!value)
            return undefined;
        const match = value.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
        if (!match)
            return undefined;
        const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
        return date.getUTCFullYear() === Number(match[3])
            && date.getUTCMonth() === Number(match[2]) - 1
            && date.getUTCDate() === Number(match[1])
            ? date
            : undefined;
    }
}
export default BankMovementService;
export { BankMovementService };
