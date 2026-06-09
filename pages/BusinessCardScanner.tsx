"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronRight, Clock3, Loader2, RefreshCw, Search, Zap } from "lucide-react";
import { CameraCapture } from "../components/CameraCapture";
import { CardPreview } from "../components/CardPreview";
import { useBusinessCardScanner } from "../hooks/useBusinessCardScanner";
import { fetchSavedCards } from "../services/cardScannerApi";
import type { SavedCard } from "../types";

type TabKey = "scan" | "history";

export function BusinessCardScannerPage() {
  const {
    state,
    draft,
    previewImage,
    fieldErrors,
    canSubmit,
    error,
    success,
    setDraft,
    handleImageSelected,
    handleSave,
    reset
  } = useBusinessCardScanner();
  const [activeTab, setActiveTab] = useState<TabKey>("scan");
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  useEffect(() => {
    if (activeTab !== "history") return undefined;

    let mounted = true;
    setHistoryLoading(true);
    setHistoryError("");

    fetchSavedCards()
      .then((cards) => {
        if (!mounted) return;
        setSavedCards(cards);
        setSelectedCard((current) => current ?? cards[0] ?? null);
      })
      .catch((err) => {
        if (!mounted) return;
        setHistoryError(
          err instanceof Error ? err.message : "Unable to load saved cards."
        );
      })
      .finally(() => {
        if (mounted) setHistoryLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, historyVersion]);

  const latestCount = savedCards.length;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 text-ink sm:px-6 sm:py-6 lg:px-8">
      <div className="scanner-orb scanner-orb--a" />
      <div className="scanner-orb scanner-orb--b" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-5">
        <header className="premium-shell rounded-[32px] p-4 sm:p-6 lg:p-7">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-aqua/20 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-aqua-deep">
                <Zap className="h-3.5 w-3.5" />
                Premium business card capture
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                  DSquare Business Tools
                </p>
                <h1 className="mt-2 max-w-2xl text-4xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  Business card scanning with a premium finish
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate sm:text-base">
                  Camera opens instantly. Capture the card, verify the extracted
                  details, then save it directly to MongoDB.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[23rem] lg:grid-cols-1">
              <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                  <BadgeCheck className="h-4 w-4 text-aqua-deep" />
                  Verify first
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  Review the extracted fields before saving
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                  <Clock3 className="h-4 w-4 text-aqua-deep" />
                  Fast scan
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  Minimal taps for mobile use
                </p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
                  <Search className="h-4 w-4 text-aqua-deep" />
                  History menu
                </div>
                <p className="mt-2 text-sm font-medium text-ink">
                  Open saved cards from the toggle
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="premium-shell rounded-[32px] p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex rounded-full border border-black/10 bg-white/75 p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("scan")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "scan"
                    ? "bg-ink text-white shadow-sm"
                    : "text-slate hover:text-ink"
                }`}
              >
                Scan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "history"
                    ? "bg-ink text-white shadow-sm"
                    : "text-slate hover:text-ink"
                }`}
              >
                History
              </button>
            </div>
            <div className="text-sm text-slate">
              {activeTab === "scan"
                ? "Capture, verify, then save."
                : `${latestCount} saved card${latestCount === 1 ? "" : "s"}`}
            </div>
          </div>
        </section>

        {activeTab === "scan" ? (
          <>
            <CameraCapture
              onCapture={handleImageSelected}
              onCancel={reset}
              busy={state === "uploading" || state === "saving"}
            />

            {state === "uploading" || state === "saving" ? (
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-black/5 bg-white/80 px-4 py-3 text-sm font-medium text-slate shadow-sm backdrop-blur">
                <Loader2 className="h-4 w-4 animate-spin text-aqua-deep" />
                {state === "uploading" ? "Reading card data..." : "Saving card..."}
              </div>
            ) : null}

            {state === "editing" || state === "saving" ? (
              <CardPreview
                draft={draft}
                imageSrc={previewImage || draft.cardImage}
                fieldErrors={fieldErrors}
                onChange={setDraft}
                onSave={handleSave}
                onRetake={reset}
                saving={state === "saving"}
                canSubmit={canSubmit}
              />
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                {success}
              </div>
            ) : null}
          </>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="premium-shell rounded-[28px] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                    Saved cards
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-ink">
                    Recent scans
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setHistoryVersion((current) => current + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink transition hover:border-aqua/60"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {historyLoading ? (
                  <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-6 text-sm text-slate">
                    Loading saved cards...
                  </div>
                ) : historyError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {historyError}
                  </div>
                ) : savedCards.length === 0 ? (
                  <div className="rounded-2xl border border-black/5 bg-white/70 px-4 py-6 text-sm text-slate">
                    No saved cards yet. Scan one from the camera tab to see it
                    here.
                  </div>
                ) : (
                  savedCards.map((card) => (
                    <button
                      key={card._id}
                      type="button"
                      onClick={() => setSelectedCard(card)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        selectedCard?._id === card._id
                          ? "border-aqua/50 bg-white shadow-sm"
                          : "border-black/5 bg-white/70 hover:border-aqua/25 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-ink">
                            {card.name}
                          </p>
                          <p className="mt-1 text-sm text-slate">
                            {card.company || "Company not detected"}
                          </p>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 text-slate" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate">
                        {card.email ? (
                          <span className="rounded-full bg-pearl px-2.5 py-1">
                            {card.email}
                          </span>
                        ) : null}
                        {card.phone ? (
                          <span className="rounded-full bg-pearl px-2.5 py-1">
                            {card.phone}
                          </span>
                        ) : null}
                        {card.website ? (
                          <span className="rounded-full bg-pearl px-2.5 py-1">
                            {card.website}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="premium-shell rounded-[28px] p-4 sm:p-5">
              {selectedCard ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                      Preview
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-ink">
                      {selectedCard.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate">
                      {selectedCard.company || "No company detected"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Designation", selectedCard.designation],
                      ["Email", selectedCard.email],
                      ["Phone", selectedCard.phone],
                      ["Website", selectedCard.website],
                      ["Address", selectedCard.address]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-black/5 bg-white/70 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">
                          {label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-ink">
                          {value || "Not detected"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {selectedCard.cardImage ? (
                    <div className="overflow-hidden rounded-[24px] border border-black/10 bg-ink">
                      <img
                        src={selectedCard.cardImage}
                        alt={selectedCard.name}
                        className="h-72 w-full object-contain"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="grid min-h-[18rem] place-items-center rounded-[24px] border border-dashed border-black/10 bg-white/60 px-6 py-10 text-center text-slate">
                  Select a saved card to view its details.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default BusinessCardScannerPage;
