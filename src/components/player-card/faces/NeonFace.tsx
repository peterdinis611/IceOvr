"use client";

import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { CardFrame } from "../CardFrame";
import { CardPortrait } from "../CardPortrait";
import {
  attributeScore,
  CARD_STATS,
  formatStat,
  GitHubMark,
} from "../shared";
import { isFoilTier, NEON_TIER_VISUAL } from "../tierStyles";
import type { PlayerCardProps } from "../types";

type FaceProps = Pick<
  PlayerCardProps,
  | "username"
  | "avatarUrl"
  | "displayName"
  | "rating"
  | "stats"
  | "tier"
  | "teamLabel"
  | "teamIconUrl"
> & {
  compact: boolean;
  scale: number;
  hover: boolean;
};

export function NeonFront({
  username,
  avatarUrl,
  displayName,
  rating,
  stats,
  tier,
  teamLabel,
  teamIconUrl,
  compact,
  scale,
  hover,
}: FaceProps) {
  const visual = NEON_TIER_VISUAL[tier];
  const foil = isFoilTier(tier);

  return (
    <CardFrame tier={tier} style="neon">
      {foil && hover && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden card-holo-active">
          <div className="card-holo absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
        </div>
      )}

      <div
        className="relative z-10 flex h-full flex-col"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 2px, rgba(125,211,252,0.35) 2px 3px)",
          }}
        />

        <div className="relative flex items-start justify-between px-3 pt-3">
          <div>
            <CountUp
              value={Math.round(rating)}
              className="block font-black leading-[0.75] tracking-[-0.08em] text-white"
              style={{
                fontSize: 58,
                fontFamily: "var(--font-display), Impact, sans-serif",
                textShadow: `0 0 18px ${visual.glow}, 0 0 4px ${visual.accent}`,
              }}
            />
            <p
              className="mt-1 border-l-2 pl-1.5 text-[9px] font-black tracking-[0.28em]"
              style={{ borderColor: visual.accent, color: visual.accent }}
            >
              OVR
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="px-2 py-0.5 text-[10px] font-black tracking-[0.16em] text-black"
              style={{
                background: visual.accent,
                boxShadow: `0 0 18px ${visual.glow}`,
              }}
            >
              {visual.label}
            </span>
            <span className="flex items-center gap-1 border border-white/20 bg-black/60 px-1.5 py-0.5 text-[7px] font-black tracking-[0.16em] text-white/80">
              <GitHubMark size={10} />
              NEON RINK
            </span>
          </div>
        </div>

        <div className="relative mx-3 mt-2 flex-1 overflow-hidden border-2" style={{ borderColor: visual.accent, boxShadow: `0 0 20px ${visual.glow}` }}>
          <CardPortrait
            src={avatarUrl}
            alt={displayName}
            sizes={compact ? "180px" : "240px"}
            priority={!compact}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: visual.accent, boxShadow: `0 0 12px ${visual.accent}` }}
          />
        </div>

        <div className="relative mx-3 mt-2 border border-white/15 bg-black/55 px-2 py-1.5 text-center">
          <p
            className="truncate font-display text-[18px] leading-none tracking-[0.08em] text-white"
            style={{ textShadow: `0 0 12px ${visual.glow}` }}
          >
            {displayName}
          </p>
          <p className="mt-1 text-[9px] font-bold tracking-[0.16em]" style={{ color: visual.accent }}>
            @{username}
          </p>
        </div>

        <div className="relative mx-3 mb-3 mt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[8px] font-black tracking-[0.18em] text-white/45">ATTRIBUTES</span>
            {(teamIconUrl || teamLabel) && (
              <span
                className="flex items-center gap-1 border border-white/15 bg-black/50 px-1.5 py-0.5 text-[8px] font-black tracking-[0.1em]"
                style={{ color: visual.accent }}
              >
                {teamIconUrl && (
                  <Image src={teamIconUrl} alt={teamLabel ?? ""} width={12} height={12} unoptimized />
                )}
                {teamLabel?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {CARD_STATS.map((stat) => (
              <div key={stat.key} className="border border-white/12 bg-black/45 px-1.5 py-1">
                <span className="block truncate text-[7px] font-bold uppercase tracking-[0.04em] text-white/40">
                  {stat.label}
                </span>
                <span
                  className="mt-0.5 block font-black leading-none tabular-nums"
                  style={{ color: visual.accent, fontSize: 17, textShadow: `0 0 10px ${visual.glow}` }}
                >
                  {attributeScore(stats[stat.key], stat.max)}
                </span>
              </div>
            ))}
            <div className="border border-white/12 bg-black/45 px-1.5 py-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-white/40">Stock</span>
              <span className="block text-[12px] font-black leading-none text-white">
                {foil ? "ARC" : "NEON"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

export function NeonBack({
  username,
  displayName,
  stats,
  tier,
  teamLabel,
}: Pick<FaceProps, "username" | "displayName" | "stats" | "tier" | "teamLabel">) {
  const visual = NEON_TIER_VISUAL[tier];

  return (
    <CardFrame tier={tier} style="neon">
      <div className="relative z-10 flex h-full flex-col p-3.5 text-white">
        <div
          className="border px-2 py-1 text-center text-[9px] font-black tracking-[0.24em] text-black"
          style={{ background: visual.accent, boxShadow: `0 0 16px ${visual.glow}` }}
        >
          RINK · REVERSE
        </div>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[0.06em]">{displayName}</h3>
        <p className="mt-1 text-[10px] font-bold tracking-[0.14em]" style={{ color: visual.accent }}>
          @{username}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {[
            ["Commits", formatStat(stats.commits)],
            ["Stars", formatStat(stats.stars)],
            ["PRs", formatStat(stats.prs)],
            ["Streak", `${stats.streak}d`],
            ["Repos", formatStat(stats.repos)],
            ["Language", teamLabel || "—"],
          ].map(([label, value]) => (
            <div key={label} className="border border-white/15 bg-black/50 px-2 py-1.5">
              <p className="text-[7px] font-black uppercase tracking-[0.12em] text-white/40">{label}</p>
              <p className="mt-0.5 truncate text-sm font-black">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-auto border-t border-white/15 pt-3 text-center text-[8px] font-black uppercase tracking-[0.18em] text-white/40">
          Neon Rink · {visual.label}
        </p>
      </div>
    </CardFrame>
  );
}
