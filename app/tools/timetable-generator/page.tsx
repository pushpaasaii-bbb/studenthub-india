"use client";

import { useState } from "react";

export default function TimetableGeneratorPage() {
  const [subjects, setSubjects] = useState("");
  const [days, setDays] = useState("");
  const [timetable, setTimetable] = useState<string[]>([]);

  const generateTimetable = () => {
    const subjectList = subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean);

    const totalDays = Number(days);

    if (subjectList.length === 0 || totalDays <= 0 || Number.isNaN(totalDays)) {
      alert("Enter subjects and valid number of days.");
      return;
    }

    const generated = Array.from({ length: totalDays }, (_, index) => {
      const subject = subjectList[index % subjectList.length];
      return `Day ${index + 1}: Study ${subject}`;
    });

    setTimetable(generated);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Timetable Generator
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Generate a simple study timetable from your subjects.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <textarea
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Example: Maths, Physics, Chemistry, English"
          rows={4}
        />

        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="w-full rounded-lg border p-3"
          placeholder="Number of days, example: 7"
        />

        <button
          onClick={generateTimetable}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Generate Timetable
        </button>

        {timetable.length > 0 && (
          <div className="rounded-lg bg-green-100 p-4">
            <h2 className="text-xl font-bold">Your Timetable</h2>

            <ul className="mt-3 list-inside list-disc space-y-1">
              {timetable.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}