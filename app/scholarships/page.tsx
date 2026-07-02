"use client";

import { useState } from "react";
import Link from "next/link";
import scholarships from "../data/scholarships.json";

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(search.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(search.toLowerCase()) ||
      scholarship.eligibility.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "" || scholarship.category === category;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(scholarships.map((s) => s.category))
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Scholarships
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Find government and private scholarships for Indian students.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search scholarships..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border p-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Showing {filteredScholarships.length} scholarships
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredScholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {scholarship.name}
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {scholarship.provider}
            </p>

            <div className="mt-4">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {scholarship.category}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
              {scholarship.eligibility}
            </p>

            <p className="mt-3 text-sm font-semibold text-blue-700">
              Amount: {scholarship.amount}
            </p>

            <p className="mt-2 text-sm font-medium text-red-600">
              Last Date: {scholarship.lastDate}
            </p>

            <Link
              href={scholarship.officialWebsite}
              target="_blank"
              className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Apply / Official Website
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}