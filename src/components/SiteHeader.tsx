import Link from "next/link";
import { ScoutForm } from "@/components/ScoutForm";
import { SoundToggle } from "@/components/SoundToggle";
import { StickyHeaderShell } from "@/components/StickyHeaderShell";

/** Server Component — chrome with client islands for sound, scout, sticky blur. */
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
    <StickyHeaderShell sticky={sticky}>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="group font-display text-2xl tracking-[0.12em] text-white sm:text-3xl"
        >
          ICE
          <span className="text-[#e11d2e] transition group-hover:drop-shadow-[0_0_12px_rgba(225,29,46,0.8)]">
            OVR
          </span>
        </Link>
        <SoundToggle />
        <Link
          href="/compare"
          className="rounded border border-white/10 px-2 py-1 text-[9px] font-black uppercase tracking-[.14em] text-[#94a3b8] transition hover:border-[#7dd3fc]/40 hover:text-[#7dd3fc]"
        >
          VS
        </Link>
      </div>

      <div className="min-w-0 flex-1">
        {showScout ? (
          <div className="ml-auto w-full max-w-sm">
            <ScoutForm initial={scoutInitial} />
          </div>
        ) : (
          <div className="hidden items-center justify-end gap-5 sm:flex">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#94a3b8]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d2e] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d2e]" />
              </span>
              Arena live
            </div>
          </div>
        )}
      </div>
    </StickyHeaderShell>
  );
}
