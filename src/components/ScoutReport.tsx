"use client";

import { motion } from "motion/react";
import type { ScoutCard } from "@/lib/types";
import { STAT_LABELS, TIER_META } from "@/lib/tiers";
import { CountUp } from "@/components/CountUp";
import { GitHubTrophies } from "@/components/GitHubTrophies";
import { ScoutingInsights } from "@/components/ReportInsights";
import { SeasonPulse } from "@/components/SeasonPulse";
import { FlagBadge, LanguageBadge } from "@/components/Badges";
import { RatingMethodologyButton } from "@/components/RatingMethodology";

export function ScoutReport({ card }: { card: ScoutCard }) {
  const tier = TIER_META[card.tier];

  return (
    <motion.section
      className="relative overflow-hidden rounded-[22px] border border-[#7dd3fc]/15 bg-[linear-gradient(145deg,rgba(12,30,47,.96),rgba(6,17,30,.94))] p-5 shadow-[0_20px_60px_rgba(0,0,0,.2)] backdrop-blur-md sm:p-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
    >
      <div className="absolute inset-x-0 top-0 h-px broadcast-stripe" />
      <div
        aria-hidden
        className="absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl"
        style={{ background: `${tier.accent}18` }}
      />

      <div className="relative mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div className="min-w-0 flex-1">
          <motion.p
            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7dd3fc]"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Scouting department · live dossier
          </motion.p>
          <h2 className="mt-1 truncate font-display text-3xl tracking-[0.1em] text-white sm:text-4xl">
            SCOUTING REPORT
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#94a3b8]">
            <span>Projection: {card.archetype}</span>
            <FlagBadge code={card.countryCode} />
            <LanguageBadge language={card.topLanguage} />
          </p>
          <div className="mt-3">
            <RatingMethodologyButton card={card} />
          </div>
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/25">
          <div className="border-r border-white/10 px-3 py-2.5 text-right">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
              Scout grade
            </p>
            <p
              className="mt-1 font-display text-lg tracking-[.14em]"
              style={{ color: tier.accent }}
            >
              {tier.label}
            </p>
          </div>
          <div className="px-3 py-2.5 text-right">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
              Projection
            </p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#7dd3fc]">
              Core roster
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_LABELS.map((stat, i) => {
          const value = card.stats[stat.key];
          const pct = Math.max(4, ((value - 40) / 59) * 100);
          return (
            <motion.div
              key={stat.key}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-black/25 p-3.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${tier.accent}88, transparent)`,
                }}
              />
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.18em] text-[#94a3b8]">
                  {stat.short} · {stat.name}
                </span>
                <CountUp
                  value={value}
                  className="font-display text-2xl text-white"
                />
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full origin-left rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, #38bdf8, ${tier.accent})`,
                    boxShadow: `0 0 12px ${tier.accent}88`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.45 + i * 0.08,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <SeasonPulse card={card} />

      <ScoutingInsights card={card} />

      <div className="mb-5 mt-5">
        <GitHubTrophies card={card} />
      </div>

      <div className="grid gap-2 text-sm text-[#cbd5e1] sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Stars"
          value={card.raw.stars.toLocaleString()}
          delay={0.7}
        />
        <Metric
          label="Commits (yr)"
          value={card.raw.commitsLastYear.toLocaleString()}
          delay={0.76}
        />
        <Metric
          label="Followers"
          value={card.raw.followers.toLocaleString()}
          delay={0.82}
        />
        <Metric
          label="Account years"
          value={String(card.raw.accountYears)}
          delay={0.88}
        />
        <Metric
          label="PRs"
          value={card.raw.pullRequests.toLocaleString()}
          delay={0.94}
        />
        <Metric
          label="Issues"
          value={card.raw.issues.toLocaleString()}
          delay={1.0}
        />
        <Metric
          label="Reviews (est.)"
          value={card.raw.reviews.toLocaleString()}
          delay={1.06}
        />
        <Metric
          label="Languages"
          value={String(card.raw.languageCount)}
          delay={1.12}
        />
      </div>

      {card.bio && (
        <motion.p
          className="mt-6 border-t border-white/10 pt-4 text-sm leading-relaxed text-[#94a3b8]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {card.bio}
        </motion.p>
      )}
    </motion.section>
  );
}

function Metric({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 transition hover:border-[#38bdf8]/35 hover:bg-black/35"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#64748b]">
        {label}
      </p>
      <p className="mt-0.5 font-bold tabular-nums text-white">{value}</p>
    </motion.div>
  );
}
