"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { readRecentScouts } from "@/lib/client/recent-scouts";
import {
  buildPlayoffPath,
  PLAYOFF_SIZE,
  type PlayoffBracket,
  type PlayoffMatch,
} from "@/lib/playoffs";
import type { ScoutCard } from "@/lib/types";

export function PlayoffBracketView({
  bracket,
  cards,
}: {
  bracket: PlayoffBracket | null;
  cards: ScoutCard[];
}) {
  const [slots, setSlots] = useState<string[]>(() =>
    Array.from({ length: PLAYOFF_SIZE }, (_, index) => bracket?.players[index] ?? ""),
  );
  const [copied, setCopied] = useState(false);

  const cardByLogin = useMemo(
    () => new Map(cards.map((card) => [card.username.toLowerCase(), card])),
    [cards],
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    window.location.assign(buildPlayoffPath(slots));
  }

  function prefillRecent() {
    const recent = readRecentScouts().map((item) => item.username);
    setSlots((current) => {
      const next = [...current];
      let cursor = 0;
      for (const name of recent) {
        while (cursor < PLAYOFF_SIZE && next[cursor]) cursor += 1;
        if (cursor >= PLAYOFF_SIZE) break;
        next[cursor] = name;
        cursor += 1;
      }
      return next;
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  const qf = bracket?.matches.filter((match) => match.round === "qf") ?? [];
  const sf = bracket?.matches.filter((match) => match.round === "sf") ?? [];
  const final = bracket?.matches.find((match) => match.round === "final");

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <header className="border-b border-white/10 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#fda4af]">
          Single-elim · eight skaters
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl tracking-[0.08em] text-white sm:text-5xl">
            PLAYOFFS
          </h1>
          {bracket && (
            <button
              type="button"
              onClick={() => void copyLink()}
              className="rounded-lg border border-[#fda4af]/35 bg-[#e11d2e]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#fda4af]"
            >
              {copied ? "Link copied" : "Copy bracket URL"}
            </button>
          )}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
          Seed eight GitHub profiles. Higher OVR advances — shareable, deterministic
          bracket. Open any matchup for a full faceoff duel.
        </p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {slots.map((value, index) => (
            <label key={index} className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#64748b]">
                Seed {index + 1}
              </span>
              <input
                value={value}
                onChange={(event) =>
                  setSlots((current) =>
                    current.map((item, i) =>
                      i === index ? event.target.value : item,
                    ),
                  )
                }
                placeholder={`player ${index + 1}`}
                className="mt-1 w-full border border-white/12 bg-black/35 px-3 py-2.5 text-sm text-white outline-none focus:border-[#fda4af]/45"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="jersey-cta px-5 py-2.5 text-[10px]">
            Build bracket
          </button>
          <button
            type="button"
            onClick={prefillRecent}
            className="jersey-cta-ghost px-5 py-2.5 text-[10px]"
          >
            Prefill recent scouts
          </button>
        </div>
      </form>

      {bracket && bracket.players.length >= 2 && (
        <div className="mt-10 space-y-8">
          {bracket.champion && (
            <div className="border border-[#ffb703]/35 bg-[linear-gradient(135deg,rgba(255,183,3,0.12),rgba(7,21,36,0.95))] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffb703]">
                Cup champion
              </p>
              <p className="mt-1 font-display text-4xl tracking-[0.08em] text-white">
                @{bracket.champion}
              </p>
              <Link
                href={`/u/${bracket.champion}`}
                className="mt-3 inline-block text-[11px] font-bold uppercase tracking-[0.14em] text-[#7dd3fc]"
              >
                Open scout report
              </Link>
            </div>
          )}

          <RoundColumn title="Quarterfinals" matches={qf} cardByLogin={cardByLogin} />
          <RoundColumn title="Semifinals" matches={sf} cardByLogin={cardByLogin} />
          {final && (
            <RoundColumn title="Final" matches={[final]} cardByLogin={cardByLogin} />
          )}
        </div>
      )}
    </section>
  );
}

function RoundColumn({
  title,
  matches,
  cardByLogin,
}: {
  title: string;
  matches: PlayoffMatch[];
  cardByLogin: Map<string, ScoutCard>;
}) {
  return (
    <div>
      <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#7dd3fc]">
        {title}
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {matches.map((match, index) => (
          <MatchCard
            key={match.id}
            match={match}
            delay={index * 90}
            cardByLogin={cardByLogin}
          />
        ))}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  delay,
  cardByLogin,
}: {
  match: PlayoffMatch;
  delay: number;
  cardByLogin: Map<string, ScoutCard>;
}) {
  const leftCard = match.left
    ? cardByLogin.get(match.left.toLowerCase())
    : undefined;
  const rightCard = match.right
    ? cardByLogin.get(match.right.toLowerCase())
    : undefined;
  const canDuel = Boolean(match.left && match.right);

  return (
    <article
      className="duel-round border border-white/10 bg-[#071524]/75 p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <SeedRow
        username={match.left}
        ovr={match.leftOvr}
        winner={match.winner === match.left}
        displayName={leftCard?.displayName}
      />
      <p className="my-2 text-center font-display text-xl text-[#e11d2e]">VS</p>
      <SeedRow
        username={match.right}
        ovr={match.rightOvr}
        winner={match.winner === match.right}
        displayName={rightCard?.displayName}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {canDuel && (
          <Link
            href={`/compare?left=${encodeURIComponent(match.left!)}&right=${encodeURIComponent(match.right!)}`}
            className="text-[10px] font-black uppercase tracking-[0.14em] text-[#7dd3fc] underline-offset-2 hover:underline"
          >
            Play duel
          </Link>
        )}
        {match.winner && (
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#ffb703]">
            Advances @{match.winner}
          </span>
        )}
      </div>
    </article>
  );
}

function SeedRow({
  username,
  ovr,
  winner,
  displayName,
}: {
  username: string | null;
  ovr: number | null;
  winner: boolean;
  displayName?: string;
}) {
  if (!username) {
    return (
      <div className="border border-dashed border-white/10 px-3 py-2 text-sm text-[#64748b]">
        Bye / empty seed
      </div>
    );
  }
  return (
    <Link
      href={`/u/${username}`}
      className={`flex items-center justify-between gap-3 border px-3 py-2 transition ${
        winner
          ? "border-[#ffb703]/40 bg-[#ffb703]/10 text-white"
          : "border-white/10 bg-black/25 text-[#94a3b8] hover:text-white"
      }`}
    >
      <span className="min-w-0 truncate">
        <span className="font-display tracking-[0.06em]">
          {displayName ?? username}
        </span>
        <span className="ml-2 text-[11px] text-[#64748b]">@{username}</span>
      </span>
      <span className="font-display text-xl text-[#7dd3fc]">{ovr ?? "—"}</span>
    </Link>
  );
}
