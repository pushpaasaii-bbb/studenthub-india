"use client";

import { useState } from "react";
import ExamCard from "../components/ExamCard";
import exams from "../data/exams.json";

export default function ExamsPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(search.toLowerCase()) ||
      exam.conductedBy.toLowerCase().includes(search.toLowerCase()) ||
      exam.category.toLowerCase().includes(search.toLowerCase());

    const matchesLevel =
      level === "" || exam.level === level;

    return matchesSearch && matchesLevel;
  });

  const levels = Array.from(
    new Set(exams.map((exam) => exam.level))
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Entrance Exams
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore national and state-level entrance exams including JEE Main,
          JEE Advanced, NEET, AP EAMCET, TS EAMCET and CUET.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border p-3"
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">All Levels</option>

          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Showing {filteredExams.length} exams
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <ExamCard
            key={exam.id}
            name={exam.name}
            slug={exam.slug}
            conductingBody={exam.conductedBy}
            applicationDeadline={exam.frequency}
            examDate={exam.category}
            level={exam.level}
          />
        ))}
      </div>
    </main>
  );
}