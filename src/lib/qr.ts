// Coffee++ client QR helper (browser-side).
//
// The customer's Order QR embeds the FULL order data as compact JSON —
// order ID, call-out name, customer name, email, items, total, and payment
// method — so the booth scanner (and any generic QR reader) sees everything
// at a glance. The Booth Console parses this payload to register the order.
"use client";

import QRCode from "qrcode";
import type { Order } from "@/lib/types";

/** One line item inside the QR payload. */
export interface QrOrderItem {
  pid: string; // product ID, e.g. CF-001
  q: number; // quantity
  n: string; // product name
  t: string | null; // HOT | COLD | null
  s: number; // subtotal (₱)
}

/** Full order data embedded in the Order QR. */
export interface QrOrderPayload {
  v: 1;
  id: string; // ORD-K7F2Q9
  name: string; // customer name
  alias?: string; // call-out name ("how they want to be called")
  email: string; // customer email ("" when not provided)
  items: QrOrderItem[];
  total: number;
  pay: string; // GCASH | BOOTH
  ts: string; // ISO time the order was placed
}

/** Build the compact JSON embedded in the Order QR. */
export function buildOrderQrPayload(order: Order): string {
  const payload: QrOrderPayload = {
    v: 1,
    id: order.orderId,
    name: order.customerName,
    ...(order.customerAlias?.trim() ? { alias: order.customerAlias.trim() } : {}),
    email: order.customerEmail ?? "",
    items: order.items.map((i) => ({
      pid: i.productId,
      q: i.quantity,
      n: i.productName,
      t: i.temperature,
      s: i.subtotal,
    })),
    total: order.total,
    pay: order.paymentMethod,
    ts: order.createdAt,
  };
  return JSON.stringify(payload);
}

/** Generate a QR data-URL for the order payload. */
export async function toQrDataUrl(text: string, size = 512): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#2E1A0EFF", light: "#FFFFFFFF" },
  });
}
