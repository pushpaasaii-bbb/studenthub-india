"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminInput from "../../../../components/admin/AdminInput";
import AdminButton from "../../../../components/admin/AdminButton";

type RecordStatus = "published" | "draft" | "review" | "archived";

export default function EditExamPage() {
  const params = useParams<{ id: string }>();
  const examId = params.id;

  const [examName, setExamName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [conductingBody, setConductingBody] = useState("");
  const [level, setLevel] = useState("");
  const [applicationStart, setApplicationStart] = useState("");
  const [applicationEnd, setApplicationEnd] = useState("");
  const [examDate, setExamDate] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");

  const [sourceName, setSourceName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [lastVerifiedAt, setLastVerifiedAt] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("unverified");

  const [status, setStatus] = useState<RecordStatus>("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadExam = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("exams")
        .select(
          "id, exam_name, slug, category, conducting_body, level, application_start, application_end, exam_date, official_website, source_name, source_url, last_verified_at, verification_status, status"
        )
        .eq("id", examId)
        .single();

      if (error || !data) {
        console.error("Could not load exam:", error);
        setErrorMessage("Exam not found or could not be loaded.");
        setLoading(false);
        return;
      }

      setExamName(data.exam_name || "");
      setSlug(data.slug || "");
      setCategory(data.category || "");
      setConductingBody(data.conducting_body || "");
      setLevel(data.level || "");
      setApplicationStart(data.application_start || "");
      setApplicationEnd(data.application_end || "");
      setExamDate(data.exam_date || "");
      setOfficialWebsite(data.official_website || "");

      setSourceName(data.source_name || "");
      setSourceUrl(data.source_url || "");
      setLastVerifiedAt(
        data.last_verified_at ? data.last_verified_at.slice(0, 10) : ""
      );
      setVerificationStatus(data.verification_status || "unverified");

      setStatus((data.status as RecordStatus) || "draft");
      setLoading(false);
    };

    if (examId) {
      loadExam();
    }
  }, [examId]);

  const isValidWebUrl = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!examName.trim() || !slug.trim()) {
      alert("Exam name and slug are required.");
      return;
    }

    if (officialWebsite.trim() && !isValidWebUrl(officialWebsite.trim())) {
      alert("Official website must be a valid http or https URL.");
      return;
    }

    if (sourceUrl.trim() && !isValidWebUrl(sourceUrl.trim())) {
      alert("Source URL must be a valid http or https URL.");
      return;
    }

    if (status === "published") {
      if (
        !sourceName.trim() ||
        !sourceUrl.trim() ||
        !lastVerifiedAt ||
        verificationStatus !== "verified"
      ) {
        alert(
          "A published exam requires source name, source URL, last verified date, and Official source verification."
        );
        return;
      }
    }

    setSaving(true);

    const { error } = await supabase
      .from("exams")
      .update({
        exam_name: examName.trim(),
        slug: slug.trim().toLowerCase(),
        category: category.trim() || null,
        conducting_body: conductingBody.trim() || null,
        level: level.trim() || null,
        application_start: applicationStart || null,
        application_end: applicationEnd || null,
        exam_date: examDate || null,
        official_website: officialWebsite.trim() || null,
        source_name: sourceName.trim() || null,
        source_url: sourceUrl.trim() || null,
        last_verified_at: lastVerifiedAt
          ? new Date(`${lastVerifiedAt}T00:00:00`).toISOString()
          : null,
        verification_status: verificationStatus,
        status,
      })
      .eq("id", examId);

    setSaving(false);

    if (error) {
      console.error("Exam update error:", error);
      alert(error.message);
      return;
    }

    alert("Exam updated successfully!");
    window.location.href = "/admin/exams";
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-600">
        Loading exam...
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
          href="/admin/exams"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Exams
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/exams"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Exams
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit Exam</h1>

      <p className="mt-2 text-slate-600">
        Update this examination in StudentHub India. Published records require
        complete official-source verification.
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

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold text-slate-900">
            Source Verification
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Only official-source verified exams can be published.
          </p>
        </div>

        <AdminInput
          label="Source Name"
          value={sourceName}
          onChange={setSourceName}
          placeholder="Example: National Testing Agency"
        />

        <AdminInput
          label="Source URL"
          value={sourceUrl}
          onChange={setSourceUrl}
          placeholder="https://..."
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Last Verified Date
          </label>

          <input
            type="date"
            value={lastVerifiedAt}
            onChange={(event) => setLastVerifiedAt(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Verification Status
          </label>

          <select
            value={verificationStatus}
            onChange={(event) => setVerificationStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="unverified">Unverified</option>
            <option value="reviewed">Reviewed</option>
            <option value="verified">Official source verified</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as RecordStatus)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <AdminButton>
          {saving ? "Updating Exam..." : "Update Exam"}
        </AdminButton>
      </form>
    </div>
  );
}