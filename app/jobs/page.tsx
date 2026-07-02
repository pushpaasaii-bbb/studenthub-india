"use client";

import { useState } from "react";
import JobCard from "../components/JobCard";
import jobs from "../data/jobs.json";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.organization.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.qualification.toLowerCase().includes(search.toLowerCase());

    const matchesType = jobType === "" || job.jobType === jobType;

    return matchesSearch && matchesType;
  });

  const jobTypes = Array.from(new Set(jobs.map((job) => job.jobType)));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Jobs & Career Categories
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore technology, government, finance, design, engineering and
          student career opportunities.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border p-3"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">All Job Types</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-slate-600 dark:text-slate-400">
        Showing {filteredJobs.length} jobs
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            slug={job.slug}
            organization={job.organization}
            location={job.location}
            qualification={job.qualification}
            lastDate={job.lastDate}
          />
        ))}
      </div>
    </main>
  );
}