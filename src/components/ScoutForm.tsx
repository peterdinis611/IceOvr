"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useArenaAudio } from "@/components/ArenaAudioProvider";
import { PuckSpinner } from "@/components/PuckSpinner";

const HINTS = ["@torvalds", "@gaearon", "@sindresorhus"];

export function ScoutForm({
  initial = "",
  large = false,
  showAnalyzing = false,
}: {
  initial?: string;
  large?: boolean;
  showAnalyzing?: boolean;
}) {
  const router = useRouter();
  const { playPuckShot } = useArenaAudio();
  const [username, setUsername] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [hintIndex, setHintIndex] = useState(0);
  const [typedHint, setTypedHint] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  useEffect(() => {
    if (username) return;
    const full = HINTS[hintIndex];
    let char = 0;
    setTypedHint("");
    const typeTimer = window.setInterval(() => {
      char += 1;
      setTypedHint(full.slice(0, char));
      if (char >= full.length) window.clearInterval(typeTimer);
    }, 70);
    const cycleTimer = window.setTimeout(() => {
      setHintIndex((current) => (current + 1) % HINTS.length);
    }, 2600);
    return () => {
      window.clearInterval(typeTimer);
      window.clearTimeout(cycleTimer);
    };
  }, [username, hintIndex]);

  useEffect(() => {
    if (!isPending) {
      setAnalyzeStep(0);
      return;
    }
    const timer = window.setInterval(() => {
      setAnalyzeStep((step) => Math.min(3, step + 1));
    }, 420);
    return () => window.clearInterval(timer);
  }, [isPending]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (!clean) {
      setError("Enter a GitHub username to scout.");
      return;
    }
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(clean)) {
      setError("Use letters, numbers, or hyphens only.");
      return;
    }
    setError(null);
    playPuckShot();
    startTransition(() => {
      router.push(`/u/${encodeURIComponent(clean)}`);
    });
  }

  const analyzeCopy = [
    "Reading public profile…",
    "Measuring commits and stars…",
    "Building scout grades…",
    "Opening the rink report…",
  ][analyzeStep];

  const controlHeight = large ? "h-14" : "h-10";

  return (
    <div className={`w-full ${large ? "max-w-xl" : ""}`}>
      <form onSubmit={onSubmit} className="w-full">
        <div
          className={
            large
              ? "grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              : "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"
          }
        >
          <div className={`scout-input-shell relative min-w-0 ${controlHeight}`}>
            <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[#64748b]">
              @
            </span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              placeholder={typedHint || "username"}
              aria-invalid={Boolean(error)}
              className={`box-border h-full w-full rounded-xl border bg-[#0b1524] pl-8 pr-3 text-white outline-none transition placeholder:text-[#64748b] ${
                error
                  ? "border-[#fda4af]/55 focus:border-[#fda4af]"
                  : "border-white/10 focus:border-transparent"
              } ${large ? "text-lg" : "text-sm"}`}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={isPending}
              aria-describedby={isPending || error ? "scout-search-status" : undefined}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`scout-submit relative box-border inline-flex ${controlHeight} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e11d2e] px-4 font-display text-white shadow-[0_6px_20px_rgba(225,29,46,0.35)] transition hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(225,29,46,0.5)] active:scale-[0.97] disabled:opacity-60 disabled:hover:scale-100 ${
              large ? "px-6 text-xl" : "text-sm"
            }`}
          >
            {isPending && (
              <span
                aria-hidden
                className="scout-loader absolute inset-y-0 left-0 w-1/2 bg-white/20"
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2 leading-none">
              {isPending && <PuckSpinner label="Scouting profile" size="sm" />}
              <span className="translate-y-[0.06em]">
                {isPending ? "SCOUTING…" : "SCOUT"}
              </span>
            </span>
          </button>
        </div>
      </form>

      <div id="scout-search-status" role="status" aria-live="polite" className="mt-2 min-h-5">
        {error && <p className="text-[11px] font-bold text-[#fda4af]">{error}</p>}
        {isPending && showAnalyzing && (
          <div className="mt-1">
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="scout-analyze-bar h-full rounded-full bg-gradient-to-r from-[#e11d2e] via-white to-[#7dd3fc]"
                style={{ width: `${25 + analyzeStep * 25}%` }}
              />
            </div>
            <p className="mt-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7dd3fc]">
              <PuckSpinner label="Analyzing" size="sm" />
              {analyzeCopy}
            </p>
          </div>
        )}
        {isPending && !showAnalyzing && (
          <span className="sr-only">Scouting GitHub profile. Loading report.</span>
        )}
      </div>
    </div>
  );
}
