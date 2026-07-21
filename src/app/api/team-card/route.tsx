import { ImageResponse } from "next/og";

export const runtime = "edge";

const POSITIONS = [
  { key: "lw", label: "LW", left: 170, top: 185 },
  { key: "c", label: "C", left: 470, top: 135 },
  { key: "rw", label: "RW", left: 770, top: 185 },
  { key: "ld", label: "LD", left: 310, top: 365 },
  { key: "rd", label: "RD", left: 635, top: 365 },
  { key: "g", label: "G", left: 935, top: 325 },
] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = sanitizeName(searchParams.get("name")) || "My IceOVR Team";
  const players = POSITIONS.map((position) => ({
    ...position,
    username: sanitizeUsername(searchParams.get(position.key)),
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(145deg, #030d18 0%, #0b2b44 52%, #07121f 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          padding: 54,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 54,
            right: 54,
            top: 130,
            bottom: 46,
            borderRadius: 28,
            border: "2px solid rgba(125,211,252,.32)",
            background:
              "linear-gradient(90deg, transparent 49.75%, rgba(225,29,46,.72) 49.75% 50.25%, transparent 50.25%), linear-gradient(180deg, rgba(125,211,252,.13), rgba(125,211,252,.04))",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 335,
            width: 150,
            height: 150,
            border: "2px solid rgba(125,211,252,.32)",
            borderRadius: 999,
            transform: "translate(-50%, -50%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 5, color: "#7dd3fc" }}>ICEOVR · FRANCHISE MODE</span>
          <span style={{ marginTop: 8, fontSize: 48, fontWeight: 900, letterSpacing: 1 }}>{name.toUpperCase()}</span>
          <span style={{ marginTop: 8, fontSize: 16, letterSpacing: 3, color: "rgba(255,255,255,.55)" }}>GITHUB STARTING SIX</span>
        </div>
        <div style={{ position: "absolute", right: 58, top: 55, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 3, color: "#fda4af" }}>NHL-STYLE</span>
          <span style={{ marginTop: 5, fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,.45)" }}>UNOFFICIAL CONCEPT</span>
        </div>
        {players.map((player) => (
          <div
            key={player.key}
            style={{
              position: "absolute",
              left: player.left,
              top: player.top,
              width: 150,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                display: "flex",
                overflow: "hidden",
                borderRadius: 999,
                border: "3px solid rgba(255,255,255,.7)",
                background: "rgba(2,11,20,.85)",
              }}
            >
              {player.username ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://github.com/${player.username}.png?size=160`} width={96} height={96} alt="" />
              ) : null}
            </div>
            <span style={{ marginTop: 10, fontSize: 15, fontWeight: 900, letterSpacing: 1, color: player.username ? "white" : "rgba(255,255,255,.42)" }}>
              {player.username ? `@${player.username}` : "OPEN SLOT"}
            </span>
            <span style={{ marginTop: 3, fontSize: 12, fontWeight: 800, letterSpacing: 3, color: "#7dd3fc" }}>{player.label}</span>
          </div>
        ))}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${fileName(name)}-lineup.png"`,
      },
    },
  );
}

function sanitizeUsername(value: string | null): string | null {
  if (!value) return null;
  const clean = value.replace(/^@/, "").replace(/[^a-zA-Z0-9-]/g, "");
  return clean || null;
}

function sanitizeName(value: string | null): string {
  return (value ?? "").replace(/[^\p{L}\p{N} .'-]/gu, "").trim().slice(0, 42);
}

function fileName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "iceovr-team";
}
