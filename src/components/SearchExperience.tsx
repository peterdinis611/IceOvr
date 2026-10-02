"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ScoutForm } from "@/components/ScoutForm";
import {
  readRecentScouts,
  type RecentScout,
} from "@/lib/client/recent-scouts";

const FEATURED = [
  { login: "torvalds", detail: "Kernel legend", pos: "C" },
  { login: "gaearon", detail: "React core", pos: "LW" },
  { login: "sindresorhus", detail: "Open-source machine", pos: "RW" },
  { login: "yyx990803", detail: "Vue architect", pos: "LD" },
  { login: "t3dotgg", detail: "Full-stack stream", pos: "RD" },
  { login: "ThePrimeagen", detail: "Terminal energy", pos: "G" },
] as const;

/** Client island — press-box scout desk over the rink. */
export function SearchExperience() {
  const reduceMotion = useReducedMotion();
  const [recent, setRecent] = useState<RecentScout[]>([]);

  useEffect(() => {
    setRecent(readRecentScouts());
  }, []);

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="press-slash absolute inset-0" aria-hidden />
      <span className="watermark-num !right-0 !top-0 text-[clamp(8rem,22vw,16rem)]" aria-hidden>
        07
      </span>

      <motion.div
        className="relative"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="on-air-pill">
          <span className="faceoff-dot" aria-hidden />
          Scout desk · boardside
        </div>
        <h1 className="mt-5 font-display text-[clamp(3.4rem,14vw,7.5rem)] leading-[0.78] tracking-[0.02em] text-[var(--kraft)]">
          DROP
          <span className="block text-[var(--goal-red)]">THE PUCK</span>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--steel)] sm:text-lg">
          Live GitHub autocomplete. Stamp a handle, pull the scouting card off the ice.
        </p>
      </motion.div>

      <motion.div
        className="ticket-stub relative z-10 mt-10 p-5 sm:p-7"
        initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 100, damping: 16 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 pl-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ink)]/50">
              Faceoff · player lookup
            </p>
            <p className="mt-1 font-display text-3xl tracking-[0.06em] text-[var(--ink)]">
              TYPE A HANDLE
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ink)]/45">
              Seat
            </p>
            <p className="font-display text-3xl tracking-[0.08em] text-[var(--goal-red)]">
              C12
            </p>
          </div>
        </div>
        <div className="mt-5 pl-4 [&_.scout-input-shell>input]:border-[rgba(10,9,8,0.2)] [&_.scout-input-shell>input]:bg-[#fffdf8] [&_.scout-input-shell>input]:text-[var(--ink)] [&_.scout-input-shell>input]:placeholder:text-[rgba(10,9,8,0.35)]">
          <ScoutForm large showAnalyzing withSuggestions autoFocus />
        </div>
      </motion.div>

      {recent.length > 0 && (
        <div className="relative mt-14">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ice)]">
            Recent shifts
          </p>
          <h2 className="mt-1 font-display text-3xl tracking-[0.06em] text-[var(--kraft)]">
            BACK ON THE ICE
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {recent.map((item) => (
              <li key={item.username}>
                <Link href={`/u/${item.username}`} className="lineup-row">
                  <Image
                    src={`https://github.com/${encodeURIComponent(item.username)}.png?size=64`}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border border-[var(--kraft)]/20"
                    unoptimized
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-[var(--kraft)]">
                      @{item.username}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--steel)]">
                      Reopen scouting report
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative mt-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ice)]">
              Starting six
            </p>
            <h2 className="mt-1 font-display text-3xl tracking-[0.06em] text-[var(--kraft)]">
              TONIGHT&apos;S ROSTER
            </h2>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--steel)]">
            C · LW · RW · LD · RD · G
          </p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((player, index) => (
            <motion.li
              key={player.login}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/u/${player.login}`} className="lineup-row group">
                <span className="pos-badge">{player.pos}</span>
                <Image
                  src={`https://github.com/${encodeURIComponent(player.login)}.png?size=64`}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-[var(--kraft)]/20"
                  unoptimized
                />
                <span className="min-w-0">
                  <span className="block truncate font-display text-xl tracking-[0.04em] text-[var(--kraft)]">
                    @{player.login}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--steel)]">
                    {player.detail}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
