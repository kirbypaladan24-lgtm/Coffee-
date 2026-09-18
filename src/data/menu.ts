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

/**
 * GCash switch from the menu file — absent (v2 files) means enabled,
 * so old exports keep working. Reads `booth.gcashPayment`.
 */
export function isGcashEnabled(
  settings: BoothSettings = boothSettings
): boolean {
  return settings.gcashPayment !== false;
}

/**
 * Ordering switch from the menu file — absent (pre-v6 files) means
 * enabled. When false the site is a menu only: no order form, no QR.
 */
export function isOrderingEnabled(
  settings: BoothSettings = boothSettings
): boolean {
  return settings.orderingEnabled !== false;
}

/**
 * Inclusive calendar-day count of the booth run (local time), derived from
 * the menu dates — drives the hero "N Days Only" badge, so the run length
 * is data, never a hardcoded constant.
 */
export function boothDayCount(startISO: string, endISO: string): number {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const count = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  return count >= 1 ? count : 1;
}
