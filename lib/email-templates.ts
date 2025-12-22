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
const PRIMARY_COLOR = "#6B000D"; // Dark Red
const SECONDARY_COLOR = "#8B000D"; // Lighter Dark Red
const HOSTEL_PHONE = "+91-XXXXXXXXXX"; // Update with actual phone
const HOSTEL_EMAIL = "info@example.com";

/**
 * Base email wrapper for consistent styling - Optimized for mobile devices
 */
function emailWrapper(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 0 !important;
      }
      .email-header {
        padding: 24px 16px !important;
      }
      .email-body {
        padding: 24px 16px !important;
      }
      .email-footer {
        padding: 20px 16px !important;
      }
      .logo-img {
        max-width: 100px !important;
      }
      .main-title {
        font-size: 22px !important;
      }
      .cta-button {
        padding: 12px 24px !important;
        font-size: 14px !important;
      }
      .info-card {
        padding: 16px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6; line-height: 1.6; width: 100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; background-color: #F3F4F6;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <!-- Main Container -->
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td class="email-header" style="background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%); padding: 32px 24px; text-align: center;">
              <img src="${APP_URL}/logo.jpg" alt="K.P. Vidhyarthi Bhavan" class="logo-img" style="max-width: 120px; width: 100%; height: auto; margin-bottom: 16px; border-radius: 8px; display: block; margin-left: auto; margin-right: auto;" />
              <h1 class="main-title" style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">
                K.P. Vidhyarthi Bhavan
              </h1>
              <p style="margin: 8px 0 0; color: #FFF7ED; font-size: 14px;">Premier Student Hostel</p>
              <p style="margin: 4px 0 0; color: #FFF7ED; font-size: 13px;">📍 Ahmedabad, Gujarat</p>
            </td>
          </tr>
          <!-- Content -->
          ${content}
          <!-- Footer -->
          <tr>
            <td class="email-footer" style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #111827; font-weight: 600;">
                      K.P. Vidhyarthi Bhavan
                    </p>
                    <p style="margin: 0 0 6px; font-size: 13px; color: #6B7280;">
                      📞 ${HOSTEL_PHONE}
                    </p>
                    <p style="margin: 0 0 6px; font-size: 13px; color: #6B7280;">
                      ✉️ ${HOSTEL_EMAIL}
                    </p>
                    <p style="margin: 0 0 12px; font-size: 12px; color: #9CA3AF;">
                      🕒 Mon-Sat: 9:00 AM - 6:00 PM
                    </p>
                  </td>
                </tr>
              </table>
              <div style="border-top: 1px solid #E5E7EB; padding-top: 12px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">
                  Ahmedabad, Gujarat, India
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                  © ${new Date().getFullYear()} K.P. Vidhyarthi Bhavan. All rights reserved.
                </p>
              </div>
            </td>
          </tr>
        </table>
        <!-- Footer note -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin-top: 16px;">
          <tr>
            <td style="text-align: center; padding: 0 16px;">
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
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Thank you for submitting your admission application to K.P. Vidhyarthi Bhavan. We have successfully received your application and it is now under review.
        </p>
        
        <!-- Application Number Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid ${PRIMARY_COLOR}; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #92400E; font-weight: 500; text-align: center;">
                Your Application Number
              </p>
              <p style="margin: 0; font-size: 28px; color: ${PRIMARY_COLOR}; font-weight: 700; letter-spacing: 2px; font-family: 'Courier New', monospace; text-align: center; word-break: break-all;">
                ${applicationNumber}
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #EFF6FF; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 12px; font-size: 15px; color: #1E40AF; font-weight: 600;">
                📋 Next Steps:
              </p>
              <ol style="margin: 0; padding-left: 20px; color: #1E3A8A;">
                <li style="margin-bottom: 8px; font-size: 14px;">Save your application number for future reference</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Visit the hostel office with required documents</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Complete the offline admission form</li>
                <li style="margin-bottom: 0; font-size: 14px;">Track your application status in the student portal</li>
              </ol>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Our team will review your application and get back to you shortly. You can track your application status by logging into your student portal.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0 0;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/auth/login" class="cta-button" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Login to Portal
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Application Submitted - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Application Submitted"),
    text: `Dear ${name},

Thank you for submitting your admission application to K.P. Vidhyarthi Bhavan.

Your Application Number: ${applicationNumber}

Next Steps:
1. Save your application number for future reference
2. Visit the hostel office with required documents
3. Complete the offline admission form
4. Track your application status in the student portal

Our team will review your application and get back to you shortly.

Login to Portal: ${APP_URL}/auth/login

Best regards,
K.P. Vidhyarthi Bhavan
${HOSTEL_PHONE} | ${HOSTEL_EMAIL}`
  };
}

