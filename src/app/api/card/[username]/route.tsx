import { ImageResponse } from "next/og";
import { scoutPlayer } from "@/lib/scout";
import { fetchAvatarDataUrl } from "@/lib/avatar";
import { computeStreak } from "@/components/player-card/fromScout";
import { parseCardStyle } from "@/components/player-card/cardStyles";
import {
  DEFAULT_CUSTOM_THEME,
  parseCustomTheme,
  resolveCustomVisual,
  type CustomCardTheme,
} from "@/components/player-card/customTheme";
import {
  ARENA_TIER_VISUAL,
  BRUTAL_TIER_VISUAL,
  FROST_TIER_VISUAL,
  isFoilTier,
  NEON_TIER_VISUAL,
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
  const url = new URL(request.url);
  const style = parseCardStyle(url.searchParams.get("style"));
  const customTheme = parseCustomTheme(
    url.searchParams.get("theme") ?? undefined,
  );

  try {
    const card = await scoutPlayer(username);
    const tierKey = tierFromRating(card.ovr);
    const avatarSrc = await fetchAvatarDataUrl(card.avatarUrl);
    const streak = computeStreak(card.contributionWeeks);
    const stats = [
      { label: "COMMITS", value: card.raw.commitsLastYear, max: 1200 },
      { label: "PRS", value: card.raw.pullRequests, max: 400 },
      { label: "STARS", value: card.raw.stars, max: 5000 },
      { label: "STREAK", value: streak, max: 60 },
      { label: "REPOS", value: card.raw.publicRepos, max: 80 },
    ];

    const input = { card, tierKey, avatarSrc, stats };
    const body =
      style === "arena"
        ? renderArenaPng(input)
        : style === "brutal"
          ? renderBrutalPng(input)
          : style === "frost"
            ? renderFrostPng(input)
            : style === "neon"
              ? renderNeonPng(input)
              : style === "custom"
                ? renderCustomPng({ ...input, theme: customTheme })
                : renderRetroPng(input);

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
            backgroundColor: "#1a1208",
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
  avatarSrc: string | null;
  stats: Array<{ label: string; value: number; max: number }>;
};

function renderRetroPng(input: PngInput) {
  const visual = TIER_VISUAL[input.tierKey];
  const [stripeA] = TIER_STRIPES[input.tierKey];
  const foil = isFoilTier(input.tierKey);
  return renderSolidEditionPng(input, {
    accent: visual.accent,
    frame: stripeA,
    ovrFill: visual.accent,
    shell: "#1a1208",
    body: "#f0e4d0",
    panel: "#e2d2b8",
    ink: "#1a1208",
    muted: "#6b5344",
    edition: foil ? "FOIL RETRO" : "CARDBOARD RETRO",
    hardShadow: true,
  });
}

function renderArenaPng(input: PngInput) {
  const visual = ARENA_TIER_VISUAL[input.tierKey];
  return renderSolidEditionPng(input, {
    accent: visual.accent,
    frame: visual.accent,
    ovrFill: visual.accent,
    shell: "#020617",
    body: "#0b1220",
    panel: "#12161c",
    ink: "#ffffff",
    muted: "#94a3b8",
    edition: "ARENA NIGHT",
  });
}

type SolidEdition = {
  accent: string;
  frame: string;
  ovrFill: string;
  shell: string;
  body: string;
  panel: string;
  ink: string;
  muted: string;
  edition: string;
  grayscale?: boolean;
  hardShadow?: boolean;
};

/** Solid-color PNG layout — Satori crashes on many CSS gradients (`trim` on undefined). */
function renderSolidEditionPng(
  { card, avatarSrc, stats, tierKey }: PngInput,
  edition: SolidEdition,
) {
  const label = TIER_VISUAL[tierKey].label;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: edition.shell,
      }}
    >
      <div
        style={{
          width: 400,
          height: 560,
          display: "flex",
          padding: 5,
          backgroundColor: edition.frame,
          boxShadow: edition.hardShadow ? "8px 8px 0 #000" : "0 0 0 #0000",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: edition.body,
            color: edition.ink,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", borderBottom: `5px solid ${edition.accent}` }}>
            <div
              style={{
                width: 110,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: edition.ovrFill,
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
                backgroundColor: edition.panel,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 3,
                  color: edition.accent,
                  display: "flex",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 2, display: "flex" }}>
                {edition.edition}
              </div>
            </div>
          </div>

          <div style={{ height: 210, display: "flex", backgroundColor: edition.accent, padding: 8 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                overflow: "hidden",
                backgroundColor: "#0a0908",
                position: "relative",
              }}
            >
              <PortraitFill
                src={avatarSrc}
                width={370}
                height={194}
                grayscale={edition.grayscale}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#0a0908",
              padding: "10px 14px",
              borderBottom: "5px solid #0a0908",
              display: "flex",
              flexDirection: "column",
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
                <span style={{ color: edition.muted }}>{s.label}</span>
                <span>{formatStat(s.value)}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderTop: "2px solid #334155",
              fontSize: 10,
              letterSpacing: 2,
              fontWeight: 900,
            }}
          >
            <span style={{ color: edition.accent }}>ICEOVR</span>
            <span style={{ color: edition.muted }}>{edition.edition}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBrutalPng(input: PngInput) {
  const visual = BRUTAL_TIER_VISUAL[input.tierKey];
  return renderSolidEditionPng(input, {
    accent: visual.accent,
    frame: visual.frame,
    ovrFill: visual.ovrFill,
    shell: "#111111",
    body: "#0a0908",
    panel: "#111111",
    ink: "#ffffff",
    muted: "#94a3b8",
    edition: "PUCK STAMP",
    grayscale: true,
    hardShadow: true,
  });
}

