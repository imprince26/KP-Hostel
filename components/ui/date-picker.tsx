"use client";

import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const STORAGE_FORMAT = "yyyy-MM-dd";

/**
 * Date field built on the shadcn calendar.
 *
 * The value is a plain `yyyy-MM-dd` string so it can go straight into the API
 * without timezone drift, while the label is formatted for humans. A raw
 * `<input type="date">` renders differently in every browser and cannot be
 * styled with the design tokens, which is why the project uses this instead.
 */
export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  fromYear = 1940,
  toYear,
  invalid,
  className,
}: {
  id?: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  /** Last selectable year. Defaults to the current year. */
  toYear?: number;
  invalid?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const parsed = value ? parse(value, STORAGE_FORMAT, new Date()) : null;
  const selected = parsed && isValid(parsed) ? parsed : undefined;
  const lastYear = toYear ?? new Date().getFullYear();

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={cn(
              "h-10 w-full justify-start gap-2 text-left font-normal",
              !selected && "text-muted-foreground",
              selected && "pr-9",
              invalid && "border-destructive"
            )}
          >
            <CalendarIcon className="size-4 shrink-0" />
            <span className="truncate">
              {selected ? format(selected, "d MMM yyyy") : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              onChange(date ? format(date, STORAGE_FORMAT) : "");
              setOpen(false);
            }}
            disabled={(date) =>
              date > new Date() || date < new Date(fromYear, 0, 1)
            }
            autoFocus
            captionLayout="dropdown"
            startMonth={new Date(fromYear, 0)}
            endMonth={new Date(lastYear, 11)}
          />
        </PopoverContent>
      </Popover>

      {selected && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear date"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
