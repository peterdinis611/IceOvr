"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";

export function GitHubApiAlert({ username }: { username: string }) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  function retry() {
    setRetrying(true);
    router.refresh();
  }

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <RinkAtmosphere />
      <SiteHeader showScout scoutInitial={username} />
      <motion.section
        className="relative z-10 mx-auto my-auto w-full max-w-xl px-5 pb-16 text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="overflow-hidden rounded-2xl border border-amber-300/25 bg-[#091522]/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur-md sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 font-display text-2xl text-amber-200">
            !
          </div>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">Scout feed delayed</p>
          <h1 className="mt-2 font-display text-4xl tracking-[0.08em] text-white sm:text-5xl">GITHUB API UNAVAILABLE</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#94a3b8]">
            We could not load the latest GitHub data for <span className="font-semibold text-white">@{username}</span>.
            GitHub may be rate-limiting requests or temporarily unavailable.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={retry}
              disabled={retrying}
              className="rounded-lg bg-[#e11d2e] px-5 py-3 font-display text-lg tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(225,29,46,.3)] disabled:opacity-60"
            >
              {retrying ? "RETRYING…" : "RETRY SCOUT"}
            </button>
            <Link
              href="/"
              className="rounded-lg border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#cbd5e1] transition hover:border-[#7dd3fc]/50 hover:text-white"
            >
              Back to draft board
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
