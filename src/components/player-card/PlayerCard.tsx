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
              className="absolute -right-[18%] top-[8%] h-[61%] w-[104%] opacity-80"
              style={{
                background: `linear-gradient(135deg, transparent 0 20%, ${visual.accent}36 20% 21%, transparent 21% 47%, ${visual.accent}26 47% 49%, transparent 49% 67%, ${visual.accent}20 67% 68%, transparent 68%)`,
                clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 34%)",
              }}
            />
            <div
              className="absolute left-0 right-0 top-[43px] h-[226px] opacity-35"
              style={{
                background: `radial-gradient(ellipse at 70% 18%, ${visual.accent}88 0%, transparent 50%), linear-gradient(150deg, transparent 0 42%, rgba(255,255,255,.16) 42% 43%, transparent 43%)`,
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[47%]"
              style={{
                background: `linear-gradient(180deg, transparent, ${visual.inner} 24%, ${visual.inner} 100%)`,
              }}
            />
            <div
              className="absolute left-2 top-[94px] h-32 border-l border-dashed opacity-70"
              style={{ borderColor: visual.accent }}
            />
            <div
              className="absolute bottom-[138px] left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${visual.accent}99, transparent)` }}
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
                className="font-black leading-[0.7] tracking-[-0.1em] text-white"
                style={{
                  fontSize: 72,
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  textShadow: "0 4px 13px rgba(0,0,0,.55)",
                }}
              >
                {Math.round(rating)}
              </div>
              <div className="mt-1 border-l-2 pl-1.5 text-[9px] font-bold tracking-[0.22em] text-white/75" style={{ borderColor: visual.accent }}>OVR</div>
            </div>

            <div
              className="absolute left-[88px] right-0 top-3 z-20 flex h-8 items-center px-3"
              style={{ background: "linear-gradient(90deg, #151515f5 0%, #050505dc 74%, transparent 100%)" }}
            >
              <span
                className="truncate font-display text-[19px] leading-none tracking-[0.05em] text-white"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,.65)" }}
              >
                {displayName}
              </span>
            </div>

            <div className="absolute left-[88px] top-[43px] z-30 flex items-center gap-1.5 border border-white/15 bg-black/70 px-2 py-1 text-white shadow-[0_3px_10px_rgba(0,0,0,.35)]">
              <GitHubMark size={12} aria-label="GitHub" />
              <span className="text-[7px] font-black tracking-[0.2em]">GITHUB EDITION</span>
            </div>

            <div
              className="absolute left-1/2 top-[78px] z-20 h-[132px] w-[132px] -translate-x-1/2 overflow-hidden rounded-full border-[3px]"
              style={{
                borderColor: visual.accent,
                background: `radial-gradient(circle at 38% 22%, ${visual.accent}aa, #101827 68%)`,
                boxShadow: `0 0 0 5px rgba(0,0,0,.32), 0 0 28px ${visual.glow}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover object-top"
                draggable={false}
                style={{
                  filter: "contrast(1.08) saturate(0.9)",
                }}
              />
            </div>

            <div className="absolute inset-x-4 top-[220px] z-20 text-center">
              <p className="text-[9px] font-bold tracking-[0.2em] text-white/75">@{username}</p>
            </div>

            <div className="absolute inset-x-4 bottom-4 z-20">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-[0.16em] text-white/70">ATTRIBUTES</span>
                {(teamIconUrl || teamLabel) && (
                  <span
                    className="flex items-center gap-1.5 border border-white/15 bg-black/45 px-1.5 py-1 text-[8px] font-black tracking-[0.12em]"
                    style={{ color: visual.accent }}
                  >
                    {teamIconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={teamIconUrl} alt={teamLabel ?? ""} width={14} height={14} />
                    )}
                    {teamLabel?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-2.5">
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
                  GITHUB SCOUT CARD
                </span>
                <span className="font-display text-[11px] tracking-[0.16em] text-white/70">ICEOVR</span>
              </div>
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
    <div
      className="min-w-0 border-t pt-1"
      style={{ borderColor: `${accent}44` }}
    >
      <span className="block truncate text-[8px] font-bold leading-none tracking-[0.02em] uppercase text-white/55">
        {label}
      </span>
      <span
        className="mt-0.5 block font-black leading-none tabular-nums"
        style={{ color: accent, fontSize: 23, textShadow: `0 2px 8px ${accent}55` }}
      >
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
