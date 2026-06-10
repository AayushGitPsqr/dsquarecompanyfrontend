"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ChevronRight, Download, Loader2, RefreshCw, X } from "lucide-react";
import { CameraCapture } from "../components/CameraCapture";
import { CardPreview } from "../components/CardPreview";
import { useBusinessCardScanner } from "../hooks/useBusinessCardScanner";
import { fetchSavedCards } from "../services/cardScannerApi";
import { downloadSavedCardsAsExcel } from "../utils/exportSavedCards";
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
    useEffect(() => {
        if (activeTab !== "history") {
            setSelectedCard(null);
        }
    }, [activeTab]);
    useEffect(() => {
        if (!selectedCard)
            return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelectedCard(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedCard]);
    return (_jsxs("main", { className: "relative min-h-screen overflow-hidden px-4 py-4 text-ink sm:px-6 sm:py-6 lg:px-8", children: [_jsx("div", { className: "scanner-orb scanner-orb--a" }), _jsx("div", { className: "scanner-orb scanner-orb--b" }), _jsxs("div", { className: "relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-5", children: [_jsx("header", { className: "premium-shell rounded-[32px] p-5 sm:p-6 lg:p-7", children: _jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [_jsx("div", { className: "max-w-3xl space-y-3", children: _jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "Business Card Scanner" }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("div", { className: "inline-flex rounded-full border border-black/10 bg-white/75 p-1 shadow-sm", children: [_jsx("button", { type: "button", onClick: () => setActiveTab("scan"), className: `rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "scan"
                                                        ? "bg-ink text-white shadow-sm"
                                                        : "text-slate hover:text-ink"}`, children: "Scan" }), _jsx("button", { type: "button", onClick: () => setActiveTab("history"), className: `rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "history"
                                                        ? "bg-ink text-white shadow-sm"
                                                        : "text-slate hover:text-ink"}`, children: "History" })] }), activeTab === "history" ? (_jsxs("button", { type: "button", onClick: () => downloadSavedCardsAsExcel(savedCards), disabled: savedCards.length === 0, className: "inline-flex items-center gap-2 rounded-full border border-aqua/20 bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-aqua-deep disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx(Download, { className: "h-4 w-4" }), "Download Excel"] })) : null] })] }) }), activeTab === "scan" ? (_jsxs(_Fragment, { children: [_jsx(CameraCapture, { onCapture: handleImageSelected, onCancel: reset, busy: state === "uploading" || state === "saving" }), state === "uploading" || state === "saving" ? (_jsxs("div", { className: "inline-flex w-fit items-center gap-3 rounded-full border border-black/5 bg-white/80 px-4 py-3 text-sm font-medium text-slate shadow-sm backdrop-blur", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin text-aqua-deep" }), state === "uploading" ? "Reading card data..." : "Saving card..."] })) : null, state === "uploading" || state === "editing" || state === "saving" ? (_jsx(CardPreview, { draft: draft, imageSrc: previewImage || draft.cardImage, fieldErrors: fieldErrors, onChange: setDraft, onSave: handleSave, onRetake: reset, saving: state === "saving", canSubmit: canSubmit })) : null, error ? (_jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-700 shadow-sm", children: error })) : null, success ? (_jsx("div", { className: "rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm", children: success })) : null] })) : (_jsxs("section", { className: "premium-shell rounded-[32px] p-4 sm:p-5 lg:p-6", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-black/5 pb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "Saved cards" }), _jsx("h2", { className: "mt-1 text-2xl font-semibold text-ink", children: "History" })] }), _jsxs("button", { type: "button", onClick: () => setHistoryVersion((current) => current + 1), className: "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink transition hover:border-aqua/60", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), "Refresh"] })] }), _jsx("div", { className: "mt-4 space-y-3", children: historyLoading ? (_jsx("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-6 text-sm text-slate", children: "Loading saved cards..." })) : historyError ? (_jsx("div", { className: "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700", children: historyError })) : savedCards.length === 0 ? (_jsx("div", { className: "rounded-2xl border border-black/5 bg-white/70 px-4 py-6 text-sm text-slate", children: "No saved cards yet. Scan one from the camera tab to see it here." })) : (_jsx("div", { className: "grid gap-3", children: savedCards.map((card) => (_jsxs("button", { type: "button", onClick: () => setSelectedCard(card), className: "flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 px-4 py-4 text-left transition hover:border-aqua/25 hover:bg-white", children: [_jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold text-ink", children: card.name }), _jsx("p", { className: "mt-1 text-xs text-slate", children: "Tap to view details" })] }), _jsx(ChevronRight, { className: "h-4 w-4 text-slate" })] }, card._id))) })) })] }))] }), selectedCard ? (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm", onClick: () => setSelectedCard(null), children: _jsxs("div", { className: "relative w-full max-w-3xl rounded-[28px] border border-black/5 bg-white p-5 shadow-2xl sm:p-6", onClick: (event) => event.stopPropagation(), children: [_jsx("button", { type: "button", onClick: () => setSelectedCard(null), className: "absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition hover:border-aqua/50 hover:bg-pearl", "aria-label": "Close details", children: _jsx(X, { className: "h-5 w-5" }) }), _jsxs("div", { className: "space-y-1 pr-12", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep", children: "Saved card" }), _jsx("h3", { className: "text-3xl font-semibold tracking-tight text-ink", children: selectedCard.name }), _jsx("p", { className: "text-sm text-slate", children: selectedCard.company || "Company not detected" })] }), _jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-2", children: [
                                ["Designation", selectedCard.designation],
                                ["Email", selectedCard.email],
                                ["Phone", selectedCard.phone],
                                ["Website", selectedCard.website],
                                ["Address", selectedCard.address],
                                ["Raw Text", selectedCard.rawText]
                            ].map(([label, value]) => (_jsxs("div", { className: "rounded-2xl border border-black/5 bg-pearl px-4 py-3", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate", children: label }), _jsx("p", { className: "mt-1 text-sm font-medium text-ink", children: value || "Not detected" })] }, label))) }), selectedCard.cardImage ? (_jsx("div", { className: "mt-5 overflow-hidden rounded-[24px] border border-black/10 bg-ink", children: _jsx("img", { src: selectedCard.cardImage, alt: selectedCard.name, className: "h-[22rem] w-full object-contain" }) })) : null] }) })) : null] }));
}
export default BusinessCardScannerPage;