/**
 * Application Approved Template
 */
export function applicationApprovedTemplate(
  name: string,
  applicationNumber: string
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="display: inline-block; background-color: #D1FAE5; border-radius: 50%; padding: 16px;">
                <span style="font-size: 48px;">✅</span>
              </div>
            </td>
          </tr>
        </table>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #059669; font-size: 24px; font-weight: 600;">
          Application Approved!
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Congratulations! We are pleased to inform you that your hostel admission application <strong>${applicationNumber}</strong> has been <span style="color: #059669; font-weight: 600;">approved</span>.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-left: 4px solid #059669; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 12px; font-size: 15px; color: #065F46; font-weight: 600;">
                ⚠️ Important: Complete Your Admission
              </p>
              <p style="margin: 0; font-size: 14px; color: #047857; line-height: 1.6;">
                Please visit the hostel office within <strong>7 days</strong> to complete your offline admission process and submit the required documents and fees.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F9FAFB; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 12px; font-size: 15px; color: #111827; font-weight: 600;">
                📄 Documents Required:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px; font-size: 14px;">College ID Card (Photocopy)</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Aadhar Card (Original + Photocopy)</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Passport Size Photos (4 copies)</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Previous Address Proof</li>
                <li style="margin-bottom: 0; font-size: 14px;">Bank DD for admission fees</li>
              </ul>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          For any queries, please contact the hostel office or check your student portal for more details.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0 0;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/student/dashboard" class="cta-button" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                View Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Application Approved - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Application Approved"),
    text: `Dear ${name},

Congratulations! Your hostel admission application ${applicationNumber} has been APPROVED.

IMPORTANT: Complete Your Admission
Please visit the hostel office within 7 days to complete your offline admission process.

Documents Required:
- College ID Card (Photocopy)
- Aadhar Card (Original + Photocopy)
- Passport Size Photos (4 copies)
- Previous Address Proof
- Bank DD for admission fees

For any queries, please contact the hostel office.

View Dashboard: ${APP_URL}/student/dashboard

Best regards,
K.P. Vidhyarthi Bhavan
${HOSTEL_PHONE} | ${HOSTEL_EMAIL}`
  };
}

/**
 * Application Rejected Template
 */
export function applicationRejectedTemplate(
  name: string,
  applicationNumber: string,
  reason?: string
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="display: inline-block; background-color: #FEE2E2; border-radius: 50%; padding: 16px;">
                <span style="font-size: 48px;">❌</span>
              </div>
            </td>
          </tr>
        </table>
        
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
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #991B1B; font-weight: 600;">
                Reason:
              </p>
              <p style="margin: 0; font-size: 14px; color: #7F1D1D; line-height: 1.6;">
                ${reason}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #EFF6FF; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #1E40AF; font-weight: 600;">
                💬 Need Assistance?
              </p>
              <p style="margin: 0; font-size: 14px; color: #1E3A8A; line-height: 1.6;">
                If you have any questions or would like to discuss this decision, please feel free to contact our office. We're here to help!
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Thank you for your understanding. We wish you all the best in your future endeavors.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: "Application Update - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Application Update"),
    text: `Dear ${name},

Thank you for your interest in K.P. Vidhyarthi Bhavan. After careful review, we regret to inform you that your application ${applicationNumber} could not be approved at this time.

${reason ? `Reason: ${reason}

