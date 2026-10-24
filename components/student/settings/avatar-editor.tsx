"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function initialsOf(name?: string | null) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "S"
  );
}

/**
 * Profile photo with an edit button.
 *
 * The old screen exposed a raw `<input type="file">`, which looked different in
 * every browser and gave no preview. Here the avatar itself is the control: the
 * camera button opens a dialog where the student can preview, replace or remove
 * the photo before anything is saved.
 */
export function AvatarEditor({
  name,
  avatar,
  onUpdated,
}: {
  name?: string | null;
  avatar?: string | null;
  onUpdated: () => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [removeRequested, setRemoveRequested] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setPreview(avatar ?? null);
    setFile(null);
    setRemoveRequested(false);
    setError(null);
    setOpen(true);
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Choose a JPEG, PNG or WebP image.");
      return;
    }

    if (selected.size > MAX_BYTES) {
      setError("The image must be 5 MB or smaller.");
      return;
    }

    setError(null);
    setFile(selected);
    setRemoveRequested(false);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemove = () => {
    setFile(null);
    setRemoveRequested(true);
    setPreview(null);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      let nextAvatar: string | null = avatar ?? null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json().catch(() => null)) as
          | { url?: string; error?: string }
          | null;

        if (!response.ok || !payload?.url) {
          throw new ApiError(payload?.error ?? "Upload failed", response.status);
        }

        nextAvatar = payload.url;
      } else if (removeRequested) {
        nextAvatar = null;
      } else {
        setOpen(false);
        return;
      }

      await apiSend("/api/user/profile", "PATCH", {
        avatar: nextAvatar ?? "",
      });
      await onUpdated();

      toast.success(nextAvatar ? "Profile photo updated" : "Profile photo removed");
      setOpen(false);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not save the photo. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <Avatar className="size-24 border-4 border-card shadow-md">
            <AvatarImage src={avatar ?? undefined} alt={name ?? "Profile photo"} />
            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
              {initialsOf(name)}
            </AvatarFallback>
          </Avatar>

          <button
            type="button"
            onClick={openDialog}
            aria-label="Edit profile photo"
            title="Edit profile photo"
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden"
          >
            <Camera className="size-4" />
          </button>
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <p className="text-sm font-medium text-foreground">Profile photo</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A clear face photo helps the hostel office identify you. JPEG, PNG or
            WebP, up to 5 MB.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openDialog}
            className="mt-3"
          >
            <ImagePlus className="size-4" />
            {avatar ? "Change photo" : "Add photo"}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <ScrollableDialog className="max-w-md">
          <DialogHeader className="shrink-0 border-b border-border bg-muted/30 px-6 py-4">
            <DialogTitle>Profile photo</DialogTitle>
            <DialogDescription>
              Preview the photo before saving it to your account.
            </DialogDescription>
          </DialogHeader>

          <DialogScrollArea className="px-6 py-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="size-32 border-4 border-card shadow-md">
                <AvatarImage src={preview ?? undefined} alt="Photo preview" />
                <AvatarFallback className="bg-primary/10 text-3xl font-semibold text-primary">
                  {initialsOf(name)}
                </AvatarFallback>
              </Avatar>

              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleFile}
                className="sr-only"
              />

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  Choose image
                </Button>

                {preview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                )}
              </div>

              {error && (
                <p
                  role="alert"
                  className={cn(
                    "w-full rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                  )}
                >
                  {error}
                </p>
              )}
            </div>
          </DialogScrollArea>

          <DialogFooter className="shrink-0 border-t border-border bg-muted/20 px-6 py-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save photo
            </Button>
          </DialogFooter>
        </ScrollableDialog>
      </Dialog>
    </>
  );
}
