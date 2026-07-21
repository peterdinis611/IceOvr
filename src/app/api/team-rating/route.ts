import { scoutPlayer } from "@/lib/scout";

const MAX_PLAYERS = 16;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usernames = [...new Set(
    (searchParams.get("players") ?? "")
      .split(",")
      .map((value) => value.replace(/^@/, "").replace(/[^a-zA-Z0-9-]/g, ""))
      .filter(Boolean)
      .slice(0, MAX_PLAYERS),
  )];

  const results = await Promise.allSettled(usernames.map((username) => scoutPlayer(username)));
  const cards = results
    .flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
  const ratings = Object.fromEntries(cards.map((card) => [card.username.toLowerCase(), card.ovr]));

  const languages = new Set(cards.map((card) => card.topLanguage).filter(Boolean));
  const countries = new Set(cards.map((card) => card.countryCode).filter(Boolean));
  const connections = cards.flatMap((card, index) =>
    cards.slice(index + 1).flatMap((other) => {
      const reasons: string[] = [];
      if (card.topLanguage && card.topLanguage === other.topLanguage) reasons.push(card.topLanguage);
      if (card.countryCode && card.countryCode === other.countryCode) reasons.push(card.countryCode);
      const score = (card.topLanguage === other.topLanguage ? 7 : 0) + (card.countryCode === other.countryCode ? 5 : 0);
      return score ? [{ players: [card.username, other.username] as [string, string], score, reasons }] : [];
    }),
  ).sort((a, b) => b.score - a.score);
  const teamOvr = cards.length
    ? Math.round(cards.reduce((total, card) => total + card.ovr, 0) / cards.length)
    : null;
  const chemistry = cards.length
    ? Math.min(100, 48 + cards.length * 2 + languages.size * 3 + countries.size * 2)
    : null;

  return Response.json({
    ratings,
    teamOvr,
    chemistry,
    scouted: cards.length,
    requested: usernames.length,
    connections,
  });
}
