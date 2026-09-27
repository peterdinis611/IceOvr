"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { CardStyleId } from "./cardStyles";
import { DEFAULT_CARD_STYLE } from "./cardStyles";
import {
  DEFAULT_CUSTOM_THEME,
  type CustomCardTheme,
} from "./customTheme";
import { ArenaBack, ArenaFront } from "./faces/ArenaFace";
import { BrutalBack, BrutalFront } from "./faces/BrutalFace";
import { CustomBack, CustomFront } from "./faces/CustomFace";
import { FrostBack, FrostFront } from "./faces/FrostFace";
import { NeonBack, NeonFront } from "./faces/NeonFace";
import { RetroBack, RetroFront } from "./faces/RetroFace";
import { TierGlow } from "./TierGlow";
import {
  ARENA_TIER_VISUAL,
  BRUTAL_TIER_VISUAL,
  FROST_TIER_VISUAL,
  NEON_TIER_VISUAL,
  TIER_VISUAL,
} from "./tierStyles";
import type { PlayerCardProps } from "./types";

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
  style = DEFAULT_CARD_STYLE,
  customTheme = DEFAULT_CUSTOM_THEME,
  className = "",
}: PlayerCardProps) {
  const visual =
    style === "arena"
      ? ARENA_TIER_VISUAL[tier]
      : style === "brutal"
        ? BRUTAL_TIER_VISUAL[tier]
        : style === "frost"
          ? FROST_TIER_VISUAL[tier]
          : style === "neon"
            ? NEON_TIER_VISUAL[tier]
            : style === "custom"
              ? {
                  ...TIER_VISUAL[tier],
                  accent: customTheme.accent,
                  glow: `${customTheme.accent}66`,
                }
              : TIER_VISUAL[tier];

  const compact = size === "sm";
  const w = compact ? 240 : 300;
  const h = compact ? 336 : 420;
  const scale = compact ? 0.8 : 1;

  const [hover, setHover] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [allowTilt, setAllowTilt] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setAllowTilt(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function onMove(e: MouseEvent<HTMLElement>) {
    if (!allowTilt || flipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      tiltRef.current?.style.setProperty(
        "transform",
        `rotateX(${py * -8}deg) rotateY(${px * 10}deg) translateY(-3px)`,
      );
    });
  }

  function onLeave() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (!flipped) {
      tiltRef.current?.style.setProperty("transform", "rotateX(0deg) rotateY(0deg)");
    }
    setHover(false);
  }

  function toggleFlip(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFlipped((value) => !value);
    tiltRef.current?.style.setProperty("transform", "rotateX(0deg) rotateY(0deg)");
  }

  const faceProps = {
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
    customTheme,
  };

  return (
    <article
      className={`relative shrink-0 select-none ${className}`}
      style={{ width: w, height: h, perspective: 1000 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={onLeave}
      aria-label={`${displayName} IceOVR card, ${rating} overall, ${tier}, ${style} style`}
      data-card-style={style}
    >
      <TierGlow tier={tier} active={hover && !flipped} />

      <div
        className="relative h-full w-full transition-transform duration-200 ease-out"
        ref={tiltRef}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: hover
            ? `0 22px 40px rgba(0,0,0,0.4), 0 0 24px ${visual.glow}`
            : `0 12px 28px rgba(0,0,0,0.32), 0 0 12px ${visual.glow}`,
        }}
      >
        <div
          className={`card-flipper relative h-full w-full ${flipped ? "is-flipped" : ""}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="card-face absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
            <CardFront style={style} {...faceProps} />
          </div>
          <div
            className="card-face absolute inset-0"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <CardBack
              style={style}
              username={username}
              displayName={displayName}
              stats={stats}
              tier={tier}
              teamLabel={teamLabel}
              customTheme={customTheme}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleFlip}
        className={`absolute bottom-2 right-2 z-30 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] transition ${
          style === "brutal"
            ? "border-2 border-black bg-white text-black shadow-[2px_2px_0_#000] hover:translate-x-px hover:translate-y-px hover:shadow-none"
            : style === "retro"
              ? "border-2 border-[#1a1208] bg-[#f5ead4] text-[#1a1208] shadow-[2px_2px_0_rgba(0,0,0,0.25)] hover:translate-x-px hover:translate-y-px hover:shadow-none"
              : style === "frost"
                ? "rounded-full border border-white/70 bg-white/70 text-slate-700 backdrop-blur-sm hover:bg-white"
                : style === "neon"
                  ? "border border-cyan-300/50 bg-black/70 text-cyan-200 hover:border-cyan-200 hover:text-white"
                  : "rounded border border-white/20 bg-black/55 text-white/80 backdrop-blur-sm hover:border-[#7dd3fc]/5 hover:text-[#7dd3fc]"
        }`}
      >
        {flipped ? "Front" : "Flip"}
      </button>
    </article>
  );
}

function CardFront({
  style,
  ...props
}: { style: CardStyleId } & Parameters<typeof RetroFront>[0] & {
    customTheme?: CustomCardTheme;
  }) {
  if (style === "arena") return <ArenaFront {...props} />;
  if (style === "brutal") return <BrutalFront {...props} />;
  if (style === "frost") return <FrostFront {...props} />;
  if (style === "neon") return <NeonFront {...props} />;
  if (style === "custom") return <CustomFront {...props} />;
  return <RetroFront {...props} />;
}

function CardBack({
  style,
  username,
  displayName,
  stats,
  tier,
  teamLabel,
  customTheme,
}: {
  style: CardStyleId;
  username: string;
  displayName: string;
  stats: PlayerCardProps["stats"];
  tier: PlayerCardProps["tier"];
  teamLabel?: string | null;
  customTheme?: CustomCardTheme;
}) {
  const props = { username, displayName, stats, tier, teamLabel, customTheme };
  if (style === "arena") return <ArenaBack {...props} />;
  if (style === "brutal") return <BrutalBack {...props} />;
  if (style === "frost") return <FrostBack {...props} />;
  if (style === "neon") return <NeonBack {...props} />;
  if (style === "custom") return <CustomBack {...props} />;
  return <RetroBack {...props} />;
}

export type { PlayerCardProps, CardTier, PlayerCardStats } from "./types";
export { tierFromRating, TIER_VISUAL, isFoilTier } from "./tierStyles";
export { CardFrame } from "./CardFrame";
export { TierGlow } from "./TierGlow";
