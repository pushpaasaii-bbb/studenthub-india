import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import SaveCareerButton from "../../components/SaveCareerButton";
import ViewHistoryTracker from "../../components/ViewHistoryTracker";
import { getCareer } from "../../lib/careers";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = await getCareer(params.slug);

  if (!career) {
    return {
      title: "Career Not Found | StudentHub India",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/careers/${career.slug}`;
  const description = `${career.title}. Explore qualification, skills, career roadmap, salary information, and future scope on StudentHub India.`;

  return {
    title: `${career.title} | StudentHub India`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${career.title} | StudentHub India`,
      description,
      url: pageUrl,
      type: "website",
      siteName: "StudentHub India",
    },
  };
}

export default async function CareerDetailsPage({ params }: Props) {
  const career = await getCareer(params.slug);

  if (!career) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/careers/${career.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: career.title,
    url: pageUrl,
    description: `${career.title}. Career information on StudentHub India.`,
    isPartOf: {
      "@type": "WebSite",
      name: "StudentHub India",
      url: siteUrl,
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <ViewHistoryTracker
        contentType="career"
        contentId={career.id}
        contentSlug={career.slug}
        contentTitle={career.title}
      />

      <Link href="/jobs/a-z" className="font-semibold text-blue-700">
        ← Back to A–Z Careers
      </Link>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-700">
          {career.category}
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
          {career.title}
        </h1>

        <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
          {career.description}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Qualification</p>

            <p className="mt-1 font-semibold">{career.qualification}</p>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Average Salary</p>

            <p className="mt-1 font-semibold">{career.average_salary}</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold">Required Skills</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {career.skills?.map((skill: string) => (
            <span
              key={skill}
              className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700"
            >
              {skill}
            </span>
          ))}
        </div>

        <h2 className="mt-8 text-2xl font-bold">Future Scope</h2>

        <p className="mt-3 leading-8 text-slate-700 dark:text-slate-300">
          {career.scope}
        </p>

        <h2 className="mt-8 text-2xl font-bold">Roadmap</h2>

        <p className="mt-3 leading-8 text-slate-700 dark:text-slate-300">
          {career.roadmap}
        </p>

        <div className="mt-10">
          <SaveCareerButton
            careerTitle={career.title}
            careerSlug={career.slug}
          />
        </div>
      </section>
    </main>
  );
}