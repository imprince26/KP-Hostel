/**
 * Professional Email Templates for KP Hostel Web Project
 * Designed as an independent academic demonstration portal.
 * All templates use inline CSS for maximum email client compatibility with zero emojis.
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const PRIMARY_COLOR = "#5c1d24"; // Institutional Heritage Crimson
const ACCENT_COLOR = "#8b2635";
const HOSTEL_PHONE = "+91 XXXXX XXXXX";
const HOSTEL_EMAIL = "demo.project@XXXXX.org";

/**
 * Base email wrapper with clear student project demo indicators
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
      .main-title {
        font-size: 20px !important;
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F4F6; line-height: 1.6; color: #1F2937; width: 100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; background-color: #F4F4F6;">
    <tr>
      <td align="center" style="padding: 28px 12px;">
        <!-- Top Project Disclaimer Pill -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin-bottom: 12px;">
          <tr>
            <td align="center">
              <span style="display: inline-block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; background-color: #E5E7EB; padding: 4px 12px; border-radius: 9999px; font-weight: 600;">
                Academic Demonstration Project Notice
              </span>
            </td>
          </tr>
        </table>

        <!-- Main Container -->
        <table role="presentation" class="email-container" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td class="email-header" style="background-color: ${PRIMARY_COLOR}; padding: 28px 24px; text-align: center; border-bottom: 3px solid ${ACCENT_COLOR};">
              <h1 class="main-title" style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                KP Hostel Portal
              </h1>
              <p style="margin: 6px 0 0; color: #F3E8E9; font-size: 13px; font-weight: 400; letter-spacing: 0.3px;">
                Student Management Platform &bull; Project Demonstration
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          ${content}

          <!-- Footer -->
          <tr>
            <td class="email-footer" style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 12px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #374151; font-weight: 600;">
                      KP Hostel Web Project
                    </p>
                    <p style="margin: 0 0 4px; font-size: 12px; color: #6B7280;">
                      Support &amp; Inquiries: ${HOSTEL_EMAIL} &bull; ${HOSTEL_PHONE}
                    </p>
                    <p style="margin: 0 0 12px; font-size: 12px; color: #6B7280;">
                      Portal Demo URL: <a href="${APP_URL}" style="color: ${PRIMARY_COLOR}; text-decoration: underline;">${APP_URL}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Project Disclaimer Warning -->
              <div style="border-top: 1px solid #E5E7EB; padding-top: 14px; text-align: left;">
                <p style="margin: 0 0 6px; font-size: 11px; color: #6B7280; line-height: 1.5;">
                  <strong>Disclaimer:</strong> This email was generated automatically by the KP Hostel Web Project, an independent student academic and portfolio project developed by Prince Patel. This platform is <strong>not</strong> affiliated with, operated by, or endorsed by the official administration of K.P. Vidhyarthi Bhavan, Ellisbridge, Ahmedabad.
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF; text-align: center;">
                  &copy; ${new Date().getFullYear()} KP Hostel Project. All rights reserved.
                </p>
              </div>
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
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Your hostel admission application has been registered on the student portal and is currently recorded in our review queue.
        </p>
        
        <!-- Application Number Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-left: 4px solid ${PRIMARY_COLOR}; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 18px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; tracking: 1px; color: #6B7280; font-weight: 600;">
                Application Reference Number
              </p>
              <p style="margin: 0; font-size: 24px; color: ${PRIMARY_COLOR}; font-weight: 700; letter-spacing: 2px; font-family: monospace;">
                ${applicationNumber}
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 18px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #0F172A; font-weight: 600;">
                Next Steps:
              </p>
              <ol style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.7;">
                <li>Retain your application reference number for record keeping.</li>
                <li>Track admission review progress directly through your student portal account.</li>
                <li>Prepare physical document copies as outlined in the portal requirements.</li>
              </ol>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 28px 0 10px;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/auth/login" class="cta-button" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                Open Student Portal
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: `Application Registered [${applicationNumber}] - KP Hostel Portal`,
    html: emailWrapper(content, "Application Registered"),
    text: `Dear ${name},

Your hostel admission application has been registered on the student portal.

Application Reference Number: ${applicationNumber}

Next Steps:
1. Retain your application reference number for record keeping.
2. Track admission review progress through your student portal account.
3. Prepare physical document copies as outlined in portal requirements.

Student Portal Login: ${APP_URL}/auth/login

Notice: This is an automated email from the KP Hostel Project demonstration platform.`
  };
}

/**
 * Application Approved Template
 */
