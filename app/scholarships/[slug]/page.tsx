import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ScholarshipDetailsClient from "./ScholarshipDetailsClient";

export const dynamic = "force-dynamic";

type Scholarship = {
  id: number;
  name: string;
  slug: string;
  provider: string | null;
  category: string | null;
  eligibility: string | null;
  amount: string | null;
  application_start: string | null;
  application_end: string | null;
  official_website: string | null;
  description: string | null;
  status: string;
};

type Props = {
  params: {
    slug: string;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase public environment variables are missing.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getSiteUrl() {
  const requestHeaders = headers();
  const host =
    requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host?.startsWith("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://studenthub-india-c3rc7a3l-pushpaasaii-bbbs-projects.vercel.app"
  ).replace(/\/$/, "");
}

async function getPublishedScholarship(slug: string) {
  const { data, error } = await supabase
    .from("scholarships")
    .select(
      "id, name, slug, provider, category, eligibility, amount, application_start, application_end, official_website, description, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Scholarship;
}

function getScholarshipDescription(scholarship: Scholarship) {
  if (scholarship.description) {
    return scholarship.description.slice(0, 155);
  }

  return [
    scholarship.name,
    scholarship.provider ? `by ${scholarship.provider}` : null,
    "on StudentHub India.",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const scholarship = await getPublishedScholarship(params.slug);

  if (!scholarship) {
    return {
      title: "Scholarship Not Found | StudentHub India",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${getSiteUrl()}/scholarships/${scholarship.slug}`;
  const description = getScholarshipDescription(scholarship);

  return {
    title: `${scholarship.name} | StudentHub India`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${scholarship.name} | StudentHub India`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "StudentHub India",
    },
  };
}

export default async function ScholarshipDetailsPage({ params }: Props) {
  const scholarship = await getPublishedScholarship(params.slug);

  if (!scholarship) {
    notFound();
  }

  const canonicalUrl = `${getSiteUrl()}/scholarships/${scholarship.slug}`;

  const scholarshipSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: scholarship.name,
    url: canonicalUrl,
    description: getScholarshipDescription(scholarship),
    ...(scholarship.provider
      ? {
          provider: {
            "@type": "Organization",
            name: scholarship.provider,
          },
        }
      : {}),
    ...(scholarship.official_website
      ? { mainEntityOfPage: scholarship.official_website }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(scholarshipSchema).replace(/</g, "\\u003c"),
        }}
      />

      <ScholarshipDetailsClient scholarship={scholarship} />
    </>
  );
}