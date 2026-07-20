"use client";

import { useState, type MouseEvent, type SVGProps } from "react";
import { CardFrame } from "./CardFrame";
import { TierGlow } from "./TierGlow";
import { TIER_VISUAL } from "./tierStyles";
import type { PlayerCardProps } from "./types";

const STATS = [
  { key: "commits", label: "Commits", max: 1200 },
  { key: "prs", label: "PRs", max: 400 },
  { key: "stars", label: "Stars", max: 5000 },
  { key: "streak", label: "Streak", max: 60 },
  { key: "repos", label: "Repos", max: 80 },
] as const;

export function PlayerCard({
  username,
  avatarUrl,
  displayName,
  rating,
  stats,
  tier,
  teamLabel,
  teamIconUrl,
  size = "lg",
  className = "",
}: PlayerCardProps) {
  const visual = TIER_VISUAL[tier];
  const compact = size === "sm";
  const w = compact ? 240 : 300;
  const h = compact ? 336 : 420;
  const scale = compact ? 0.8 : 1;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  function onMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  }

  function onLeave() {
    setTilt({ x: 0, y: 0 });
    setHover(false);
  }

  return (
    <article
      className={`relative shrink-0 select-none ${className}`}
      style={{
        width: w,
        height: h,
        perspective: 1000,
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      aria-label={`${displayName} IceOVR card, ${rating} overall, ${tier}`}
    >
      <TierGlow tier={tier} active={hover} />

      <div
        className="relative h-full w-full transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hover ? "translateY(-4px) scale(1.02)" : ""}`,
          transformStyle: "preserve-3d",
          boxShadow: hover
            ? `0 28px 56px ${visual.glow}, 0 8px 20px rgba(0,0,0,0.55)`
            : `0 18px 40px ${visual.glow}, 0 6px 14px rgba(0,0,0,0.45)`,
        }}
      >
        <CardFrame tier={tier}>
          {/* Original GitHub collector card with an NHL Ultimate Team-style hierarchy. */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -right-[26%] top-[12%] h-[58%] w-[92%] opacity-70"
              style={{
                background: `linear-gradient(135deg, transparent 8%, ${visual.accent}33 8% 10%, transparent 10% 42%, ${visual.accent}24 42% 44%, transparent 44%)`,
                clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%, 14% 62%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[42%]"
              style={{
                background: `linear-gradient(180deg, transparent, ${visual.inner} 36%, ${visual.inner})`,
              }}
            />
            <div
              className="absolute left-2 top-[112px] h-20 border-l border-dashed opacity-70"
              style={{ borderColor: visual.accent }}
            />
          </div>

          {tier === "legend" && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            >
              <div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                style={{ animation: "iceovr-holo-sheen 4.5s ease-in-out infinite" }}
              />
            </div>
          )}

          <div className="relative z-10 h-full" style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: `${100 / scale}%` }}>
            <div className="absolute left-4 top-3 z-20">
              <div
                className="font-black leading-[0.72] tracking-[-0.09em] text-white"
                style={{
                  fontSize: 68,
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  textShadow: "0 3px 12px rgba(0,0,0,.35)",
                }}
              >
                {Math.round(rating)}
              </div>
              <div className="mt-1 text-[10px] font-medium tracking-[0.03em] text-white/75">OVR</div>
            </div>

            <div
              className="absolute left-[86px] right-3 top-3 z-20 flex h-7 items-center px-3"
              style={{ background: "linear-gradient(90deg, #171717ee, #050505cc)" }}
            >
              <span className="truncate text-[14px] font-bold tracking-[-0.04em] text-white">
                {displayName}
              </span>
            </div>

            <div className="absolute right-4 top-12 z-20 flex items-center gap-1.5">
              <GitHubMark size={17} aria-label="GitHub" />
              <span className="text-[9px] font-black tracking-[0.16em]">GITHUB EDITION</span>
            </div>

            <div
              className="absolute left-[65px] right-2 top-[52px] h-[197px] overflow-hidden"
              style={{
                clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%, 0 25%)",
                background: `radial-gradient(circle at 50% 24%, ${visual.accent}55, transparent 48%)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover object-top"
                draggable={false}
                style={{ maskImage: "linear-gradient(to bottom, black 63%, transparent 100%)" }}
              />
            </div>

            <div className="absolute inset-x-4 bottom-4 z-20">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-[0.15em] text-white/55">@{username}</span>
                {(teamIconUrl || teamLabel) && (
                  <span className="flex items-center gap-1 text-[8px] font-bold tracking-[0.12em]" style={{ color: visual.accent }}>
                    {teamIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={teamIconUrl} alt={teamLabel ?? ""} width={12} height={12} />
                    )}
                    {teamLabel?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-x-3 gap-y-2">
                {STATS.map((stat) => (
                  <CardStat
                    key={stat.key}
                    label={stat.label}
                    value={stats[stat.key]}
                    max={stat.max}
                    accent={visual.accent}
                  />
                ))}
                <div className="flex flex-col justify-end">
                  <span className="text-[8px] font-medium tracking-[0.05em] text-white/55">TIER</span>
                  <span className="text-[15px] font-black leading-none tracking-[-0.05em]" style={{ color: visual.accent }}>
                    {visual.label}
                  </span>
                </div>
              </div>

              <div
                className="mt-3 flex items-center justify-between border-t pt-2"
                style={{
                  borderColor: `${visual.accent}66`,
                }}
              >
                <span className="flex items-center gap-1.5 text-[8px] font-black tracking-[0.22em] text-white">
                  <GitHubMark size={13} />
                  GITHUB PROFILE
                </span>
                <span className="text-[8px] font-bold tracking-[0.14em] text-white/60">ICEOVR</span>
              </div>
              <span className="mt-1 block text-right text-[6px] font-medium tracking-[0.12em] text-white/30">
                NHL-STYLE · UNOFFICIAL CONCEPT
              </span>
            </div>
          </div>
        </CardFrame>
      </div>
    </article>
  );
}

function CardStat({
  label,
  value,
  max,
  accent,
}: {
  label: string;
  value: number;
  max: number;
  accent: string;
}) {
  const score = Math.round(40 + Math.min(1, value / max) * 59);

  return (
    <div className="min-w-0">
      <span className="block truncate text-[8px] font-medium leading-none tracking-[-0.02em] uppercase text-white/55">
        {label}
      </span>
      <span className="mt-0.5 block font-black leading-none tabular-nums" style={{ color: accent, fontSize: 22 }}>
        {score}
      </span>
      <span className="sr-only">{formatStat(value)}</span>
    </div>
  );
}

function GitHubMark({ size, ...props }: { size: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.39-2.05 1.04-2.78-.11-.26-.45-1.31.1-2.73 0 0 .85-.28 2.75 1.06A9.33 9.33 0 0 1 12 6.38c.85 0 1.7.12 2.5.35 1.9-1.34 2.74-1.06 2.74-1.06.55 1.42.2 2.47.1 2.73.65.73 1.04 1.65 1.04 2.78 0 3.96-2.34 4.83-4.57 5.09.36.32.68.93.68 1.88 0 1.36-.01 2.45-.01 2.79 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function formatStat(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export type { PlayerCardProps, CardTier, PlayerCardStats } from "./types";
export { tierFromRating, TIER_VISUAL } from "./tierStyles";
export { CardFrame } from "./CardFrame";
export { TierGlow } from "./TierGlow";
