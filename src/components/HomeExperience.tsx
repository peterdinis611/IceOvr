import Link from "next/link";
import { HomeDemoCards } from "@/components/home/HomeDemoCards";
import { HomeFeatureGrid } from "@/components/home/HomeFeatureGrid";
import { HomeHeroHeadline } from "@/components/home/HomeHeroMotion";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { ScoutForm } from "@/components/ScoutForm";
import { SiteHeader } from "@/components/SiteHeader";
import type { ScoutCard } from "@/lib/types";

/** Server Component — floodlight rink landing. */
export function HomeExperience({ cards }: { cards: ScoutCard[] }) {
  return (
    <main className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto scroll-smooth">
      <RinkAtmosphere parallax />
      <SiteHeader sticky />

      <section className="relative z-10 mx-auto flex min-h-[min(90vh,940px)] w-full max-w-6xl flex-col justify-center px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
        <div className="press-slash absolute inset-0" aria-hidden />
        <span className="watermark-num" aria-hidden>
          99
        </span>

        <div className="relative grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <HomeHeroHeadline />

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="jersey-cta h-14 px-6 text-xl">
                Drop the puck
              </Link>
              <Link href="/board" className="jersey-cta-ghost h-14 px-6 text-xl">
                Draft board
              </Link>
            </div>

            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.16em] text-[var(--steel)]">
              <span className="faceoff-dot" aria-hidden />
              <span>Warm-up skates</span>
              {["torvalds", "gaearon", "sindresorhus"].map((u) => (
                <Link
                  key={u}
                  href={`/u/${u}`}
                  className="text-[var(--ice)] transition hover:text-[var(--kraft)]"
                >
                  @{u}
                </Link>
              ))}
            </p>
          </div>

          <div className="ticket-stub relative z-10 p-5 sm:p-6 lg:-rotate-1 lg:translate-y-4">
            <div className="flex items-start justify-between gap-3 pl-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ink)]/55">
                  Faceoff circle · gate C
                </p>
                <p className="mt-2 font-display text-3xl tracking-[0.06em] text-[var(--ink)] sm:text-4xl">
                  SCOUT A PLAYER
                </p>
              </div>
              <p className="font-display text-4xl leading-none tracking-[0.04em] text-[var(--goal-red)]">
                26
              </p>
            </div>
            <p className="mt-1 max-w-[28ch] pl-4 text-sm leading-relaxed text-[var(--ink)]/70">
              Drop a GitHub handle. We grade the public season like a first-round pick.
            </p>
            <div className="mt-4 pl-4 [&_.scout-input-shell>input]:border-[rgba(10,9,8,0.2)] [&_.scout-input-shell>input]:bg-[#fffdf8] [&_.scout-input-shell>input]:text-[var(--ink)] [&_.scout-input-shell>input]:placeholder:text-[rgba(10,9,8,0.35)]">
              <ScoutForm large showAnalyzing withSuggestions />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="scoreboard">
          <div className="scoreboard-cell bg-[var(--goal-red)]">
            <span className="scoreboard-label !text-white/70">Period</span>
            <span className="font-display text-2xl tracking-[0.08em] text-white">1st</span>
          </div>
          <div className="min-w-0 overflow-hidden self-center">
            <p className="ticker-marquee whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--steel)]">
              Boards up · center ice lit · public GitHub only · six attributes · five tiers · shareable PNG cards · no whistle on private repos
            </p>
          </div>
          <div className="scoreboard-cell hidden sm:flex">
            <span className="scoreboard-label">Clock</span>
            <span className="period-clock">20:00</span>
          </div>
        </div>
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--kraft)]/15 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--ice)]">
              Locker room · sample cards
            </p>
            <h2 className="mt-1 font-display text-4xl tracking-[0.06em] text-[var(--kraft)] sm:text-5xl">
              TONIGHT&apos;S LINEUP
            </h2>
          </div>
          <Link
            href="/board"
            className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--steel)] transition hover:text-[var(--ice)]"
          >
            Open draft board →
          </Link>
        </div>
        <HomeDemoCards cards={cards} />
      </section>

      <HomeFeatureGrid />

      <footer className="relative z-10 border-t border-[var(--kraft)]/12 px-4 py-6 text-center text-[10px] uppercase tracking-[0.18em] text-[var(--steel)] sm:px-6">
        IceOVR · Center-ice GitHub scouting · Not affiliated with NHL or EA
      </footer>
    </main>
  );
}
