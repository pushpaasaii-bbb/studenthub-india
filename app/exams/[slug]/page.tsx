import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ExamDetailsClient from "./ExamDetailsClient";

export const dynamic = "force-dynamic";

type Exam = {
  id: number;
  exam_name: string;
  slug: string;
  category: string | null;
  conducting_body: string | null;
  level: string | null;
  application_start: string | null;
  application_end: string | null;
  exam_date: string | null;
  official_website: string | null;
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: string | null;
  status: string | null;
};

type Props = {
  params: {
    slug: string;
  };
};

function getSiteUrl() {
  const requestHeaders = headers();

  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "localhost:3000";

  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

async function getPublishedExam(slug: string) {
  const { data, error } = await supabase
    .from("exams")
    .select(
      "id, exam_name, slug, category, conducting_body, level, application_start, application_end, exam_date, official_website, source_name, source_url, last_verified_at, verification_status, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return data as Exam;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exam = await getPublishedExam(params.slug);

  if (!exam) {
    return {
      title: "Exam Not Found | StudentHub India",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/exams/${exam.slug}`;
  const description = `${exam.exam_name}${
    exam.conducting_body ? ` conducted by ${exam.conducting_body}` : ""
  }. Check official exam information, dates, and application details on StudentHub India.`;

  return {
    title: `${exam.exam_name} | StudentHub India`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${exam.exam_name} | StudentHub India`,
      description,
      url: pageUrl,
      type: "website",
      siteName: "StudentHub India",
    },
  };
}

export default async function ExamDetailsPage({ params }: Props) {
  const exam = await getPublishedExam(params.slug);

  if (!exam) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/exams/${exam.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: exam.exam_name,
    url: pageUrl,
    description: `${exam.exam_name}${
      exam.conducting_body ? ` conducted by ${exam.conducting_body}` : ""
    }.`,
    isPartOf: {
      "@type": "WebSite",
      name: "StudentHub India",
      url: siteUrl,
    },
    about: {
      "@type": "EducationalOccupationalProgram",
      name: exam.exam_name,
      provider: exam.conducting_body
        ? {
            "@type": "Organization",
            name: exam.conducting_body,
          }
        : undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <ExamDetailsClient exam={exam} />
    </>
  );
}