` : ''}Need Assistance?
If you have any questions or would like to discuss this decision, please contact our office.

Contact: ${HOSTEL_PHONE} | ${HOSTEL_EMAIL}

Thank you for your understanding. We wish you all the best.

Best regards,
K.P. Vidhyarthi Bhavan`
  };
}

/**
 * Account Deletion Warning Template
 */
export function accountDeletionTemplate(name: string): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="display: inline-block; background-color: #FEF2F2; border-radius: 50%; padding: 16px;">
                <span style="font-size: 48px;">⚠️</span>
              </div>
            </td>
          </tr>
        </table>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #DC2626; font-size: 24px; font-weight: 600;">
          Account Deleted
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Your account has been permanently deleted from K.P. Vidhyarthi Bhavan hostel management system.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #991B1B; font-weight: 600;">
                ⚠️ Important Information:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #7F1D1D;">
                <li style="margin-bottom: 8px; font-size: 14px;">All your personal data has been removed</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Application history has been deleted</li>
                <li style="margin-bottom: 8px; font-size: 14px;">This action cannot be undone</li>
                <li style="margin-bottom: 0; font-size: 14px;">You will need to create a new account to reapply</li>
              </ul>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          If this was a mistake or you have any concerns, please contact our office immediately.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0 0;">
          <tr>
            <td align="center">
              <a href="${APP_URL}" class="cta-button" style="display: inline-block; background: #6B7280; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Visit Website
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Account Deleted - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Account Deleted"),
    text: `Dear ${name},

Your account has been permanently deleted from K.P. Vidhyarthi Bhavan hostel management system.

Important Information:
- All your personal data has been removed
- Application history has been deleted
- This action cannot be undone
- You will need to create a new account to reapply

If this was a mistake, please contact our office immediately.

Contact: ${HOSTEL_PHONE} | ${HOSTEL_EMAIL}

Website: ${APP_URL}

K.P. Vidhyarthi Bhavan`
  };
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
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="display: inline-block; background-color: #DBEAFE; border-radius: 50%; padding: 16px;">
                <span style="font-size: 48px;">🎉</span>
              </div>
            </td>
          </tr>
        </table>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #2563EB; font-size: 24px; font-weight: 600;">
          Welcome to K.P. Vidhyarthi Bhavan!
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Your hostel admission has been activated! We're excited to welcome you to our community.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-left: 4px solid #2563EB; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #1E40AF; font-weight: 600; text-align: center;">
                🏠 Your Room Details
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
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
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F9FAFB; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0 0 12px; font-size: 15px; color: #111827; font-weight: 600;">
                ✅ Important Reminders:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px; font-size: 14px;">Follow hostel rules and timings</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Keep your room clean and organized</li>
                <li style="margin-bottom: 8px; font-size: 14px;">Pay semester fees on time</li>
                <li style="margin-bottom: 0; font-size: 14px;">Report any issues to hostel management</li>
              </ul>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          Access your student portal to view more details and manage your hostel account.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0 0;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/student/dashboard" class="cta-button" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Open Student Portal
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Admission Activated - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Admission Activated"),
    text: `Dear ${name},

Your hostel admission has been activated! Welcome to K.P. Vidhyarthi Bhavan.

Your Room Details:
- Block: ${block}
- Room Number: ${roomNumber}
- Valid From: ${new Date(admissionStartDate).toLocaleDateString('en-IN')}
- Valid Until: ${new Date(admissionEndDate).toLocaleDateString('en-IN')}

Important Reminders:
- Follow hostel rules and timings
- Keep your room clean and organized
- Pay semester fees on time
- Report any issues to hostel management

Access your student portal: ${APP_URL}/student/dashboard

Best regards,
K.P. Vidhyarthi Bhavan
${HOSTEL_PHONE} | ${HOSTEL_EMAIL}`
  };
}

/**
 * Payment Reminder Template
 */
