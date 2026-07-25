import { notFound } from "next/navigation";
import { GitHubApiAlert } from "@/components/GitHubApiAlert";
import { PlayerExperience } from "@/components/PlayerExperience";
import { scoutPlayer } from "@/lib/scout";

/** Must be a literal for Next.js segment config. Keep in sync with SCOUT_REVALIDATE_SECONDS. */
export const revalidate = 3600;

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let card;
  try {
    card = await scoutPlayer(username);
  } catch (error) {
    if (isUnknownPlayer(error)) notFound();
    return <GitHubApiAlert username={username} />;
  }

  return <PlayerExperience card={card} />;
}

function isUnknownPlayer(error: unknown): boolean {
  return error instanceof Error && /not found in the league/i.test(error.message);
}
