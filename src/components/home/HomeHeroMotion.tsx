"use client";

import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "@/components/CountUp";

export function HomeHeroHeadline() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <motion.p
        className="text-[9px] font-black uppercase tracking-[.28em] text-[#7dd3fc] sm:text-[10px] sm:tracking-[.32em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.08 }}
      >
        Open ice · live scouting
      </motion.p>
      <h1 className="mt-2 font-display text-[clamp(2.85rem,14vw,9.5rem)] leading-[.78] tracking-[.025em] text-white sm:mt-3 sm:leading-[.76]">
        {["DRAFT", "YOUR", "PROFILE"].map((line, index) => (
          <motion.span
            key={line}
            className={`block ${line === "YOUR" ? "your-glow text-[#e11d2e]" : ""}`}
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.14 + index * 0.12,
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
          >
            {line}
          </motion.span>
        ))}
      </h1>
    </>
  );
}

export function HomeDraftMetrics() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      <DraftMetric value={6} label="Attributes" />
      <DraftMetric value={99} label="Rating cap" />
    </div>
  );
}

function DraftMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="border-l border-white/10 bg-white/[.035] px-3 py-2.5">
      <CountUp value={value} className="font-display text-2xl tracking-[.08em] text-white" />
      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[.14em] text-[#64748b]">{label}</p>
    </div>
  );
}
