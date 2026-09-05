"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { PressableImage } from "./image-viewer";

const SAMPLES = [
  { src: "/images/photobooth/sample-1.jpg", caption: "Booth besties", rotate: "-rotate-2" },
  { src: "/images/photobooth/sample-2.jpg", caption: "Props on", rotate: "rotate-1" },
  { src: "/images/photobooth/sample-3.jpg", caption: "Solo :(", rotate: "-rotate-1" },
  { src: "/images/photobooth/sample-4.jpg", caption: "Cutie", rotate: "rotate-2" },
];

/** Photo booth gallery — playful but tidy polaroid wall.
 *  Mobile keeps the snug 2-up grid; desktop gets a wider wall so the
 *  samples read as real photos instead of thumbnails. */
export function PhotoBoothSection() {
  return (
    <section
      id="photobooth"
      className="border-y border-border/60 bg-cream/60 scroll-mt-20"
    >
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Photo Booth"
          title="Strike a Pose"
          lead="Grab a strip with friends while you wait for your brew — every session comes with an instant print. Tap a photo to see it big."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:max-w-6xl xl:gap-8">
          {SAMPLES.map((sample) => (
            <figure
              key={sample.src}
              className={`group ${sample.rotate} transition-transform duration-200 hover:rotate-0 hover:scale-[1.03]`}
            >
              <div className="rounded-sm bg-card p-2.5 pb-0 shadow-md">
                <PressableImage
                  src={sample.src}
                  alt={`Photo booth sample — ${sample.caption}`}
                  caption={sample.caption}
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="aspect-[3/4]"
                />
                <figcaption className="py-2.5 text-center font-display text-sm italic text-muted-foreground sm:text-base">
                  {sample.caption}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
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
        </div>
      </div>
    </section>
  );
}
