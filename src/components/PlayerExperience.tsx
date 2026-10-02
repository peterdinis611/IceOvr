import { ArenaIntro } from "@/components/ArenaIntro";
import { CardStudio } from "@/components/CardStudio";
import { RememberScout } from "@/components/RememberScout";
import { RinkAtmosphere } from "@/components/RinkAtmosphere";
import { SiteHeader } from "@/components/SiteHeader";
import type { CardStyleId } from "@/components/player-card/cardStyles";
import type { CustomCardTheme } from "@/components/player-card/customTheme";
import type { ScoutCard } from "@/lib/types";
import { TIER_META } from "@/lib/tiers";

/** Server Component — player shell with intro + studio as client islands. */
export function PlayerExperience({
  card,
  initialStyle,
  initialTheme,
}: {
  card: ScoutCard;
  initialStyle?: CardStyleId;
  initialTheme?: CustomCardTheme;
}) {
  const tier = TIER_META[card.tier];

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <RememberScout username={card.username} />
      <RinkAtmosphere />
      <SiteHeader showScout scoutInitial={card.username} sticky />

      <ArenaIntro
        displayName={card.displayName}
        ovr={card.ovr}
        tierLabel={tier.label}
        tierAccent={tier.accent}
      />

      <section className="relative z-10 mx-auto mt-2 w-full max-w-6xl px-4 sm:px-6">
        <div className="flex overflow-hidden border-2 border-[var(--kraft)]/18 bg-[linear-gradient(180deg,#1a1612_0%,#0a0908_100%)] shadow-[inset_0_1px_0_rgba(255,183,3,0.12)]">
          <div className="flex shrink-0 flex-col items-center justify-center bg-[var(--goal-red)] px-4 py-3 sm:px-5">
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/65">
              OVR
            </span>
            <span className="font-display text-4xl leading-none tracking-[0.04em] text-white sm:text-5xl">
              {card.ovr}
            </span>
          </div>

          <div className="relative min-w-0 flex-1 self-stretch px-4 py-4 sm:px-6">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40"
              style={{
                background: `linear-gradient(110deg, transparent, ${tier.accent}28)`,
              }}
            />
            <p className="relative text-[9px] font-black uppercase tracking-[0.28em] text-[var(--ice)] sm:text-[10px]">
              Official scouting dossier · GitHub live
            </p>
            <h1 className="relative mt-1 truncate font-display text-3xl tracking-[0.06em] text-[var(--kraft)] sm:text-5xl">
              {card.displayName}
            </h1>
            <p className="relative mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--steel)] sm:text-sm">
              <span className="faceoff-dot" aria-hidden />
              <span>@{card.username}</span>
              {card.topLanguage ? <span>· {card.topLanguage}</span> : null}
              {card.location ? <span>· {card.location}</span> : null}
            </p>
          </div>

          <div className="hidden min-w-[7.5rem] shrink-0 flex-col items-center justify-center border-l border-[var(--kraft)]/12 px-4 py-3 sm:flex">
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[var(--steel)]">
              Scout grade
            </span>
            <span
              className="mt-1 font-display text-2xl tracking-[0.1em]"
              style={{ color: tier.accent }}
            >
              {tier.label}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 border border-t-0 border-[var(--kraft)]/12 bg-black/40 px-3 py-2 sm:hidden">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--steel)]">
            Scout grade
          </p>
          <p
            className="font-display text-xl tracking-[0.1em]"
            style={{ color: tier.accent }}
          >
            {tier.label}
          </p>
        </div>
      </section>

      <CardStudio
        card={card}
        initialStyle={initialStyle}
        initialTheme={initialTheme}
      />
    </main>
  );
}
