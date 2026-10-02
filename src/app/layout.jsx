import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers.jsx";
import { getAuthUser } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "EduLearn — Learn New Skills With Expert-Led Online Courses",
    template: "%s | EduLearn",
  },
  description:
    "Learn practical skills with expert-led online courses in development, design, business, marketing, and more.",
  keywords: [
    "online courses",
    "EduLearn",
    "learning platform",
    "LMS",
    "e-learning",
    "certification",
    "coding courses",
    "online education",
    "skill development",
  ],
  authors: [{ name: "EduLearn Team" }],
  creator: "EduLearn",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "EduLearn",
    title: "EduLearn — Learn New Skills With Expert-Led Online Courses",
    description:
      "Learn practical skills with expert-led online courses in development, design, business, marketing, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduLearn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduLearn — Learn New Skills With Expert-Led Online Courses",
    description:
      "Learn practical skills with expert-led online courses in development, design, business, marketing, and more.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  let currentUser = null;
  try {
    currentUser = await getAuthUser();
  } catch {
    currentUser = null;
  }

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAFC] text-dark-900 antialiased">
        <Providers initialUser={currentUser}>{children}</Providers>
      </body>
    </html>
  );
}
