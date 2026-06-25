"use client";

import { useState } from "react";

const colleges = [
  "Andhra University",
  "JNTU Anantapur",
  "JNTU Hyderabad",
  "NIT Warangal",
  "VIT Vellore",
];

export default function CollegePredictorPage() {
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const predictColleges = () => {
    const userRank = Number(rank);

    if (userRank <= 0 || Number.isNaN(userRank)) {
      alert("Please enter a valid rank.");
      return;
    }

    if (userRank <= 3000) {
      setResults(colleges);
    } else if (userRank <= 10000) {
      setResults(["JNTU Hyderabad", "Andhra University", "JNTU Anantapur"]);
    } else if (userRank <= 30000) {
      setResults(["JNTU Anantapur", "Private Engineering Colleges"]);
    } else {
      setResults(["Private Engineering Colleges", "Management Quota Options"]);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        College Predictor
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Enter your EAMCET rank and get possible college suggestions.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">
            Your EAMCET Rank
          </label>

          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 8500"
          />
        </div>

        <button
          onClick={predictColleges}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Predict Colleges
        </button>

        {results.length > 0 && (
          <div className="rounded-lg bg-green-100 p-4">
            <h2 className="text-xl font-bold">Possible Colleges</h2>

            <ul className="mt-3 list-inside list-disc space-y-1">
              {results.map((college) => (
                <li key={college}>{college}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}