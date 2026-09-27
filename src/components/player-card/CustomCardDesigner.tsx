"use client";

import {
  CUSTOM_ACCENT_PRESETS,
  CUSTOM_SECONDARY_PRESETS,
  type CustomCardTheme,
  type CustomInk,
  type CustomPhotoLayout,
} from "./customTheme";

const PHOTO_OPTIONS: { id: CustomPhotoLayout; label: string; detail: string }[] = [
  { id: "band", label: "Band", detail: "Wide photo window" },
  { id: "circle", label: "Circle", detail: "Centered portrait" },
  { id: "stamp", label: "Stamp", detail: "Ink cut frame" },
];

const INK_OPTIONS: { id: CustomInk; label: string }[] = [
  { id: "dark", label: "Dark ice" },
  { id: "light", label: "Light stock" },
];

export function CustomCardDesigner({
  theme,
  onChange,
}: {
  theme: CustomCardTheme;
  onChange: (next: CustomCardTheme) => void;
}) {
  function patch(partial: Partial<CustomCardTheme>) {
    onChange({ ...theme, ...partial });
  }

  return (
    <section className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
        Custom studio
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">
        Dial accent, layout, and stock mark — live on your scout card.
      </p>

      <div className="mt-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748b]">Accent</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CUSTOM_ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Accent ${color}`}
              onClick={() => patch({ accent: color })}
              className={`h-7 w-7 rounded-full border-2 transition ${
                theme.accent === color ? "border-white scale-110" : "border-white/20"
              }`}
              style={{ background: color }}
            />
          ))}
          <label className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-dashed border-white/25">
            <span className="sr-only">Custom accent</span>
            <input
              type="color"
              value={theme.accent}
              onChange={(event) => patch({ accent: event.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              aria-hidden
              className="block h-full w-full"
              style={{ background: theme.accent }}
            />
          </label>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748b]">Secondary</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CUSTOM_SECONDARY_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Secondary ${color}`}
              onClick={() => patch({ secondary: color })}
              className={`h-7 w-7 rounded-full border-2 transition ${
                theme.secondary === color ? "border-white scale-110" : "border-white/20"
              }`}
              style={{ background: color }}
            />
          ))}
          <label className="relative h-7 w-7 overflow-hidden rounded-full border-2 border-dashed border-white/25">
            <span className="sr-only">Custom secondary</span>
            <input
              type="color"
              value={theme.secondary}
              onChange={(event) => patch({ secondary: event.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              aria-hidden
              className="block h-full w-full"
              style={{ background: theme.secondary }}
            />
          </label>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748b]">Photo layout</p>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {PHOTO_OPTIONS.map((option) => {
            const active = theme.photo === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => patch({ photo: option.id })}
                className={`rounded-lg border px-1.5 py-2 text-left transition ${
                  active
                    ? "border-[#7dd3fc]/60 bg-[#7dd3fc]/10 text-white"
                    : "border-white/10 bg-black/20 text-[#94a3b8] hover:border-white/25"
                }`}
              >
                <span className="block text-[9px] font-black uppercase tracking-[0.1em]">
                  {option.label}
                </span>
                <span className="mt-0.5 hidden text-[8px] text-[#64748b] sm:block">
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748b]">Ink</p>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {INK_OPTIONS.map((option) => {
            const active = theme.ink === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => patch({ ink: option.id })}
                className={`rounded-lg border px-2 py-2 text-[9px] font-black uppercase tracking-[0.12em] transition ${
                  active
                    ? "border-[#7dd3fc]/60 bg-[#7dd3fc]/10 text-white"
                    : "border-white/10 bg-black/20 text-[#94a3b8] hover:border-white/25"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-3 block">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
          Stock mark
        </span>
        <input
          type="text"
          maxLength={12}
          value={theme.stock}
          onChange={(event) =>
            patch({ stock: event.target.value.toUpperCase().slice(0, 12) })
          }
          className="mt-1.5 h-10 w-full rounded-lg border border-white/15 bg-black/30 px-3 font-display text-sm tracking-[0.14em] text-white outline-none focus:border-[#7dd3fc]/50"
          placeholder="STUDIO"
        />
      </label>
    </section>
  );
}
