import ExcelJS from "exceljs";
import type { Row } from "@/lib/data/generator";

function csvCell(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// CSV au format Excel français : séparateur « ; », BOM UTF-8.
export function toCsv(rows: Row[]) {
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const lines = [cols.join(";"), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(";"))];
  return `﻿${lines.join("\r\n")}`;
}

export async function toXlsx(sheets: Record<string, Row[]>) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "IA Lab";
  for (const [name, rows] of Object.entries(sheets)) {
    const ws = wb.addWorksheet(name.slice(0, 31));
    const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
    ws.columns = cols.map((c) => ({ header: c, key: c, width: Math.min(40, Math.max(10, c.length + 2)) }));
    for (const r of rows) ws.addRow(Object.fromEntries(cols.map((c) => [c, r[c] ?? null])));
    ws.getRow(1).font = { bold: true };
    ws.views = [{ state: "frozen", ySplit: 1 }];
  }
  return Buffer.from(await wb.xlsx.writeBuffer());
}
