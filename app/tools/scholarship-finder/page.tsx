"use client";

import { useState } from "react";

const scholarships = [
  "National Scholarship Portal",
  "AICTE Pragati Scholarship",
  "AICTE Saksham Scholarship",
  "Post Matric Scholarship",
  "INSPIRE Scholarship",
];

export default function ScholarshipFinderPage() {
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const findScholarships = () => {
    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (category === "engineering") {
      setResults(["AICTE Pragati Scholarship", "AICTE Saksham Scholarship"]);
    } else if (category === "science") {
      setResults(["INSPIRE Scholarship"]);
    } else {
      setResults(scholarships);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Scholarship Finder
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Find scholarships based on your student category.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select Category</option>
          <option value="engineering">Engineering</option>
          <option value="science">Science</option>
          <option value="all">All Students</option>
        </select>

        <button
          onClick={findScholarships}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Find Scholarships
        </button>

        {results.length > 0 && (
          <div className="rounded-lg bg-green-100 p-4">
            <h2 className="text-xl font-bold">Matching Scholarships</h2>

            <ul className="mt-3 list-inside list-disc space-y-1">
              {results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}