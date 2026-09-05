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
import { isFoilTier, TIER_STRIPES, TIER_VISUAL } from "../tierStyles";
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

export function RetroFront({
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
  const visual = TIER_VISUAL[tier];
  const [stripeA, stripeB] = TIER_STRIPES[tier];
  const foil = isFoilTier(tier);

  return (
    <CardFrame tier={tier} style="retro">
      {foil && hover && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden card-holo-active">
          <div className="card-holo absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
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
        <div className="flex items-start justify-between gap-2 px-3 pt-3">
          <div
            className="flex flex-col items-center border-2 px-1.5 pb-1 pt-0.5 text-[#1a1208]"
            style={{
              borderColor: "#1a1208",
              background: visual.ovrFill,
              boxShadow: "2px 2px 0 rgba(0,0,0,0.25)",
            }}
          >
            <CountUp
              value={Math.round(rating)}
              className="block font-black leading-none tabular-nums"
              style={{
                fontSize: 42,
                fontFamily: "var(--font-display), Impact, sans-serif",
                letterSpacing: "-0.04em",
              }}
            />
            <span className="text-[8px] font-black tracking-[0.2em]">OVR</span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className="border-2 px-2 py-0.5 text-[10px] font-black tracking-[0.14em] text-[#1a1208]"
              style={{
                borderColor: "#1a1208",
                background: stripeB,
                boxShadow: "2px 2px 0 rgba(0,0,0,0.2)",
              }}
            >
              {visual.label}
            </span>
            <span className="flex items-center gap-1 border border-[#1a1208]/40 bg-white/70 px-1.5 py-0.5 text-[7px] font-black tracking-[0.16em] text-[#1a1208]">
              <GitHubMark size={10} />
              GITHUB ’96
            </span>
          </div>
        </div>

        <div className="relative mx-3 mt-2.5 flex-1">
          <div
            className="absolute inset-0 overflow-hidden border-[3px] border-white"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.35), 2px 3px 0 rgba(0,0,0,0.15)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${stripeA} 0 38%, ${stripeB} 38% 62%, ${stripeA} 62% 100%)`,
              }}
            />
            <div
              aria-hidden
              className="absolute -right-6 top-0 h-full w-16 -skew-x-12 opacity-40"
              style={{ background: stripeB }}
            />
            <div className="absolute inset-x-3 bottom-0 top-2 overflow-hidden border border-black/20 bg-[#1a1208]/10">
              <Image
                src={avatarUrl.includes("?") ? `${avatarUrl}&size=320` : `${avatarUrl}?size=320`}
                alt={displayName}
                fill
                sizes={compact ? "180px" : "240px"}
                priority={!compact}
                className="object-cover object-top"
                draggable={false}
                style={{ filter: "contrast(1.05) saturate(0.92)" }}
              />
            </div>
          </div>
        </div>

        <div
          className="mx-3 mt-2 border-2 border-[#1a1208] px-2 py-1.5 text-center text-white"
          style={{
            background: `linear-gradient(90deg, ${stripeA}, #1a1208 40%, #1a1208 60%, ${stripeB})`,
            boxShadow: "2px 2px 0 rgba(0,0,0,0.2)",
          }}
        >
          <p
            className="truncate font-display text-[17px] leading-none tracking-[0.06em]"
            style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.5)" }}
          >
            {displayName}
          </p>
          <p className="mt-0.5 text-[9px] font-bold tracking-[0.14em] text-white/75">@{username}</p>
        </div>

        <div className="mx-3 mb-3 mt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[8px] font-black tracking-[0.18em] text-[#1a1208]/55">ATTRIBUTES</span>
            {(teamIconUrl || teamLabel) && (
              <span
                className="flex items-center gap-1 border border-[#1a1208]/30 bg-white/50 px-1.5 py-0.5 text-[8px] font-black tracking-[0.1em]"
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
          <div className="grid grid-cols-3 gap-1.5">
            {CARD_STATS.map((stat) => (
              <div
                key={stat.key}
                className="min-w-0 border border-[#1a1208]/20 bg-white/45 px-1.5 py-1"
              >
                <span className="block truncate text-[7px] font-bold uppercase tracking-[0.04em] text-[#1a1208]/50">
                  {stat.label}
                </span>
                <span
                  className="mt-0.5 block font-black leading-none tabular-nums"
                  style={{ color: visual.accent, fontSize: 18 }}
                >
                  {attributeScore(stats[stat.key], stat.max)}
                </span>
                <span className="sr-only">{formatStat(stats[stat.key])}</span>
              </div>
            ))}
            <div className="flex flex-col justify-end border border-[#1a1208]/20 bg-white/40 px-1.5 py-1">
              <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#1a1208]/50">Stock</span>
              <span className="text-[12px] font-black leading-none" style={{ color: visual.accent }}>
                {foil ? "FOIL" : "MATTE"}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-[#1a1208]/15 pt-1.5">
            <span className="flex items-center gap-1 text-[8px] font-black tracking-[0.16em] text-[#1a1208]/70">
              <GitHubMark size={11} />
              SCOUT CARD
            </span>
            <span className="font-display text-[11px] tracking-[0.14em] text-[#1a1208]/55">ICEOVR</span>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

export function RetroBack({
  username,
  displayName,
  stats,
  tier,
  teamLabel,
}: Pick<FaceProps, "username" | "displayName" | "stats" | "tier" | "teamLabel">) {
  const visual = TIER_VISUAL[tier];
  const [, stripeB] = TIER_STRIPES[tier];
  const foil = isFoilTier(tier);

  return (
    <CardFrame tier={tier} style="retro">
      <div className="relative z-10 flex h-full flex-col p-3.5">
        <div
          className="border-2 border-[#1a1208] px-2 py-1 text-center text-[9px] font-black tracking-[0.2em] text-[#1a1208]"
          style={{ background: stripeB }}
        >
          LINEUP · REVERSE
        </div>
        <h3 className="mt-3 font-display text-2xl leading-none tracking-[0.06em]" style={{ color: "#1a1208" }}>
          {displayName}
        </h3>
        <p className="mt-1 text-[10px] font-bold tracking-[0.12em]" style={{ color: visual.accent }}>
          @{username}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <BackStat label="Commits" value={formatStat(stats.commits)} ink />
          <BackStat label="Stars" value={formatStat(stats.stars)} ink />
          <BackStat label="PRs" value={formatStat(stats.prs)} ink />
          <BackStat label="Streak" value={`${stats.streak}d`} ink />
          <BackStat label="Repos" value={formatStat(stats.repos)} ink />
          <BackStat label="Language" value={teamLabel || "—"} ink />
        </div>
        <p className="mt-auto border-t border-[#1a1208]/20 pt-3 text-center text-[8px] font-black uppercase tracking-[0.18em] text-[#1a1208]/45">
          Flip · {visual.label} · {foil ? "Foil stock" : "Cardboard"}
        </p>
      </div>
    </CardFrame>
  );
}

function BackStat({ label, value, ink = false }: { label: string; value: string; ink?: boolean }) {
  return (
    <div
      className={`border px-2 py-1.5 ${
        ink ? "border-[#1a1208]/25 bg-white/50" : "border-white/10 bg-black/25"
      }`}
    >
      <p className={`text-[7px] font-black uppercase tracking-[0.12em] ${ink ? "text-[#1a1208]/45" : "text-white/45"}`}>
        {label}
      </p>
      <p className={`mt-0.5 truncate text-sm font-black ${ink ? "text-[#1a1208]" : "text-white"}`}>{value}</p>
    </div>
  );
}
