"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminFilters from "../../components/admin/AdminFilters";

type RecordStatus = "published" | "draft" | "review" | "archived";

type College = {
  id: number;
  name: string;
  college_type: string | null;
  state: string | null;
  city: string | null;
  nirf_rank: number | null;
  average_fees: string | null;
  slug: string;
  status: string | null;
  created_at?: string | null;
};

const FETCH_SIZE = 1000;

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [typeFilter, setTypeFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [sortValue, setSortValue] = useState("name-asc");

  const loadColleges = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const allColleges: College[] = [];
    let start = 0;

    try {
      while (true) {
        const { data, error } = await supabase
          .from("colleges")
          .select(
            "id, name, college_type, state, city, nirf_rank, average_fees, slug, status, created_at"
          )
          .order("id", { ascending: true })
          .range(start, start + FETCH_SIZE - 1);

        if (error) {
          throw error;
        }

        const batch = (data || []) as College[];
        allColleges.push(...batch);

        if (batch.length < FETCH_SIZE) {
          break;
        }

        start += FETCH_SIZE;
      }

      setColleges(allColleges);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not load colleges.";

      console.error("Error loading colleges:", error);
      setErrorMessage(message);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  const typeOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        colleges
          .map((college) => college.college_type)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [colleges]);

  const stateOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        colleges
          .map((college) => college.state)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    let result = [...colleges];

    if (typeFilter) {
      result = result.filter(
        (college) => college.college_type === typeFilter
      );
    }

    if (stateFilter) {
      result = result.filter(
        (college) => college.state === stateFilter
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
  }, [colleges, typeFilter, stateFilter, sortValue]);

  const deleteSelectedColleges = async (ids: string[]) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("colleges")
      .delete()
      .in("id", numericIds);

    if (error) {
      console.error("Error deleting colleges:", error);
      alert(error.message);
      return false;
    }

    await loadColleges();
    return true;
  };

  const updateSelectedCollegesStatus = async (
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
      .from("colleges")
      .update({ status })
      .in("id", numericIds);

    if (error) {
      console.error("Error updating college status:", error);
      alert(error.message);
      return false;
    }

    await loadColleges();
    return true;
  };

  const resetFilters = () => {
    setTypeFilter("");
    setStateFilter("");
    setSortValue("name-asc");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Colleges</h1>

          <p className="mt-2 text-slate-600">
            Search, filter, publish, edit, export and delete colleges.
          </p>
        </div>

        <Link
          href="/admin/colleges/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Add College
        </Link>
      </div>

      <div className="mt-8">
        <AdminFilters
          categoryValue={typeFilter}
          stateValue={stateFilter}
          sortValue={sortValue}
          categoryOptions={typeOptions}
          stateOptions={stateOptions}
          categoryLabel="College Type"
          categoryAllLabel="All College Types"
          stateLabel="State"
          stateAllLabel="All States"
          onCategoryChange={setTypeFilter}
          onStateChange={setStateFilter}
          onSortChange={setSortValue}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            Loading colleges...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load colleges: {errorMessage}
          </div>
        ) : (
          <AdminDataTable
            columns={[
              { label: "College", key: "name" },
              { label: "Type", key: "college_type" },
              { label: "State", key: "state" },
              { label: "City", key: "city" },
              { label: "NIRF", key: "nirf_rank" },
              { label: "Fees", key: "average_fees" },
              { label: "Status", key: "status" },
              { label: "Slug", key: "slug" },
            ]}
            data={filteredColleges}
            editBasePath="/admin/colleges"
            searchPlaceholder="Search colleges..."
            exportFileName="studenthub-colleges"
            rowsPerPage={10}
            onDeleteSelected={deleteSelectedColleges}
            onStatusChangeSelected={updateSelectedCollegesStatus}
          />
        )}
      </div>
    </div>
  );
}