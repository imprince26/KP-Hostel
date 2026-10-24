"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  Bell,
  FileText,
  Loader2,
  Receipt,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DialogScrollArea,
  ScrollableDialog,
} from "@/components/ui/scrollable-dialog";
import { ApiError, apiSend } from "@/lib/api-client";

const DELETED_ITEMS = [
  { icon: UserRound, label: "Your profile, photo and contact details" },
  { icon: FileText, label: "Every admission application and its review history" },
  { icon: Receipt, label: "Your semester payment records" },
  { icon: Bell, label: "All notifications and portal activity" },
];

/**
 * Destructive confirmation for account deletion.
 *
 * Two deliberate steps are required: an explicit acknowledgement and typing the
 * word DELETE. A single mis-click cannot wipe an admission record, and the
 * dialog spells out exactly what disappears before anything is sent.
 */
export function DeleteAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const canDelete = acknowledged && confirmation.trim().toUpperCase() === "DELETE";

  const removeAccount = useMutation({
    mutationFn: () => apiSend("/api/user/delete", "DELETE"),
    onSuccess: async () => {
      toast.success("Your account has been deleted.");
      await signOut({ callbackUrl: "/" });
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not delete your account. Please try again."
      );
    },
  });

  const reset = () => {
    setAcknowledged(false);
    setConfirmation("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (removeAccount.isPending) return;
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <ScrollableDialog className="max-w-lg">
        <DialogHeader className="shrink-0 border-b border-destructive/20 bg-destructive/5 px-6 py-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </span>
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete your account
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            This permanently removes your account and every record attached to
            it. It cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogScrollArea className="px-6 py-5">
          <div className="space-y-5">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                The following will be deleted
              </p>
              <ul className="mt-2 space-y-1.5">
                {DELETED_ITEMS.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <item.icon className="mt-0.5 size-4 shrink-0 text-destructive/70" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Before you continue</p>
              <p>
                Save anything you need, such as your application numbers and
                payment receipts. If you only want to cancel an application or
                leave the hostel, contact the office instead — that keeps your
                admission record intact.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
              <Checkbox
                id="acknowledge-deletion"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="acknowledge-deletion"
                className="cursor-pointer text-sm font-normal leading-relaxed text-foreground"
              >
                I understand that my account and all related data will be
                permanently deleted.
              </Label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delete-confirmation">
                Type <span className="font-mono font-semibold">DELETE</span> to
                confirm
              </Label>
              <Input
                id="delete-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="DELETE"
                autoComplete="off"
                disabled={removeAccount.isPending}
                aria-invalid={
                  confirmation.length > 0 && !canDelete ? true : undefined
                }
              />
            </div>
          </div>
        </DialogScrollArea>

        <DialogFooter className="shrink-0 border-t border-border bg-muted/20 px-6 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={removeAccount.isPending}
          >
            Keep my account
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeAccount.mutate()}
            disabled={!canDelete || removeAccount.isPending}
          >
            {removeAccount.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete permanently
          </Button>
        </DialogFooter>
      </ScrollableDialog>
    </Dialog>
  );
}
