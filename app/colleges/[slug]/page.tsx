import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CollegeDetailsClient from "./CollegeDetailsClient";

export const dynamic = "force-dynamic";

type College = {
  id: number;
  name: string;
  slug: string;
  college_type: string | null;
  state: string | null;
  city: string | null;
  university: string | null;
  course_types: string[] | null;
  naac_grade: string | null;
  nirf_rank: number | null;
  average_fees: string | null;
  average_package: string | null;
  highest_package: string | null;
  established_year: number | null;
  ownership: string | null;
  hostel: boolean | null;
  official_website: string | null;
  description: string | null;
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: string | null;
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

async function getPublishedCollege(slug: string) {
  const { data, error } = await supabase
    .from("colleges")
    .select(
      "id, name, slug, college_type, state, city, university, course_types, naac_grade, nirf_rank, average_fees, average_package, highest_package, established_year, ownership, hostel, official_website, description, source_name, source_url, last_verified_at, verification_status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as College;
}

function getCollegeDescription(college: College) {
  if (college.description) {
    return college.description.slice(0, 155);
  }

  const location = [college.city, college.state].filter(Boolean).join(", ");

  return [
    college.name,
    college.college_type,
    location ? `in ${location}` : null,
    "on StudentHub India.",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const college = await getPublishedCollege(params.slug);

  if (!college) {
    return {
      title: "College Not Found | StudentHub India",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${getSiteUrl()}/colleges/${college.slug}`;
  const description = getCollegeDescription(college);

  return {
    title: `${college.name} | StudentHub India`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${college.name} | StudentHub India`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "StudentHub India",
    },
  };
}

export default async function CollegeDetailsPage({ params }: Props) {
  const college = await getPublishedCollege(params.slug);

  if (!college) {
    notFound();
  }

  const canonicalUrl = `${getSiteUrl()}/colleges/${college.slug}`;

  const collegeSchema = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: college.name,
    url: canonicalUrl,
    description: getCollegeDescription(college),
    address: {
      "@type": "PostalAddress",
      ...(college.city ? { addressLocality: college.city } : {}),
      ...(college.state ? { addressRegion: college.state } : {}),
      addressCountry: "IN",
    },
    ...(college.official_website
      ? { sameAs: college.official_website }
      : {}),
    ...(college.established_year
      ? { foundingDate: String(college.established_year) }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collegeSchema).replace(/</g, "\\u003c"),
        }}
      />

      <CollegeDetailsClient college={college} />
    </>
  );
}