"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { useArenaAudio } from "@/components/ArenaAudioProvider";

type SlotKey =
  | "lw"
  | "c"
  | "rw"
  | "ld"
  | "rd"
  | "g"
  | "lw2"
  | "c2"
  | "rw2"
  | "ld2"
  | "rd2"
  | "g2"
  | "b1"
  | "b2"
  | "b3"
  | "b4";

type Formation = "first" | "second" | "bench";

type TeamRating = {
  ratings: Record<string, number>;
  teamOvr: number | null;
  chemistry: number | null;
  scouted: number;
  connections: Array<{ players: [string, string]; score: number; reasons: string[] }>;
};

type GitHubSuggestion = { login: string; avatarUrl: string };

type SavedTeam = {
  name: string;
  players: Partial<Record<SlotKey, string>>;
  captain?: SlotKey;
  alternate?: SlotKey;
};

type Slot = {
  key: SlotKey;
  label: string;
  description: string;
  formation: Formation;
};

const SLOTS: Slot[] = [
  { key: "lw", label: "LW", description: "First line · Left wing", formation: "first" },
  { key: "c", label: "C", description: "First line · Center", formation: "first" },
  { key: "rw", label: "RW", description: "First line · Right wing", formation: "first" },
  { key: "ld", label: "LD", description: "First pair · Left defense", formation: "first" },
  { key: "rd", label: "RD", description: "First pair · Right defense", formation: "first" },
  { key: "g", label: "G", description: "Starting goaltender", formation: "first" },
  { key: "lw2", label: "LW", description: "Second line · Left wing", formation: "second" },
  { key: "c2", label: "C", description: "Second line · Center", formation: "second" },
  { key: "rw2", label: "RW", description: "Second line · Right wing", formation: "second" },
  { key: "ld2", label: "LD", description: "Second pair · Left defense", formation: "second" },
  { key: "rd2", label: "RD", description: "Second pair · Right defense", formation: "second" },
  { key: "g2", label: "G", description: "Backup goaltender", formation: "second" },
  { key: "b1", label: "B1", description: "Bench 1", formation: "bench" },
  { key: "b2", label: "B2", description: "Bench 2", formation: "bench" },
  { key: "b3", label: "B3", description: "Bench 3", formation: "bench" },
  { key: "b4", label: "B4", description: "Bench 4", formation: "bench" },
];

const STORAGE_KEY = "iceovr-team-v1";
const DEFAULT_TEAM_NAME = "My IceOVR Team";

