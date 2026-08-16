import { gql } from "@apollo/client";

/** All data required for one scouting report, fetched in a single GitHub request. */
export const SCOUT_QUERY = gql`
  query Scout($login: String!) {
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
      recentPullRequests: pullRequests(
        first: 3
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          title
          createdAt
          repository {
            nameWithOwner
          }
        }
      }
      issues {
        totalCount
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          description
          stargazerCount
          forkCount
          url
          updatedAt
          primaryLanguage {
            name
          }
        }
      }
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
