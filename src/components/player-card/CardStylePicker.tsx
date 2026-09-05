"use client";

import { CARD_STYLE_IDS, CARD_STYLE_META, type CardStyleId } from "./cardStyles";

export function CardStylePicker({
  value,
  onChange,
}: {
  value: CardStyleId;
  onChange: (style: CardStyleId) => void;
}) {
  return (
    <fieldset className="mt-3">
      <legend className="text-[9px] font-black uppercase tracking-[0.2em] text-[#64748b]">
        Card edition
      </legend>
      <div className="mt-2 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Card visual style">
        {CARD_STYLE_IDS.map((id) => {
          const meta = CARD_STYLE_META[id];
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className={`rounded-lg border px-1.5 py-2 text-left transition ${
                active
                  ? "border-[#e11d2e]/70 bg-[#e11d2e]/15 shadow-[0_0_18px_rgba(225,29,46,0.2)]"
                  : "border-white/10 bg-black/25 hover:border-white/25"
              }`}
            >
              <span
                className={`block text-[8px] font-black uppercase tracking-[0.06em] sm:text-[9px] sm:tracking-[0.08em] ${
                  active ? "text-white" : "text-[#94a3b8]"
                }`}
              >
                {meta.label}
              </span>
              <span className="mt-0.5 hidden text-[8px] leading-snug text-[#64748b] sm:block">
                {meta.stock}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
