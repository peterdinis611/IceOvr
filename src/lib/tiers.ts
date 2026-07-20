import type { Tier } from "./types";

export type TierMeta = {
  label: string;
  subtitle: string;
  accent: string;
  accentDark: string;
  glow: string;
  frame: string;
  inner: string;
  fade: string;
  nameplate: string;
  ovrFill: string;
};

export const TIER_META: Record<Tier, TierMeta> = {
  bronze: {
    label: "BRONZE",
    subtitle: "Prospect",
    accent: "#E8A86A",
    accentDark: "#8B5A2B",
    glow: "rgba(205, 127, 50, 0.45)",
    frame:
      "linear-gradient(160deg, #3D2410 0%, #A66B2F 14%, #F0C090 32%, #CD7F32 48%, #F5D6B0 62%, #8B5A2B 78%, #2A1808 100%)",
    inner: "linear-gradient(180deg, #1c120c 0%, #0a0705 50%, #140e0a 100%)",
    fade: "#0a0705",
    nameplate: "linear-gradient(90deg, #4A2C12 0%, #CD7F32 30%, #F0C090 50%, #CD7F32 70%, #4A2C12 100%)",
    ovrFill: "linear-gradient(165deg, #F8DEC0 0%, #E8A86A 35%, #CD7F32 70%, #8B5A2B 100%)",
  },
  silver: {
    label: "SILVER",
    subtitle: "Call-up",
    accent: "#E8EDF2",
    accentDark: "#6B7280",
    glow: "rgba(192, 199, 209, 0.5)",
    frame:
      "linear-gradient(160deg, #1F242C 0%, #8B949E 14%, #F3F5F7 32%, #C0C7D1 48%, #FFFFFF 62%, #6B7280 78%, #15191F 100%)",
    inner: "linear-gradient(180deg, #12161e 0%, #07090d 50%, #10141a 100%)",
    fade: "#07090d",
    nameplate: "linear-gradient(90deg, #374151 0%, #9CA3AF 30%, #E5E7EB 50%, #9CA3AF 70%, #374151 100%)",
    ovrFill: "linear-gradient(165deg, #FFFFFF 0%, #E5E7EB 35%, #9CA3AF 70%, #4B5563 100%)",
  },
  gold: {
    label: "GOLD",
    subtitle: "Starter",
    accent: "#FFE08A",
    accentDark: "#B45309",
    glow: "rgba(245, 197, 66, 0.55)",
    frame:
      "linear-gradient(160deg, #451A03 0%, #D97706 14%, #FDE68A 32%, #F59E0B 48%, #FFF7D6 62%, #B45309 78%, #2A1002 100%)",
    inner: "linear-gradient(180deg, #1a1408 0%, #080604 50%, #141008 100%)",
    fade: "#080604",
    nameplate: "linear-gradient(90deg, #78350F 0%, #F59E0B 30%, #FDE68A 50%, #F59E0B 70%, #78350F 100%)",
    ovrFill: "linear-gradient(165deg, #FFFBEB 0%, #FDE68A 30%, #FBBF24 65%, #B45309 100%)",
  },
  elite: {
    label: "ELITE",
    subtitle: "All-Star",
    accent: "#67E8F9",
    accentDark: "#5B21B6",
    glow: "rgba(167, 139, 250, 0.55)",
    frame:
      "linear-gradient(160deg, #0A1628 0%, #0D9488 14%, #A78BFA 40%, #06B6D4 70%, #050A12 100%)",
    inner: "linear-gradient(180deg, #0A1020 0%, #050810 50%, #0C1424 100%)",
    fade: "#050810",
    nameplate: "linear-gradient(90deg, #1E1B4B 0%, #22D3EE 35%, #A78BFA 65%, #1E1B4B 100%)",
    ovrFill: "linear-gradient(165deg, #E0F2FE 0%, #22D3EE 40%, #7C3AED 100%)",
  },
  legend: {
    label: "LEGEND",
    subtitle: "Hall of Fame",
    accent: "#F3D688",
    accentDark: "#4C1D95",
    glow: "rgba(243, 214, 136, 0.55)",
    frame:
      "linear-gradient(160deg, #0F0A1E 0%, #7C3AED 14%, #F3D688 32%, #A78BFA 48%, #FEF3C7 62%, #5B21B6 78%, #080510 100%)",
    inner: "linear-gradient(180deg, #120e1c 0%, #06040c 50%, #100c18 100%)",
    fade: "#06040c",
    nameplate: "linear-gradient(90deg, #4C1D95 0%, #A78BFA 28%, #F3D688 50%, #A78BFA 72%, #4C1D95 100%)",
    ovrFill: "linear-gradient(165deg, #FEF3C7 0%, #F3D688 28%, #C4B5FD 55%, #6D28D9 100%)",
  },
};

export const STAT_LABELS = [
  { key: "spd", short: "SPD", name: "Skating" },
  { key: "sho", short: "SHO", name: "Shooting" },
  { key: "hnd", short: "HND", name: "Hands" },
  { key: "pas", short: "PAS", name: "Passing" },
  { key: "def", short: "DEF", name: "Defense" },
  { key: "str", short: "STR", name: "Strength" },
] as const;
