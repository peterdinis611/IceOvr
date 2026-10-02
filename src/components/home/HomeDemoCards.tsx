"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PlayerCard } from "@/components/PlayerCard";
import type { ScoutCard } from "@/lib/types";

export function HomeDemoCards({ cards }: { cards: ScoutCard[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3 px-1 sm:hidden">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--steel)]">Swipe →</p>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:items-end sm:justify-center sm:gap-8 sm:overflow-visible sm:scroll-px-0 sm:px-0 sm:pb-0">
        {cards.map((card, i) => (
          <motion.div
            key={card.username}
            className={`snap-center shrink-0 ${i === 1 ? "sm:-translate-y-6" : "sm:translate-y-3"}`}
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.08 + i * 0.1 }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="origin-top scale-[0.92] sm:scale-100">
                <PlayerCard
                  card={card}
                  size={i === 1 ? "lg" : "sm"}
                  reveal
                  delay={0.2 + i * 0.12}
                />
              </div>
              <Link
                href={`/u/${card.username}`}
                className="jersey-cta-ghost px-3 py-1.5 text-[9px] tracking-[0.16em]"
              >
                Open report
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
