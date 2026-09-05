"use client";

import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    title: "Six rink attributes",
    body: "Activity, impact, craft, collaboration, reliability, and consistency — scouted live from GitHub.",
  },
  {
    title: "Five rarity tiers",
    body: "Bronze → Silver → Gold → Elite → Legend — unlocked by overall rating from your GitHub activity.",
  },
  {
    title: "Embed anywhere",
    body: "Drop a live PNG into your README. The card re-scouts as your stats change.",
  },
] as const;

export function HomeFeatureGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 border-t border-white/10 bg-black/35 py-10 backdrop-blur-sm sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:gap-6 sm:px-6 md:grid-cols-3">
        {FEATURES.map((item, i) => (
          <motion.div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-[#0b1524]/70 p-5 text-left transition hover:border-[#38bdf8]/35 hover:shadow-[0_0_40px_rgba(56,189,248,0.12)] sm:p-6"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.1 }}
          >
            <h3 className="font-display text-2xl tracking-wide text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
