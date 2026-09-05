// Coffee++ client menu — the single source of local menu data.
//
// This file intentionally has NO server dependency so the customer site can be
// published anywhere on its own. To update the menu, prices, availability or
// booth dates: edit this JSON directly, or export `coffeepp-menu.json` from the
// Coffee++ Booth Console (Settings → Client site menu) and replace this file.
import menuJson from "./menu.json";
import type { BoothSettings, BoothState, PublicProduct } from "@/lib/types";

interface MenuFile {
  version: number;
  booth: BoothSettings;
  products: PublicProduct[];
}

const menu = menuJson as unknown as MenuFile;

/** Menu file schema version — kept in sync with the Booth Console export. */
export const MENU_VERSION: number = menu.version;

/** Booth info shown across the customer site (countdown, GCash, contact). */
export const boothSettings: BoothSettings = menu.booth;

/** The full customer-visible menu. */
export const menuProducts: PublicProduct[] = menu.products;

/** Booth lifecycle from the menu dates: BEFORE → OPEN → CLOSED. */
export function boothStateOf(
  settings: BoothSettings,
  now: Date = new Date()
): BoothState {
  const t = now.getTime();
  if (t < new Date(settings.startDate).getTime()) return "BEFORE";
  if (t > new Date(settings.endDate).getTime()) return "CLOSED";
  return "OPEN";
}
