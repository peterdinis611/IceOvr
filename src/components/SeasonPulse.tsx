"use client";

import type { ScoutCard } from "@/lib/types";
import { getMilestone, getSeasonForm } from "@/lib/season";

export function SeasonPulse({ card }: { card: ScoutCard }) {
  const season = getSeasonForm(card.contributionWeeks);
  const milestone = getMilestone(card);
  const tone =
    season.direction === "rising"
      ? "#86efac"
      : season.direction === "falling"
        ? "#fda4af"
        : "#7dd3fc";
  const copy =
    season.direction === "rising"
      ? "Form is climbing"
      : season.direction === "falling"
        ? "Form has cooled"
        : "Form is holding steady";

  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3.5 sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#7dd3fc]">
            Live season
          </p>
          <h3 className="mt-0.5 font-display text-xl tracking-[.08em] text-white">
            FORM CHECK
          </h3>
        </div>
        <span
          className="rounded border px-2 py-1 text-[9px] font-black uppercase tracking-[.14em]"
          style={{ borderColor: `${tone}55`, color: tone }}
        >
          {copy}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <SeasonMetric
          label="Last 30 days"
          value={season.current.toLocaleString()}
        />
        <SeasonMetric
          label="vs. prior 30"
          value={`${season.delta >= 0 ? "+" : ""}${season.delta.toLocaleString()}`}
          color={tone}
        />
        <SeasonMetric label="Active streak" value={`${season.streak}d`} />
      </div>
      {milestone && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between gap-3 text-[10px]">
            <span className="font-bold text-[#fde68a]">{milestone.title}</span>
            <span className="shrink-0 text-[#94a3b8]">
              {milestone.progress}%
            </span>
          </div>
          <p className="mt-1 text-[10px] text-[#94a3b8]">{milestone.detail}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#fde68a]"
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function SeasonMetric({
  label,
  value,
  color = "#fff",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg bg-white/[.035] px-2.5 py-2">
      <p className="text-[8px] font-bold uppercase tracking-[.12em] text-[#64748b]">
        {label}
      </p>
      <p className="mt-1 font-display text-xl tracking-wide" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
