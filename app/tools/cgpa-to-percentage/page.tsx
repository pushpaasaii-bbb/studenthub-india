"use client";

import { useState } from "react";

export default function CgpaToPercentagePage() {
  const [cgpa, setCgpa] = useState("");
  const [percentage, setPercentage] = useState<number | null>(null);

  const convertCgpa = () => {
    const value = Number(cgpa);

    if (value < 0 || value > 10 || Number.isNaN(value)) {
      alert("Please enter a valid CGPA between 0 and 10.");
      return;
    }

    setPercentage(value * 9.5);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        CGPA to Percentage Converter
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Convert CGPA into percentage using the common Indian formula.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <input
          type="number"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Example: 8.2"
        />

        <button
          onClick={convertCgpa}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Convert
        </button>

        {percentage !== null && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">
              Percentage: {percentage.toFixed(2)}%
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}