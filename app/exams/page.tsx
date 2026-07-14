"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Exam = {
  id: number;
  exam_name: string;
  slug: string;
  category: string | null;
  conducting_body: string | null;
  level: string | null;
  application_end: string | null;
  exam_date: string | null;
  official_website: string | null;
};

const PAGE_SIZE = 12;

const formatDate = (value: string | null) => {
  if (!value) {
    return "Not announced";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalExams, setTotalExams] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalExams / PAGE_SIZE));

  useEffect(() => {
    let isActive = true;

    const loadExams = async () => {
      setLoading(true);
      setErrorMessage("");

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("exams")
        .select(
          "id, exam_name, slug, category, conducting_body, level, application_end, exam_date, official_website",
          { count: "exact" }
        )
        .eq("status", "published")
        .order("exam_date", {
          ascending: true,
          nullsFirst: false,
        })
        .range(from, to);

      if (search.trim()) {
        query = query.ilike("exam_name", `%${search.trim()}%`);
      }

      if (categoryFilter.trim()) {
        query = query.ilike(
          "category",
          `%${categoryFilter.trim()}%`
        );
      }

      if (levelFilter.trim()) {
        query = query.ilike("level", `%${levelFilter.trim()}%`);
      }

      const { data, error, count } = await query;

      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Error loading exams:", error);
        setErrorMessage("Could not load exams right now.");
        setExams([]);
        setTotalExams(0);
        setLoading(false);
        return;
      }

      setExams(data || []);
      setTotalExams(count || 0);
      setLoading(false);
    };

    loadExams();

    return () => {
      isActive = false;
    };
  }, [page, search, categoryFilter, levelFilter]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setLevelFilter("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Entrance and Competitive Exams
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore engineering, medical, government, banking, defence and other
          exams across India.
        </p>
      </div>

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search exam name..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter category..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={levelFilter}
            onChange={(event) => {
              setLevelFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter level (National, State...)"
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading ? "Loading exams..." : `${totalExams} published exams found`}
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {loading ? (
        <div className="rounded-xl border bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Loading exams...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>
      ) : exams.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No published exams match your filters.
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <article
                key={exam.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {exam.category || "Exam"}
                  </span>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {exam.level || "Level not listed"}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  {exam.exam_name}
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Conducted by: {exam.conducting_body || "Not announced"}
                </p>

                <div className="mt-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p>
                    <span className="font-semibold">Application deadline:</span>{" "}
                    {formatDate(exam.application_end)}
                  </p>

                  <p>
                    <span className="font-semibold">Exam date:</span>{" "}
                    {formatDate(exam.exam_date)}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/exams/${exam.slug}`}
                    className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    View Details
                  </Link>

                  {exam.official_website && (
                    <a
                      href={exam.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Official Website
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.max(1, currentPage - 1)
                  )
                }
                disabled={page === 1}
                className="rounded-lg border px-4 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(totalPages, currentPage + 1)
                  )
                }
                disabled={page === totalPages}
                className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}