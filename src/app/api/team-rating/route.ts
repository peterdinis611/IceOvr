import { loadCollaborationSignals } from "@/lib/github/collaboration";
import { scoutPlayer } from "@/lib/scout";

const MAX_PLAYERS = 16;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usernames = [
    ...new Set(
      (searchParams.get("players") ?? "")
        .split(",")
        .map((value) => value.replace(/^@/, "").replace(/[^a-zA-Z0-9-]/g, ""))
        .filter(Boolean)
        .slice(0, MAX_PLAYERS),
    ),
  ];

  const results = await Promise.allSettled(
    usernames.map((username) => scoutPlayer(username)),
  );
  const cards = results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
  const ratings = Object.fromEntries(
    cards.map((card) => [card.username.toLowerCase(), card.ovr]),
  );

  const languages = new Set(
    cards.map((card) => card.topLanguage).filter(Boolean),
  );
  const countries = new Set(
    cards.map((card) => card.countryCode).filter(Boolean),
  );

  const collabSignals = await loadCollaborationSignals(
    cards.map((card) => card.username),
  );
  const collabByPair = new Map(
    collabSignals.map((signal) => {
      const key = [...signal.players].map((p) => p.toLowerCase()).sort().join("|");
      return [key, signal] as const;
    }),
  );

  const connections = cards
    .flatMap((card, index) =>
      cards.slice(index + 1).flatMap((other) => {
        const reasons: string[] = [];
        let score = 0;
        if (card.topLanguage && card.topLanguage === other.topLanguage) {
          reasons.push(card.topLanguage);
          score += 7;
        }
        if (card.countryCode && card.countryCode === other.countryCode) {
          reasons.push(card.countryCode);
          score += 5;
        }
        const pairKey = [card.username, other.username]
          .map((name) => name.toLowerCase())
          .sort()
          .join("|");
        const collab = collabByPair.get(pairKey);
        if (collab) {
          score += collab.score;
          reasons.push(...collab.reasons);
        }
        return score
          ? [
              {
                players: [card.username, other.username] as [string, string],
                score,
                reasons,
              },
            ]
          : [];
      }),
    )
    .sort((a, b) => b.score - a.score);

  const collabBoost = Math.min(
    18,
    collabSignals.reduce((sum, signal) => sum + Math.min(12, signal.score), 0) /
      Math.max(1, cards.length),
  );

  const teamOvr = cards.length
    ? Math.round(
        cards.reduce((total, card) => total + card.ovr, 0) / cards.length,
      )
    : null;
  const chemistry = cards.length
    ? Math.min(
        100,
        Math.round(
          48 +
            cards.length * 2 +
            languages.size * 3 +
            countries.size * 2 +
            collabBoost,
        ),
      )
    : null;

  return Response.json(
    {
      ratings,
      teamOvr,
      chemistry,
      scouted: cards.length,
      requested: usernames.length,
      connections,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
