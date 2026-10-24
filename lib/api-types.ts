/**
 * Shapes returned by the JSON API routes.
 *
 * Keeping them in one place means a page and the route it calls cannot drift
 * apart, and removes the need to cast an untyped `response.json()` payload.
 */
import type {
  AdmissionStatus,
  BlockCode,
  Gender,
  NotificationType,
  PaymentStatus,
  Semester,
} from "@/lib/domain";

export type AdmissionApplication = {
  id: string;
  userId: string | null;
  applicationNumber: string;
  status: AdmissionStatus;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  caste: string;
  subCaste: string;
  passportPhoto: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collegeName: string;
  course: string;
  year: string;
  studentId: string | null;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  blockPreference: BlockCode | null;
  assignedBlock: BlockCode | null;
  roomNumber: string | null;
  admissionStartDate: string | null;
  admissionEndDate: string | null;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

/** An application row as returned by the admin list endpoint (joined user). */
export type ApplicationWithUser = {
  application: AdmissionApplication;
  user: { id: string; name: string | null; email: string | null; phone: string | null } | null;
};

/** An application row as returned by the student's own list endpoint. */
export type StudentApplication = AdmissionApplication & {
  userName?: string | null;
  userEmail?: string | null;
  userPhone?: string | null;
};

/**
 * The student's own application detail.
 *
 * Internal columns (`adminNotes`, `reviewedBy`) are not selected by the route,
 * so they are excluded from the type as well.
 */
export type StudentApplicationDetail = Omit<
  AdmissionApplication,
  "adminNotes" | "reviewedBy" | "userId"
>;

export type NotificationRecord = {
  id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string | null;
  createdAt: string;
};

/** A fee row as returned by the student's own payments endpoint. */
export type StudentPayment = {
  id: string;
  applicationId: string | null;
  semester: Semester;
  academicYear: string;
  ddNumber: string | null;
  bankName: string | null;
  amountPaid: number | null;
  paymentStatus: PaymentStatus;
  paidDate: string | null;
  notes: string | null;
  createdAt: string;
};

export type StudentPaymentsResponse = {
  payments: StudentPayment[];
  totalPaid: number;
  pendingPayments: number;
};

/** Per-user switch settings for notification delivery. */
export type NotificationPreferences = {
  id: string;
  userId: string;
  emailNotifications: boolean;
  applicationUpdates: boolean;
  announcementNotifications: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * The signed-in user's own profile.
 *
 * Deliberately excludes the password hash and the reset token; the client only
 * needs `hasPassword` to know whether a password can be changed.
 */
export type ProfileRecord = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  avatar: string | null;
  role: string;
  phone: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  collegeName: string | null;
  course: string | null;
  year: string | null;
  acceptedTermsAt: string | null;
  acceptedPrivacyAt: string | null;
  termsVersion: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
};


export type HostelBlock = {
  id: string;
  name: string;
  capacity: number | null;
  currentOccupancy: number;
  semester1Fee: number;
  semester2Fee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string | null;
  amenities?: string | null;
  features?: string | null;
  images?: string | null;
  floorCount?: number | null;
  roomsPerFloor?: number | null;
};

export type SemesterPayment = {
  id: string;
  studentId: string;
  applicationId: string | null;
  semester: Semester;
  academicYear: string;
  ddNumber: string | null;
  bankName: string | null;
  amountPaid: number | null;
  paymentStatus: PaymentStatus;
  paidDate: string | null;
  addedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentWithRelations = {
  payment: SemesterPayment;
  student: { id: string; name: string | null; email: string | null; phone: string | null } | null;
  application: {
    id: string;
    applicationNumber: string;
    assignedBlock: BlockCode | null;
    roomNumber: string | null;
  } | null;
};

export type Announcement = {
  announcement: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
    targetAudience: string | null;
    isPinned: boolean;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  author: { id: string; name: string | null; email: string | null } | null;
};
