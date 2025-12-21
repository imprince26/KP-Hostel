/**
 * Professional Email Templates for K.P. Vidhyarthi Bhavan
 * All templates use inline CSS for maximum email client compatibility
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const PRIMARY_COLOR = "#EA580C"; // Orange-600
const SECONDARY_COLOR = "#F97316"; // Orange-500

/**
 * Base email wrapper for consistent styling
 */
function emailWrapper(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6; line-height: 1.6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F3F4F6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">
                K.P. Vidhyarthi Bhavan
              </h1>
              <p style="margin: 8px 0 0; color: #FFF7ED; font-size: 14px;">Premier Student Hostel, Ahmedabad</p>
            </td>
          </tr>
          <!-- Content -->
          ${content}
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6B7280;">
                <strong>K.P. Vidhyarthi Bhavan</strong>
              </p>
              <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF;">
                Ahmedabad, Gujarat, India
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                © ${new Date().getFullYear()} All rights reserved.
              </p>
            </td>
          </tr>
        </table>
        <!-- Footer note -->
        <table role="presentation" style="max-width: 600px; width: 100%; margin-top: 16px;">
          <tr>
            <td style="text-align: center; padding: 0 20px;">
              <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                This is an automated email from K.P. Vidhyarthi Bhavan. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Application Submitted Template
 */
export function applicationSubmittedTemplate(
  name: string,
  applicationNumber: string
): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Thank you for submitting your admission application to K.P. Vidhyarthi Bhavan. We have successfully received your application and it is now under review.
        </p>
        
        <!-- Application Number Card -->
        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid ${PRIMARY_COLOR}; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #92400E; font-weight: 500;">
            Your Application Number
          </p>
          <p style="margin: 0; font-size: 28px; color: ${PRIMARY_COLOR}; font-weight: 700; letter-spacing: 2px; font-family: 'Courier New', monospace;">
            ${applicationNumber}
          </p>
        </div>

        <div style="background-color: #EFF6FF; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #1E40AF; font-weight: 600;">
            Next Steps:
          </p>
          <ol style="margin: 0; padding-left: 20px; color: #1E3A8A;">
            <li style="margin-bottom: 8px; font-size: 14px;">Save your application number for future reference</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Visit the hostel office with required documents</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Complete the offline admission form</li>
            <li style="margin-bottom: 0; font-size: 14px;">Track your application status in the student portal</li>
          </ol>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280;">
          Our team will review your application and get back to you shortly. You can track your application status by logging into your student portal.
        </p>

        <div style="text-align: center; margin: 32px 0 0;">
          <a href="${APP_URL}/auth/login" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Login to Portal
          </a>
        </div>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Application Submitted");
}

/**
 * Application Approved Template
 */
export function applicationApprovedTemplate(
  name: string,
  applicationNumber: string
): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #D1FAE5; border-radius: 50%; padding: 16px;">
            <span style="font-size: 48px;">✅</span>
          </div>
        </div>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #059669; font-size: 24px; font-weight: 600;">
          Application Approved!
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Congratulations! We are pleased to inform you that your hostel admission application <strong>${applicationNumber}</strong> has been <span style="color: #059669; font-weight: 600;">approved</span>.
        </p>

        <div style="background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-left: 4px solid #059669; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #065F46; font-weight: 600;">
            Important: Complete Your Admission
          </p>
          <p style="margin: 0; font-size: 14px; color: #047857; line-height: 1.6;">
            Please visit the hostel office within <strong>7 days</strong> to complete your offline admission process and submit the required documents and fees.
          </p>
        </div>

        <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #111827; font-weight: 600;">
            Documents Required:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px; font-size: 14px;">College ID Card (Photocopy)</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Aadhar Card (Original + Photocopy)</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Passport Size Photos (4 copies)</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Previous Address Proof</li>
            <li style="margin-bottom: 0; font-size: 14px;">Bank DD for admission fees</li>
          </ul>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280;">
          For any queries, please contact the hostel office or check your student portal for more details.
        </p>

        <div style="text-align: center; margin: 32px 0 0;">
          <a href="${APP_URL}/student/dashboard" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            View Dashboard
          </a>
        </div>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Application Approved");
}

