"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PlayerCard } from "@/components/PlayerCard";
import { ScoutForm } from "@/components/ScoutForm";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import { HowItWorksButton } from "@/components/RatingMethodology";
import type { ScoutCard } from "@/lib/types";

export function HomeExperience({ cards }: { cards: ScoutCard[] }) {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <RinkAtmosphere />
      <SiteHeader />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pb-16 pt-6 text-center">
        <motion.div
          className="mb-5 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#38bdf8]/25 bg-[#0b1524]/80 px-4 py-1.5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d2e] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d2e]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7dd3fc]">
            Open ice · Live scouting
          </span>
        </motion.div>

        <div className="relative">
          <motion.div
            className="pointer-events-none absolute inset-x-[-10%] top-1/2 h-16 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(225,29,46,0.25),transparent)] blur-md"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          />
          <motion.h1
            className="relative font-display text-6xl leading-[0.92] tracking-[0.04em] text-white sm:text-8xl md:text-9xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 90 }}
          >
            GET
            <br />
            <motion.span
              className="inline-block text-[#e11d2e]"
              animate={{
                textShadow: [
                  "0 0 0 rgba(225,29,46,0)",
                  "0 0 28px rgba(225,29,46,0.75)",
                  "0 0 0 rgba(225,29,46,0)",
                ],
              }}
              transition={{ duration: 2.8, repeat: Infinity }}
            >
              DRAFTED.
            </motion.span>
          </motion.h1>
        </div>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-[#94a3b8] sm:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your GitHub profile, turned into an NHL Ultimate Team-style GitHub card rated out of 99.
          Commits, pull requests, stars, and streaks define your developer rating.
        </motion.p>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48 }}
        >
          <HowItWorksButton />
        </motion.div>

        <div className="mt-8 flex w-full justify-center">
          <ScoutForm large />
        </div>

        <motion.p
          className="mt-4 text-sm text-[#64748b]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          try{" "}
          {["torvalds", "gaearon", "sindresorhus"].map((u, i) => (
            <span key={u}>
              {i > 0 && " · "}
              <Link className="text-[#7dd3fc] transition hover:text-white hover:underline" href={`/u/${u}`}>
                {u}
              </Link>
            </span>
          ))}
        </motion.p>

        {/* broadcast lower-third */}
        <motion.div
          className="mt-10 flex w-full max-w-2xl items-center overflow-hidden rounded-xl border border-white/10 bg-black/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-[#e11d2e] px-4 py-3 font-display text-lg tracking-[0.16em] text-white">
            LIVE
          </div>
          <div className="relative flex-1 overflow-hidden px-4 py-3">
            <motion.p
              className="whitespace-nowrap text-sm text-[#cbd5e1]"
              animate={{ x: ["0%", "-55%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              SCOUTING COMMIT LINES · STAR POWER MEASURED · BLUE-LINE DEFENSE ONLINE ·
              X-FACTOR SPIKES DETECTED · DRAFT BOARD UPDATING ·
            </motion.p>
          </div>
        </motion.div>

        <div className="mt-14 flex w-full flex-wrap items-end justify-center gap-6 sm:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.username}
              className={i === 1 ? "sm:-translate-y-6" : "sm:translate-y-3"}
              whileHover={{ y: i === 1 ? -14 : -8 }}
            >
              <Link href={`/u/${card.username}`}>
                <PlayerCard
                  card={card}
                  size={i === 1 ? "lg" : "sm"}
                  reveal
                  delay={0.55 + i * 0.18}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 bg-black/35 py-14 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {[
            {
              title: "Six rink attributes",
              body: "SPD · SHO · HND · PAS · DEF · STR — scouted live from GitHub activity.",
            },
            {
              title: "Five rarity tiers",
              body: "Bronze → Silver → Gold → Elite → Legend — unlocked by overall rating from your GitHub activity.",
            },
            {
              title: "Embed anywhere",
              body: "Drop a live PNG into your README. The card re-scouts as your stats change.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#0b1524]/70 p-6 text-left transition hover:border-[#38bdf8]/35 hover:shadow-[0_0_40px_rgba(56,189,248,0.12)]"
              initial={{ opacity: 0, y: 24 }}
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

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs uppercase tracking-[0.2em] text-[#64748b]">
        IceOVR · NHL-style GitHub cards · Not affiliated with NHL or EA · Inspired by GitFut
      </footer>
    </main>
  );
}
