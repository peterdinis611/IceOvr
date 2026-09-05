"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Client island — mouse parallax for the rink atmosphere moving layer. */
export function RinkParallaxLayer({ children }: { children: ReactNode }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!media.matches) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      layerRef.current?.style.setProperty("transform", `translate3d(${x}px, ${y}px, 0)`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={layerRef}
      className="absolute inset-0 will-change-transform transition-transform duration-300 ease-out"
    >
      {children}
    </div>
  );
}
