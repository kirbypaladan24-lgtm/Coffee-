"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { menuProducts } from "@/data/menu";
import { PressableImage } from "./image-viewer";

const SAMPLES = [
  { src: "/images/photobooth/sample-1.jpg", caption: "Booth besties", rotate: "-rotate-2" },
  { src: "/images/photobooth/sample-2.jpg", caption: "Props on", rotate: "rotate-1" },
  { src: "/images/photobooth/sample-3.jpg", caption: "Morning pick", rotate: "-rotate-1" },
  { src: "/images/photobooth/sample-4.jpg", caption: "Golden hour", rotate: "rotate-2" },
];

/** Photo booth gallery — playful but tidy polaroid wall.
 *  Mobile keeps the snug 2-up grid; desktop gets a wider wall so the
 *  samples read as real photos instead of thumbnails.
 *  When the Photobooth product (PB-001) is marked unavailable in the menu,
 *  the samples stay visible as a preview but every caption + the CTA say
 *  so — nobody walks up expecting a session. */
export function PhotoBoothSection() {
  const boothProduct = menuProducts.find((p) => p.id === "PB-001");
  const isAvailable = boothProduct ? boothProduct.available : true;

  return (
    <section
      id="photobooth"
      className="border-y border-border/60 bg-cream/60 scroll-mt-20"
    >
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Photo Booth"
          title="Strike a Pose"
          lead={
            isAvailable
              ? "Grab a strip with friends while you wait for your brew — every session comes with an instant print. Tap a photo to see it big."
              : "Our photo booth is on a break right now — the samples below are just a preview. Check back later!"
          }
        />

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:max-w-6xl xl:gap-8">
          {SAMPLES.map((sample) => (
            <figure
              key={sample.src}
              className={`group ${sample.rotate} transition-transform duration-200 hover:rotate-0 hover:scale-[1.03]`}
            >
              <div className="rounded-sm bg-card p-2.5 pb-0 shadow-md">
                <div className="relative">
                  <PressableImage
                    src={sample.src}
                    alt={
                      isAvailable
                        ? `Photo booth sample — ${sample.caption}`
                        : `Photo booth sample — ${sample.caption} (currently unavailable)`
                    }
                    caption={sample.caption}
                    sizes="(max-width: 1023px) 50vw, 25vw"
                    // Full static strings — Tailwind only generates classes
                    // it can read literally (no template-literal building).
                    className={
                      isAvailable
                        ? "aspect-[3/4]"
                        : "aspect-[3/4] grayscale opacity-80"
                    }
                  />
                  {!isAvailable && (
                    <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-border/60 bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                </div>
                <figcaption className="py-2.5 text-center font-display text-sm italic text-muted-foreground sm:text-base">
                  {isAvailable ? sample.caption : "Unavailable right now"}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          {isAvailable ? (
            <>
              <p className="text-sm text-muted-foreground">
                Sessions happen right at the booth — instant printed strip included.
              </p>
              <Button
                variant="outline"
                className="font-bold"
                onClick={() =>
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Camera className="mr-2 h-4 w-4" aria-hidden />
                Add a session to your order
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Photobooth sessions are unavailable right now — drinks &amp;
              treats are still orderable from the menu.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
