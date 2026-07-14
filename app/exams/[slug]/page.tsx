"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SaveExamButton from "../../components/SaveExamButton";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

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
  status: string | null;
};

export default function ExamDetailsPage() {
  const params = useParams<{ slug: string }>();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadExam = async () => {
      const slug = params?.slug;

      if (!slug) {
        setErrorMessage("Invalid exam URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("exams")
        .select(
          "id, exam_name, slug, category, conducting_body, level, application_start, application_end, exam_date, official_website, status"
        )
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error || !data) {
        console.error("Error loading exam:", error);
        setErrorMessage("Exam not found or not published.");
        setExam(null);
        setLoading(false);
        return;
      }

      setExam(data);
      setLoading(false);
    };

    loadExam();
  }, [params?.slug]);

  const formatDate = (value: string | null) => {
    if (!value) return "Not announced";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border bg-white p-6 text-slate-600">
          Loading exam details...
        </div>
      </main>
    );
  }

  if (errorMessage || !exam) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>

        <Link
          href="/exams"
          className="mt-6 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Exams
        </Link>
      </main>
    );
  }

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

        {exam.official_website && (
          <a
            href={exam.official_website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Visit Official Website
            <SaveExamButton
  examName={exam.exam_name}
  examSlug={exam.slug}
/>
          </a>

        )}
      </section>
    </main>
  );
}