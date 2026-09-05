"use client";

import * as React from "react";
import { Banknote, Mail, Phone, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { boothSettings } from "@/data/menu";
import { HOW_TO_ORDER_STEPS } from "@/lib/constants";

/** How-to-order steps */
export function HowToOrderSection() {
  return (
    <section
      id="how-to-order"
      className="container mx-auto scroll-mt-20 px-4 py-12 sm:py-16"
    >
      <SectionHeading eyebrow="How to Order" title="Four Steps" lead="" />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_TO_ORDER_STEPS.map((step, i) => (
          <li key={step.title}>
            <Card className="h-full border-border/70">
              <CardContent className="flex h-full flex-col gap-2 p-4 sm:p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold text-foreground sm:text-base">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {step.text}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Payment & contact info */
export function PaymentContactSection() {
  const settings = boothSettings;

  return (
    <section
      id="payment"
      className="border-t border-border/60 bg-cream/60 scroll-mt-20"
    >
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Good to Know"
          title="Payment & Contact"
          lead="Two easy ways to pay — plus where to find us if you need anything."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {/* GCash */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Smartphone className="h-4 w-4" aria-hidden />
                </span>
                GCash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Select <strong className="text-foreground">GCash</strong> when
                ordering, then send the exact total to:
              </p>
              <p className="rounded-md border border-border bg-secondary/70 px-3 py-2 text-center font-mono text-base font-bold tracking-wider text-foreground">
                {settings.gcashNumber}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our staff manually verifies your payment when you show your
                Order QR — no auto-deductions, ever.
              </p>
            </CardContent>
          </Card>

          {/* Pay at Booth */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Banknote className="h-4 w-4" aria-hidden />
                </span>
                Pay at Booth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Prefer cash? Just pick{" "}
                <strong className="text-foreground">Pay at Booth</strong> at
                checkout.
              </p>
              <p className="rounded-md border border-border bg-secondary/70 px-3 py-2 text-center font-mono text-sm font-bold tracking-wider text-foreground">
                ₱ Cash · at pickup
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Staff confirms your payment on the spot — bringing exact change
                helps us serve you faster.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                Booth Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Questions about your order? Reach the Coffee++ team (SPECS):
              </p>
              <p className="rounded-md border border-border bg-secondary/70 px-3 py-2 text-center font-mono text-base font-bold tracking-wider text-foreground">
                {settings.specsNumber}
              </p>
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center justify-center gap-2 rounded-md border border-border bg-secondary/70 px-3 py-2 font-mono text-sm font-bold tracking-wide text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {settings.contactEmail}
                </a>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Look for the Coffee++ banner at the SPECS booth area.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