export function paymentReminderTemplate(
  name: string,
  semester: string,
  amount: number,
  dueDate: string
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="display: inline-block; background-color: #FEF3C7; border-radius: 50%; padding: 16px;">
                <span style="font-size: 48px;">💰</span>
              </div>
            </td>
          </tr>
        </table>
        
        <h2 style="margin: 0 0 16px; text-align: center; color: #D97706; font-size: 24px; font-weight: 600;">
          Semester Fees Payment Reminder
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          This is a friendly reminder about your pending hostel fees payment for <strong>${semester}</strong>.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #D97706; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #92400E; font-weight: 500;">
                Amount Due
              </p>
              <p style="margin: 0; font-size: 32px; color: #D97706; font-weight: 700;">
                ₹${amount.toLocaleString('en-IN')}
              </p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #92400E;">
                Due Date: <strong>${new Date(dueDate).toLocaleDateString('en-IN')}</strong>
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0; font-size: 14px; color: #7F1D1D; line-height: 1.6;">
                <strong>⚠️ Important:</strong> Please submit the fees as soon as possible to avoid any inconvenience. Visit the hostel office with the required Demand Draft (DD).
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          For any queries regarding payment, please contact the hostel office during working hours.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: `Payment Reminder - ${semester} - K.P. Vidhyarthi Bhavan`,
    html: emailWrapper(content, "Payment Reminder"),
    text: `Dear ${name},

This is a friendly reminder about your pending hostel fees payment for ${semester}.

Amount Due: ₹${amount.toLocaleString('en-IN')}
Due Date: ${new Date(dueDate).toLocaleDateString('en-IN')}

IMPORTANT: Please submit the fees as soon as possible to avoid any inconvenience. Visit the hostel office with the required Demand Draft (DD).

For queries, contact: ${HOSTEL_PHONE} | ${HOSTEL_EMAIL}

Best regards,
K.P. Vidhyarthi Bhavan`
  };
}

/**
 * Password Reset Template
 */
