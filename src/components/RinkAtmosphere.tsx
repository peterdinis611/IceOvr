import { RinkParallaxLayer } from "@/components/RinkParallaxLayer";

function buildFlakes(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    delay: (i % 9) * 0.35,
    duration: 8 + (i % 5),
    size: 2 + (i % 3),
    opacity: 0.08 + (i % 4) * 0.04,
  }));
}

/** Server Component — rink under floodlights: boards, blue lines, crease, faceoff. */
export function RinkAtmosphere({
  subtle = false,
  parallax = false,
}: {
  subtle?: boolean;
  parallax?: boolean;
}) {
  const flakes = buildFlakes(subtle ? 12 : 20);

  const movingLayer = (
    <>
      <div className="spot-beam absolute left-[8%] top-0 h-[55vh] w-44 bg-[linear-gradient(180deg,rgba(255,183,3,0.16),transparent)] blur-3xl" />
      <div
        className="spot-beam absolute right-[6%] top-0 h-[48vh] w-48 bg-[linear-gradient(180deg,rgba(225,29,46,0.12),transparent)] blur-3xl"
        style={{ animationDelay: "-3s" }}
      />
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="rink-flake absolute top-[-10%] rounded-full bg-[#efe6d2]"
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
            ? "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,183,3,0.1), transparent 55%)"
            : "radial-gradient(ellipse 90% 55% at 50% 42%, rgba(239,230,210,0.04), transparent 62%)",
        }}
      />

      {/* Glass + boards */}
      <div className="rink-boards absolute inset-2 sm:inset-3" />

      {/* Ice surface markings */}
      {!subtle && (
        <svg
          className="absolute inset-[4%] opacity-[0.55] sm:inset-[5%]"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          {/* Outer ice edge */}
          <rect
            x="2"
            y="2"
            width="196"
            height="96"
            rx="14"
            fill="none"
            stroke="rgba(239,230,210,0.12)"
            strokeWidth="0.6"
          />
          {/* Blue lines */}
          <line x1="66" y1="4" x2="66" y2="96" stroke="rgba(59,130,246,0.28)" strokeWidth="1.4" />
          <line x1="134" y1="4" x2="134" y2="96" stroke="rgba(59,130,246,0.28)" strokeWidth="1.4" />
          {/* Center red line */}
          <line x1="100" y1="4" x2="100" y2="96" stroke="rgba(225,29,46,0.45)" strokeWidth="1.8" />
          {/* Center faceoff circle */}
          <circle cx="100" cy="50" r="14" fill="none" stroke="rgba(225,29,46,0.35)" strokeWidth="0.9" />
          <circle cx="100" cy="50" r="1.4" fill="rgba(225,29,46,0.55)" />
          {/* End-zone faceoff dots */}
          <circle cx="38" cy="28" r="7" fill="none" stroke="rgba(225,29,46,0.22)" strokeWidth="0.7" />
          <circle cx="38" cy="72" r="7" fill="none" stroke="rgba(225,29,46,0.22)" strokeWidth="0.7" />
          <circle cx="162" cy="28" r="7" fill="none" stroke="rgba(225,29,46,0.22)" strokeWidth="0.7" />
          <circle cx="162" cy="72" r="7" fill="none" stroke="rgba(225,29,46,0.22)" strokeWidth="0.7" />
          <circle cx="38" cy="28" r="1" fill="rgba(225,29,46,0.4)" />
          <circle cx="38" cy="72" r="1" fill="rgba(225,29,46,0.4)" />
          <circle cx="162" cy="28" r="1" fill="rgba(225,29,46,0.4)" />
          <circle cx="162" cy="72" r="1" fill="rgba(225,29,46,0.4)" />
          {/* Goal creases */}
          <path
            d="M8 38 A12 12 0 0 1 8 62"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(225,29,46,0.4)"
            strokeWidth="0.8"
          />
          <path
            d="M192 38 A12 12 0 0 0 192 62"
            fill="rgba(59,130,246,0.06)"
            stroke="rgba(225,29,46,0.4)"
            strokeWidth="0.8"
          />
          {/* Goal lines */}
          <line x1="10" y1="18" x2="10" y2="82" stroke="rgba(225,29,46,0.28)" strokeWidth="0.7" />
          <line x1="190" y1="18" x2="190" y2="82" stroke="rgba(225,29,46,0.28)" strokeWidth="0.7" />
        </svg>
      )}

      <div className="noise-overlay absolute inset-0" />
      <div className="radar-sweep absolute inset-0 opacity-[0.12]" />

      {parallax ? (
        <RinkParallaxLayer>{movingLayer}</RinkParallaxLayer>
      ) : (
        <div className="absolute inset-0">{movingLayer}</div>
      )}
    </div>
  );
}
