"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminInput from "../../../components/admin/AdminInput";
import AdminButton from "../../../components/admin/AdminButton";

export default function NewExamPage() {
  const [examName, setExamName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [conductingBody, setConductingBody] = useState("");
  const [level, setLevel] = useState("");
  const [applicationStart, setApplicationStart] = useState("");
  const [applicationEnd, setApplicationEnd] = useState("");
  const [examDate, setExamDate] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [status, setStatus] = useState("published");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!examName.trim() || !slug.trim()) {
      alert("Exam name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("exams").insert({
      exam_name: examName.trim(),
      slug: slug.trim().toLowerCase(),
      category: category.trim() || null,
      conducting_body: conductingBody.trim() || null,
      level: level.trim() || null,
      application_start: applicationStart || null,
      application_end: applicationEnd || null,
      exam_date: examDate || null,
      official_website: officialWebsite.trim() || null,
      status,
    });

    setSaving(false);

    if (error) {
      console.error("Exam insert error:", error);
      alert(error.message);
      return;
    }

    alert("Exam added successfully!");
    window.location.href = "/admin/exams";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add New Exam</h1>

      <p className="mt-2 text-slate-600">
        Add a new examination to StudentHub India.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <AdminInput
          label="Exam Name"
          value={examName}
          onChange={setExamName}
          placeholder="Example: JEE Main 2027"
        />

        <AdminInput
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder="Example: jee-main-2027"
        />

        <AdminInput
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Example: Engineering Entrance"
        />

        <AdminInput
          label="Conducting Body"
          value={conductingBody}
          onChange={setConductingBody}
          placeholder="Example: National Testing Agency"
        />

        <AdminInput
          label="Level"
          value={level}
          onChange={setLevel}
          placeholder="Example: National"
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Application Start
          </label>

          <input
            type="date"
            value={applicationStart}
            onChange={(event) => setApplicationStart(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Application End
          </label>

          <input
            type="date"
            value={applicationEnd}
            onChange={(event) => setApplicationEnd(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Exam Date
          </label>

          <input
            type="date"
            value={examDate}
            onChange={(event) => setExamDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <AdminInput
          label="Official Website"
          value={officialWebsite}
          onChange={setOfficialWebsite}
          placeholder="https://..."
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <AdminButton>
          {saving ? "Saving Exam..." : "Save Exam"}
        </AdminButton>
      </form>
    </div>
  );
}