import { HomeExperience } from "@/components/HomeExperience";
import { buildScoutCard } from "@/lib/scoring";
import { synthesizeContributionWeeks } from "@/lib/contributions";
import type { RawGitHubStats } from "@/lib/types";

function withWeeks(raw: Omit<RawGitHubStats, "contributionWeeks">): RawGitHubStats {
  return {
    ...raw,
    contributionWeeks: synthesizeContributionWeeks(raw.login, raw.commitsLastYear),
  };
}

const demos: RawGitHubStats[] = [
  withWeeks({
    login: "torvalds",
    name: "Linus Torvalds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    bio: "Creator of Linux",
    location: "Portland, OR",
    company: null,
    createdAt: "2011-09-03T00:00:00Z",
    followers: 220000,
    following: 0,
    publicRepos: 8,
    totalStars: 180000,
    commitsLastYear: 1200,
    pullRequests: 40,
    issues: 200,
    reviews: 80,
    contributionsLifetime: 15000,
    languageCount: 4,
    topLanguage: "C",
    countryCode: "US",
  }),
  withWeeks({
    login: "gaearon",
    name: "Dan Abramov",
    avatarUrl: "https://avatars.githubusercontent.com/u/810438?v=4",
    bio: "Working on React",
    location: null,
    company: null,
    createdAt: "2011-05-25T00:00:00Z",
    followers: 90000,
    following: 100,
    publicRepos: 80,
    totalStars: 95000,
    commitsLastYear: 600,
    pullRequests: 900,
    issues: 400,
    reviews: 700,
    contributionsLifetime: 12000,
    languageCount: 7,
    topLanguage: "JavaScript",
    countryCode: "GB",
  }),
  withWeeks({
    login: "tj",
    name: "TJ Holowaychuk",
    avatarUrl: "https://avatars.githubusercontent.com/u/25254?v=4",
    bio: null,
    location: "Victoria, BC",
    company: null,
    createdAt: "2008-09-18T00:00:00Z",
    followers: 48000,
    following: 50,
    publicRepos: 300,
    totalStars: 120000,
    commitsLastYear: 900,
    pullRequests: 500,
    issues: 300,
    reviews: 200,
    contributionsLifetime: 20000,
    languageCount: 10,
    topLanguage: "Go",
    countryCode: "CA",
  }),
];

export default function HomePage() {
  const cards = demos.map((d) => buildScoutCard(d));
  return <HomeExperience cards={cards} />;
}
