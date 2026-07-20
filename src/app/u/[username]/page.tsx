import { notFound } from "next/navigation";
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
  } catch {
    notFound();
  }

  return <PlayerExperience card={card} />;
}
