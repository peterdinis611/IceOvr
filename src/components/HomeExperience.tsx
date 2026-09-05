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

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-5">
        <div className="arena-panel relative grid overflow-hidden rounded-[28px] px-5 py-7 sm:px-8 sm:py-10 lg:grid-cols-[.78fr_1.5fr_.72fr] lg:items-end lg:gap-8">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,211,252,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.045)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="radar-sweep pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute inset-y-0 left-[48%] w-px bg-[#e11d2e]/35" />

          <div className="relative order-2 mt-8 border-t border-white/10 pt-5 lg:order-1 lg:mt-0 lg:border-t-0 lg:border-r lg:pr-6 lg:pt-0">
            <p className="draft-kicker">Player evaluation no. 026</p>
            <p className="mt-4 max-w-[22ch] text-sm leading-relaxed text-[#94a3b8]">
              Turn public GitHub activity into a scouting profile built for the draft board.
            </p>
            <HomeDraftMetrics />
          </div>

          <div className="relative order-1 lg:order-2">
            <HomeHeroHeadline />
            <div className="mt-8 max-w-xl">
              <ScoutForm large showAnalyzing />
              <p className="mt-3 text-[11px] uppercase tracking-[.12em] text-[#64748b]">
                Try{" "}
                {["torvalds", "gaearon", "sindresorhus"].map((u, i) => (
                  <span key={u}>
                    {i > 0 && " · "}
                    <Link className="text-[#7dd3fc] transition hover:text-white" href={`/u/${u}`}>
                      @{u}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="relative order-3 mt-8 border-t border-white/10 pt-5 lg:mt-0 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
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

        <div className="mt-5 flex items-center overflow-hidden rounded-lg border border-white/10 bg-black/35">
          <div className="live-badge shrink-0 bg-[#e11d2e] px-3 py-2 font-display text-sm tracking-[.14em] text-white">
            LIVE
          </div>
          <p className="whitespace-nowrap px-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#94a3b8]">
            Draft board open · public GitHub signals only · ratings update as your profile changes
          </p>
        </div>

        <HomeDemoCards cards={cards} />
      </section>

      <HomeFeatureGrid />

      <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs uppercase tracking-[0.2em] text-[#64748b]">
        IceOVR · NHL-style GitHub cards · Not affiliated with NHL or EA
      </footer>
    </main>
  );
}
