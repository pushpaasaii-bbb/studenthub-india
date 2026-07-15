"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type ProfileForm = {
  full_name: string;
  phone: string;
  city: string;
  state: string;
  education_level: string;
  preferred_stream: string;
  target_exam: string;
};

const emptyProfile: ProfileForm = {
  full_name: "",
  phone: "",
  city: "",
  state: "",
  education_level: "",
  preferred_stream: "",
  target_exam: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, phone, city, state, education_level, preferred_stream, target_exam"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Could not load profile:", error);
        setMessage("Could not load your profile right now.");
        setLoading(false);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          city: data.city || "",
          state: data.state || "",
          education_level: data.education_level || "",
          preferred_stream: data.preferred_stream || "",
          target_exam: data.target_exam || "",
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email || null,
        full_name: profile.full_name.trim() || null,
        phone: profile.phone.trim() || null,
        city: profile.city.trim() || null,
        state: profile.state.trim() || null,
        education_level: profile.education_level || null,
        preferred_stream: profile.preferred_stream.trim() || null,
        target_exam: profile.target_exam.trim() || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

    if (error) {
      console.error("Could not save profile:", error);
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully.");
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-400">
          Loading your profile...
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

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Keep your details updated for better recommendations later.
        </p>

        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-slate-800 dark:text-blue-300">
          Signed in as: <span className="font-semibold">{email}</span>
        </div>

        <form onSubmit={saveProfile} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Full Name
            </label>

            <input
              id="full_name"
              value={profile.full_name}
              onChange={(event) =>
                updateField("full_name", event.target.value)
              }
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Example: 9876543210"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                City
              </label>

              <input
                id="city"
                value={profile.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Example: Vijayawada"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                State
              </label>

              <input
                id="state"
                value={profile.state}
                onChange={(event) => updateField("state", event.target.value)}
                placeholder="Example: Andhra Pradesh"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="education_level"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Education Level
            </label>

            <select
              id="education_level"
              value={profile.education_level}
              onChange={(event) =>
                updateField("education_level", event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Select your education level</option>
              <option value="Class 10">Class 10</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="preferred_stream"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Preferred Stream or Career Area
            </label>

            <input
              id="preferred_stream"
              value={profile.preferred_stream}
              onChange={(event) =>
                updateField("preferred_stream", event.target.value)
              }
              placeholder="Example: Computer Science"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="target_exam"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Target Exam
            </label>

            <input
              id="target_exam"
              value={profile.target_exam}
              onChange={(event) =>
                updateField("target_exam", event.target.value)
              }
              placeholder="Example: JEE Main, GATE or AP EAPCET"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-blue-50 p-4 font-medium text-blue-700 dark:bg-slate-800 dark:text-blue-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}