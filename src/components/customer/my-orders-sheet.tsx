"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { useCoffeeStore } from "@/lib/store";
import {
  formatDateTime,
  formatPeso,
  paymentMethodLabel,
  shortOrderId,
} from "@/lib/format";
import type { Order } from "@/lib/types";

/** Saved orders on this device — tap one to bring its QR back up. */
export function MyOrdersSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const myOrders = useCoffeeStore((s) => s.myOrders);
  const setActiveOrder = useCoffeeStore((s) => s.setActiveOrder);
  const clearOrders = useCoffeeStore((s) => s.clearOrders);
  const [confirmClear, setConfirmClear] = React.useState(false);

  function openOrderTicket(order: Order) {
    setActiveOrder(order);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto scroll-thin sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60">
          <SheetTitle className="font-display text-xl">My Orders</SheetTitle>
          <SheetDescription>
            Your saved Order QR tickets — tap one to show it at the booth
            again.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 p-4">
          {myOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Orders you place are saved on this device so you can re-open your QR anytime."
            />
          ) : (
            <>
              {myOrders.map((order) => (
                <button
                  key={order.orderId}
                  type="button"
                  onClick={() => openOrderTicket(order)}
                  className="w-full rounded-lg border border-border/70 bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/60 focus-visible:outline-2"
                  aria-label={`Show QR for order ${shortOrderId(order.orderId)}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-bold tabular-nums text-foreground">
                      {shortOrderId(order.orderId)}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-foreground">
                      {formatPeso(order.total)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)} ·{" "}
                    {paymentMethodLabel(order.paymentMethod)}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm text-foreground">
                    {order.items
                      .map(
                        (i) =>
                          `${i.quantity}× ${i.productName}${
                            i.temperature ? ` (${i.temperature})` : ""
                          }`
                      )
                      .join(", ")}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-primary">
                    Show QR →
                  </p>
                </button>
              ))}

              <Button
                variant="outline"
                className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                Clear order history
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Saved on this device only — screenshots work too.
              </p>
            </>
          )}
        </div>
      </SheetContent>

      <AlertDialog
        open={confirmClear}
        onOpenChange={(o) => {
          setConfirmClear(o);
          if (o) onOpenChange(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear order history?</AlertDialogTitle>
            <AlertDialogDescription>
              Your saved QR tickets will be removed from this device. Orders
              already claimed at the booth are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmClear(false)}>
              Keep them
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                clearOrders();
                setConfirmClear(false);
                onOpenChange(false);
              }}
            >
              Clear history
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
