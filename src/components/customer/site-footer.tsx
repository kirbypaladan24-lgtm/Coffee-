"use client";

import * as React from "react";
import Image from "next/image";
import { BrandLogo } from "@/components/shared/brand-logo";

/** Sticky customer footer — brand, quick links, SPECS org credit. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card">
      <div className="container mx-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <BrandLogo compact markClassName="h-7 w-7" />
            <div className="flex items-center gap-3">
              {/* SPECS organization seal — white chip so it reads on dark mode too */}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-border">
                <Image
                  src="/images/brand/specs-logo.png"
                  alt="SPECS — Society of Programmers and Enthusiasts in Computer Science, Partido State University seal"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              </span>
              <p className="max-w-[26ch] text-xs leading-relaxed text-muted-foreground sm:max-w-none">
                A 3-day booth project by{" "}
                <span className="font-bold text-foreground">SPECS</span> —
                Society of Programmers &amp; Enthusiasts in Computer Science,
                Partido State University · est. 2024.
              </p>
            </div>
          </div>

          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-muted-foreground"
            aria-label="Footer"
          >
            <a href="#menu" className="hover:text-foreground">
              Menu
            </a>
            <a href="#photobooth" className="hover:text-foreground">
              Photo Booth
            </a>
            <a href="#payment" className="hover:text-foreground">
              Payment
            </a>
          </nav>
        </div>

        <p className="mt-6 border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          Coffee++ · Brewed with care for the school community
        </p>
      </div>
    </footer>
  );
}
