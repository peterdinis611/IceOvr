"use client";

import { PlayerCard as HutPlayerCard } from "@/components/player-card";
import { scoutToPlayerCardProps } from "@/components/player-card/fromScout";
import type { CardStyleId } from "@/components/player-card/cardStyles";
import type { CustomCardTheme } from "@/components/player-card/customTheme";
import type { ScoutCard } from "@/lib/types";

/** App wrapper — maps scout data into the collectible PlayerCard. */
export function PlayerCard({
  card,
  size = "lg",
  style,
  customTheme,
  reveal: _reveal = false,
  delay: _delay = 0,
}: {
  card: ScoutCard;
  size?: "sm" | "lg";
  style?: CardStyleId;
  customTheme?: CustomCardTheme;
  reveal?: boolean;
  delay?: number;
}) {
  return (
    <HutPlayerCard
      {...scoutToPlayerCardProps(card, size)}
      style={style}
      customTheme={customTheme}
    />
  );
}
