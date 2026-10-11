import { SCOUT_REVALIDATE_SECONDS } from "@/lib/cache";
import { unstable_cache } from "next/cache";

const REST = "https://api.github.com";
const MAX_ORG_MEMBERS = 40;

export type OrgMember = {
  login: string;
  avatarUrl: string;
  role: "admin" | "member";
};

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "IceOVR-Scout",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchOrgMembersUncached(org: string): Promise<{
  org: string;
  name: string;
  members: OrgMember[];
}> {
  const clean = org.replace(/^@/, "").replace(/[^a-zA-Z0-9-]/g, "");
  if (!clean) throw new Error("Organization login is required.");

  const headers = githubHeaders();
  const [orgRes, membersRes, adminsRes] = await Promise.all([
    fetch(`${REST}/orgs/${encodeURIComponent(clean)}`, {
      headers,
      next: { revalidate: SCOUT_REVALIDATE_SECONDS },
    }),
    fetch(
      `${REST}/orgs/${encodeURIComponent(clean)}/public_members?per_page=${MAX_ORG_MEMBERS}`,
      {
        headers,
        next: { revalidate: SCOUT_REVALIDATE_SECONDS },
      },
    ),
    // Best-effort; often 403 for outsiders — then everyone stays "member".
    fetch(
      `${REST}/orgs/${encodeURIComponent(clean)}/members?role=admin&per_page=100`,
      {
        headers,
        next: { revalidate: SCOUT_REVALIDATE_SECONDS },
      },
    ),
  ]);

  if (orgRes.status === 404) {
    throw new Error(`Organization "${clean}" not found.`);
  }
  if (!orgRes.ok) {
    throw new Error(`GitHub org API error: ${orgRes.status}`);
  }
  if (!membersRes.ok) {
    throw new Error(`Could not load public members for ${clean}.`);
  }

  const orgBody = (await orgRes.json()) as {
    login: string;
    name: string | null;
  };
  const membersBody = (await membersRes.json()) as Array<{
    login: string;
    avatar_url: string;
  }>;
  const adminLogins = new Set<string>();
  if (adminsRes.ok) {
    const admins = (await adminsRes.json()) as Array<{ login: string }>;
    for (const admin of admins) adminLogins.add(admin.login.toLowerCase());
  }

  const members: OrgMember[] = membersBody
    .slice(0, MAX_ORG_MEMBERS)
    .map((member) => ({
      login: member.login,
      avatarUrl: member.avatar_url,
      role: adminLogins.has(member.login.toLowerCase()) ? "admin" : "member",
    }));

  return {
    org: orgBody.login,
    name: orgBody.name ?? orgBody.login,
    members,
  };
}

export async function fetchOrgMembers(org: string) {
  const key = org.replace(/^@/, "").toLowerCase();
  return unstable_cache(
    () => fetchOrgMembersUncached(key),
    ["iceovr-org-members", key],
    { revalidate: SCOUT_REVALIDATE_SECONDS },
  )();
}
