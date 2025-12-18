import { z } from "zod";

export const admissionFormSchema = z.object({
  // Personal Details
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),
  
  dob: z.string().min(1, "Date of birth is required"),
  
  gender: z.enum(["male", "female", "other"]),
  
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address is too long"),
  
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
  
  // Guardian Details
  guardianName: z
    .string()
    .min(2, "Guardian name is required")
    .max(100, "Guardian name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Guardian name should only contain letters"),
  
  guardianPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  
  // Block Preference
  blockPreference: z.enum(["A", "B", "C", "D"]).optional(),
});

export type AdmissionFormData = z.infer<typeof admissionFormSchema>;