function renderFrostPng(input: PngInput) {
  const visual = FROST_TIER_VISUAL[input.tierKey];
  return renderSolidEditionPng(input, {
    accent: visual.accent,
    frame: visual.accent,
    ovrFill: visual.accent,
    shell: "#0c1929",
    body: "#e8eef4",
    panel: "#ffffff",
    ink: "#0f172a",
    muted: "#64748b",
    edition: "ICE GLASS",
  });
}

function renderNeonPng(input: PngInput) {
  const visual = NEON_TIER_VISUAL[input.tierKey];
  return renderSolidEditionPng(input, {
    accent: visual.accent,
    frame: visual.accent,
    ovrFill: visual.accent,
    shell: "#020617",
    body: "#0b1220",
    panel: "#020617",
    ink: "#ffffff",
    muted: "#94a3b8",
    edition: "NEON RINK",
  });
}

function renderCustomPng(
  input: PngInput & { theme?: CustomCardTheme },
) {
  const theme = input.theme ?? DEFAULT_CUSTOM_THEME;
  const visual = resolveCustomVisual(theme, input.tierKey.toUpperCase());
  return renderSolidEditionPng(input, {
    accent: visual.accent,
    frame: visual.accent,
    ovrFill: visual.accent,
    shell: "#020617",
    body: theme.ink === "light" ? "#f1f5f9" : "#0a0908",
    panel: theme.ink === "light" ? "#ffffff" : "#111111",
    ink: theme.ink === "light" ? "#0f172a" : "#ffffff",
    muted: visual.muted,
    edition: visual.stock || "CUSTOM STUDIO",
    grayscale: visual.photo === "stamp",
  });
}

function PortraitFill({
  src,
  width,
  height,
  grayscale = false,
}: {
  src: string | null;
  width: number;
  height: number;
  grayscale?: boolean;
}) {
  const side = Math.min(width, height);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          width={side}
          height={side}
          alt=""
          style={{
            width: side,
            height: side,
            objectFit: "cover",
            objectPosition: "center",
            filter: grayscale ? "grayscale(1) contrast(1.15)" : "none",
          }}
        />
      ) : (
        <div
          style={{
            width: side * 0.55,
            height: side * 0.55,
            borderRadius: 999,
            backgroundColor: "#334155",
            display: "flex",
          }}
        />
      )}
    </div>
  );
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
