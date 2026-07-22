"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Scholarship = {
  id: number;
  name: string;
  slug: string;
  provider: string | null;
  category: string | null;
  eligibility: string | null;
  amount: string | null;
  application_end: string | null;
  official_website: string | null;
};

type ScholarshipsApiResponse = {
  scholarships: Scholarship[];
  totalScholarships: number;
};

const PAGE_SIZE = 12;

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalScholarships, setTotalScholarships] = useState(0);

  const totalPages = Math.max(
    1,
    Math.ceil(totalScholarships / PAGE_SIZE)
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadScholarships = async () => {
      setLoading(true);
      setErrorMessage("");

      const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });

      if (search.trim()) {
        searchParams.set("search", search.trim());
      }

      if (providerFilter.trim()) {
        searchParams.set("provider", providerFilter.trim());
      }

      if (categoryFilter.trim()) {
        searchParams.set("category", categoryFilter.trim());
      }

      try {
        const response = await fetch(
          `/api/scholarships?${searchParams.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = (await response.json()) as
          | ScholarshipsApiResponse
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in result && result.error
              ? result.error
              : "Could not load scholarships right now."
          );
        }

        const scholarshipResult = result as ScholarshipsApiResponse;

        setScholarships(scholarshipResult.scholarships || []);
        setTotalScholarships(
          scholarshipResult.totalScholarships || 0
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Could not load scholarships:", error);
        setErrorMessage("Could not load scholarships right now.");
        setScholarships([]);
        setTotalScholarships(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadScholarships();

    return () => {
      controller.abort();
    };
  }, [page, search, providerFilter, categoryFilter]);

  const resetFilters = () => {
    setSearch("");
    setProviderFilter("");
    setCategoryFilter("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Scholarships
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Find verified government and private scholarships for Indian
          students.
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
            placeholder="Search scholarship name..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={providerFilter}
            onChange={(event) => {
              setProviderFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter provider..."
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
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading
              ? "Loading scholarships..."
              : `${totalScholarships} published scholarships found`}
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
        <p className="py-10 text-center text-slate-600 dark:text-slate-400">
          Loading scholarships...
        </p>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {errorMessage}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No scholarships found
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Try different filters or check back soon for new opportunities.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => (
              <article
                key={scholarship.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {scholarship.name}
                </h2>

                {scholarship.provider && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {scholarship.provider}
                  </p>
                )}

                {scholarship.category && (
                  <div className="mt-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      {scholarship.category}
                    </span>
                  </div>
                )}

                {scholarship.eligibility && (
                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
                    {scholarship.eligibility}
                  </p>
                )}

                {scholarship.amount && (
                  <p className="mt-3 text-sm font-semibold text-blue-700">
                    Amount: {scholarship.amount}
                  </p>
                )}

                {scholarship.application_end && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    Last Date: {scholarship.application_end}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/scholarships/${scholarship.slug}`}
                    className="inline-block rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    View Details
                  </Link>

                  {scholarship.official_website && (
                    <a
                      href={scholarship.official_website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                      Apply Now
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
                  setPage((currentPage) => Math.max(1, currentPage - 1))
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