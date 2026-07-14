"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminInput from "../../../components/admin/AdminInput";
import AdminTextarea from "../../../components/admin/AdminTextarea";
import AdminButton from "../../../components/admin/AdminButton";

export default function NewJobPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [qualification, setQualification] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !slug.trim() || !category.trim()) {
      alert("Job title, slug and category are required.");
      return;
    }

    setSaving(true);

    const formattedSkills = skills
      .split("|")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const { error } = await supabase.from("jobs_v2").insert({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      category: category.trim(),
      job_type: jobType.trim() || null,
      company: company.trim() || null,
      location: location.trim() || null,
      qualification: qualification.trim() || null,
      salary: salary.trim() || null,
      experience: experience.trim() || null,
      apply_link: applyLink.trim() || null,
      description: description.trim() || null,
      skills: formattedSkills,
      status,
    });

    setSaving(false);

    if (error) {
      console.error("Job insert error:", error);
      alert(error.message);
      return;
    }

    alert("Job added successfully!");
    window.location.href = "/admin/jobs";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add New Job</h1>

      <p className="mt-2 text-slate-600">
        Create a new job opportunity for StudentHub India.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <AdminInput
          label="Job Title"
          value={title}
          onChange={setTitle}
          placeholder="Example: Software Engineer"
        />

        <AdminInput
          label="Slug"
          value={slug}
          onChange={setSlug}
          placeholder="Example: software-engineer"
        />

        <AdminInput
          label="Category"
          value={category}
          onChange={setCategory}
          placeholder="Example: Technology"
        />

        <AdminInput
          label="Job Type"
          value={jobType}
          onChange={setJobType}
          placeholder="Example: Private / Government / Internship"
        />

        <AdminInput
          label="Company / Organization"
          value={company}
          onChange={setCompany}
          placeholder="Example: TCS"
        />

        <AdminInput
          label="Location"
          value={location}
          onChange={setLocation}
          placeholder="Example: Hyderabad"
        />

        <AdminInput
          label="Qualification"
          value={qualification}
          onChange={setQualification}
          placeholder="Example: B.Tech / Any Degree"
        />

        <AdminInput
          label="Salary"
          value={salary}
          onChange={setSalary}
          placeholder="Example: ₹4 LPA - ₹12 LPA"
        />

        <AdminInput
          label="Experience"
          value={experience}
          onChange={setExperience}
          placeholder="Example: Fresher / 0-2 Years"
        />

        <AdminInput
          label="Apply Link"
          value={applyLink}
          onChange={setApplyLink}
          placeholder="https://..."
        />

        <AdminInput
          label="Skills"
          value={skills}
          onChange={setSkills}
          placeholder="Example: React | TypeScript | SQL"
        />

        <AdminTextarea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Write job description..."
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
          {saving ? "Saving Job..." : "Save Job"}
        </AdminButton>
      </form>
    </div>
  );
}