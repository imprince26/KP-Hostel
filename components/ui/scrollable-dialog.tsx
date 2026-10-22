"use client";

import { DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Dialog body whose content scrolls instead of growing.
 *
 * `DialogContent` is a `grid` in the base shadcn classes, and Tailwind emits
 * `.grid` after `.flex`, so a `flex flex-col` override on the same element
 * silently loses. Wrapping the content in a real flex column gives the
 * `ScrollArea` a definite height, which is what makes the viewport scroll.
 */
export function ScrollableDialog({
  className,
  bodyClassName,
  children,
}: {
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogContent className={cn("p-0 gap-0 overflow-hidden", className)}>
      <div className={cn("flex max-h-[85vh] min-h-0 flex-col", bodyClassName)}>
        {children}
      </div>
    </DialogContent>
  );
}

/**
 * Scrollable region inside a `ScrollableDialog`.
 *
 * `min-h-0` is required so the flex item is allowed to shrink below its
 * content size; without it the region grows and never scrolls.
 */
export function DialogScrollArea({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollArea className={cn("min-h-0 flex-1", className)}>{children}</ScrollArea>
  );
}
