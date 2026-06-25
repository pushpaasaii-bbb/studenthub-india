"use client";

import { useState } from "react";

export default function AttendanceCalculatorPage() {
  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<{
    percentage: number;
    status: string;
  } | null>(null);

  const calculateAttendance = () => {
    const attendedClasses = Number(attended);
    const totalClasses = Number(total);

    if (attendedClasses < 0 || totalClasses <= 0 || attendedClasses > totalClasses) {
      alert("Please enter valid class numbers.");
      return;
    }

    const percentage = (attendedClasses / totalClasses) * 100;

    setResult({
      percentage,
      status: percentage >= 75 ? "Safe" : "Shortage",
    });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Attendance Calculator
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Calculate your attendance percentage and check if you are safe.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">
            Classes Attended
          </label>
          <input
            type="number"
            value={attended}
            onChange={(e) => setAttended(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 45"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Total Classes
          </label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 60"
          />
        </div>

        <button
          onClick={calculateAttendance}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Calculate Attendance
        </button>

        {result && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">
              Attendance: {result.percentage.toFixed(2)}%
            </h2>
            <p className="mt-1 font-semibold">
              Status: {result.status}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}