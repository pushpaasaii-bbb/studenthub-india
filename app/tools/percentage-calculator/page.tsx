"use client";

import { useState } from "react";

export default function PercentageCalculatorPage() {
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculatePercentage = () => {
    const obtained = Number(obtainedMarks);
    const total = Number(totalMarks);

    if (obtained < 0 || total <= 0 || obtained > total) {
      alert("Please enter valid marks.");
      return;
    }

    setPercentage((obtained / total) * 100);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Percentage Calculator
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Convert your obtained marks into percentage.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">
            Obtained Marks
          </label>
          <input
            type="number"
            value={obtainedMarks}
            onChange={(e) => setObtainedMarks(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 420"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Total Marks
          </label>
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 500"
          />
        </div>

        <button
          onClick={calculatePercentage}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Calculate Percentage
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