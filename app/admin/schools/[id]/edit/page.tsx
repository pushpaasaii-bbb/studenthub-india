"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminInput from "../../../../components/admin/AdminInput";
import AdminButton from "../../../../components/admin/AdminButton";

export default function EditSchoolPage() {
  const params = useParams<{ id: string }>();
  const schoolId = params.id;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [board, setBoard] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadSchool = async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, name, slug, state, city, type, board, website, status")
        .eq("id", schoolId)
        .single();

      if (error || !data) {
        console.error("Could not load school:", error);
        setErrorMessage("School not found or could not be loaded.");
        setLoading(false);
        return;
      }

      setName(data.name || "");
      setSlug(data.slug || "");
      setState(data.state || "");
      setCity(data.city || "");
      setType(data.type || "");
      setBoard(data.board || "");
      setWebsite(data.website || "");
      setStatus(data.status || "draft");
      setLoading(false);
    };

    if (schoolId) {
      loadSchool();
    }
  }, [schoolId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("School name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("schools")
      .update({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        state: state.trim() || null,
        city: city.trim() || null,
        type: type.trim() || null,
        board: board.trim() || null,
        website: website.trim() || null,
        status,
      })
      .eq("id", schoolId);

    setSaving(false);

    if (error) {
      console.error("School update error:", error);
      alert(error.message);
      return;
    }

    alert("School updated successfully!");
    window.location.href = "/admin/schools";
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-600">
        Loading school...
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
          href="/admin/schools"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Schools
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/schools"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Schools
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit School</h1>

      <p className="mt-2 text-slate-600">
        Update this school in StudentHub India.
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
          {saving ? "Updating School..." : "Update School"}
        </AdminButton>
      </form>
    </div>
  );
}