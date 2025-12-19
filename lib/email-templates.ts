interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getOTPEmailTemplate(name: string, otp: string): EmailTemplate {
  return {
    subject: "Verify Your Email - KP Vidhyarthi Bhavan",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Dear <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for registering with KP Vidhyarthi Bhavan. Please use the OTP below to verify your email:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%); padding: 20px 40px; border-radius: 8px;">
                  <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </p>
                </div>
              </div>
              <div style="background-color: #FFF4E6; border-left: 4px solid #FF8C00; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666666;">
                  <strong style="color: #FF8C00;">⏰ Important:</strong> This OTP is valid for <strong>10 minutes</strong> only.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                <strong>KP Vidhyarthi Bhavan</strong><br/>Premier Student Hostel in Ahmedabad
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Dear ${name},\n\nYour verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nKP Vidhyarthi Bhavan`
  };
}

export function getWelcomeEmailTemplate(name: string, role: string): EmailTemplate {
  return {
    subject: "Welcome to KP Vidhyarthi Bhavan!",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to KP Vidhyarthi Bhavan!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Dear <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Thank you for registering as a <strong style="color: #FF8C00;">${role}</strong>. We're excited to have you join our community!
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/${role === 'student' ? 'student' : 'admin'}/dashboard" 
                   style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                <strong>KP Vidhyarthi Bhavan</strong><br/>Premier Student Hostel in Ahmedabad
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Dear ${name},\n\nWelcome to KP Vidhyarthi Bhavan!\n\nThank you for registering as a ${role}.\n\nKP Vidhyarthi Bhavan`
  };
}

export function getPasswordResetEmailTemplate(name: string, resetLink: string): EmailTemplate {
  return {
    subject: "Reset Your Password - KP Vidhyarthi Bhavan",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                Dear <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                We received a request to reset your password. Click the button below:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <div style="background-color: #FFF4E6; border-left: 4px solid #FF8C00; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666666;">
                  <strong style="color: #FF8C00;">⏰ Important:</strong> This link is valid for <strong>1 hour</strong> only.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666666;">
                <strong>KP Vidhyarthi Bhavan</strong><br/>Premier Student Hostel in Ahmedabad
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `Dear ${name},\n\nReset your password: ${resetLink}\n\nThis link is valid for 1 hour.\n\nKP Vidhyarthi Bhavan`
  };
}
