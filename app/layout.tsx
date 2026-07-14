import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFAB from "./WhatsAppFAB";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "StudentHub India | Colleges, Exams, Jobs & Scholarships",
    template: "%s | StudentHub India",
  },

  description:
    "Find colleges, entrance exams, jobs, scholarships, career guides and useful student tools across India.",

  keywords: [
    "StudentHub India",
    "colleges in India",
    "Indian colleges",
    "entrance exams India",
    "jobs for students",
    "scholarships India",
    "career guidance",
    "student tools",
  ],

  authors: [{ name: "StudentHub India" }],
  creator: "StudentHub India",
  publisher: "StudentHub India",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "StudentHub India",
    title: "StudentHub India | Colleges, Exams, Jobs & Scholarships",
    description:
      "Your complete student guide for colleges, exams, jobs, scholarships and tools in India.",
  },

  twitter: {
    card: "summary",
    title: "StudentHub India | Colleges, Exams, Jobs & Scholarships",
    description:
      "Your complete student guide for colleges, exams, jobs, scholarships and tools in India.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}