import * as XLSX from "xlsx";
import type { SavedCard } from "../types";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function cleanCell(value: string | null | undefined) {
  return value ?? "";
}

export function downloadSavedCardsAsExcel(cards: SavedCard[]) {
  const rows = cards.map((card, index) => ({
    "#": index + 1,
    Name: cleanCell(card.name),
    Designation: cleanCell(card.designation),
    Company: cleanCell(card.company),
    Email: cleanCell(card.email),
    Phone: cleanCell(card.phone),
    Website: cleanCell(card.website),
    Address: cleanCell(card.address),
    "Card Image": cleanCell(card.cardImage),
    "Created At": formatDate(card.createdAt),
    "Updated At": formatDate(card.updatedAt),
    "Raw Text": cleanCell(card.rawText)
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Saved Cards");

  const arrayBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  }) as ArrayBuffer;

  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  anchor.href = url;
  anchor.download = `dsquare-saved-cards-${timestamp}.xlsx`;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}
