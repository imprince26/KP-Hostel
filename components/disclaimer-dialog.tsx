"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Info, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "kp_disclaimer_snoozed_until_v1";
const SNOOZE_DAYS = 7;
const SNOOZE_MS = SNOOZE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Tiny external store around one localStorage key.
 *
 * `useSyncExternalStore` is deliberate: reading localStorage in a mount effect
 * and calling `setState` is flagged by `react-hooks/set-state-in-effect`, and
 * it would also flash the dialog on every page load. With a store the server
 * (and the hydration pass) reports "already snoozed", then the client snapshot
 * takes over.
 */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function isSnoozed() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

function snooze() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    // Storage can be unavailable (private mode, quota). The dialog simply
    // reappears next visit, which is the safe behaviour for a disclaimer.
  }
  emit();
}

/**
 * Site-wide notice shown once per visit until the visitor chooses to snooze it
 * for a week. It replaces the old banner that lived in the website header.
 */
export function DisclaimerDialog() {
  const snoozed = useSyncExternalStore(subscribe, isSnoozed, () => true);
  const [dismissed, setDismissed] = useState(false);
  const [remember, setRemember] = useState(false);

  const open = !snoozed && !dismissed;

  const acknowledge = useCallback(() => {
    if (remember) snooze();
    setDismissed(true);
  }, [remember]);

  const handleOpenChange = (next: boolean) => {
    if (!next) acknowledge();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg leading-snug">
            This is not the official website
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            This website is an independent project built
            by <span className="font-medium text-foreground">Prince Patel</span>.
            It is not affiliated with, endorsed by, or operated by K.P.
            Vidhyarthi Bhavan, Ahmedabad.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Hostel details, photographs, announcements and the admission form on
            this site are for demonstration. They are not official notices and
            nothing submitted here is a real admission offer.
          </p>
          <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              For official information about admissions, fees or facilities,
              please contact the hostel office directly.
            </span>
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3">
          <Checkbox
            checked={remember}
            onCheckedChange={(value) => setRemember(value === true)}
            className="mt-0.5"
          />
          <span className="space-y-0.5">
            <Label className="cursor-pointer text-sm font-medium text-foreground">
              Do not show this again for {SNOOZE_DAYS} days
            </Label>
            <span className="block text-xs text-muted-foreground">
              The reminder returns after {SNOOZE_DAYS} days.
            </span>
          </span>
        </label>

        <DialogFooter className="gap-2 sm:items-center sm:justify-between">
          <Button
            asChild
            variant="link"
            className="h-auto justify-start p-0 text-sm text-muted-foreground"
          >
            <Link href="/disclaimer" onClick={acknowledge}>
              Read the full disclaimer
            </Link>
          </Button>
          <Button onClick={acknowledge}>I understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
