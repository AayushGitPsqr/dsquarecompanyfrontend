import axios from "axios";
const API_BASE = import.meta.env.VITE_QR_API_BASE_URL ??
    "/api";
export async function scanCard(image) {
    const formData = new FormData();
    formData.append("image", image);
    const response = await axios.post(`${API_BASE}/cards/scan`, formData);
    return response.data;
}
export async function saveCard(card) {
    const response = await axios.post(`${API_BASE}/cards/save`, card);
    return response.data;
}
export async function fetchSavedCards() {
    const response = await axios.get(`${API_BASE}/cards`);
    return response.data.data ?? [];
}
export function getApiBaseUrl() {
    return API_BASE;
}
