import type { CardTier, TierVisual } from "./types";

export function tierFromRating(rating: number): CardTier {
  const r = Math.max(0, Math.min(99, Math.round(rating)));
  if (r >= 93) return "legend";
  if (r >= 85) return "elite";
  if (r >= 75) return "gold";
  if (r >= 60) return "silver";
  return "bronze";
}

/** Foil stock only on top-shelf tiers — everyone else is matte cardboard. */
export function isFoilTier(tier: CardTier): boolean {
  return tier === "elite" || tier === "legend";
}

/**
 * 90s hockey cardboard palette.
 * Matte kraft stock + diagonal team stripes; Elite/Legend get foil frames.
 */
export const TIER_VISUAL: Record<CardTier, TierVisual> = {
  bronze: {
    label: "BRONZE",
    frame: "linear-gradient(160deg, #c4a574 0%, #8b6914 40%, #5c4010 100%)",
    inner: "linear-gradient(180deg, #f0e4d0 0%, #e2d2b8 55%, #d4c4a8 100%)",
    accent: "#8b5a2b",
    glow: "rgba(139, 90, 43, 0.28)",
    ovrFill: "linear-gradient(180deg, #d4a574, #8b5a2b)",
    avatarRing: "ring-[#8b5a2b]/70",
    nameplate: "from-[#5c3d1a] to-[#2a1a0c]",
    barTrack: "bg-[#8b5a2b]/15",
    barFill: "from-[#8b5a2b] to-[#c4a574]",
    textMuted: "text-[#6b5344]",
  },
  silver: {
    label: "SILVER",
    frame: "linear-gradient(160deg, #d8dde4 0%, #9aa3ad 45%, #5c6570 100%)",
    inner: "linear-gradient(180deg, #eef1f4 0%, #dde2e8 55%, #c8ced6 100%)",
    accent: "#4a5560",
    glow: "rgba(100, 116, 139, 0.28)",
    ovrFill: "linear-gradient(180deg, #e8edf2, #7a8490)",
    avatarRing: "ring-[#7a8490]/80",
    nameplate: "from-[#3d4450] to-[#1a1e24]",
    barTrack: "bg-[#4a5560]/12",
    barFill: "from-[#4a5560] to-[#a8b0ba]",
    textMuted: "text-[#5c6570]",
  },
  gold: {
    label: "GOLD",
    frame: "linear-gradient(160deg, #f0d060 0%, #d4a017 42%, #8a6208 100%)",
    inner: "linear-gradient(180deg, #f7ecd0 0%, #edd9a8 55%, #e0c888 100%)",
    accent: "#9a6b08",
    glow: "rgba(212, 160, 23, 0.32)",
    ovrFill: "linear-gradient(180deg, #f5e6a3, #c4920a)",
    avatarRing: "ring-[#c4920a]/80",
    nameplate: "from-[#5c3d0a] to-[#1a1004]",
    barTrack: "bg-[#9a6b08]/15",
    barFill: "from-[#9a6b08] to-[#e0c050]",
    textMuted: "text-[#7a5a20]",
  },
  elite: {
    label: "ELITE",
    frame:
      "linear-gradient(125deg, #1a3a4a 0%, #2dd4bf 18%, #e8f4f8 35%, #38bdf8 52%, #0e7490 70%, #7dd3fc 85%, #0c4a6e 100%)",
    inner: "linear-gradient(180deg, #e8f2f6 0%, #d4e8f0 50%, #c0dce8 100%)",
    accent: "#0e7490",
    glow: "rgba(14, 116, 144, 0.4)",
    ovrFill: "linear-gradient(180deg, #67e8f9, #0e7490)",
    avatarRing: "ring-[#0e7490]/70",
    nameplate: "from-[#0c4a6e] to-[#082f49]",
    barTrack: "bg-[#0e7490]/15",
    barFill: "from-[#0e7490] to-[#67e8f9]",
    textMuted: "text-[#334e5c]",
  },
  legend: {
    label: "LEGEND",
    frame:
      "linear-gradient(120deg, #7f1d1d, #fbbf24, #fef3c7, #dc2626, #f59e0b, #7f1d1d, #fde68a)",
    inner: "linear-gradient(180deg, #f8efe0 0%, #f0e0c8 50%, #e8d4b0 100%)",
    accent: "#b45309",
    glow: "rgba(245, 158, 11, 0.45)",
    ovrFill: "linear-gradient(180deg, #fde68a, #b45309)",
    avatarRing: "ring-[#b45309]/80",
    nameplate: "from-[#7f1d1d] to-[#450a0a]",
    barTrack: "bg-[#b45309]/15",
    barFill: "from-[#7f1d1d] via-[#f59e0b] to-[#fde68a]",
    textMuted: "text-[#6b4423]",
  },
};