export function passwordResetTemplate(
  name: string,
  resetLink: string
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0;">
          <tr>
            <td align="center">
              <a href="${resetLink}" class="cta-button" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF3C7; border-left: 4px solid #D97706; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.6;">
                🔒 <strong>Security Note:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 13px; color: #9CA3AF; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetLink}" style="color: ${PRIMARY_COLOR}; word-break: break-all;">${resetLink}</a>
        </p>
      </td>
    </tr>
  `;

  return {
    subject: "Reset Your Password - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Reset Your Password"),
    text: `Dear ${name},

We received a request to reset your password. Click the link below to create a new password:

${resetLink}

Security Note: This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.

Best regards,
K.P. Vidhyarthi Bhavan
${HOSTEL_PHONE} | ${HOSTEL_EMAIL}`
  };
}

/**
 * OTP Verification Email Template
 */
export function getOTPEmailTemplate(name: string, otp: string): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Your one-time password (OTP) for email verification is:
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F4F6; border: 2px dashed ${PRIMARY_COLOR}; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px 40px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${PRIMARY_COLOR}; font-family: 'Courier New', monospace; word-break: break-all;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF3C7; border-left: 4px solid #D97706; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.6;">
                🔒 <strong>Security Note:</strong> This OTP will expire in <strong>10 minutes</strong>. Never share this code with anyone. Our team will never ask for your OTP.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          If you didn't request this verification code, please ignore this email or contact our support team immediately.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: "Your Verification Code - K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Your Verification Code"),
    text: `Dear ${name},

Your one-time password (OTP) for email verification is: ${otp}

Security Note: This OTP will expire in 10 minutes. Never share this code with anyone.

If you didn't request this verification code, please contact our support team.

Best regards,
K.P. Vidhyarthi Bhavan
${HOSTEL_PHONE} | ${HOSTEL_EMAIL}`
  };
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmailTemplate(name: string): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
          Welcome to <strong>K.P. Vidhyarthi Bhavan</strong>! We're excited to have you join our community of students.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%); border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 24px;">
              <h3 style="margin: 0 0 12px; font-size: 18px; color: #1E40AF;">🎉 Your Account is Ready!</h3>
              <p style="margin: 0; font-size: 14px; color: #1E3A8A; line-height: 1.6;">
                You can now log in to your account and start exploring our facilities, submit admission applications, and stay updated with all hostel activities.
              </p>
            </td>
          </tr>
        </table>

        <div style="margin: 32px 0;">
          <h3 style="margin: 0 0 16px; font-size: 16px; color: #111827;">🚀 Next Steps:</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #374151; line-height: 1.8;">
            <li>Complete your profile with personal details</li>
            <li>Submit your hostel admission application</li>
            <li>Upload required documents</li>
            <li>Track your application status</li>
          </ul>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 32px 0;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/student/dashboard" class="cta-button" style="display: inline-block; background: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Go to Dashboard
              </a>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; font-size: 14px; color: #6B7280; line-height: 1.6;">
          If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: "Welcome to K.P. Vidhyarthi Bhavan",
    html: emailWrapper(content, "Welcome to K.P. Vidhyarthi Bhavan"),
    text: `Dear ${name},

Welcome to K.P. Vidhyarthi Bhavan! We're excited to have you join our community of students.

Your Account is Ready!
You can now log in to your account and start exploring our facilities, submit admission applications, and stay updated with all hostel activities.

Next Steps:
- Complete your profile with personal details
- Submit your hostel admission application
- Upload required documents
- Track your application status

Go to Dashboard: ${APP_URL}/student/dashboard

If you have any questions, contact us at:
${HOSTEL_PHONE} | ${HOSTEL_EMAIL}

Best regards,
K.P. Vidhyarthi Bhavan`
  };
}

/**
 * Admin Message Template - For messages sent by admin to students
 */
export function adminMessageTemplate(
  recipientName: string,
  subject: string,
  messageContent: string,
  senderName: string = "K.P. Vidhyarthi Bhavan Administration"
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 24px;">
        <!-- Greeting -->
        <h2 style="margin: 0 0 16px; color: #1F2937; font-size: 24px; font-weight: 600;">
          📨 Message from Administration
        </h2>

        <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
          Dear ${recipientName},
        </p>

        <!-- Message Content -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F9FAFB; border-left: 4px solid ${PRIMARY_COLOR}; border-radius: 6px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px;">
              <h3 style="margin: 0 0 12px; color: #1F2937; font-size: 18px; font-weight: 600;">
                ${subject}
              </h3>
              <div style="color: #374151; font-size: 15px; line-height: 1.7;">
                ${messageContent}
              </div>
            </td>
          </tr>
        </table>

        <!-- Sender Info -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 16px;">
              <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: 500;">
                📧 This message was sent by: <strong>${senderName}</strong>
              </p>
              <p style="margin: 8px 0 0; color: #92400E; font-size: 13px;">
                If you have any questions about this message, please contact the administration office.
              </p>
            </td>
          </tr>
        </table>

        <!-- Contact Info -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F3F4F6; border-radius: 8px; margin: 24px 0;">
          <tr>
            <td class="info-card" style="padding: 20px; text-align: center;">
              <h4 style="margin: 0 0 12px; color: #1F2937; font-size: 16px; font-weight: 600;">
                🏠 K.P. Vidhyarthi Bhavan
              </h4>
              <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px;">
                Premier Student Hostel, Ahmedabad
              </p>
              <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px;">
                📞 ${HOSTEL_PHONE} | 📧 ${HOSTEL_EMAIL}
              </p>
              <p style="margin: 0; color: #6B7280; font-size: 13px;">
                🕒 Office Hours: Monday to Saturday, 9:00 AM - 6:00 PM
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
          This is an automated message from K.P. Vidhyarthi Bhavan administration.
          Please do not reply to this email.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: `K.P. Vidhyarthi Bhavan - ${subject}`,
    html: emailWrapper(content, `Message from ${senderName}`),
    text: `
Dear ${recipientName},

${subject}

${messageContent.replace(/<[^>]*>/g, '')}

This message was sent by: ${senderName}

If you have any questions about this message, please contact the administration office.

K.P. Vidhyarthi Bhavan
Premier Student Hostel, Ahmedabad
Contact: ${HOSTEL_PHONE} | Email: ${HOSTEL_EMAIL}
Office Hours: Monday to Saturday, 9:00 AM - 6:00 PM

This is an automated message from K.P. Vidhyarthi Bhavan administration.
Please do not reply to this email.
    `.trim(),
  };
}
