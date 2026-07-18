"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type SavedScholarship = {
  scholarship_slug: string;
};

type ScholarshipDeadline = {
  name: string;
  slug: string;
  application_end: string;
  source_name: string;
  official_website: string;
};

export default function ScholarshipAlertsPage() {
  const [scholarships, setScholarships] = useState<ScholarshipDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadScholarshipDeadlines = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data: savedItems, error: savedError } = await supabase
        .from("saved_scholarships")
        .select("scholarship_slug")
        .eq("user_id", user.id);

      if (savedError) {
        console.error("Could not load saved scholarships:", savedError);
        setErrorMessage("Could not load your saved scholarships.");
        setLoading(false);
        return;
      }

      const savedSlugs = (savedItems as SavedScholarship[]).map(
        (item) => item.scholarship_slug
      );

      if (savedSlugs.length === 0) {
        setLoading(false);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("scholarships")
        .select("name, slug, application_end, source_name, official_website")
        .in("slug", savedSlugs)
        .eq("status", "published")
        .not("application_end", "is", null)
        .not("source_name", "is", null)
        .not("official_website", "is", null)
        .gte("application_end", today)
        .order("application_end", { ascending: true });

      if (error) {
        console.error("Could not load scholarship deadlines:", error);
        setErrorMessage("Could not load verified scholarship deadlines.");
        setLoading(false);
        return;
      }

      setScholarships((data || []) as ScholarshipDeadline[]);
      setLoading(false);
    };

    loadScholarshipDeadlines();
  }, []);

  const formatDate = (value: string) => {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-400">
          Loading verified scholarship deadlines...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="mt-5 text-4xl font-bold text-slate-900 dark:text-white">
        Scholarship Deadline Alerts
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Only published scholarships with an official source and future deadline
        are shown here.
      </p>

      {errorMessage && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      {!errorMessage && scholarships.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No verified upcoming deadlines found in your saved scholarships.
        </div>
      )}

      {scholarships.length > 0 && (
        <section className="mt-8 space-y-4">
          {scholarships.map((scholarship) => (
            <Link
              key={scholarship.slug}
              href={`/scholarships/${scholarship.slug}`}
              className="block rounded-2xl border border-orange-200 bg-white p-6 shadow-sm transition hover:border-orange-500 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Apply by: {formatDate(scholarship.application_end)}
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {scholarship.name}
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Verified source: {scholarship.source_name}
              </p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}