"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    period: "P1",
    title: "Six rink attributes",
    body: "Activity, impact, craft, collaboration, reliability, consistency — graded from public GitHub like a scouting sheet.",
    href: "/search",
    cta: "Scout",
  },
  {
    period: "P2",
    title: "Five rarity tiers",
    body: "Bronze through Legend. Retro, Arena, Neon, Frost — or stamp your own Custom Studio sweater.",
    href: "/board",
    cta: "Draft",
  },
  {
    period: "P3",
    title: "Live README badge",
    body: "Drop a style-aware PNG into your README. It re-scouts when your public season changes.",
    href: "/search",
    cta: "Grab card",
  },
] as const;

export function HomeFeatureGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative z-10 overflow-hidden border-t border-[var(--kraft)]/12 bg-[#0a0908]/90 py-14 sm:py-20">
      <div className="press-slash absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ice)]">
          Between periods
        </p>
        <h2 className="mt-1 font-display text-4xl tracking-[0.06em] text-[var(--kraft)] sm:text-5xl">
          FROM COMMITS TO OVR
        </h2>

        <div className="mt-10 space-y-0">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              className="group grid gap-3 border-t-2 border-[var(--kraft)]/12 py-8 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-10"
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08 }}
            >
              <p className="font-display text-4xl tracking-[0.04em] text-[var(--goal-red)]">
                {item.period}
              </p>
              <div>
                <h3 className="font-display text-3xl tracking-[0.05em] text-[var(--kraft)]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--steel)]">
                  {item.body}
                </p>
              </div>
              <Link
                href={item.href}
                className="jersey-cta-ghost inline-flex h-11 px-4 text-lg sm:justify-self-end"
              >
                {item.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
