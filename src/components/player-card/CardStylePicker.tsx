"use client";

import { useRef, type KeyboardEvent } from "react";
import { CARD_STYLE_IDS, CARD_STYLE_META, type CardStyleId } from "./cardStyles";

export function CardStylePicker({
  value,
  onChange,
}: {
  value: CardStyleId;
  onChange: (style: CardStyleId) => void;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const activeMeta = CARD_STYLE_META[value];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = CARD_STYLE_IDS.indexOf(value);
    if (current < 0) return;

    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (current + 1) % CARD_STYLE_IDS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + CARD_STYLE_IDS.length) % CARD_STYLE_IDS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = CARD_STYLE_IDS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    onChange(CARD_STYLE_IDS[next]);
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[next]?.focus();
  }

  return (
    <fieldset className="mt-3">
      <legend className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--steel)]">
        Card edition
      </legend>
      <div
        ref={groupRef}
        className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Card visual style"
        onKeyDown={onKeyDown}
      >
        {CARD_STYLE_IDS.map((id) => {
          const meta = CARD_STYLE_META[id];
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(id)}
              className={`group border p-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ice)]/60 ${
                active
                  ? "border-[var(--goal-red)]/70 bg-[var(--goal-red)]/15 shadow-[0_0_18px_rgba(225,29,46,0.2)]"
                  : "border-[var(--kraft)]/12 bg-black/30 hover:border-[var(--kraft)]/30"
              }`}
            >
              <span
                aria-hidden
                className="mb-1.5 block h-1.5"
                style={{ background: meta.swatch }}
              />
              <span
                className={`block text-[8px] font-black uppercase tracking-[0.06em] sm:text-[9px] sm:tracking-[0.08em] ${
                  active ? "text-[var(--kraft)]" : "text-[var(--steel)]"
                }`}
              >
                {meta.label}
              </span>
              <span className="mt-0.5 hidden text-[8px] leading-snug text-[var(--steel)] sm:block">
                {meta.stock}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-[var(--steel)]">{activeMeta.tagline}</p>
    </fieldset>
  );
}
