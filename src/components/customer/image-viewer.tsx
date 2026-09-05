"use client";

import * as React from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** What the fullscreen viewer is currently showing. */
export type ImageViewing = {
  src: string;
  alt: string;
  /** Line shown under the fullscreen image (e.g. product name or polaroid caption). */
  caption?: string;
};

type ViewFn = (image: ImageViewing) => void;

const ImageViewerContext = React.createContext<ViewFn>(() => {
  // Default no-op so PressableImage can render in isolation (tests/storybook).
});

/** Call from any client component to push an image into the fullscreen viewer. */
export function useImageViewer(): ViewFn {
  return React.useContext(ImageViewerContext);
}

/** Mounts once, near the app root — owns the fullscreen lightbox dialog. */
export function ImageViewerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewing, setViewing] = React.useState<ImageViewing | null>(null);
  const view = React.useCallback<ViewFn>((image) => setViewing(image), []);

  return (
    <ImageViewerContext.Provider value={view}>
      {children}
      <FullScreenImageView
        viewing={viewing}
        onClose={() => setViewing(null)}
      />
    </ImageViewerContext.Provider>
  );
}

/** Fullscreen lightbox — dark backdrop, contained image, tap/Esc to close. */
function FullScreenImageView({
  viewing,
  onClose,
}: {
  viewing: ImageViewing | null;
  onClose: () => void;
}) {
  const isDataUrl = viewing?.src.startsWith("data:") ?? false;

  return (
    <Dialog open={viewing !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-none bg-black/95 p-0 sm:max-w-none"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{viewing?.alt ?? "Image viewer"}</DialogTitle>
          <DialogDescription>
            Viewing the image fullscreen — tap anywhere or press Escape to
            close.
          </DialogDescription>
        </DialogHeader>

        {/* Tap anywhere closes — the whole surface is one big close target. */}
        <button
          type="button"
          aria-label="Close fullscreen image"
          onClick={onClose}
          className="absolute inset-0 flex cursor-zoom-out flex-col overflow-hidden outline-none"
        >
          <div className="relative flex-1 overflow-hidden p-4 sm:p-8">
            <div className="relative h-full w-full">
              {viewing && (
                <Image
                  src={viewing.src}
                  alt={viewing.alt}
                  fill
                  sizes="90vw"
                  priority
                  unoptimized={isDataUrl}
                  className="select-none object-contain"
                />
              )}
            </div>
          </div>

          <div className="shrink-0 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-1 text-center">
            {viewing?.caption && (
              <p className="font-display text-base italic text-white/90 sm:text-lg">
                {viewing.caption}
              </p>
            )}
            <p className="mt-1 text-xs text-white/45">
              Tap anywhere or press Esc to close
            </p>
          </div>
        </button>

        <DialogClose
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          aria-label="Close fullscreen image"
        >
          <span className="text-lg leading-none" aria-hidden>
            ✕
          </span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

/**
 * An image that opens the fullscreen viewer when pressed.
 * The button itself is the layout container (relative + fill image),
 * so pass sizing/aspect/rounding via `className`.
 */
export function PressableImage({
  src,
  alt,
  caption,
  sizes,
  priority,
  unoptimized,
  className,
  imageClassName,
  chipClassName,
  ariaLabel,
  children,
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
  /** Container classes — aspect ratio, dimensions, rounding (e.g. "aspect-[4/3]"). */
  className?: string;
  /** Extra classes for the img itself (object-cover, hover scale, grayscale…). */
  imageClassName?: string;
  /** Overrides for the expand-affordance chip. */
  chipClassName?: string;
  /** Accessible label — defaults to "View <alt> fullscreen". */
  ariaLabel?: string;
  /** Overlays rendered above the image (e.g. the Sold Out badge). */
  children?: React.ReactNode;
}) {
  const view = useImageViewer();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        view({ src, alt, caption });
      }}
      aria-label={ariaLabel ?? `View ${alt} fullscreen`}
      className={cn(
        "group/press relative block w-full cursor-zoom-in overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={cn("object-cover", imageClassName)}
      />

      {/* Expand affordance — appears on hover/focus; always on touch screens. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-2 bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/press:opacity-100 group-focus-visible/press:opacity-100 [@media(pointer:coarse)]:opacity-100",
          chipClassName
        )}
      >
        <Maximize2 className="h-4 w-4" aria-hidden />
      </span>

      {children}
    </button>
  );
}
