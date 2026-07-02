"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  supabase,
  getSavedColleges,
  getSavedExams,
  getSavedJobs,
} from "../lib/supabase";

type SavedCollege = {
  id: number;
  college_name: string;
  college_slug: string;
};

type SavedExam = {
  id: number;
  exam_name: string;
  exam_slug: string;
};

type SavedJob = {
  id: number;
  job_title: string;
  job_slug: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      setEmail(user.email || "");

      setSavedColleges(await getSavedColleges(user.id));
      setSavedExams(await getSavedExams(user.id));
      setSavedJobs(await getSavedJobs(user.id));
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Welcome back! Logged in as {email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Saved Colleges</h2>
          <p className="mt-4 text-4xl font-bold text-blue-700">
            {savedColleges.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Saved Exams</h2>
          <p className="mt-4 text-4xl font-bold text-green-700">
            {savedExams.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Saved Jobs</h2>
          <p className="mt-4 text-4xl font-bold text-orange-600">
            {savedJobs.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Study Tools Used</h2>
          <p className="mt-4 text-4xl font-bold text-purple-700">0</p>
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <SavedList title="Saved Colleges" empty="No saved colleges yet.">
          {savedColleges.map((college) => (
            <Link
              key={college.id}
              href={`/colleges/${college.college_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ❤️ {college.college_name}
            </Link>
          ))}
        </SavedList>

        <SavedList title="Saved Exams" empty="No saved exams yet.">
          {savedExams.map((exam) => (
            <Link
              key={exam.id}
              href={`/exams/${exam.exam_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              📚 {exam.exam_name}
            </Link>
          ))}
        </SavedList>

        <SavedList title="Saved Jobs" empty="No saved jobs yet.">
          {savedJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.job_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              💼 {job.job_title}
            </Link>
          ))}
        </SavedList>
      </section>
    </main>
  );
}

function SavedList({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasItems = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-2xl font-bold">{title}</h2>

      <div className="mt-4 space-y-3">
        {hasItems ? (
          children
        ) : (
          <p className="text-slate-600 dark:text-slate-400">{empty}</p>
        )}
      </div>
    </div>
  );
}