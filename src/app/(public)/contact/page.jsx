import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge, Input, Textarea } from "@/components/ui";
import FAQItem from "@/components/forms/FAQItem.jsx";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@learnhub.com",
    href: "mailto:support@learnhub.com",
    description: "We respond within 24 hours on weekdays",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 90000 00000",
    href: "tel:+919000000000",
    description: "Mon - Fri, 9am to 6pm IST",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "Bengaluru, India",
    href: "#",
    description: "123 Education Street, Innovation Hub",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Fri · 9am - 6pm",
    href: "#",
    description: "Support is 24/7 via email and chat",
  },
];

const socials = [
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
];

const FAQS = [
  {
    q: "How do I enroll in a course?",
    a: "Simply browse our course catalog, pick a course you like, and click Enroll. You can pay securely via Razorpay or UPI. Once paid, you get lifetime access to all course materials.",
  },
  {
    q: "Can I get a refund if I don't like the course?",
    a: "Absolutely. We offer a no-questions-asked 30-day money back guarantee on every paid course. Just reach out to support and we'll process your refund within 3-5 business days.",
  },
  {
    q: "Do I get a certificate after completing a course?",
    a: "Yes. All course completion certificates are verified with a unique code and can be shared directly to LinkedIn, added to your resume, or verified publicly on our certificate verification page.",
  },
];

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the LearnHub team. We're here to help with course questions, billing, partnerships, and anything else you might need.",
  keywords:
    "contact learnhub, support, help center, customer service, partnerships, sales contact",
  openGraph: {
    title: "Contact Us | LearnHub",
    description:
      "Get in touch with the LearnHub team. We're here to help with course questions, billing, partnerships, and more.",
    url: `${baseUrl}/contact`,
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact LearnHub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | LearnHub",
    description: "Get in touch with the LearnHub team. We're here to help.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: `${baseUrl}/contact` },
};

function FAQAccordion({ faqs }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <FAQItem key={idx} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 via-transparent to-[#16A34A]/5" />
        <div className="relative container-page py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-5 px-4 py-1.5">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-[#2563EB]" />
              Contact Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight">
              We&apos;d love to hear from you
            </h1>
            <p className="mt-5 text-lg text-[#64748B] leading-relaxed">
              Questions about a course? Want to partner with us? Need help with billing?
              Our friendly team is here for you, every step of the way.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
              Get in touch
            </h2>
            <p className="text-[#64748B] leading-relaxed">
              Pick any channel that works for you. We typically reply within one business day.
            </p>
            <div className="space-y-3">
              {contactInfo.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-start gap-4 p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
                >
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-[#2563EB]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      {item.label}
                    </p>
                    <p className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {item.value}
                    </p>
                    <p className="text-sm text-[#64748B] mt-0.5">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-[#E2E8F0]">
              <p className="text-sm font-semibold text-[#0F172A] mb-3">Follow us</p>
              <div className="flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="h-10 w-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#475569] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-colors"
                  >
                    <s.icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-sm border-[#E2E8F0] overflow-hidden">
              <CardHeader className="bg-[#F8FAFC] border-b border-[#E2E8F0] pb-5">
                <CardTitle className="text-xl text-[#0F172A]">Send us a message</CardTitle>
                <p className="text-[#64748B] text-sm mt-1.5">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4" action="#">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="c-name" className="label-base">
                        Full Name
                      </label>
                      <Input id="c-name" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="c-email" className="label-base">
                        Email Address
                      </label>
                      <Input id="c-email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="c-subject" className="label-base">
                        Subject
                      </label>
                      <Input id="c-subject" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label htmlFor="c-type" className="label-base">
                        Inquiry Type
                      </label>
                      <select
                        id="c-type"
                        defaultValue="general"
                        className="input-base appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-10"
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
                    <label htmlFor="c-message" className="label-base">
                      Message
                    </label>
                    <Textarea
                      id="c-message"
                      rows={6}
                      placeholder="Tell us a little more about what you need..."
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 px-7 shadow-sm"
                      rightIcon={<Send className="h-4 w-4" />}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="container-page py-16 md:py-20">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-[#64748B]">
              Can&apos;t find what you&apos;re looking for? Reach out to our team above.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS} />
          </div>
        </div>
      </section>
    </div>
  );
}
