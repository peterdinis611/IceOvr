import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import {
  SCOUT_REVALIDATE_SECONDS,
  SCOUT_TTL_MS,
  TtlMap,
  scoutCacheKey,
} from "@/lib/cache";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/** Tracks when we last hydrated Apollo for a login — drives network vs cache-first. */
const apolloHydratedAt = new TtlMap<true>(SCOUT_TTL_MS, 1000);

function githubFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, {
    ...init,
    next: {
      revalidate: SCOUT_REVALIDATE_SECONDS,
      tags: ["github-graphql"],
    },
  });
}

/** Server-side Apollo client for GitHub GraphQL (token required). */
export function createGitHubApolloClient(token: string): ApolloClient {
  const httpLink = new HttpLink({
    uri: GITHUB_GRAPHQL,
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "IceOVR-Scout",
      Accept: "application/vnd.github+json",
    },
    fetch: githubFetch,
  });

  const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      for (const err of error.errors) {
        console.error(`[GitHub GraphQL] ${err.message}`);
      }
      return;
    }
    console.error(`[GitHub network]`, error);
  });

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          keyFields: ["login"],
          fields: {
            // Parallel scout queries write different slices — keep siblings
            repositories: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
            contributionsCollection: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
            followers: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
            following: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
            pullRequests: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
            issues: {
              merge(_existing, incoming) {
                return incoming;
              },
            },
          },
        },
        Query: {
          fields: {
            user: {
              keyArgs: ["login"],
              merge(_existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}

let singleton: ApolloClient | null = null;
let singletonToken: string | null = null;

/** Reuses one Apollo instance per process/token (InMemoryCache across scouts). */
export function getGitHubApolloClient(): ApolloClient | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  if (!singleton || singletonToken !== token) {
    singleton = createGitHubApolloClient(token);
    singletonToken = token;
    apolloHydratedAt.clear();
  }
  return singleton;
}

/** `cache-first` while TTL is warm; otherwise force network refresh. */
export function apolloFetchPolicyFor(
  login: string,
): "cache-first" | "network-only" {
  const key = scoutCacheKey(login);
  return apolloHydratedAt.has(key) ? "cache-first" : "network-only";
}

export function markApolloHydrated(login: string): void {
  apolloHydratedAt.set(scoutCacheKey(login), true);
}

export function invalidateApolloUser(login: string): void {
  const key = scoutCacheKey(login);
  apolloHydratedAt.delete(key);
  const client = getGitHubApolloClient();
  if (!client) return;
  client.cache.evict({
    id: client.cache.identify({ __typename: "User", login: key }),
  });
  client.cache.gc();
}
