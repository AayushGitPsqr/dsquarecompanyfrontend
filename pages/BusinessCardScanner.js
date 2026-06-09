"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BadgeCheck, ChevronRight, Clock3, Loader2, RefreshCw, Search, Zap } from "lucide-react";
import { CameraCapture } from "../components/CameraCapture";
import { CardPreview } from "../components/CardPreview";
import { useBusinessCardScanner } from "../hooks/useBusinessCardScanner";
import { fetchSavedCards } from "../services/cardScannerApi";
export function BusinessCardScannerPage() {
    const { state, draft, previewImage, fieldErrors, canSubmit, error, success, setDraft, handleImageSelected, handleSave, reset } = useBusinessCardScanner();
    const [activeTab, setActiveTab] = useState("scan");
    const [savedCards, setSavedCards] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);
    const [historyVersion, setHistoryVersion] = useState(0);
    useEffect(() => {
        if (activeTab !== "history")
            return undefined;
        let mounted = true;
        setHistoryLoading(true);
        setHistoryError("");
        fetchSavedCards()
            .then((cards) => {
            if (!mounted)
                return;
            setSavedCards(cards);
            setSelectedCard((current) => current ?? cards[0] ?? null);
        })
            .catch((err) => {
            if (!mounted)
                return;
            setHistoryError(err instanceof Error ? err.message : "Unable to load saved cards.");
        })
            .finally(() => {
            if (mounted)
                setHistoryLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, [activeTab, historyVersion]);
    const latestCount = savedCards.length;
    return (_jsxs("main", { className: "relative min-h-screen overflow-hidden px-4 py-4 text-ink sm:px-6 sm:py-6 lg:px-8", children: [_jsx("div", { className: "scanner-orb scanner-orb--a" }), _jsx("div", { className: "scanner-orb scanner-orb--b" }), _jsxs("div", { className: "relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-5", children: [_jsx("header", { className: "premium-shell rounded-[32px] p-4 sm:p-6 lg:p-7", children: _jsxs("div", { className: "relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { className: "max-w-3xl space-y-4", children: [_jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-aqua/20 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-aqua-deep", children: [_jsx(Zap, { className: "h-3.5 w-3.5" }), "Premium business card capture"] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "DSquare Business Tools" }), _jsx("h1", { className: "mt-2 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-6xl", children: "Business card scanning with a premium finish" }), _jsx("p", { className: "mt-4 max-w-3xl text-sm leading-7 text-slate sm:text-base", children: "Camera opens instantly. Capture the card, verify the extracted details, then save it directly to MongoDB." })] })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3 lg:min-w-[23rem] lg:grid-cols-1", children: [_jsxs("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate", children: [_jsx(BadgeCheck, { className: "h-4 w-4 text-aqua-deep" }), "Verify first"] }), _jsx("p", { className: "mt-2 text-sm font-medium text-ink", children: "Review the extracted fields before saving" })] }), _jsxs("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate", children: [_jsx(Clock3, { className: "h-4 w-4 text-aqua-deep" }), "Fast scan"] }), _jsx("p", { className: "mt-2 text-sm font-medium text-ink", children: "Minimal taps for mobile use" })] }), _jsxs("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate", children: [_jsx(Search, { className: "h-4 w-4 text-aqua-deep" }), "History menu"] }), _jsx("p", { className: "mt-2 text-sm font-medium text-ink", children: "Open saved cards from the toggle" })] })] })] }) }), _jsx("section", { className: "premium-shell rounded-[32px] p-4 sm:p-5 lg:p-6", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { className: "inline-flex rounded-full border border-black/10 bg-white/75 p-1 shadow-sm", children: [_jsx("button", { type: "button", onClick: () => setActiveTab("scan"), className: `rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "scan"
                                                ? "bg-ink text-white shadow-sm"
                                                : "text-slate hover:text-ink"}`, children: "Scan" }), _jsx("button", { type: "button", onClick: () => setActiveTab("history"), className: `rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "history"
                                                ? "bg-ink text-white shadow-sm"
                                                : "text-slate hover:text-ink"}`, children: "History" })] }), _jsx("div", { className: "text-sm text-slate", children: activeTab === "scan"
                                        ? "Capture, verify, then save."
                                        : `${latestCount} saved card${latestCount === 1 ? "" : "s"}` })] }) }), activeTab === "scan" ? (_jsxs(_Fragment, { children: [_jsx(CameraCapture, { onCapture: handleImageSelected, onCancel: reset, busy: state === "uploading" || state === "saving" }), state === "uploading" || state === "saving" ? (_jsxs("div", { className: "inline-flex w-fit items-center gap-3 rounded-full border border-black/5 bg-white/80 px-4 py-3 text-sm font-medium text-slate shadow-sm backdrop-blur", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin text-aqua-deep" }), state === "uploading" ? "Reading card data..." : "Saving card..."] })) : null, state === "editing" || state === "saving" ? (_jsx(CardPreview, { draft: draft, imageSrc: previewImage || draft.cardImage, fieldErrors: fieldErrors, onChange: setDraft, onSave: handleSave, onRetake: reset, saving: state === "saving", canSubmit: canSubmit })) : null, error ? (_jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-700 shadow-sm", children: error })) : null, success ? (_jsx("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm", children: success })) : null] })) : (_jsxs("section", { className: "grid gap-4 lg:grid-cols-[0.92fr_1.08fr]", children: [_jsxs("div", { className: "premium-shell rounded-[28px] p-4 sm:p-5", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "Saved cards" }), _jsx("h2", { className: "mt-1 text-2xl font-semibold text-ink", children: "Recent scans" })] }), _jsxs("button", { type: "button", onClick: () => setHistoryVersion((current) => current + 1), className: "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink transition hover:border-aqua/60", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] }), _jsx("div", { className: "mt-4 space-y-3", children: historyLoading ? (_jsx("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-6 text-sm text-slate", children: "Loading saved cards..." })) : historyError ? (_jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700", children: historyError })) : savedCards.length === 0 ? (_jsx("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-6 text-sm text-slate", children: "No saved cards yet. Scan one from the camera tab to see it here." })) : (savedCards.map((card) => (_jsxs("button", { type: "button", onClick: () => setSelectedCard(card), className: `w-full rounded-2xl border px-4 py-4 text-left transition ${selectedCard?._id === card._id
                                                ? "border-aqua/50 bg-white shadow-sm"
                                                : "border-black/5 bg-white/70 hover:border-aqua/25 hover:bg-white"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-ink", children: card.name }), _jsx("p", { className: "mt-1 text-sm text-slate", children: card.company || "Company not detected" })] }), _jsx(ChevronRight, { className: "mt-1 h-4 w-4 text-slate" })] }), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-xs text-slate", children: [card.email ? (_jsx("span", { className: "rounded-full bg-pearl px-2.5 py-1", children: card.email })) : null, card.phone ? (_jsx("span", { className: "rounded-full bg-pearl px-2.5 py-1", children: card.phone })) : null, card.website ? (_jsx("span", { className: "rounded-full bg-pearl px-2.5 py-1", children: card.website })) : null] })] }, card._id)))) })] }), _jsx("div", { className: "premium-shell rounded-[28px] p-4 sm:p-5", children: selectedCard ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "Preview" }), _jsx("h3", { className: "mt-1 text-2xl font-semibold text-ink", children: selectedCard.name }), _jsx("p", { className: "mt-1 text-sm text-slate", children: selectedCard.company || "No company detected" })] }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                                                ["Designation", selectedCard.designation],
                                                ["Email", selectedCard.email],
                                                ["Phone", selectedCard.phone],
                                                ["Website", selectedCard.website],
                                                ["Address", selectedCard.address]
                                            ].map(([label, value]) => (_jsxs("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-3", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate", children: label }), _jsx("p", { className: "mt-1 text-sm font-medium text-ink", children: value || "Not detected" })] }, label))) }), selectedCard.cardImage ? (_jsx("div", { className: "overflow-hidden rounded-[24px] border border-black/10 bg-ink", children: _jsx("img", { src: selectedCard.cardImage, alt: selectedCard.name, className: "h-72 w-full object-contain" }) })) : null] })) : (_jsx("div", { className: "grid min-h-[18rem] place-items-center rounded-[24px] border border-dashed border-black/10 bg-white/60 px-6 py-10 text-center text-slate", children: "Select a saved card to view its details." })) })] }))] })] }));
}
export default BusinessCardScannerPage;
