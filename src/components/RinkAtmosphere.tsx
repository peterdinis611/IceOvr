import { RinkParallaxLayer } from "@/components/RinkParallaxLayer";

function buildFlakes(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    delay: (i % 9) * 0.35,
    duration: 8 + (i % 5),
    size: 2 + (i % 3),
    opacity: 0.1 + (i % 4) * 0.05,
  }));
}

/** Server Component — CSS atmosphere with an optional client parallax island. */
export function RinkAtmosphere({
  subtle = false,
  parallax = false,
}: {
  subtle?: boolean;
  parallax?: boolean;
}) {
  const flakes = buildFlakes(subtle ? 14 : 24);

  const movingLayer = (
    <>
      <div className="spot-beam absolute left-[12%] top-0 h-[50vh] w-36 bg-[linear-gradient(180deg,rgba(125,211,252,0.14),transparent)] blur-3xl" />
      <div
        className="spot-beam absolute right-[10%] top-0 h-[45vh] w-40 bg-[linear-gradient(180deg,rgba(225,29,46,0.1),transparent)] blur-3xl"
        style={{ animationDelay: "-3s" }}
      />
      {!subtle && (
        <>
          <div className="absolute left-1/2 top-[38%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7dd3fc]/10" />
          <div className="absolute left-1/2 top-[38%] h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e11d2e]/15" />
        </>
      )}
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="rink-flake absolute top-[-10%] rounded-full bg-white"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        />
      ))}
    </>
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: subtle
            ? "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(56,189,248,0.1), transparent 55%)"
            : undefined,
          opacity: subtle ? 1 : undefined,
        }}
      />
      {!subtle && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 0%, rgba(125,211,252,0.04) 50%, transparent 100%)",
            backgroundSize: "100% 56px",
          }}
        />
      )}
      <div className="noise-overlay absolute inset-0" />
      <div className="ice-boards absolute inset-3 rounded-[32px]" />
      <div className="ice-faceoff absolute left-1/2 top-[28%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="radar-sweep absolute inset-0 opacity-25" />

      {parallax ? (
        <RinkParallaxLayer>{movingLayer}</RinkParallaxLayer>
      ) : (
        <div className="absolute inset-0">{movingLayer}</div>
      )}
    </div>
  );
}
