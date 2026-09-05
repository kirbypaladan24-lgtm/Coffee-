"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useCoffeeStore } from "@/lib/store";
import { MyOrdersSheet } from "./my-orders-sheet";

const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#how-to-order", label: "How to Order" },
  { href: "#photobooth", label: "Photo Booth" },
  { href: "#payment", label: "Payment & Contact" },
];

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const myOrders = useCoffeeStore((s) => s.myOrders);
  const [ordersOpen, setOrdersOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const orderCount = myOrders.length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-2"
          aria-label="Coffee++ — back to top"
        >
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
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {/* My orders — saved on this device */}
          <Button
            variant="outline"
            className="relative h-10 gap-2 font-semibold"
            onClick={() => setOrdersOpen(true)}
            aria-label={
              orderCount > 0
                ? `My orders — ${orderCount} saved`
                : "My orders"
            }
          >
            <Ticket className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">My Orders</span>
            {orderCount > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                aria-hidden
              >
                {orderCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle dark mode"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden />
            ) : (
              <Moon className="h-5 w-5" aria-hidden />
            )}
          </Button>

          <Button asChild className="hidden h-10 font-bold sm:inline-flex">
            <a href="#menu">Order Now</a>
          </Button>
        </div>
      </div>

      <MyOrdersSheet open={ordersOpen} onOpenChange={setOrdersOpen} />
    </header>
  );
}
