"use client";

import type { BusinessCardDraft } from "../types";

type CardPreviewProps = {
  draft: BusinessCardDraft;
  imageSrc: string;
  fieldErrors: Partial<Record<keyof BusinessCardDraft, string>>;
  onChange: (next: BusinessCardDraft) => void;
  onSave: () => void;
  onRetake: () => void;
  saving: boolean;
  canSubmit: boolean;
};

const fields: Array<{ key: keyof BusinessCardDraft; label: string; type?: string }> = [
  { key: "name", label: "Full Name" },
  { key: "designation", label: "Designation" },
  { key: "company", label: "Company Name" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Mobile Number", type: "tel" },
  { key: "website", label: "Website" },
  { key: "address", label: "Address" }
];

export function CardPreview({
  draft,
  imageSrc,
  fieldErrors,
  onChange,
  onSave,
  onRetake,
  saving,
  canSubmit
}: CardPreviewProps) {
  return (
    <section className="premium-shell rounded-[28px] p-3 sm:p-4">
      <div className="rounded-[24px] border border-black/5 bg-white/72 p-4 shadow-glass backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-aqua-deep">
              Review
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-ink">
              Confirm extracted details
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
              Check the fields the AI found, tweak anything that looks off, and
              save the final card to MongoDB.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onRetake}
              className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-semibold text-ink transition hover:border-aqua/60 hover:bg-white"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !canSubmit}
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-aqua-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save card"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[24px] border border-black/5 bg-white/75 p-4">
            <div className="grid gap-1 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="grid gap-2">
                  <span className="text-sm font-semibold text-ink">{field.label}</span>
                  <input
                    type={field.type ?? "text"}
                    value={draft[field.key]}
                    onChange={(event) =>
                      onChange({
                        ...draft,
                        [field.key]: event.target.value
                      })
                    }
                    className="rounded-xl border border-black/10 bg-white/85 px-4 py-3 text-base text-ink outline-none transition focus:border-aqua-deep"
                  />
                  {fieldErrors[field.key] ? (
                    <span className="text-sm font-medium text-red-600">
                      {fieldErrors[field.key]}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-black/10 bg-ink">
            <div className="border-b border-white/10 px-4 py-3 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                Captured image
              </p>
            </div>
            <div className="bg-black/20 p-3">
              <img
                src={imageSrc}
                alt="Captured business card"
                className="h-[22rem] w-full rounded-[18px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
