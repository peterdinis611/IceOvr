"use client";

import { useEffect } from "react";
import { pushRecentScout } from "@/lib/client/recent-scouts";

/** Persist last-opened scouts for the search desk. */
export function RememberScout({ username }: { username: string }) {
  useEffect(() => {
    pushRecentScout(username);
  }, [username]);
  return null;
}
