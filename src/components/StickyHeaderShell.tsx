"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Client island — sticky glass header chrome on scroll. */
export function StickyHeaderShell({
  sticky = false,
  children,
}: {
  sticky?: boolean;
  children: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  return (
    <header
      className={`relative z-40 mx-auto flex w-full max-w-6xl shrink-0 items-center gap-3 px-4 py-4 sm:px-6 ${
        sticky ? "sticky top-0 transition-[background,box-shadow,backdrop-filter] duration-200" : ""
      } ${
        sticky && scrolled
          ? "border-b border-white/10 bg-[#020b14]/78 shadow-[0_10px_30px_rgba(0,0,0,.28)] backdrop-blur-md"
          : ""
      }`}
    >
      {children}
    </header>
  );
}
