"use client";

import * as React from "react";
import { Filter, RotateCcw, Check } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileFilterDrawerProps {
  title?: string;
  description?: string;
  activeCount?: number;
  onReset?: () => void;
  children: React.ReactNode;
  triggerClassName?: string;
}

export function MobileFilterDrawer({
  title = "Filter & Refine",
  description = "Filter records by selecting criteria below",
  activeCount = 0,
  onReset,
  children,
  triggerClassName,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn(
            "relative flex items-center gap-2 border-border/80 bg-background hover:bg-muted/60 transition-colors shadow-xs h-10 px-3.5",
            activeCount > 0 && "border-primary/50 text-primary font-medium",
            triggerClassName
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge
              variant="default"
              className="ml-1 h-5 min-w-5 px-1.5 text-[11px] font-semibold rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh] outline-none">
        <DrawerHeader className="text-left px-5 pt-3 pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DrawerTitle className="text-lg font-bold font-display">{title}</DrawerTitle>
              {activeCount > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {activeCount} active
                </Badge>
              )}
            </div>
            {onReset && activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
          {description && (
            <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
              {description}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="px-5 py-4 overflow-y-auto space-y-4 max-h-[calc(85vh-160px)]">
          {children}
        </div>

        <DrawerFooter className="px-5 py-3 border-t border-border flex flex-row items-center gap-2 bg-muted/20">
          {onReset && (
            <Button
              variant="outline"
              size="default"
              onClick={onReset}
              className="flex-1 text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset All
            </Button>
          )}
          <DrawerClose asChild>
            <Button
              size="default"
              className="flex-1 text-sm font-medium"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Apply Filters
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
