"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ScoutForm } from "@/components/ScoutForm";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";

export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center sm:py-24">
      <RinkAtmosphere />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7dd3fc]/10"
        animate={{ rotate: 360, scale: [0.96, 1.03, 0.96] }}
        transition={{ rotate: { duration: 34, repeat: Infinity, ease: "linear" }, scale: { duration: 5, repeat: Infinity } }}
      >
        <span className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#e11d2e] shadow-[0_0_18px_#e11d2e]" />
        <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#7dd3fc] shadow-[0_0_16px_#7dd3fc]" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[34%] h-2 w-2 rounded-full bg-black shadow-[0_0_0_3px_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.65)]"
        initial={{ x: "-48vw", rotate: 0 }}
        animate={{ x: "48vw", rotate: 1080 }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.3, ease: [0.34, 1.3, 0.64, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[34%] h-px w-32 bg-gradient-to-r from-transparent via-white/35 to-transparent"
        initial={{ x: "-61vw", opacity: 0 }}
        animate={{ x: "35vw", opacity: [0, 0.7, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.3, ease: "easeOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[13rem] leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[20rem]"
      >
        404
      </div>
      <motion.div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-md sm:p-10"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e11d2e] to-transparent" />
        <motion.div
          className="mx-auto flex w-fit items-center gap-2 border border-[#e11d2e]/35 bg-[#e11d2e]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-[#fda4af]"
          animate={{ boxShadow: ["0 0 0 rgba(225,29,46,0)", "0 0 24px rgba(225,29,46,.24)", "0 0 0 rgba(225,29,46,0)"] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d2e] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e11d2e] shadow-[0_0_10px_#e11d2e]" />
          </span>
          Offside · 404
        </motion.div>
        <motion.p
          className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#7dd3fc]"
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.2, duration: 0.55 }}
        >
          NHL-style GitHub scouting
        </motion.p>
        <motion.h1
          className="mt-2 font-display text-5xl leading-[0.9] tracking-[0.05em] text-white sm:text-7xl"
          initial={{ opacity: 0, y: 22, skewX: -8 }}
          animate={{ opacity: 1, y: 0, skewX: 0 }}
          transition={{ delay: 0.28, type: "spring", stiffness: 180, damping: 18 }}
        >
          PLAYER NOT FOUND
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#94a3b8] sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          This profile did not make the draft board. Check the GitHub username, then scout a different player.
        </motion.p>
        <motion.div
          className="mt-8 border-y border-white/10 py-5"
          initial={{ opacity: 0, scaleX: 0.92 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <ScoutForm large />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}>
          <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7dd3fc] transition hover:text-white"
          >
            <span aria-hidden>←</span>
            Back to draft board
          </Link>
        </motion.div>
        <p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-white/30">
          Unofficial NHL-style concept · Not affiliated with NHL or EA
        </p>
      </motion.div>
    </main>
  );
}
