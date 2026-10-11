import { ImageResponse } from "next/og";
import { scoutPlayer } from "@/lib/scout";
import { getSeasonForm } from "@/lib/season";
import { PNG_CACHE_CONTROL } from "@/lib/cache";
import { TIER_META } from "@/lib/tiers";

/** Must be a literal for Next.js segment config. Keep in sync with SCOUT_REVALIDATE_SECONDS. */
export const revalidate = 3600;

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username: raw } = await context.params;
  const username = decodeURIComponent(raw).replace(/-form\.png$/i, "").replace(/\.png$/i, "");

  try {
    const card = await scoutPlayer(username);
    const form = getSeasonForm(card.contributionWeeks);
    const tier = TIER_META[card.tier];
    const arrow =
      form.direction === "rising" ? "▲" : form.direction === "falling" ? "▼" : "◆";
    const tone =
      form.direction === "rising"
        ? "#86efac"
        : form.direction === "falling"
          ? "#fda4af"
          : "#7dd3fc";
    const deltaLabel =
      form.delta > 0 ? `+${form.delta}` : String(form.delta);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "linear-gradient(135deg, #0c1929 0%, #1a1208 55%, #111827 100%)",
            color: "#f8fafc",
            padding: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "repeating-linear-gradient(-28deg, transparent 0 18px, rgba(125,211,252,0.12) 18px 22px)",
              display: "flex",
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              border: "2px solid rgba(255,183,3,0.35)",
              background: "rgba(7,21,36,0.88)",
              padding: 22,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: 3,
                    color: "#7dd3fc",
                    display: "flex",
                  }}
                >
                  LIVE SEASON FORM
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 34,
                    fontWeight: 900,
                    letterSpacing: 1,
                    display: "flex",
                  }}
                >
                  {card.displayName}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 16,
                    color: "rgba(248,250,252,0.65)",
                    display: "flex",
                  }}
                >
                  @{card.username}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "rgba(225,29,46,0.18)",
                  border: "2px solid #e11d2e",
                  padding: "8px 14px",
                }}
              >
                <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, display: "flex" }}>
                  {card.ovr}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: tier.accent,
                    display: "flex",
                  }}
                >
                  OVR
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 14,
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  border: `2px solid ${tone}`,
                  background: "rgba(0,0,0,0.35)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 900,
                    color: tone,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span>{arrow}</span>
                  <span>{form.direction.toUpperCase()}</span>
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    letterSpacing: 2,
                    fontWeight: 800,
                    color: "rgba(248,250,252,0.7)",
                    display: "flex",
                  }}
                >
                  30-DAY TREND
                </div>
              </div>
              <div
                style={{
                  width: 140,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <StatBox label="Δ 30d" value={deltaLabel} accent={tone} />
                <StatBox label="Streak" value={`${form.streak}d`} accent="#7dd3fc" />
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                paddingTop: 16,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 2,
                color: "rgba(248,250,252,0.55)",
              }}
            >
              <span style={{ color: "#ffb703" }}>ICEOVR</span>
              <span>
                {form.current} contrib · last 30d
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 640,
        height: 320,
        headers: {
          "Cache-Control": PNG_CACHE_CONTROL,
          "Content-Disposition": `inline; filename="iceovr-${username}-form.png"`,
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
            background: "#1a1208",
            color: "#e11d2e",
            fontSize: 24,
            padding: 40,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      ),
      { width: 640, height: 320 },
    );
  }
}

function StatBox({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(0,0,0,0.35)",
        padding: 10,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 900, color: accent, display: "flex" }}>
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 2,
          color: "rgba(248,250,252,0.6)",
          display: "flex",
        }}
      >
        {label}
      </div>
    </div>
  );
}
