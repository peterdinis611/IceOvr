import { fetchOrgMembers } from "@/lib/github/org";
import { buildFranchiseRoster } from "@/lib/franchise";
import { scoutPlayer } from "@/lib/scout";

const MAX_SCOUT = 16;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const org = (searchParams.get("org") ?? "")
    .replace(/^@/, "")
    .replace(/[^a-zA-Z0-9-]/g, "");

  if (!org) {
    return Response.json({ error: "Missing org" }, { status: 400 });
  }

  try {
    const { name, members } = await fetchOrgMembers(org);
    if (members.length === 0) {
      return Response.json(
        { error: `No public members found for ${org}.` },
        { status: 404 },
      );
    }

    // Scout a capped set — prefer listed order (public members), then OVR later.
    const toScout = members.slice(0, MAX_SCOUT);
    const settled = await Promise.allSettled(
      toScout.map((member) => scoutPlayer(member.login)),
    );
    const cards = settled.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );

    if (cards.length === 0) {
      return Response.json(
        { error: "Could not scout any org members right now." },
        { status: 502 },
      );
    }

    const assignment = buildFranchiseRoster(name, toScout, cards, MAX_SCOUT);

    return Response.json(
      {
        org,
        name,
        memberCount: members.length,
        scouted: cards.length,
        assignment,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Franchise draft failed";
    const status = /not found/i.test(message) ? 404 : 502;
    return Response.json({ error: message }, { status });
  }
}
