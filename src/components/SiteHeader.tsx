"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ScoutForm } from "@/components/ScoutForm";
import { SoundToggle } from "@/components/SoundToggle";

export function SiteHeader({
  showScout = false,
  scoutInitial = "",
}: {
  showScout?: boolean;
  scoutInitial?: string;
}) {
  return (
    <motion.header
      className="relative z-30 mx-auto flex w-full max-w-6xl shrink-0 items-center gap-3 px-4 py-4 sm:px-6"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="group font-display text-2xl tracking-[0.12em] text-white sm:text-3xl"
        >
          ICE
          <span className="text-[#e11d2e] transition group-hover:drop-shadow-[0_0_12px_rgba(225,29,46,0.8)]">
            OVR
          </span>
        </Link>
        <SoundToggle />
      </div>

      <div className="min-w-0 flex-1">
        {showScout ? (
          <div className="ml-auto w-full max-w-sm">
            <ScoutForm initial={scoutInitial} />
          </div>
        ) : (
          <div className="hidden justify-end sm:flex">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#94a3b8]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d2e] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d2e]" />
              </span>
              Arena live
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
