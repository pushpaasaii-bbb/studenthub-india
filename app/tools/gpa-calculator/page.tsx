"use client";

import { useState } from "react";

export default function GPACalculatorPage() {
  const [gradePoints, setGradePoints] = useState("");
  const [subjects, setSubjects] = useState("");
  const [gpa, setGpa] = useState<number | null>(null);

  const calculateGPA = () => {
    const totalGradePoints = Number(gradePoints);
    const totalSubjects = Number(subjects);

    if (
      totalGradePoints < 0 ||
      totalSubjects <= 0 ||
      Number.isNaN(totalGradePoints) ||
      Number.isNaN(totalSubjects)
    ) {
      alert("Please enter valid values.");
      return;
    }

    setGpa(totalGradePoints / totalSubjects);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        GPA Calculator
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Calculate your GPA using total grade points and number of subjects.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">
            Total Grade Points
          </label>

          <input
            type="number"
            value={gradePoints}
            onChange={(e) => setGradePoints(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 48"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Number of Subjects
          </label>

          <input
            type="number"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 6"
          />
        </div>

        <button
          onClick={calculateGPA}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Calculate GPA
        </button>

        {gpa !== null && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">
              GPA: {gpa.toFixed(2)}
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}