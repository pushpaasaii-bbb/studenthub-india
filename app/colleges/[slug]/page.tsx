"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SaveCollegeButton from "../../components/SaveCollegeButton";
import ViewHistoryTracker from "../../components/ViewHistoryTracker";
import { supabase } from "../../lib/supabase";

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

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getVerificationLabel = (status: string | null) => {
  if (status === "verified") return "Verified";
  if (status === "needs_review") return "Needs review";
  if (status === "outdated") return "May be outdated";

  return "Not verified";
};

const getVerificationStyle = (status: string | null) => {
  if (status === "verified") {
    return "bg-green-100 text-green-700";
  }

  if (status === "needs_review") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "outdated") {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
};

export default function CollegeDetailsPage() {
  const params = useParams<{ slug: string }>();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadCollege = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("colleges")
        .select(
          "id, name, slug, college_type, state, city, university, course_types, naac_grade, nirf_rank, average_fees, average_package, highest_package, established_year, ownership, hostel, official_website, description, source_name, source_url, last_verified_at, verification_status"
        )
        .eq("slug", params.slug)
        .eq("status", "published")
        .maybeSingle();

      if (error || !data) {
        console.error("Could not load college:", error);
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCollege(data);
      setLoading(false);
    };

    if (params.slug) {
      loadCollege();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-center text-slate-600 dark:text-slate-400">
          Loading college details...
        </p>
      </main>
    );
  }

  if (notFound || !college) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          College not found
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          This college may be unavailable or is no longer published.
        </p>

        <Link
          href="/colleges"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Back to Colleges
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <ViewHistoryTracker
        contentType="college"
        contentId={college.id}
        contentSlug={college.slug}
        contentTitle={college.name}
      />

      <Link
        href="/colleges"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Colleges
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          {college.college_type && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              {college.college_type}
            </span>
          )}

          {college.ownership && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {college.ownership}
            </span>
          )}

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getVerificationStyle(
              college.verification_status
            )}`}
          >
            {getVerificationLabel(college.verification_status)}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
          {college.name}
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          📍 {[college.city, college.state].filter(Boolean).join(", ") ||
            "Location not listed"}
        </p>

        {college.university && (
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            University: {college.university}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">NIRF Rank</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              {college.nirf_rank ? `#${college.nirf_rank}` : "Not listed"}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Average Fees</p>
            <p className="mt-1 text-2xl font-bold text-orange-600">
              {college.average_fees || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">College Type</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {college.college_type || "Not listed"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <p className="text-sm text-slate-500">Average Package</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {college.average_package || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <p className="text-sm text-slate-500">Highest Package</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {college.highest_package || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <p className="text-sm text-slate-500">Established</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {college.established_year || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <p className="text-sm text-slate-500">Hostel Facility</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {college.hostel ? "Available" : "Not listed"}
            </p>
          </div>
        </div>

        {college.description && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              About this College
            </h2>

            <p className="mt-3 whitespace-pre-line leading-8 text-slate-700 dark:text-slate-300">
              {college.description}
            </p>
          </section>
        )}

        {college.course_types && college.course_types.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Course Types
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {college.course_types.map((course) => (
                <span
                  key={course}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
                >
                  {course}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Source & Verification
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Source: {college.source_name || "Not listed"}
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Last verified: {formatDate(college.last_verified_at)}
              </p>
            </div>

            {college.source_url && (
              <a
                href={college.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-700"
              >
                View Source
              </a>
            )}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          {college.official_website && (
            <a
              href={college.official_website}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Visit Official Website
            </a>
          )}

          <SaveCollegeButton
            collegeName={college.name}
            collegeSlug={college.slug}
          />
        </div>
      </section>
    </main>
  );
}