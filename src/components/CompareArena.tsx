"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PlayerCard } from "@/components/PlayerCard";
import type { ScoutCard } from "@/lib/types";
import { STAT_LABELS } from "@/lib/tiers";

export function CompareArena({
  left,
  right,
  error,
}: {
  left?: ScoutCard;
  right?: ScoutCard;
  error?: string;
}) {
  const [leftName, setLeftName] = useState("");
  const [rightName, setRightName] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const a = leftName.trim().replace(/^@/, "");
    const b = rightName.trim().replace(/^@/, "");
    if (a && b) window.location.assign(`/compare?left=${encodeURIComponent(a)}&right=${encodeURIComponent(b)}`);
  }

  if (!left || !right) {
    return (
      <section className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <div className="rounded-[26px] border border-white/10 bg-[#071524]/85 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:p-9">
          <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#7dd3fc]">Head-to-head arena</p>
          <h1 className="mt-2 font-display text-4xl tracking-[.08em] text-white sm:text-5xl">SCOUT COMPARE</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#94a3b8]">{error || "Put two GitHub profiles on the same scouting board. Compare attributes, form, and the projected winner."}</p>
          <form onSubmit={submit} className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <CompareInput value={leftName} onChange={setLeftName} placeholder="first username" />
            <span className="self-center font-display text-2xl text-[#e11d2e]">VS</span>
            <CompareInput value={rightName} onChange={setRightName} placeholder="second username" />
            <button type="submit" className="sm:col-span-3 mt-1 h-12 rounded-xl bg-[#e11d2e] font-display tracking-[.14em] text-white shadow-[0_8px_24px_rgba(225,29,46,.32)]">OPEN MATCHUP</button>
          </form>
        </div>
      </section>
    );
  }

  const winner = left.ovr === right.ovr ? null : left.ovr > right.ovr ? left : right;
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div><p className="text-[10px] font-black uppercase tracking-[.3em] text-[#7dd3fc]">Head-to-head scouting report</p><h1 className="mt-1 font-display text-4xl tracking-[.08em] text-white">MATCHUP BOARD</h1></div>
        <button type="button" onClick={() => navigator.clipboard?.writeText(shareUrl)} className="rounded-lg border border-[#7dd3fc]/30 bg-[#7dd3fc]/5 px-3 py-2 text-[10px] font-black uppercase tracking-[.15em] text-[#7dd3fc]">Copy matchup URL</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_.8fr_1fr] lg:items-center">
        <PlayerSide card={left} alignment="left" />
        <div className="rounded-2xl border border-white/10 bg-[#071524]/80 p-5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[.22em] text-[#94a3b8]">Projected result</p>
          <p className="mt-2 font-display text-5xl tracking-[.1em] text-[#e11d2e]">VS</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-white">{winner ? `${winner.displayName} wins the board` : "Even matchup"}</p>
          <p className="mt-1 text-[10px] text-[#64748b]">{left.ovr} OVR · {right.ovr} OVR</p>
          <Link href="/compare" className="mt-5 inline-block text-[10px] font-bold uppercase tracking-[.15em] text-[#7dd3fc]">New comparison</Link>
        </div>
        <PlayerSide card={right} alignment="right" />
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#071524]/80 p-4 sm:p-5">
        <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#7dd3fc]">Attribute matchup</p>
        <div className="mt-4 space-y-3">
          {STAT_LABELS.map((stat) => <AttributeRow key={stat.key} label={stat.short} left={left.stats[stat.key]} right={right.stats[stat.key]} />)}
        </div>
      </div>
    </section>
  );
}

function CompareInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">@</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-8 pr-3 text-sm text-white outline-none transition focus:border-[#7dd3fc]/55" /></div>;
}

function PlayerSide({ card, alignment }: { card: ScoutCard; alignment: "left" | "right" }) {
  return <div className={`flex flex-col items-center ${alignment === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-4`}><PlayerCard card={card} size="sm" /><div className={alignment === "right" ? "text-center lg:text-right" : "text-center lg:text-left"}><p className="font-display text-3xl tracking-[.08em] text-white">{card.displayName}</p><p className="mt-1 text-xs text-[#94a3b8]">@{card.username}</p><p className="mt-2 font-display text-4xl" style={{ color: card.ovr >= 85 ? "#fde68a" : "#7dd3fc" }}>{card.ovr}</p></div></div>;
}

function AttributeRow({ label, left, right }: { label: string; left: number; right: number }) {
  const max = Math.max(left, right, 1);
  return <div className="grid grid-cols-[1fr_34px_1fr] items-center gap-3 text-xs"><div className="flex items-center gap-2"><span className="font-bold text-white">{left}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="ml-auto h-full rounded-full bg-[#7dd3fc]" style={{ width: `${(left / max) * 100}%` }} /></div></div><span className="text-center text-[9px] font-black tracking-[.12em] text-[#64748b]">{label}</span><div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#e11d2e]" style={{ width: `${(right / max) * 100}%` }} /></div><span className="font-bold text-white">{right}</span></div></div>;
}
