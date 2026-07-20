"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { FlaskConical, X } from "lucide-react";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";
import {
  GUIDE_BLURBS,
  RATING_INGREDIENTS,
  TIER_BANDS,
  describeOvrFormula,
} from "@/lib/rating-methodology";

const ACCENT = "#7dd3fc";

export function HowItWorksButton({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-lg border border-[#38bdf8]/30 bg-[#0b1524]/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7dd3fc] transition hover:border-[#38bdf8]/55 hover:bg-[#0b1524] hover:text-white ${className}`}
      >
        <FlaskConical size={14} aria-hidden />
        How it works
      </button>
      <RatingMethodologyDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function RatingMethodologyButton({
  card,
  className = "",
}: {
  card: ScoutCard;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const tier = TIER_META[card.tier];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#cbd5e1] transition hover:border-[#38bdf8]/40 hover:text-white ${className}`}
      >
        <FlaskConical size={14} style={{ color: tier.accent }} aria-hidden />
        How rating works
      </button>
      <RatingMethodologyDialog
        card={card}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function RatingMethodologyDialog({
  card,
  open,
  onClose,
}: {
  card?: ScoutCard | null;
  open: boolean;
  onClose: () => void;
}) {
  const personalized = !!card;
  const tier = card ? TIER_META[card.tier] : null;
  const accent = tier?.accent ?? ACCENT;
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close backdrop"
            className="absolute inset-0 bg-[#020617]/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0b1524] shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:rounded-2xl"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40"
                  style={{ color: accent }}
                >
                  <FlaskConical size={18} strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7dd3fc]">
                    Scout lab
                  </p>
                  <h2
                    id={titleId}
                    className="font-display text-2xl tracking-wide text-white sm:text-3xl"
                  >
                    {personalized ? "How this rating is built" : "How IceOVR works"}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#94a3b8]">
                    {personalized && card ? (
                      <>
                        GitHub activity → six rink attributes →{" "}
                        <span style={{ color: accent }}>{card.ovr} OVR</span> ·{" "}
                        {tier?.label}
                      </>
                    ) : (
                      <>GitHub activity → six rink attributes → OVR out of 99</>
                    )}
                  </p>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-black/30 p-2 text-[#94a3b8] transition hover:border-white/25 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
              <p className="text-sm leading-relaxed text-[#cbd5e1]">
                IceOVR maps public GitHub signals onto hockey-style attributes (40–88),
                then blends them into an overall. {describeOvrFormula(card)}
              </p>

              <div className="grid gap-2">
                {RATING_INGREDIENTS.map((row) => {
                  const weightPct = Math.round(row.weight * 100);
                  return (
                    <div
                      key={row.key}
                      className="grid gap-2 rounded-xl border border-white/8 bg-black/30 px-3 py-3 sm:grid-cols-[88px_1fr_auto] sm:items-center"
                    >
                      <div>
                        {personalized && card ? (
                          <p className="font-display text-xl text-white">
                            {card.stats[row.key]}
                          </p>
                        ) : (
                          <p
                            className="font-display text-xl"
                            style={{ color: accent }}
                          >
                            {row.short}
                          </p>
                        )}
                        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#64748b]">
                          {row.short} · {row.name}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#e2e8f0]">{row.sources}</p>
                        <p className="mt-0.5 text-xs text-[#94a3b8] sm:truncate">
                          {personalized && card
                            ? row.detail(card)
                            : GUIDE_BLURBS[row.key]}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#64748b]">
                          OVR weight
                        </p>
                        <p className="font-semibold tabular-nums text-white">
                          {weightPct}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7dd3fc]">
                  Rarity bands
                </p>
                <div className="flex flex-wrap gap-2">
                  {TIER_BANDS.map((band) => {
                    const active =
                      personalized && tier
                        ? band.tier.toUpperCase() === tier.label
                        : false;
                    return (
                      <span
                        key={band.tier}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                          active
                            ? "border-transparent text-[#0b1220]"
                            : "border-white/10 bg-black/25 text-[#94a3b8]"
                        }`}
                        style={
                          active && tier
                            ? {
                                background: tier.ovrFill,
                                boxShadow: `0 0 16px ${tier.glow}`,
                              }
                            : undefined
                        }
                      >
                        <span className="font-bold tracking-wide">{band.tier}</span>
                        <span className="ml-1.5 opacity-80">{band.range}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-3 text-xs leading-relaxed text-[#94a3b8]">
                Role badge (FE / BE / OPS…) comes from your top language. Nation flag
                appears only when we can parse it from your GitHub location.
                {!personalized && (
                  <> Scout any username to see your live attribute breakdown.</>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
