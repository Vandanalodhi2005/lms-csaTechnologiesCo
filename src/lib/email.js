import nodemailer from "nodemailer";

const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const SMTP_CONFIGURATION_ERROR = "SMTP configuration is incomplete. Set EMAIL_USER and EMAIL_PASS.";
const EMAIL_DELIVERY_ERROR = "Email delivery failed. Check SMTP configuration and provider status.";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

// Create reusable transporter
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Low-level sender
 */
export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(`[Email Error] ${SMTP_CONFIGURATION_ERROR}`);
    return { success: false, error: SMTP_CONFIGURATION_ERROR };
  }

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: `"EduLearn Platform" <${EMAIL_USER}>`,
      to,
      replyTo: replyTo || EMAIL_USER,
      subject,
      text: text || html?.replace(/<[^>]+>/g, " ") || "",
      html,
    });
    console.log(`[Email] Sent successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] ${EMAIL_DELIVERY_ERROR}`);
    return { success: false, error: EMAIL_DELIVERY_ERROR };
  }
}

/** Send notification with form data to the configured admin recipient. */
export async function sendFormNotificationToAdmin({
  formType = "General Form",
  title = "New Form Submission Received",
  data = {},
  userEmail = null,
}) {
  if (!ADMIN_NOTIFICATION_EMAIL) {
    console.error("[Email Error] Admin notification recipient is not configured.");
    return {
      success: false,
      error: "Admin notification email is not configured. Set ADMIN_NOTIFICATION_EMAIL or NEXT_PUBLIC_CONTACT_EMAIL.",
    };
  }

  const dateFormatted = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const rowsHtml = Object.entries(data)
    .filter(([key]) => !["password", "confirmPassword", "passwordHash"].includes(key.toLowerCase()))
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      const displayVal =
        typeof value === "object" && value !== null
          ? JSON.stringify(value, null, 2)
          : String(value ?? "N/A");

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 16px; font-weight: 600; color: #475569; width: 35%; background-color: #f8fafc; font-size: 14px; text-transform: capitalize;">
            ${label}
          </td>
          <td style="padding: 12px 16px; color: #0f172a; font-size: 14px; word-break: break-word;">
            ${displayVal}
          </td>
        </tr>
      `;
    })
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 28px 32px; text-align: left;">
                    <div style="display: inline-block; padding: 4px 10px; background-color: rgba(37,99,235,0.3); border: 1px solid rgba(147,197,253,0.4); border-radius: 6px; color: #93c5fd; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      ${formType}
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
                      ${title}
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">
                      Timestamp: ${dateFormatted} (IST)
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 24px 32px;">
                    <p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.5;">
                      A new submission was submitted on the <strong>EduLearn LMS</strong> portal. Below are the details collected:
                    </p>

                    <!-- Table of submission data -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px; border-collapse: collapse;">
                      ${rowsHtml}
                    </table>

                    ${
                      userEmail
                        ? `
                      <div style="text-align: center; margin-top: 20px;">
                        <a href="mailto:${userEmail}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(37,99,235,0.25);">
                          Reply Directly to ${userEmail}
                        </a>
                      </div>
                    `
                        : ""
                    }
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center; color: #64748b; font-size: 12px;">
                    Sent automatically by EduLearn Platform to <strong style="color: #0f172a;">${ADMIN_NOTIFICATION_EMAIL}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    replyTo: userEmail || ADMIN_NOTIFICATION_EMAIL,
    subject: `[EduLearn Alert] ${formType}: ${title}`,
    html: emailHtml,
  });
}

/**
 * Send welcome email to a new Student or Instructor
 */
export async function sendWelcomeEmail({ to, name, role }) {
  const roleLabel = role === "instructor" ? "Instructor" : "Student";
  const portalUrl =
    role === "instructor"
      ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/instructor/dashboard`
      : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/student/dashboard`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Welcome to EduLearn</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #0f2f5f; padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800;">Edu<span style="color: #38bdf8;">Learn</span></h1>
            <p style="color: #93c5fd; margin: 8px 0 0 0; font-size: 14px;">Welcome to our learning community</p>
          </div>
          <div style="padding: 32px; color: #334155; line-height: 1.6;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Hello, ${name}!</h2>
            <p>Your <strong>${roleLabel}</strong> account has been successfully created on EduLearn.</p>
            <p>You can now explore thousands of curated courses, track your learning journey, and achieve certifications.</p>
            
            <div style="margin: 28px 0; text-align: center;">
              <a href="${portalUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
                Go to Your ${roleLabel} Portal
              </a>
            </div>

            <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
              If you did not create this account, please ignore this email or contact support at ${ADMIN_NOTIFICATION_EMAIL}.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
            © 2026 EduLearn Platform. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Welcome to EduLearn, ${name}!`,
    html,
  });
}

export async function sendVerificationEmail({ to, name, verificationUrl }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f8fafc; padding: 30px;">
        <div style="max-width: 550px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">Verify your EduLearn email</h2>
          <p style="color: #475569;">Hello ${escapeHtml(name || "there")},</p>
          <p style="color: #475569;">Please verify your email address to activate your EduLearn account.</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${escapeHtml(verificationUrl)}" style="background-color: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Verify Email Address</a>
          </div>
          <p style="color: #64748b;">This link expires in 24 hours. If you did not create this account, you can ignore this email.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "EduLearn: Verify your email address",
    html,
    text: `Verify your EduLearn email address: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({ to, name, resetUrl, token }) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f8fafc; padding: 30px;">
        <div style="max-width: 550px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #475569;">Hello ${name || "there"},</p>
          <p style="color: #475569;">We received a request to reset your password for your EduLearn account.</p>
          ${
            resetUrl
              ? `
            <div style="margin: 24px 0; text-align: center;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
            </div>
          `
              : ""
          }
          <p style="color: #475569;">Or use this verification code:</p>
          <div style="background: #f1f5f9; padding: 12px; text-align: center; font-size: 20px; font-weight: 700; letter-spacing: 4px; border-radius: 6px; color: #0f172a;">
            ${token}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This code will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "EduLearn: Password Reset Request",
    html,
  });
}
