import { ImageResponse } from "next/og";

export const alt = "IceOVR GitHub scouting cards";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        padding: "72px 84px",
        background:
          "radial-gradient(circle at 82% 18%, rgba(125,211,252,.28), transparent 28%), linear-gradient(135deg, #020617, #071b2d)",
        color: "white",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            "linear-gradient(rgba(125,211,252,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.28) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 7,
            color: "#7dd3fc",
          }}
        >
          GITHUB SCOUTING DEPARTMENT
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            fontSize: 94,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.88,
          }}
        >
          ICE<span style={{ color: "#e11d2e" }}>OVR</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 34, color: "#cbd5e1" }}>
          Your GitHub profile, scouted for the draft board.
        </div>
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 300,
          height: 420,
          border: "5px solid #7dd3fc",
          borderRadius: 28,
          background:
            "linear-gradient(150deg, rgba(125,211,252,.22), rgba(225,29,46,.18))",
          boxShadow: "0 0 60px rgba(125,211,252,.32)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 112, fontWeight: 900, lineHeight: 1 }}>
            99
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 5,
            }}
          >
            GITHUB CARD
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
