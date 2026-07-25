"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";
import { PlayerCard } from "@/components/PlayerCard";
import { ScoutReport } from "@/components/ScoutReport";
import { useArenaAudio } from "@/components/ArenaAudioProvider";

export function CardStudio({ card }: { card: ScoutCard }) {
  const { playPuckShot } = useArenaAudio();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<"markdown" | "image" | "png" | null>(null);
  const [sharingOpen, setSharingOpen] = useState(false);
  const tier = TIER_META[card.tier];

  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const site = configuredSite ?? (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  const pngPath = `/api/card/${card.username}`;
  const publicPng = `${site}/${card.username}.png`;
  const markdown = `[![IceOVR card](${publicPng})](${site}/u/${card.username})`;
  const localEmbed = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(site);

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

  async function copyEmbed(value: string, kind: "markdown" | "image") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // ignore
    }
  }

  async function copyPngImage() {
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
        throw new Error("Image clipboard is unavailable");
      }
      const response = await fetch(pngPath);
      if (!response.ok) throw new Error("PNG could not be fetched");
      const image = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": image })]);
      setCopied("png");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      await copyEmbed(publicPng, "image");
    }
  }

  return (
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-6 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-8">
      <aside className="rounded-2xl border border-white/10 bg-[#071524]/65 p-4 shadow-[0_18px_55px_rgba(0,0,0,.2)] backdrop-blur-sm lg:sticky lg:top-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">Card vault</p>
            <p className="mt-1 text-xs text-[#94a3b8]">Live collectible preview</p>
          </div>
          <span className="rounded border border-white/10 bg-black/25 px-2 py-1 text-[9px] font-black tracking-[0.16em]" style={{ color: tier.accent }}>
            {tier.label}
          </span>
        </div>
        <div className="relative flex justify-center py-1">
          <div
            aria-hidden
            className="absolute inset-x-3 inset-y-5 opacity-50 blur-xl"
            style={{ background: `radial-gradient(circle at 50% 50%, ${tier.accent}35, transparent 60%)` }}
          />
          <div className="relative">
            <PlayerCard card={card} reveal delay={0} />
          </div>
        </div>

        <div className="mt-4 w-full space-y-3">
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

          <div className="grid grid-cols-2 gap-2">
            <a
              href={pngPath}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center justify-center rounded-lg border border-white/15 bg-black/20 text-center text-[10px] font-black uppercase tracking-[0.14em] text-[#cbd5e1] transition hover:border-[#7dd3fc]/45 hover:text-white"
            >
              Open PNG ↗
            </a>
            <button
              type="button"
              onClick={() => setSharingOpen(true)}
              className="h-10 rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/5 text-[10px] font-black uppercase tracking-[0.14em] text-[#7dd3fc] transition hover:bg-[#7dd3fc]/15 hover:text-white"
            >
              Share card
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <ScoutReport card={card} />
      </div>
      <AnimatePresence>
        {sharingOpen && (
          <ShareDialog
            localEmbed={localEmbed}
            publicPng={publicPng}
            markdown={markdown}
            copied={copied}
            onClose={() => setSharingOpen(false)}
            onCopyPng={() => void copyPngImage()}
            onCopyImage={() => void copyEmbed(publicPng, "image")}
            onCopyMarkdown={() => void copyEmbed(markdown, "markdown")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareDialog({
  localEmbed,
  publicPng,
  markdown,
  copied,
  onClose,
  onCopyPng,
  onCopyImage,
  onCopyMarkdown,
}: {
  localEmbed: boolean;
  publicPng: string;
  markdown: string;
  copied: "markdown" | "image" | "png" | null;
  onClose: () => void;
  onCopyPng: () => void;
  onCopyImage: () => void;
  onCopyMarkdown: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/75 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0b1524] p-5 shadow-[0_28px_90px_rgba(0,0,0,.5)] sm:p-6"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Share center</p>
            <h3 className="mt-1 font-display text-2xl tracking-wide text-white">YOUR LIVE CARD</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-[#94a3b8] transition hover:text-white">
            Close
          </button>
        </div>
        {localEmbed && (
          <p className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs leading-relaxed text-amber-100/80">
            Local preview URL. Set <code className="text-amber-100">NEXT_PUBLIC_SITE_URL</code> to your deployed HTTPS domain before sharing.
          </p>
        )}
        <div className="mt-4 overflow-hidden rounded-xl border border-[#7dd3fc]/20 bg-gradient-to-br from-[#0c2131] to-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/10 font-display text-lg tracking-wide text-[#7dd3fc]">PNG</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">Live card image</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onCopyPng} className="rounded-md bg-[#7dd3fc] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#06111c]">
                {copied === "png" ? "Image copied!" : "Copy PNG"}
              </button>
              <button type="button" onClick={onCopyImage} className="rounded-md border border-white/15 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#cbd5e1]">
                {copied === "image" ? "URL copied!" : "Copy URL"}
              </button>
            </div>
          </div>
          <code className="block overflow-x-auto whitespace-nowrap px-4 py-3 text-xs leading-relaxed text-[#d8f5ff]">{publicPng}</code>
        </div>
        <EmbedRow label="GitHub README markdown" value={markdown} button={copied === "markdown" ? "Copied!" : "Copy markdown"} onCopy={onCopyMarkdown} code />
      </motion.section>
    </motion.div>
  );
}

function EmbedRow({
  label,
  value,
  button,
  onCopy,
  code = false,
}: {
  label: string;
  value: string;
  button: string;
  onCopy: () => void;
  code?: boolean;
}) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">{label}</p>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-[#7dd3fc] transition hover:text-white"
        >
          {button}
        </button>
      </div>
      <code className={`block overflow-x-auto whitespace-nowrap text-xs leading-relaxed ${code ? "text-[#7dd3fc]" : "text-[#cbd5e1]"}`}>
        {value}
      </code>
    </div>
  );
}
