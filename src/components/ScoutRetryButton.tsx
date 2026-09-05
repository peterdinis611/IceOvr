"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ScoutRetryButton() {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  function retry() {
    setRetrying(true);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={retry}
      disabled={retrying}
      className="rounded-lg bg-[#e11d2e] px-5 py-3 font-display text-lg tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(225,29,46,.3)] disabled:opacity-60"
    >
      {retrying ? "RETRYING…" : "RETRY SCOUT"}
    </button>
  );
}
