"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Career = {
  id: number;
  title: string;
  slug: string;
  alphabet: string | null;
  category: string | null;
  average_salary: string | null;
};

const PAGE_SIZE = 16;
const alphabetOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function CareersAZPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [alphabetFilter, setAlphabetFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalCareers, setTotalCareers] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCareers / PAGE_SIZE));

  useEffect(() => {
    let isActive = true;

    const loadCareers = async () => {
      setLoading(true);
      setErrorMessage("");

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("careers")
        .select(
          "id, title, slug, alphabet, category, average_salary",
          { count: "exact" }
        )
        .eq("status", "published")
        .order("title", { ascending: true })
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

      if (alphabetFilter) {
        query = query.eq("alphabet", alphabetFilter);
      }

      const { data, error, count } = await query;

      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Could not load careers:", error);
        setErrorMessage("Could not load careers right now.");
        setCareers([]);
        setTotalCareers(0);
        setLoading(false);
        return;
      }

      setCareers(data || []);
      setTotalCareers(count || 0);
      setLoading(false);
    };

    loadCareers();

    return () => {
      isActive = false;
    };
  }, [page, search, categoryFilter, alphabetFilter]);

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setAlphabetFilter("");
    setPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        A–Z Career Directory
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Explore career paths, qualifications, salary, roadmap and future scope.
      </p>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search career title..."
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

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setAlphabetFilter("");
              setPage(1);
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              alphabetFilter === ""
                ? "bg-blue-700 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            All
          </button>

          {alphabetOptions.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => {
                setAlphabetFilter(letter);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                alphabetFilter === letter
                  ? "bg-blue-700 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading
              ? "Loading careers..."
              : `${totalCareers} published careers found`}
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
        <div className="mt-8 rounded-xl border bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Loading careers...
        </div>
      ) : errorMessage ? (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>
      ) : careers.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No published careers match your filters.
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {careers.map((career) => (
              <Link
                key={career.id}
                href={`/careers/${career.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {career.title}
                </h2>

                {career.category && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {career.category}
                  </p>
                )}

                {career.average_salary && (
                  <p className="mt-3 text-sm font-medium text-blue-700">
                    {career.average_salary}
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