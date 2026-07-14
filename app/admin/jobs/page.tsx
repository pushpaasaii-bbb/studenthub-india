"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminFilters from "../../components/admin/AdminFilters";

type RecordStatus = "published" | "draft" | "review" | "archived";

type Job = {
  id: number;
  title: string;
  company: string | null;
  location: string | null;
  salary: string | null;
  category: string | null;
  job_type: string | null;
  status: string | null;
  created_at?: string | null;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortValue, setSortValue] = useState("newest");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("jobs_v2")
      .select(
        "id, title, company, location, salary, category, job_type, status, created_at"
      );

    if (error) {
      console.error("Error loading jobs:", error);
      setErrorMessage(error.message);
      setJobs([]);
      setLoading(false);
      return;
    }

    setJobs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const categoryOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        jobs
          .map((job) => job.category)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [jobs]);

  const typeOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        jobs
          .map((job) => job.job_type)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (categoryFilter) {
      result = result.filter(
        (job) => job.category === categoryFilter
      );
    }

    if (typeFilter) {
      result = result.filter(
        (job) => job.job_type === typeFilter
      );
    }

    result.sort((a, b) => {
      if (sortValue === "newest") {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      }

      if (sortValue === "oldest") {
        return (
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
        );
      }

      if (sortValue === "name-desc") {
        return b.title.localeCompare(a.title);
      }

      return a.title.localeCompare(b.title);
    });

    return result;
  }, [jobs, categoryFilter, typeFilter, sortValue]);

  const deleteSelectedJobs = async (ids: string[]) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("jobs_v2")
      .delete()
      .in("id", numericIds);

    if (error) {
      console.error("Error deleting jobs:", error);
      alert(error.message);
      return false;
    }

    await loadJobs();
    return true;
  };

  const updateSelectedJobsStatus = async (
    ids: string[],
    status: RecordStatus
  ) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("jobs_v2")
      .update({ status })
      .in("id", numericIds);

    if (error) {
      console.error("Error updating job status:", error);
      alert(error.message);
      return false;
    }

    await loadJobs();
    return true;
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setTypeFilter("");
    setSortValue("newest");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Jobs</h1>

          <p className="mt-2 text-slate-600">
            Search, filter, publish, edit, export and delete jobs.
          </p>
        </div>

        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Add Job
        </Link>
      </div>

      <div className="mt-8">
        <AdminFilters
          categoryValue={categoryFilter}
          stateValue={typeFilter}
          sortValue={sortValue}
          categoryOptions={categoryOptions}
          stateOptions={typeOptions}
          categoryLabel="Category"
          categoryAllLabel="All Categories"
          stateLabel="Job Type"
          stateAllLabel="All Job Types"
          onCategoryChange={setCategoryFilter}
          onStateChange={setTypeFilter}
          onSortChange={setSortValue}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            Loading jobs...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load jobs: {errorMessage}
          </div>
        ) : (
          <AdminDataTable
            columns={[
              { label: "Title", key: "title" },
              { label: "Company", key: "company" },
              { label: "Location", key: "location" },
              { label: "Category", key: "category" },
              { label: "Type", key: "job_type" },
              { label: "Status", key: "status" },
              { label: "Salary", key: "salary" },
            ]}
            data={filteredJobs}
            editBasePath="/admin/jobs"
            searchPlaceholder="Search jobs..."
            exportFileName="studenthub-jobs"
            rowsPerPage={10}
            onDeleteSelected={deleteSelectedJobs}
            onStatusChangeSelected={updateSelectedJobsStatus}
          />
        )}
      </div>
    </div>
  );
}