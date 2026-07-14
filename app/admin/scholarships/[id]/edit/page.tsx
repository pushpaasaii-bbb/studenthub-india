"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminInput from "../../../../components/admin/AdminInput";
import AdminTextarea from "../../../../components/admin/AdminTextarea";
import AdminButton from "../../../../components/admin/AdminButton";

export default function EditScholarshipPage() {
  const params = useParams<{ id: string }>();
  const scholarshipId = params.id;

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
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadScholarship = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("scholarships")
        .select(
          "id, name, slug, provider, category, eligibility, amount, application_start, application_end, official_website, description, status"
        )
        .eq("id", scholarshipId)
        .single();

      if (error || !data) {
        console.error("Could not load scholarship:", error);
        setErrorMessage("Scholarship not found or could not be loaded.");
        setLoading(false);
        return;
      }

      setName(data.name || "");
      setSlug(data.slug || "");
      setProvider(data.provider || "");
      setCategory(data.category || "");
      setEligibility(data.eligibility || "");
      setAmount(data.amount || "");
      setApplicationStart(data.application_start || "");
      setApplicationEnd(data.application_end || "");
      setOfficialWebsite(data.official_website || "");
      setDescription(data.description || "");
      setStatus(data.status || "draft");
      setLoading(false);
    };

    if (scholarshipId) {
      loadScholarship();
    }
  }, [scholarshipId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("Scholarship name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("scholarships")
      .update({
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
      })
      .eq("id", scholarshipId);

    setSaving(false);

    if (error) {
      console.error("Scholarship update error:", error);
      alert(error.message);
      return;
    }

    alert("Scholarship updated successfully!");
    window.location.href = "/admin/scholarships";
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-600">
        Loading scholarship...
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
          href="/admin/scholarships"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Scholarships
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/scholarships"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Scholarships
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit Scholarship</h1>

      <p className="mt-2 text-slate-600">
        Update this scholarship opportunity in StudentHub India.
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
          {saving ? "Updating Scholarship..." : "Update Scholarship"}
        </AdminButton>
      </form>
    </div>
  );
}