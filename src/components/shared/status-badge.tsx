import * as React from "react";
import { cn } from "@/lib/utils";
import { BadgeCheck, X } from "lucide-react";

type Variant = "neutral" | "success" | "danger" | "muted";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-secondary text-secondary-foreground border-transparent",
  success: "bg-success/15 text-success border-success/40",
  danger: "bg-destructive/15 text-destructive border-destructive/40",
  muted: "bg-muted text-muted-foreground border-border",
};

function BadgeShell({
  variant,
  className,
  children,
}: {
  variant: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function AvailabilityBadge({
  soldOut,
  className,
}: {
  soldOut: boolean;
  className?: string;
}) {
  // Icon-only status: green check (in stock) / red X (sold out).
  // The label stays for screen readers as sr-only text.
  return (
    <BadgeShell
      variant={soldOut ? "danger" : "success"}
      className={cn("px-1.5", className)}
    >
      {soldOut ? (
        <X className="h-4 w-4" aria-hidden strokeWidth={2.75} />
      ) : (
        <BadgeCheck className="h-4 w-4" aria-hidden />
      )}
      <span className="sr-only">{soldOut ? "Sold out" : "Available"}</span>
    </BadgeShell>
  );
}
