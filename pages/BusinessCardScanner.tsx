"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Download, Loader2, RefreshCw, X } from "lucide-react";
import { CameraCapture } from "../components/CameraCapture";
import { CardPreview } from "../components/CardPreview";
import { useBusinessCardScanner } from "../hooks/useBusinessCardScanner";
import { fetchSavedCards } from "../services/cardScannerApi";
import type { SavedCard } from "../types";
import { downloadSavedCardsAsExcel } from "../utils/exportSavedCards";

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

  useEffect(() => {
    if (activeTab !== "history") {
      setSelectedCard(null);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!selectedCard) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
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

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 text-ink sm:px-6 sm:py-6 lg:px-8">
      <div className="scanner-orb scanner-orb--a" />
      <div className="scanner-orb scanner-orb--b" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-5">
        <header className="premium-shell rounded-[32px] p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                Business Card Scanner
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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

              {activeTab === "history" ? (
                <button
                  type="button"
                  onClick={() => downloadSavedCardsAsExcel(savedCards)}
                  disabled={savedCards.length === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-aqua/20 bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-aqua-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download Excel
                </button>
              ) : null}
            </div>
          </div>
        </header>

        {activeTab === "scan" ? (
          <>
            <CameraCapture
              onCapture={handleImageSelected}
              onCancel={reset}
              busy={state === "uploading" || state === "saving"}
            />

            {state === "uploading" ? (
              <section className="premium-shell rounded-[28px] p-3 sm:p-4">
                <div className="rounded-[24px] border border-black/5 bg-white/72 p-4 shadow-glass backdrop-blur-xl sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                        Processing
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold text-ink">
                        Reading the card
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
                        The captured image is already shown below. We are extracting the text now,
                        then the fields will appear with it.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-full border border-black/5 bg-white/80 px-4 py-3 text-sm font-medium text-slate shadow-sm backdrop-blur">
                      <Loader2 className="h-4 w-4 animate-spin text-aqua-deep" />
                      Reading card data...
                    </div>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[24px] border border-black/10 bg-ink">
                    <div className="border-b border-white/10 px-4 py-3 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                        Captured image
                      </p>
                    </div>
                    <div className="bg-black/20 p-3">
                      <img
                        src={previewImage}
                        alt="Captured business card"
                        className="h-[22rem] w-full rounded-[18px] object-contain"
                      />
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {state === "saving" ? (
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-black/5 bg-white/80 px-4 py-3 text-sm font-medium text-slate shadow-sm backdrop-blur">
                <Loader2 className="h-4 w-4 animate-spin text-aqua-deep" />
                Saving card...
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
          <section className="premium-shell rounded-[32px] p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                  Saved cards
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-ink">History</h2>
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
                  No saved cards yet. Scan one from the camera tab to see it here.
                </div>
              ) : (
                <div className="grid gap-3">
                  {savedCards.map((card) => (
                    <button
                      key={card._id}
                      type="button"
                      onClick={() => setSelectedCard(card)}
                      className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 px-4 py-4 text-left transition hover:border-aqua/25 hover:bg-white"
                    >
                      <div>
                        <p className="text-base font-semibold text-ink">{card.name}</p>
                        <p className="mt-1 text-xs text-slate">Tap to view details</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {selectedCard ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-[28px] border border-black/5 bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink transition hover:border-aqua/50 hover:bg-pearl"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 pr-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aqua-deep">
                Saved card
              </p>
              <h3 className="text-3xl font-semibold tracking-tight text-ink">
                {selectedCard.name}
              </h3>
              <p className="text-sm text-slate">
                {selectedCard.company || "Company not detected"}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Designation", selectedCard.designation],
                ["Email", selectedCard.email],
                ["Phone", selectedCard.phone],
                ["Website", selectedCard.website],
                ["Address", selectedCard.address],
                ["Raw Text", selectedCard.rawText]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-black/5 bg-pearl px-4 py-3">
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
              <div className="mt-5 overflow-hidden rounded-[24px] border border-black/10 bg-ink">
                <img
                  src={selectedCard.cardImage}
                  alt={selectedCard.name}
                  className="h-[22rem] w-full object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default BusinessCardScannerPage;
