import Link from "next/link";
import { ScoutForm } from "@/components/ScoutForm";
import { SiteNavLinks } from "@/components/SiteNavLinks";
import { SoundToggle } from "@/components/SoundToggle";
import { StickyHeaderShell } from "@/components/StickyHeaderShell";

/** Server Component — arena scoreboard chrome. */
export function SiteHeader({
  showScout = false,
  scoutInitial = "",
  sticky = false,
}: {
  showScout?: boolean;
  scoutInitial?: string;
  sticky?: boolean;
}) {
  return (
    <StickyHeaderShell sticky={sticky} stacked={showScout}>
      <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto sm:gap-3">
        <Link
          href="/"
          className="group font-display text-2xl tracking-[0.12em] text-[var(--kraft)] sm:text-3xl"
        >
          ICE
          <span className="text-[var(--goal-red)] transition group-hover:drop-shadow-[0_0_12px_rgba(225,29,46,0.8)]">
            OVR
          </span>
        </Link>
        <SoundToggle />
        <SiteNavLinks />
        {!showScout && (
          <div className="ml-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--steel)] sm:hidden">
            <span className="faceoff-dot" aria-hidden />
            1st
          </div>
        )}
      </div>

      <div
        className={`min-w-0 ${showScout ? "w-full sm:ml-auto sm:max-w-sm sm:flex-1" : "hidden flex-1 sm:block"}`}
      >
        {showScout ? (
          <ScoutForm initial={scoutInitial} />
        ) : (
          <div className="hidden items-center justify-end gap-4 sm:flex">
            <div className="flex items-center gap-3 border border-[var(--kraft)]/15 bg-black/35 px-3 py-1.5">
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--steel)]">
                  Period
                </p>
                <p className="font-display text-lg leading-none tracking-[0.08em] text-[var(--kraft)]">
                  1
                </p>
              </div>
              <div className="h-6 w-px bg-[var(--kraft)]/20" aria-hidden />
              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--steel)]">
                  Clock
                </p>
                <p className="period-clock text-base leading-none">20:00</p>
              </div>
              <div className="h-6 w-px bg-[var(--kraft)]/20" aria-hidden />
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--steel)]">
                <span className="faceoff-dot" aria-hidden />
                Live
              </div>
            </div>
          </div>
        )}
      </div>
    </StickyHeaderShell>
  );
}
