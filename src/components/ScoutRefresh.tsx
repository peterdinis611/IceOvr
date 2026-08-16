"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ScoutCard } from "@/lib/types";
import { getScoutSnapshot, saveScoutSnapshot, type ScoutSnapshot } from "@/lib/client/scout-history";

export function ScoutRefresh({ card }: { card: ScoutCard }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<ScoutSnapshot | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let active = true;
    void getScoutSnapshot(card.username)
      .then((previous) => {
        if (active) setSnapshot(previous);
      })
      .catch(() => {
        if (active) setSnapshot(null);
      })
      .finally(() => {
        void saveScoutSnapshot({
          username: card.username,
          stars: card.raw.stars,
          commits: card.raw.commitsLastYear,
          ovr: card.ovr,
          at: card.scoutedAt,
        }).catch(() => {
          // IndexedDB may be disabled in private browsing modes.
        });
      });
    return () => { active = false; };
  }, [card]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const changes = snapshot ? [
    card.raw.stars - snapshot.stars,
    card.raw.commitsLastYear - snapshot.commits,
    card.ovr - snapshot.ovr,
  ] : [];
  const changed = changes.some((value) => value !== 0);

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
      <div className="text-xs text-[#94a3b8]">
        <p className="font-bold uppercase tracking-[.12em] text-[#7dd3fc]">Scout refresh</p>
        <p className="mt-1">{snapshot ? changed ? "New profile signals detected since your last local scout." : "No score change since your last local scout." : "Your next visit will track local profile changes."}</p>
      </div>
      <button type="button" disabled={cooldown > 0} onClick={() => { setCooldown(60); router.refresh(); }} className="rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/5 px-3 py-2 text-[10px] font-black uppercase tracking-[.14em] text-[#7dd3fc] disabled:opacity-50">
        {cooldown ? `Re-scout in ${cooldown}s` : "Re-scout now"}
      </button>
    </div>
  );
}
