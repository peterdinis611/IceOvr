"use client";

import { motion } from "motion/react";
import { useArenaAudio } from "@/components/ArenaAudioProvider";

export function SoundToggle() {
  const { enabled, toggle } = useArenaAudio();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => void toggle()}
      className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
        enabled
          ? "border-[var(--ice)]/45 bg-[var(--ice)]/12 text-[var(--ice)]"
          : "border-[var(--kraft)]/15 bg-black/30 text-[var(--steel)] hover:text-[var(--kraft)]"
      }`}
      title={enabled ? "Mute arena audio" : "Enable snow + slapshot audio"}
    >
      <span className="relative flex h-2 w-2">
        {enabled && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ice)] opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            enabled ? "bg-[var(--ice)]" : "bg-[var(--steel)]"
          }`}
        />
      </span>
      {enabled ? "Sound on" : "Sound off"}
    </motion.button>
  );
}
