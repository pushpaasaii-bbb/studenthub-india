"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminInput from "../../../../components/admin/AdminInput";
import AdminTextarea from "../../../../components/admin/AdminTextarea";
import AdminButton from "../../../../components/admin/AdminButton";

export default function EditCareerPage() {
  const params = useParams<{ id: string }>();
  const careerId = params.id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [alphabet, setAlphabet] = useState("");
  const [category, setCategory] = useState("");
  const [qualification, setQualification] = useState("");
  const [averageSalary, setAverageSalary] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [scope, setScope] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCareer = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("careers")
        .select(
          "id, title, slug, alphabet, category, qualification, average_salary, description, skills, scope, roadmap, status"
        )
        .eq("id", careerId)
        .single();

      if (error || !data) {
        console.error("Could not load career:", error);
        setErrorMessage("Career not found or could not be loaded.");
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setSlug(data.slug || "");
      setAlphabet(data.alphabet || "");
      setCategory(data.category || "");
      setQualification(data.qualification || "");
      setAverageSalary(data.average_salary || "");
      setDescription(data.description || "");
      setSkills(Array.isArray(data.skills) ? data.skills.join(" | ") : "");
      setScope(data.scope || "");
      setRoadmap(data.roadmap || "");
      setStatus(data.status || "draft");
      setLoading(false);
    };

    if (careerId) {
      loadCareer();
    }
  }, [careerId]);

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

    const { error } = await supabase
      .from("careers")
      .update({
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        alphabet:
          alphabet.trim().toUpperCase() ||
          title.trim().charAt(0).toUpperCase(),
        category: category.trim(),
        qualification: qualification.trim() || null,
        average_salary: averageSalary.trim() || null,
        description: description.trim() || null,
        skills: formattedSkills,
        scope: scope.trim() || null,
        roadmap: roadmap.trim() || null,
        status,
      })
      .eq("id", careerId);

    setSaving(false);

    if (error) {
      console.error("Career update error:", error);
      alert(error.message);
      return;
    }

    alert("Career updated successfully!");
    window.location.href = "/admin/careers";
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-600">
        Loading career...
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
          href="/admin/careers"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/careers"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Careers
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit Career</h1>

      <p className="mt-2 text-slate-600">
        Update this career guide in StudentHub India.
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
          label="Alphabet"
          value={alphabet}
          onChange={setAlphabet}
          placeholder="Example: W"
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <AdminButton>
          {saving ? "Updating Career..." : "Update Career"}
        </AdminButton>
      </form>
    </div>
  );
}