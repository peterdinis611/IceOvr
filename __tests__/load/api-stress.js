import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

const baseUrl = __ENV.BASE_URL || "http://localhost:3000";
const username = __ENV.K6_USERNAME || "octocat";
const players = __ENV.K6_PLAYERS || username;
const searchQuery = __ENV.K6_SEARCH_QUERY || username.slice(0, Math.max(2, username.length - 2));

const cardDuration = new Trend("card_duration", true);
const ratingDuration = new Trend("team_rating_duration", true);
const searchDuration = new Trend("search_duration", true);

export const options = {
  stages: [
    { duration: "10s", target: 2 },
    { duration: "30s", target: 5 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"],
    card_duration: ["p(95)<2000"],
    team_rating_duration: ["p(95)<2500"],
    search_duration: ["p(95)<800"],
  },
};

export default function apiStressTest() {
  const selector = __ITER % 3;
  let response;

  if (selector === 0) {
    response = http.get(`${baseUrl}/api/card/${encodeURIComponent(username)}`);
    cardDuration.add(response.timings.duration);
    check(response, {
      "card returns 200": (result) => result.status === 200,
      "card returns an image": (result) =>
        (result.headers["Content-Type"] || "").includes("image/png"),
    });
  } else if (selector === 1) {
    response = http.get(
      `${baseUrl}/api/team-rating?players=${encodeURIComponent(players)}`,
    );
    ratingDuration.add(response.timings.duration);
    check(response, {
      "team rating returns 200": (result) => result.status === 200,
      "team rating returns JSON": (result) =>
        (result.headers["Content-Type"] || "").includes("application/json"),
    });
  } else {
    response = http.get(
      `${baseUrl}/api/github-search?q=${encodeURIComponent(searchQuery)}`,
    );
    searchDuration.add(response.timings.duration);
    check(response, {
      "search returns 200": (result) => result.status === 200,
      "search returns JSON": (result) =>
        (result.headers["Content-Type"] || "").includes("application/json"),
    });
  }

  sleep(0.5);
}
