"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Job = {
  id: number;
  title: string;
  slug: string;
  company: string | null;
  location: string | null;
  salary: string | null;
  category: string | null;
  job_type: string | null;
};

const PAGE_SIZE = 12;

export default function JobsV2Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_SIZE));

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      setLoading(true);
      setErrorMessage("");

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("jobs_v2")
        .select(
          "id, title, slug, company, location, salary, category, job_type",
          { count: "exact" }
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      if (categoryFilter.trim()) {
        query = query.ilike(
          "category",
          `%${categoryFilter.trim()}%`
        );
      }

      if (jobTypeFilter.trim()) {
        query = query.ilike(
          "job_type",
          `%${jobTypeFilter.trim()}%`
        );
      }

      const { data, error, count } = await query;

      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Could not load jobs:", error);
        setErrorMessage("Could not load jobs right now.");
        setJobs([]);
        setTotalJobs(0);
        setLoading(false);
        return;
      }

      setJobs(data || []);
      setTotalJobs(count || 0);
      setLoading(false);
    };

    loadJobs();

    return () => {
      isActive = false;
    };
  }, [page, search, categoryFilter, jobTypeFilter]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setJobTypeFilter("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Latest Jobs
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Explore private, government, internship and fresher jobs.
      </p>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search job title..."
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
            value={jobTypeFilter}
            onChange={(event) => {
              setJobTypeFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter job type..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading ? "Loading jobs..." : `${totalJobs} published jobs found`}
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
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Loading jobs...
        </div>
      ) : errorMessage ? (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No published jobs match your filters.
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs-v2/${job.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {job.title}
                </h2>

                {job.company && (
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {job.company}
                  </p>
                )}

                {job.location && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    📍 {job.location}
                  </p>
                )}

                {job.category && (
                  <p className="mt-3 text-sm font-semibold text-blue-700">
                    {job.category}
                  </p>
                )}

                {job.job_type && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {job.job_type}
                  </p>
                )}

                {job.salary && (
                  <p className="mt-3 font-semibold text-blue-700">
                    {job.salary}
                  </p>
                )}
              </Link>
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