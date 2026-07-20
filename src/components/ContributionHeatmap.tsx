"use client";

import { motion } from "motion/react";
import type { ContributionWeek } from "@/lib/contributions";

const LEVEL_COLORS = [
  "bg-[#161b22]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
] as const;

export function ContributionHeatmap({
  weeks,
  total,
  compact = false,
}: {
  weeks: ContributionWeek[];
  total: number;
  compact?: boolean;
}) {
  const shown = weeks.slice(- (compact ? 26 : 52));

  return (
    <div className={compact ? "" : "rounded-2xl border border-white/10 bg-black/25 p-4"}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#64748b]">
            Contributions
          </p>
          <p className="mt-0.5 text-sm text-[#cbd5e1]">
            <span className="font-semibold text-white">{total.toLocaleString()}</span>
            {" "}in the last year
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#64748b]">
          <span>Less</span>
          {LEVEL_COLORS.map((c) => (
            <span key={c} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-[3px]">
          {shown.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <motion.span
                  key={`${day.date}-${di}`}
                  title={`${day.date}: ${day.count} contributions`}
                  className={`h-[10px] w-[10px] rounded-[2px] ${LEVEL_COLORS[day.level]}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(0.8, (wi * 7 + di) * 0.002) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
