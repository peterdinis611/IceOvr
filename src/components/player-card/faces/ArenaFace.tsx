"use client";

import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { CardFrame } from "../CardFrame";
import {
  attributeScore,
  CARD_STATS,
  formatStat,
  GitHubMark,
} from "../shared";
import { ARENA_TIER_VISUAL, isFoilTier } from "../tierStyles";
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

export function ArenaFront({
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
  const visual = ARENA_TIER_VISUAL[tier];
  const foil = isFoilTier(tier);

  return (
    <CardFrame tier={tier} style="arena">
      {foil && hover && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden card-holo-active">
          <div className="card-holo absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      )}

      <div
        className="relative z-10 h-full"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <div className="absolute left-3 top-3 z-20">
          <CountUp
            value={Math.round(rating)}
            className="block font-black leading-[0.7] tracking-[-0.08em] text-white"
            style={{
              fontSize: 68,
              fontFamily: "var(--font-display), Impact, sans-serif",
              textShadow: `0 0 24px ${visual.glow}`,
            }}
          />
          <div
            className="mt-1 border-l-2 pl-1.5 text-[9px] font-bold tracking-[0.22em] text-white/70"
            style={{ borderColor: visual.accent }}
          >
            OVR
          </div>
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col items-end gap-1.5">
          <span
            className="rounded-sm px-2 py-0.5 text-[10px] font-black tracking-[0.14em] text-[#061018]"
            style={{ background: visual.accent }}
          >
            {visual.label}
          </span>
          <span className="flex items-center gap-1 rounded-sm border border-white/15 bg-black/55 px-1.5 py-0.5 text-[7px] font-black tracking-[0.16em] text-white/80">
            <GitHubMark size={10} />
            LIVE SCOUT
          </span>
        </div>

        <div
          className="absolute left-1/2 top-[72px] z-20 h-[128px] w-[128px] -translate-x-1/2 overflow-hidden rounded-full border-[3px]"
          style={{
            borderColor: visual.accent,
            boxShadow: `0 0 0 4px rgba(0,0,0,.35), 0 0 28px ${visual.glow}`,
            background: `radial-gradient(circle at 35% 25%, ${visual.accent}55, #061018 70%)`,
          }}
        >
          <Image
            src={avatarUrl.includes("?") ? `${avatarUrl}&size=264` : `${avatarUrl}?size=264`}
            alt={displayName}
            width={128}
            height={128}
            sizes="128px"
            priority={!compact}
            className="h-full w-full object-cover object-top"
            draggable={false}
          />
        </div>

        <div className="absolute inset-x-4 top-[214px] z-20 text-center">
          <p
            className="truncate font-display text-[20px] leading-none tracking-[0.06em] text-white"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,.6)" }}
          >
            {displayName}
          </p>
          <p className="mt-1 text-[9px] font-bold tracking-[0.18em] text-white/55">@{username}</p>
        </div>

        <div className="absolute inset-x-3 bottom-3 z-20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[8px] font-bold tracking-[0.16em] text-white/55">ATTRIBUTES</span>
            {(teamIconUrl || teamLabel) && (
              <span
                className="flex items-center gap-1 rounded-sm border border-white/15 bg-black/40 px-1.5 py-0.5 text-[8px] font-black tracking-[0.1em]"
                style={{ color: visual.accent }}
              >
                {teamIconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teamIconUrl} alt={teamLabel ?? ""} width={12} height={12} />
                )}
                {teamLabel?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-x-2 gap-y-2">
            {CARD_STATS.map((stat) => (
              <div key={stat.key} className="min-w-0 border-t pt-1" style={{ borderColor: `${visual.accent}44` }}>
                <span className="block truncate text-[7px] font-bold uppercase tracking-[0.04em] text-white/45">
                  {stat.label}
                </span>
                <span
                  className="mt-0.5 block font-black leading-none tabular-nums"
                  style={{ color: visual.accent, fontSize: 20, textShadow: `0 0 10px ${visual.glow}` }}
                >
                  {attributeScore(stats[stat.key], stat.max)}
                </span>
                <span className="sr-only">{formatStat(stats[stat.key])}</span>
              </div>
            ))}
            <div className="flex flex-col justify-end border-t pt-1" style={{ borderColor: `${visual.accent}44` }}>
              <span className="text-[7px] font-medium uppercase tracking-[0.06em] text-white/45">Edition</span>
              <span className="text-[13px] font-black leading-none" style={{ color: visual.accent }}>
                ARENA
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

export function ArenaBack({
  username,
  displayName,
  stats,
  tier,
  teamLabel,
}: Pick<FaceProps, "username" | "displayName" | "stats" | "tier" | "teamLabel">) {
  const visual = ARENA_TIER_VISUAL[tier];

  return (
    <CardFrame tier={tier} style="arena">
      <div className="relative z-10 flex h-full flex-col p-4">
        <p className="text-[9px] font-black uppercase tracking-[0.22em]" style={{ color: visual.accent }}>
          Scout reverse
        </p>
        <h3 className="mt-1 font-display text-2xl tracking-[0.08em] text-white">{displayName}</h3>
        <p className="mt-1 text-[10px] text-white/55">@{username}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            ["Commits", formatStat(stats.commits)],
            ["Stars", formatStat(stats.stars)],
            ["PRs", formatStat(stats.prs)],
            ["Streak", `${stats.streak}d`],
            ["Repos", formatStat(stats.repos)],
            ["Language", teamLabel || "—"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-2">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">{label}</p>
              <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-auto pt-4 text-[9px] uppercase tracking-[0.16em] text-white/40">
          Arena Night · {visual.label}
        </p>
      </div>
    </CardFrame>
  );
}
