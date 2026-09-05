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
import { BRUTAL_TIER_VISUAL } from "../tierStyles";
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

export function BrutalFront({
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
}: FaceProps) {
  const visual = BRUTAL_TIER_VISUAL[tier];

  return (
    <CardFrame tier={tier} style="brutal">
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
          className="flex items-stretch border-b-4"
          style={{ borderColor: visual.accent }}
        >
          <div
            className="flex min-w-[88px] flex-col items-center justify-center px-2 py-2 text-[#0a0908]"
            style={{ background: visual.ovrFill }}
          >
            <CountUp
              value={Math.round(rating)}
              className="block font-black leading-none tabular-nums"
              style={{
                fontSize: 48,
                fontFamily: "var(--font-display), Impact, sans-serif",
                letterSpacing: "-0.06em",
              }}
            />
            <span className="text-[9px] font-black tracking-[0.24em]">OVR</span>
          </div>
          <div className="flex flex-1 flex-col justify-between border-l-4 border-[#0a0908] bg-[#111] px-2.5 py-2">
            <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: visual.accent }}>
              {visual.label}
            </span>
            <span className="flex items-center gap-1 text-[8px] font-black tracking-[0.16em] text-white">
              <GitHubMark size={11} />
              PUCK STAMP
            </span>
          </div>
        </div>

        <div className="relative mx-0 flex-1 border-b-4 border-[#0a0908]" style={{ background: visual.accent }}>
          <div className="absolute inset-2 overflow-hidden bg-[#0a0908]">
            <Image
              src={avatarUrl.includes("?") ? `${avatarUrl}&size=320` : `${avatarUrl}?size=320`}
              alt={displayName}
              fill
              sizes={compact ? "180px" : "240px"}
              priority={!compact}
              className="object-cover object-top grayscale contrast-125"
              draggable={false}
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-30 mix-blend-multiply"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.35) 3px, rgba(0,0,0,.35) 4px)",
              }}
            />
          </div>
        </div>

        <div className="border-b-4 border-[#0a0908] bg-white px-3 py-2 text-[#0a0908]">
          <p className="truncate font-display text-[18px] leading-none tracking-[0.04em]">{displayName}</p>
          <p className="mt-1 text-[9px] font-black tracking-[0.14em] text-[#0a0908]/60">@{username}</p>
        </div>

        <div className="bg-[#0a0908] px-2.5 py-2.5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[8px] font-black tracking-[0.18em] text-white/50">STATS</span>
            {(teamIconUrl || teamLabel) && (
              <span className="flex items-center gap-1 text-[8px] font-black tracking-[0.1em]" style={{ color: visual.accent }}>
                {teamIconUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teamIconUrl} alt={teamLabel ?? ""} width={12} height={12} />
                )}
                {teamLabel?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {CARD_STATS.map((stat) => (
              <div key={stat.key} className="border border-white/15 px-1 py-1">
                <span className="block truncate text-[6px] font-bold uppercase tracking-[0.06em] text-white/40">
                  {stat.label}
                </span>
                <span className="block font-black tabular-nums leading-none" style={{ color: visual.accent, fontSize: 16 }}>
                  {attributeScore(stats[stat.key], stat.max)}
                </span>
                <span className="sr-only">{formatStat(stats[stat.key])}</span>
              </div>
            ))}
            <div className="border border-white/15 px-1 py-1">
              <span className="block text-[6px] font-bold uppercase tracking-[0.06em] text-white/40">Cut</span>
              <span className="block text-[12px] font-black leading-none text-white">RAW</span>
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

export function BrutalBack({
  username,
  displayName,
  stats,
  tier,
  teamLabel,
}: Pick<FaceProps, "username" | "displayName" | "stats" | "tier" | "teamLabel">) {
  const visual = BRUTAL_TIER_VISUAL[tier];

  return (
    <CardFrame tier={tier} style="brutal">
      <div className="relative z-10 flex h-full flex-col bg-[#0a0908] p-3 text-white">
        <div
          className="border-4 px-2 py-1 text-center text-[10px] font-black tracking-[0.24em] text-[#0a0908]"
          style={{ background: visual.accent, borderColor: visual.accent }}
        >
          REVERSE STAMP
        </div>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[0.04em]">{displayName}</h3>
        <p className="mt-1 text-[10px] font-black tracking-[0.14em]" style={{ color: visual.accent }}>
          @{username}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-1">
          {[
            ["Commits", formatStat(stats.commits)],
            ["Stars", formatStat(stats.stars)],
            ["PRs", formatStat(stats.prs)],
            ["Streak", `${stats.streak}d`],
            ["Repos", formatStat(stats.repos)],
            ["Language", teamLabel || "—"],
          ].map(([label, value]) => (
            <div key={label} className="border-2 border-white/20 px-2 py-1.5">
              <p className="text-[7px] font-black uppercase tracking-[0.12em] text-white/40">{label}</p>
              <p className="mt-0.5 truncate text-sm font-black">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-auto border-t-2 border-white/20 pt-3 text-center text-[8px] font-black uppercase tracking-[0.2em] text-white/40">
          Puck Stamp · {visual.label}
        </p>
      </div>
    </CardFrame>
  );
}
