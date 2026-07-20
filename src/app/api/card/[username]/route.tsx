import { ImageResponse } from "next/og";
import { scoutPlayer } from "@/lib/scout";
import { TIER_META } from "@/lib/tiers";
import { languageIconUrl } from "@/lib/languages";
import { computeStreak, deriveRole } from "@/components/player-card/fromScout";
import { tierFromRating, TIER_VISUAL } from "@/components/player-card/tierStyles";
import { PNG_CACHE_CONTROL } from "@/lib/cache";

/** Must be a literal for Next.js segment config. Keep in sync with SCOUT_REVALIDATE_SECONDS. */
export const revalidate = 3600;

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username: raw } = await context.params;
  const username = decodeURIComponent(raw).replace(/\.png$/i, "");

  try {
    const card = await scoutPlayer(username);
    const tierKey = tierFromRating(card.ovr);
    const visual = TIER_VISUAL[tierKey];
    const meta = TIER_META[card.tier];
    const role = deriveRole(card.topLanguage);
    const shortPos =
      role === "Frontend"
        ? "FE"
        : role === "Backend"
          ? "BE"
          : role === "Full Stack"
            ? "FS"
            : role === "DevOps"
              ? "OPS"
              : role.slice(0, 3).toUpperCase();
    const langIcon = languageIconUrl(card.topLanguage);
    const streak = computeStreak(card.contributionWeeks);
    const stats = [
      { label: "COMMITS", value: card.raw.commitsLastYear, max: 1200 },
      { label: "PRS", value: card.raw.pullRequests, max: 400 },
      { label: "STARS", value: card.raw.stars, max: 5000 },
      { label: "STREAK", value: streak, max: 60 },
      { label: "REPOS", value: card.raw.publicRepos, max: 80 },
    ];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #020617 0%, #0c1929 55%, #111827 100%)",
          }}
        >
          <div
            style={{
              width: 400,
              height: 560,
              borderRadius: 18,
              display: "flex",
              padding: 6,
              background: visual.frame,
              boxShadow: `0 0 48px ${visual.glow}`,
            }}
          >
            <div
              style={{
                flex: 1,
                borderRadius: 13,
                display: "flex",
                flexDirection: "column",
                background: visual.inner,
                color: "white",
                padding: "16px 16px 12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 78,
                      height: 78,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: visual.ovrFill,
                      clipPath:
                        "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)",
                      fontSize: 36,
                      fontWeight: 900,
                      color: "#0a0908",
                    }}
                  >
                    {card.ovr}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      padding: "2px 8px",
                      fontSize: 14,
                      fontWeight: 800,
                      letterSpacing: 1,
                      background: "#111",
                      border: `1px solid ${visual.accent}88`,
                      display: "flex",
                    }}
                  >
                    {shortPos}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: 2,
                      color: "#0a0908",
                      background: visual.ovrFill,
                      padding: "4px 10px",
                      display: "flex",
                    }}
                  >
                    {visual.label}
                  </div>
                  {langIcon ? (
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.55)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={langIcon} width={18} height={18} alt="" />
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 999,
                    overflow: "hidden",
                    border: `3px solid ${visual.accent}`,
                    boxShadow: `0 0 28px ${visual.glow}`,
                    display: "flex",
                    background: "#0b1220",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.avatarUrl}
                    width={130}
                    height={130}
                    alt=""
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 12,
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: meta.nameplate,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1, display: "flex" }}>
                    {card.displayName}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex" }}>
                    @{card.username}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {stats.map((s) => {
                  const pct = Math.max(4, Math.min(100, (s.value / s.max) * 100));
                  return (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11,
                          letterSpacing: 1,
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>{s.label}</span>
                        <span style={{ fontWeight: 800 }}>{formatStat(s.value)}</span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.1)",
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: `linear-gradient(90deg, ${visual.accent}, #fff)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: visual.accent,
                  fontWeight: 900,
                }}
              >
                <span>ICEOVR</span>
                <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>COLLECTIBLE</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 640,
        height: 840,
        headers: {
          "Cache-Control": PNG_CACHE_CONTROL,
          "Content-Disposition": `inline; filename="iceovr-${username}.png"`,
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scout failed";
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#020617",
            color: "#ef4444",
            fontSize: 28,
            padding: 40,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      ),
      { width: 640, height: 840 },
    );
  }
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
