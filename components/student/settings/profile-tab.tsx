"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Save,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { SettingsSection } from "@/components/student/settings/settings-section";
import { AvatarEditor } from "@/components/student/settings/avatar-editor";
import { ApiError, apiSend } from "@/lib/api-client";
import type { ProfileRecord } from "@/lib/api-types";
import { queryKeys } from "@/hooks/use-data";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collegeName: string;
  course: string;
  year: string;
  guardianName: string;
  guardianPhone: string;
};

type FieldKey = keyof FormState;

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const PINCODE_PATTERN = /^\d{6}$/;

function toForm(profile: ProfileRecord): FormState {
  return {
    name: profile.name ?? "",
    phone: profile.phone ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
    bio: profile.bio ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    pincode: profile.pincode ?? "",
    collegeName: profile.collegeName ?? "",
    course: profile.course ?? "",
    year: profile.year ?? "",
    guardianName: profile.guardianName ?? "",
    guardianPhone: profile.guardianPhone ?? "",
  };
}

function validate(form: FormState) {
  const errors: Partial<Record<FieldKey, string>> = {};

  if (form.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }
  if (form.phone && !MOBILE_PATTERN.test(form.phone)) {
    errors.phone = "Enter a 10-digit mobile number.";
  }
  if (form.guardianPhone && !MOBILE_PATTERN.test(form.guardianPhone)) {
    errors.guardianPhone = "Enter a 10-digit mobile number.";
  }
  if (form.pincode && !PINCODE_PATTERN.test(form.pincode)) {
    errors.pincode = "Enter a 6-digit PIN code.";
  }
  if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
    errors.dateOfBirth = "Date of birth cannot be in the future.";
  }

  return errors;
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * The profile form.
 *
 * State starts from the fetched row and is only mounted once that row exists,
 * so the inputs never flash empty and there is no `useEffect` copying server
 * data into state.
 */