/**
 * Application Rejected Template
 */
export function applicationRejectedTemplate(
  name: string,
  applicationNumber: string,
  reason?: string
): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #FEE2E2; border-radius: 50%; padding: 16px;">
            <span style="font-size: 48px;">❌</span>
          </div>
        </div>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #DC2626; font-size: 24px; font-weight: 600;">
          Application Not Approved
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Thank you for your interest in K.P. Vidhyarthi Bhavan. After careful review, we regret to inform you that your application <strong>${applicationNumber}</strong> could not be approved at this time.
        </p>

        ${reason ? `
        <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #991B1B; font-weight: 600;">
            Reason:
          </p>
          <p style="margin: 0; font-size: 14px; color: #7F1D1D; line-height: 1.6;">
            ${reason}
          </p>
        </div>
        ` : ''}

        <div style="background-color: #EFF6FF; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #1E40AF; font-weight: 600;">
            Need Assistance?
          </p>
          <p style="margin: 0; font-size: 14px; color: #1E3A8A; line-height: 1.6;">
            If you have any questions or would like to discuss this decision, please feel free to contact our office. We're here to help!
          </p>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280;">
          Thank you for your understanding. We wish you all the best in your future endeavors.
        </p>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Application Update");
}

/**
 * Account Deletion Warning Template
 */
export function accountDeletionTemplate(name: string): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #FEF2F2; border-radius: 50%; padding: 16px;">
            <span style="font-size: 48px;">⚠️</span>
          </div>
        </div>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #DC2626; font-size: 24px; font-weight: 600;">
          Account Deleted
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Your account has been permanently deleted from K.P. Vidhyarthi Bhavan hostel management system.
        </p>

        <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #991B1B; font-weight: 600;">
            Important Information:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #7F1D1D;">
            <li style="margin-bottom: 8px; font-size: 14px;">All your personal data has been removed</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Application history has been deleted</li>
            <li style="margin-bottom: 8px; font-size: 14px;">This action cannot be undone</li>
            <li style="margin-bottom: 0; font-size: 14px;">You will need to create a new account to reapply</li>
          </ul>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280;">
          If this was a mistake or you have any concerns, please contact our office immediately.
        </p>

        <div style="text-align: center; margin: 32px 0 0;">
          <a href="${APP_URL}" style="display: inline-block; background: #6B7280; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Visit Website
          </a>
        </div>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Account Deleted");
}

/**
 * Admission Activated Template (When admin activates after offline admission)
 */
