import { useMemo, useState } from "react";
import { businessCardFromPartial, isValidImage, validateBusinessCard } from "../utils/validators";
import { saveCard, scanCard } from "../services/cardScannerApi";
const emptyCard = {
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
    const [state, setState] = useState("idle");
    const [draft, setDraft] = useState(emptyCard);
    const [previewImage, setPreviewImage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const canSubmit = useMemo(() => Boolean(draft.name && (draft.email || draft.phone)), [draft.email, draft.name, draft.phone]);
    function reset() {
        setState("idle");
        setDraft(emptyCard);
        setPreviewImage("");
        setError("");
        setSuccess("");
        setFieldErrors({});
    }
    async function handleImageSelected(file) {
        setError("");
        setSuccess("");
        if (!isValidImage(file)) {
            setError("Please use a JPG, JPEG, or PNG image under 10 MB.");
            setState("error");
            return;
        }
        setState("uploading");
        try {
            const result = await scanCard(file);
            const merged = businessCardFromPartial({
                ...draft,
                ...result.data,
                rawText: result.data.rawText ?? "",
                cardImage: typeof result.data.cardImage === "string" ? result.data.cardImage : ""
            });
            setDraft(merged);
            setPreviewImage(typeof result.data.cardImage === "string" && result.data.cardImage
                ? result.data.cardImage
                : "");
            setState("editing");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Unable to scan the card.");
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
            const persistedCardImage = draft.cardImage.startsWith("blob:") || draft.cardImage.startsWith("data:")
                ? ""
                : draft.cardImage;
            const response = await saveCard({
                ...draft,
                cardImage: persistedCardImage
            });
            setSuccess(response.message);
            setState("success");
            window.setTimeout(() => reset(), 1200);
        }
        catch (err) {
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
