"use client";

import type { ReactNode } from "react";
import type { CardTier } from "./types";
import { TIER_VISUAL } from "./tierStyles";

export function CardFrame({
  tier,
  children,
  className = "",
}: {
  tier: CardTier;
  children: ReactNode;
  className?: string;
}) {
  const visual = TIER_VISUAL[tier];
  const isLegend = tier === "legend";
  const isElite = tier === "elite";

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[16px] p-[5px] ${className}`}
      style={{
        background: visual.frame,
        backgroundSize: isLegend ? "300% 300%" : undefined,
        animation: isLegend ? "iceovr-holo 6s linear infinite" : undefined,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.4)`,
      }}
    >
      {isLegend && (
        <style>{`
          @keyframes iceovr-holo {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes iceovr-holo-sheen {
            0% { transform: translateX(-120%) skewX(-18deg); }
            100% { transform: translateX(220%) skewX(-18deg); }
          }
        `}</style>
      )}

      {/* Bevel highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[3px] rounded-[13px]"
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.45) 0%, transparent 32%, transparent 68%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div
        className="relative h-full w-full overflow-hidden rounded-[11px]"
        style={{ background: visual.inner }}
      >
        {/* Elite diagonal light bars */}
        {isElite && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
            <div className="absolute -left-1/4 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-1/4 -rotate-12 bg-gradient-to-l from-transparent via-violet-400/20 to-transparent" />
          </div>
        )}

        {/* Legend particle / noise texture */}
        {isLegend && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 0.6px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 0.6px), radial-gradient(circle at 40% 80%, #fff 0.4px, transparent 0.5px)",
              backgroundSize: "48px 48px, 36px 36px, 28px 28px",
            }}
          />
        )}

        {/* Ornamental corners (legend) */}
        {isLegend && (
          <>
            <Corner className="left-1.5 top-1.5" />
            <Corner className="right-1.5 top-1.5 rotate-90" />
            <Corner className="bottom-1.5 left-1.5 -rotate-90" />
            <Corner className="bottom-1.5 right-1.5 rotate-180" />
          </>
        )}

        {children}
      </div>
    </div>
  );
}

function Corner({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute h-4 w-4 border-l-2 border-t-2 border-amber-200/70 ${className}`}
    />
  );
}
