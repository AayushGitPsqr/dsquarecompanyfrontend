import axios from "axios";
import type { BusinessCardDraft, SavedCard, ScanResult } from "../types";

const API_BASE =
  import.meta.env.VITE_QR_API_BASE_URL ??
  "/api";

export async function scanCard(image: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axios.post<ScanResult>(
    `${API_BASE}/cards/scan`,
    formData
  );

  return response.data;
}

export async function saveCard(
  card: BusinessCardDraft
): Promise<{ success: boolean; message: string }> {
  const response = await axios.post<{ success: boolean; message: string }>(
    `${API_BASE}/cards/save`,
    card
  );

  return response.data;
}

export async function fetchSavedCards(): Promise<SavedCard[]> {
  const response = await axios.get<{ success: boolean; message: string; data: SavedCard[] }>(
    `${API_BASE}/cards`
  );

  return response.data.data ?? [];
}

export function getApiBaseUrl() {
  return API_BASE;
}
