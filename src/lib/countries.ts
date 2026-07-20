export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

/** Common hockey + developer nations — ISO 3166-1 alpha-2 */
export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "CZ", name: "Czechia", flag: "🇨🇿" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "UN", name: "Unknown", flag: "🏳️" },
];

export function getCountry(code: string | null | undefined): CountryOption | null {
  if (!code) return null;
  const normalized = code.toUpperCase();
  if (normalized === "UN" || normalized === "XX") return null;
  return (
    COUNTRY_OPTIONS.find((c) => c.code === normalized && c.code !== "UN") ?? {
      code: normalized,
      name: normalized,
      flag: "🏳️",
    }
  );
}

/** True when we have a real ISO country to show a flag for. */
export function hasKnownCountry(code: string | null | undefined): boolean {
  return getCountry(code) !== null;
}

export function flagImageUrl(code: string, width = 40): string | null {
  const c = code.toLowerCase();
  if (!c || c === "un" || c === "xx") return null;
  return `https://flagcdn.com/w${width}/${c}.png`;
}
