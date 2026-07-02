"use client";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  type: string;
  setType: (value: string) => void;
}

export default function CollegeFilters({
  search,
  setSearch,
  type,
  setType,
}: Props) {
  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2">
      <input
        type="text"
        placeholder="Search colleges..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-lg border p-3"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-lg border p-3"
      >
        <option value="">All Colleges</option>
        <option value="IIT">IIT</option>
        <option value="NIT">NIT</option>
        <option value="IIIT">IIIT</option>
        <option value="Private">Private</option>
      </select>
    </div>
  );
}