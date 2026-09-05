"use client";

import * as React from "react";
import { CalendarClock, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BoothSettings } from "@/lib/types";
import { formatDate } from "@/lib/format";

type BoothState = "BEFORE" | "OPEN" | "CLOSED";

/**
 * Current time for ticking UIs — HYDRATION-SAFE.
 *
 * Returns `null` on the server AND on the client's first (hydration) render,
 * then the real Date one frame after mount. Rendering a live clock during
 * hydration makes the server text (rendered milliseconds earlier) differ from
 * the client text whenever a displayed unit ticks in between — React then
 * fails hydration and the page loses ALL interactivity (dead buttons).
 * `null` until mounted guarantees identical server/client output.
 */
function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function DiffParts({ target, now }: { target: Date; now: Date | null }) {
  const parts =
    now === null
      ? [
          { value: null, label: "DAYS" },
          { value: null, label: "HOURS" },
          { value: null, label: "MINUTES" },
        ]
      : (() => {
          const ms = Math.max(0, target.getTime() - now.getTime());
          const totalMinutes = Math.floor(ms / 60000);
          return [
            { value: Math.floor(totalMinutes / 1440), label: "DAYS" },
            { value: Math.floor((totalMinutes % 1440) / 60), label: "HOURS" },
            { value: totalMinutes % 60, label: "MINUTES" },
          ] as Array<{ value: number | null; label: string }>;
        })();
  return (
    <>
      {parts.map((p) => (
        <div
          key={p.label}
          className="flex min-w-[76px] flex-col items-center rounded-lg border border-border/70 bg-card px-3 py-2 shadow-sm"
        >
          <span
            className={cn(
              "font-display text-2xl font-bold tabular-nums leading-none text-foreground sm:text-3xl",
              p.value === null && "text-muted-foreground",
              p.value === 0 && "text-muted-foreground"
            )}
          >
            {p.value === null ? "--" : String(p.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            {p.label}
          </span>
        </div>
      ))}
    </>
  );
}

/** Booth availability countdown — highly visible, never distracting. */
export function Countdown({ settings }: { settings: BoothSettings }) {
  const now = useNow();
  const start = new Date(settings.startDate);
  const end = new Date(settings.endDate);

  // null until mounted (see useNow) — SSR and first client paint match exactly.
  const state: BoothState | null =
    now === null
      ? null
      : now < start
        ? "BEFORE"
        : now > end
          ? "CLOSED"
          : "OPEN";

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-3 rounded-xl border px-5 py-4 shadow-sm",
        state === "OPEN" && "border-success/40 bg-success/5",
        state === "BEFORE" && "border-warning/40 bg-warning/5",
        state === "CLOSED" && "border-border bg-muted/60",
        state === null && "border-border bg-card"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
        {state === "OPEN" && (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <span className="text-success">Booth Open · Closes in</span>
          </>
        )}
        {state === "BEFORE" && (
          <>
            <CalendarClock className="h-4 w-4 text-warning-foreground" aria-hidden />
            <span className="text-warning-foreground">Booth Opens In</span>
          </>
        )}
        {state === "CLOSED" && (
          <>
            <Coffee className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="text-muted-foreground">Booth Closed</span>
          </>
        )}
        {state === null && (
          <span className="text-muted-foreground">Booth Countdown</span>
        )}
      </div>

      {state === "CLOSED" ? (
        <p className="text-sm text-muted-foreground">
          Thank you for visiting {settings.boothName}. See you next event!
        </p>
      ) : (
        <div className="flex items-stretch justify-center gap-2 sm:gap-3">
          <DiffParts target={state === "OPEN" ? end : start} now={now} />
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {formatDate(start)} – {formatDate(end)}
      </p>
    </div>
  );
}
