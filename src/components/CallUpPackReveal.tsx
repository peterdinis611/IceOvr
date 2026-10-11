"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";
import type { PackRevealEvent } from "@/lib/client/scout-history";

export function CallUpPackReveal({
  card,
  event,
  onClose,
}: {
  card: ScoutCard;
  event: PackRevealEvent | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const tier = event ? TIER_META[event.toTier] : null;
  const title =
    event?.kind === "callup"
      ? "CALLED UP"
      : event?.kind === "foil"
        ? "FOIL UNLOCKED"
        : "TIER JUMP";

  return (
    <AnimatePresence>
      {event && tier && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="callup-pack-title"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#050403]/88 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden border-2 border-[var(--kraft)]/30 bg-[#12100c] p-6 shadow-[0_28px_90px_rgba(0,0,0,.55)]"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.86, rotateX: 18 }
            }
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 50% 20%, ${tier.glow}, transparent 55%)`,
              }}
            />
            {!reduceMotion && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 ice-sheen opacity-50"
              />
            )}
            <p className="relative text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ice)]">
              Pack reveal · between periods
            </p>
            <h2
              id="callup-pack-title"
              className="relative mt-2 font-display text-4xl tracking-[0.1em] text-[var(--kraft)]"
            >
              {title}
            </h2>
            <p className="relative mt-2 text-sm text-[var(--steel)]">
              @{card.username} moved from {event.fromTier} ({event.fromOvr} OVR)
              to{" "}
              <span style={{ color: tier.accent }}>{tier.label}</span> (
              {event.toOvr} OVR).
            </p>
            {event.kind === "callup" && (
              <p className="relative mt-2 text-xs text-[#fda4af]">
                Silver tier — official Call-up to the Show.
              </p>
            )}
            {(event.toTier === "elite" || event.toTier === "legend") && (
              <p className="relative mt-2 text-xs text-[var(--ice)]">
                Foil frame unlocked. Card style nudged toward a foil-friendly rink.
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="jersey-cta relative mt-6 w-full py-3 text-[11px]"
            >
              Rip the pack
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
