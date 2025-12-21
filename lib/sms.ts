/**
 * SMS Integration using MSG91
 * Environment variables required:
 * - SMS_ENABLED: Set to "true" to enable SMS sending
 * - MSG91_AUTH_KEY: Your MSG91 authentication key
 * - MSG91_SENDER_ID: Your MSG91 sender ID
 * - MSG91_TEMPLATE_ID: Your MSG91 DLT template ID (optional)
 */

interface SMSOptions {
  to: string; // Mobile number with country code (e.g., 919876543210)
  message: string;
  templateId?: string; // DLT template ID for India
}

export async function sendSMS(options: SMSOptions): Promise<boolean> {
  // Check if SMS is enabled
  if (process.env.SMS_ENABLED !== "true") {
    console.log("SMS disabled, skipping SMS send");
    return false;
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const senderId = process.env.MSG91_SENDER_ID || "KPVBHV";

  if (!authKey) {
    console.error("MSG91_AUTH_KEY not configured");
    return false;
  }

  try {
    const payload: any = {
      sender: senderId,
      route: "4", // Transactional route
      country: "91",
      sms: [
        {
          message: options.message,
          to: [options.to.replace(/^(\+91|91)?/, "")], // Remove country code if present
        },
      ],
    };

    // Add template ID if provided (required for DLT in India)
    if (options.templateId || process.env.MSG91_TEMPLATE_ID) {
      payload.DLT_TE_ID = options.templateId || process.env.MSG91_TEMPLATE_ID;
    }

    const response = await fetch("https://api.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": authKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("MSG91 API error:", error);
      return false;
    }

    const result = await response.json();
    console.log("SMS sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    return false;
  }
}

/**
 * SMS Templates
 */

export function getApplicationSubmittedSMS(
  name: string,
  applicationNumber: string
): string {
  return `Dear ${name}, Your hostel admission application (${applicationNumber}) has been submitted successfully to K.P. Vidhyarthi Bhavan. Check your email for details. - KP Vidhyarthi Bhavan`;
}

export function getApplicationApprovedSMS(
  name: string,
  applicationNumber: string
): string {
  return `Dear ${name}, Congratulations! Your hostel admission application (${applicationNumber}) has been approved. Please visit the office to complete the admission process. - KP Vidhyarthi Bhavan`;
}

export function getApplicationRejectedSMS(
  name: string,
  applicationNumber: string
): string {
  return `Dear ${name}, We regret to inform you that your hostel admission application (${applicationNumber}) has been rejected. For more details, please contact the office. - KP Vidhyarthi Bhavan`;
}

export function getPaymentReminderSMS(
  name: string,
  semester: string,
  amount: number
): string {
  return `Dear ${name}, This is a reminder to pay your ${semester} hostel fees of Rs.${amount}. Please visit the office at your earliest convenience. - KP Vidhyarthi Bhavan`;
}

export function getAdmissionActivatedSMS(
  name: string,
  block: string,
  roomNumber: string
): string {
  return `Dear ${name}, Welcome to K.P. Vidhyarthi Bhavan! Your admission is now active. Block: ${block}, Room: ${roomNumber}. Looking forward to hosting you! - KP Vidhyarthi Bhavan`;
}
