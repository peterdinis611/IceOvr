import type { ContributionWeek } from "./contributions";

export type Position = "C" | "LW" | "RW" | "LD" | "RD" | "D" | "G";

export type Tier = "bronze" | "silver" | "gold" | "elite" | "legend";

export interface RawGitHubStats {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  createdAt: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  commitsLastYear: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  contributionsLifetime: number;
  languageCount: number;
  topLanguage: string | null;
  countryCode: string | null;
  contributionWeeks: ContributionWeek[];
}

export interface PlayerStats {
  spd: number;
  sho: number;
  hnd: number;
  pas: number;
  def: number;
  str: number;
}

export interface ScoutCard {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  countryCode: string | null;
  topLanguage: string | null;
  ovr: number;
  position: Position;
  archetype: string;
  tier: Tier;
  stats: PlayerStats;
  contributionWeeks: ContributionWeek[];
  raw: {
    followers: number;
    stars: number;
    commitsLastYear: number;
    pullRequests: number;
    issues: number;
    reviews: number;
    contributionsLifetime: number;
    accountYears: number;
    languageCount: number;
    publicRepos: number;
  };
  scoutedAt: string;
}
