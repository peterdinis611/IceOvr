import type { CardTier, TierVisual } from "./types";

export function tierFromRating(rating: number): CardTier {
  const r = Math.max(0, Math.min(99, Math.round(rating)));
  if (r >= 93) return "legend";
  if (r >= 85) return "elite";
  if (r >= 75) return "gold";
  if (r >= 60) return "silver";
  return "bronze";
}

export const TIER_VISUAL: Record<CardTier, TierVisual> = {
  bronze: {
    label: "BRONZE",
    frame:
      "linear-gradient(145deg, #3d2914 0%, #8b5a2b 25%, #c4a484 50%, #8b5a2b 75%, #2a1a0c 100%)",
    inner: "linear-gradient(180deg, #2a1c12 0%, #14100c 55%, #1e160f 100%)",
    accent: "#c4a484",
    glow: "rgba(139, 90, 43, 0.45)",
    ovrFill: "linear-gradient(160deg, #e8d0b0, #a67c52 55%, #6b4423)",
    avatarRing: "ring-[#a67c52]/70",
    nameplate: "from-[#5c4030]/90 to-[#2a1a0c]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#a67c52] to-[#e8d0b0]",
    textMuted: "text-[#a89888]",
  },
  silver: {
    label: "SILVER",
    frame:
      "linear-gradient(145deg, #2a3038 0%, #8b949e 22%, #e8edf2 50%, #9aa3ad 78%, #1a1e24 100%)",
    inner: "linear-gradient(180deg, #1a1e26 0%, #0c0e12 55%, #161a22 100%)",
    accent: "#d0d7e0",
    glow: "rgba(168, 176, 188, 0.5)",
    ovrFill: "linear-gradient(160deg, #ffffff, #c0c7d1 50%, #6b7280)",
    avatarRing: "ring-[#c0c7d1]/80",
    nameplate: "from-[#3d4450]/90 to-[#12151a]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#8b949e] to-[#e8edf2]",
    textMuted: "text-[#9aa3ad]",
  },
  gold: {
    label: "GOLD",
    frame:
      "linear-gradient(145deg, #4a2c0a 0%, #d4a017 22%, #f5e6a3 50%, #c4920a 78%, #2a1804 100%)",
    inner: "linear-gradient(180deg, #221808 0%, #0e0a04 55%, #1a1408 100%)",
    accent: "#f5d76e",
    glow: "rgba(212, 160, 23, 0.55)",
    ovrFill: "linear-gradient(160deg, #fff8dc, #f0c014 40%, #b8860b)",
    avatarRing: "ring-[#f0c014]/80",
    nameplate: "from-[#5c3d0a]/90 to-[#1a1004]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#d4a017] to-[#f5e6a3]",
    textMuted: "text-[#c4a86a]",
  },
  elite: {
    label: "ELITE",
    frame:
      "linear-gradient(145deg, #0a1628 0%, #0d9488 20%, #a78bfa 50%, #06b6d4 80%, #050a12 100%)",
    inner: "linear-gradient(180deg, #0a1020 0%, #050810 50%, #0c1424 100%)",
    accent: "#67e8f9",
    glow: "rgba(167, 139, 250, 0.55)",
    ovrFill: "linear-gradient(160deg, #e0f2fe, #22d3ee 40%, #7c3aed)",
    avatarRing: "ring-[#22d3ee]/70",
    nameplate: "from-[#1e1b4b]/90 to-[#0a0a1a]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#7c3aed] to-[#22d3ee]",
    textMuted: "text-[#94a3b8]",
  },
  legend: {
    label: "LEGEND",
    frame:
      "linear-gradient(120deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff, #ff6b6b)",
    inner: "linear-gradient(180deg, #120e1c 0%, #06040c 50%, #100c18 100%)",
    accent: "#fde68a",
    glow: "rgba(253, 230, 138, 0.6)",
    ovrFill: "linear-gradient(160deg, #fde68a, #c4b5fd 45%, #f472b6)",
    avatarRing: "ring-[#fde68a]/80",
    nameplate: "from-[#4c1d95]/85 to-[#0f0a1e]/95",
    barTrack: "bg-white/10",
    barFill: "from-[#f472b6] via-[#fde68a] to-[#48dbfb]",
    textMuted: "text-[#c4b5fd]",
  },
};
