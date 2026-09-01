"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CardStudio } from "@/components/CardStudio";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import { useArenaAudio } from "@/components/ArenaAudioProvider";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";

export function PlayerExperience({ card }: { card: ScoutCard }) {
  const [intro, setIntro] = useState(true);
  const tier = TIER_META[card.tier];
  const { playPuckShot } = useArenaAudio();

  useEffect(() => {
    const shot = setTimeout(() => playPuckShot(), 400);
    const t = setTimeout(() => setIntro(false), 700);
    return () => {
      clearTimeout(shot);
      clearTimeout(t);
    };
  }, [playPuckShot]);

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader showScout scoutInitial={card.username} />

      <AnimatePresence>
        {intro && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/92"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative text-center">
              <motion.div
                className="mx-auto mb-6 h-1 w-40 overflow-hidden rounded-full bg-white/10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2 }}
              >
                <motion.div
                  className="h-full bg-[#e11d2e]"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
              <motion.p
                className="text-xs uppercase tracking-[0.4em] text-[#7dd3fc]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Entering the arena
              </motion.p>
              <motion.h2
                className="mt-3 font-display text-5xl tracking-[0.12em] text-white sm:text-7xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
              >
                {card.displayName}
              </motion.h2>
              <motion.p
                className="mt-3 font-display text-3xl"
                style={{ color: tier.accent }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                {card.ovr} OVR · {tier.label}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        className="arena-panel relative z-10 mx-auto mt-1 w-full max-w-6xl rounded-2xl px-5 py-4 sm:px-7"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
      >
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-2/5 opacity-40"
          style={{
            background: `linear-gradient(135deg, transparent, ${tier.accent}35)`,
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7dd3fc]">
              Official scouting dossier · GitHub live
            </p>
            <h1 className="mt-1 truncate font-display text-3xl tracking-[0.09em] text-white sm:text-4xl">
              {card.displayName}
            </h1>
            <p className="mt-1.5 text-sm text-[#94a3b8]">
              @{card.username}
              {card.topLanguage ? ` · ${card.topLanguage}` : ""}
              {card.location ? ` · ${card.location}` : ""}
            </p>
          </div>
          <div className="flex items-end gap-3">
            <div className="border-r border-white/10 pr-3 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                Scout grade
              </p>
              <p
                className="mt-1 font-display text-2xl tracking-[0.12em]"
                style={{ color: tier.accent }}
              >
                {tier.label}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl leading-none text-white sm:text-5xl">
                {card.ovr}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
                Player rating
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <CardStudio card={card} />
    </main>
  );
}
