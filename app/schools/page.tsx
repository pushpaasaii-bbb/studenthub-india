"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

type SchoolsApiResponse = {
  schools: School[];
  totalSchools: number;
};

const PAGE_SIZE = 12;

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [boardFilter, setBoardFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalSchools / PAGE_SIZE));

  useEffect(() => {
    const controller = new AbortController();

    const loadSchools = async () => {
      setLoading(true);
      setErrorMessage("");

      const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });

      if (search.trim()) {
        searchParams.set("search", search.trim());
      }

      if (typeFilter.trim()) {
        searchParams.set("type", typeFilter.trim());
      }

      if (boardFilter.trim()) {
        searchParams.set("board", boardFilter.trim());
      }

      try {
        const response = await fetch(
          `/api/schools?${searchParams.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = (await response.json()) as
          | SchoolsApiResponse
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in result && result.error
              ? result.error
              : "Could not load schools right now."
          );
        }

        const schoolResult = result as SchoolsApiResponse;

        setSchools(schoolResult.schools || []);
        setTotalSchools(schoolResult.totalSchools || 0);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error loading schools:", error);
        setErrorMessage("Could not load schools right now.");
        setSchools([]);
        setTotalSchools(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSchools();

    return () => {
      controller.abort();
    };
  }, [page, search, typeFilter, boardFilter]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setBoardFilter("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Schools in India
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore CBSE, ICSE, state board, private and government schools across
          India.
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
            placeholder="Search school name..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter school type..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="search"
            value={boardFilter}
            onChange={(event) => {
              setBoardFilter(event.target.value);
              setPage(1);
            }}
            placeholder="Filter board (CBSE, ICSE...)"
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading
              ? "Loading schools..."
              : `${totalSchools} published schools found`}
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
          Loading schools...
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>
      ) : schools.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No published schools match your filters.
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schools.map((school) => (
              <article
                key={school.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {school.name}
                </h2>

                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  📍 {[school.city, school.state].filter(Boolean).join(", ")}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {school.type || "School"}
                  </span>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {school.board || "Board not listed"}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/schools/${school.slug}`}
                    className="inline-block rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    View Details
                  </Link>

                  {school.website && (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                      Visit Website
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