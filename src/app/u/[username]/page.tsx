import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GitHubApiAlert } from "@/components/GitHubApiAlert";
import { PlayerExperience } from "@/components/PlayerExperience";
import { scoutPlayer } from "@/lib/scout";

/** Must be a literal for Next.js segment config. Keep in sync with SCOUT_REVALIDATE_SECONDS. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  try {
    const card = await scoutPlayer(username);
    const title = `${card.displayName} — ${card.ovr} OVR GitHub scouting report`;
    const description = `View ${card.displayName}'s public GitHub scouting card: ${card.ovr} OVR, ${card.tier} tier, ${card.raw.stars.toLocaleString()} stars and ${card.raw.commitsLastYear.toLocaleString()} commits this year.`;
    return {
      title,
      description,
      alternates: { canonical: `/u/${encodeURIComponent(card.username)}` },
      openGraph: {
        title,
        description,
        type: "profile",
        images: [
          {
            url: `/${encodeURIComponent(card.username)}.png`,
            width: 640,
            height: 840,
            alt: `${card.displayName}'s IceOVR card`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`/${encodeURIComponent(card.username)}.png`],
      },
    };
  } catch {
    return {
      title: "GitHub player scouting report",
      description: "View a public GitHub player scouting report on IceOVR.",
    };
  }
}

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
  return (
    error instanceof Error && /not found in the league/i.test(error.message)
  );
}
