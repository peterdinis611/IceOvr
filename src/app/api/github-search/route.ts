const GITHUB_API = "https://api.github.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().replace(/[^\w-]/g, "").slice(0, 39);
  if (query.length < 2) return Response.json({ users: [] });

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "IceOVR-Team-Builder",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(
    `${GITHUB_API}/search/users?q=${encodeURIComponent(query)}+in:login&per_page=5`,
    { headers, next: { revalidate: 60 } },
  );
  if (!response.ok) return Response.json({ users: [] });

  const payload = (await response.json()) as {
    items: Array<{ login: string; avatar_url: string; html_url: string }>;
  };
  return Response.json({
    users: payload.items.map((user) => ({
      login: user.login,
      avatarUrl: user.avatar_url,
      url: user.html_url,
    })),
  });
}
