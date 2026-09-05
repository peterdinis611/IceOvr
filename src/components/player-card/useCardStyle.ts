"use client";

import { useEffect, useState } from "react";
import {
  CARD_STYLE_STORAGE_KEY,
  DEFAULT_CARD_STYLE,
  parseCardStyle,
  type CardStyleId,
} from "./cardStyles";

export function useCardStyle(initial?: CardStyleId) {
  const [style, setStyleState] = useState<CardStyleId>(initial ?? DEFAULT_CARD_STYLE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CARD_STYLE_STORAGE_KEY);
      setStyleState(parseCardStyle(saved));
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  function setStyle(next: CardStyleId) {
    setStyleState(next);
    try {
      window.localStorage.setItem(CARD_STYLE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  return { style, setStyle, ready };
}
