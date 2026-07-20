"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

export function RinkAtmosphere({ subtle = false }: { subtle?: boolean }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: subtle ? 14 : 24 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        delay: (i % 9) * 0.35,
        duration: 8 + (i % 5),
        size: 2 + (i % 3),
        opacity: 0.1 + (i % 4) * 0.05,
      })),
    [subtle],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft ambient only — no full-height red center line through content */}
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
        <motion.span
          key={flake.id}
          className="absolute top-[-10%] rounded-full bg-white"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
          }}
          animate={{ y: ["0vh", "110vh"], x: [0, flake.id % 2 === 0 ? 16 : -16] }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
