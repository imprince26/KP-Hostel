"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  GraduationCap,
  Info,
  Loader2,
  MapPin,
  ShieldCheck,
  UploadCloud,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* schema */

const admissionSchema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { message: "Select a gender" }),
  caste: z.string().min(2, "Caste is required"),
  subCaste: z.string().min(2, "Sub-caste is required"),

  email: z.email("Enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),

  address: z.string().min(10, "Enter your complete address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode"),

  collegeName: z.string().min(3, "College name is required"),
  course: z.string().min(2, "Course is required"),
  year: z.enum(["1", "2", "3", "4"], { message: "Select your year of study" }),
  studentId: z.string().optional(),

  guardianName: z.string().min(3, "Guardian name is required"),
  guardianPhone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  guardianRelation: z.string().min(2, "Relationship is required"),

  blockPreference: z.enum(["A", "B", "C", "D"]).optional(),
  passportPhoto: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;
type RequiredField = keyof AdmissionFormData;

const PROGRESS_SECTIONS: { label: string; fields: RequiredField[] }[] = [
  {
    label: "Personal details",
    fields: ["fullName", "dateOfBirth", "gender", "caste", "subCaste"],
  },
  {
    label: "Contact & address",
    fields: ["email", "phone", "address", "city", "state", "pincode"],
  },
  {
    label: "Education",
    fields: ["collegeName", "course", "year"],
  },
  {
    label: "Guardian",
    fields: ["guardianName", "guardianPhone", "guardianRelation"],
  },
  {
    label: "Passport photo",
    fields: ["passportPhoto"],
  },
];

const BLOCKS = ["A", "B", "C", "D"] as const;

const NEXT_STEPS = [
  "Check your email for the submission confirmation.",
  "Visit the hostel office with your college ID, Aadhaar card and photographs.",
  "The office reviews your application and records the decision on your dashboard.",
  "Once approved, complete the admission formalities and pay the fees at the office.",
];

/* small parts */

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="size-3.5 shrink-0" />
      {message}
    </p>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      <FieldError message={error} />
    </div>
  );
}

function SectionCard({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24 overflow-hidden border-border/70 shadow-xs">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-5 sm:px-6">{children}</CardContent>
    </Card>
  );
}

function FormSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 pb-16 pt-28 md:pt-32">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    </div>
  );
}

/* page */

export default function AdmissionPage() {
  const { status } = useSession();

  if (status === "loading") {
    return <FormSkeleton />;
  }

  return <AdmissionForm />;
}

function AdmissionForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "en";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      fullName: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      phone: session?.user?.phone ?? "",
      dateOfBirth: session?.user?.dateOfBirth ?? "",
      gender: (session?.user?.gender as AdmissionFormData["gender"]) ?? undefined,
      caste: session?.user?.caste ?? "",
      subCaste: session?.user?.subCaste ?? "",
      address: session?.user?.address ?? "",
      city: session?.user?.city ?? "",
      state: session?.user?.state ?? "",
      pincode: session?.user?.pincode ?? "",
      guardianName: session?.user?.guardianName ?? "",
      guardianPhone: session?.user?.guardianPhone ?? "",
      collegeName: session?.user?.collegeName ?? "",
      course: session?.user?.course ?? "",
      year: (session?.user?.year as AdmissionFormData["year"]) ?? undefined,
      studentId: "",
      blockPreference: undefined,
      passportPhoto: "",
    },
  });

  const values = watch();

  const isFilled = (field: RequiredField) => {
    const value = values[field];
    return typeof value === "string" && value.trim().length > 0;
  };

  const totalFields = PROGRESS_SECTIONS.reduce(
    (total, section) => total + section.fields.length,
    0
  );
  const completedFields = PROGRESS_SECTIONS.reduce(
    (total, section) => total + section.fields.filter(isFilled).length,
    0
  );
  const percent = Math.round((completedFields / totalFields) * 100);

  const handlePhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file (JPG or PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("The photo must be smaller than 5 MB");
      return;
    }

    setIsUploadingPhoto(true);
    setPhotoError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = (await response.json()) as { url?: string };
      if (!data.url) throw new Error("Upload failed");

      setValue("passportPhoto", data.url, { shouldValidate: true });
      setPhotoPreview(data.url);
      toast.success("Photo uploaded");
    } catch {
      toast.error("Could not upload the photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (data: AdmissionFormData) => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (!data.passportPhoto) {
      setPhotoError("A passport size photo is required");
      document
        .getElementById("photo")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/admission/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        applicationNumber?: string;
        error?: string;
      };

      if (!response.ok || !result.applicationNumber) {
        throw new Error(result.error ?? "Could not submit the application");
      }

      setApplicationNumber(result.applicationNumber);
      toast.success("Application submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not submit the application";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* success screen */

  if (applicationNumber) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto max-w-3xl px-4 pb-16 pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="border-b border-border bg-primary/5 px-6 py-10 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Check className="size-8" />
              </span>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Application submitted
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Your hostel admission application has reached the hostel office.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Application number
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-2xl font-bold tracking-wide text-primary sm:text-3xl">
                    {applicationNumber}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(applicationNumber);
                      toast.success("Application number copied");
                    }}
                  >
                    <Copy className="size-4" />
                    Copy
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Keep this number safe. You will need it to track your
                  application and at the hostel office.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  What happens next
                </h2>
                <ol className="mt-3 space-y-3">
                  {NEXT_STEPS.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed text-muted-foreground">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 flex-1">
                  <Link href="/student/applications">
                    Track my application
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 flex-1">
                  <Link href="/student/dashboard">Go to dashboard</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* form */

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto max-w-6xl px-4 pb-10 pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <GraduationCap className="size-3.5" />
              Hostel admissions
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Apply for{" "}
              <span className="font-serif italic text-primary">admission</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              One form, about five minutes. Fill in your details, upload a
              passport photo and submit. The hostel office reviews every
              application.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: Clock, label: "About 5 minutes" },
                { icon: ShieldCheck, label: "Reviewed by the hostel office" },
                { icon: CheckCircle2, label: "Track it on your dashboard" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <item.icon className="size-3.5 text-primary" />
                  {item.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
          <div className="min-w-0 space-y-5">
            {/* Mobile progress */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-xs lg:hidden">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  Application progress
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {completedFields}/{totalFields}
                </span>
              </div>
              <Progress value={percent} className="mt-2 h-2" />
            </div>

            {!session && (
              <Alert className="border-destructive/30 bg-destructive/5">
                <AlertCircle className="size-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  <span className="flex flex-wrap items-center gap-1">
                    Sign in to submit this application.
                    <Button
                      variant="link"
                      className="h-auto p-0 font-semibold text-destructive underline"
                      onClick={() => router.push("/auth/login")}
                    >
                      Sign in
                    </Button>
                  </span>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <SectionCard
                id="personal"
                icon={UserRound}
                title="Personal details"
                description="As printed on your college documents."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    htmlFor="fullName"
                    required
                    error={errors.fullName?.message}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="fullName"
                      autoComplete="name"
                      placeholder="Your full name"
                      className={cn("h-11", errors.fullName && "border-destructive")}
                      {...register("fullName")}
                    />
                  </Field>

                  <Field
                    label="Date of birth"
                    htmlFor="dateOfBirth"
                    required
                    error={errors.dateOfBirth?.message}
                  >
                    <DatePicker
                      id="dateOfBirth"
                      value={values.dateOfBirth}
                      onChange={(value) =>
                        setValue("dateOfBirth", value, { shouldValidate: true })
                      }
                      placeholder="Select date of birth"
                      fromYear={1990}
                      toYear={2015}
                      invalid={Boolean(errors.dateOfBirth)}
                      className="[&>button:first-child]:h-11"
                    />
                  </Field>

                  <Field
                    label="Gender"
                    htmlFor="gender"
                    required
                    error={errors.gender?.message}
                  >
                    <Select
                      defaultValue={values.gender}
                      onValueChange={(value) =>
                        setValue("gender", value as AdmissionFormData["gender"], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="gender"
                        className={cn("h-11", errors.gender && "border-destructive")}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    label="Caste"
                    htmlFor="caste"
                    required
                    error={errors.caste?.message}
                  >
                    <Input
                      id="caste"
                      placeholder="Enter caste"
                      className={cn("h-11", errors.caste && "border-destructive")}
                      {...register("caste")}
                    />
                  </Field>

                  <Field
                    label="Sub-caste"
                    htmlFor="subCaste"
                    required
                    error={errors.subCaste?.message}
                  >
                    <Input
                      id="subCaste"
                      placeholder="Enter sub-caste"
                      className={cn("h-11", errors.subCaste && "border-destructive")}
                      {...register("subCaste")}
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard
                id="contact"
                icon={MapPin}
                title="Contact & address"
                description="How the hostel office can reach you."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Email address"
                    htmlFor="email"
                    required
                    error={errors.email?.message}
                  >
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={cn("h-11", errors.email && "border-destructive")}
                      {...register("email")}
                    />
                  </Field>

                  <Field
                    label="Phone number"
                    htmlFor="phone"
                    required
                    error={errors.phone?.message}
                    hint="10-digit mobile number"
                  >
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      className={cn("h-11", errors.phone && "border-destructive")}
                      {...register("phone")}
                    />
                  </Field>

                  <Field
                    label="Complete address"
                    htmlFor="address"
                    required
                    error={errors.address?.message}
                    className="sm:col-span-2"
                  >
                    <Textarea
                      id="address"
                      rows={3}
                      placeholder="House / flat number, street, area, landmark"
                      className={cn(errors.address && "border-destructive")}
                      {...register("address")}
                    />
                  </Field>

                  <Field
                    label="City"
                    htmlFor="city"
                    required
                    error={errors.city?.message}
                  >
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      placeholder="Ahmedabad"
                      className={cn("h-11", errors.city && "border-destructive")}
                      {...register("city")}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-5">
                    <Field
                      label="State"
                      htmlFor="state"
                      required
                      error={errors.state?.message}
                    >
                      <Input
                        id="state"
                        autoComplete="address-level1"
                        placeholder="Gujarat"
                        className={cn("h-11", errors.state && "border-destructive")}
                        {...register("state")}
                      />
                    </Field>

                    <Field
                      label="Pincode"
                      htmlFor="pincode"
                      required
                      error={errors.pincode?.message}
                    >
                      <Input
                        id="pincode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        placeholder="380001"
                        className={cn("h-11", errors.pincode && "border-destructive")}
                        {...register("pincode")}
                      />
                    </Field>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                id="education"
                icon={BookOpen}
                title="Education"
                description="Your current college and course."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="College / university"
                    htmlFor="collegeName"
                    required
                    error={errors.collegeName?.message}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="collegeName"
                      placeholder="Name of your college or university"
                      className={cn(
                        "h-11",
                        errors.collegeName && "border-destructive"
                      )}
                      {...register("collegeName")}
                    />
                  </Field>

                  <Field
                    label="Course / degree"
                    htmlFor="course"
                    required
                    error={errors.course?.message}
                  >
                    <Input
                      id="course"
                      placeholder="e.g. B.Tech, B.Com, M.Sc"
                      className={cn("h-11", errors.course && "border-destructive")}
                      {...register("course")}
                    />
                  </Field>

                  <Field
                    label="Year of study"
                    htmlFor="year"
                    required
                    error={errors.year?.message}
                  >
                    <Select
                      defaultValue={values.year}
                      onValueChange={(value) =>
                        setValue("year", value as AdmissionFormData["year"], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="year"
                        className={cn("h-11", errors.year && "border-destructive")}
                      >
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st year</SelectItem>
                        <SelectItem value="2">2nd year</SelectItem>
                        <SelectItem value="3">3rd year</SelectItem>
                        <SelectItem value="4">4th year</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    label="Student ID"
                    htmlFor="studentId"
                    hint="Optional"
                    className="sm:col-span-2"
                  >
                    <Input
                      id="studentId"
                      placeholder="Your college student ID number"
                      className="h-11"
                      {...register("studentId")}
                    />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard
                id="guardian"
                icon={Users}
                title="Guardian & preference"
                description="Emergency contact and your preferred block."
              >
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field
                    label="Guardian name"
                    htmlFor="guardianName"
                    required
                    error={errors.guardianName?.message}
                  >
                    <Input
                      id="guardianName"
                      placeholder="Guardian's full name"
                      className={cn(
                        "h-11",
                        errors.guardianName && "border-destructive"
                      )}
                      {...register("guardianName")}
                    />
                  </Field>

                  <Field
                    label="Guardian phone"
                    htmlFor="guardianPhone"
                    required
                    error={errors.guardianPhone?.message}
                  >
                    <Input
                      id="guardianPhone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      className={cn(
                        "h-11",
                        errors.guardianPhone && "border-destructive"
                      )}
                      {...register("guardianPhone")}
                    />
                  </Field>

                  <Field
                    label="Relationship"
                    htmlFor="guardianRelation"
                    required
                    error={errors.guardianRelation?.message}
                  >
                    <Input
                      id="guardianRelation"
                      placeholder="e.g. Father, Mother"
                      className={cn(
                        "h-11",
                        errors.guardianRelation && "border-destructive"
                      )}
                      {...register("guardianRelation")}
                    />
                  </Field>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Block preference
                  </Label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {BLOCKS.map((block) => {
                      const active = values.blockPreference === block;

                      return (
                        <button
                          key={block}
                          type="button"
                          aria-pressed={active}
                          onClick={() =>
                            setValue("blockPreference", active ? undefined : block, {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                              : "border-border text-foreground hover:border-primary/40 hover:bg-muted/50"
                          )}
                        >
                          Block {block}
                          {active ? (
                            <CheckCircle2 className="size-4" />
                          ) : (
                            <span className="size-4 rounded-full border border-border" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optional. Allotment depends on availability.
                  </p>
                </div>
              </SectionCard>

              <SectionCard
                id="photo"
                icon={UploadCloud}
                title="Passport photo"
                description="A recent photograph used on your admission record."
              >
                <input
                  ref={fileInputRef}
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploadingPhoto}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handlePhoto(file);
                  }}
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload passport photo"
                  onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                    const file = event.dataTransfer.files?.[0];
                    if (file) void handlePhoto(file);
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/40",
                    photoError && "border-destructive/60"
                  )}
                >
                  {photoPreview ? (
                    <>
                      {/* Cloudinary preview: next/image would need the upload
                          host in remotePatterns, so a plain img is used here. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreview}
                        alt="Uploaded passport photo"
                        className="size-28 rounded-lg border border-border object-cover shadow-sm"
                      />
                      <p className="text-sm font-medium text-foreground">
                        Photo uploaded
                      </p>
                      <span className="text-xs font-medium text-primary underline underline-offset-4">
                        Choose a different photo
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UploadCloud className="size-5" />
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        Drag a photo here, or browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or JPEG · maximum 5 MB
                      </p>
                    </>
                  )}

                  {isUploadingPhoto && (
                    <span className="flex items-center gap-2 text-xs font-medium text-primary">
                      <Loader2 className="size-3.5 animate-spin" />
                      Uploading...
                    </span>
                  )}
                </div>

                <FieldError message={photoError ?? undefined} />
              </SectionCard>

              {submitError && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <Card className="border-border/70 shadow-xs">
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                    <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p>
                      Submitting sends your application to the hostel office for
                      review. Final admission and fee payment are completed in
                      person at the office.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      {completedFields} of {totalFields} required details
                      completed
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isUploadingPhoto || !session}
                      className="h-11 w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="size-4" />
                          Submit application
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="hidden border-border/70 shadow-xs lg:block">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Application progress</CardTitle>
                <CardDescription className="text-xs">
                  {completedFields} of {totalFields} required details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-foreground">{percent}% complete</span>
                  </div>
                  <Progress value={percent} className="mt-2 h-2" />
                </div>

                <ul className="space-y-2.5">
                  {PROGRESS_SECTIONS.map((section) => {
                    const done = section.fields.every(isFilled);
                    const filled = section.fields.filter(isFilled).length;

                    return (
                      <li
                        key={section.label}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex size-5 items-center justify-center rounded-full border",
                              done
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground"
                            )}
                          >
                            {done ? (
                              <Check className="size-3" />
                            ) : (
                              <span className="size-1.5 rounded-full bg-current" />
                            )}
                          </span>
                          <span
                            className={cn(
                              done ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {section.label}
                          </span>
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {filled}/{section.fields.length}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
