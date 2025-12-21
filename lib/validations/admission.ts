import { z } from "zod";

export const admissionFormSchema = z.object({
  // Personal Details
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  
  gender: z.enum(["male", "female", "other"]),
  
  caste: z.string().min(2, "Caste is required"),
  
  subCaste: z.string().min(2, "Sub-caste is required"),
  
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  
  // Address
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address is too long"),
  
  city: z.string().min(2, "City is required"),
  
  state: z.string().min(2, "State is required"),
  
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  
  // Educational Details
  collegeName: z
    .string()
    .min(2, "College name is required")
    .max(200, "College name is too long"),
  
  course: z
    .string()
    .min(2, "Course name is required")
    .max(100, "Course name is too long"),
  
  year: z.enum(["1", "2", "3", "4"]),
  
  studentId: z.string().optional(),
  
  // Guardian Details
  guardianName: z
    .string()
    .min(2, "Guardian name is required")
    .max(100, "Guardian name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Guardian name should only contain letters"),
  
  guardianPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  
  guardianRelation: z.string().min(2, "Guardian relation is required"),
  
  // Photo Upload
  passportPhoto: z.string().min(1, "Passport photo is required"),
  
  // Block Preference
  blockPreference: z.enum(["A", "B", "C", "D"]).optional(),
});

export type AdmissionFormData = z.infer<typeof admissionFormSchema>;
