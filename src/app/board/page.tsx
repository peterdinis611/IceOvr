import type { Metadata } from "next";
import { DraftBoard } from "@/components/DraftBoard";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import { loadDraftBoard } from "@/lib/draft-board";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Draft Board — Live Season leaderboard",
  description:
    "IceOVR draft board: top OVR, contribution streaks, stars, and player of the week from Live Season form.",
  alternates: { canonical: "/board" },
};

export default async function BoardPage() {
  const rows = await loadDraftBoard();

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader showScout />
      <DraftBoard rows={rows} />
    </main>
  );
}
