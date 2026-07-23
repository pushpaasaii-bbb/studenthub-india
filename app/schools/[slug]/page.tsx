import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import SchoolDetailsClient from "./SchoolDetailsClient";

export const dynamic = "force-dynamic";

type School = {
  id: number;
  name: string;
  slug: string;
  state: string | null;
  city: string | null;
  type: string | null;
  board: string | null;
  website: string | null;
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

async function getPublishedSchool(slug: string) {
  const { data, error } = await supabase
    .from("schools")
    .select(
      "id, name, slug, state, city, type, board, website, source_name, source_url, last_verified_at, verification_status, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return data as School;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = await getPublishedSchool(params.slug);

  if (!school) {
    return {
      title: "School Not Found | StudentHub India",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/schools/${school.slug}`;
  const location = [school.city, school.state].filter(Boolean).join(", ");
  const description = `${school.name}${
    location ? ` in ${location}` : ""
  }. Check school information on StudentHub India.`;

  return {
    title: `${school.name} | StudentHub India`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${school.name} | StudentHub India`,
      description,
      url: pageUrl,
      type: "website",
      siteName: "StudentHub India",
    },
  };
}

export default async function SchoolDetailsPage({ params }: Props) {
  const school = await getPublishedSchool(params.slug);

  if (!school) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/schools/${school.slug}`;
  const location = [school.city, school.state].filter(Boolean).join(", ");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: school.name,
    url: pageUrl,
    description: `${school.name}${
      location ? ` in ${location}` : ""
    }.`,
    isPartOf: {
      "@type": "WebSite",
      name: "StudentHub India",
      url: siteUrl,
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

      <SchoolDetailsClient school={school} />
    </>
  );
}