export function TeamBuilder() {
  const { playPuckShot } = useArenaAudio();
  const [team, setTeam] = useState<Partial<Record<SlotKey, string>>>({});
  const [teamName, setTeamName] = useState(DEFAULT_TEAM_NAME);
  const [selectedSlot, setSelectedSlot] = useState<SlotKey>("c");
  const [formation, setFormation] = useState<Formation>("first");
  const [username, setUsername] = useState("");
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [rating, setRating] = useState<TeamRating | null>(null);
  const [captain, setCaptain] = useState<SlotKey | null>(null);
  const [alternate, setAlternate] = useState<SlotKey | null>(null);
  const [suggestions, setSuggestions] = useState<GitHubSuggestion[]>([]);
  const [copied, setCopied] = useState(false);
  const [opponentLink, setOpponentLink] = useState("");
  const [opponent, setOpponent] = useState<{ team: SavedTeam; rating: TeamRating } | null>(null);

  useEffect(() => {
    try {
      const shared = parseTeam(window.location.search);
      const stored = shared ? null : window.localStorage.getItem(STORAGE_KEY);
      if (shared) {
        setTeam(shared.players);
        setTeamName(shared.name);
        setCaptain(shared.captain ?? null);
        setAlternate(shared.alternate ?? null);
      } else if (stored) {
        const saved = JSON.parse(stored) as Partial<Record<SlotKey, string>> | Partial<SavedTeam>;
        if ("players" in saved) {
          setTeam(saved.players ?? {});
          setTeamName(saved.name || DEFAULT_TEAM_NAME);
          setCaptain(saved.captain ?? null);
          setAlternate(saved.alternate ?? null);
        } else {
          setTeam(saved as Partial<Record<SlotKey, string>>);
        }
      }
    } catch {
      // A team is a convenience feature; an unavailable storage must not block the page.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: teamName, players: team, captain: captain ?? undefined, alternate: alternate ?? undefined } satisfies SavedTeam),
      );
    }
  }, [alternate, captain, ready, team, teamName]);

  useEffect(() => {
    const query = username.trim().replace(/^@/, "");
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch(`/api/github-search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : { users: [] }))
        .then((data: { users: GitHubSuggestion[] }) => setSuggestions(data.users))
        .catch(() => {});
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [username]);

  useEffect(() => {
    const sharedTeam = parseTeamInput(opponentLink);
    const usernames = sharedTeam
      ? [...new Set(Object.values(sharedTeam.players).filter((value): value is string => Boolean(value)))]
      : [];
    if (!sharedTeam || usernames.length === 0) {
      setOpponent(null);
      return;
    }
    const controller = new AbortController();
    void fetch(`/api/team-rating?players=${encodeURIComponent(usernames.join(","))}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Could not scout opponent"))))
      .then((summary: TeamRating) => setOpponent({ team: sharedTeam, rating: summary }))
      .catch(() => setOpponent(null));
    return () => controller.abort();
  }, [opponentLink]);

  useEffect(() => {
    const usernames = [...new Set(Object.values(team).filter((value): value is string => Boolean(value)))];
    if (!ready || usernames.length === 0) {
      setRating(null);
      return;
    }

    const controller = new AbortController();
    void fetch(`/api/team-rating?players=${encodeURIComponent(usernames.join(","))}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Could not scout roster"))))
      .then((summary: TeamRating) => setRating(summary))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRating(null);
      });
    return () => controller.abort();
  }, [ready, team]);

  function addPlayer(event: FormEvent) {
    event.preventDefault();
    const clean = username.trim().replace(/^@/, "").replace(/\s/g, "");
    if (!clean) return;
    playPuckShot();
    setTeam((current) => ({ ...current, [selectedSlot]: clean }));
    setUsername("");
  }

  function clearTeam() {
    setTeam({});
    setCaptain(null);
    setAlternate(null);
    playPuckShot();
  }

  async function copyShareLink() {
    const roster: SavedTeam = { name: teamName.trim() || DEFAULT_TEAM_NAME, players: team, captain: captain ?? undefined, alternate: alternate ?? undefined };
    const url = new URL("/team", window.location.origin);
    url.searchParams.set("roster", JSON.stringify(roster));
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function setLeadership(role: "captain" | "alternate") {
    if (!team[selectedSlot]) return;
    if (role === "captain") {
      setCaptain(selectedSlot);
      if (alternate === selectedSlot) setAlternate(null);
    } else {
      setAlternate(selectedSlot);
      if (captain === selectedSlot) setCaptain(null);
    }
    playPuckShot();
  }

  async function downloadTeamCard() {
    setDownloading(true);
    playPuckShot();
    const params = new URLSearchParams({ name: teamName.trim() || DEFAULT_TEAM_NAME });
    for (const slot of SLOTS) {
      const player = team[slot.key];
      if (player) params.set(slot.key, player);
    }

    try {
      const response = await fetch(`/api/team-card?${params.toString()}`);
      if (!response.ok) throw new Error("Could not generate team card");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify(teamName || DEFAULT_TEAM_NAME)}-lineup.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const firstLine = SLOTS.filter((slot) => slot.formation === "first");
  const activeFormation = SLOTS.filter((slot) => slot.formation === formation);
  const bench = SLOTS.filter((slot) => slot.formation === "bench");
  const filledStarters = firstLine.filter((slot) => team[slot.key]).length;
  const chemistry = Math.min(100, (rating?.chemistry ?? 0) + (captain ? 6 : 0) + (alternate ? 3 : 0));
  const selectedPlayer = team[selectedSlot];
  const matchup = rating && opponent ? simulateMatchup(teamName, rating.teamOvr ?? 0, chemistry, opponent.team.name, opponent.rating.teamOvr ?? 0, opponent.rating.chemistry ?? 0) : null;

  function playerRating(slot: SlotKey): number | undefined {
    const player = team[slot];
    return player ? rating?.ratings[player.toLowerCase()] : undefined;
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-5 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#7dd3fc]">Franchise mode</p>
          <input
            aria-label="Team name"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value.slice(0, 42))}
            className="mt-1 w-full max-w-xl border-b border-transparent bg-transparent font-display text-4xl tracking-[0.1em] text-white outline-none transition placeholder:text-white/30 focus:border-[#7dd3fc]/60 sm:text-5xl"
            placeholder="NAME YOUR TEAM"
          />
          <p className="mt-2 max-w-xl text-sm text-[#94a3b8]">
            Draft GitHub profiles into two lines, two defensive pairs, and a goalie tandem. Your roster stays on this device.
          </p>
        </div>
        <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black/25 text-right">
          <div className="px-4 py-3">
            <p className="font-display text-3xl tracking-wide text-white">{filledStarters}/6</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">Starting six</p>
          </div>
          <div className="border-l border-white/10 px-4 py-3">
            <p className="font-display text-3xl tracking-wide text-[#7dd3fc]">{rating?.teamOvr ?? "—"}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">Team OVR</p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-hidden rounded-2xl border border-[#7dd3fc]/15 bg-[#061423]/80 p-3 shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:p-5">
          <div className="relative min-h-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#0b2840]">
            <div aria-hidden className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(90deg, transparent 49.7%, rgba(225,29,46,.65) 49.7% 50.3%, transparent 50.3%), radial-gradient(ellipse 60% 34% at 50% 50%, transparent 99%, rgba(125,211,252,.45) 100%)" }} />
            <div aria-hidden className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7dd3fc]/30" />
            <div aria-hidden className="absolute inset-y-0 left-[9%] w-px bg-[#7dd3fc]/35" />
            <div aria-hidden className="absolute inset-y-0 right-[9%] w-px bg-[#7dd3fc]/35" />
            <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#7dd3fc]/60">GitHub edition · on ice</p>
              <div className="flex rounded-lg border border-white/10 bg-black/25 p-1">
                {(["first", "second"] as const).map((line) => (
                  <button
                    key={line}
                    type="button"
                    onClick={() => {
                      setFormation(line);
                      setSelectedSlot(line === "first" ? "c" : "c2");
                    }}
                    className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] transition ${
                      formation === line ? "bg-[#e11d2e] text-white" : "text-[#94a3b8] hover:text-white"
                    }`}
                  >
                    {line === "first" ? "1st line" : "2nd line"}
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-3 sm:inset-x-8 sm:gap-5">
              {activeFormation.map((slot) => (
                <RosterSlot
                  key={slot.key}
                  slot={slot}
                  username={team[slot.key]}
                  rating={playerRating(slot.key)}
                  selected={selectedSlot === slot.key}
                  onSelect={() => setSelectedSlot(slot.key)}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <form onSubmit={addPlayer} className="rounded-2xl border border-white/10 bg-[#081625]/85 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Draft a player</p>
            <p className="mt-1 text-sm text-white">
              Assign to <span className="font-bold text-[#fda4af]">{SLOTS.find((slot) => slot.key === selectedSlot)?.description}</span>
            </p>
            <label className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]" htmlFor="github-username">
              GitHub username
            </label>
            <input
              id="github-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="@torvalds"
              className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-sm text-white outline-none placeholder:text-[#64748b] focus:border-[#7dd3fc]/60"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {suggestions.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-[#050b13]">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.login}
                    type="button"
                    onClick={() => {
                      setUsername(suggestion.login);
                      setSuggestions([]);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-2 text-left text-xs text-white transition hover:bg-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={suggestion.avatarUrl} alt="" className="h-6 w-6 rounded-full" />
                    <span className="font-semibold">@{suggestion.login}</span>
                  </button>
                ))}
              </div>
            )}
            <button type="submit" className="mt-3 h-11 w-full rounded-lg bg-[#e11d2e] font-display text-lg tracking-[0.14em] text-white shadow-[0_8px_22px_rgba(225,29,46,.25)] transition hover:bg-[#f12638]">
              ADD TO ROSTER
            </button>
          </form>

          <section className="rounded-2xl border border-[#7dd3fc]/20 bg-[#081625]/85 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Share your lineup</p>
            <p className="mt-1 text-sm text-[#94a3b8]">Copy a link that recreates this roster on any device.</p>
            <button
              type="button"
              onClick={() => void copyShareLink()}
              className="mt-3 h-11 w-full rounded-lg border border-white/15 bg-black/20 font-display text-lg tracking-[0.12em] text-white transition hover:border-[#7dd3fc]/60"
            >
              {copied ? "LINK COPIED!" : "COPY SHARE LINK"}
            </button>
            <button
              type="button"
              onClick={() => void downloadTeamCard()}
              disabled={downloading}
              className="mt-2 h-11 w-full rounded-lg border border-[#7dd3fc]/40 bg-[#7dd3fc]/10 font-display text-lg tracking-[0.12em] text-[#dff7ff] transition hover:bg-[#7dd3fc]/20 disabled:cursor-wait disabled:opacity-60"
            >
              {downloading ? "GENERATING…" : "DOWNLOAD PNG"}
            </button>
          </section>

          {selectedPlayer && (
            <section className="rounded-2xl border border-white/10 bg-[#081625]/85 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Leadership</p>
              <p className="mt-1 text-sm text-white">@{selectedPlayer}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLeadership("captain")}
                  className={`rounded-lg border px-2 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${
                    captain === selectedSlot ? "border-[#fbbf24] bg-[#fbbf24]/15 text-[#fde68a]" : "border-white/15 text-[#cbd5e1]"
                  }`}
                >
                  {captain === selectedSlot ? "Captain" : "Make captain"}
                </button>
                <button
                  type="button"
                  onClick={() => setLeadership("alternate")}
                  className={`rounded-lg border px-2 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${
                    alternate === selectedSlot ? "border-[#7dd3fc] bg-[#7dd3fc]/15 text-[#dff7ff]" : "border-white/15 text-[#cbd5e1]"
                  }`}
                >
                  {alternate === selectedSlot ? "Alternate" : "Make alternate"}
                </button>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-white/10 bg-[#081625]/85 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Team chemistry</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="font-display text-4xl tracking-wide text-white">{rating ? chemistry : "—"}</p>
              <p className="text-right text-[10px] uppercase tracking-[0.16em] text-[#94a3b8]">
                {rating ? `${rating.scouted} profiles scouted` : "Add GitHub players"}
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#e11d2e] to-[#7dd3fc] transition-[width] duration-700"
                style={{ width: `${rating ? chemistry : 0}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#94a3b8]">
              Chemistry rewards a complete roster, player links, and leadership bonuses.
            </p>
            {rating?.connections[0] && (
              <p className="mt-2 border-t border-white/10 pt-2 text-[10px] text-[#cbd5e1]">
                Best link: @{rating.connections[0].players[0]} + @{rating.connections[0].players[1]} · {rating.connections[0].reasons.join(" + ")}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#081625]/85 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Matchup mode</p>
            <p className="mt-1 text-sm text-[#94a3b8]">Paste another team&apos;s share link for a simulated matchup.</p>
            <input
              value={opponentLink}
              onChange={(event) => setOpponentLink(event.target.value)}
              placeholder="Paste team share link"
              className="mt-3 h-10 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-xs text-white outline-none placeholder:text-[#64748b] focus:border-[#7dd3fc]/60"
              spellCheck={false}
            />
            {matchup && (
              <div className="mt-3 rounded-lg border border-white/10 bg-black/25 p-3 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Simulated final</p>
                <p className="mt-1 font-display text-2xl tracking-[0.08em] text-white">
                  {matchup.homeName} {matchup.homeGoals} — {matchup.awayGoals} {matchup.awayName}
                </p>
                <p className="mt-1 text-[10px] text-[#7dd3fc]">{matchup.winner} wins on OVR and chemistry</p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#081625]/85 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7dd3fc]">Bench</p>
              <button type="button" onClick={clearTeam} className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#fda4af] hover:text-white">
                Clear team
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {bench.map((slot) => (
                <RosterSlot
                  key={slot.key}
                  slot={slot}
                  username={team[slot.key]}
                  rating={playerRating(slot.key)}
                  selected={selectedSlot === slot.key}
                  onSelect={() => setSelectedSlot(slot.key)}
                  compact
                />
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "iceovr-team";
}

function parseTeam(search: string): SavedTeam | null {
  try {
    const raw = new URLSearchParams(search).get("roster");
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<SavedTeam>;
    if (!value.players || typeof value.name !== "string") return null;
    const players = Object.fromEntries(
      Object.entries(value.players).filter(([slot, username]) => SLOTS.some((item) => item.key === slot) && typeof username === "string"),
    ) as Partial<Record<SlotKey, string>>;
    return {
      name: value.name.slice(0, 42) || DEFAULT_TEAM_NAME,
      players,
      captain: SLOTS.some((slot) => slot.key === value.captain) ? value.captain : undefined,
      alternate: SLOTS.some((slot) => slot.key === value.alternate) ? value.alternate : undefined,
    };
  } catch {
    return null;
  }
}

function parseTeamInput(value: string): SavedTeam | null {
  try {
    return parseTeam(value.startsWith("http") ? new URL(value).search : value);
  } catch {
    return null;
  }
}

function simulateMatchup(
  homeName: string,
  homeOvr: number,
  homeChemistry: number,
  awayName: string,
  awayOvr: number,
  awayChemistry: number,
) {
  const homeStrength = homeOvr + homeChemistry / 10;
  const awayStrength = awayOvr + awayChemistry / 10;
  const variation = (hash(`${homeName}:${awayName}`) % 3) - 1;
  const homeGoals = Math.max(0, Math.round(3 + (homeStrength - awayStrength) / 6 + variation));
  const awayGoals = Math.max(0, Math.round(3 + (awayStrength - homeStrength) / 6 - variation));
  const winner = homeGoals === awayGoals ? "Overtime remains tied" : homeGoals > awayGoals ? homeName : awayName;
  return { homeName, awayName, homeGoals, awayGoals, winner };
}

function hash(value: string): number {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(result);
}

function RosterSlot({
  slot,
  username,
  rating,
  selected,
  onSelect,
  compact = false,
}: {
  slot: Slot;
  username?: string;
  rating?: number;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      className={`group relative overflow-hidden rounded-xl border text-left transition ${compact ? "min-h-20 p-2" : "min-h-32 p-3"} ${
        selected ? "border-[#e11d2e] bg-[#e11d2e]/15 shadow-[0_0_24px_rgba(225,29,46,.18)]" : "border-white/15 bg-[#020b14]/60 hover:border-[#7dd3fc]/55"
      }`}
    >
      <span className={`absolute right-2 top-2 font-display text-white/45 ${compact ? "text-lg" : "text-2xl"}`}>{slot.label}</span>
      {username ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://github.com/${encodeURIComponent(username)}.png?size=96`} alt="" className={`rounded-full border border-white/20 object-cover ${compact ? "h-8 w-8" : "h-11 w-11"}`} />
          <span className={`mt-2 block truncate font-bold text-white ${compact ? "text-[11px]" : "text-sm"}`}>@{username}</span>
          <span className="mt-0.5 block text-[9px] uppercase tracking-[0.15em] text-[#7dd3fc]">
            {rating ? `${rating} OVR` : "Scouting…"}
          </span>
        </>
      ) : (
        <span className={`block text-[#94a3b8] ${compact ? "pt-7 text-[10px]" : "pt-12 text-xs"}`}>Select and add a GitHub player</span>
      )}
    </motion.button>
  );
}
