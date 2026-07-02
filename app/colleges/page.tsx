"use client";

import { useState } from "react";
import CollegeCard from "../components/CollegeCard";
import CollegeFilters from "../components/CollegeFilters";
import colleges from "../data/colleges.json";

export default function CollegesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filteredColleges = colleges.filter((college) => {
    const matchesSearch =
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.city.toLowerCase().includes(search.toLowerCase()) ||
      college.state.toLowerCase().includes(search.toLowerCase());

    const matchesType = type === "" || college.type === type;

    return matchesSearch && matchesType;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          All India Engineering Colleges
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore IITs, NITs, IIITs and Private Engineering Colleges across
          India.
        </p>
      </div>

      <CollegeFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
      />

      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Showing {filteredColleges.length} colleges
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredColleges.map((college) => (
          <CollegeCard
            key={college.id}
            name={college.name}
            slug={college.slug}
            location={`${college.city}, ${college.state}`}
            type={college.type}
            nirfRank={college.nirfRank}
            fees={`₹${college.fees.toLocaleString()}`}
          />
        ))}
      </div>
    </main>
  );
}