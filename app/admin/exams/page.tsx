"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import AdminDataTable from "../../components/admin/AdminDataTable";
import AdminFilters from "../../components/admin/AdminFilters";

type RecordStatus = "published" | "draft" | "review" | "archived";

type Exam = {
  id: number;
  exam_name: string;
  slug: string;
  category: string | null;
  conducting_body: string | null;
  level: string | null;
  application_start: string | null;
  application_end: string | null;
  exam_date: string | null;
  official_website: string | null;
  status: string | null;
  created_at: string | null;
};

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortValue, setSortValue] = useState("newest");

  const loadExams = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("exams")
      .select(
        "id, exam_name, slug, category, conducting_body, level, application_start, application_end, exam_date, official_website, status, created_at"
      );

    if (error) {
      console.error("Error loading exams:", error);
      setErrorMessage(error.message);
      setExams([]);
      setLoading(false);
      return;
    }

    setExams(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const categoryOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        exams
          .map((exam) => exam.category)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [exams]);

  const levelOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        exams
          .map((exam) => exam.level)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();

    return values.map((value) => ({
      label: value,
      value,
    }));
  }, [exams]);

  const filteredExams = useMemo(() => {
    let result = [...exams];

    if (categoryFilter) {
      result = result.filter(
        (exam) => exam.category === categoryFilter
      );
    }

    if (levelFilter) {
      result = result.filter(
        (exam) => exam.level === levelFilter
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
        return b.exam_name.localeCompare(a.exam_name);
      }

      return a.exam_name.localeCompare(b.exam_name);
    });

    return result;
  }, [exams, categoryFilter, levelFilter, sortValue]);

  const deleteSelectedExams = async (ids: string[]) => {
    const numericIds = ids
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    if (numericIds.length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("exams")
      .delete()
      .in("id", numericIds);

    if (error) {
      console.error("Error deleting exams:", error);
      alert(error.message);
      return false;
    }

    await loadExams();
    return true;
  };

  const updateSelectedExamsStatus = async (
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
      .from("exams")
      .update({ status })
      .in("id", numericIds);

    if (error) {
      console.error("Error updating exam status:", error);
      alert(error.message);
      return false;
    }

    await loadExams();
    return true;
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setLevelFilter("");
    setSortValue("newest");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Exams</h1>

          <p className="mt-2 text-slate-600">
            Search, filter, publish, edit, export and delete exams.
          </p>
        </div>

        <Link
          href="/admin/exams/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Add Exam
        </Link>
      </div>

      <div className="mt-8">
        <AdminFilters
          categoryValue={categoryFilter}
          stateValue={levelFilter}
          sortValue={sortValue}
          categoryOptions={categoryOptions}
          stateOptions={levelOptions}
          categoryLabel="Category"
          categoryAllLabel="All Categories"
          stateLabel="Level"
          stateAllLabel="All Levels"
          onCategoryChange={setCategoryFilter}
          onStateChange={setLevelFilter}
          onSortChange={setSortValue}
          onReset={resetFilters}
        />

        {loading ? (
          <div className="rounded-xl border bg-white p-6 text-slate-600">
            Loading exams...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load exams: {errorMessage}
          </div>
        ) : (
          <AdminDataTable
            columns={[
              { label: "Exam", key: "exam_name" },
              { label: "Category", key: "category" },
              { label: "Conducted By", key: "conducting_body" },
              { label: "Level", key: "level" },
              { label: "Exam Date", key: "exam_date" },
              { label: "Status", key: "status" },
              { label: "Slug", key: "slug" },
            ]}
            data={filteredExams}
            editBasePath="/admin/exams"
            searchPlaceholder="Search exams..."
            exportFileName="studenthub-exams"
            rowsPerPage={10}
            onDeleteSelected={deleteSelectedExams}
            onStatusChangeSelected={updateSelectedExamsStatus}
          />
        )}
      </div>
    </div>
  );
}