import { gql } from "@apollo/client";

/** Core identity + social + PR/issue counts. */
export const SCOUT_PROFILE_QUERY = gql`
  query ScoutProfile($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      location
      company
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      pullRequests {
        totalCount
      }
      issues {
        totalCount
      }
    }
  }
`;

/** Owned repos — stars + primary languages. */
export const SCOUT_REPOS_QUERY = gql`
  query ScoutRepos($login: String!) {
    user(login: $login) {
      login
      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          stargazerCount
          primaryLanguage {
            name
          }
        }
      }
    }
  }
`;

/** Contribution calendar + commit totals. */
export const SCOUT_CONTRIBUTIONS_QUERY = gql`
  query ScoutContributions($login: String!) {
    user(login: $login) {
      login
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;
