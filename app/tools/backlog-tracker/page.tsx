"use client";

import { useState } from "react";

export default function BacklogTrackerPage() {
  const [totalSubjects, setTotalSubjects] = useState("");
  const [clearedSubjects, setClearedSubjects] = useState("");
  const [pending, setPending] = useState<number | null>(null);

  const calculateBacklogs = () => {
    const total = Number(totalSubjects);
    const cleared = Number(clearedSubjects);

    if (
      total <= 0 ||
      cleared < 0 ||
      cleared > total ||
      Number.isNaN(total) ||
      Number.isNaN(cleared)
    ) {
      alert("Please enter valid values.");
      return;
    }

    setPending(total - cleared);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Backlog Tracker
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Track your cleared and pending subjects.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">
            Total Subjects
          </label>

          <input
            type="number"
            value={totalSubjects}
            onChange={(e) => setTotalSubjects(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Cleared Subjects
          </label>

          <input
            type="number"
            value={clearedSubjects}
            onChange={(e) => setClearedSubjects(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 36"
          />
        </div>

        <button
          onClick={calculateBacklogs}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Calculate Pending Backlogs
        </button>

        {pending !== null && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">
              Pending Backlogs: {pending}
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}