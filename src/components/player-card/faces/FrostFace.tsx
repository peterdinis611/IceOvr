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
import { FROST_TIER_VISUAL, isFoilTier } from "../tierStyles";
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

export function FrostFront({
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
  const visual = FROST_TIER_VISUAL[tier];
  const foil = isFoilTier(tier);

  return (
    <CardFrame tier={tier} style="frost">
      {foil && hover && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden card-holo-active">
          <div className="card-holo absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
      )}

      <div
        className="relative z-10 flex h-full flex-col px-3 pb-3 pt-3"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <CountUp
              value={Math.round(rating)}
              className="block font-black leading-none tracking-[-0.06em] text-slate-800"
              style={{
                fontSize: 52,
                fontFamily: "var(--font-display), Impact, sans-serif",
                textShadow: "0 1px 0 rgba(255,255,255,0.8)",
              }}
            />
            <p className="mt-0.5 text-[9px] font-black tracking-[0.28em]" style={{ color: visual.accent }}>
              OVR
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="rounded-full border border-white/70 bg-white/55 px-2.5 py-0.5 text-[9px] font-black tracking-[0.16em] text-slate-700 backdrop-blur-sm"
              style={{ boxShadow: `0 0 16px ${visual.glow}` }}
            >
              {visual.label}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-slate-800/10 px-2 py-0.5 text-[7px] font-black tracking-[0.14em] text-slate-600">
              <GitHubMark size={10} />
              ICE GLASS
            </span>
          </div>
        </div>

        <div className="relative mx-auto mt-2 h-[132px] w-[132px]">
          <div
            aria-hidden
            className="absolute -inset-2 rounded-[28px] opacity-70 blur-md"
            style={{ background: `radial-gradient(circle, ${visual.accent}55, transparent 70%)` }}
          />
          <div
            className="relative h-full w-full overflow-hidden rounded-[22px] border border-white/80"
            style={{
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.85), 0 10px 28px ${visual.glow}`,
              background: "rgba(255,255,255,0.35)",
            }}
          >
            <CardPortrait
              src={avatarUrl}
              alt={displayName}
              sizes="132px"
              priority={!compact}
            />
          </div>
        </div>

        <div className="mt-2.5 rounded-2xl border border-white/60 bg-white/45 px-2.5 py-2 text-center backdrop-blur-sm">
          <p className="truncate font-display text-[18px] leading-none tracking-[0.06em] text-slate-900">
            {displayName}
          </p>
          <p className="mt-1 text-[9px] font-bold tracking-[0.14em] text-slate-500">@{username}</p>
        </div>

        <div className="mt-2 flex-1">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[8px] font-black tracking-[0.18em] text-slate-500">ATTRIBUTES</span>
            {(teamIconUrl || teamLabel) && (
              <span
                className="flex items-center gap-1 rounded-full bg-white/50 px-1.5 py-0.5 text-[8px] font-black tracking-[0.1em]"
                style={{ color: visual.accent }}
              >
                {teamIconUrl && (
                  <Image src={teamIconUrl} alt={teamLabel ?? ""} width={12} height={12} unoptimized />
                )}
                {teamLabel?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {CARD_STATS.map((stat) => (
              <div
                key={stat.key}
                className="rounded-xl border border-white/55 bg-white/40 px-1.5 py-1 backdrop-blur-sm"
              >
                <span className="block truncate text-[7px] font-bold uppercase tracking-[0.04em] text-slate-500">
                  {stat.label}
                </span>
                <span
                  className="mt-0.5 block font-black leading-none tabular-nums"
                  style={{ color: visual.accent, fontSize: 17 }}
                >
                  {attributeScore(stats[stat.key], stat.max)}
                </span>
                <span className="sr-only">{formatStat(stats[stat.key])}</span>
              </div>
            ))}
            <div className="rounded-xl border border-white/55 bg-white/40 px-1.5 py-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-slate-500">Stock</span>
              <span className="block text-[12px] font-black leading-none" style={{ color: visual.accent }}>
                {foil ? "CRYSTAL" : "FROST"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

export function FrostBack({
  username,
  displayName,
  stats,
  tier,
  teamLabel,
}: Pick<FaceProps, "username" | "displayName" | "stats" | "tier" | "teamLabel">) {
  const visual = FROST_TIER_VISUAL[tier];

  return (
    <CardFrame tier={tier} style="frost">
      <div className="relative z-10 flex h-full flex-col p-3.5">
        <div
          className="rounded-full border border-white/70 bg-white/55 px-2 py-1 text-center text-[9px] font-black tracking-[0.2em] text-slate-700"
        >
          GLASS · REVERSE
        </div>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[0.06em] text-slate-900">
          {displayName}
        </h3>
        <p className="mt-1 text-[10px] font-bold tracking-[0.12em]" style={{ color: visual.accent }}>
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
            <div key={label} className="rounded-xl border border-white/55 bg-white/45 px-2 py-1.5">
              <p className="text-[7px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</p>
              <p className="mt-0.5 truncate text-sm font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-auto border-t border-slate-400/25 pt-3 text-center text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">
          Ice Glass · {visual.label}
        </p>
      </div>
    </CardFrame>
  );
}
