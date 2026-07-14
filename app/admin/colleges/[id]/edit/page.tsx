"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import AdminInput from "../../../../components/admin/AdminInput";
import AdminTextarea from "../../../../components/admin/AdminTextarea";
import AdminButton from "../../../../components/admin/AdminButton";

const toNumberOrNull = (value: string) => {
  const numberValue = Number(value);
  return value.trim() && Number.isFinite(numberValue)
    ? numberValue
    : null;
};

export default function EditCollegePage() {
  const params = useParams<{ id: string }>();
  const collegeId = params.id;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [university, setUniversity] = useState("");
  const [courseTypes, setCourseTypes] = useState("");
  const [naacGrade, setNaacGrade] = useState("");
  const [nirfRank, setNirfRank] = useState("");
  const [averageFees, setAverageFees] = useState("");
  const [averagePackage, setAveragePackage] = useState("");
  const [highestPackage, setHighestPackage] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [ownership, setOwnership] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [hostel, setHostel] = useState(false);
  const [status, setStatus] = useState("draft");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCollege = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("colleges")
        .select(
          "id, name, slug, college_type, state, city, university, course_types, naac_grade, nirf_rank, average_fees, average_package, highest_package, established_year, ownership, hostel, official_website, description, status"
        )
        .eq("id", collegeId)
        .single();

      if (error || !data) {
        console.error("Could not load college:", error);
        setErrorMessage("College not found or could not be loaded.");
        setLoading(false);
        return;
      }

      setName(data.name || "");
      setSlug(data.slug || "");
      setCollegeType(data.college_type || "");
      setState(data.state || "");
      setCity(data.city || "");
      setUniversity(data.university || "");
      setCourseTypes(
        Array.isArray(data.course_types) ? data.course_types.join(", ") : ""
      );
      setNaacGrade(data.naac_grade || "");
      setNirfRank(data.nirf_rank?.toString() || "");
      setAverageFees(data.average_fees || "");
      setAveragePackage(data.average_package || "");
      setHighestPackage(data.highest_package || "");
      setEstablishedYear(data.established_year?.toString() || "");
      setOwnership(data.ownership || "");
      setHostel(Boolean(data.hostel));
      setOfficialWebsite(data.official_website || "");
      setDescription(data.description || "");
      setStatus(data.status || "draft");
      setLoading(false);
    };

    if (collegeId) {
      loadCollege();
    }
  }, [collegeId]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("College name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("colleges")
      .update({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        college_type: collegeType.trim() || null,
        state: state.trim() || null,
        city: city.trim() || null,
        university: university.trim() || null,
        course_types: courseTypes
          .split(",")
          .map((course) => course.trim())
          .filter(Boolean),
        naac_grade: naacGrade.trim() || null,
        nirf_rank: toNumberOrNull(nirfRank),
        average_fees: averageFees.trim() || null,
        average_package: averagePackage.trim() || null,
        highest_package: highestPackage.trim() || null,
        established_year: toNumberOrNull(establishedYear),
        ownership: ownership.trim() || null,
        hostel,
        official_website: officialWebsite.trim() || null,
        description: description.trim() || null,
        status,
      })
      .eq("id", collegeId);

    setSaving(false);

    if (error) {
      console.error("College update error:", error);
      alert(error.message);
      return;
    }

    alert("College updated successfully!");
    window.location.href = "/admin/colleges";
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-slate-600">
        Loading college...
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
          href="/admin/colleges"
          className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
        >
          ← Back to Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/colleges"
        className="font-semibold text-blue-700 hover:underline"
      >
        ← Back to Colleges
      </Link>

      <h1 className="mt-5 text-3xl font-bold">Edit College</h1>

      <p className="mt-2 text-slate-600">
        Update this college in StudentHub India.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <AdminInput label="College Name" value={name} onChange={setName} placeholder="Example: Indian Institute of Technology Delhi" />
        <AdminInput label="Slug" value={slug} onChange={setSlug} placeholder="Example: iit-delhi" />
        <AdminInput label="College Type" value={collegeType} onChange={setCollegeType} placeholder="Example: IIT / NIT / Private / Government" />
        <AdminInput label="State" value={state} onChange={setState} placeholder="Example: Delhi" />
        <AdminInput label="City" value={city} onChange={setCity} placeholder="Example: New Delhi" />
        <AdminInput label="University" value={university} onChange={setUniversity} placeholder="Example: Autonomous" />
        <AdminInput label="Course Types" value={courseTypes} onChange={setCourseTypes} placeholder="Engineering, Science, Technology" />
        <AdminInput label="NAAC Grade" value={naacGrade} onChange={setNaacGrade} placeholder="Example: A++" />
        <AdminInput label="NIRF Rank" value={nirfRank} onChange={setNirfRank} placeholder="Example: 2" />
        <AdminInput label="Average Fees" value={averageFees} onChange={setAverageFees} placeholder="Example: ₹2.2 lakh per year" />
        <AdminInput label="Average Package" value={averagePackage} onChange={setAveragePackage} placeholder="Example: ₹18 LPA" />
        <AdminInput label="Highest Package" value={highestPackage} onChange={setHighestPackage} placeholder="Example: ₹1 crore" />
        <AdminInput label="Established Year" value={establishedYear} onChange={setEstablishedYear} placeholder="Example: 1961" />
        <AdminInput label="Ownership" value={ownership} onChange={setOwnership} placeholder="Example: Government" />
        <AdminInput label="Official Website" value={officialWebsite} onChange={setOfficialWebsite} placeholder="https://..." />

        <div className="rounded-lg border bg-white p-4">
          <label className="flex items-center gap-3 font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={hostel}
              onChange={(event) => setHostel(event.target.checked)}
              className="h-4 w-4"
            />
            Hostel available
          </label>
        </div>

        <AdminTextarea
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Write a short college description..."
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
          {saving ? "Updating College..." : "Update College"}
        </AdminButton>
      </form>
    </div>
  );
}