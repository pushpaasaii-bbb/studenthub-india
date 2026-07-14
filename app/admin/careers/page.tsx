"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminFilters from "../../components/admin/AdminFilters";

type RecordStatus = "published" | "draft" | "review" | "archived";

type Career = {
  id: number;
  title: string;
  category: string | null;
  average_salary: string | null;
  slug: string;
  status: string | null;
  created_at?: string | null;
};

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortValue, setSortValue] = useState("name-asc");

  const loadCareers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("careers")
      .select(
        "id, title, category, average_salary, slug, status, created_at"
      );

    if (error) {
      console.error("Error loading careers:", error);
      setErrorMessage(error.message);
      setCareers([]);
      setLoading(false);
      return;
    }

    setCareers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  const categoryOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        careers
          .map((career) => career.category)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [careers]);

  const statusOptions = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Review", value: "review" },
    { label: "Archived", value: "archived" },
  ];

  const filteredCareers = useMemo(() => {
    let result = [...careers];

    if (categoryFilter) {
      result = result.filter(
        (career) => career.category === categoryFilter
      );
    }

    if (statusFilter) {
      result = result.filter(
        (career) => career.status === statusFilter
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
  }, [careers, categoryFilter, statusFilter, sortValue]);

  const deleteSelectedCareers = async (ids: string[]) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("careers")
      .delete()
      .in("id", numericIds);

    if (error) {
      console.error("Error deleting careers:", error);
      alert(error.message);
      return false;
    }

    await loadCareers();
    return true;
  };

  const updateSelectedCareersStatus = async (
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
      .from("careers")
      .update({ status })
      .in("id", numericIds);

    if (error) {
      console.error("Error updating career status:", error);
      alert(error.message);
      return false;
    }

    await loadCareers();
    return true;
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setSortValue("name-asc");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Careers</h1>

          <p className="mt-2 text-slate-600">
            Search, filter, publish, edit, export and delete careers.
          </p>
        </div>

        <Link
          href="/admin/careers/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Add Career
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
            Loading careers...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load careers: {errorMessage}
          </div>
        ) : (
          <AdminDataTable
            columns={[
              { label: "Title", key: "title" },
              { label: "Category", key: "category" },
              { label: "Salary", key: "average_salary" },
              { label: "Status", key: "status" },
              { label: "Slug", key: "slug" },
            ]}
            data={filteredCareers}
            editBasePath="/admin/careers"
            searchPlaceholder="Search careers..."
            exportFileName="studenthub-careers"
            rowsPerPage={10}
            onDeleteSelected={deleteSelectedCareers}
            onStatusChangeSelected={updateSelectedCareersStatus}
          />
        )}
      </div>
    </div>
  );
}