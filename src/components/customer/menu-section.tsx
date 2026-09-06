"use client";

import * as React from "react";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "./product-card";
import { OrderDialog } from "./order-dialog";
import { menuProducts } from "@/data/menu";
import type { PublicProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MenuSection() {
  const [category, setCategory] = React.useState<string>("All");
  const [orderProduct, setOrderProduct] = React.useState<PublicProduct | null>(
    null
  );

  const products = menuProducts;
  const categories = React.useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <section id="menu" className="container mx-auto scroll-mt-20 px-4 py-12 sm:py-16">
      <SectionHeading
        eyebrow="The Menu"
        title="Brewed Fresh, Priced Fair"
        lead="Everything is prepared on the spot by the Coffee++ team. Drinks marked Hot / Cold get separate hot and cold counts — mix them in one order."
      />

      {/* Category filter */}
      <div
        className="mb-6 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Product categories"
      >
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "h-9 rounded-full border px-4 text-sm font-semibold transition-colors",
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-accent"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No products in this category"
          description="Try another category or check back soon."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={setOrderProduct}
            />
          ))}
        </div>
      )}

      <OrderDialog
        product={orderProduct}
        open={orderProduct !== null}
        onOpenChange={(open) => !open && setOrderProduct(null)}
      />
    </section>
  );
}
