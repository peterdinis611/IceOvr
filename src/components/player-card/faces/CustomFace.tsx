"use client";

import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { CardFrame } from "../CardFrame";
import { CardPortrait } from "../CardPortrait";
import {
  DEFAULT_CUSTOM_THEME,
  resolveCustomVisual,
  type CustomCardTheme,
} from "../customTheme";
import {
  attributeScore,
  CARD_STATS,
  formatStat,
  GitHubMark,
} from "../shared";
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
  customTheme?: CustomCardTheme;
};

export function CustomFront({
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
  customTheme = DEFAULT_CUSTOM_THEME,
}: FaceProps) {
  const visual = resolveCustomVisual(customTheme, tier.toUpperCase());

  return (
    <CardFrame tier={tier} style="custom" customTheme={customTheme}>
      <div
        className="relative z-10 flex h-full flex-col px-3 pb-3 pt-3"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          color: visual.ink,
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="px-2 py-1"
            style={{
              background: visual.ovrFill,
              color: "#0a0a0a",
              boxShadow: `0 0 18px ${visual.glow}`,
            }}
          >
            <CountUp
              value={Math.round(rating)}
              className="block font-black leading-none tabular-nums"
              style={{
                fontSize: 40,
                fontFamily: "var(--font-display), Impact, sans-serif",
                letterSpacing: "-0.05em",
              }}
            />
            <span className="text-[8px] font-black tracking-[0.2em]">OVR</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="px-2 py-0.5 text-[9px] font-black tracking-[0.14em]"
              style={{
                background: visual.accent,
                color: "#0a0a0a",
              }}
            >
              {visual.label}
            </span>
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 text-[7px] font-black tracking-[0.14em]"
              style={{ border: `1px solid ${visual.border}`, color: visual.muted }}
            >
              <GitHubMark size={10} />
              {visual.stock}
            </span>
          </div>
        </div>

        <div className="relative mt-2.5 flex-1">
          {visual.photo === "circle" ? (
            <div className="flex h-full items-center justify-center">
              <div
                className="relative h-[128px] w-[128px] overflow-hidden rounded-full border-[3px]"
                style={{
                  borderColor: visual.accent,
                  boxShadow: `0 0 24px ${visual.glow}`,
                }}
              >
                <CardPortrait
                  src={avatarUrl}
                  alt={displayName}
                  sizes="128px"
                  priority={!compact}
                />
              </div>
            </div>
          ) : visual.photo === "stamp" ? (
            <div
              className="absolute inset-0 overflow-hidden border-4"
              style={{ borderColor: visual.accent, background: "#0a0908" }}
            >
              <CardPortrait
                src={avatarUrl}
                alt={displayName}
                sizes={compact ? "180px" : "240px"}
                priority={!compact}
                imageClassName="grayscale contrast-125"
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 overflow-hidden border-2"
              style={{
                borderColor: visual.secondary,
                boxShadow: `inset 0 0 0 1px ${visual.border}`,
              }}
            >
              <CardPortrait
                src={avatarUrl}
                alt={displayName}
                sizes={compact ? "180px" : "240px"}
                priority={!compact}
              />
            </div>
          )}
        </div>

        <div
          className="mt-2 px-2 py-1.5 text-center"
          style={{
            background: `linear-gradient(90deg, ${visual.secondary}33, ${visual.accent}55, ${visual.secondary}33)`,
            border: `1px solid ${visual.border}`,
          }}
        >
          <p className="truncate font-display text-[17px] leading-none tracking-[0.06em]">
            {displayName}
          </p>
          <p className="mt-0.5 text-[9px] font-bold tracking-[0.14em]" style={{ color: visual.muted }}>
            @{username}
          </p>
        </div>

        <div className="mt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[8px] font-black tracking-[0.18em]" style={{ color: visual.muted }}>
              ATTRIBUTES
            </span>
            {(teamIconUrl || teamLabel) && (
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-black tracking-[0.1em]"
                style={{ color: visual.accent, border: `1px solid ${visual.border}` }}
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
                className="px-1.5 py-1"
                style={{
                  background: visual.panel,
                  border: `1px solid ${visual.border}`,
                }}
              >
                <span
                  className="block truncate text-[7px] font-bold uppercase tracking-[0.04em]"
                  style={{ color: visual.muted }}
                >
                  {stat.label}
                </span>
                <span
                  className="mt-0.5 block font-black leading-none tabular-nums"
                  style={{ color: visual.accent, fontSize: 17 }}
                >
                  {attributeScore(stats[stat.key], stat.max)}
                </span>
              </div>
            ))}
            <div
              className="px-1.5 py-1"
              style={{ background: visual.panel, border: `1px solid ${visual.border}` }}
            >
              <span className="text-[7px] font-bold uppercase tracking-[0.08em]" style={{ color: visual.muted }}>
                Stock
              </span>
              <span className="block text-[11px] font-black leading-none" style={{ color: visual.accent }}>
                {visual.stock}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

export function CustomBack({
  username,
  displayName,
  stats,
  tier,
  teamLabel,
  customTheme = DEFAULT_CUSTOM_THEME,
}: Pick<
  FaceProps,
  "username" | "displayName" | "stats" | "tier" | "teamLabel" | "customTheme"
>) {
  const visual = resolveCustomVisual(customTheme, tier.toUpperCase());

  return (
    <CardFrame tier={tier} style="custom" customTheme={customTheme}>
      <div
        className="relative z-10 flex h-full flex-col p-3.5"
        style={{ color: visual.ink }}
      >
        <div
          className="px-2 py-1 text-center text-[9px] font-black tracking-[0.2em]"
          style={{ background: visual.accent, color: "#0a0a0a" }}
        >
          STUDIO · REVERSE
        </div>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[0.06em]">{displayName}</h3>
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
            <div
              key={label}
              className="px-2 py-1.5"
              style={{ background: visual.panel, border: `1px solid ${visual.border}` }}
            >
              <p className="text-[7px] font-black uppercase tracking-[0.12em]" style={{ color: visual.muted }}>
                {label}
              </p>
              <p className="mt-0.5 truncate text-sm font-black">{value}</p>
            </div>
          ))}
        </div>
        <p
          className="mt-auto border-t pt-3 text-center text-[8px] font-black uppercase tracking-[0.18em]"
          style={{ borderColor: visual.border, color: visual.muted }}
        >
          Custom Studio · {visual.stock}
        </p>
      </div>
    </CardFrame>
  );
}
