"use client";

import * as React from "react";
import { Send, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from "@/components/ui";

export default function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    inquiryType: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "c-name"
        ? "name"
        : id === "c-email"
        ? "email"
        : id === "c-subject"
        ? "subject"
        : id === "c-type"
        ? "inquiryType"
        : "message"]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error("Please enter a message of at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => ({}));

      if (json.success) {
        toast.success(
          json.message || "Your message has been sent successfully!"
        );
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          inquiryType: "general",
          message: "",
        });
      } else {
        toast.error(json.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Could not send your message. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border-[#E2E8F0] overflow-hidden">
      <CardHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0] pb-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#0F172A]">Send us a message</CardTitle>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Direct Email Delivery
          </span>
        </div>
        <p className="text-[#64748B] text-sm mt-1.5">
          Fill out the form below. Your message will be delivered immediately to our administrative team.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        {isSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-emerald-900">Message sent successfully!</p>
              <p className="text-emerald-700 mt-0.5">
                We have notified our team at <strong>vandanarajpoot69@gmail.com</strong>. A confirmation email has also been sent to your inbox.
              </p>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="c-name" className="label-base block text-sm font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="c-name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="c-email" className="label-base block text-sm font-medium text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="c-email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="c-subject" className="label-base block text-sm font-medium text-slate-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                id="c-subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label htmlFor="c-type" className="label-base block text-sm font-medium text-slate-700 mb-1">
                Inquiry Type
              </label>
              <select
                id="c-type"
                value={formData.inquiryType}
                onChange={handleChange}
                className="input-base w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-10"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing & Refunds</option>
                <option value="partnership">Partnerships</option>
                <option value="press">Press & Media</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="c-message" className="label-base block text-sm font-medium text-slate-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="c-message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us a little more about what you need (at least 10 characters)..."
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-12 px-7 shadow-sm rounded-xl"
              rightIcon={!isSubmitting ? <Send className="h-4 w-4" /> : null}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending to vandanarajpoot69@gmail.com…
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
