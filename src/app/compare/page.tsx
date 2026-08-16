import { CompareArena } from "@/components/CompareArena";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import { scoutPlayer } from "@/lib/scout";

export const revalidate = 3600;

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const { left, right } = await searchParams;
  const players = [cleanUsername(left), cleanUsername(right)];
  if (!players[0] || !players[1]) {
    return <CompareShell><CompareArena /></CompareShell>;
  }

  const [leftResult, rightResult] = await Promise.allSettled(players.map((username) => scoutPlayer(username!)));
  if (leftResult.status !== "fulfilled" || rightResult.status !== "fulfilled") {
    return <CompareShell><CompareArena error="One of the requested GitHub profiles could not be scouted." /></CompareShell>;
  }

  return <CompareShell><CompareArena left={leftResult.value} right={rightResult.value} /></CompareShell>;
}

function CompareShell({ children }: { children: React.ReactNode }) {
  return <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"><RinkAtmosphere subtle /><SiteHeader showScout />{children}</main>;
}

function cleanUsername(value: string | undefined): string | null {
  const username = value?.trim().replace(/^@/, "") ?? "";
  return /^[a-zA-Z0-9-]{1,39}$/.test(username) ? username : null;
}
