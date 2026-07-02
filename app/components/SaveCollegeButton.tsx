"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { saveCollege } from "../lib/supabase";

type Props = {
  collegeName: string;
  collegeSlug: string;
};

export default function SaveCollegeButton({ collegeName, collegeSlug }: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to save this college.");
      window.location.href = "/auth/login";
      return;
    }

    const success = await saveCollege(user.id, collegeName, collegeSlug);

    if (success) {
      setSaved(true);
      alert("College saved successfully!");
    } else {
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={saved}
      className="mt-3 w-full rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-green-700 disabled:text-green-700"
    >
      {saved ? "✅ Saved" : "❤️ Save College"}
    </button>
  );
}