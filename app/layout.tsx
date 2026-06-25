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

export const metadata: Metadata = {
  title: "StudentHub India",
  description:
    "Your complete student guide for colleges, exams, jobs, scholarships and tools in India.",
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