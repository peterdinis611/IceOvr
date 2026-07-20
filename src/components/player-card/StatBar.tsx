"use client";

import type { LucideIcon } from "lucide-react";
import type { CardTier } from "./types";
import { TIER_VISUAL } from "./tierStyles";

export function StatBar({
  label,
  value,
  max,
  icon: Icon,
  tier,
  compact = false,
}: {
  label: string;
  value: number;
  max: number;
  icon: LucideIcon;
  tier: CardTier;
  compact?: boolean;
}) {
  const visual = TIER_VISUAL[tier];
  const pct = Math.max(4, Math.min(100, (value / Math.max(1, max)) * 100));
  const display = formatStat(value);

  return (
    <div className={`flex items-center gap-2 ${compact ? "gap-1.5" : "gap-2"}`}>
      <Icon
        className={`shrink-0 ${visual.textMuted}`}
        size={compact ? 12 : 14}
        strokeWidth={2.2}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-baseline justify-between gap-1">
          <span
            className={`font-semibold uppercase tracking-[0.14em] ${visual.textMuted}`}
            style={{ fontSize: compact ? 8 : 9 }}
          >
            {label}
          </span>
          <span
            className="font-bold tabular-nums text-white"
            style={{ fontSize: compact ? 10 : 11 }}
          >
            {display}
          </span>
        </div>
        <div className={`h-1.5 overflow-hidden rounded-full ${visual.barTrack}`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${visual.barFill}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
