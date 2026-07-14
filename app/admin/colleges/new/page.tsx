"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import AdminInput from "../../../components/admin/AdminInput";
import AdminTextarea from "../../../components/admin/AdminTextarea";
import AdminButton from "../../../components/admin/AdminButton";

export default function NewCollegePage() {
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
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("College name and slug are required.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("colleges").insert({
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
      nirf_rank: nirfRank.trim() ? Number(nirfRank) : null,
      average_fees: averageFees.trim() || null,
      average_package: averagePackage.trim() || null,
      highest_package: highestPackage.trim() || null,
      established_year: establishedYear.trim()
        ? Number(establishedYear)
        : null,
      ownership: ownership.trim() || null,
      hostel,
      official_website: officialWebsite.trim() || null,
      description: description.trim() || null,
      status,
    });

    setSaving(false);

    if (error) {
      console.error("College insert error:", error);
      alert(error.message);
      return;
    }

    alert("College added successfully!");
    window.location.href = "/admin/colleges";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Add New College</h1>

      <p className="mt-2 text-slate-600">
        Add a college directly to the StudentHub India database.
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
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <AdminButton>
          {saving ? "Saving College..." : "Save College"}
        </AdminButton>
      </form>
    </div>
  );
}