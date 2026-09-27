import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GitHubApiAlert } from "@/components/GitHubApiAlert";
import { PlayerExperience } from "@/components/PlayerExperience";
import { parseCardStyle } from "@/components/player-card/cardStyles";
import { parseCustomTheme } from "@/components/player-card/customTheme";
import { scoutPlayer } from "@/lib/scout";

/** Must be a literal for Next.js segment config. Keep in sync with SCOUT_REVALIDATE_SECONDS. */
export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ style?: string; theme?: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { style: styleParam, theme: themeParam } = await searchParams;
  const style = parseCardStyle(styleParam);
  const themeQuery =
    style === "custom" && themeParam
      ? `&theme=${encodeURIComponent(themeParam)}`
      : "";

  try {
    const card = await scoutPlayer(username);
    const title = `${card.displayName} — ${card.ovr} OVR GitHub scouting report`;
    const description = `View ${card.displayName}'s public GitHub scouting card: ${card.ovr} OVR, ${card.tier} tier, ${card.raw.stars.toLocaleString()} stars and ${card.raw.commitsLastYear.toLocaleString()} commits this year.`;
    const image = `/${encodeURIComponent(card.username)}.png?style=${style}${themeQuery}`;
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
            url: image,
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
        images: [image],
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
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ style?: string; theme?: string }>;
}) {
  const { username } = await params;
  const { style: styleParam, theme: themeParam } = await searchParams;
  const initialStyle = parseCardStyle(styleParam);
  const initialTheme =
    styleParam === "custom" && themeParam
      ? parseCustomTheme(themeParam)
      : undefined;

  let card;
  try {
    card = await scoutPlayer(username);
  } catch (error) {
    if (isUnknownPlayer(error)) notFound();
    return <GitHubApiAlert username={username} />;
  }

  return (
    <PlayerExperience
      card={card}
      initialStyle={styleParam ? initialStyle : undefined}
      initialTheme={initialTheme}
    />
  );
}

function isUnknownPlayer(error: unknown): boolean {
  return (
    error instanceof Error && /not found in the league/i.test(error.message)
  );
}
