"use client";

import * as React from "react";
import { Hero } from "./hero";
import { MenuSection } from "./menu-section";
import {
  HowToOrderSection,
  PaymentContactSection,
} from "./info-sections";
import { PhotoBoothSection } from "./photo-booth-section";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { boothSettings } from "@/data/menu";

/** Public Coffee++ web menu — the customer-facing experience. */
export function CustomerSite() {
  return (
    <div id="top" className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero settings={boothSettings} />
        <MenuSection />
        <HowToOrderSection />
        <PhotoBoothSection />
        <PaymentContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
