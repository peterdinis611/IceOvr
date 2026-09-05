import { ImageResponse } from "next/og";
import { scoutPlayer } from "@/lib/scout";
import { languageIconUrl } from "@/lib/languages";
import { computeStreak } from "@/components/player-card/fromScout";
import { parseCardStyle } from "@/components/player-card/cardStyles";
import {
  ARENA_TIER_VISUAL,
  BRUTAL_TIER_VISUAL,
  isFoilTier,
  tierFromRating,
  TIER_STRIPES,
  TIER_VISUAL,
} from "@/components/player-card/tierStyles";
import { PNG_CACHE_CONTROL } from "@/lib/cache";

/** Must be a literal for Next.js segment config. Keep in sync with SCOUT_REVALIDATE_SECONDS. */
export const revalidate = 3600;

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username: raw } = await context.params;
  const username = decodeURIComponent(raw).replace(/\.png$/i, "");
  const style = parseCardStyle(new URL(request.url).searchParams.get("style"));

  try {
    const card = await scoutPlayer(username);
    const tierKey = tierFromRating(card.ovr);
    const langIcon = languageIconUrl(card.topLanguage);
    const streak = computeStreak(card.contributionWeeks);
    const stats = [
      { label: "COMMITS", value: card.raw.commitsLastYear, max: 1200 },
      { label: "PRS", value: card.raw.pullRequests, max: 400 },
      { label: "STARS", value: card.raw.stars, max: 5000 },
      { label: "STREAK", value: streak, max: 60 },
      { label: "REPOS", value: card.raw.publicRepos, max: 80 },
    ];

    const body =
      style === "arena"
        ? renderArenaPng({ card, tierKey, langIcon, stats })
        : style === "brutal"
          ? renderBrutalPng({ card, tierKey, langIcon, stats })
          : renderRetroPng({ card, tierKey, langIcon, stats });

    return new ImageResponse(body, {
      width: 640,
      height: 840,
      headers: {
        "Cache-Control": PNG_CACHE_CONTROL,
        "Content-Disposition": `inline; filename="iceovr-${username}-${style}.png"`,
      },
    });
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
            background: "#1a1208",
            color: "#e11d2e",
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

type PngInput = {
  card: Awaited<ReturnType<typeof scoutPlayer>>;
  tierKey: ReturnType<typeof tierFromRating>;
  langIcon: string | null;
  stats: Array<{ label: string; value: number; max: number }>;
};

function renderRetroPng({ card, tierKey, langIcon, stats }: PngInput) {
  const visual = TIER_VISUAL[tierKey];
  const [stripeA, stripeB] = TIER_STRIPES[tierKey];
  const foil = isFoilTier(tierKey);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #1a1208 0%, #0c1929 55%, #111827 100%)",
      }}
    >
      <div
        style={{
          width: 400,
          height: 560,
          borderRadius: 4,
          display: "flex",
          padding: foil ? 6 : 4,
          background: visual.frame,
          boxShadow: foil
            ? `0 0 40px ${visual.glow}, 0 16px 40px rgba(0,0,0,0.45)`
            : "0 16px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            flex: 1,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            background: visual.inner,
            color: "#1a1208",
            padding: "14px 14px 12px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.35,
              backgroundImage: `repeating-linear-gradient(-32deg, transparent 0 14px, ${stripeA}55 14px 22px, transparent 22px 36px, ${stripeB}44 36px 42px)`,
              display: "flex",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "2px solid #1a1208",
                background: visual.ovrFill,
                padding: "4px 8px 6px",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, display: "flex" }}>{card.ovr}</div>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, display: "flex" }}>OVR</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: "#1a1208",
                  background: stripeB,
                  border: "2px solid #1a1208",
                  padding: "3px 8px",
                  display: "flex",
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.2)",
                }}
              >
                {visual.label}
              </div>
              {langIcon ? (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: "rgba(255,255,255,0.7)",
                    border: "1px solid rgba(26,18,8,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={langIcon} width={16} height={16} alt="" />
                </div>
              ) : null}
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", position: "relative", flex: 1 }}>
            <div
              style={{
                width: "100%",
                height: 200,
                border: "3px solid #fff",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
                display: "flex",
                overflow: "hidden",
                background: `linear-gradient(135deg, ${stripeA} 0 38%, ${stripeB} 38% 62%, ${stripeA} 62% 100%)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.avatarUrl}
                width={370}
                height={200}
                alt=""
                style={{ objectFit: "cover", objectPosition: "top", width: "100%", height: "100%" }}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                width: "100%",
                padding: "8px 10px",
                border: "2px solid #1a1208",
                background: `linear-gradient(90deg, ${stripeA}, #1a1208 40%, #1a1208 60%, ${stripeB})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "2px 2px 0 rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 1, lineHeight: 1, color: "#ffffff", display: "flex" }}>
                {card.displayName}
              </div>
              <div style={{ marginTop: 4, fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", display: "flex" }}>
                @{card.username}
              </div>
            </div>
          </div>

          <StatRows stats={stats} ink stripe={stripeA} />

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              borderTop: "1px solid rgba(26,18,8,0.2)",
              fontSize: 10,
              letterSpacing: 2,
              color: "#1a1208",
              fontWeight: 900,
              position: "relative",
            }}
          >
            <span style={{ color: visual.accent }}>ICEOVR</span>
            <span style={{ color: "rgba(26,18,8,0.55)", fontWeight: 700 }}>
              {foil ? "FOIL" : "CARDBOARD"} · RETRO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderArenaPng({ card, tierKey, langIcon, stats }: PngInput) {
  const visual = ARENA_TIER_VISUAL[tierKey];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
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
            padding: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.85, display: "flex" }}>{card.ovr}</div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.65)", fontWeight: 800, display: "flex" }}>
                OVR
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: "#061018",
                  background: visual.accent,
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

          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 999,
                overflow: "hidden",
                border: `3px solid ${visual.accent}`,
                boxShadow: `0 0 28px ${visual.glow}`,
                display: "flex",
                background: "#0b1220",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.avatarUrl} width={140} height={140} alt="" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ marginTop: 14, fontSize: 24, fontWeight: 900, letterSpacing: 1, display: "flex" }}>
              {card.displayName}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.7)", display: "flex" }}>
              @{card.username}
            </div>
          </div>

          <StatRows stats={stats} accent={visual.accent} />

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 10,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: 10,
              letterSpacing: 3,
              fontWeight: 900,
            }}
          >
            <span style={{ color: visual.accent }}>ICEOVR</span>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>ARENA NIGHT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBrutalPng({ card, tierKey, stats }: PngInput) {
  const visual = BRUTAL_TIER_VISUAL[tierKey];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
      }}
    >
      <div
        style={{
          width: 400,
          height: 560,
          display: "flex",
          padding: 5,
          background: visual.frame,
          boxShadow: "8px 8px 0 #000",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#0a0908",
            color: "white",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", borderBottom: `5px solid ${visual.accent}` }}>
            <div
              style={{
                width: 110,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: visual.ovrFill,
                color: "#0a0908",
                padding: 10,
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, display: "flex" }}>{card.ovr}</div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, display: "flex" }}>OVR</div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 8,
                padding: 12,
                borderLeft: "5px solid #0a0908",
                background: "#111",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 3, color: visual.accent, display: "flex" }}>
                {visual.label}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, display: "flex" }}>PUCK STAMP</div>
            </div>
          </div>

          <div style={{ height: 210, display: "flex", background: visual.accent, padding: 8 }}>
            <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "#0a0908" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.avatarUrl}
                width={370}
                height={194}
                alt=""
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                  width: "100%",
                  height: "100%",
                  filter: "grayscale(1) contrast(1.2)",
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: "white",
              color: "#0a0908",
              padding: "10px 14px",
              borderBottom: "5px solid #0a0908",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, display: "flex" }}>{card.displayName}</div>
            <div style={{ marginTop: 4, fontSize: 12, fontWeight: 800, opacity: 0.65, display: "flex" }}>
              @{card.username}
            </div>
          </div>

          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
                <span>{formatStat(s.value)}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderTop: "2px solid rgba(255,255,255,0.15)",
              fontSize: 10,
              letterSpacing: 2,
              fontWeight: 900,
            }}
          >
            <span style={{ color: visual.accent }}>ICEOVR</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>BRUTAL CUT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRows({
  stats,
  ink = false,
  stripe,
  accent,
}: {
  stats: Array<{ label: string; value: number; max: number }>;
  ink?: boolean;
  stripe?: string;
  accent?: string;
}) {
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
      {stats.map((s) => {
        const pct = Math.max(4, Math.min(100, (s.value / s.max) * 100));
        return (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: 1 }}>
              <span style={{ color: ink ? "rgba(26,18,8,0.65)" : "rgba(255,255,255,0.7)", fontWeight: 800 }}>
                {s.label}
              </span>
              <span style={{ color: ink ? "#1a1208" : "#ffffff", fontWeight: 900 }}>{formatStat(s.value)}</span>
            </div>
            <div
              style={{
                height: 5,
                background: ink ? "rgba(26,18,8,0.12)" : "rgba(255,255,255,0.1)",
                display: "flex",
                overflow: "hidden",
                border: ink ? "1px solid rgba(26,18,8,0.2)" : "none",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: stripe ?? accent ?? "#e11d2e",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
