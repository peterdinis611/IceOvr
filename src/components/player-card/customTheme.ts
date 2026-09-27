export type CustomPhotoLayout = "band" | "circle" | "stamp";
export type CustomInk = "light" | "dark";

export type CustomCardTheme = {
  accent: string;
  secondary: string;
  ink: CustomInk;
  photo: CustomPhotoLayout;
  stock: string;
};

export const DEFAULT_CUSTOM_THEME: CustomCardTheme = {
  accent: "#e11d2e",
  secondary: "#7dd3fc",
  ink: "dark",
  photo: "band",
  stock: "STUDIO",
};

export const CUSTOM_THEME_STORAGE_KEY = "iceovr-custom-theme";

export const CUSTOM_ACCENT_PRESETS = [
  "#e11d2e",
  "#7dd3fc",
  "#f59e0b",
  "#34d399",
  "#f472b6",
  "#f8fafc",
] as const;

export const CUSTOM_SECONDARY_PRESETS = [
  "#7dd3fc",
  "#e11d2e",
  "#a78bfa",
  "#fbbf24",
  "#38bdf8",
  "#94a3b8",
] as const;

const HEX = /^#?[0-9a-fA-F]{6}$/;

export function normalizeHex(value: string, fallback: string): string {
  const raw = value.trim();
  if (!HEX.test(raw)) return fallback;
  return raw.startsWith("#") ? raw.toLowerCase() : `#${raw.toLowerCase()}`;
}

export function parseCustomTheme(
  value: string | null | undefined,
): CustomCardTheme {
  if (!value) return { ...DEFAULT_CUSTOM_THEME };
  try {
    // Compact: aa0000.7dd3fc.d.b.STUDIO
    const parts = value.split(".");
    if (parts.length >= 4) {
      const [accent, secondary, inkCode, photoCode, ...stockParts] = parts;
      const ink: CustomInk = inkCode === "l" ? "light" : "dark";
      const photo: CustomPhotoLayout =
        photoCode === "c" ? "circle" : photoCode === "s" ? "stamp" : "band";
      const stock = decodeURIComponent(stockParts.join(".") || "STUDIO")
        .slice(0, 12)
        .toUpperCase();
      return {
        accent: normalizeHex(accent, DEFAULT_CUSTOM_THEME.accent),
        secondary: normalizeHex(secondary, DEFAULT_CUSTOM_THEME.secondary),
        ink,
        photo,
        stock: stock || "STUDIO",
      };
    }
    const parsed = JSON.parse(value) as Partial<CustomCardTheme>;
    return sanitizeCustomTheme(parsed);
  } catch {
    return { ...DEFAULT_CUSTOM_THEME };
  }
}

export function sanitizeCustomTheme(
  input: Partial<CustomCardTheme> | null | undefined,
): CustomCardTheme {
  const photo =
    input?.photo === "circle" || input?.photo === "stamp" || input?.photo === "band"
      ? input.photo
      : DEFAULT_CUSTOM_THEME.photo;
  const ink = input?.ink === "light" ? "light" : "dark";
  const stock = (input?.stock ?? DEFAULT_CUSTOM_THEME.stock)
    .replace(/[^a-zA-Z0-9 ’'-]/g, "")
    .slice(0, 12)
    .toUpperCase();
  return {
    accent: normalizeHex(input?.accent ?? "", DEFAULT_CUSTOM_THEME.accent),
    secondary: normalizeHex(
      input?.secondary ?? "",
      DEFAULT_CUSTOM_THEME.secondary,
    ),
    ink,
    photo,
    stock: stock || "STUDIO",
  };
}

export function encodeCustomTheme(theme: CustomCardTheme): string {
  const t = sanitizeCustomTheme(theme);
  const ink = t.ink === "light" ? "l" : "d";
  const photo = t.photo === "circle" ? "c" : t.photo === "stamp" ? "s" : "b";
  return [
    t.accent.replace("#", ""),
    t.secondary.replace("#", ""),
    ink,
    photo,
    encodeURIComponent(t.stock),
  ].join(".");
}

export function resolveCustomVisual(theme: CustomCardTheme, tierLabel: string) {
  const t = sanitizeCustomTheme(theme);
  const dark = t.ink === "dark";
  return {
    label: tierLabel,
    accent: t.accent,
    secondary: t.secondary,
    glow: `${t.accent}66`,
    frame: `linear-gradient(145deg, ${t.secondary}, ${t.accent}, ${t.secondary})`,
    inner: dark
      ? `linear-gradient(180deg, #121820 0%, #070b10 55%, #0e141c 100%)`
      : `linear-gradient(180deg, #f4f7fb 0%, #e8eef5 55%, #dce4ee 100%)`,
    ink: dark ? "#f8fafc" : "#0f172a",
    muted: dark ? "rgba(248,250,252,0.55)" : "rgba(15,23,42,0.55)",
    panel: dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.55)",
    border: dark ? "rgba(255,255,255,0.14)" : "rgba(15,23,42,0.14)",
    ovrFill: `linear-gradient(180deg, ${t.secondary}, ${t.accent})`,
    stock: t.stock,
    photo: t.photo,
  };
}
