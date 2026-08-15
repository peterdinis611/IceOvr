"use client";

import { motion } from "motion/react";
import type { ScoutCard } from "@/lib/types";
import { getGitHubTrophies } from "@/lib/trophies";

const ACCENT: Record<ReturnType<typeof getGitHubTrophies>[number]["accent"], { text: string; border: string; glow: string }> = {
  cyan: { text: "#7dd3fc", border: "rgba(125,211,252,.28)", glow: "rgba(125,211,252,.13)" },
  gold: { text: "#fde68a", border: "rgba(253,230,138,.28)", glow: "rgba(253,230,138,.13)" },
  violet: { text: "#c4b5fd", border: "rgba(196,181,253,.28)", glow: "rgba(196,181,253,.13)" },
  green: { text: "#86efac", border: "rgba(134,239,172,.28)", glow: "rgba(134,239,172,.13)" },
  red: { text: "#fda4af", border: "rgba(253,164,175,.28)", glow: "rgba(253,164,175,.13)" },
  orange: { text: "#fdba74", border: "rgba(253,186,116,.28)", glow: "rgba(253,186,116,.13)" },
  silver: { text: "#d1d5db", border: "rgba(209,213,219,.28)", glow: "rgba(209,213,219,.13)" },
};

export function GitHubTrophies({ card }: { card: ScoutCard }) {
  const trophies = getGitHubTrophies(card);

  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">GitHub Cups</p>
          <p className="mt-0.5 text-xs text-[#94a3b8]">IceOVR achievements calculated from public GitHub activity</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
          {trophies.length} unlocked
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {trophies.map((trophy, index) => {
          const accent = ACCENT[trophy.accent];
          return (
            <motion.div
              key={trophy.id}
              className="flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2.5"
              style={{ borderColor: accent.border, background: `linear-gradient(135deg, ${accent.glow}, transparent 75%)` }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.74 + index * 0.06 }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                style={{ color: accent.text, borderColor: accent.border, boxShadow: `0 0 18px ${accent.glow}` }}
              >
                <TrophyCup />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold" style={{ color: accent.text }}>{trophy.title}</p>
                <p className="mt-0.5 truncate text-[10px] text-[#94a3b8]">{trophy.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 text-[10px] leading-relaxed text-[#64748b]">
        GitHub Cups are IceOVR&apos;s own achievement system. They are based on public GitHub API signals and are not official GitHub awards.
      </p>
    </section>
  );
}

function TrophyCup() {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" fill="none" aria-hidden>
      <path d="M11 6h18v8c0 6-3.7 10.4-9 11.7C14.7 24.4 11 20 11 14V6Z" fill="currentColor" opacity=".9" />
      <path d="M11 10H6v3c0 4 2.7 7 7 7M29 10h5v3c0 4-2.7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M20 26v5M14 35h12M16 31h8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M15 10h10" stroke="white" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
