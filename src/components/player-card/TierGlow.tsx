import type { CardTier } from "./types";
import { isFoilTier, TIER_VISUAL } from "./tierStyles";

/** Soft cardboard halo — stronger only for foil tiers. */
export function TierGlow({
  tier,
  active = false,
}: {
  tier: CardTier;
  active?: boolean;
}) {
  const visual = TIER_VISUAL[tier];
  const foil = isFoilTier(tier);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-2 transition-opacity duration-300"
      style={{
        borderRadius: 6,
        opacity: active ? (foil ? 0.9 : 0.55) : foil ? 0.5 : 0.22,
        background: `radial-gradient(ellipse at center, ${visual.glow}, transparent 72%)`,
        filter: active ? "blur(8px)" : "blur(12px)",
      }}
    />
  );
}
