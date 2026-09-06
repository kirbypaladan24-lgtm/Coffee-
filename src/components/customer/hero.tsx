"use client";

import * as React from "react";
import { ArrowDown, Coffee, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/shared/brand-logo";
import { Countdown } from "./countdown";
import type { BoothSettings } from "@/lib/types";

/** Coffee++ brand hero — typography-first, warm, quick to parse. */
export function Hero({ settings }: { settings: BoothSettings }) {
  return (
    <section className="relative border-b border-border/60 bg-coffee-grain">
      <div className="container mx-auto relative flex flex-col items-center gap-6 px-4 py-16 text-center sm:gap-8 sm:py-24">
        <div
          className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-72 w-72 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "var(--primary)" }}
          aria-hidden
        />

        <span className="inline-flex items-center gap-2 rounded-full border border-transparent bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground dark:border-primary/20 dark:bg-secondary dark:text-secondary-foreground">
          <Coffee className="h-3.5 w-3.5" aria-hidden />
          SPECS Booth · 3 Days Only
        </span>

        <div className="flex flex-col items-center gap-3">
          {/* Mark color is brand-locked to #324020 (never theme-follows) */}
          <BrandMark className="h-24 w-24 sm:h-32 sm:w-32" />
          <h1 className="font-display text-6xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            Coffee
            <span className="text-primary">++</span>
          </h1>
          <p className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Freshly brewed coffee, sweet treats &amp; a photo booth — order
            ahead, show your QR, and your order is received.
          </p>
        </div>

        <Countdown settings={settings} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-bold"
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Menu
            <ArrowDown className="ml-1 h-4 w-4" aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-bold"
            onClick={() =>
              document
                .getElementById("how-to-order")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How to Order
            <HelpCircle className="ml-1 h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