export function applicationApprovedTemplate(
  name: string,
  applicationNumber: string,
  assignedBlock?: string,
  roomNumber?: string,
  admissionStartDate?: string,
  admissionEndDate?: string
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <h2 style="margin: 0 0 14px; color: #065F46; font-size: 20px; font-weight: 700;">
          Admission Application Approved
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Your hostel admission application (Ref: <strong>${applicationNumber}</strong>) has been approved in the system.
        </p>

        ${assignedBlock && roomNumber ? `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; margin: 18px 0;">
          <tr>
            <td class="info-card" style="padding: 18px;">
              <p style="margin: 0 0 10px; font-size: 13px; font-weight: 700; color: #166534; text-transform: uppercase;">
                Allotment Summary
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; font-size: 13px; color: #166534;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Hostel Block:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">Block ${assignedBlock}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Room Number:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">${roomNumber}</td>
                </tr>
                ${admissionStartDate ? `
                <tr>
                  <td style="padding: 4px 0;"><strong>Valid From:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">${new Date(admissionStartDate).toLocaleDateString('en-IN')}</td>
                </tr>` : ''}
                ${admissionEndDate ? `
                <tr>
                  <td style="padding: 4px 0;"><strong>Valid Until:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">${new Date(admissionEndDate).toLocaleDateString('en-IN')}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
        </table>
        ` : ''}

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 18px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #0F172A; font-weight: 600;">
                Required Verification Documents:
              </p>
              <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.7;">
                <li>College enrollment or ID proof</li>
                <li>Government photo identification (Aadhar card)</li>
                <li>Passport-sized photographs</li>
                <li>Applicable semester fee demand draft</li>
              </ul>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 28px 0 10px;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/student/dashboard" class="cta-button" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                View Admission Details
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: `Application Approved [${applicationNumber}] - KP Hostel Portal`,
    html: emailWrapper(content, "Application Approved"),
    text: `Dear ${name},

Your hostel admission application (${applicationNumber}) has been approved.

${assignedBlock && roomNumber ? `Block: ${assignedBlock}\nRoom: ${roomNumber}\n` : ''}
Please view your student dashboard to review documentation requirements.

Portal Link: ${APP_URL}/student/dashboard`
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
        <h2 style="margin: 0 0 14px; color: #991B1B; font-size: 20px; font-weight: 700;">
          Application Status Update
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Following a review of admission application <strong>${applicationNumber}</strong>, we regret to inform you that it could not be approved at this time.
        </p>

        ${reason ? `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 16px;">
              <p style="margin: 0 0 6px; font-size: 13px; color: #991B1B; font-weight: 600;">
                Notes from Review:
              </p>
              <p style="margin: 0; font-size: 13px; color: #7F1D1D; line-height: 1.6;">
                ${reason}
              </p>
            </td>
          </tr>
        </table>
        ` : ''}

        <p style="margin: 20px 0 0; font-size: 13px; color: #6B7280; line-height: 1.6;">
          You can check your student portal for further details or contact the demo project desk at ${HOSTEL_EMAIL}.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: `Application Update [${applicationNumber}] - KP Hostel Portal`,
    html: emailWrapper(content, "Application Update"),
    text: `Dear ${name},

Your admission application ${applicationNumber} could not be approved at this time.
${reason ? `\nReview Notes: ${reason}\n` : ''}
Log in to your student portal for details: ${APP_URL}`
  };
}

/**
 * Account Deletion Template
 */
export function accountDeletionTemplate(name: string): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <h2 style="margin: 0 0 14px; color: #B91C1C; font-size: 20px; font-weight: 700;">
          Account Deletion Confirmation
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Your account and corresponding personal records have been removed from the KP Hostel portal database.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 16px;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #991B1B; font-weight: 600;">
                Notice:
              </p>
              <ul style="margin: 0; padding-left: 18px; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
                <li>All profile data and application associations have been cleared.</li>
                <li>This operation is permanent.</li>
              </ul>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Account Removed - KP Hostel Portal",
    html: emailWrapper(content, "Account Removed"),
    text: `Dear ${name},

Your account has been permanently removed from the KP Hostel portal system.`
  };
}

/**
 * Admission Activated Template
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
        <h2 style="margin: 0 0 14px; color: #1E40AF; font-size: 20px; font-weight: 700;">
          Hostel Residency Activated
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Your residency enrollment on the hostel portal is now officially active.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 18px;">
              <p style="margin: 0 0 10px; font-size: 13px; font-weight: 700; color: #1E40AF; text-transform: uppercase;">
                Allotment Record
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; font-size: 13px; color: #1E40AF;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Block:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">Block ${block}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Room:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">${roomNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Commencement Date:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">${new Date(admissionStartDate).toLocaleDateString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;"><strong>Expiry Date:</strong></td>
                  <td style="padding: 4px 0; text-align: right;">${new Date(admissionEndDate).toLocaleDateString('en-IN')}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 28px 0 10px;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/student/dashboard" class="cta-button" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                Open Student Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Admission Activated - KP Hostel Portal",
    html: emailWrapper(content, "Admission Activated"),
    text: `Dear ${name},

Your residency admission has been activated on the KP Hostel portal.

Block: ${block}
Room: ${roomNumber}
Valid: ${new Date(admissionStartDate).toLocaleDateString('en-IN')} to ${new Date(admissionEndDate).toLocaleDateString('en-IN')}

Access dashboard: ${APP_URL}/student/dashboard`
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
        <h2 style="margin: 0 0 14px; color: #B45309; font-size: 20px; font-weight: 700;">
          Semester Fee Reminder
        </h2>
        
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          This is an automated advisory regarding the semester fee schedule for <strong>${semester}</strong>.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FEF3C7; border-left: 4px solid #D97706; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 18px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; color: #92400E; font-weight: 600;">
                Scheduled Amount
              </p>
              <p style="margin: 0; font-size: 28px; color: #92400E; font-weight: 700;">
                &#8377;${amount.toLocaleString('en-IN')}
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #92400E;">
                Due by: <strong>${new Date(dueDate).toLocaleDateString('en-IN')}</strong>
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 20px 0 0; font-size: 13px; color: #6B7280; line-height: 1.6;">
          Please refer to the fees and payments section on your student portal for instructions.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: `Fee Schedule Advisory (${semester}) - KP Hostel Portal`,
    html: emailWrapper(content, "Fee Advisory"),
    text: `Dear ${name},

This is an automated advisory regarding scheduled fees for ${semester}.

Amount: INR ${amount.toLocaleString('en-IN')}
Due Date: ${new Date(dueDate).toLocaleDateString('en-IN')}

Portal: ${APP_URL}`
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
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          A password reset request was initiated for your portal account. Click the button below to specify a new password:
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 26px 0;">
          <tr>
            <td align="center">
              <a href="${resetLink}" class="cta-button" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 16px;">
              <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                <strong>Security Notice:</strong> This reset link will expire in <strong>1 hour</strong>. If you did not initiate this request, you may safely disregard this message.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 20px 0 0; font-size: 12px; color: #9CA3AF; word-break: break-all;">
          Direct link: <a href="${resetLink}" style="color: ${PRIMARY_COLOR};">${resetLink}</a>
        </p>
      </td>
    </tr>
  `;

  return {
    subject: "Password Reset Request - KP Hostel Portal",
    html: emailWrapper(content, "Password Reset"),
    text: `Dear ${name},

A password reset was requested for your account.

Link (valid for 1 hour): ${resetLink}

If you did not request this, please disregard.`
  };
}

/**
 * OTP Verification Email Template
 */
export function getOTPEmailTemplate(name: string, otp: string): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Your one-time security verification code is:
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F4F6; border: 2px dashed ${PRIMARY_COLOR}; border-radius: 6px;">
                <tr>
                  <td style="padding: 16px 36px;">
                    <span style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: ${PRIMARY_COLOR}; font-family: monospace;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin: 16px 0 0; font-size: 12px; color: #6B7280; text-align: center;">
          This code is valid for 10 minutes. Never share this code with anyone.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: "Verification Code - KP Hostel Portal",
    html: emailWrapper(content, "Verification Code"),
    text: `Dear ${name},

Your security verification code is: ${otp}

This code will expire in 10 minutes.`
  };
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmailTemplate(name: string): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 32px 24px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #111827;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; color: #374151; line-height: 1.6;">
          Welcome to the <strong>KP Hostel Student Portal</strong>. Your user profile has been successfully set up.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; margin: 20px 0;">
          <tr>
            <td class="info-card" style="padding: 18px;">
              <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #0F172A;">
                Available Portal Features:
              </p>
              <ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 13px; line-height: 1.7;">
                <li>Submit and monitor hostel admission applications</li>
                <li>View announcements, schedules, and important notices</li>
                <li>Manage your resident profile and security settings</li>
              </ul>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 26px 0 10px;">
          <tr>
            <td align="center">
              <a href="${APP_URL}/student/dashboard" class="cta-button" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                Enter Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: "Welcome to KP Hostel Portal",
    html: emailWrapper(content, "Welcome"),
    text: `Dear ${name},

Welcome to the KP Hostel Student Portal. Your profile is ready.

Login: ${APP_URL}/student/dashboard`
  };
}

