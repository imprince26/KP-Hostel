"use client";

import { useState } from "react";
import { Info, ExternalLink, X, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ProjectDisclaimerBanner() {
  const [showModal, setShowModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <aside aria-label="Project notice" className="relative z-50 bg-muted/95 border-b border-border text-foreground py-2 px-3 sm:px-4 text-xs">
        <div className="container max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <p className="truncate text-muted-foreground">
              <strong className="text-foreground font-medium">Notice:</strong> This website is an independent academic project and is <span className="underline decoration-dotted font-medium text-foreground">not affiliated with</span> K.P Vidhyarthi Bhavan, Ahmedabad.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="text-primary hover:underline font-semibold text-[11px] whitespace-nowrap cursor-pointer"
            >
              Read Disclaimer
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss banner"
              className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-muted-foreground/10 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <ShieldAlert className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">Independent Project Disclosure</span>
            </div>
            <DialogTitle className="text-xl font-bold">
              About This Website Project
            </DialogTitle>
            <DialogDescription className="text-sm pt-2 text-muted-foreground leading-relaxed space-y-3">
              <p>
                This website is an independent student academic and portfolio project created by <strong>Prince Patel</strong> to demonstrate modern full-stack web engineering, admission workflows, and student management systems
              </p>
              <p className="bg-muted p-3 rounded-lg border border-border text-foreground font-medium text-xs leading-relaxed">
                It is <strong>NOT</strong> the official website of Shree Kadva Patidar Vidhyarthi Bhavan (K.P Vidhyarthi Bhavan) in Ellisbridge, Ahmedabad, nor is it endorsed, authorized, or operated by the hostel administration.
              </p>
              <p>
                All student applications, notifications, and room allocations performed on this portal are demonstration prototypes. For official inquiries regarding the real hostel, please visit their physical office premises located in Ellisbridge, Ahmedabad.
              </p>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 pt-3 border-t border-border flex sm:justify-end items-center">
            <Button size="sm" onClick={() => setShowModal(false)}>
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
