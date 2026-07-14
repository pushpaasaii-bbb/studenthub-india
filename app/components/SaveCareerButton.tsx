"use client";

import { useState } from "react";
import { saveCareer, supabase } from "../lib/supabase";

type Props = {
  careerTitle: string;
  careerSlug: string;
};

export default function SaveCareerButton({
  careerTitle,
  careerSlug,
}: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to save this career.");
      window.location.href = "/auth/login";
      return;
    }

    const success = await saveCareer(user.id, careerTitle, careerSlug);

    if (success) {
      setSaved(true);
      alert("Career saved successfully!");
      return;
    }

    alert("This career may already be saved, or something went wrong.");
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saved}
      className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-green-700 disabled:text-green-700 dark:hover:bg-slate-800"
    >
      {saved ? "✅ Saved" : "🔖 Save Career"}
    </button>
  );
}