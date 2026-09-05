import { ArenaIntro } from "@/components/ArenaIntro";
import { CardStudio } from "@/components/CardStudio";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";

/** Server Component — player shell with intro + studio as client islands. */
export function PlayerExperience({ card }: { card: ScoutCard }) {
  const tier = TIER_META[card.tier];

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RinkAtmosphere subtle />
      <SiteHeader showScout scoutInitial={card.username} />

      <ArenaIntro
        displayName={card.displayName}
        ovr={card.ovr}
        tierLabel={tier.label}
        tierAccent={tier.accent}
      />

      <section className="arena-panel relative z-10 mx-auto mt-1 w-full max-w-6xl rounded-2xl px-5 py-4 sm:px-7">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-2/5 opacity-40"
          style={{
            background: `linear-gradient(135deg, transparent, ${tier.accent}35)`,
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7dd3fc]">
              Official scouting dossier · GitHub live
            </p>
            <h1 className="mt-1 truncate font-display text-3xl tracking-[0.09em] text-white sm:text-4xl">
              {card.displayName}
            </h1>
            <p className="mt-1.5 text-sm text-[#94a3b8]">
              @{card.username}
              {card.topLanguage ? ` · ${card.topLanguage}` : ""}
              {card.location ? ` · ${card.location}` : ""}
            </p>
          </div>
          <div className="flex items-end gap-3">
            <div className="border-r border-white/10 pr-3 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                Scout grade
              </p>
              <p
                className="mt-1 font-display text-2xl tracking-[0.12em]"
                style={{ color: tier.accent }}
              >
                {tier.label}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl leading-none text-white sm:text-5xl">
                {card.ovr}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
                Player rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <CardStudio card={card} />
    </main>
  );
}