export function admissionActivatedTemplate(
  name: string,
  block: string,
  roomNumber: string,
  admissionStartDate: string,
  admissionEndDate: string
): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #DBEAFE; border-radius: 50%; padding: 16px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
        </div>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #2563EB; font-size: 24px; font-weight: 600;">
          Welcome to K.P. Vidhyarthi Bhavan!
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Your hostel admission has been activated! We're excited to welcome you to our community.
        </p>

        <div style="background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-left: 4px solid #2563EB; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 16px; font-size: 15px; color: #1E40AF; font-weight: 600;">
            Your Room Details:
          </p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A;"><strong>Block:</strong></td>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A; text-align: right;">${block}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A;"><strong>Room Number:</strong></td>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A; text-align: right;">${roomNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A;"><strong>Valid From:</strong></td>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A; text-align: right;">${new Date(admissionStartDate).toLocaleDateString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A;"><strong>Valid Until:</strong></td>
              <td style="padding: 8px 0; font-size: 14px; color: #1E3A8A; text-align: right;">${new Date(admissionEndDate).toLocaleDateString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-size: 15px; color: #111827; font-weight: 600;">
            Important Reminders:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 8px; font-size: 14px;">Follow hostel rules and timings</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Keep your room clean and organized</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Pay semester fees on time</li>
            <li style="margin-bottom: 0; font-size: 14px;">Report any issues to hostel management</li>
          </ul>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280;">
          Access your student portal to view more details and manage your hostel account.
        </p>

        <div style="text-align: center; margin: 32px 0 0;">
          <a href="${APP_URL}/student/dashboard" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Open Student Portal
          </a>
        </div>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Admission Activated");
}

/**
 * Payment Reminder Template
 */
export function paymentReminderTemplate(
  name: string,
  semester: string,
  amount: number,
  dueDate: string
): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background-color: #FEF3C7; border-radius: 50%; padding: 16px;">
            <span style="font-size: 48px;">💰</span>
          </div>
        </div>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #D97706; font-size: 24px; font-weight: 600;">
          Semester Fees Payment Reminder
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          This is a friendly reminder about your pending hostel fees payment for <strong>${semester}</strong>.
        </p>

        <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #D97706; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #92400E;">
            Amount Due
          </p>
          <p style="margin: 0; font-size: 32px; color: #D97706; font-weight: 700;">
            ₹${amount.toLocaleString('en-IN')}
          </p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #92400E;">
            Due Date: <strong>${new Date(dueDate).toLocaleDateString('en-IN')}</strong>
          </p>
        </div>

        <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #7F1D1D; line-height: 1.6;">
            <strong>Important:</strong> Please submit the fees as soon as possible to avoid any inconvenience. Visit the hostel office with the required Demand Draft (DD).
          </p>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280;">
          For any queries regarding payment, please contact the hostel office during working hours.
        </p>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Payment Reminder");
}

/**
 * Password Reset Template
 */
export function passwordResetTemplate(
  name: string,
  resetLink: string
): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Reset Password
          </a>
        </div>

        <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.6;">
            <strong>Security Note:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>

        <p style="margin: 24px 0 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetLink}" style="color: ${PRIMARY_COLOR}; word-break: break-all;">${resetLink}</a>
        </p>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Reset Your Password");
}

/**
 * OTP Verification Email Template
 */
export function getOTPEmailTemplate(name: string, otp: string): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Your one-time password (OTP) for email verification is:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background-color: #F3F4F6; padding: 20px 40px; border-radius: 8px; border: 2px dashed ${PRIMARY_COLOR};">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${PRIMARY_COLOR}; font-family: 'Courier New', monospace;">
              ${otp}
            </span>
          </div>
        </div>

        <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.6;">
            <strong>Security Note:</strong> This OTP will expire in <strong>10 minutes</strong>. Never share this code with anyone. Our team will never ask for your OTP.
          </p>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          If you didn't request this verification code, please ignore this email or contact our support team immediately.
        </p>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Your Verification Code");
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmailTemplate(name: string): string {
  const content = `
    <tr>
      <td style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Welcome to <strong>K.P. Vidhyarthi Bhavan</strong>! We're excited to have you join our community of students.
        </p>

        <div style="background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-radius: 8px; padding: 24px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px; font-size: 18px; color: #1E40AF;">🎉 Your Account is Ready!</h3>
          <p style="margin: 0; font-size: 14px; color: #1E3A8A; line-height: 1.6;">
            You can now log in to your account and start exploring our facilities, submit admission applications, and stay updated with all hostel activities.
          </p>
        </div>

        <div style="margin: 32px 0;">
          <h3 style="margin: 0 0 16px; font-size: 16px; color: #111827;">Next Steps:</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #374151; line-height: 1.8;">
            <li>Complete your profile with personal details</li>
            <li>Submit your hostel admission application</li>
            <li>Upload required documents</li>
            <li>Track your application status</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${APP_URL}/student/dashboard" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 600; font-size: 15px;">
            Go to Dashboard
          </a>
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
      </td>
    </tr>
  `;

  return emailWrapper(content, "Welcome to K.P. Vidhyarthi Bhavan");
}