export function ProfileTab({
  profile,
}: {
  profile: ProfileRecord;
}) {
  const { update } = useSession();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>(() => toForm(profile));
  const [showErrors, setShowErrors] = useState(false);

  const baseline = useMemo(() => toForm(profile), [profile]);
  const errors = useMemo(() => validate(form), [form]);
  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(baseline),
    [form, baseline]
  );
  const hasErrors = Object.keys(errors).length > 0;

  const setField = (key: FieldKey, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const save = useMutation({
    mutationFn: () => {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value.trim()])
      );

      return apiSend("/api/user/profile", "PATCH", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.student.profile,
      });
      await update();
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not save your profile. Please try again."
      );
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowErrors(true);

    if (hasErrors) {
      toast.error("Check the highlighted fields before saving.");
      return;
    }

    save.mutate();
  };

  const visibleError = (key: FieldKey) =>
    showErrors ? errors[key] : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <SettingsSection
        icon={ImageIcon}
        title="Profile photo"
        description="This is shown in the portal and used by the hostel office for identification."
      >
        <AvatarEditor
          name={profile.name}
          avatar={profile.avatar ?? profile.image}
          onUpdated={async () => {
            await queryClient.invalidateQueries({
              queryKey: queryKeys.student.profile,
            });
            await update();
          }}
        />
      </SettingsSection>

      <SettingsSection
        icon={UserRound}
        title="Personal details"
        description="Keep these accurate: the office uses them for records and contact."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="name" error={visibleError("name")}>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              aria-invalid={Boolean(visibleError("name")) || undefined}
            />
          </Field>

          <Field
            label="Email address"
            htmlFor="email"
            hint="Contact the hostel office to change your email."
          >
            <Input
              id="email"
              value={profile.email ?? ""}
              readOnly
              disabled
              className="bg-muted/50"
            />
          </Field>

          <Field
            label="Mobile number"
            htmlFor="phone"
            error={visibleError("phone")}
            hint="10 digits, used for admission updates."
          >
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) =>
                setField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              inputMode="numeric"
              autoComplete="tel-national"
              aria-invalid={Boolean(visibleError("phone")) || undefined}
            />
          </Field>

          <Field
            label="Date of birth"
            htmlFor="dateOfBirth"
            error={visibleError("dateOfBirth")}
          >
            <DatePicker
              id="dateOfBirth"
              value={form.dateOfBirth}
              onChange={(value) => setField("dateOfBirth", value)}
              placeholder="Select your date of birth"
              invalid={Boolean(visibleError("dateOfBirth"))}
            />
          </Field>

          <Field
            label="About you"
            htmlFor="bio"
            className="sm:col-span-2"
            hint={`${form.bio.length}/500 characters`}
          >
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(event) => setField("bio", event.target.value.slice(0, 500))}
              placeholder="Optional: a short note about your studies or interests."
              rows={3}
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={MapPin}
        title="Address"
        description="Your permanent address, as it should appear on hostel records."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Address"
            htmlFor="address"
            className="sm:col-span-2"
            hint="House or flat, street, area."
          >
            <Textarea
              id="address"
              value={form.address}
              onChange={(event) => setField("address", event.target.value)}
              placeholder="House / flat, street, area"
              rows={2}
            />
          </Field>

          <Field label="City" htmlFor="city">
            <Input
              id="city"
              value={form.city}
              onChange={(event) => setField("city", event.target.value)}
              placeholder="Ahmedabad"
              autoComplete="address-level2"
            />
          </Field>

          <Field label="State" htmlFor="state">
            <Input
              id="state"
              value={form.state}
              onChange={(event) => setField("state", event.target.value)}
              placeholder="Gujarat"
              autoComplete="address-level1"
            />
          </Field>

          <Field label="PIN code" htmlFor="pincode" error={visibleError("pincode")}>
            <Input
              id="pincode"
              value={form.pincode}
              onChange={(event) =>
                setField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="380001"
              inputMode="numeric"
              autoComplete="postal-code"
              aria-invalid={Boolean(visibleError("pincode")) || undefined}
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={GraduationCap}
        title="College & course"
        description="Your current study details, used to verify student status."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="College name" htmlFor="collegeName" className="sm:col-span-2">
            <Input
              id="collegeName"
              value={form.collegeName}
              onChange={(event) => setField("collegeName", event.target.value)}
              placeholder="Name of your college or institute"
            />
          </Field>

          <Field label="Course" htmlFor="course">
            <Input
              id="course"
              value={form.course}
              onChange={(event) => setField("course", event.target.value)}
              placeholder="e.g. B.Tech Computer Engineering"
            />
          </Field>

          <Field label="Year of study" htmlFor="year">
            <Input
              id="year"
              value={form.year}
              onChange={(event) => setField("year", event.target.value)}
              placeholder="e.g. 2nd year"
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection
        icon={Users}
        title="Guardian details"
        description="Who the hostel should contact in an emergency."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Guardian name" htmlFor="guardianName">
            <Input
              id="guardianName"
              value={form.guardianName}
              onChange={(event) => setField("guardianName", event.target.value)}
              placeholder="Guardian's full name"
            />
          </Field>

          <Field
            label="Guardian mobile"
            htmlFor="guardianPhone"
            error={visibleError("guardianPhone")}
          >
            <Input
              id="guardianPhone"
              value={form.guardianPhone}
              onChange={(event) =>
                setField(
                  "guardianPhone",
                  event.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              placeholder="9876543210"
              inputMode="numeric"
              aria-invalid={Boolean(visibleError("guardianPhone")) || undefined}
            />
          </Field>
        </div>
      </SettingsSection>

      {/* Save bar: only appears once something actually changed. */}
      {dirty && (
        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            You have unsaved changes.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setForm(baseline);
                setShowErrors(false);
              }}
              disabled={save.isPending}
            >
              Discard
            </Button>
            <Button type="submit" size="sm" disabled={save.isPending}>
              {save.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save changes
            </Button>
          </div>
        </div>
      )}

      {!dirty && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" />
          Your details are up to date.
        </p>
      )}
    </form>
  );
}
