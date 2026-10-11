"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { PlayerCard } from "@/components/PlayerCard";
import { readRecentScouts } from "@/lib/client/recent-scouts";
import {
  buildBoardSharePath,
  cupTitle,
  filterDraftBoardByCup,
  listCupOptions,
  mergeDraftUsernames,
  pickPlayerOfTheWeek,
  sortDraftBoard,
  type DraftBoardRow,
  type DraftBoardSort,
  type DraftCup,
} from "@/lib/draft-board";
import { TIER_META } from "@/lib/tiers";

const SORTS: { id: DraftBoardSort; label: string; detail: string }[] = [
  { id: "ovr", label: "Top OVR", detail: "Overall rating" },
  { id: "streak", label: "Streak", detail: "Active days" },
  { id: "stars", label: "Stars", detail: "Repo influence" },
];

const MIN_CUP_SIZE = 3;

export function DraftBoard({
  rows,
  initialUsernames,
  initialCup,
  urlPlayers,
}: {
  rows: DraftBoardRow[];
  initialUsernames: string[];
  initialCup: DraftCup;
  urlPlayers: string[];
}) {
  const router = useRouter();
  const [sort, setSort] = useState<DraftBoardSort>("ovr");
  const [cup, setCup] = useState<DraftCup>(initialCup);
  const [copied, setCopied] = useState(false);
  const [recentExtra, setRecentExtra] = useState<string[]>([]);

  useEffect(() => {
    setCup(initialCup);
  }, [initialCup]);

  useEffect(() => {
    const recent = readRecentScouts().map((item) => item.username);
    if (recent.length === 0) return;
    const merged = mergeDraftUsernames([...urlPlayers, ...recent]);
    const missing = merged.filter(
      (name) =>
        !initialUsernames.some(
          (loaded) => loaded.toLowerCase() === name.toLowerCase(),
        ),
    );
    if (missing.length === 0) return;
    setRecentExtra(missing);
    router.replace(buildBoardSharePath(merged, initialCup));
    // One-shot hybrid inject from local recent scouts.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on first board payload
  }, [initialUsernames.join(","), urlPlayers.join(",")]);

  const cupOptions = useMemo(() => listCupOptions(rows), [rows]);
  const filtered = useMemo(
    () => filterDraftBoardByCup(rows, cup),
    [rows, cup],
  );
  const ranked = useMemo(
    () => sortDraftBoard(filtered, sort),
    [filtered, sort],
  );
  const potw = useMemo(
    () => pickPlayerOfTheWeek(filtered.length > 0 ? filtered : rows),
    [filtered, rows],
  );
  const activeCupTitle = cupTitle(cup);
  const cupTooSmall = Boolean(cup && filtered.length < MIN_CUP_SIZE);

  function onSortKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = SORTS.findIndex((item) => item.id === sort);
    if (current < 0) return;
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (current + 1) % SORTS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + SORTS.length) % SORTS.length;
    } else {
      return;
    }
    event.preventDefault();
    setSort(SORTS[next].id);
  }

  function applyCup(next: DraftCup) {
    setCup(next);
    router.replace(buildBoardSharePath(initialUsernames, next));
  }

  async function copyBoardLink() {
    const path = buildBoardSharePath(initialUsernames, cup);
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  if (rows.length === 0) {
    return (
      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-6 text-center text-sm text-amber-100/80">
          Draft board could not load scouts right now. Try again after the GitHub feed cools down.
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <header className="border-b border-white/10 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7dd3fc]">
          Open ice · live season
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl tracking-[0.08em] text-white sm:text-5xl">
            DRAFT BOARD
          </h1>
          <button
            type="button"
            onClick={() => void copyBoardLink()}
            className="rounded-lg border border-[#7dd3fc]/35 bg-[#7dd3fc]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#7dd3fc] transition hover:bg-[#7dd3fc]/20"
          >
            {copied ? "Link copied" : "Copy board link"}
          </button>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
          Hybrid board: curated seeds plus your recent scouts and shareable player lists —
          ranked by overall, streak, and stars, with nation and language cups.
        </p>
        {recentExtra.length > 0 && (
          <p className="mt-2 text-[11px] text-[#7dd3fc]/80">
            Pulling in recent scouts: {recentExtra.map((u) => `@${u}`).join(", ")}
          </p>
        )}
      </header>

      <CupFilters
        options={cupOptions}
        cup={cup}
        title={activeCupTitle}
        onSelect={applyCup}
      />

      {cupTooSmall ? (
        <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm text-amber-100/80">
          {activeCupTitle ?? "This cup"} needs at least {MIN_CUP_SIZE} scouts on the board.
          Scout more players from that nation or language, or clear the cup filter.
        </div>
      ) : (
        <>
          {potw && <PlayerOfTheWeek row={potw} cupLabel={activeCupTitle} />}

          <div
            className="mt-8 flex overflow-x-auto rounded-xl border border-white/10 bg-[#071524]/70 p-1.5"
            role="tablist"
            aria-label="Leaderboard sort"
            onKeyDown={onSortKeyDown}
          >
            {SORTS.map((item) => {
              const active = sort === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSort(item.id)}
                  className={`min-w-[7.5rem] flex-1 rounded-lg px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]/50 ${
                    active
                      ? "bg-[#7dd3fc]/12 text-white shadow-[inset_0_0_0_1px_rgba(125,211,252,.25)]"
                      : "text-[#94a3b8] hover:bg-white/[.04] hover:text-white"
                  }`}
                >
                  <span className="block text-[10px] font-black uppercase tracking-[0.16em]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-[#64748b]">
                    {item.detail}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#071524]/75">
            <div className="hidden grid-cols-[3rem_minmax(0,1.4fr)_5rem_5rem_6rem_6rem] gap-2 border-b border-white/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#64748b] sm:grid">
              <span>#</span>
              <span>Player</span>
              <span className="text-right">OVR</span>
              <span className="text-right">Streak</span>
              <span className="text-right">Stars</span>
              <span className="text-right">Form</span>
            </div>
            <ol className="divide-y divide-white/8">
              {ranked.map((row, index) => (
                <BoardRowItem
                  key={row.card.username}
                  row={row}
                  rank={index + 1}
                  highlight={sort}
                />
              ))}
            </ol>
          </div>
        </>
      )}

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-[#64748b]">
        Live hybrid league · public GitHub only · refreshed with scout cache
      </p>
    </section>
  );
}

function CupFilters({
  options,
  cup,
  title,
  onSelect,
}: {
  options: ReturnType<typeof listCupOptions>;
  cup: DraftCup;
  title: string | null;
  onSelect: (cup: DraftCup) => void;
}) {
  if (options.countries.length === 0 && options.languages.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fda4af]">
          Cups
        </p>
        {title && (
          <span className="rounded border border-[#fda4af]/30 bg-[#e11d2e]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#fda4af]">
            {title}
          </span>
        )}
        {cup && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8] underline-offset-2 hover:text-white hover:underline"
          >
            Clear cup
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.countries.map((item) => {
          const active =
            cup?.kind === "country" && cup.code === item.code;
          return (
            <button
              key={`c-${item.code}`}
              type="button"
              onClick={() =>
                onSelect(active ? null : { kind: "country", code: item.code })
              }
              className={`rounded border px-3 py-1 text-[11px] font-bold transition ${
                active
                  ? "border-[#fda4af]/50 bg-[#e11d2e]/20 text-[#fda4af]"
                  : "border-white/10 bg-black/20 text-[#94a3b8] hover:border-white/25 hover:text-white"
              }`}
            >
              {item.label} · {item.count}
            </button>
          );
        })}
        {options.languages.map((item) => {
          const active =
            cup?.kind === "lang" &&
            cup.language.toLowerCase() === item.language.toLowerCase();
          return (
            <button
              key={`l-${item.language}`}
              type="button"
              onClick={() =>
                onSelect(
                  active ? null : { kind: "lang", language: item.language },
                )
              }
              className={`rounded border px-3 py-1 text-[11px] font-bold transition ${
                active
                  ? "border-[#7dd3fc]/50 bg-[#7dd3fc]/15 text-[#7dd3fc]"
                  : "border-white/10 bg-black/20 text-[#94a3b8] hover:border-white/25 hover:text-white"
              }`}
            >
              {item.label} · {item.count}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlayerOfTheWeek({
  row,
  cupLabel,
}: {
  row: DraftBoardRow;
  cupLabel: string | null;
}) {
  const tier = TIER_META[row.card.tier];
  const deltaLabel =
    row.form.delta > 0 ? `+${row.form.delta}` : String(row.form.delta);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#e11d2e]/35 bg-[linear-gradient(135deg,rgba(225,29,46,0.12),rgba(7,21,36,0.95)_45%)] p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#fda4af]">
            {cupLabel ? `${cupLabel} · player of the week` : "Player of the week"}
          </p>
          <h2 className="mt-1 font-display text-3xl tracking-[0.08em] text-white sm:text-4xl">
            {row.card.displayName}
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            @{row.card.username}
            {" · "}
            <span style={{ color: tier.accent }}>{tier.label}</span>
            {" · "}
            {row.form.direction} form
          </p>
          <div className="mt-4 grid max-w-md grid-cols-3 gap-2">
            <PotwStat label="OVR" value={String(row.card.ovr)} />
            <PotwStat label="Δ 30d" value={deltaLabel} accent />
            <PotwStat label="Streak" value={`${row.form.streak}d`} />
          </div>
          <Link
            href={`/u/${row.card.username}`}
            className="mt-5 inline-flex rounded-lg bg-[#e11d2e] px-4 py-2.5 font-display text-sm tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(225,29,46,0.35)] transition hover:bg-[#f12638] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fda4af]/60"
          >
            OPEN SCOUT REPORT
          </Link>
        </div>
        <div className="mx-auto origin-top scale-[0.9] sm:scale-100 lg:mx-0">
          <PlayerCard card={row.card} size="sm" />
        </div>
      </div>
    </div>
  );
}

function PotwStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#64748b]">
        {label}
      </p>
      <p
        className={`mt-0.5 font-display text-2xl ${accent ? "text-[#fda4af]" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

function BoardRowItem({
  row,
  rank,
  highlight,
}: {
  row: DraftBoardRow;
  rank: number;
  highlight: DraftBoardSort;
}) {
  const tier = TIER_META[row.card.tier];
  const formTone =
    row.form.direction === "rising"
      ? "text-emerald-300"
      : row.form.direction === "falling"
        ? "text-[#fda4af]"
        : "text-[#94a3b8]";

  return (
    <li>
      <Link
        href={`/u/${row.card.username}`}
        className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-2 px-3 py-3 transition hover:bg-white/[0.03] sm:grid-cols-[3rem_minmax(0,1.4fr)_5rem_5rem_6rem_6rem] sm:gap-2 sm:px-4"
      >
        <span className="font-display text-xl text-white/70">{rank}</span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg tracking-[0.06em] text-white sm:text-xl">
            {row.card.displayName}
          </p>
          <p className="truncate text-[11px] text-[#64748b]">
            @{row.card.username}
            <span className="mx-1.5 text-white/20">·</span>
            <span style={{ color: tier.accent }}>{tier.label}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] sm:hidden">
            <span className={highlight === "ovr" ? "text-[#7dd3fc]" : undefined}>
              {row.card.ovr} OVR
            </span>
            <span
              className={highlight === "streak" ? "text-[#7dd3fc]" : undefined}
            >
              {row.form.streak}d
            </span>
            <span
              className={highlight === "stars" ? "text-[#7dd3fc]" : undefined}
            >
              {row.card.raw.stars.toLocaleString()}★
            </span>
            <span className={formTone}>{row.form.direction}</span>
          </div>
        </div>
        <span
          className={`hidden text-right font-display text-2xl sm:block ${
            highlight === "ovr" ? "text-[#7dd3fc]" : "text-white"
          }`}
        >
          {row.card.ovr}
        </span>
        <span
          className={`hidden text-right text-sm font-bold sm:block ${
            highlight === "streak" ? "text-[#7dd3fc]" : "text-white"
          }`}
        >
          {row.form.streak}d
        </span>
        <span
          className={`hidden text-right text-sm font-bold sm:block ${
            highlight === "stars" ? "text-[#7dd3fc]" : "text-white"
          }`}
        >
          {row.card.raw.stars.toLocaleString()}
        </span>
        <span
          className={`hidden text-right text-[10px] font-black uppercase tracking-[0.14em] sm:block ${formTone}`}
        >
          {row.form.direction}
          {row.form.delta !== 0
            ? ` ${row.form.delta > 0 ? "+" : ""}${row.form.delta}`
            : ""}
        </span>
      </Link>
    </li>
  );
}
