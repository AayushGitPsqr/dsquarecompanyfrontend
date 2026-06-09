import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BusinessCardScannerPage } from "./pages/BusinessCardScanner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BusinessCardScannerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
