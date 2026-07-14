"use client";

import { useState } from "react";
import { saveSchool, supabase } from "../lib/supabase";

type Props = {
  schoolName: string;
  schoolSlug: string;
};

export default function SaveSchoolButton({
  schoolName,
  schoolSlug,
}: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to save this school.");
      window.location.href = "/auth/login";
      return;
    }

    const success = await saveSchool(user.id, schoolName, schoolSlug);

    if (success) {
      setSaved(true);
      alert("School saved successfully!");
      return;
    }

    alert("This school may already be saved, or something went wrong.");
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saved}
      className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-green-700 disabled:text-green-700 dark:hover:bg-slate-800"
    >
      {saved ? "✅ Saved" : "🔖 Save School"}
    </button>
  );
}