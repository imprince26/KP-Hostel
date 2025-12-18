"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaGraduationCap,
  FaUserShield,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { admissionFormSchema, type AdmissionFormData } from "@/lib/validations/admission";
import { submitAdmissionApplication } from "./actions";

export default function AdmissionPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<{
    success: boolean;
    data?: { applicationNumber: string; otpCode: string };
    error?: string;
  } | null>(null);

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "male",
      phone: "",
      email: "",
      address: "",
      collegeName: "",
      course: "",
      year: "1",
      guardianName: "",
      guardianPhone: "",
    },
  });

  const selectedGender = form.watch("gender");

  async function onSubmit(data: AdmissionFormData) {
    setIsSubmitting(true);
    try {
      const response = await submitAdmissionApplication(data);
      setResult(response);
      
      if (response.success) {
        form.reset();
      }
    } catch (error) {
      setResult({
        success: false,
        error: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result?.success && result.data) {
    return (
      <div className="min-h-screen bg-slate-50 overflow-x-hidden">
        <div className="container px-4 pt-32 pb-16 md:pt-40 md:pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
                  <FaCheckCircle className="size-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">
                  Application Submitted Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your Application Number
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-primary tracking-wider">
                      {result.data.applicationNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Verification Code (OTP)
                    </p>
                    <p className="text-xl md:text-2xl font-semibold tracking-wider">
                      {result.data.otpCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <p className="font-medium">Important: Please save this information!</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Take a screenshot or write down your application number and OTP
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Visit our office with these details to complete your admission
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Bring original documents and required fees
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      Office hours: Monday to Saturday, 10:00 AM - 5:00 PM
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild className="flex-1">
                    <Link href="/">
                      <FaArrowLeft className="mr-2" /> Back to Home
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="flex-1"
                  >
                    Print Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      <div className="container px-4 pt-32 pb-12 md:pt-40 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          {/* Page Header */}
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Apply for <span className="text-primary">Admission</span>
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill in your details to start your journey with KP Vidhyarthi Bhavan
            </p>
          </div>

          {result?.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive"
            >
              {result.error}
            </motion.div>
          )}

          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <FaUser className="text-primary" />
                      <h2 className="text-lg font-semibold">Personal Details</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="blockPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Block Preference</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select block" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedGender === "male" ? (
                                  <>
                                    <SelectItem value="A">Block A (Boys)</SelectItem>
                                    <SelectItem value="D">Block D (Boys)</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="B">Block B (Girls)</SelectItem>
                                    <SelectItem value="C">Block C (Girls)</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10-digit mobile number"
                                maxLength={10}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your.email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your complete address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Educational Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <FaGraduationCap className="text-primary" />
                      <h2 className="text-lg font-semibold">Educational Details</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="collegeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>College/University Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter college name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="course"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course/Degree *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., B.Tech, B.Com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Guardian Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <FaUserShield className="text-primary" />
                      <h2 className="text-lg font-semibold">Guardian Details</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="guardianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guardian Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter guardian's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guardianPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Guardian Mobile Number *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10-digit mobile number"
                                maxLength={10}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-11 text-base"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      disabled={isSubmitting}
                      className="sm:w-32"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-lg bg-primary/5 border border-primary/10 p-6"
          >
            <h3 className="font-semibold mb-3">After Submitting:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  You'll receive an <strong>Application Number</strong> and{" "}
                  <strong>OTP Code</strong>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Visit our office with these details to complete admission</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Bring original documents: Aadhar, College ID, and passport-size photos
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Admission is subject to availability and verification</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
