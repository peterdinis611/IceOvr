"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useArenaAudio } from "@/components/ArenaAudioProvider";
import { PuckSpinner } from "@/components/PuckSpinner";
import { pushRecentScout } from "@/lib/client/recent-scouts";

const HINTS = ["@torvalds", "@gaearon", "@sindresorhus"];

type Suggestion = {
  login: string;
  avatarUrl: string;
};

export function ScoutForm({
  initial = "",
  large = false,
  showAnalyzing = false,
  withSuggestions = false,
  autoFocus = false,
}: {
  initial?: string;
  large?: boolean;
  showAnalyzing?: boolean;
  withSuggestions?: boolean;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const { playPuckShot } = useArenaAudio();
  const listId = useId();
  const [username, setUsername] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [hintIndex, setHintIndex] = useState(0);
  const [typedHint, setTypedHint] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);

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

  useEffect(() => {
    if (!withSuggestions) return;
    const query = username.trim().replace(/^@/, "");
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timer = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      void fetch(`/api/github-search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : { users: [] }))
        .then((payload: { users?: Suggestion[] }) => {
          const users = payload.users ?? [];
          setSuggestions(users);
          setOpen(users.length > 0);
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions([]);
            setOpen(false);
          }
        });
    }, 220);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [username, withSuggestions]);

  function scout(raw: string) {
    const clean = raw.trim().replace(/^@/, "");
    if (!clean) {
      setError("Enter a GitHub username to scout.");
      return;
    }
    if (!/^[a-zA-Z0-9-]{1,39}$/.test(clean)) {
      setError("Use letters, numbers, or hyphens only.");
      return;
    }
    setError(null);
    setOpen(false);
    playPuckShot();
    pushRecentScout(clean);
    startTransition(() => {
      router.push(`/u/${encodeURIComponent(clean)}`);
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      scout(suggestions[activeIndex].login);
      return;
    }
    scout(username);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1,
      );
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const analyzeCopy = [
    "Reading public profile…",
    "Measuring commits and stars…",
    "Building scout grades…",
    "Opening the rink report…",
  ][analyzeStep];

  const showClear = username.length > 0 && !isPending;

  return (
    <div className={`relative w-full ${large ? "max-w-xl" : ""}`}>
      <form onSubmit={onSubmit} className="w-full" autoComplete="off">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
          <div
            className={`scout-input-shell relative min-w-0 ${
              large ? "h-12 sm:h-14" : "h-10"
            }`}
          >
            <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[#64748b]">
              @
            </span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={onKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setOpen(true);
              }}
              onBlur={() => {
                window.setTimeout(() => setOpen(false), 120);
              }}
              placeholder={typedHint || "username"}
              aria-invalid={Boolean(error)}
              aria-autocomplete={withSuggestions ? "list" : undefined}
              aria-controls={withSuggestions ? listId : undefined}
              aria-expanded={withSuggestions ? open : undefined}
              role={withSuggestions ? "combobox" : undefined}
              autoFocus={autoFocus}
              className={`box-border h-full w-full rounded-xl border bg-[#0b1524] pl-8 pr-10 text-white outline-none transition placeholder:text-[#64748b] ${
                error
                  ? "border-[#fda4af]/55 focus:border-[#fda4af]"
                  : "border-white/10 focus:border-transparent"
              } ${large ? "text-base sm:text-lg" : "text-sm"}`}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={isPending}
              aria-describedby={
                isPending || error ? "scout-search-status" : undefined
              }
            />

            {showClear && (
              <button
                type="button"
                onClick={() => {
                  setUsername("");
                  setSuggestions([]);
                  setOpen(false);
                  if (error) setError(null);
                }}
                aria-label="Clear username"
                className="absolute right-2 top-1/2 z-[1] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#64748b] transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ice)]"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`scout-submit relative box-border inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e11d2e] font-display text-white shadow-[0_6px_20px_rgba(225,29,46,0.35)] transition hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(225,29,46,0.5)] active:scale-[0.97] disabled:opacity-60 disabled:hover:scale-100 ${
              large
                ? "h-12 min-w-[5.75rem] px-4 text-lg sm:h-14 sm:min-w-[6.5rem] sm:px-6 sm:text-xl"
                : "h-10 min-w-[4.5rem] px-3 text-sm"
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
                {isPending ? (
                  <>
                    <span className="sm:hidden">…</span>
                    <span className="hidden sm:inline">SCOUTING…</span>
                  </>
                ) : (
                  "SCOUT"
                )}
              </span>
            </span>
          </button>
        </div>
      </form>

      {withSuggestions && open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%-0.25rem)] z-30 mt-2 overflow-hidden rounded-xl border border-white/12 bg-[#071524]/98 shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-md"
        >
          {suggestions.map((user, index) => {
            const active = index === activeIndex;
            return (
              <li key={user.login} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setUsername(user.login);
                    scout(user.login);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition ${
                    active ? "bg-[var(--ice)]/12" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border border-white/15"
                  />
                  <span className="font-semibold text-white">@{user.login}</span>
                  <span className="ml-auto text-[9px] font-black uppercase tracking-[0.14em] text-[#64748b]">
                    Scout
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div
        id="scout-search-status"
        role="status"
        aria-live="polite"
        className="mt-2 min-h-5"
      >
        {error && (
          <p className="text-[11px] font-bold text-[#fda4af]">{error}</p>
        )}
        {isPending && showAnalyzing && (
          <div className="mt-1">
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="scout-analyze-bar h-full rounded-full bg-gradient-to-r from-[#e11d2e] via-[#efe6d2] to-[var(--ice)]"
                style={{ width: `${25 + analyzeStep * 25}%` }}
              />
            </div>
            <p className="mt-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--goal-red)]">
              <PuckSpinner label="Analyzing" size="sm" />
              <span className="min-w-0 truncate">{analyzeCopy}</span>
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
