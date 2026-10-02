"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/search", label: "Scout", active: "border-[var(--ice)]/50 text-[var(--ice)]" },
  { href: "/board", label: "Draft", active: "border-[var(--goal-red)]/50 text-[#fda4af]" },
  { href: "/compare", label: "Faceoff", active: "border-[var(--kraft)]/40 text-[var(--kraft)]" },
  { href: "/team", label: "Lineup", active: "border-[var(--flood)]/50 text-[var(--flood)]" },
] as const;

/** Client island — active nav chrome. */
export function SiteNavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex items-center gap-1.5 sm:gap-2">
      {LINKS.map((link) => {
        const current =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`rounded border px-2 py-1 text-[9px] font-black uppercase tracking-[.14em] transition ${
              current
                ? link.active
                : "border-[var(--kraft)]/12 text-[var(--steel)] hover:border-[var(--kraft)]/30 hover:text-[var(--kraft)]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
