"use client";

import { motion, useReducedMotion } from "motion/react";

/** Brand-first hero — sodium floodlights over center ice. */
export function HomeHeroHeadline() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative max-w-3xl">
      <motion.div
        className="on-air-pill"
        initial={reduceMotion ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.04 }}
      >
        <span className="faceoff-dot" aria-hidden />
        Period 1 · faceoff pending
      </motion.div>

      <h1 className="mt-5 font-display leading-[0.72] tracking-[0.02em] text-[var(--kraft)]">
        <motion.span
          className="block text-[clamp(4.8rem,20vw,12rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 110, damping: 16 }}
        >
          ICE
          <span className="your-glow text-[var(--goal-red)]">OVR</span>
        </motion.span>
      </h1>

      <motion.p
        className="mt-6 max-w-[38ch] text-lg leading-relaxed text-[var(--steel)] sm:text-xl"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
      >
        Public GitHub, graded at center ice — attributes, tiers, and a shareable player card.
      </motion.p>
    </div>
  );
}
