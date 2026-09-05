import * as React from "react";
import { cn } from "@/lib/utils";
import { BadgeCheck, CircleAlert } from "lucide-react";

type Variant = "neutral" | "success" | "muted";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-secondary text-secondary-foreground border-transparent",
  success: "bg-success/15 text-success border-success/40",
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
  return (
    <BadgeShell variant={soldOut ? "muted" : "success"} className={className}>
      {soldOut ? (
        <CircleAlert className="h-3 w-3" aria-hidden />
      ) : (
        <BadgeCheck className="h-3 w-3" aria-hidden />
      )}
      {soldOut ? "SOLD OUT" : "AVAILABLE"}
    </BadgeShell>
  );
}
