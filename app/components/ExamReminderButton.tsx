"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

type ExamReminderButtonProps = {
  examName: string;
  examSlug: string;
};

export default function ExamReminderButton({
  examName,
  examSlug,
}: ExamReminderButtonProps) {
  const [reminderAt, setReminderAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveReminder = async () => {
    setMessage("");

    if (!reminderAt) {
      setMessage("Please choose a reminder date and time.");
      return;
    }

    const selectedDate = new Date(reminderAt);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
      setMessage("Please choose a future date and time.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    const { error } = await supabase.from("exam_reminders").upsert(
      {
        user_id: user.id,
        exam_name: examName,
        exam_slug: examSlug,
        reminder_at: selectedDate.toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,exam_slug",
      }
    );

    if (error) {
      console.error("Could not save exam reminder:", error);
      setMessage("Could not save the reminder. Please try again.");
      setSaving(false);
      return;
    }

    setMessage("Exam reminder saved successfully.");
    setSaving(false);
  };

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-slate-800">
      <p className="font-semibold text-slate-900 dark:text-white">
        Set an exam reminder
      </p>

      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        We will show this reminder inside your StudentHub dashboard.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="datetime-local"
          value={reminderAt}
          onChange={(event) => setReminderAt(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-purple-700 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />

        <button
          type="button"
          onClick={saveReminder}
          disabled={saving}
          className="rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Reminder"}
        </button>
      </div>

      {message && (
        <p className="mt-3 text-sm font-medium text-purple-700 dark:text-purple-300">
          {message}
        </p>
      )}
    </div>
  );
}