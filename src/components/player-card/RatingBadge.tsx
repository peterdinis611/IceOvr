"use client";

import type { CardTier } from "./types";
import { TIER_VISUAL } from "./tierStyles";

export function RatingBadge({
  rating,
  position,
  tier,
  compact = false,
}: {
  rating: number;
  position: string;
  tier: CardTier;
  compact?: boolean;
}) {
  const visual = TIER_VISUAL[tier];
  const shortPos = shortenPosition(position);

  return (
    <div className="flex flex-col items-start gap-1">
      <div
        className="relative flex items-center justify-center font-black text-[#0a0908]"
        style={{
          width: compact ? 56 : 72,
          height: compact ? 56 : 72,
          background: visual.ovrFill,
          clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
          boxShadow: `0 4px 14px ${visual.glow}`,
          fontSize: compact ? 26 : 34,
          fontFamily: "var(--font-display), Impact, sans-serif",
          lineHeight: 1,
        }}
        title="Overall rating"
      >
        {Math.round(rating)}
      </div>
      <div
        className="min-w-[2.5rem] px-1.5 py-0.5 text-center text-white shadow-md"
        style={{
          fontSize: compact ? 10 : 12,
          fontFamily: "var(--font-display), Impact, sans-serif",
          letterSpacing: "0.08em",
          background: "linear-gradient(180deg, #222, #080808)",
          border: `1px solid ${visual.accent}88`,
          boxShadow: `0 0 10px ${visual.glow}`,
        }}
        title={position}
      >
        {shortPos}
      </div>
    </div>
  );
}

function shortenPosition(position: string): string {
  const map: Record<string, string> = {
    Frontend: "FE",
    Backend: "BE",
    "Full Stack": "FS",
    DevOps: "OPS",
    Mobile: "MOB",
    Data: "DATA",
    Systems: "SYS",
  };
  if (map[position]) return map[position];
  if (position.length <= 4) return position.toUpperCase();
  return position.slice(0, 3).toUpperCase();
}
