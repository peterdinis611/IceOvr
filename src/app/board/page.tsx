import type { Metadata } from "next";
import { DraftBoard } from "@/components/DraftBoard";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import {
  loadDraftBoard,
  mergeDraftUsernames,
  parseCupParam,
  parsePlayersParam,
} from "@/lib/draft-board";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Draft Board — Live Season leaderboard",
  description:
    "IceOVR draft board: top OVR, contribution streaks, stars, nation/language cups, and player of the week from Live Season form.",
  alternates: { canonical: "/board" },
};

type BoardSearchParams = Promise<{
  players?: string;
  cup?: string;
}>;

export default async function BoardPage({
  searchParams,
}: {
  searchParams: BoardSearchParams;
}) {
  const params = await searchParams;
  const fromUrl = parsePlayersParam(params.players);
  const usernames = mergeDraftUsernames(fromUrl);
  const cup = parseCupParam(params.cup);
  const rows = await loadDraftBoard(usernames);

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader showScout />
      <DraftBoard
        rows={rows}
        initialUsernames={usernames}
        initialCup={cup}
        urlPlayers={fromUrl}
      />
    </main>
  );
}
