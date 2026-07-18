"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ExamReminder = {
  id: string;
  exam_name: string;
  exam_slug: string;
  reminder_at: string;
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ExamReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadReminders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data, error } = await supabase
        .from("exam_reminders")
        .select("id, exam_name, exam_slug, reminder_at")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .order("reminder_at", { ascending: true });

      if (error) {
        console.error("Could not load reminders:", error);
        setErrorMessage("Could not load your reminders.");
        setLoading(false);
        return;
      }

      setReminders(data || []);
      setLoading(false);
    };

    loadReminders();
  }, []);

  const formatReminderDate = (value: string) => {
    return new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-400">
          Loading your reminders...
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

      <h1 className="mt-5 text-4xl font-bold text-slate-900 dark:text-white">
        Exam Reminders
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Your saved in-app exam reminders are shown here.
      </p>

      {errorMessage && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      {!errorMessage && reminders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No active exam reminders yet. Open an exam and save a future reminder.
        </div>
      )}

      {reminders.length > 0 && (
        <section className="mt-8 space-y-4">
          {reminders.map((reminder) => (
            <Link
              key={reminder.id}
              href={`/exams/${reminder.exam_slug}`}
              className="block rounded-2xl border border-purple-200 bg-white p-6 shadow-sm transition hover:border-purple-500 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                Reminder: {formatReminderDate(reminder.reminder_at)}
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {reminder.exam_name}
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Open exam details →
              </p>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}