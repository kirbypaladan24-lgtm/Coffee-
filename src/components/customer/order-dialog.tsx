"use client";

import * as React from "react";
import { Flame, Minus, Plus, Snowflake } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PressableImage } from "./image-viewer";
import { useToast } from "@/hooks/use-toast";
import { useCoffeeStore } from "@/lib/store";
import { generateOrderCode } from "@/lib/order-code";
import { formatPeso } from "@/lib/format";
import { boothStateOf, boothSettings } from "@/data/menu";
import type {
  BoothState,
  Order,
  PaymentMethod,
  PublicProduct,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OrderDialog({
  product,
  open,
  onOpenChange,
}: {
  product: PublicProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const setActiveOrder = useCoffeeStore((s) => s.setActiveOrder);
  const addOrder = useCoffeeStore((s) => s.addOrder);

  // Smarter ordering: products with a temperature choice get SEPARATE
  // steppers — one count for HOT, one for COLD — so a single order can mix
  // (2 hot + 1 cold = two line items). No more picking a temp first.
  const [hotQty, setHotQty] = React.useState(0);
  const [coldQty, setColdQty] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [callName, setCallName] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [callNameError, setCallNameError] = React.useState<string | null>(null);
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethod>("GCASH");

  const boothState: BoothState = React.useMemo(
    () => boothStateOf(boothSettings),
    [open]
  );
  const orderingOpen = boothState === "OPEN";

  // Reset form whenever a new product opens the dialog
  React.useEffect(() => {
    if (open) {
      setHotQty(0);
      setColdQty(0);
      setQuantity(1);
      setCallName("");
      setCustomerName("");
      setCustomerEmail("");
      setCallNameError(null);
      setNameError(null);
      setEmailError(null);
      setPaymentMethod("GCASH");
    }
  }, [open, product?.id]);

  if (!product) return null;

  const soldOut = !product.available;
  const hasTemp = product.hasTemperature;
  const tempCount = hotQty + coldQty;
  const total = hasTemp ? product.price * tempCount : product.price * quantity;

  function applyOrder() {
    // Guard: a temperature-choice product needs at least one drink set.
    // (The APPLY button is disabled in this state — this is just defense.)
    if (product!.hasTemperature && hotQty + coldQty < 1) return;
    // How they want to be called — required: this is what our barista shouts.
    const alias = callName.trim();
    if (alias === "") {
      setCallNameError(
        "Tell us what to call you — it's what we shout when your order is ready."
      );
      return;
    }
    // Name is required — validate inline before anything else.
    const name = customerName.trim();
    if (name === "") {
      setNameError(
        "Please enter your name — it stays on your order for our records."
      );
      return;
    }
    // Email is optional, but must look valid when provided.
    const email = customerEmail.trim();
    if (email !== "" && !EMAIL_RE.test(email)) {
      setEmailError(
        "That email address doesn’t look valid — please check it, or leave it empty."
      );
      return;
    }
    createOrder(alias, name, email);
  }

  /** The order is created entirely on this device — no server involved. */
  function createOrder(alias: string, name: string, email: string) {
    const order: Order = {
      orderId: generateOrderCode(),
      customerName: name.slice(0, 40),
      customerAlias: alias.slice(0, 40),
      customerEmail: email.toLowerCase().slice(0, 120),
      // Temperature products → one line per temperature with its own count
      // (2 HOT + 1 COLD becomes two items — every system reads them as
      // separate lines). Fixed-temp / no-temp products keep a single line
      // carrying the product's fixed serving temp.
      items: product!.hasTemperature
        ? (
            [
              hotQty > 0 && {
                productId: product!.id,
                productName: product!.name,
                temperature: "HOT" as const,
                quantity: hotQty,
                price: product!.price,
                subtotal: product!.price * hotQty,
              },
              coldQty > 0 && {
                productId: product!.id,
                productName: product!.name,
                temperature: "COLD" as const,
                quantity: coldQty,
                price: product!.price,
                subtotal: product!.price * coldQty,
              },
            ] as const
          ).filter((i): i is Exclude<typeof i, false> => i !== false)
        : [
            {
              productId: product!.id,
              productName: product!.name,
              // The product's fixed serving temp — so the booth knows what
              // the customer is getting.
              temperature: product!.defaultTemperature ?? null,
              quantity,
              price: product!.price,
              subtotal: product!.price * quantity,
            },
          ],
      total,
      paymentMethod,
      paymentStatus: "UNPAID",
      orderStatus: "PENDING",
      abortReason: null,
      createdAt: new Date().toISOString(),
      scannedAt: null,
      completedAt: null,
    };

    addOrder(order);
    setActiveOrder(order);
    toast({
      title: "✓ Order created",
      description: `Order ${order.orderId} — show your QR at the booth.`,
    });
    onOpenChange(false);
  }

  const applyDisabled = soldOut || !orderingOpen || (hasTemp && tempCount < 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto scroll-thin sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Order {product.name}</DialogTitle>
          <DialogDescription>
            Set separate hot and cold counts when the drink offers a choice
            (or the quantity for fixed-temperature items), pick a payment
            method, then tell us what to call you and enter your name — email
            is optional.
          </DialogDescription>
        </DialogHeader>

        {/* Product header — thumbnail is pressable → fullscreen view */}
        <div className="flex items-center gap-3">
          <PressableImage
            src={product.image || "/images/products/ClassicCoffee.jpg"}
            alt={product.name}
            caption={product.name}
            sizes="80px"
            className="h-20 w-20 shrink-0 rounded-lg"
            chipClassName="h-6 w-6"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display text-xl font-bold leading-tight text-foreground">
                {product.name}
              </p>
              {/* Fixed serving temp — tells them what they're getting. */}
              {!product.hasTemperature && product.defaultTemperature && (
                <span
                  className={
                    "flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
                    (product.defaultTemperature === "HOT"
                      ? "bg-warning/15 text-warning-foreground"
                      : "bg-secondary text-secondary-foreground")
                  }
                >
                  {product.defaultTemperature === "HOT" ? (
                    <Flame className="h-3 w-3" aria-hidden />
                  ) : (
                    <Snowflake className="h-3 w-3" aria-hidden />
                  )}
                  {product.defaultTemperature === "HOT" ? "Hot" : "Cold"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {product.id} · {formatPeso(product.price)} each
            </p>
            {product.description && (
              <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Fixed-temp note — same info, spelled out so nobody misses it. */}
        {!product.hasTemperature && product.defaultTemperature && (
          <p
            className="rounded-md border border-border bg-secondary/60 px-3 py-2 text-sm font-semibold text-secondary-foreground"
            role="note"
          >
            Served {product.defaultTemperature === "HOT" ? "hot ☕" : "cold ❄"}
          </p>
        )}

        {/* Hot & Cold counts — a separate stepper per temperature.          */}
        {/* One order can mix: 2 hot + 1 cold = two line items downstream.    */}
        {product.hasTemperature && (
          <div className="space-y-2">
            <Label
              id="temp-counts-label"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              How many? — set each temperature
            </Label>
            <div
              className="space-y-2"
              role="group"
              aria-labelledby="temp-counts-label"
            >
              {/* HOT row */}
              <div className="flex h-12 items-center gap-2 rounded-md border border-warning/40 bg-warning/10 pl-3">
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-warning-foreground">
                  <Flame className="h-4 w-4" aria-hidden />
                  HOT
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setHotQty((q) => Math.max(0, q - 1))}
                    disabled={hotQty <= 0}
                    aria-label="Decrease hot count"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </Button>
                  <span
                    className="min-w-8 text-center text-base font-bold tabular-nums"
                    aria-live="polite"
                  >
                    {hotQty}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setHotQty((q) => q + 1)}
                    aria-label="Increase hot count"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <span
                  className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-muted-foreground"
                  aria-label={`Hot subtotal ${formatPeso(product.price * hotQty)}`}
                >
                  {hotQty > 0 ? formatPeso(product.price * hotQty) : "—"}
                </span>
              </div>
              {/* COLD row */}
              <div className="flex h-12 items-center gap-2 rounded-md border border-secondary bg-secondary/50 pl-3">
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-secondary-foreground">
                  <Snowflake className="h-4 w-4" aria-hidden />
                  COLD
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setColdQty((q) => Math.max(0, q - 1))}
                    disabled={coldQty <= 0}
                    aria-label="Decrease cold count"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </Button>
                  <span
                    className="min-w-8 text-center text-base font-bold tabular-nums"
                    aria-live="polite"
                  >
                    {coldQty}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setColdQty((q) => q + 1)}
                    aria-label="Increase cold count"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
                <span
                  className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-muted-foreground"
                  aria-label={`Cold subtotal ${formatPeso(product.price * coldQty)}`}
                >
                  {coldQty > 0 ? formatPeso(product.price * coldQty) : "—"}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Mix and match — separate counts for hot and cold, no limit.
            </p>
            {tempCount < 1 && (
              <p className="text-xs font-medium text-destructive" role="alert">
                Set a count for at least one — hot or cold.
              </p>
            )}
          </div>
        )}

        {/* Quantity — only for items WITHOUT a temperature choice */}
        {!product.hasTemperature && (
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quantity
            </Label>
            <div className="flex h-11 items-center justify-between rounded-md border border-input bg-background px-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </Button>
              <span
                className="min-w-10 text-center text-base font-bold tabular-nums"
                aria-live="polite"
              >
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              No limit — order as many as you need, the booth brews to demand.
            </p>
          </div>
        )}

        {/* How should we call you — required, asked FIRST */}
        <div className="space-y-2">
          <Label
            htmlFor="customer-callname"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            How should we call you? <span className="text-destructive">*</span>
          </Label>
          <Input
            id="customer-callname"
            placeholder="Baby"
            value={callName}
            maxLength={40}
            onChange={(e) => {
              setCallName(e.target.value);
              if (callNameError) setCallNameError(null);
            }}
            autoComplete="off"
            required
            aria-required="true"
            aria-invalid={callNameError ? true : undefined}
            aria-describedby={callNameError ? "customer-callname-error" : undefined}
          />
          {callNameError ? (
            <p
              id="customer-callname-error"
              className="text-xs font-medium text-destructive"
              role="alert"
            >
              {callNameError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              We will call you by this name when the order is ready.
            </p>
          )}
        </div>

        {/* Customer name — required */}
        <div className="space-y-2">
          <Label
            htmlFor="customer-name"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Customer Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="customer-name"
            placeholder="Joshua Garcia"
            value={customerName}
            maxLength={40}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (nameError) setNameError(null);
            }}
            autoComplete="off"
            required
            aria-required="true"
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "customer-name-error" : undefined}
          />
          {nameError && (
            <p
              id="customer-name-error"
              className="text-xs font-medium text-destructive"
              role="alert"
            >
              {nameError}
            </p>
          )}
        </div>

        {/* Email — optional */}
        <div className="space-y-2">
          <Label
            htmlFor="customer-email"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Email Address <span className="font-normal">(optional)</span>
          </Label>
          <Input
            id="customer-email"
            type="email"
            inputMode="email"
            placeholder="goodstudent143@parsu.edu.ph"
            value={customerEmail}
            maxLength={120}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            autoComplete="off"
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "customer-email-error" : undefined}
          />
          {emailError ? (
            <p
              id="customer-email-error"
              className="text-xs font-medium text-destructive"
              role="alert"
            >
              {emailError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              We’ll include it with your order — handy if we need to reach you.
            </p>
          )}
        </div>

        {/* Payment method */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Payment Method
          </Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            className="grid gap-2"
          >
            <Label
              htmlFor="pay-gcash"
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                paymentMethod === "GCASH"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent"
              )}
            >
              <RadioGroupItem value="GCASH" id="pay-gcash" className="mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">GCash</p>
                <p className="text-xs text-muted-foreground">
                  Send the exact total via GCash — staff verifies it at the
                  booth.
                </p>
              </div>
            </Label>
            <Label
              htmlFor="pay-booth"
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                paymentMethod === "BOOTH"
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent"
              )}
            >
              <RadioGroupItem value="BOOTH" id="pay-booth" className="mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">
                  Pay at Booth
                </p>
                <p className="text-xs text-muted-foreground">
                  Pay in cash when you claim your order.
                </p>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {/* Summary — one row per temperature line, total always visible */}
        <div className="space-y-1.5 rounded-lg bg-secondary/70 p-3 text-sm">
          {product.hasTemperature ? (
            <>
              {hotQty > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {product.name} · HOT
                    <Flame
                      className="ml-1 inline h-3 w-3 align-[-2px]"
                      aria-hidden
                    />
                  </span>
                  <span>
                    {hotQty} × {formatPeso(product.price)}
                  </span>
                </div>
              )}
              {coldQty > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {product.name} · COLD
                    <Snowflake
                      className="ml-1 inline h-3 w-3 align-[-2px]"
                      aria-hidden
                    />
                  </span>
                  <span>
                    {coldQty} × {formatPeso(product.price)}
                  </span>
                </div>
              )}
              {tempCount < 1 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>{product.name} · nothing set yet</span>
                  <span>0 × {formatPeso(product.price)}</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between text-muted-foreground">
              <span>
                {product.name}
                {product.defaultTemperature
                  ? ` · ${product.defaultTemperature}`
                  : ""}
              </span>
              <span>
                {quantity} × {formatPeso(product.price)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-border/60 pt-2 text-base font-bold text-foreground">
            <span>TOTAL</span>
            <span className="font-display text-lg">{formatPeso(total)}</span>
          </div>
        </div>

        {soldOut ? (
          <p
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-sm font-semibold text-destructive"
            role="alert"
          >
            This item is sold out — please pick another one.
          </p>
        ) : !orderingOpen && (
          <p
            className="rounded-md border border-warning/50 bg-warning/10 px-3 py-2 text-center text-sm font-semibold text-warning-foreground"
            role="alert"
          >
            {boothState === "BEFORE"
              ? "The booth hasn’t opened yet — check back soon."
              : "The booth has closed — orders are no longer accepted."}
          </p>
        )}

        <Button
          className="h-12 w-full text-base font-bold"
          onClick={applyOrder}
          disabled={applyDisabled}
        >
          APPLY ORDER
        </Button>
      </DialogContent>
    </Dialog>
  );
}
