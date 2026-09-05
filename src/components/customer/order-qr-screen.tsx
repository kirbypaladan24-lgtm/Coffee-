"use client";

import * as React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Loader2,
  Printer,
  ScanLine,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { PressableImage } from "./image-viewer";
import { useCoffeeStore } from "@/lib/store";
import { buildOrderQrPayload, toQrDataUrl } from "@/lib/qr";
import { formatPeso, shortOrderId } from "@/lib/format";
import { boothSettings } from "@/data/menu";

/** Post-order Order QR screen — the QR is the visual focus. */
export function OrderQRScreen() {
  const activeOrder = useCoffeeStore((s) => s.activeOrder);
  const setActiveOrder = useCoffeeStore((s) => s.setActiveOrder);
  const [qrSrc, setQrSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!activeOrder) return;
    let cancelled = false;
    // The QR embeds the FULL order: ID, name, email, items, total, payment.
    toQrDataUrl(buildOrderQrPayload(activeOrder), 512).then((src) => {
      if (!cancelled) setQrSrc(src);
    });
    return () => {
      cancelled = true;
    };
  }, [activeOrder]);

  if (!activeOrder) return null;
  const order = activeOrder;
  const isGCash = order.paymentMethod === "GCASH";

  return (
    <div className="flex min-h-dvh flex-col bg-coffee-grain">
      {/* Slim top bar (hidden when printing) */}
      <header className="no-print border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            {/* SPECS org seal — leads the brand lockup, top left */}
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-border"
              title="SPECS — Society of Programmers and Enthusiasts in Computer Science, Partido State University"
            >
              <Image
                src="/images/brand/specs-logo.png"
                alt="SPECS organization seal"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </span>
            <BrandLogo compact markClassName="h-8 w-8" />
          </div>
          <Button
            variant="ghost"
            className="font-semibold text-muted-foreground"
            onClick={() => setActiveOrder(null)}
          >
            Back to Menu
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Confirmation + QR card — print-ticket keeps the printed copy
              dark-ink-on-white even while browsing in dark mode */}
          <div className="print-ticket rounded-xl border border-border bg-card p-6 shadow-md sm:p-8">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-success">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                Order Confirmed
              </span>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                Coffee<span className="text-primary">++</span>
              </p>
              <h1 className="font-display text-4xl font-black tabular-nums text-foreground">
                {shortOrderId(order.orderId)}
              </h1>
              <p className="text-xs text-muted-foreground">
                Keep this QR — it holds your full order details for the booth.
              </p>
            </div>

            {/* QR — the main visual focus; pressable → fullscreen scan view */}
            <div
              className="my-6 flex flex-col items-center gap-2"
              aria-label={`Order QR for ${order.orderId}`}
            >
              {qrSrc ? (
                <div className="rounded-xl border-2 border-primary/15 bg-white p-3 shadow-sm">
                  <PressableImage
                    src={qrSrc}
                    alt={`Order QR code for ${order.orderId}`}
                    caption={`Order QR — ${shortOrderId(order.orderId)}`}
                    sizes="256px"
                    unoptimized
                    priority
                    className="h-56 w-56 bg-white sm:h-64 sm:w-64"
                    chipClassName="right-1.5 bottom-1.5 bg-black/30"
                    ariaLabel={`Show order QR fullscreen — ${shortOrderId(
                      order.orderId
                    )}`}
                  />
                </div>
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-xl border-2 border-dashed border-border">
                  <Loader2
                    className="h-8 w-8 animate-spin text-muted-foreground"
                    aria-hidden
                  />
                </div>
              )}
              {qrSrc && (
                <p className="no-print text-xs text-muted-foreground">
                  Tap the QR to enlarge it — easier for the booth scanner.
                </p>
              )}
            </div>

            {/* Order details */}
            <div className="space-y-1.5 border-t border-border/60 pt-4 text-sm">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-foreground"
                >
                  <span className="truncate pr-2">
                    {item.quantity} × {item.productName}
                    {item.temperature && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {item.temperature}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatPeso(item.subtotal)}
                  </span>
                </div>
              ))}
              <div className="flex items-baseline justify-between border-t border-border/60 pt-3 text-base font-bold">
                <span>TOTAL</span>
                <span className="font-display text-2xl tabular-nums">
                  {formatPeso(order.total)}
                </span>
              </div>
            </div>

            {/* Customer details — carried inside the QR */}
            <div className="mt-3 space-y-1.5 rounded-lg bg-secondary/70 p-3 text-sm">
              <p className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  We&apos;ll call
                </span>
                <span className="truncate font-display text-base font-bold text-foreground">
                  {order.customerAlias || order.customerName}
                </span>
              </p>
              <p className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  For
                </span>
                <span className="truncate font-semibold text-foreground">
                  {order.customerName}
                </span>
              </p>
              {order.customerEmail && (
                <p className="flex items-center justify-between gap-2">
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email
                  </span>
                  <span className="truncate text-muted-foreground">
                    {order.customerEmail}
                  </span>
                </p>
              )}
            </div>

            {/* Payment notice */}
            <div className="mt-4">
              <p className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-secondary/70 px-3 py-2 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
                {isGCash ? (
                  <Smartphone className="h-4 w-4" aria-hidden />
                ) : (
                  <BadgeCheck className="h-4 w-4" aria-hidden />
                )}
                {isGCash ? "GCash" : "Pay at Booth"}
              </p>
              {isGCash && (
                <div className="mt-3 rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm text-warning-foreground">
                  <p className="font-semibold">
                    Send {formatPeso(order.total)} via GCash to:
                  </p>
                  <p className="my-1 font-mono text-base font-bold tracking-wider text-foreground">
                    {boothSettings.gcashNumber}
                  </p>
                  <p className="text-xs leading-relaxed">
                    Payment is verified manually by our staff — please complete
                    it before claiming your order.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
            <ScanLine className="h-8 w-8 shrink-0 text-primary" aria-hidden />
            <p className="text-sm font-semibold leading-relaxed text-foreground">
              Please present this QR at the Coffee++ booth.
              <span className="block font-normal text-muted-foreground">
                Our staff will scan it, verify payment, and call out “
                {order.customerAlias || order.customerName}” when it&apos;s
                ready.
              </span>
            </p>
          </div>

          <p className="no-print mt-3 text-center text-xs text-muted-foreground">
            Tip: take a screenshot — and if you want more later, just have the
            staff scan this QR again. Each scan adds another copy of your
            order.
          </p>

          <div className="no-print mt-5 flex flex-col gap-2 sm:flex-row">
            <Button
              className="h-12 flex-1 text-base font-bold"
              onClick={() => setActiveOrder(null)}
            >
              Done — Back to Menu
            </Button>
            <Button
              variant="outline"
              className="h-12 flex-1 text-base font-bold"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" aria-hidden />
              Print Order
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
