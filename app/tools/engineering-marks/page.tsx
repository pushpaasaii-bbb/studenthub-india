"use client";

import { useState } from "react";

export default function EngineeringMarksPage() {
  const [internalMarks, setInternalMarks] = useState("");
  const [externalMarks, setExternalMarks] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  const calculateMarks = () => {
    const internal = Number(internalMarks);
    const external = Number(externalMarks);

    if (
      internal < 0 ||
      internal > 30 ||
      external < 0 ||
      external > 70 ||
      Number.isNaN(internal) ||
      Number.isNaN(external)
    ) {
      alert("Enter valid marks. Internal should be 0-30 and external should be 0-70.");
      return;
    }

    setTotal(internal + external);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Engineering Marks Calculator
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Calculate total engineering subject marks from internal and external marks.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">Internal Marks</label>
          <input
            type="number"
            value={internalMarks}
            onChange={(e) => setInternalMarks(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">External Marks</label>
          <input
            type="number"
            value={externalMarks}
            onChange={(e) => setExternalMarks(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 60"
          />
        </div>

        <button
          onClick={calculateMarks}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Calculate Total
        </button>

        {total !== null && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">Total Marks: {total}/100</h2>
          </div>
        )}
      </div>
    </main>
  );
}