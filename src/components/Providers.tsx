"use client";

import { ArenaAudioProvider } from "@/components/ArenaAudioProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ArenaAudioProvider>{children}</ArenaAudioProvider>;
}
