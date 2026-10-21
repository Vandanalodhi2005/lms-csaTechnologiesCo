import { NextResponse } from "next/server";
import { z } from "zod";
import { sendFormNotificationToAdmin, sendEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Please provide a valid email address").trim().toLowerCase(),
  subject: z.string().min(2, "Subject must be at least 2 characters").trim(),
  inquiryType: z.string().default("general"),
  message: z.string().min(10, "Message must be at least 10 characters").trim(),
});

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
    }

    const { name, email, subject, inquiryType, message } = parsed.data;

    // 1. Send all contact form data to the admin email: vandanarajpoot69@gmail.com
    const adminNotification = await sendFormNotificationToAdmin({
      formType: "Contact Us Inquiry",
      title: `New Message: "${subject}" from ${name}`,
      data: {
        "Sender Name": name,
        "Sender Email": email,
        "Inquiry Type": inquiryType,
        "Subject": subject,
        "Message Content": message,
        "Submitted At": new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      },
      userEmail: email,
    });

    // 2. Send acknowledgment email to the submitter
    sendEmail({
      to: email,
      subject: `We've received your message: "${subject}" - EduLearn Support`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 30px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px;">EduLearn Support</h2>
          </div>
          <div style="padding: 28px; color: #334155; line-height: 1.6;">
            <p style="font-size: 16px; font-weight: 600; color: #0f172a;">Hi ${name},</p>
            <p>Thank you for getting in touch with us! We have received your inquiry regarding "<strong>${subject}</strong>".</p>
            <p>Our team typically reviews all messages within 24 hours. Here is a summary of what you submitted:</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;"><strong>Type:</strong> ${inquiryType}</p>
              <p style="margin: 0; font-size: 14px; color: #1e293b; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #64748b; font-size: 13px;">If you have any urgent follow-ups, feel free to reply directly to this email.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 EduLearn Platform. All rights reserved.
          </div>
        </div>
      `,
    }).catch((err) => console.error("[Contact Route] Acknowledgement email error:", err.message));

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! Your message has been sent successfully. We will reply shortly.",
      notificationSent: adminNotification.success,
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
