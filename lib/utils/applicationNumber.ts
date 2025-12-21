import { db } from "@/lib/db";
import { admissionApplications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Generates application number in format: KPB-YYYY-XXXXX
 * Example: KPB-2024-00001, KPB-2024-00002, etc.
 * 
 * The XXXXX is auto-incremented based on applications submitted in the current year.
 * Resets to 00001 every new year.
 */
export async function generateApplicationNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `KPB-${currentYear}-`;

  try {
    // Get the highest application number for current year
    const result = await db
      .select({
        applicationNumber: admissionApplications.applicationNumber,
      })
      .from(admissionApplications)
      .where(sql`${admissionApplications.applicationNumber} LIKE ${yearPrefix + '%'}`)
      .orderBy(sql`${admissionApplications.applicationNumber} DESC`)
      .limit(1);

    let nextNumber = 1;

    if (result.length > 0 && result[0].applicationNumber) {
      // Extract the number part from KPB-2024-00001
      const lastNumber = result[0].applicationNumber.split('-')[2];
      nextNumber = parseInt(lastNumber, 10) + 1;
    }

    // Pad with zeros to make it 5 digits
    const paddedNumber = nextNumber.toString().padStart(5, '0');
    
    return `${yearPrefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating application number:', error);
    // Fallback to timestamp-based if query fails
    const timestamp = Date.now().toString().slice(-5);
    return `${yearPrefix}${timestamp}`;
  }
}

/**
 * Validates application number format
 */
export function isValidApplicationNumber(appNumber: string): boolean {
  const pattern = /^KPB-\d{4}-\d{5}$/;
  return pattern.test(appNumber);
}

/**
 * Extracts year from application number
 */
export function getYearFromApplicationNumber(appNumber: string): number | null {
  if (!isValidApplicationNumber(appNumber)) {
    return null;
  }
  const year = appNumber.split('-')[1];
  return parseInt(year, 10);
}
