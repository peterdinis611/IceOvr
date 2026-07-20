"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useArenaAudio } from "@/components/ArenaAudioProvider";

export function ScoutForm({
  initial = "",
  large = false,
}: {
  initial?: string;
  large?: boolean;
}) {
  const router = useRouter();
  const { playPuckShot } = useArenaAudio();
  const [username, setUsername] = useState(initial);
  const [busy, setBusy] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) return;
    playPuckShot();
    setBusy(true);
    router.push(`/u/${encodeURIComponent(clean)}`);
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className={`flex w-full ${large ? "max-w-xl flex-col gap-3 sm:flex-row" : "flex-row gap-2"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="relative min-w-0 flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
          @
        </span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className={`w-full rounded-xl border border-white/10 bg-[#0b1524] pl-8 pr-3 text-white outline-none transition placeholder:text-[#64748b] focus:border-[#38bdf8]/55 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.15)] ${
            large ? "h-14 text-lg" : "h-10 text-sm"
          }`}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
      <motion.button
        type="submit"
        disabled={busy}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`relative shrink-0 overflow-hidden rounded-xl bg-[#e11d2e] px-4 font-display tracking-[0.12em] text-white shadow-[0_6px_20px_rgba(225,29,46,0.35)] disabled:opacity-60 ${
          large ? "h-14 text-xl px-6" : "h-10 text-sm"
        }`}
      >
        <span className="relative z-10">{busy ? "…" : "SCOUT"}</span>
      </motion.button>
    </motion.form>
  );
}
