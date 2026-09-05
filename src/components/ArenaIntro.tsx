"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useArenaAudio } from "@/components/ArenaAudioProvider";

/** Client island — short arena intro overlay on player pages. */
export function ArenaIntro({
  displayName,
  ovr,
  tierLabel,
  tierAccent,
}: {
  displayName: string;
  ovr: number;
  tierLabel: string;
  tierAccent: string;
}) {
  const [intro, setIntro] = useState(true);
  const { playPuckShot } = useArenaAudio();

  useEffect(() => {
    const shot = setTimeout(() => playPuckShot(), 400);
    const t = setTimeout(() => setIntro(false), 700);
    return () => {
      clearTimeout(shot);
      clearTimeout(t);
    };
  }, [playPuckShot]);

  return (
    <AnimatePresence>
      {intro && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/92"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="relative text-center">
            <motion.div
              className="mx-auto mb-6 h-1 w-40 overflow-hidden rounded-full bg-white/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2 }}
            >
              <motion.div
                className="h-full bg-[#e11d2e]"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
            <motion.p
              className="text-xs uppercase tracking-[0.4em] text-[#7dd3fc]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Entering the arena
            </motion.p>
            <motion.h2
              className="mt-3 font-display text-5xl tracking-[0.12em] text-white sm:text-7xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
            >
              {displayName}
            </motion.h2>
            <motion.p
              className="mt-3 font-display text-3xl"
              style={{ color: tierAccent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {ovr} OVR · {tierLabel}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
