"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  supabase,
  getSavedColleges,
  getSavedExams,
  getSavedJobs,
  getSavedScholarships,
  getSavedCareers,
  getSavedSchools,
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

type SavedScholarship = {
  id: number;
  scholarship_name: string;
  scholarship_slug: string;
};

type SavedCareer = {
  id: number;
  career_title: string;
  career_slug: string;
};

type SavedSchool = {
  id: number;
  school_name: string;
  school_slug: string;
};

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [savedExams, setSavedExams] = useState<SavedExam[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<
    SavedScholarship[]
  >([]);
  const [savedCareers, setSavedCareers] = useState<SavedCareer[]>([]);
  const [savedSchools, setSavedSchools] = useState<SavedSchool[]>([]);

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

      const [
        colleges,
        exams,
        jobs,
        scholarships,
        careers,
        schools,
      ] = await Promise.all([
        getSavedColleges(user.id),
        getSavedExams(user.id),
        getSavedJobs(user.id),
        getSavedScholarships(user.id),
        getSavedCareers(user.id),
        getSavedSchools(user.id),
      ]);

      setSavedColleges(colleges);
      setSavedExams(exams);
      setSavedJobs(jobs);
      setSavedScholarships(scholarships);
      setSavedCareers(careers);
      setSavedSchools(schools);
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
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Saved Colleges"
          count={savedColleges.length}
          color="text-blue-700"
        />

        <DashboardCard
          title="Saved Exams"
          count={savedExams.length}
          color="text-green-700"
        />

        <DashboardCard
          title="Saved Jobs"
          count={savedJobs.length}
          color="text-orange-600"
        />

        <DashboardCard
          title="Saved Scholarships"
          count={savedScholarships.length}
          color="text-pink-600"
        />

        <DashboardCard
          title="Saved Careers"
          count={savedCareers.length}
          color="text-indigo-700"
        />

        <DashboardCard
          title="Saved Schools"
          count={savedSchools.length}
          color="text-cyan-700"
        />

        <DashboardCard
          title="Study Tools Used"
          count={0}
          color="text-purple-700"
        />
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
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
              href={`/jobs-v2/${job.job_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              💼 {job.job_title}
            </Link>
          ))}
        </SavedList>

        <SavedList
          title="Saved Scholarships"
          empty="No saved scholarships yet."
        >
          {savedScholarships.map((scholarship) => (
            <Link
              key={scholarship.id}
              href={`/scholarships/${scholarship.scholarship_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              🔖 {scholarship.scholarship_name}
            </Link>
          ))}
        </SavedList>

        <SavedList title="Saved Careers" empty="No saved careers yet.">
          {savedCareers.map((career) => (
            <Link
              key={career.id}
              href={`/careers/${career.career_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              🧭 {career.career_title}
            </Link>
          ))}
        </SavedList>

        <SavedList title="Saved Schools" empty="No saved schools yet.">
          {savedSchools.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${school.school_slug}`}
              className="block rounded-lg border p-4 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              🏫 {school.school_name}
            </Link>
          ))}
        </SavedList>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">{title}</h2>

      <p className={`mt-4 text-4xl font-bold ${color}`}>{count}</p>
    </div>
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