// Coffee++ formatting helpers
import { format, parseISO } from "date-fns";

/**
 * Fixed display timezone for every date/time we render.
 *
 * The booth runs at Partido State University (Philippines), and staff enter
 * booth windows / see timestamps in Manila wall-clock time. More importantly,
 * formatting with an EXPLICIT timezone makes the output identical on the
 * server (UTC in the sandbox / any host) and in the visitor's browser —
 * timezone-dependent rendering made the SSR text differ from the client text
 * and broke React hydration (the countdown date line). Never drop this option.
 */
const BOOTH_TIMEZONE = "Asia/Manila";

/** ₱49 or ₱1,519 (whole pesos) */
export function formatPeso(amount: number): string {
  return `₱${Math.round(amount).toLocaleString("en-PH")}`;
}

/** "ORD-0007" → "#0007" */
export function shortOrderId(orderId: string): string {
  const num = orderId.replace(/^ORD-/, "");
  return `#${num}`;
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return format(d, "MMM d, yyyy", { timeZone: BOOTH_TIMEZONE });
}

export function formatTime(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return format(d, "h:mm a", { timeZone: BOOTH_TIMEZONE });
}

export function formatDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return format(d, "MMM d, yyyy · h:mm a", { timeZone: BOOTH_TIMEZONE });
}

export function dayKey(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return format(d, "yyyy-MM-dd", { timeZone: BOOTH_TIMEZONE });
}

export function paymentMethodLabel(method: string): string {
  return method === "GCASH" ? "GCash" : "Pay at Booth";
}
