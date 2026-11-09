import {describe, expect, it, vi} from "vitest";
import * as XLSX from "xlsx";
import {BankMovementService} from "../../../src/modules/transferencias/services/BankMovementService.js";
import {BankMovementBaseSchema, BankMovementSchema} from "../../../src/modules/transferencias/schemas/BankMovementSchema.js";
import type {IBankMovementBase} from "../../../src/modules/transferencias/interfaces/IBankMovement.js";
import type {IBankMovementRepository} from "../../../src/modules/transferencias/interfaces/IBankMovementRepository.js";

function createSyntheticCredicoopXls(rows: unknown[][]) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
        ["", "Fecha", "Concepto", "Nro.Cpbte.", "Débito", "Crédito", "Saldo", "Cód.", ""],
        ...rows
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "movimientos_simulados");
    return Buffer.from(XLSX.write(workbook, {bookType: "biff8", type: "buffer"}));
}

function createService() {
    let sequence = 0;
    const create = vi.fn(async (payload: IBankMovementBase) => ({
        ...payload,
        _id: `synthetic-${++sequence}`
    }));
    const repository = {create} as unknown as IBankMovementRepository;
    const service = new BankMovementService(repository, BankMovementBaseSchema, BankMovementSchema);
    return {service, create};
}

describe("BankMovement Credicoop import", () => {
    it("imports a synthetic XLS and maps punctuation, accents and derived fields", async () => {
        const {service, create} = createService();
        const buffer = createSyntheticCredicoopXls([
            ["", "05/03/2026", "Cobro ficticio", "000123", "", "1.234,56", "10.000,00", "TRF", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "06/03/2026", "Débito ficticio", "000124", "250,75", "", "9.749,25", "DB", ""]
        ]);

        const result = await service.importFile({bank: "credicoop", buffer, filename: "movimientos-simulados.xls"});

        expect(result.rowCount).toBe(2);
        expect(create).toHaveBeenCalledTimes(2);
        expect(create.mock.calls[0][0]).toMatchObject({
            Fecha: "05/03/2026",
            Concepto: "Cobro ficticio",
            NroCpbte: "000123",
            Credito: 1234.56,
            Saldo: 10000,
            Cod: "TRF",
            fecha: new Date("2026-03-05T00:00:00.000Z"),
            importe: 1234.56,
            direccion: "credito",
            bancoOrigen: "Banco Credicoop",
            estado: "pendiente"
        });
        expect(create.mock.calls[1][0]).toMatchObject({
            Debito: 250.75,
            importe: 250.75,
            direccion: "debito"
        });
    });

    it("rejects a workbook without the required Credicoop headers", async () => {
        const {service, create} = createService();
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["Fecha", "Importe"], ["05/03/2026", 100]]), "otro_formato");
        const buffer = Buffer.from(XLSX.write(workbook, {bookType: "biff8", type: "buffer"}));

        await expect(service.importFile({bank: "credicoop", buffer, filename: "otro-formato.xls"}))
            .rejects.toThrow("No se encontraron las columnas requeridas");
        expect(create).not.toHaveBeenCalled();
    });

    it("rejects unsupported banks before persisting movements", async () => {
        const {service, create} = createService();
        const buffer = createSyntheticCredicoopXls([]);

        await expect(service.importFile({bank: "otro" as "credicoop", buffer, filename: "movimientos.xls"}))
            .rejects.toThrow("Banco no soportado");
        expect(create).not.toHaveBeenCalled();
    });
});
