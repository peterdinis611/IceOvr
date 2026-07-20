export interface LanguageMeta {
  name: string;
  short: string;
  color: string;
  /** Devicon CDN path segment */
  icon: string;
}

const LANGS: Record<string, LanguageMeta> = {
  typescript: {
    name: "TypeScript",
    short: "TS",
    color: "#3178C6",
    icon: "typescript/typescript-original",
  },
  javascript: {
    name: "JavaScript",
    short: "JS",
    color: "#F7DF1E",
    icon: "javascript/javascript-original",
  },
  python: {
    name: "Python",
    short: "PY",
    color: "#3776AB",
    icon: "python/python-original",
  },
  rust: {
    name: "Rust",
    short: "RS",
    color: "#DEA584",
    icon: "rust/rust-original",
  },
  go: {
    name: "Go",
    short: "GO",
    color: "#00ADD8",
    icon: "go/go-original",
  },
  java: {
    name: "Java",
    short: "JV",
    color: "#ED8B00",
    icon: "java/java-original",
  },
  "c++": {
    name: "C++",
    short: "C++",
    color: "#00599C",
    icon: "cplusplus/cplusplus-original",
  },
  c: {
    name: "C",
    short: "C",
    color: "#A8B9CC",
    icon: "c/c-original",
  },
  "c#": {
    name: "C#",
    short: "C#",
    color: "#239120",
    icon: "csharp/csharp-original",
  },
  php: {
    name: "PHP",
    short: "PHP",
    color: "#777BB4",
    icon: "php/php-original",
  },
  ruby: {
    name: "Ruby",
    short: "RB",
    color: "#CC342D",
    icon: "ruby/ruby-original",
  },
  swift: {
    name: "Swift",
    short: "SW",
    color: "#F05138",
    icon: "swift/swift-original",
  },
  kotlin: {
    name: "Kotlin",
    short: "KT",
    color: "#7F52FF",
    icon: "kotlin/kotlin-original",
  },
  dart: {
    name: "Dart",
    short: "DT",
    color: "#0175C2",
    icon: "dart/dart-original",
  },
  html: {
    name: "HTML",
    short: "HTML",
    color: "#E34F26",
    icon: "html5/html5-original",
  },
  css: {
    name: "CSS",
    short: "CSS",
    color: "#1572B6",
    icon: "css3/css3-original",
  },
  shell: {
    name: "Shell",
    short: "SH",
    color: "#4EAA25",
    icon: "bash/bash-original",
  },
  vue: {
    name: "Vue",
    short: "VUE",
    color: "#41B883",
    icon: "vuejs/vuejs-original",
  },
  svelte: {
    name: "Svelte",
    short: "SV",
    color: "#FF3E00",
    icon: "svelte/svelte-original",
  },
  scala: {
    name: "Scala",
    short: "SC",
    color: "#DC322F",
    icon: "scala/scala-original",
  },
  elixir: {
    name: "Elixir",
    short: "EX",
    color: "#6E4A7E",
    icon: "elixir/elixir-original",
  },
  zig: {
    name: "Zig",
    short: "ZIG",
    color: "#F7A41D",
    icon: "zig/zig-original",
  },
};

export const LANGUAGE_OPTIONS = Object.values(LANGS);

export function getLanguageMeta(name: string | null | undefined): LanguageMeta | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  if (LANGS[key]) return LANGS[key];

  // Fuzzy only for multi-char keys to avoid "c" matching inside "brainfuck"
  for (const [k, meta] of Object.entries(LANGS)) {
    if (k.length < 2) continue;
    if (key === k || key.startsWith(`${k} `) || key.endsWith(` ${k}`)) return meta;
    if (k.length >= 4 && (key.includes(k) || k.includes(key))) return meta;
  }

  return {
    name,
    short: name.slice(0, 3).toUpperCase(),
    color: "#7dd3fc",
    icon: "",
  };
}


export function languageIconUrl(name: string | null | undefined): string | null {
  const meta = getLanguageMeta(name);
  if (!meta?.icon) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${meta.icon}.svg`;
}
