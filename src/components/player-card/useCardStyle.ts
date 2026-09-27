"use client";

import { useEffect, useState } from "react";
import {
  CARD_STYLE_STORAGE_KEY,
  DEFAULT_CARD_STYLE,
  parseCardStyle,
  type CardStyleId,
} from "./cardStyles";
import {
  CUSTOM_THEME_STORAGE_KEY,
  DEFAULT_CUSTOM_THEME,
  parseCustomTheme,
  sanitizeCustomTheme,
  type CustomCardTheme,
} from "./customTheme";

export function useCardStyle(initial?: CardStyleId, initialTheme?: CustomCardTheme) {
  const [style, setStyleState] = useState<CardStyleId>(initial ?? DEFAULT_CARD_STYLE);
  const [customTheme, setCustomThemeState] = useState<CustomCardTheme>(
    initialTheme ?? DEFAULT_CUSTOM_THEME,
  );
  const [ready, setReady] = useState(Boolean(initial));

  useEffect(() => {
    if (initial) {
      try {
        window.localStorage.setItem(CARD_STYLE_STORAGE_KEY, initial);
      } catch {
        // ignore
      }
      setStyleState(initial);
    } else {
      try {
        const saved = window.localStorage.getItem(CARD_STYLE_STORAGE_KEY);
        setStyleState(parseCardStyle(saved));
      } catch {
        // ignore
      }
    }

    if (initialTheme) {
      try {
        window.localStorage.setItem(
          CUSTOM_THEME_STORAGE_KEY,
          JSON.stringify(sanitizeCustomTheme(initialTheme)),
        );
      } catch {
        // ignore
      }
      setCustomThemeState(sanitizeCustomTheme(initialTheme));
    } else {
      try {
        const savedTheme = window.localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
        if (savedTheme) setCustomThemeState(parseCustomTheme(savedTheme));
      } catch {
        // ignore
      }
    }

    setReady(true);
  }, [initial, initialTheme]);

  function setStyle(next: CardStyleId) {
    setStyleState(next);
    try {
      window.localStorage.setItem(CARD_STYLE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  function setCustomTheme(next: CustomCardTheme) {
    const clean = sanitizeCustomTheme(next);
    setCustomThemeState(clean);
    try {
      window.localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(clean));
    } catch {
      // ignore
    }
  }

  return { style, setStyle, customTheme, setCustomTheme, ready };
}
