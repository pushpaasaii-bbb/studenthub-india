"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminFilters from "../../components/admin/AdminFilters";

type RecordStatus = "published" | "draft" | "review" | "archived";

type School = {
  id: number;
  name: string;
  state: string | null;
  city: string | null;
  type: string | null;
  board: string | null;
  slug: string;
  status: string | null;
  created_at?: string | null;
};

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [typeFilter, setTypeFilter] = useState("");
  const [boardFilter, setBoardFilter] = useState("");
  const [sortValue, setSortValue] = useState("name-asc");

  const loadSchools = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("schools")
      .select(
        "id, name, state, city, type, board, slug, status, created_at"
      );

    if (error) {
      console.error("Error loading schools:", error);
      setErrorMessage(error.message);
      setSchools([]);
      setLoading(false);
      return;
    }

    setSchools(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  const typeOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        schools
          .map((school) => school.type)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [schools]);

  const boardOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        schools
          .map((school) => school.board)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [schools]);

  const filteredSchools = useMemo(() => {
    let result = [...schools];

    if (typeFilter) {
      result = result.filter((school) => school.type === typeFilter);
    }

    if (boardFilter) {
      result = result.filter((school) => school.board === boardFilter);
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
  }, [schools, typeFilter, boardFilter, sortValue]);

  const deleteSelectedSchools = async (ids: string[]) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("schools")
      .delete()
      .in("id", numericIds);

    if (error) {
      console.error("Error deleting schools:", error);
      alert(error.message);
      return false;
    }

    await loadSchools();
    return true;
  };

  const updateSelectedSchoolsStatus = async (
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
      .from("schools")
      .update({ status })
      .in("id", numericIds);

    if (error) {
      console.error("Error updating school status:", error);
      alert(error.message);
      return false;
    }

    await loadSchools();
    return true;
  };

  const resetFilters = () => {
    setTypeFilter("");
    setBoardFilter("");
    setSortValue("name-asc");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Schools</h1>

          <p className="mt-2 text-slate-600">
            Search, filter, publish, edit, export and delete schools.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/schools/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            + Add School
          </Link>

          <Link
            href="/admin/import"
            className="inline-flex items-center justify-center rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
          >
            Import Schools
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminFilters
          categoryValue={typeFilter}
          stateValue={boardFilter}
          sortValue={sortValue}
          categoryOptions={typeOptions}
          stateOptions={boardOptions}
          categoryLabel="School Type"
          categoryAllLabel="All School Types"
          stateLabel="Board"
          stateAllLabel="All Boards"
          onCategoryChange={setTypeFilter}
          onStateChange={setBoardFilter}
          onSortChange={setSortValue}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            Loading schools...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load schools: {errorMessage}
          </div>
        ) : schools.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            No schools found. Add a school or import a schools CSV file.
          </div>
        ) : (
          <AdminDataTable
            columns={[
              { label: "School", key: "name" },
              { label: "State", key: "state" },
              { label: "City", key: "city" },
              { label: "Type", key: "type" },
              { label: "Board", key: "board" },
              { label: "Status", key: "status" },
              { label: "Slug", key: "slug" },
            ]}
            data={filteredSchools}
            editBasePath="/admin/schools"
            searchPlaceholder="Search schools..."
            exportFileName="studenthub-schools"
            rowsPerPage={10}
            onDeleteSelected={deleteSelectedSchools}
            onStatusChangeSelected={updateSelectedSchoolsStatus}
          />
        )}
      </div>
    </div>
  );
}