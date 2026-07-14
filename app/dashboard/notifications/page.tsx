"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Preferences = {
  exam_alerts: boolean;
  job_alerts: boolean;
  scholarship_alerts: boolean;
  college_alerts: boolean;
  email_alerts: boolean;
};

const defaultPreferences: Preferences = {
  exam_alerts: true,
  job_alerts: true,
  scholarship_alerts: true,
  college_alerts: false,
  email_alerts: true,
};

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data, error } = await supabase
        .from("notification_preferences")
        .select(
          "exam_alerts, job_alerts, scholarship_alerts, college_alerts, email_alerts"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Could not load notification preferences:", error);
      }

      if (data) {
        setPreferences(data);
      }

      setLoading(false);
    };

    loadPreferences();
  }, []);

  const updatePreference = (
    key: keyof Preferences,
    value: boolean
  ) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Could not save notification preferences:", error);
      setMessage("Could not save your preferences. Please try again.");
      setSaving(false);
      return;
    }

    setMessage("Notification preferences saved successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-400">
          Loading notification preferences...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Notification Preferences
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Choose which StudentHub updates you want to receive.
        </p>

        <div className="mt-8 space-y-4">
          <PreferenceToggle
            title="Exam alerts"
            description="Important exam dates, deadlines and notifications."
            checked={preferences.exam_alerts}
            onChange={(value) =>
              updatePreference("exam_alerts", value)
            }
          />

          <PreferenceToggle
            title="Job alerts"
            description="New job opportunities and application deadlines."
            checked={preferences.job_alerts}
            onChange={(value) =>
              updatePreference("job_alerts", value)
            }
          />

          <PreferenceToggle
            title="Scholarship alerts"
            description="New scholarships and upcoming last dates."
            checked={preferences.scholarship_alerts}
            onChange={(value) =>
              updatePreference("scholarship_alerts", value)
            }
          />

          <PreferenceToggle
            title="College alerts"
            description="College updates and important admission information."
            checked={preferences.college_alerts}
            onChange={(value) =>
              updatePreference("college_alerts", value)
            }
          />

          <PreferenceToggle
            title="Email notifications"
            description="Receive selected alerts at your registered email address."
            checked={preferences.email_alerts}
            onChange={(value) =>
              updatePreference("email_alerts", value)
            }
          />
        </div>

        {message && (
          <p className="mt-6 rounded-lg bg-blue-50 p-4 text-sm font-medium text-blue-700">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={savePreferences}
          disabled={saving}
          className="mt-8 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </section>
    </main>
  );
}

function PreferenceToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-5 rounded-xl border border-slate-200 p-5 dark:border-slate-700">
      <span>
        <span className="block font-semibold text-slate-900 dark:text-white">
          {title}
        </span>

        <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 accent-blue-700"
      />
    </label>
  );
}