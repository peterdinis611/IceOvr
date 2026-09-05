import type { ReactNode } from "react";
import type { CardStyleId } from "./cardStyles";
import type { CardTier } from "./types";
import {
  ARENA_TIER_VISUAL,
  BRUTAL_TIER_VISUAL,
  isFoilTier,
  TIER_STRIPES,
  TIER_VISUAL,
} from "./tierStyles";

export function CardFrame({
  tier,
  style = "retro",
  children,
  className = "",
}: {
  tier: CardTier;
  style?: CardStyleId;
  children: ReactNode;
  className?: string;
}) {
  if (style === "arena") return <ArenaFrame tier={tier} className={className}>{children}</ArenaFrame>;
  if (style === "brutal") return <BrutalFrame tier={tier} className={className}>{children}</BrutalFrame>;
  return <RetroFrame tier={tier} className={className}>{children}</RetroFrame>;
}

function RetroFrame({
  tier,
  children,
  className = "",
}: {
  tier: CardTier;
  children: ReactNode;
  className?: string;
}) {
  const visual = TIER_VISUAL[tier];
  const foil = isFoilTier(tier);
  const [stripeA, stripeB] = TIER_STRIPES[tier];

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        borderRadius: 4,
        padding: foil ? 5 : 4,
        background: visual.frame,
        backgroundSize: foil ? "280% 280%" : undefined,
        animation: foil ? "retro-foil-shift 7s linear infinite" : undefined,
        boxShadow: foil
          ? `inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.2)`
          : `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.18)`,
      }}
    >
      {foil && (
        <style>{`
          @keyframes retro-foil-shift {
            0% { background-position: 0% 40%; }
            50% { background-position: 100% 60%; }
            100% { background-position: 0% 40%; }
          }
        `}</style>
      )}

      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: 2,
          background: visual.inner,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: `repeating-linear-gradient(-32deg, transparent 0 14px, ${stripeA}33 14px 22px, transparent 22px 36px, ${stripeB}28 36px 42px)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 28px rgba(90,60,30,0.12), inset 0 0 2px rgba(0,0,0,0.2)" }}
        />
        {foil && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.55) 48%, transparent 62%)",
              backgroundSize: "200% 200%",
              animation: "retro-foil-shift 4.5s ease-in-out infinite",
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
}

function ArenaFrame({
  tier,
  children,
  className = "",
}: {
  tier: CardTier;
  children: ReactNode;
  className?: string;
}) {
  const visual = ARENA_TIER_VISUAL[tier];
  const foil = isFoilTier(tier);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[14px] p-[5px] ${className}`}
      style={{
        background: visual.frame,
        backgroundSize: foil ? "240% 240%" : undefined,
        animation: foil ? "retro-foil-shift 8s linear infinite" : undefined,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[10px]"
        style={{ background: visual.inner }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 49%, rgba(225,29,46,0.18) 49.5%, rgba(225,29,46,0.18) 50.5%, transparent 51%), radial-gradient(circle at 50% 38%, transparent 20%, rgba(125,211,252,0.08) 21%, transparent 22%)",
          }}
        />
        {children}
      </div>
    </div>
  );
}

function BrutalFrame({
  tier,
  children,
  className = "",
}: {
  tier: CardTier;
  children: ReactNode;
  className?: string;
}) {
  const visual = BRUTAL_TIER_VISUAL[tier];

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        borderRadius: 0,
        padding: 4,
        background: visual.frame,
        boxShadow: `4px 4px 0 #000, inset 0 0 0 1px rgba(0,0,0,0.4)`,
      }}
    >
      <div className="relative h-full w-full overflow-hidden" style={{ background: visual.inner }}>
        {children}
      </div>
    </div>
  );
}