/**
 * Admin Message Template - For broadcast messages sent via the portal
 */
export function adminMessageTemplate(
  recipientName: string,
  subject: string,
  messageContent: string,
  senderName: string = "Hostel Portal System"
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 28px 24px;">
        <h2 style="margin: 0 0 14px; color: #1F2937; font-size: 20px; font-weight: 600;">
          Portal Notification
        </h2>

        <p style="margin: 0 0 18px; color: #4B5563; font-size: 14px;">
          Dear ${recipientName},
        </p>

        <!-- Message Content -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F9FAFB; border-left: 4px solid ${PRIMARY_COLOR}; border-radius: 6px; margin: 18px 0;">
          <tr>
            <td class="info-card" style="padding: 18px;">
              <h3 style="margin: 0 0 10px; color: #111827; font-size: 16px; font-weight: 600;">
                ${subject}
              </h3>
              <div style="color: #374151; font-size: 14px; line-height: 1.7;">
                ${messageContent}
              </div>
            </td>
          </tr>
        </table>

        <p style="margin: 20px 0 0; color: #6B7280; font-size: 12px; line-height: 1.5;">
          Dispatched by: <strong>${senderName}</strong> via KP Hostel Demonstration Portal.
        </p>
      </td>
    </tr>
  `;

  return {
    subject: `[Portal Notice] ${subject}`,
    html: emailWrapper(content, `Notification: ${subject}`),
    text: `Dear ${recipientName},

Subject: ${subject}

${messageContent.replace(/<[^>]*>/g, '')}

Dispatched by: ${senderName}
KP Hostel Project Demo Platform: ${APP_URL}`
  };
}

/**
 * Contact Form Submission Template
 */
export function contactFormSubmissionTemplate(
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
): EmailTemplate {
  const content = `
    <tr>
      <td class="email-body" style="padding: 28px 24px;">
        <h2 style="margin: 0 0 14px; color: #111827; font-size: 20px; font-weight: 600;">
          New Contact Submission
        </h2>

        <p style="margin: 0 0 18px; font-size: 14px; color: #4B5563;">
          A demonstration message has been submitted through the contact form:
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; margin: 18px 0; font-size: 13px;">
          <tr>
            <td style="padding: 16px;">
              <p style="margin: 0 0 8px;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
            </td>
          </tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 6px; margin: 18px 0;">
          <tr>
            <td style="padding: 16px;">
              <p style="margin: 0 0 6px; font-weight: 600; color: #374151; font-size: 13px;">Message Content:</p>
              <p style="margin: 0; font-size: 13px; color: #1F2937; line-height: 1.6; white-space: pre-wrap;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return {
    subject: `[Contact Form Demo] ${subject}`,
    html: emailWrapper(content, "Contact Form Message"),
    text: `Contact Form Submission (Project Demo)

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}`
  };
}
