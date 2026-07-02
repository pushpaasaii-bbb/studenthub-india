"use client";

import { useState } from "react";
import { supabase, saveExam } from "../lib/supabase";

type Props = {
  examName: string;
  examSlug: string;
};

export default function SaveExamButton({ examName, examSlug }: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to save this exam.");
      window.location.href = "/auth/login";
      return;
    }

    const success = await saveExam(user.id, examName, examSlug);

    if (success) {
      setSaved(true);
      alert("Exam saved successfully!");
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saved}
      className="mt-3 w-full rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:border-green-700 disabled:text-green-700"
    >
      {saved ? "✅ Saved" : "❤️ Save Exam"}
    </button>
  );
}