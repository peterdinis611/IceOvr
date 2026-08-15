export type ScoutProfileUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  pullRequests: { totalCount: number };
  recentPullRequests: {
    nodes: Array<{
      title: string;
      createdAt: string;
      repository: { nameWithOwner: string } | null;
    } | null>;
  };
  issues: { totalCount: number };
};

export type ScoutReposUser = {
  login: string;
  repositories: {
    totalCount: number;
    nodes: Array<{
      name: string;
      description: string | null;
      stargazerCount: number;
      forkCount: number;
      url: string;
      updatedAt: string;
      primaryLanguage: { name: string } | null;
    } | null>;
  };
};

export type ScoutContributionsUser = {
  login: string;
  contributionsCollection: {
    totalCommitContributions: number;
    restrictedContributionsCount: number;
    contributionCalendar: {
      totalContributions: number;
      weeks: Array<{
        contributionDays: Array<{
          date: string;
          contributionCount: number;
        }>;
      }>;
    };
  };
};

/** Merged shape after parallel Apollo queries. */
export type GraphQLScoutUser = ScoutProfileUser &
  ScoutReposUser &
  ScoutContributionsUser;
