"use client";

import * as React from "react";
import { Flame, Snowflake } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { PressableImage } from "./image-viewer";
import { formatPeso } from "@/lib/format";
import type { PublicProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Product card — image → name → ID → description → price → availability → order. */
export function ProductCard({
  product,
  onOrder,
}: {
  product: PublicProduct;
  onOrder: (product: PublicProduct) => void;
}) {
  const soldOut = !product.available;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col gap-0 py-0 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        soldOut && "opacity-90"
      )}
    >
      {/* Photo is pressable — opens the fullscreen image viewer.
          Square frame + object-contain: the WHOLE photo is always visible
          (no top/bottom cropping), whatever aspect the admin uploaded. */}
      <PressableImage
        src={product.image || "/images/products/ClassicCoffee.jpg"}
        alt={product.name}
        caption={product.name}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="aspect-square"
        imageClassName={cn(
          "object-contain",
          soldOut && "grayscale"
        )}
      >
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              Sold Out
            </span>
          </div>
        )}
      </PressableImage>

      <CardContent className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold leading-tight text-foreground sm:text-base">
            {product.name}
          </h3>
          {/* Temperature chip: a choice, or the fixed temp they'll actually get. */}
          {product.hasTemperature ? (
            <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-foreground">
              Hot / Cold
            </span>
          ) : product.defaultTemperature ? (
            <span
              className={
                "flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
                (product.defaultTemperature === "HOT"
                  ? "bg-warning/15 text-warning-foreground"
                  : "bg-secondary text-secondary-foreground")
              }
              title={
                product.defaultTemperature === "HOT"
                  ? "This one comes hot — no temperature choice"
                  : "This one comes cold — no temperature choice"
              }
            >
              {product.defaultTemperature === "HOT" ? (
                <Flame className="h-3 w-3" aria-hidden />
              ) : (
                <Snowflake className="h-3 w-3" aria-hidden />
              )}
              {product.defaultTemperature === "HOT" ? "Hot" : "Cold"}
            </span>
          ) : null}
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {product.id}
        </p>
        {product.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-foreground">
            {formatPeso(product.price)}
          </span>
          <AvailabilityBadge soldOut={soldOut} />
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
        <Button
          className="h-10 w-full font-bold"
          disabled={soldOut}
          onClick={() => onOrder(product)}
          aria-label={`Order ${product.name}`}
        >
          {soldOut ? "Unavailable" : "Order"}
        </Button>
      </CardFooter>
    </Card>
  );
}
