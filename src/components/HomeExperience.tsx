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

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-5">
        <div className="relative grid overflow-hidden rounded-[28px] border border-white/10 bg-[#06121f]/80 px-5 py-7 shadow-[0_28px_90px_rgba(0,0,0,.3)] sm:px-8 sm:py-10 lg:grid-cols-[.78fr_1.5fr_.72fr] lg:items-end lg:gap-8">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,211,252,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.045)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="pointer-events-none absolute inset-y-0 left-[48%] w-px bg-[#e11d2e]/35" />
          <div className="relative order-2 mt-8 border-t border-white/10 pt-5 lg:order-1 lg:mt-0 lg:border-t-0 lg:border-r lg:pr-6 lg:pt-0">
            <p className="text-[10px] font-black uppercase tracking-[.28em] text-[#7dd3fc]">Player evaluation no. 026</p>
            <p className="mt-4 max-w-[22ch] text-sm leading-relaxed text-[#94a3b8]">Turn public GitHub activity into a scouting profile built for the draft board.</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <DraftMetric value="06" label="Attributes" />
              <DraftMetric value="99" label="Rating cap" />
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <motion.p className="text-[10px] font-black uppercase tracking-[.32em] text-[#7dd3fc]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}>Open ice · live scouting</motion.p>
            <motion.h1
              className="mt-3 font-display text-[clamp(3.6rem,13vw,9.5rem)] leading-[.76] tracking-[.025em] text-white"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, type: "spring", stiffness: 100, damping: 18 }}
            >
              DRAFT<br />
              <span className="text-[#e11d2e]">YOUR</span><br />
              PROFILE
            </motion.h1>
            <div className="mt-8 max-w-xl">
              <ScoutForm large />
              <p className="mt-3 text-[11px] uppercase tracking-[.12em] text-[#64748b]">
                Try {["torvalds", "gaearon", "sindresorhus"].map((u, i) => (
                  <span key={u}>{i > 0 && " · "}<Link className="text-[#7dd3fc] transition hover:text-white" href={`/u/${u}`}>@{u}</Link></span>
                ))}
              </p>
            </div>
          </div>

          <div className="relative order-3 mt-8 border-t border-white/10 pt-5 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
            <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#94a3b8]">Draft board</p>
            <p className="mt-2 font-display text-3xl tracking-[.1em] text-white">GITHUB<br /><span className="text-[#7dd3fc]">SCOUTING</span></p>
            <div className="mt-5 border-l-2 border-[#e11d2e] pl-3 text-xs leading-relaxed text-[#94a3b8]">Commits. Stars. Pull requests. One card that tells the season.</div>
            <div className="mt-5"><HowItWorksButton /></div>
          </div>
        </div>

        <div className="mt-5 flex items-center overflow-hidden rounded-lg border border-white/10 bg-black/35">
          <div className="shrink-0 bg-[#e11d2e] px-3 py-2 font-display text-sm tracking-[.14em] text-white">LIVE</div>
          <p className="whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#94a3b8]">Draft board open · public GitHub signals only · ratings update as your profile changes</p>
        </div>

        <div className="mt-12 flex w-full flex-wrap items-end justify-center gap-6 sm:gap-8">
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
        IceOVR · NHL-style GitHub cards · Not affiliated with NHL or EA
      </footer>
    </main>
  );
}

function DraftMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/10 bg-white/[.035] px-3 py-2.5">
      <p className="font-display text-2xl tracking-[.08em] text-white">{value}</p>
      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[.14em] text-[#64748b]">{label}</p>
    </div>
  );
}
