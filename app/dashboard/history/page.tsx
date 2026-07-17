"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ViewHistoryItem = {
  id: string;
  content_type:
    | "college"
    | "exam"
    | "job"
    | "scholarship"
    | "school"
    | "career";
  content_slug: string;
  content_title: string;
  viewed_at: string;
};

const contentDetails = {
  college: { label: "College", emoji: "🎓", path: "/colleges" },
  exam: { label: "Exam", emoji: "📚", path: "/exams" },
  job: { label: "Job", emoji: "💼", path: "/jobs-v2" },
  scholarship: { label: "Scholarship", emoji: "🎁", path: "/scholarships" },
  school: { label: "School", emoji: "🏫", path: "/schools" },
  career: { label: "Career", emoji: "🧭", path: "/careers" },
} as const;

function formatViewedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ViewHistoryPage() {
  const [historyItems, setHistoryItems] = useState<ViewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadViewHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data, error } = await supabase
        .from("view_history")
        .select("id, content_type, content_slug, content_title, viewed_at")
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Could not load view history:", error);
        setErrorMessage("Could not load your view history. Please try again.");
        setLoading(false);
        return;
      }

      setHistoryItems((data || []) as ViewHistoryItem[]);
      setLoading(false);
    };

    loadViewHistory();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-400">
          Loading your view history...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Recently Viewed
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Your latest colleges, exams, jobs, scholarships, schools, and
          careers.
        </p>

        {errorMessage && (
          <p className="mt-6 rounded-lg bg-red-50 p-4 font-medium text-red-700">
            {errorMessage}
          </p>
        )}

        {!errorMessage && historyItems.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400">
              You have not viewed any items yet.
            </p>

            <Link
              href="/colleges"
              className="mt-4 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Explore Colleges
            </Link>
          </div>
        )}

        {historyItems.length > 0 && (
          <div className="mt-8 space-y-3">
            {historyItems.map((item) => {
              const details = contentDetails[item.content_type];

              return (
                <Link
                  key={item.id}
                  href={`${details.path}/${item.content_slug}`}
                  className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        {details.emoji} {details.label}
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        {item.content_title}
                      </h2>
                    </div>

                    <p className="shrink-0 text-right text-xs text-slate-500">
                      {formatViewedAt(item.viewed_at)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}