/** Diagonal stripe pair per tier (primary / secondary). */
export const TIER_STRIPES: Record<CardTier, [string, string]> = {
  bronze: ["#8b5a2b", "#c4a574"],
  silver: ["#4a5560", "#a8b0ba"],
  gold: ["#9a6b08", "#e0c050"],
  elite: ["#e11d2e", "#0e7490"],
  legend: ["#7f1d1d", "#f59e0b"],
};

/** Dark rink / broadcast palette for Arena Night edition. */
export const ARENA_TIER_VISUAL: Record<CardTier, TierVisual> = {
  bronze: {
    label: "BRONZE",
    frame: "linear-gradient(145deg, #3d2914, #8b5a2b, #c4a484, #8b5a2b, #2a1a0c)",
    inner: "linear-gradient(180deg, #1a1410 0%, #0c0a08 55%, #161210 100%)",
    accent: "#c4a484",
    glow: "rgba(139, 90, 43, 0.45)",
    ovrFill: "linear-gradient(160deg, #e8d0b0, #a67c52)",
    avatarRing: "ring-[#a67c52]/70",
    nameplate: "from-[#5c4030]/90 to-[#2a1a0c]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#a67c52] to-[#e8d0b0]",
    textMuted: "text-[#a89888]",
  },
  silver: {
    label: "SILVER",
    frame: "linear-gradient(145deg, #2a3038, #8b949e, #e8edf2, #9aa3ad, #1a1e24)",
    inner: "linear-gradient(180deg, #12161c 0%, #080a0e 55%, #10141a 100%)",
    accent: "#d0d7e0",
    glow: "rgba(168, 176, 188, 0.5)",
    ovrFill: "linear-gradient(160deg, #ffffff, #c0c7d1)",
    avatarRing: "ring-[#c0c7d1]/80",
    nameplate: "from-[#3d4450]/90 to-[#12151a]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#8b949e] to-[#e8edf2]",
    textMuted: "text-[#9aa3ad]",
  },
  gold: {
    label: "GOLD",
    frame: "linear-gradient(145deg, #4a2c0a, #d4a017, #f5e6a3, #c4920a, #2a1804)",
    inner: "linear-gradient(180deg, #1a1408 0%, #0a0804 55%, #141008 100%)",
    accent: "#f5d76e",
    glow: "rgba(212, 160, 23, 0.55)",
    ovrFill: "linear-gradient(160deg, #fff8dc, #f0c014)",
    avatarRing: "ring-[#f0c014]/80",
    nameplate: "from-[#5c3d0a]/90 to-[#1a1004]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#d4a017] to-[#f5e6a3]",
    textMuted: "text-[#c4a86a]",
  },
  elite: {
    label: "ELITE",
    frame: "linear-gradient(145deg, #0a1628, #0d9488, #38bdf8, #06b6d4, #050a12)",
    inner: "linear-gradient(180deg, #071018 0%, #03060c 50%, #0a1420 100%)",
    accent: "#67e8f9",
    glow: "rgba(56, 189, 248, 0.45)",
    ovrFill: "linear-gradient(160deg, #e0f2fe, #22d3ee)",
    avatarRing: "ring-[#22d3ee]/70",
    nameplate: "from-[#0c4a6e]/90 to-[#041018]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#0e7490] to-[#22d3ee]",
    textMuted: "text-[#94a3b8]",
  },
  legend: {
    label: "LEGEND",
    frame: "linear-gradient(120deg, #7f1d1d, #fbbf24, #38bdf8, #e11d2e, #f59e0b)",
    inner: "linear-gradient(180deg, #12080c 0%, #060408 50%, #10080c 100%)",
    accent: "#fde68a",
    glow: "rgba(253, 230, 138, 0.55)",
    ovrFill: "linear-gradient(160deg, #fde68a, #f87171)",
    avatarRing: "ring-[#fde68a]/80",
    nameplate: "from-[#7f1d1d]/90 to-[#1a0808]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#e11d2e] via-[#f59e0b] to-[#fde68a]",
    textMuted: "text-[#c4b5fd]",
  },
};

