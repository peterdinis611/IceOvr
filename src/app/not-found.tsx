import Link from "next/link";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { ScoutForm } from "@/components/ScoutForm";
import { NotFoundMotion } from "@/components/NotFoundMotion";

/** Server Component — 404 shell; motion/form stay as client islands. */
export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center sm:py-24">
      <RinkAtmosphere />
      <NotFoundMotion />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[13rem] leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[20rem]"
      >
        404
      </div>
      <div className="arena-panel relative z-10 w-full max-w-2xl rounded-2xl p-6 sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e11d2e] to-transparent" />
        <div className="mx-auto flex w-fit items-center gap-2 border border-[#e11d2e]/35 bg-[#e11d2e]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-[#fda4af]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d2e] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e11d2e] shadow-[0_0_10px_#e11d2e]" />
          </span>
          Offside · 404
        </div>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#7dd3fc]">
          NHL-style GitHub scouting
        </p>
        <h1 className="mt-2 font-display text-5xl leading-[0.9] tracking-[0.05em] text-white sm:text-7xl">
          PLAYER NOT FOUND
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#94a3b8] sm:text-base">
          This profile did not make the draft board. Check the GitHub username, then scout a
          different player.
        </p>
        <div className="relative mt-6 h-24 overflow-hidden rounded-xl border border-white/10 bg-black/25 text-left">
          <div className="absolute inset-y-0 left-0 z-10 flex w-1/2 flex-col justify-center px-4 sm:px-5">
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#7dd3fc]">
              Replay review
            </span>
            <span className="mt-1 font-display text-xl tracking-[0.12em] text-white">NO GOAL</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-[0.13em] text-white/45">
              Profile unavailable
            </span>
          </div>
        </div>
        <div className="mt-5 border-y border-white/10 py-5">
          <ScoutForm large />
        </div>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7dd3fc] transition hover:text-white"
        >
          <span aria-hidden>←</span>
          Back to draft board
        </Link>
        <p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-white/30">
          Unofficial NHL-style concept · Not affiliated with NHL or EA
        </p>
      </div>
    </main>
  );
}
