import type { PlayerStats, Position, RawGitHubStats, ScoutCard, Tier } from "./types";

/** Map raw count into 40–88 band with soft log curve. */
function scale(value: number, mid: number, hardCap = 88): number {
  if (value <= 0) return 40;
  const t = Math.log10(1 + value) / Math.log10(1 + mid * 4);
  return Math.min(hardCap, Math.round(40 + t * (hardCap - 40)));
}

function yearsSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, ms / (1000 * 60 * 60 * 24 * 365.25));
}

export function computeStats(raw: RawGitHubStats): PlayerStats {
  const years = yearsSince(raw.createdAt);

  const spd = scale(raw.commitsLastYear, 400);
  const sho = scale(raw.totalStars, 250);
  const hnd = Math.min(
    88,
    Math.round(
      (scale(raw.languageCount, 6) * 0.55 + scale(raw.commitsLastYear, 500) * 0.45),
    ),
  );
  const pas = Math.min(
    88,
    Math.round(scale(raw.pullRequests, 80) * 0.55 + scale(raw.followers, 200) * 0.45),
  );
  const def = Math.min(
    88,
    Math.round(scale(raw.reviews, 60) * 0.55 + scale(raw.issues, 80) * 0.45),
  );
  const str = clamp(
    Math.round(
      scale(raw.contributionsLifetime, 2000) * 0.7 + Math.min(18, years * 2),
    ) - 8,
  );

  return {
    spd: clamp(spd),
    sho: clamp(sho),
    hnd: clamp(hnd),
    pas: clamp(pas),
    def: clamp(def),
    str: clamp(str),
  };
}

function clamp(n: number): number {
  return Math.max(40, Math.min(88, Math.round(n)));
}

/** Raw OVR caps at 88; 89–99 requires legacy gate (years + influence). */
export function computeOvr(stats: PlayerStats, raw: RawGitHubStats): number {
  const base = Math.round(
    stats.spd * 0.16 +
      stats.sho * 0.18 +
      stats.hnd * 0.14 +
      stats.pas * 0.18 +
      stats.def * 0.16 +
      stats.str * 0.18,
  );

  const years = yearsSince(raw.createdAt);
  const influence = raw.followers + raw.totalStars + raw.contributionsLifetime / 10;
  let ovr = Math.min(88, base);

  if (years >= 8 && influence >= 5000) {
    ovr = Math.min(99, ovr + Math.round(Math.min(11, years * 0.5 + Math.log10(influence) * 1.2)));
  } else if (years >= 5 && influence >= 1500) {
    ovr = Math.min(92, ovr + Math.round(Math.min(4, years * 0.35)));
  }

  return Math.max(45, Math.min(99, ovr));
}

export function pickPosition(
  stats: PlayerStats,
  seed = "iceovr",
): { position: Position; archetype: string } {
  const positions: Position[] = ["C", "LW", "RW", "LD", "RD", "G"];
  const position = positions[hashSeed(seed) % positions.length];

  const entries = Object.entries(stats) as [keyof PlayerStats, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const avg = entries.reduce((sum, [, v]) => sum + v, 0) / entries.length;
  const spread = sorted[0][1] - sorted[sorted.length - 1][1];

  let archetype = "Two-Way Forward";
  if (position === "G") {
    archetype = "Standing Wall";
  } else if (position === "LD" || position === "RD" || position === "D") {
    archetype =
      stats.def >= stats.sho ? "Two-Way D" : "Offensive D";
  } else if (top === "sho" && stats.sho >= avg + 6) {
    archetype = "Sniper";
  } else if (top === "pas" || (stats.pas >= 76 && Math.abs(stats.pas - stats.sho) <= 8)) {
    archetype = "Playmaker";
  } else if (top === "spd" || top === "hnd") {
    archetype = "Speedster";
  } else if (top === "str") {
    archetype = "Power Forward";
  } else if (stats.def >= 82 && stats.str >= 78 && spread <= 12) {
    archetype = "Shutdown Forward";
  }

  return { position, archetype };
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickTier(ovr: number): Tier {
  if (ovr >= 93) return "legend";
  if (ovr >= 85) return "elite";
  if (ovr >= 75) return "gold";
  if (ovr >= 60) return "silver";
  return "bronze";
}

export function buildScoutCard(raw: RawGitHubStats): ScoutCard {
  const stats = computeStats(raw);
  const ovr = computeOvr(stats, raw);
  const { position, archetype } = pickPosition(stats, raw.login.toLowerCase());
  const tier = pickTier(ovr);
  const countryCode = raw.countryCode || guessCountry(raw.location);

  return {
    username: raw.login,
    displayName: (raw.name || raw.login).toUpperCase(),
    avatarUrl: raw.avatarUrl,
    bio: raw.bio,
    location: raw.location,
    countryCode: countryCode ? countryCode.toUpperCase() : null,
    topLanguage: raw.topLanguage,
    ovr,
    position,
    archetype,
    tier,
    stats,
    contributionWeeks: raw.contributionWeeks,
    raw: {
      followers: raw.followers,
      stars: raw.totalStars,
      commitsLastYear: raw.commitsLastYear,
      pullRequests: raw.pullRequests,
      issues: raw.issues,
      reviews: raw.reviews,
      contributionsLifetime: raw.contributionsLifetime,
      accountYears: Math.round(yearsSince(raw.createdAt) * 10) / 10,
      languageCount: raw.languageCount,
      publicRepos: raw.publicRepos,
    },
    scoutedAt: new Date().toISOString(),
  };
}

function guessCountry(location: string | null): string | null {
  if (!location) return null;
  const l = location.toLowerCase();
  const map: Record<string, string> = {
    slovakia: "SK",
    bratislava: "SK",
    kosice: "SK",
    "czech": "CZ",
    prague: "CZ",
    brno: "CZ",
    canada: "CA",
    toronto: "CA",
    montreal: "CA",
    vancouver: "CA",
    ottawa: "CA",
    usa: "US",
    "united states": "US",
    "u.s.": "US",
    "new york": "US",
    "san francisco": "US",
    "bay area": "US",
    seattle: "US",
    boston: "US",
    chicago: "US",
    austin: "US",
    portland: "US",
    sweden: "SE",
    stockholm: "SE",
    finland: "FI",
    helsinki: "FI",
    russia: "RU",
    moscow: "RU",
    germany: "DE",
    berlin: "DE",
    munich: "DE",
    france: "FR",
    paris: "FR",
    uk: "GB",
    "united kingdom": "GB",
    england: "GB",
    london: "GB",
    scotland: "GB",
    japan: "JP",
    tokyo: "JP",
    australia: "AU",
    sydney: "AU",
    melbourne: "AU",
    netherlands: "NL",
    amsterdam: "NL",
    poland: "PL",
    warsaw: "PL",
    austria: "AT",
    vienna: "AT",
    switzerland: "CH",
    zurich: "CH",
    norway: "NO",
    denmark: "DK",
    india: "IN",
    brazil: "BR",
    ireland: "IE",
    israel: "IL",
    portugal: "PT",
    spain: "ES",
    italy: "IT",
    ukraine: "UA",
    latvia: "LV",
    lithuania: "LT",
    estonia: "EE",
  };
  for (const [key, code] of Object.entries(map)) {
    if (l.includes(key)) return code;
  }
  return null;
}
