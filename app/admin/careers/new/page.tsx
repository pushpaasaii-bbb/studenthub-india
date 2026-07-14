"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminInput from "../../../components/admin/AdminInput";
import AdminTextarea from "../../../components/admin/AdminTextarea";
import AdminButton from "../../../components/admin/AdminButton";

export default function NewCareerPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [qualification, setQualification] = useState("");
  const [averageSalary, setAverageSalary] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [scope, setScope] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !slug.trim() || !category.trim()) {
      alert("Career title, slug and category are required.");
      return;
    }

    setSaving(true);

    const formattedSkills = skills
      .split("|")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const { error } = await supabase.from("careers").insert({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      alphabet: title.trim().charAt(0).toUpperCase(),
      category: category.trim(),
      qualification: qualification.trim() || null,
      average_salary: averageSalary.trim() || null,
      description: description.trim() || null,
      skills: formattedSkills,
      scope: scope.trim() || null,
      roadmap: roadmap.trim() || null,
      status,
    });

    setSaving(false);

    if (error) {
      console.error("Career insert error:", error);
      alert(error.message);
      return;
    }

    alert("Career added successfully!");
    window.location.href = "/admin/careers";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add New Career</h1>

      <p className="mt-2 text-slate-600">
        Create a new career guide for StudentHub India.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <AdminInput
          label="Career Title"
          value={title}
          onChange={setTitle}
          placeholder="Example: Web Developer"
        />

        <AdminInput
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder="Example: web-developer"
        />

        <AdminInput
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Example: Technology"
        />

        <AdminInput
          label="Qualification"
          value={qualification}
          onChange={setQualification}
          placeholder="Example: B.Tech / Any Degree"
        />

        <AdminInput
          label="Average Salary"
          value={averageSalary}
          onChange={setAverageSalary}
          placeholder="Example: ₹3 LPA - ₹18 LPA"
        />

        <AdminInput
          label="Skills"
          value={skills}
          onChange={setSkills}
          placeholder="Example: HTML | CSS | JavaScript"
        />

        <AdminTextarea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Write career description..."
        />

        <AdminTextarea
          label="Future Scope"
          value={scope}
          onChange={setScope}
          placeholder="Write the future scope of this career..."
        />

        <AdminTextarea
          label="Career Roadmap"
          value={roadmap}
          onChange={setRoadmap}
          placeholder="Write the learning roadmap..."
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
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <AdminButton>
          {saving ? "Saving Career..." : "Save Career"}
        </AdminButton>
      </form>
    </div>
  );
}