"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Client island — sticky glass header chrome on scroll. */
export function StickyHeaderShell({
  sticky = false,
  stacked = false,
  children,
}: {
  sticky?: boolean;
  /** Stack brand row + scout field on narrow screens */
  stacked?: boolean;
  children: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sticky) return;

    const sync = () => {
      frameRef.current = null;
      setScrolled(window.scrollY > 12);
    };

    const onScroll = () => {
      if (frameRef.current != null) return;
      frameRef.current = window.requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current != null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [sticky]);

  return (
    <header
      className={`relative z-40 mx-auto w-full max-w-6xl shrink-0 px-4 py-3 sm:px-6 sm:py-4 ${
        sticky ? "sticky top-0 transition-[background,box-shadow,backdrop-filter] duration-200" : ""
      } ${
        sticky && scrolled
          ? "border-b border-[var(--kraft)]/12 bg-[#0a0908]/88 shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur-md"
          : ""
      } ${
        stacked
          ? "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3"
          : "flex items-center gap-3"
      }`}
    >
      {children}
    </header>
  );
}
