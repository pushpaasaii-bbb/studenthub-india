"use client";

import { useEffect, useState } from "react";
import CollegeCard from "../components/CollegeCard";

type College = {
  id: number;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  college_type: string | null;
  average_fees: string | null;
};

type CollegesApiResponse = {
  colleges?: College[];
  totalColleges?: number;
  error?: string;
};

const PAGE_SIZE = 12;

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalColleges, setTotalColleges] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalColleges / PAGE_SIZE));

  useEffect(() => {
    const controller = new AbortController();

    const loadColleges = async () => {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
        search,
        collegeType,
        state: stateFilter,
      });

      try {
        const response = await fetch(`/api/colleges?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = (await response.json()) as CollegesApiResponse;

        if (!response.ok) {
          throw new Error(result.error || "Could not load colleges right now.");
        }

        setColleges(result.colleges || []);
        setTotalColleges(result.totalColleges || 0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error loading colleges:", error);
        setErrorMessage("Could not load colleges right now.");
        setColleges([]);
        setTotalColleges(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadColleges();

    return () => {
      controller.abort();
    };
  }, [page, search, collegeType, stateFilter]);

  const resetFilters = () => {
    setSearch("");
    setCollegeType("");
    setStateFilter("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Colleges in India
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore engineering, medical, law, management and other colleges
          across India.
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
            placeholder="Search college name..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={collegeType}
            onChange={(event) => {
              setCollegeType(event.target.value);
              setPage(1);
            }}
            placeholder="Filter college type (IIT, NIT...)"
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={stateFilter}
            onChange={(event) => {
              setStateFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter by state..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading
              ? "Loading colleges..."
              : `${totalColleges} published colleges found`}
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
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Loading colleges...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>
      ) : colleges.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No published colleges match your filters.
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                name={college.name}
                slug={college.slug}
                location={[college.city, college.state]
                  .filter(Boolean)
                  .join(", ")}
                type={college.college_type || "College"}
                fees={college.average_fees || "Contact college"}
              />
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