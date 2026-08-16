import type { RawGitHubStats } from "@/lib/types";
import {
  apolloFetchPolicyFor,
  getGitHubApolloClient,
  markApolloHydrated,
} from "./apollo";
import type {
  GraphQLScoutUser,
} from "./graphql-types";
import { mapGraphQLUser } from "./mappers";
import { SCOUT_QUERY } from "./queries";
import { fetchGitHubProfileViaRest } from "./rest";
import { scoutCacheKey } from "@/lib/cache";

/**
 * Scout a GitHub user.
 * Prefer one Apollo GraphQL query + TTL cache when `GITHUB_TOKEN` is set;
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

  const result = await client.query<{ user: GraphQLScoutUser | null }>({
    query: SCOUT_QUERY,
    variables,
    fetchPolicy,
    errorPolicy: "all",
  });

  if (result.error && !result.data?.user) {
    throw result.error;
  }

  const user = result.data?.user;
  if (!user) {
    throw new Error(`Player "${login}" not found in the league.`);
  }

  markApolloHydrated(key);
  return mapGraphQLUser(user);
}

export { mapGraphQLUser, mapContributionCalendar } from "./mappers";
export { fetchGitHubProfileViaRest } from "./rest";
export {
  getGitHubApolloClient,
  createGitHubApolloClient,
  invalidateApolloUser,
} from "./apollo";
