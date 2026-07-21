"use client";

import Link from "next/link";
import SaveSchoolButton from "../../components/SaveSchoolButton";
import ViewHistoryTracker from "../../components/ViewHistoryTracker";

type School = {
  id: number;
  name: string;
  slug: string;
  state: string | null;
  city: string | null;
  type: string | null;
  board: string | null;
  website: string | null;
};

type Props = {
  school: School;
};

export default function SchoolDetailsClient({ school }: Props) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ViewHistoryTracker
        contentType="school"
        contentId={school.id}
        contentSlug={school.slug}
        contentTitle={school.name}
      />

      <Link
        href="/schools"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Schools
      </Link>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {school.type || "School"}
          </span>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {school.board || "Board not listed"}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
          {school.name}
        </h1>

        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          📍{" "}
          {[school.city, school.state].filter(Boolean).join(", ") ||
            "Location not listed"}
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-5 dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              School Type
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {school.type || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-5 dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Board
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {school.board || "Not listed"}
            </p>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Visit Official Website
            </a>
          )}

          <SaveSchoolButton schoolName={school.name} schoolSlug={school.slug} />
        </div>
      </article>
    </main>
  );
}