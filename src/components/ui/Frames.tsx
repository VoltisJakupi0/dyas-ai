import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function BracketFrame({
  children,
  className,
  tick = "stroke-3",
  lines = "lg",
  hideBottom = false,
}: {
  children: ReactNode;
  className?: string;
  tick?: "stroke-1" | "stroke-3";
  lines?: "lg" | "force";
  hideBottom?: boolean;
}) {
  const tickClass = tick === "stroke-1" ? "text-stroke-1" : "text-stroke-3";
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between",
        lines === "force"
          ? "square-bracket--lines-lg square-bracket--lines-force-lg"
          : "square-bracket--lines-lg",
        className,
      )}
    >
      <div className={cn("square-bracket-border-t", tickClass)} />
      {children}
      {!hideBottom && <div className={cn("square-bracket-border-b", tickClass)} />}
    </div>
  );
}

export function CornerFrame({
  children,
  className,
  tick = "text-stroke-3",
}: {
  children: ReactNode;
  className?: string;
  tick?: string;
}) {
  return (
    <div className={cn("relative flex flex-col justify-between", className)}>
      <div className={cn("square-corner-border-t", tick)}>
        <div className="square-corner-tl" />
        <div className="square-corner-tr" />
      </div>
      {children}
      <div className={cn("square-corner-border-b", tick)}>
        <div className="square-corner-bl" />
        <div className="square-corner-br" />
      </div>
    </div>
  );
}
