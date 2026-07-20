"use client";

import type { CardTier } from "./types";
import { TIER_VISUAL } from "./tierStyles";

/** Soft outer aura that intensifies on hover (parent group). */
export function TierGlow({
  tier,
  active = false,
}: {
  tier: CardTier;
  active?: boolean;
}) {
  const visual = TIER_VISUAL[tier];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-3 rounded-[22px] transition-opacity duration-300"
      style={{
        opacity: active ? 0.95 : tier === "gold" || tier === "elite" || tier === "legend" ? 0.55 : 0.35,
        background: `radial-gradient(ellipse at center, ${visual.glow}, transparent 70%)`,
        filter: active ? "blur(10px)" : "blur(14px)",
      }}
    />
  );
}
