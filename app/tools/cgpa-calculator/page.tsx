"use client";

import { useState } from "react";

export default function CgpaCalculatorPage() {
  const [credits, setCredits] = useState("");
  const [gradePoints, setGradePoints] = useState("");
  const [cgpa, setCgpa] = useState<number | null>(null);

  const calculateCGPA = () => {
    const c = Number(credits);
    const g = Number(gradePoints);

    if (c <= 0 || g < 0) {
      alert("Please enter valid values.");
      return;
    }

    setCgpa(g / c);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        CGPA Calculator
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Enter your total credits and total grade points.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">
            Total Credits
          </label>

          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Total Grade Points
          </label>

          <input
            type="number"
            value={gradePoints}
            onChange={(e) => setGradePoints(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 210"
          />
        </div>

        <button
          onClick={calculateCGPA}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Calculate CGPA
        </button>

        {cgpa !== null && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">
              Your CGPA: {cgpa.toFixed(2)}
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}