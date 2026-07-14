"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminInput from "../../../components/admin/AdminInput";
import AdminTextarea from "../../../components/admin/AdminTextarea";
import AdminButton from "../../../components/admin/AdminButton";

export default function NewScholarshipPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [amount, setAmount] = useState("");
  const [applicationStart, setApplicationStart] = useState("");
  const [applicationEnd, setApplicationEnd] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("published");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("Scholarship name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("scholarships").insert({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      provider: provider.trim() || null,
      category: category.trim() || null,
      eligibility: eligibility.trim() || null,
      amount: amount.trim() || null,
      application_start: applicationStart || null,
      application_end: applicationEnd || null,
      official_website: officialWebsite.trim() || null,
      description: description.trim() || null,
      status,
    });

    setSaving(false);

    if (error) {
      console.error("Scholarship insert error:", error);
      alert(error.message);
      return;
    }

    alert("Scholarship added successfully!");
    window.location.href = "/admin/scholarships";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add New Scholarship</h1>

      <p className="mt-2 text-slate-600">
        Add a scholarship opportunity to StudentHub India.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <AdminInput
          label="Scholarship Name"
          value={name}
          onChange={setName}
          placeholder="Example: National Means-cum-Merit Scholarship"
        />

        <AdminInput
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder="Example: national-means-merit-scholarship"
        />

        <AdminInput
          label="Provider"
          value={provider}
          onChange={setProvider}
          placeholder="Example: Ministry of Education"
        />

        <AdminInput
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Example: Merit-based"
        />

        <AdminTextarea
          label="Eligibility"
          value={eligibility}
          onChange={setEligibility}
          placeholder="Write eligibility criteria..."
        />

        <AdminInput
          label="Amount"
          value={amount}
          onChange={setAmount}
          placeholder="Example: ₹12,000 per year"
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

        <AdminInput
          label="Official Website"
          value={officialWebsite}
          onChange={setOfficialWebsite}
          placeholder="https://..."
        />

        <AdminTextarea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Write scholarship description..."
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
          {saving ? "Saving Scholarship..." : "Save Scholarship"}
        </AdminButton>
      </form>
    </div>
  );
}