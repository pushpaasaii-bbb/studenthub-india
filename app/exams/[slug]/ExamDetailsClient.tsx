"use client";

import Link from "next/link";
import ExamReminderButton from "../../components/ExamReminderButton";
import SaveExamButton from "../../components/SaveExamButton";

type Exam = {
  id: number;
  exam_name: string;
  slug: string;
  category: string | null;
  conducting_body: string | null;
  level: string | null;
  application_start: string | null;
  application_end: string | null;
  exam_date: string | null;
  official_website: string | null;
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: string | null;
  status: string | null;
};

type Props = {
  exam: Exam;
};

export default function ExamDetailsClient({ exam }: Props) {
  const formatDate = (value: string | null) => {
    if (!value) return "Not announced";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isOfficiallyVerified =
    exam.verification_status === "verified" &&
    Boolean(exam.source_name) &&
    Boolean(exam.source_url);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/exams"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Exams
      </Link>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {exam.category || "Exam"}
          </span>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {exam.level || "Level not listed"}
          </span>

          {isOfficiallyVerified && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Official source verified
            </span>
          )}
        </div>

        <h1 className="mt-5 text-4xl font-bold text-slate-900 dark:text-white">
          {exam.exam_name}
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Conducted by:{" "}
          <span className="font-semibold">
            {exam.conducting_body || "Not announced"}
          </span>
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-5 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Application Start</p>
            <p className="mt-2 font-semibold">
              {formatDate(exam.application_start)}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-5 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Application Deadline</p>
            <p className="mt-2 font-semibold">
              {formatDate(exam.application_end)}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-5 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Exam Date</p>
            <p className="mt-2 font-semibold">
              {formatDate(exam.exam_date)}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Exam Information
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Check the official notification for eligibility, syllabus,
            application process, exam pattern, fees, admit card and result
            information.
          </p>
        </div>

        {isOfficiallyVerified && (
          <section className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
            <h2 className="text-lg font-bold text-green-900 dark:text-green-200">
              Official Source
            </h2>

            <p className="mt-2 text-sm leading-6 text-green-900 dark:text-green-100">
              Verified from {exam.source_name} on{" "}
              {formatDate(exam.last_verified_at)}.
            </p>

            <a
              href={exam.source_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex font-semibold text-green-800 underline hover:text-green-950 dark:text-green-300 dark:hover:text-green-100"
            >
              View official source ↗
            </a>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {exam.official_website && (
            <a
              href={exam.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Visit Official Website
            </a>
          )}

          <SaveExamButton examName={exam.exam_name} examSlug={exam.slug} />
        </div>

        <div className="mt-8">
          <ExamReminderButton examName={exam.exam_name} examSlug={exam.slug} />
        </div>
      </section>
    </main>
  );
}