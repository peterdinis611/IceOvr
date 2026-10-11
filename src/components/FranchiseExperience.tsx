"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  franchiseRosterToTeamUrl,
  type FranchiseAssignment,
  type FranchiseSlotKey,
} from "@/lib/franchise";

type FranchiseResponse = {
  org: string;
  name: string;
  memberCount: number;
  scouted: number;
  assignment: FranchiseAssignment;
  error?: string;
};

const LINE_LABELS: Record<FranchiseSlotKey, string> = {
  lw: "LW",
  c: "C",
  rw: "RW",
  ld: "LD",
  rd: "RD",
  g: "G",
  lw2: "LW2",
  c2: "C2",
  rw2: "RW2",
  ld2: "LD2",
  rd2: "RD2",
  g2: "G2",
  b1: "B1",
  b2: "B2",
  b3: "B3",
  b4: "B4",
};

export function FranchiseExperience() {
  const [org, setOrg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FranchiseResponse | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const clean = org.trim().replace(/^@/, "");
    if (!clean) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/franchise?org=${encodeURIComponent(clean)}`,
      );
      const body = (await response.json()) as FranchiseResponse;
      if (!response.ok) {
        setResult(null);
        setError(body.error ?? "Franchise draft failed");
        return;
      }
      setResult(body);
    } catch {
      setError("Could not reach franchise desk.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const teamHref = result
    ? franchiseRosterToTeamUrl(result.assignment)
    : null;

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-16 pt-5 sm:px-6">
      <header className="border-b border-white/10 pb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffb703]">
          Org desk · franchise draft
        </p>
        <h1 className="mt-1 font-display text-4xl tracking-[0.08em] text-white sm:text-5xl">
          FRANCHISE
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
          Pull a GitHub organization&apos;s public members, grade them, and auto-fill
          lines — admins and playmakers at center, reviewers on D, longevity in net.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="min-w-0 flex-1">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#94a3b8]">
            Organization
          </span>
          <input
            value={org}
            onChange={(event) => setOrg(event.target.value)}
            placeholder="vercel"
            className="mt-1 w-full border border-white/15 bg-black/35 px-3 py-3 font-display text-2xl tracking-[0.08em] text-white outline-none transition focus:border-[#ffb703]/50"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !org.trim()}
          className="jersey-cta h-12 px-6 text-[11px] disabled:opacity-50"
        >
          {loading ? "Drafting…" : "Draft franchise"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-4 border border-[#e11d2e]/40 bg-[#e11d2e]/10 px-3 py-2 text-sm text-[#fda4af]"
        >
          {error}
        </p>
      )}

      {result && (
        <motion.div
          className="mt-8 space-y-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border border-white/10 bg-[#071524]/75 p-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffb703]">
                {result.org}
              </p>
              <h2 className="font-display text-3xl tracking-[0.08em] text-white">
                {result.assignment.name}
              </h2>
              <p className="mt-1 text-sm text-[#94a3b8]">
                {result.scouted} scouted · {result.memberCount} public members
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamHref && (
                <Link
                  href={teamHref}
                  className="jersey-cta px-4 py-2.5 text-[10px]"
                >
                  Send to Lineup
                </Link>
              )}
              <a
                href={`/api/team-card?${teamCardParams(result.assignment)}`}
                className="jersey-cta-ghost px-4 py-2.5 text-[10px]"
              >
                Export PNG
              </a>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {result.assignment.roster.map((row) => (
              <Link
                key={row.username}
                href={`/u/${row.username}`}
                className="flex items-center justify-between gap-3 border border-white/10 bg-black/25 px-3 py-2.5 transition hover:border-[#ffb703]/35 hover:bg-black/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-lg tracking-[0.06em] text-white">
                    @{row.username}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#64748b]">
                    {LINE_LABELS[row.slot]}
                    {row.role === "admin" ? " · admin" : ""}
                    {result.assignment.captain === row.slot ? " · C" : ""}
                    {result.assignment.alternate === row.slot ? " · A" : ""}
                  </p>
                </div>
                <span className="font-display text-2xl text-[#7dd3fc]">
                  {row.ovr}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}

function teamCardParams(assignment: FranchiseAssignment): string {
  const params = new URLSearchParams({
    name: assignment.name,
  });
  for (const key of ["lw", "c", "rw", "ld", "rd", "g"] as const) {
    const player = assignment.players[key];
    if (player) params.set(key, player);
  }
  return params.toString();
}
