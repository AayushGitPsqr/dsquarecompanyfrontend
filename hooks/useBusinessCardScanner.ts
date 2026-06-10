import { useMemo, useState } from "react";
import type { BusinessCardDraft, UploadState } from "../types";
import { businessCardFromPartial, isValidImage, validateBusinessCard } from "../utils/validators";
import { saveCard, scanCard } from "../services/cardScannerApi";

const emptyCard: BusinessCardDraft = {
  name: "",
  designation: "",
  company: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  cardImage: "",
  rawText: ""
};

export function useBusinessCardScanner() {
  const [state, setState] = useState<UploadState>("idle");
  const [draft, setDraft] = useState<BusinessCardDraft>(emptyCard);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BusinessCardDraft, string>>>({});

  const canSubmit = useMemo(
    () => Boolean(draft.name && (draft.email || draft.phone)),
    [draft.email, draft.name, draft.phone]
  );

  function reset() {
    setState("idle");
    setDraft(emptyCard);
    if (previewObjectUrl) {
      try {
        URL.revokeObjectURL(previewObjectUrl);
      } catch {}
      setPreviewObjectUrl("");
    }
    setPreviewImage("");
    setError("");
    setSuccess("");
    setFieldErrors({});
  }

  async function handleImageSelected(file: File) {
    setError("");
    setSuccess("");

    if (!isValidImage(file)) {
      setError("Please use a JPG, JPEG, or PNG image under 10 MB.");
      setState("error");
      return;
    }

    setState("uploading");

    // show an immediate local preview while the image uploads/scans
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewObjectUrl(objectUrl);
      setPreviewImage(objectUrl);
    } catch {}

    try {
      const result = await scanCard(file);
      const merged = businessCardFromPartial({
        ...draft,
        ...result.data,
        rawText: result.data.rawText ?? "",
        cardImage: typeof result.data.cardImage === "string" ? result.data.cardImage : ""
      });
      setDraft(merged);
      // if backend returned a hosted URL (Cloudinary), prefer that
      if (typeof result.data.cardImage === "string" && result.data.cardImage) {
        // revoke local object url if any
        if (previewObjectUrl) {
          try {
            URL.revokeObjectURL(previewObjectUrl);
          } catch {}
          setPreviewObjectUrl("");
        }
        setPreviewImage(result.data.cardImage);
      } else {
        // preserve local preview (already set) or clear
        setPreviewImage((current) => current || "");
      }
      setState("editing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to scan the card.");
      // cleanup local preview on error
      if (previewObjectUrl) {
        try {
          URL.revokeObjectURL(previewObjectUrl);
        } catch {}
        setPreviewObjectUrl("");
      }
      setPreviewImage("");
      setState("error");
    }
  }

  async function handleSave() {
    const nextErrors = validateBusinessCard(draft);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError("Please fix the highlighted fields before saving.");
      setState("editing");
      return;
    }

    setState("saving");
    setError("");

    try {
      const persistedCardImage =
        draft.cardImage.startsWith("blob:") || draft.cardImage.startsWith("data:")
          ? ""
          : draft.cardImage;

      const response = await saveCard({
        ...draft,
        cardImage: persistedCardImage
      });
      setSuccess(response.message);
      setState("success");
      window.setTimeout(() => reset(), 1200);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Unable to save the card.");
    }
  }

  return {
    state,
    draft,
    previewImage,
    fieldErrors,
    canSubmit,
    error,
    success,
    reset,
    handleImageSelected,
    setDraft,
    handleSave
  };
}
