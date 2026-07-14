"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminFilters from "../../components/admin/AdminFilters";

type RecordStatus = "published" | "draft" | "review" | "archived";

type Scholarship = {
  id: number;
  name: string;
  slug: string;
  provider: string | null;
  category: string | null;
  eligibility: string | null;
  amount: string | null;
  application_start: string | null;
  application_end: string | null;
  official_website: string | null;
  description: string | null;
  status: string | null;
  created_at: string | null;
};

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortValue, setSortValue] = useState("newest");

  const loadScholarships = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("scholarships")
      .select(
        "id, name, slug, provider, category, eligibility, amount, application_start, application_end, official_website, description, status, created_at"
      );

    if (error) {
      console.error("Error loading scholarships:", error);
      setErrorMessage(error.message);
      setScholarships([]);
      setLoading(false);
      return;
    }

    setScholarships(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const categoryOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        scholarships
          .map((scholarship) => scholarship.category)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [scholarships]);

  const statusOptions = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Review", value: "review" },
    { label: "Archived", value: "archived" },
  ];

  const filteredScholarships = useMemo(() => {
    let result = [...scholarships];

    if (categoryFilter) {
      result = result.filter(
        (scholarship) => scholarship.category === categoryFilter
      );
    }

    if (statusFilter) {
      result = result.filter(
        (scholarship) => scholarship.status === statusFilter
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
        return b.name.localeCompare(a.name);
      }

      return a.name.localeCompare(b.name);
    });

    return result;
  }, [scholarships, categoryFilter, statusFilter, sortValue]);

  const deleteSelectedScholarships = async (ids: string[]) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("scholarships")
      .delete()
      .in("id", numericIds);

    if (error) {
      console.error("Error deleting scholarships:", error);
      alert(error.message);
      return false;
    }

    await loadScholarships();
    return true;
  };

  const updateSelectedScholarshipsStatus = async (
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
      .from("scholarships")
      .update({ status })
      .in("id", numericIds);

    if (error) {
      console.error("Error updating scholarship status:", error);
      alert(error.message);
      return false;
    }

    await loadScholarships();
    return true;
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setSortValue("newest");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Scholarships</h1>

          <p className="mt-2 text-slate-600">
            Search, filter, publish, edit, export and delete scholarships.
          </p>
        </div>

        <Link
          href="/admin/scholarships/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Add Scholarship
        </Link>
      </div>

      <div className="mt-8">
        <AdminFilters
          categoryValue={categoryFilter}
          stateValue={statusFilter}
          sortValue={sortValue}
          categoryOptions={categoryOptions}
          stateOptions={statusOptions}
          categoryLabel="Category"
          categoryAllLabel="All Categories"
          stateLabel="Status"
          stateAllLabel="All Statuses"
          onCategoryChange={setCategoryFilter}
          onStateChange={setStatusFilter}
          onSortChange={setSortValue}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            Loading scholarships...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load scholarships: {errorMessage}
          </div>
        ) : (
          <AdminDataTable
            columns={[
              { label: "Scholarship", key: "name" },
              { label: "Provider", key: "provider" },
              { label: "Category", key: "category" },
              { label: "Amount", key: "amount" },
              { label: "Deadline", key: "application_end" },
              { label: "Status", key: "status" },
              { label: "Slug", key: "slug" },
            ]}
            data={filteredScholarships}
            editBasePath="/admin/scholarships"
            searchPlaceholder="Search scholarships..."
            exportFileName="studenthub-scholarships"
            rowsPerPage={10}
            onDeleteSelected={deleteSelectedScholarships}
            onStatusChangeSelected={updateSelectedScholarshipsStatus}
          />
        )}
      </div>
    </div>
  );
}