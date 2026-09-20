"use client";

import Image from "next/image";

type CardPortraitProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Extra classes on the sharp portrait image. */
  imageClassName?: string;
  /** Extra classes on the outer frame. */
  className?: string;
};

function avatarSrc(url: string, size: number) {
  return url.includes("?") ? `${url}&size=${size}` : `${url}?size=${size}`;
}

/**
 * Trading-card portrait: ambient fill + sharp full avatar.
 * Fills wide/tall frames without letterboxing or harsh crops.
 */
export function CardPortrait({
  src,
  alt,
  sizes,
  priority = false,
  imageClassName = "",
  className = "",
}: CardPortraitProps) {
  const hiRes = avatarSrc(src, 320);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <Image
        src={hiRes}
        alt=""
        fill
        sizes={sizes}
        aria-hidden
        draggable={false}
        className="scale-125 object-cover object-center opacity-90 blur-xl saturate-125"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35"
      />
      <Image
        src={hiRes}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        draggable={false}
        className={`object-contain object-center drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] ${imageClassName}`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_28px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}
