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
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
        enabled
          ? "border-[#38bdf8]/40 bg-[#38bdf8]/15 text-[#7dd3fc]"
          : "border-white/15 bg-black/30 text-[#94a3b8] hover:text-white"
      }`}
      title={enabled ? "Mute arena audio" : "Enable snow + slapshot audio"}
    >
      <span className="relative flex h-2 w-2">
        {enabled && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7dd3fc] opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            enabled ? "bg-[#7dd3fc]" : "bg-[#64748b]"
          }`}
        />
      </span>
      {enabled ? "Sound on" : "Sound off"}
    </motion.button>
  );
}
