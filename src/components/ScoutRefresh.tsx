"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ScoutCard } from "@/lib/types";
import {
  getScoutSnapshot,
  saveScoutSnapshot,
  type ScoutSnapshot,
} from "@/lib/client/scout-history";
import { PuckSpinner } from "@/components/PuckSpinner";

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
    return () => {
      active = false;
    };
  }, [card]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const changes = snapshot
    ? [
        card.raw.stars - snapshot.stars,
        card.raw.commitsLastYear - snapshot.commits,
        card.ovr - snapshot.ovr,
      ]
    : [];
  const changed = changes.some((value) => value !== 0);
  const progress = ((60 - cooldown) / 60) * 100;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
      <div className="text-xs text-[#94a3b8]">
        <p className="font-bold uppercase tracking-[.12em] text-[#7dd3fc]">
          Scout refresh
        </p>
        <p className="mt-1">
          {snapshot
            ? changed
              ? "New profile signals detected since your last local scout."
              : "No score change since your last local scout."
            : "Your next visit will track local profile changes."}
        </p>
      </div>
      {cooldown ? (
        <div
          className="relative flex items-center gap-2 overflow-hidden rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/5 px-2.5 py-2 text-[#7dd3fc]"
          role="status"
          aria-live="polite"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-[#7dd3fc]/10"
            style={{ width: `${progress}%` }}
          />
          <span
            aria-hidden
            className="relative grid h-6 w-6 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#7dd3fc ${progress}%, rgba(125,211,252,.12) 0)`,
            }}
          >
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[#071524]">
              <PuckSpinner label="Cooldown in progress" size="sm" />
            </span>
          </span>
          <span className="relative text-[10px] font-black uppercase tracking-[.14em]">
            Re-scout in {cooldown}s
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setCooldown(60);
            router.refresh();
          }}
          className="rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/5 px-3 py-2 text-[10px] font-black uppercase tracking-[.14em] text-[#7dd3fc] transition hover:border-[#7dd3fc]/60 hover:bg-[#7dd3fc]/12"
        >
          Re-scout now
        </button>
      )}
    </div>
  );
}
