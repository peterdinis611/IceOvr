"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PlayerCard } from "@/components/PlayerCard";
import type { ScoutCard } from "@/lib/types";

export function HomeDemoCards({ cards }: { cards: ScoutCard[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-12 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:items-end sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 sm:gap-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.username}
          className={`snap-center shrink-0 ${i === 1 ? "sm:-translate-y-6" : "sm:translate-y-3"}`}
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.08 + i * 0.1 }}
        >
          <div className="flex flex-col items-center gap-3">
            <PlayerCard card={card} size={i === 1 ? "lg" : "sm"} reveal delay={0.55 + i * 0.18} />
            <Link
              href={`/u/${card.username}`}
              className="rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#7dd3fc] transition hover:bg-[#7dd3fc]/15 hover:text-white"
            >
              Open report
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
