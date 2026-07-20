"use client";

import { getLanguageMeta, languageIconUrl } from "@/lib/languages";
import { getCountry, flagImageUrl, hasKnownCountry } from "@/lib/countries";

export function FlagBadge({
  code,
  size = 20,
}: {
  code: string | null;
  size?: number;
}) {
  if (!hasKnownCountry(code) || !code) return null;
  const country = getCountry(code);
  const src = flagImageUrl(code, size <= 20 ? 40 : 80);
  if (!country || !src) return null;

  return (
    <span className="inline-flex items-center gap-1.5" title={country.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={country.name}
        width={size}
        height={Math.round(size * 0.75)}
        className="rounded-sm object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
      />
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/60">
        {country.code}
      </span>
    </span>
  );
}

export function LanguageBadge({
  language,
  size = 18,
}: {
  language: string | null;
  size?: number;
}) {
  if (!language) return null;
  const meta = getLanguageMeta(language);
  const icon = languageIconUrl(language);
  if (!meta) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5"
      style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}55` }}
      title={meta.name}
    >
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt={meta.name} width={size} height={size} className="rounded-sm" />
      ) : (
        <span
          className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-sm text-[9px] font-bold"
          style={{ background: meta.color, color: "#0b1220" }}
        >
          {meta.short}
        </span>
      )}
      <span className="max-w-[90px] truncate text-[10px] font-semibold" style={{ color: meta.color }}>
        {meta.short}
      </span>
    </span>
  );
}
