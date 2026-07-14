"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminInput from "../../../components/admin/AdminInput";
import AdminButton from "../../../components/admin/AdminButton";

export default function NewSchoolPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [board, setBoard] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("School name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("schools").insert({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      state: state.trim() || null,
      city: city.trim() || null,
      type: type.trim() || null,
      board: board.trim() || null,
      website: website.trim() || null,
      status,
    });

    setSaving(false);

    if (error) {
      console.error("School insert error:", error);
      alert(error.message);
      return;
    }

    alert("School added successfully!");
    window.location.href = "/admin/schools";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add New School</h1>

      <p className="mt-2 text-slate-600">
        Add a school directly to the StudentHub India database.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <AdminInput
          label="School Name"
          value={name}
          onChange={setName}
          placeholder="Example: Delhi Public School"
        />

        <AdminInput
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder="Example: delhi-public-school"
        />

        <AdminInput
          label="State"
          value={state}
          onChange={setState}
          placeholder="Example: Andhra Pradesh"
        />

        <AdminInput
          label="City"
          value={city}
          onChange={setCity}
          placeholder="Example: Vijayawada"
        />

        <AdminInput
          label="School Type"
          value={type}
          onChange={setType}
          placeholder="Example: Private / Government"
        />

        <AdminInput
          label="Board"
          value={board}
          onChange={setBoard}
          placeholder="Example: CBSE / ICSE / State Board"
        />

        <AdminInput
          label="Website"
          value={website}
          onChange={setWebsite}
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
          {saving ? "Saving School..." : "Save School"}
        </AdminButton>
      </form>
    </div>
  );
}