/** High-contrast stamp palette for Puck Stamp edition. */
export const BRUTAL_TIER_VISUAL: Record<CardTier, TierVisual> = {
  bronze: {
    label: "BRONZE",
    frame: "#8b5a2b",
    inner: "#0a0908",
    accent: "#c4a484",
    glow: "rgba(139, 90, 43, 0.35)",
    ovrFill: "#c4a484",
    avatarRing: "ring-[#c4a484]",
    nameplate: "from-[#8b5a2b] to-[#8b5a2b]",
    barTrack: "bg-white/10",
    barFill: "from-[#8b5a2b] to-[#c4a484]",
    textMuted: "text-[#a89888]",
  },
  silver: {
    label: "SILVER",
    frame: "#9aa3ad",
    inner: "#0a0908",
    accent: "#e8edf2",
    glow: "rgba(168, 176, 188, 0.35)",
    ovrFill: "#e8edf2",
    avatarRing: "ring-[#e8edf2]",
    nameplate: "from-[#9aa3ad] to-[#9aa3ad]",
    barTrack: "bg-white/10",
    barFill: "from-[#9aa3ad] to-[#e8edf2]",
    textMuted: "text-[#9aa3ad]",
  },
  gold: {
    label: "GOLD",
    frame: "#d4a017",
    inner: "#0a0908",
    accent: "#f5e6a3",
    glow: "rgba(212, 160, 23, 0.4)",
    ovrFill: "#f5e6a3",
    avatarRing: "ring-[#f5e6a3]",
    nameplate: "from-[#d4a017] to-[#d4a017]",
    barTrack: "bg-white/10",
    barFill: "from-[#d4a017] to-[#f5e6a3]",
    textMuted: "text-[#c4a86a]",
  },
  elite: {
    label: "ELITE",
    frame: "#e11d2e",
    inner: "#0a0908",
    accent: "#7dd3fc",
    glow: "rgba(225, 29, 46, 0.45)",
    ovrFill: "#7dd3fc",
    avatarRing: "ring-[#7dd3fc]",
    nameplate: "from-[#e11d2e] to-[#e11d2e]",
    barTrack: "bg-white/10",
    barFill: "from-[#e11d2e] to-[#7dd3fc]",
    textMuted: "text-[#94a3b8]",
  },
  legend: {
    label: "LEGEND",
    frame: "#fbbf24",
    inner: "#0a0908",
    accent: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.5)",
    ovrFill: "#fbbf24",
    avatarRing: "ring-[#fbbf24]",
    nameplate: "from-[#fbbf24] to-[#fbbf24]",
    barTrack: "bg-white/10",
    barFill: "from-[#e11d2e] to-[#fbbf24]",
    textMuted: "text-[#fde68a]",
  },
};
