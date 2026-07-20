import type { RawGitHubStats } from "@/lib/types";
import {
  apolloFetchPolicyFor,
  getGitHubApolloClient,
  markApolloHydrated,
} from "./apollo";
import type {
  GraphQLScoutUser,
  ScoutContributionsUser,
  ScoutProfileUser,
  ScoutReposUser,
} from "./graphql-types";
import { mapGraphQLUser } from "./mappers";
import {
  SCOUT_CONTRIBUTIONS_QUERY,
  SCOUT_PROFILE_QUERY,
  SCOUT_REPOS_QUERY,
} from "./queries";
import { fetchGitHubProfileViaRest } from "./rest";
import { scoutCacheKey } from "@/lib/cache";

/**
 * Scout a GitHub user.
 * Prefer Apollo GraphQL (3 parallel queries + TTL cache) when `GITHUB_TOKEN` is set;
 * otherwise fall back to public REST.
 */
export async function fetchGitHubProfile(
  login: string,
): Promise<RawGitHubStats> {
  const client = getGitHubApolloClient();
  if (!client) {
    return fetchGitHubProfileViaRest(login);
  }

  try {
    return await fetchViaApollo(login);
  } catch (error) {
    console.warn(
      `[IceOVR] GraphQL scout failed for ${login}, falling back to REST:`,
      error instanceof Error ? error.message : error,
    );
    return fetchGitHubProfileViaRest(login);
  }
}

async function fetchViaApollo(login: string): Promise<RawGitHubStats> {
  const client = getGitHubApolloClient();
  if (!client) {
    throw new Error("Apollo client unavailable");
  }

  const key = scoutCacheKey(login);
  const variables = { login: key };
  const fetchPolicy = apolloFetchPolicyFor(key);

  const [profileResult, reposResult, contribResult] = await Promise.all([
    client.query<{ user: ScoutProfileUser | null }>({
      query: SCOUT_PROFILE_QUERY,
      variables,
      fetchPolicy,
      errorPolicy: "all",
    }),
    client.query<{ user: ScoutReposUser | null }>({
      query: SCOUT_REPOS_QUERY,
      variables,
      fetchPolicy,
      errorPolicy: "all",
    }),
    client.query<{ user: ScoutContributionsUser | null }>({
      query: SCOUT_CONTRIBUTIONS_QUERY,
      variables,
      fetchPolicy,
      errorPolicy: "all",
    }),
  ]);

  const firstError =
    profileResult.error ?? reposResult.error ?? contribResult.error;
  if (firstError && !profileResult.data?.user) {
    throw firstError;
  }

  const profile = profileResult.data?.user;
  const repos = reposResult.data?.user;
  const contrib = contribResult.data?.user;

  if (!profile || !repos || !contrib) {
    throw new Error(`Player "${login}" not found in the league.`);
  }

  const merged: GraphQLScoutUser = {
    ...profile,
    repositories: repos.repositories,
    contributionsCollection: contrib.contributionsCollection,
  };

  markApolloHydrated(key);
  return mapGraphQLUser(merged);
}

export { mapGraphQLUser, mapContributionCalendar } from "./mappers";
export { fetchGitHubProfileViaRest } from "./rest";
export {
  getGitHubApolloClient,
  createGitHubApolloClient,
  invalidateApolloUser,
} from "./apollo";
