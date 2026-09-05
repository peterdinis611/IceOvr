"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";
import { PlayerCard } from "@/components/PlayerCard";
import { STAT_LABELS } from "@/lib/tiers";
import { useArenaAudio } from "@/components/ArenaAudioProvider";
import { ScoutRefresh } from "@/components/ScoutRefresh";
import { PuckSpinner } from "@/components/PuckSpinner";
import {
  CARD_STYLE_META,
  CardStylePicker,
  useCardStyle,
} from "@/components/player-card";

const ScoutReport = dynamic(
  () => import("@/components/ScoutReport").then((module) => module.ScoutReport),
  { loading: () => <TabLoading label="Preparing scouting dossier" /> },
);

const ActivityReport = dynamic(
  () =>
    import("@/components/ReportInsights").then(
      (module) => module.ActivityReport,
    ),
  { loading: () => <TabLoading label="Loading activity data" /> },
);

export function CardStudio({ card }: { card: ScoutCard }) {
  const { playPuckShot } = useArenaAudio();
  const { style, setStyle } = useCardStyle();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<"markdown" | "image" | "png" | null>(
    null,
  );
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [sharingOpen, setSharingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "report" | "activity"
  >("overview");
  const tier = TIER_META[card.tier];

  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const site =
    configuredSite ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const pngPath = `/api/card/${card.username}?style=${style}`;
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
      setCopyNotice(
        kind === "image" ? "Card image URL copied" : "GitHub Markdown copied",
      );
      setTimeout(() => setCopied(null), 1800);
      setTimeout(() => setCopyNotice(null), 2400);
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
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": image }),
      ]);
      setCopied("png");
      setCopyNotice("PNG image copied to clipboard");
      setTimeout(() => setCopied(null), 1800);
      setTimeout(() => setCopyNotice(null), 2400);
    } catch {
      await copyEmbed(publicPng, "image");
    }
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <nav
        aria-label="Player profile sections"
        className="mb-5 flex overflow-x-auto rounded-xl border border-white/10 bg-[#071524]/70 p-1.5 backdrop-blur-sm"
      >
        <ProfileTab
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          label="Overview"
          detail="Card & grades"
        />
        <ProfileTab
          active={activeTab === "report"}
          onClick={() => setActiveTab("report")}
          label="Scouting report"
          detail="Dossier"
        />
        <ProfileTab
          active={activeTab === "activity"}
          onClick={() => setActiveTab("activity")}
          label="Activity"
          detail="GitHub live"
        />
      </nav>

      {activeTab === "overview" && (
        <div className="grid items-start gap-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-8">
          <aside className="rounded-2xl border border-white/10 bg-[#071524]/65 p-4 shadow-[0_18px_55px_rgba(0,0,0,.2)] backdrop-blur-sm lg:sticky lg:top-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">
                  Card vault
                </p>
                <p className="mt-1 text-xs text-[#94a3b8]">
                  Live collectible preview
                </p>
              </div>
              <span
                className="rounded border border-white/10 bg-black/25 px-2 py-1 text-[9px] font-black tracking-[0.16em]"
                style={{ color: tier.accent }}
              >
                {tier.label}
              </span>
            </div>
            <div className="relative flex justify-center overflow-x-auto py-1">
              <div
                aria-hidden
                className="absolute inset-x-3 inset-y-5 opacity-50 blur-xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${tier.accent}35, transparent 60%)`,
                }}
              />
              <div className="relative origin-top scale-[0.88] sm:scale-100">
                <PlayerCard card={card} style={style} reveal delay={0} />
              </div>
            </div>

            <CardStylePicker value={style} onChange={setStyle} />

            <div className="mt-4 w-full space-y-3">
              <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[#94a3b8]">
                <span style={{ color: tier.accent }}>{tier.label}</span>
                {" · "}
                {CARD_STYLE_META[style].label}
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

          <div className="min-w-0">
            <OverviewPanel card={card} />
          </div>
        </div>
      )}
      {activeTab === "report" && <Suspense fallback={<TabLoading label="Preparing scouting dossier" />}><ScoutReport card={card} /></Suspense>}
      {activeTab === "activity" && <Suspense fallback={<TabLoading label="Loading activity data" />}><ActivityReport card={card} /></Suspense>}
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
      <AnimatePresence>
        {copyNotice && (
          <motion.div
            role="status"
            className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#7dd3fc]/30 bg-[#071524]/95 px-4 py-2.5 text-xs font-bold text-[#d8f5ff] shadow-[0_12px_36px_rgba(0,0,0,.42)] backdrop-blur-md"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#7dd3fc] text-[10px] text-[#06111c]">
              ✓
            </span>
            {copyNotice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileTab({
  active,
  onClick,
  label,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`min-w-0 flex-1 rounded-lg px-2.5 py-2 text-left transition sm:min-w-[140px] sm:px-3 ${active ? "bg-[#7dd3fc]/12 text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,.25)]" : "text-[#94a3b8] hover:bg-white/[.04] hover:text-white"}`}
    >
      <span className="block text-[9px] font-black uppercase tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]">
        {label}
      </span>
      <span className="mt-0.5 hidden text-[9px] uppercase tracking-[0.12em] text-[#64748b] sm:block">
        {detail}
      </span>
    </button>
  );
}

function TabLoading({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071524]/75 p-8 text-center text-xs font-bold uppercase tracking-[.2em] text-[#7dd3fc]">
      <PuckSpinner label={label} />
    </div>
  );
}

function OverviewPanel({ card }: { card: ScoutCard }) {
  const tier = TIER_META[card.tier];
  const topStat = [...STAT_LABELS].sort(
    (a, b) => card.stats[b.key] - card.stats[a.key],
  )[0];
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(12,30,47,.96),rgba(6,17,30,.94))] p-5 shadow-[0_20px_60px_rgba(0,0,0,.2)] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px broadcast-stripe" />
      <div className="relative border-b border-white/10 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#7dd3fc]">
          Quick scout take
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-[.08em] text-white">
          PLAYER OVERVIEW
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#94a3b8]">
          {card.archetype} profile with a {topStat.name.toLowerCase()} grade of{" "}
          <span style={{ color: tier.accent }}>{card.stats[topStat.key]}</span>.
          The full dossier compares form, collaboration, and public GitHub
          impact.
        </p>
      </div>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_LABELS.map((stat) => {
          const value = card.stats[stat.key];
          const pct = Math.max(4, ((value - 40) / 59) * 100);
          return (
            <div
              key={stat.key}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#94a3b8]">
                  {stat.short} · {stat.name}
                </p>
                <p className="font-display text-2xl text-white">{value}</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg,#38bdf8,${tier.accent})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <OverviewMetric label="Stars" value={card.raw.stars.toLocaleString()} />
        <OverviewMetric
          label="Commits / yr"
          value={card.raw.commitsLastYear.toLocaleString()}
        />
        <OverviewMetric
          label="Pull requests"
          value={card.raw.pullRequests.toLocaleString()}
        />
        <OverviewMetric
          label="Public repos"
          value={card.raw.publicRepos.toLocaleString()}
        />
      </div>
      <ScoutRefresh card={card} />
    </section>
  );
}

function OverviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#64748b]">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
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
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">
              Share center
            </p>
            <h3 className="mt-1 font-display text-2xl tracking-wide text-white">
              YOUR LIVE CARD
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-[#94a3b8] transition hover:text-white"
          >
            Close
          </button>
        </div>
        {localEmbed && (
          <p className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs leading-relaxed text-amber-100/80">
            Local preview URL. Set{" "}
            <code className="text-amber-100">NEXT_PUBLIC_SITE_URL</code> to your
            deployed HTTPS domain before sharing.
          </p>
        )}
        <div className="mt-4 overflow-hidden rounded-xl border border-[#7dd3fc]/20 bg-gradient-to-br from-[#0c2131] to-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/10 font-display text-lg tracking-wide text-[#7dd3fc]">
                PNG
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">
                Live card image
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCopyPng}
                className="rounded-md bg-[#7dd3fc] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#06111c]"
              >
                {copied === "png" ? "Image copied!" : "Copy PNG"}
              </button>
              <button
                type="button"
                onClick={onCopyImage}
                className="rounded-md border border-white/15 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#cbd5e1]"
              >
                {copied === "image" ? "URL copied!" : "Copy URL"}
              </button>
            </div>
          </div>
          <code className="block overflow-x-auto whitespace-nowrap px-4 py-3 text-xs leading-relaxed text-[#d8f5ff]">
            {publicPng}
          </code>
        </div>
        <EmbedRow
          label="GitHub README markdown"
          value={markdown}
          button={copied === "markdown" ? "Copied!" : "Copy markdown"}
          onCopy={onCopyMarkdown}
          code
        />
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
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
          {label}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-[#7dd3fc] transition hover:text-white"
        >
          {button}
        </button>
      </div>
      <code
        className={`block overflow-x-auto whitespace-nowrap text-xs leading-relaxed ${code ? "text-[#7dd3fc]" : "text-[#cbd5e1]"}`}
      >
        {value}
      </code>
    </div>
  );
}
