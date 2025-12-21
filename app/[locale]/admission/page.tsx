"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { motion } from "motion/react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, AlertCircle, Upload, User, Phone, Book, MapPin, FileText, Home, Users, CheckCircle2, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Enhanced validation schema with all required fields
const admissionSchema = z.object({
  // Personal Details
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], { message: "Gender is required" }),
  caste: z.string().min(2, "Caste is required"),
  subCaste: z.string().min(2, "Sub-caste is required"),
  
  // Contact Information
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  
  // Address
  address: z.string().min(10, "Complete address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  
  // Educational Details
  collegeName: z.string().min(3, "College name is required"),
  course: z.string().min(2, "Course is required"),
  year: z.enum(["1", "2", "3", "4"], { message: "Academic year is required" }),
  studentId: z.string().optional(),
  
  // Guardian Details
  guardianName: z.string().min(3, "Guardian name is required"),
  guardianPhone: z.string().regex(/^\d{10}$/, "Guardian phone must be 10 digits"),
  guardianRelation: z.string().min(2, "Relation is required"),
  
  // Hostel Preferences
  blockPreference: z.enum(["A", "B", "C", "D"], { message: "Block preference is required" }).optional(),

  // Photo Upload
  passportPhoto: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export default function AdmissionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      dateOfBirth: session?.user?.dateOfBirth || "",
      gender: (session?.user?.gender as "male" | "female" | "other") || undefined,
      caste: session?.user?.caste || "",
      subCaste: session?.user?.subCaste || "",
      address: session?.user?.address || "",
      city: session?.user?.city || "",
      state: session?.user?.state || "",
      pincode: session?.user?.pincode || "",
      guardianName: session?.user?.guardianName || "",
      guardianPhone: session?.user?.guardianPhone || "",
      collegeName: session?.user?.collegeName || "",
      course: session?.user?.course || "",
      year: (session?.user?.year as "1" | "2" | "3" | "4") || undefined,
    },
  });

  const passportPhoto = watch("passportPhoto");

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingPhoto(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload photo");
      }

      const data = await res.json();
      setValue("passportPhoto", data.url);
      setPhotoPreview(data.url);
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Submit form
  const onSubmit = async (data: AdmissionFormData) => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Validate passport photo
    if (!data.passportPhoto) {
      setSubmitError("Please upload a passport size photo");
      toast.error("Please upload a passport size photo");
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/admission/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setApplicationNumber(result.applicationNumber);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to submit application");
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step navigation
  const nextStep = async () => {
    let fieldsToValidate: (keyof AdmissionFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["fullName", "dateOfBirth", "gender", "caste", "subCaste"];
        break;
      case 2:
        fieldsToValidate = ["email", "phone", "address", "city", "state", "pincode"];
        break;
      case 3:
        fieldsToValidate = ["collegeName", "course", "year"];
        break;
      case 4:
        fieldsToValidate = ["guardianName", "guardianPhone", "guardianRelation"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { number: 1, title: "Personal Details", icon: User },
    { number: 2, title: "Contact & Address", icon: MapPin },
    { number: 3, title: "Educational Info", icon: Book },
    { number: 4, title: "Guardian Details", icon: Users },
    { number: 5, title: "Photo Upload", icon: Upload },
  ];

  // Success screen
  if (applicationNumber) {
    return (
      <div className="min-h-screen bg-linear-to-br from-muted via-background to-muted pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 text-white p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl"
                  >
                    <Check className="w-14 h-14 text-green-500" />
                  </motion.div>
                  <h1 className="text-4xl font-bold mb-3">Application Submitted!</h1>
                  <p className="text-green-50 text-xl">Your hostel admission application has been successfully submitted</p>
                </div>
              </div>
              
            <CardContent className="p-8 sm:p-12 space-y-6">
              <div className="bg-linear-to-r from-primary/5 to-primary/10 border-l-4 border-primary rounded-xl p-6 shadow-sm">
                <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Your Application Number</p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p className="text-3xl sm:text-4xl font-bold text-primary tracking-wider font-mono">{applicationNumber}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 hover:bg-primary/5"
                    onClick={() => {
                      navigator.clipboard.writeText(applicationNumber);
                      toast.success("Copied to clipboard!");
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </Button>
                </div>
              </div>

              <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong className="block mb-2 text-base font-semibold">Important: Save Your Application Number</strong>
                  <p className="text-sm leading-relaxed">Please note down this application number for future reference. You will need it to track your application status.</p>
                </AlertDescription>
              </Alert>

              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-xl text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Next Steps
                </h3>
                <ol className="space-y-3">
                  {[
                    "Check your email for application confirmation and further instructions",
                    "Visit the hostel office with required documents (College ID, Aadhar Card, Photos)",
                    "Complete the offline admission formalities at the office",
                    "Track your application status in the student dashboard",
                    "Wait for approval notification from the admin team"
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push("/student/dashboard")}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 h-12 text-base"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/student/applications")}
                  variant="outline"
                  className="flex-1 h-12 text-base"
                >
                  View My Applications
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Application form
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Header with proper top padding */}
      <div className="relative bg-linear-to-r from-orange-500 via-red-500 to-pink-500 text-white pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl">
          <div className="w-full h-full bg-linear-to-br from-primary/40 to-primary" />
        </div>
        
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-background/20 backdrop-blur-sm mb-6 shadow-xl text-primary-foreground">
              <FileText className="w-8 sm:w-10 h-8 sm:h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-primary-foreground">Admission Application</h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Complete your hostel admission application in 5 easy steps
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-primary-foreground">
              <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Quick Process</span>
              </div>
              <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">5 Minutes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form Container */}
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!session && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Alert className="border-destructive/50 bg-destructive/10 shadow-sm">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-destructive">
                  Please{" "}
                  <Button
                    variant="link"
                    className="px-1 h-auto text-destructive font-semibold underline"
                    onClick={() => router.push("/auth/login")}
                  >
                    login
                  </Button>{" "}
                  to submit your application.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

        {/* Progress Steps */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    {/* Circle */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative z-10",
                        isActive && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110",
                        isCompleted && "border-primary bg-primary text-primary-foreground shadow-md",
                        !isActive && !isCompleted && "border-muted bg-card text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                    </motion.div>
                    
                    {/* Label */}
                    <p
                      className={cn(
                        "mt-3 text-xs sm:text-sm font-medium text-center transition-colors hidden sm:block",
                        isActive && "text-primary",
                        isCompleted && "text-primary",
                        !isActive && !isCompleted && "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-6 sm:top-7 left-[calc(50%+24px)] sm:left-[calc(50%+28px)] w-[calc(100%-48px)] sm:w-[calc(100%-56px)] h-0.5 -z-10">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          currentStep > step.number ? "bg-primary" : "bg-muted"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Application Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
              <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Personal Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Please provide your personal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 bg-card">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-medium">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="Enter your full name"
                      className={cn("h-11", errors.fullName && "border-destructive")}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-base font-medium">Date of Birth *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground",
                            errors.dateOfBirth && "border-destructive"
                          )}
                          suppressHydrationWarning={true}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateOfBirth}
                          onSelect={(date) => {
                            setDateOfBirth(date);
                            if (date && date instanceof Date && !isNaN(date.getTime())) {
                              setValue("dateOfBirth", format(date, "yyyy-MM-dd"));
                            } else {
                              setValue("dateOfBirth", "");
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          autoFocus
                          captionLayout="dropdown"
                          startMonth={new Date(1990, 0)}
                          endMonth={new Date( 2015 , 0)}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.dateOfBirth && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="caste" className="text-base font-medium">Caste *</Label>
                    <Input
                      id="caste"
                      {...register("caste")}
                      placeholder="Enter caste"
                      className={cn("h-11", errors.caste && "border-destructive")}
                    />
                    {errors.caste && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.caste.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCaste" className="text-base font-medium">Sub-Caste *</Label>
                    <Input
                      id="subCaste"
                      {...register("subCaste")}
                      placeholder="Enter sub-caste"
                      className={cn("h-11", errors.subCaste && "border-destructive")}
                    />
                    {errors.subCaste && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.subCaste.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg">
                            <MapPin className="w-6 h-6" />
                    </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Contact & Address</CardTitle>
                    <CardDescription className="text-muted-foreground">Provide your contact details and address</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 bg-card">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      className={cn("h-11", errors.email && "border-destructive")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={cn("h-11", errors.phone && "border-destructive")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium">Complete Address *</Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="House/Flat No., Street, Area, Landmark"
                    rows={3}
                    className={cn(errors.address && "border-destructive")}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-base font-medium">City *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="City"
                      className={cn("h-11", errors.city && "border-destructive")}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-base font-medium">State *</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="State"
                      className={cn("h-11", errors.state && "border-destructive")}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-base font-medium">Pincode *</Label>
                    <Input
                      id="pincode"
                      {...register("pincode")}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={cn("h-11", errors.pincode && "border-destructive")}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Educational Information */}
          {currentStep === 3 && (
            <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
              <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg">
                    <Book className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Educational Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Tell us about your academic background</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 bg-card">
                <div className="space-y-2">
                  <Label htmlFor="collegeName" className="text-base font-medium">College/University Name *</Label>
                  <Input
                    id="collegeName"
                    {...register("collegeName")}
                    placeholder="Enter your college or university name"
                    className={cn("h-11", errors.collegeName && "border-destructive")}
                  />
                  {errors.collegeName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.collegeName.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-base font-medium">Course/Degree *</Label>
                    <Input
                      id="course"
                      {...register("course")}
                      placeholder="e.g., B.Tech, B.Com, M.Sc, MBA"
                      className={cn("h-11", errors.course && "border-destructive")}
                    />
                    {errors.course && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.course.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-base font-medium">Current Year *</Label>
                    <Select onValueChange={(value) => setValue("year", value as "1" | "2" | "3" | "4")}>
                      <SelectTrigger className={cn("h-11", errors.year && "border-destructive")} suppressHydrationWarning={true}>
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.year.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-base font-medium">Student ID (Optional)</Label>
                  <Input
                    id="studentId"
                    {...register("studentId")}
                    placeholder="Your college student ID number"
                    className="h-11"
                  />
                  <p className="text-sm text-muted-foreground">If you have a student ID, please provide it</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Guardian Information */}
          {currentStep === 4 && (
            <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Guardian Information</CardTitle>
                    <CardDescription className="text-muted-foreground">Emergency contact details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 bg-card">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName" className="text-base font-medium">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      {...register("guardianName")}
                      placeholder="Guardian's full name"
                      className={cn("h-11", errors.guardianName && "border-destructive")}
                    />
                    {errors.guardianName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.guardianName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone" className="text-base font-medium">Guardian Phone *</Label>
                    <Input
                      id="guardianPhone"
                      {...register("guardianPhone")}
                      placeholder="10-digit number"
                      maxLength={10}
                      className={cn("h-11", errors.guardianPhone && "border-destructive")}
                    />
                    {errors.guardianPhone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.guardianPhone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianRelation" className="text-base font-medium">Relation *</Label>
                    <Input
                      id="guardianRelation"
                      {...register("guardianRelation")}
                      placeholder="e.g., Father, Mother, Uncle"
                      className={cn("h-11", errors.guardianRelation && "border-destructive")}
                    />
                    {errors.guardianRelation && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.guardianRelation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockPreference" className="text-base font-medium">Hostel Block Preference (Optional)</Label>
                  <Select onValueChange={(value) => setValue("blockPreference", value as "A" | "B" | "C" | "D")}>
                    <SelectTrigger className={cn("h-11", errors.blockPreference && "border-destructive")} suppressHydrationWarning={true}>
                      <SelectValue placeholder="Select block preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Block A</SelectItem>
                      <SelectItem value="B">Block B</SelectItem>
                      <SelectItem value="C">Block C</SelectItem>
                      <SelectItem value="D">Block D</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.blockPreference && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.blockPreference.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Subject to availability</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Photo Upload */}
          {currentStep === 5 && (
            <Card className="shadow-xl border-t-4 border-t-primary overflow-hidden">
              <CardHeader className="bg-linear-to-r from-primary/10 to-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Passport Size Photo</CardTitle>
                    <CardDescription className="text-muted-foreground">Upload a recent passport size photograph</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 bg-card">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="photo" className="text-base font-medium">Upload Photo * (Max 5MB)</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                      className={cn("h-11 cursor-pointer", errors.passportPhoto && "border-destructive")}
                    />
                    {errors.passportPhoto && (
                      <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        {errors.passportPhoto.message}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">Accepted formats: JPG, PNG, JPEG (Max size: 5MB)</p>
                  </div>

                  {isUploadingPhoto && (
                    <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                      <span className="text-primary font-medium">Uploading photo...</span>
                    </div>
                  )}

                  {photoPreview && !isUploadingPhoto && (
                    <div className="flex items-center gap-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover border-4 border-green-500 shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <Check className="w-5 h-5" />
                          <span className="font-semibold text-lg">Photo uploaded successfully!</span>
                        </div>
                        <p className="text-sm text-gray-600">Your photo has been uploaded and will be used for your application.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Alert */}
          {submitError && (
            <Alert variant="destructive" className="shadow-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="h-12 px-8"
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto h-12 px-8 bg-primary hover:bg-primary/90"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || isUploadingPhoto || !session}
                className="ml-auto h-12 px-8 bg-primary hover:bg-primary/90 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at <a href="mailto:info@kpbhavan.org" className="text-primary hover:underline">info@kpbhavan.org</a> or call +91 79 2644 1234
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
