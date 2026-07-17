"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SaveScholarshipButton from "../../components/SaveScholarshipButton";
import ViewHistoryTracker from "../../components/ViewHistoryTracker";
import { supabase } from "../../lib/supabase";

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

export default function ScholarshipDetailsPage() {
  const params = useParams<{ slug: string }>();

  const [scholarship, setScholarship] =
    useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadScholarship = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("scholarships")
        .select(
          "id, name, slug, provider, category, eligibility, amount, application_start, application_end, official_website, description, status"
        )
        .eq("slug", params.slug)
        .eq("status", "published")
        .maybeSingle();

      if (error || !data) {
        console.error("Could not load scholarship:", error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setScholarship(data);
      setLoading(false);
    };

    if (params.slug) {
      loadScholarship();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-center text-slate-600 dark:text-slate-400">
          Loading scholarship details...
        </p>
      </main>
    );
  }

  if (notFound || !scholarship) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Scholarship not found
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          This scholarship may be unavailable or is no longer published.
        </p>

        <Link
          href="/scholarships"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Back to Scholarships
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ViewHistoryTracker
        contentType="scholarship"
        contentId={scholarship.id}
        contentSlug={scholarship.slug}
        contentTitle={scholarship.name}
      />

      <Link
        href="/scholarships"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Scholarships
      </Link>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-900">
        {scholarship.category && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {scholarship.category}
          </span>
        )}

        <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
          {scholarship.name}
        </h1>

        {scholarship.provider && (
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Provided by {scholarship.provider}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Scholarship Amount
            </p>

            <p className="mt-1 text-xl font-bold text-blue-700">
              {scholarship.amount || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl bg-red-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Application Deadline
            </p>

            <p className="mt-1 text-xl font-bold text-red-600">
              {scholarship.application_end || "Not specified"}
            </p>
          </div>
        </div>

        {scholarship.description && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              About this Scholarship
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">
              {scholarship.description}
            </p>
          </section>
        )}

        {scholarship.eligibility && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Eligibility
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">
              {scholarship.eligibility}
            </p>
          </section>
        )}

        <section className="mt-10 grid gap-4 rounded-xl border border-slate-200 p-5 dark:border-slate-700 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Application Start
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {scholarship.application_start || "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Application End
            </p>

            <p className="mt-1 font-semibold text-slate-900 dark:text-white">
              {scholarship.application_end || "Not specified"}
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          {scholarship.official_website && (
            <a
              href={scholarship.official_website}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Apply on Official Website
            </a>
          )}

          <SaveScholarshipButton
            scholarshipName={scholarship.name}
            scholarshipSlug={scholarship.slug}
          />
        </div>
      </article>
    </main>
  );
}