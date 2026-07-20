"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";
import { PlayerCard } from "@/components/PlayerCard";
import { ScoutReport } from "@/components/ScoutReport";
import { useArenaAudio } from "@/components/ArenaAudioProvider";

export function CardStudio({ card }: { card: ScoutCard }) {
  const { playPuckShot } = useArenaAudio();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const tier = TIER_META[card.tier];

  const site =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  const pngPath = `/api/card/${card.username}`;
  const publicPng = `${site}/${card.username}.png`;
  const markdown = `[![IceOVR card](${publicPng})](${site}/u/${card.username})`;

  async function downloadCard() {
    playPuckShot();
    setDownloading(true);
    try {
      const res = await fetch(pngPath);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `iceovr-${card.username}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(pngPath, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-8 px-4 pb-16 pt-2 sm:px-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:gap-10">
      <aside className="flex flex-col items-center gap-4 lg:sticky lg:top-4">
        <PlayerCard card={card} reveal delay={0} />

        <div className="w-full max-w-[300px] space-y-3">
          <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[#94a3b8]">
            <span style={{ color: tier.accent }}>{tier.label}</span>
            {" · "}
            auto-scouted from GitHub
          </p>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={downloading}
            onClick={() => void downloadCard()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#e11d2e] font-display text-lg tracking-[0.14em] text-white shadow-[0_8px_28px_rgba(225,29,46,0.4)] disabled:opacity-60"
          >
            {downloading ? "DOWNLOADING…" : "DOWNLOAD PNG"}
          </motion.button>

          <a
            href={pngPath}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-[11px] uppercase tracking-[0.18em] text-[#7dd3fc] hover:text-white"
          >
            Open in browser ↗
          </a>
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <ScoutReport card={card} />

        <motion.section
          className="rounded-2xl border border-white/10 bg-[#0b1524]/80 p-5 sm:p-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-2xl tracking-wide text-white">Embed your card</h3>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Live PNG — updates when GitHub stats change.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void copyEmbed()}
              className="shrink-0 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#cbd5e1] transition hover:border-[#38bdf8]/40 hover:text-white"
            >
              {copied ? "Copied!" : "Copy markdown"}
            </button>
          </div>
          <pre className="mt-4 max-w-full overflow-x-auto rounded-xl bg-black/40 p-4 text-left text-xs leading-relaxed break-all whitespace-pre-wrap text-[#7dd3fc]">
            {markdown}
          </pre>
        </motion.section>
      </div>
    </div>
  );
}
