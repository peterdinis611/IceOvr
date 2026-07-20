"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { arenaAudio } from "@/lib/arena-audio";

type ArenaAudioContextValue = {
  enabled: boolean;
  toggle: () => Promise<void>;
  playPuckShot: () => void;
};

const ArenaAudioContext = createContext<ArenaAudioContextValue | null>(null);

const STORAGE_KEY = "iceovr-arena-audio";

export function ArenaAudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "on") {
      // Don't auto-start until gesture — just remember preference UI
      setEnabled(false);
    }
  }, []);

  const toggle = useCallback(async () => {
    if (enabled) {
      arenaAudio.setMuted(true);
      setEnabled(false);
      localStorage.setItem(STORAGE_KEY, "off");
      return;
    }
    await arenaAudio.ensure();
    arenaAudio.setMuted(false);
    arenaAudio.startSnow();
    arenaAudio.playPuckShot();
    setEnabled(true);
    localStorage.setItem(STORAGE_KEY, "on");
  }, [enabled]);

  const playPuckShot = useCallback(() => {
    if (!enabled) return;
    arenaAudio.playPuckShot();
  }, [enabled]);

  const value = useMemo(
    () => ({ enabled, toggle, playPuckShot }),
    [enabled, toggle, playPuckShot],
  );

  return (
    <ArenaAudioContext.Provider value={value}>{children}</ArenaAudioContext.Provider>
  );
}

export function useArenaAudio() {
  const ctx = useContext(ArenaAudioContext);
  if (!ctx) {
    return {
      enabled: false,
      toggle: async () => undefined,
      playPuckShot: () => undefined,
    };
  }
  return ctx;
}
