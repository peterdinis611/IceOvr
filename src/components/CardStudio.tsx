"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  encodeCustomTheme,
  type CardStyleId,
  type CustomCardTheme,
  useCardStyle,
} from "@/components/player-card";
import { buildCardSharePayload } from "@/lib/share";

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

const CustomCardDesigner = dynamic(
  () =>
    import("@/components/player-card/CustomCardDesigner").then(
      (module) => module.CustomCardDesigner,
    ),
  {
    loading: () => (
      <div className="mt-3 h-40 animate-pulse rounded-xl border border-white/10 bg-black/20" />
    ),
  },
);

export function CardStudio({
  card,
  initialStyle,
  initialTheme,
}: {
  card: ScoutCard;
  initialStyle?: CardStyleId;
  initialTheme?: CustomCardTheme;
}) {
  const { playPuckShot } = useArenaAudio();
  const { style, setStyle, customTheme, setCustomTheme, ready } = useCardStyle(
    initialStyle,
    initialTheme,
  );
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState<"markdown" | "image" | "png" | null>(
    null,
  );
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [sharingOpen, setSharingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "report" | "activity"
  >("overview");
  const noticeTimers = useRef<number[]>([]);
  const tier = TIER_META[card.tier];

  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const site =
    configuredSite ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const share = useMemo(
    () => buildCardSharePayload(card, style, site, customTheme),
    [card, style, site, customTheme],
  );
  const pngPath = useMemo(
    () =>
      style === "custom"
        ? `/api/card/${card.username}?style=custom&theme=${encodeURIComponent(encodeCustomTheme(customTheme))}`
        : `/api/card/${card.username}?style=${style}`,
    [card.username, style, customTheme],
  );
  const localEmbed = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(site);

  useEffect(() => {
    return () => {
      for (const timer of noticeTimers.current) window.clearTimeout(timer);
    };
  }, []);

  function flashNotice(message: string, kind: "markdown" | "image" | "png") {
    for (const timer of noticeTimers.current) window.clearTimeout(timer);
    noticeTimers.current = [];
    setCopied(kind);
    setCopyNotice(message);
    noticeTimers.current.push(
      window.setTimeout(() => setCopied(null), 1800),
      window.setTimeout(() => setCopyNotice(null), 2400),
    );
  }

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
      flashNotice(
        kind === "image" ? "Card image URL copied" : "GitHub Markdown copied",
        kind,
      );
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
      flashNotice("PNG image copied to clipboard", "png");
    } catch {
      await copyEmbed(share.publicPng, "image");
    }
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <nav
        aria-label="Player profile sections"
        className="mb-5 flex overflow-x-auto border-2 border-[var(--kraft)]/15 bg-[#12100c]/85 p-1.5"
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
          detail="Shift chart"
        />
      </nav>

      {activeTab === "overview" && (
        <div className="grid items-start gap-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-8">
          <aside className="border-2 border-[var(--kraft)]/15 bg-[#12100c]/90 p-4 shadow-[8px_12px_0_rgba(0,0,0,.35)] lg:sticky lg:top-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--ice)]">
                  Card vault
                </p>
                <p className="mt-1 text-xs text-[var(--steel)]">
                  Live collectible on ice
                </p>
              </div>
              <span
                className="border border-[var(--kraft)]/20 bg-black/40 px-2 py-1 text-[9px] font-black tracking-[0.16em]"
                style={{ color: tier.accent }}
              >
                {tier.label}
              </span>
            </div>
            <div
              className={`relative flex justify-center overflow-x-auto py-1 transition-opacity duration-200 ${
                ready ? "opacity-100" : "opacity-60"
              }`}
            >
              <div
                aria-hidden
                className="absolute inset-x-3 inset-y-5 opacity-50 blur-xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${tier.accent}35, transparent 60%)`,
                }}
              />
              <div className="relative origin-top scale-[0.88] sm:scale-100">
                <PlayerCard
                  card={card}
                  style={style}
                  customTheme={customTheme}
                  reveal
                  delay={0}
                />
              </div>
            </div>

            <CardStylePicker value={style} onChange={setStyle} />
            {style === "custom" && (
              <CustomCardDesigner theme={customTheme} onChange={setCustomTheme} />
            )}

            <div className="mt-4 w-full space-y-3">
              <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[var(--steel)]">
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
                className="jersey-cta flex h-12 w-full gap-2 text-lg disabled:opacity-60"
              >
                {downloading ? "DOWNLOADING…" : "DOWNLOAD PNG"}
              </motion.button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={pngPath}
                  target="_blank"
                  rel="noreferrer"
                  className="jersey-cta-ghost flex h-10 items-center justify-center text-center text-[10px]"
                >
                  Open PNG ↗
                </a>
                <button
                  type="button"
                  onClick={() => setSharingOpen(true)}
                  className="h-10 border-2 border-[var(--ice)]/40 bg-[var(--ice)]/10 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--ice)] transition hover:bg-[var(--ice)]/20 hover:text-[var(--kraft)]"
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
            edition={share.edition}
            previewSrc={pngPath}
            publicPng={share.publicPng}
            pageUrl={share.pageUrl}
            markdown={share.markdown}
            twitterUrl={share.twitterUrl}
            linkedInUrl={share.linkedInUrl}
            copied={copied}
            onClose={() => setSharingOpen(false)}
            onCopyPng={() => void copyPngImage()}
            onCopyImage={() => void copyEmbed(share.publicPng, "image")}
            onCopyMarkdown={() => void copyEmbed(share.markdown, "markdown")}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {copyNotice && (
          <motion.div
            role="status"
            className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 border-2 border-[var(--ice)]/40 bg-[#12100c]/95 px-4 py-2.5 text-xs font-bold text-[var(--kraft)] shadow-[0_12px_36px_rgba(0,0,0,.42)] backdrop-blur-md"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ice)] text-[10px] text-[var(--ink)]">
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
      className={`min-w-0 flex-1 px-2.5 py-2 text-left transition sm:min-w-[140px] sm:px-3 ${
        active
          ? "bg-[var(--goal-red)] text-white shadow-[inset_0_-2px_0_rgba(255,183,3,0.7)]"
          : "text-[var(--steel)] hover:bg-white/[.04] hover:text-[var(--kraft)]"
      }`}
    >
      <span className="block text-[9px] font-black uppercase tracking-[0.14em] sm:text-[10px] sm:tracking-[0.16em]">
        {label}
      </span>
      <span
        className={`mt-0.5 hidden text-[9px] uppercase tracking-[0.12em] sm:block ${
          active ? "text-white/70" : "text-[var(--steel)]"
        }`}
      >
        {detail}
      </span>
    </button>
  );
}

function TabLoading({ label }: { label: string }) {
  return (
    <div className="border-2 border-[var(--kraft)]/15 bg-[#12100c]/85 p-8 text-center text-xs font-bold uppercase tracking-[.2em] text-[var(--ice)]">
      <PuckSpinner label={label} />
    </div>
  );
}

function OverviewPanel({ card }: { card: ScoutCard }) {
  const tier = TIER_META[card.tier];
  const topStat = useMemo(() => {
    let best: (typeof STAT_LABELS)[number] = STAT_LABELS[0];
    for (const stat of STAT_LABELS) {
      if (card.stats[stat.key] > card.stats[best.key]) best = stat;
    }
    return best;
  }, [card.stats]);
  return (
    <section className="relative overflow-hidden border-2 border-[var(--kraft)]/15 bg-[linear-gradient(145deg,rgba(18,16,12,.96),rgba(7,6,5,.98))] p-5 shadow-[8px_12px_0_rgba(0,0,0,.3)] sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px broadcast-stripe" />
      <div className="relative border-b border-[var(--kraft)]/12 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ice)]">
          Quick scout take
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-[.08em] text-[var(--kraft)]">
          PLAYER OVERVIEW
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--steel)]">
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
              className="border border-[var(--kraft)]/12 bg-black/35 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[var(--steel)]">
                  {stat.short} · {stat.name}
                </p>
                <p className="font-display text-2xl text-[var(--kraft)]">{value}</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden bg-[var(--kraft)]/10">
                <div
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg,var(--goal-red),${tier.accent})`,
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
    <div className="border border-[var(--kraft)]/12 bg-black/35 px-3 py-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[var(--steel)]">
        {label}
      </p>
      <p className="mt-1 font-display text-xl tracking-[0.04em] text-[var(--kraft)]">
        {value}
      </p>
    </div>
  );
}

function ShareDialog({
  localEmbed,
  edition,
  previewSrc,
  publicPng,
  pageUrl,
  markdown,
  twitterUrl,
  linkedInUrl,
  copied,
  onClose,
  onCopyPng,
  onCopyImage,
  onCopyMarkdown,
}: {
  localEmbed: boolean;
  edition: string;
  previewSrc: string;
  publicPng: string;
  pageUrl: string;
  markdown: string;
  twitterUrl: string;
  linkedInUrl: string;
  copied: "markdown" | "image" | "png" | null;
  onClose: () => void;
  onCopyPng: () => void;
  onCopyImage: () => void;
  onCopyMarkdown: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#050403]/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border-2 border-[var(--kraft)]/20 bg-[#12100c] p-5 shadow-[0_28px_90px_rgba(0,0,0,.5)] sm:rounded-none sm:p-6"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--ice)]">
              Share pack · {edition}
            </p>
            <h3
              id="share-dialog-title"
              className="mt-1 font-display text-2xl tracking-wide text-[var(--kraft)]"
            >
              YOUR LIVE CARD
            </h3>
            <p className="mt-1 text-xs text-[var(--steel)]">
              OG preview, social posts, and README badge use this edition.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="border border-[var(--kraft)]/20 px-2.5 py-1 text-xs text-[var(--steel)] transition hover:text-[var(--kraft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ice)]/60"
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center border border-[var(--kraft)]/20 bg-black/40 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kraft)] transition hover:border-[var(--ice)]/50 hover:bg-[var(--ice)]/10"
          >
            Post on X
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center border border-[var(--kraft)]/20 bg-black/40 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kraft)] transition hover:border-[var(--ice)]/50 hover:bg-[var(--ice)]/10"
          >
            LinkedIn
          </a>
        </div>

        <div className="mt-4 overflow-hidden border border-[var(--kraft)]/15 bg-gradient-to-br from-[#1a1612] to-black/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--kraft)]/12 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-[var(--ice)]/40 bg-[var(--ice)]/10 font-display text-lg tracking-wide text-[var(--ice)]">
                OG
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ice)]">
                  Style preview image
                </p>
                <p className="mt-0.5 text-[10px] text-[var(--steel)]">{edition} edition</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCopyPng}
                className="bg-[var(--ice)] px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--ink)]"
              >
                {copied === "png" ? "Image copied!" : "Copy PNG"}
              </button>
              <button
                type="button"
                onClick={onCopyImage}
                className="border border-[var(--kraft)]/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kraft)]"
              >
                {copied === "image" ? "URL copied!" : "Copy URL"}
              </button>
            </div>
          </div>
          <div className="border-b border-[var(--kraft)]/12 bg-black/30 px-4 py-3">
            <div className="relative mx-auto h-48 w-[148px] overflow-hidden border border-[var(--kraft)]/15 bg-black/40 shadow-[0_12px_40px_rgba(0,0,0,.45)]">
              <Image
                src={previewSrc}
                alt={`${edition} IceOVR card preview`}
                fill
                sizes="148px"
                unoptimized
                className="object-contain object-center"
              />
            </div>
          </div>
          <code className="block overflow-x-auto whitespace-nowrap px-4 py-3 text-xs leading-relaxed text-[var(--kraft)]">
            {publicPng}
          </code>
        </div>

        <EmbedRow
          label={`README badge · ${edition}`}
          value={markdown}
          button={copied === "markdown" ? "Copied!" : "Copy markdown"}
          onCopy={onCopyMarkdown}
          code
        />
        <EmbedRow label="Profile link" value={pageUrl} button="Copy link" onCopy={() => void navigator.clipboard?.writeText(pageUrl)} />
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
    <div className="mt-4 border border-[var(--kraft)]/12 bg-black/35 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--steel)]">
          {label}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--ice)] transition hover:text-[var(--kraft)]"
        >
          {button}
        </button>
      </div>
      <code
        className={`block overflow-x-auto whitespace-nowrap text-xs leading-relaxed ${code ? "text-[var(--ice)]" : "text-[var(--kraft)]"}`}
      >
        {value}
      </code>
    </div>
  );
}
