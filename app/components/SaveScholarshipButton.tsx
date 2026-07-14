"use client";

import { useState } from "react";
import { saveScholarship, supabase } from "../lib/supabase";

type Props = {
  scholarshipName: string;
  scholarshipSlug: string;
};

export default function SaveScholarshipButton({
  scholarshipName,
  scholarshipSlug,
}: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to save this scholarship.");
      window.location.href = "/auth/login";
      return;
    }

    const success = await saveScholarship(
      user.id,
      scholarshipName,
      scholarshipSlug
    );

    setSaving(false);

    if (success) {
      setSaved(true);
      alert("Scholarship saved successfully!");
    } else {
      alert("This scholarship may already be saved, or something went wrong.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saved || saving}
      className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-green-700 disabled:text-green-700"
    >
      {saved ? "✅ Saved" : saving ? "Saving..." : "♡ Save Scholarship"}
    </button>
  );
}