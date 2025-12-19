/**
 * OTP Generation and Validation Utilities
 */

/**
 * Generates a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Gets OTP expiry time (10 minutes from now)
 */
export function getOTPExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
}

/**
 * Validates if OTP is still valid (not expired)
 */
export function isOTPValid(expiryDate: Date | null): boolean {
  if (!expiryDate) return false;
  return new Date() < new Date(expiryDate);
}
