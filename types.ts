export type BusinessCardDraft = {
  name: string;
  designation: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  cardImage: string;
  rawText: string;
};

export type BusinessCardScanData = {
  name: string | null;
  designation: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  cardImage: string | null;
  rawText: string | null;
};

export type ScanResult = {
  success: boolean;
  message: string;
  data: Partial<BusinessCardScanData>;
};

export type SavedCard = {
  _id: string;
  name: string;
  designation: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  cardImage: string | null;
  rawText: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UploadState = "idle" | "uploading" | "editing" | "saving" | "error" | "success";
