export type CardTier = "bronze" | "silver" | "gold" | "elite" | "legend";

export type PlayerCardStats = {
  commits: number;
  prs: number;
  stars: number;
  streak: number;
  repos: number;
};

export type PlayerCardProps = {
  username: string;
  avatarUrl: string;
  displayName: string;
  rating: number;
  position: string;
  stats: PlayerCardStats;
  tier: CardTier;
  /** Optional language / “team” mark in the corner */
  teamLabel?: string | null;
  teamIconUrl?: string | null;
  size?: "sm" | "lg";
  reveal?: boolean;
  delay?: number;
  className?: string;
};

export type TierVisual = {
  label: string;
  frame: string;
  inner: string;
  accent: string;
  glow: string;
  ovrFill: string;
  avatarRing: string;
  nameplate: string;
  barTrack: string;
  barFill: string;
  textMuted: string;
};
