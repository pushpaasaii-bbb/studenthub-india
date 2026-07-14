"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminInput from "../../../../components/admin/AdminInput";
import AdminTextarea from "../../../../components/admin/AdminTextarea";
import AdminButton from "../../../../components/admin/AdminButton";
export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("jobs_v2")
        .select(
          "id, title, slug, category, job_type, company, location, qualification, salary, experience, apply_link, description, skills, status"
        )
        .eq("id", jobId)
        .single();

      if (error || !data) {
        console.error("Could not load job:", error);
        setErrorMessage("Job not found or could not be loaded.");
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setSlug(data.slug || "");
      setCategory(data.category || "");
      setJobType(data.job_type || "");
      setCompany(data.company || "");
      setLocation(data.location || "");
      setQualification(data.qualification || "");
      setSalary(data.salary || "");
      setExperience(data.experience || "");
      setApplyLink(data.apply_link || "");
      setDescription(data.description || "");
      setSkills(Array.isArray(data.skills) ? data.skills.join(" | ") : "");
      setStatus(data.status || "draft");
      setLoading(false);
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId]);

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

    const { error } = await supabase
      .from("jobs_v2")
      .update({
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
      })
      .eq("id", jobId);

    setSaving(false);

    if (error) {
      console.error("Job update error:", error);
      alert(error.message);
      return;
    }

    alert("Job updated successfully!");
    window.location.href = "/admin/jobs";
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-600">
        Loading job...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {errorMessage}
        </div>

        <Link
          href="/admin/jobs"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/jobs"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Jobs
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit Job</h1>

      <p className="mt-2 text-slate-600">
        Update this job opportunity in StudentHub India.
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <AdminButton>
          {saving ? "Updating Job..." : "Update Job"}
        </AdminButton>
      </form>
    </div>
  );
}