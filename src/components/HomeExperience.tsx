import Link from "next/link";
import { HomeDemoCards } from "@/components/home/HomeDemoCards";
import { HomeFeatureGrid } from "@/components/home/HomeFeatureGrid";
import { HomeDraftMetrics, HomeHeroHeadline } from "@/components/home/HomeHeroMotion";
import { HowItWorksButton } from "@/components/RatingMethodology";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { ScoutForm } from "@/components/ScoutForm";
import { SiteHeader } from "@/components/SiteHeader";
import type { ScoutCard } from "@/lib/types";

/** Server Component — home shell with client islands for motion, form, and cards. */
export function HomeExperience({ cards }: { cards: ScoutCard[] }) {
  return (
    <main className="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto scroll-smooth">
      <RinkAtmosphere parallax />
      <SiteHeader sticky />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 pt-3 sm:px-6 sm:pb-16 sm:pt-5">
        <div className="arena-panel relative grid overflow-hidden rounded-[22px] px-4 py-6 sm:rounded-[28px] sm:px-8 sm:py-10 lg:grid-cols-[.78fr_1.5fr_.72fr] lg:items-end lg:gap-8">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,211,252,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.045)_1px,transparent_1px)] [background-size:28px_28px] sm:[background-size:32px_32px]" />
          <div className="radar-sweep pointer-events-none absolute inset-0 opacity-20 sm:opacity-30" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#e11d2e]/35 lg:block" />

          <div className="relative order-2 mt-7 border-t border-white/10 pt-5 md:grid md:grid-cols-2 md:gap-6 lg:order-1 lg:mt-0 lg:block lg:border-t-0 lg:border-r lg:pr-6 lg:pt-0">
            <div>
              <p className="draft-kicker">Player evaluation no. 026</p>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-[#94a3b8] sm:mt-4 lg:max-w-[22ch]">
                Turn public GitHub activity into a scouting profile built for the draft board.
              </p>
              <HomeDraftMetrics />
            </div>
            <div className="mt-6 border-t border-white/10 pt-5 md:mt-0 md:border-t-0 md:pt-0 lg:hidden">
              <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#94a3b8]">Draft board</p>
              <p className="mt-2 font-display text-3xl tracking-[.1em] text-white">
                GITHUB
                <br />
                <span className="text-[#7dd3fc]">SCOUTING</span>
              </p>
              <div className="mt-4 border-l-2 border-[#e11d2e] pl-3 text-xs leading-relaxed text-[#94a3b8]">
                Commits. Stars. Pull requests. One card that tells the season.
              </div>
              <div className="mt-4">
                <HowItWorksButton />
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <HomeHeroHeadline />
            <div className="mt-6 w-full max-w-xl sm:mt-8">
              <ScoutForm large showAnalyzing />
              <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] uppercase tracking-[.12em] text-[#64748b]">
                <span className="shrink-0">Try</span>
                {["torvalds", "gaearon", "sindresorhus"].map((u) => (
                  <Link
                    key={u}
                    className="text-[#7dd3fc] transition hover:text-white"
                    href={`/u/${u}`}
                  >
                    @{u}
                  </Link>
                ))}
              </p>
            </div>
          </div>

          {/* Desktop-only right rail — tablet merges into left column above */}
          <div className="relative order-3 mt-8 hidden border-t border-white/10 pt-5 lg:mt-0 lg:block lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
            <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#94a3b8]">Draft board</p>
            <p className="mt-2 font-display text-3xl tracking-[.1em] text-white">
              GITHUB
              <br />
              <span className="text-[#7dd3fc]">SCOUTING</span>
            </p>
            <div className="mt-5 border-l-2 border-[#e11d2e] pl-3 text-xs leading-relaxed text-[#94a3b8]">
              Commits. Stars. Pull requests. One card that tells the season.
            </div>
            <div className="mt-5">
              <HowItWorksButton />
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex items-center overflow-hidden rounded-lg border border-white/10 bg-black/35 sm:mt-5">
          <div className="live-badge shrink-0 bg-[#e11d2e] px-2.5 py-2 font-display text-sm tracking-[.14em] text-white sm:px-3">
            LIVE
          </div>
          <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <p className="whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#94a3b8]">
              Draft board open · public GitHub signals only · ratings update as your profile changes
            </p>
          </div>
        </div>

        <HomeDemoCards cards={cards} />
      </section>

      <HomeFeatureGrid />

      <footer className="relative z-10 border-t border-white/10 px-4 py-6 text-center text-[10px] uppercase tracking-[0.18em] text-[#64748b] sm:px-6 sm:text-xs sm:tracking-[0.2em]">
        IceOVR · NHL-style GitHub cards · Not affiliated with NHL or EA
      </footer>
    </main>
  );
}
