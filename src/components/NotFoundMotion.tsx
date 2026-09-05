"use client";

import { motion } from "motion/react";

/** Decorative motion only — keeps the 404 page shell as a Server Component. */
export function NotFoundMotion() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7dd3fc]/10"
        animate={{ rotate: 360, scale: [0.96, 1.03, 0.96] }}
        transition={{
          rotate: { duration: 34, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity },
        }}
      >
        <span className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#e11d2e] shadow-[0_0_18px_#e11d2e]" />
        <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#7dd3fc] shadow-[0_0_16px_#7dd3fc]" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[34%] h-2 w-2 rounded-full bg-black shadow-[0_0_0_3px_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.65)]"
        initial={{ x: "-48vw", rotate: 0 }}
        animate={{ x: "48vw", rotate: 1080 }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 1.3,
          ease: [0.34, 1.3, 0.64, 1],
        }}
      />
    </>
  );
}
