import type { Metadata } from "next";
import { PlayoffBracketView } from "@/components/PlayoffBracket";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import {
  parsePlayoffPlayers,
  resolveBracket,
} from "@/lib/playoffs";
import { scoutPlayer } from "@/lib/scout";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Playoffs — 8-player IceOVR bracket",
  description:
    "Seed eight GitHub profiles into a single-elimination IceOVR playoff bracket with shareable URLs.",
  alternates: { canonical: "/playoffs" },
};

export default async function PlayoffsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const players = parsePlayoffPlayers(params);
  const settled = await Promise.allSettled(
    players.map((username) => scoutPlayer(username)),
  );
  const cards = settled.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
  const bracket =
    players.length >= 2 ? resolveBracket(players, cards) : null;

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader showScout />
      <PlayoffBracketView bracket={bracket} cards={cards} />
    </main>
  );
}
