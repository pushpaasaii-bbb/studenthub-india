"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";

type Column = {
  label: string;
  key: string;
};

type RecordStatus = "published" | "draft" | "review" | "archived";

type AdminDataTableProps = {
  columns: Column[];
  data: Record<string, unknown>[];
  editBasePath?: string;
  searchPlaceholder?: string;
  rowsPerPage?: number;
  exportFileName?: string;
  onDeleteSelected?: (ids: string[]) => Promise<boolean>;
  onStatusChangeSelected?: (
    ids: string[],
    status: RecordStatus
  ) => Promise<boolean>;
};

const statusActions: {
  label: string;
  value: RecordStatus;
  className: string;
}[] = [
  {
    label: "Publish",
    value: "published",
    className: "bg-green-600 hover:bg-green-700",
  },
  {
    label: "Draft",
    value: "draft",
    className: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    label: "Review",
    value: "review",
    className: "bg-blue-600 hover:bg-blue-700",
  },
  {
    label: "Archive",
    value: "archived",
    className: "bg-slate-600 hover:bg-slate-700",
  },
];

export default function AdminDataTable({
  columns,
  data,
  editBasePath,
  searchPlaceholder = "Search records...",
  rowsPerPage = 10,
  exportFileName = "studenthub-data",
  onDeleteSelected,
  onStatusChangeSelected,
}: AdminDataTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] =
    useState<RecordStatus | null>(null);

  const selectionEnabled = Boolean(
    onDeleteSelected || onStatusChangeSelected
  );

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [columns, data, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, data]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const availableIds = new Set(data.map((row) => String(row.id)));

    setSelectedIds((currentIds) =>
      currentIds.filter((id) => availableIds.has(id))
    );
  }, [data]);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const visibleRows = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const visibleIds = visibleRows.map((row) => String(row.id));

  const allVisibleSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIds.includes(id));

  const toggleRow = (id: string) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id]
    );
  };

  const toggleVisibleRows = () => {
    if (allVisibleSelected) {
      setSelectedIds((currentIds) =>
        currentIds.filter((id) => !visibleIds.includes(id))
      );
      return;
    }

    setSelectedIds((currentIds) => [
      ...currentIds,
      ...visibleIds.filter((id) => !currentIds.includes(id)),
    ]);
  };

  const exportCsv = () => {
    if (filteredData.length === 0) {
      alert("No records available to export.");
      return;
    }

    const exportRows = filteredData.map((row) => {
      const formattedRow: Record<string, string> = {};

      columns.forEach((column) => {
        const value = row[column.key];

        formattedRow[column.label] = Array.isArray(value)
          ? value.join(" | ")
          : String(value ?? "");
      });

      return formattedRow;
    });

    const csv = Papa.unparse(exportRows);

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${exportFileName}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const deleteSelected = async () => {
    if (!onDeleteSelected || selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected record${
        selectedIds.length === 1 ? "" : "s"
      }? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const success = await onDeleteSelected(selectedIds);

      if (!success) {
        alert("Delete failed. Please check the database policies.");
        return;
      }

      setSelectedIds([]);
      alert("Selected records deleted successfully.");
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Something went wrong while deleting records.");
    } finally {
      setDeleting(false);
    }
  };

  const updateSelectedStatus = async (status: RecordStatus) => {
    if (!onStatusChangeSelected || selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Change ${selectedIds.length} selected record${
        selectedIds.length === 1 ? "" : "s"
      } to ${status}?`
    );

    if (!confirmed) {
      return;
    }

    setUpdatingStatus(status);

    try {
      const success = await onStatusChangeSelected(selectedIds, status);

      if (!success) {
        alert("Status update failed. Please check the database policies.");
        return;
      }

      setSelectedIds([]);
      alert(`Selected records changed to ${status}.`);
    } catch (error) {
      console.error("Bulk status update error:", error);
      alert("Something went wrong while updating status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const renderCellValue = (column: Column, value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (column.key === "status") {
      const normalizedStatus = String(value).toLowerCase();

      const statusStyles: Record<string, string> = {
        published: "bg-green-100 text-green-700",
        draft: "bg-yellow-100 text-yellow-700",
        review: "bg-blue-100 text-blue-700",
        archived: "bg-red-100 text-red-700",
      };

      const badgeStyle =
        statusStyles[normalizedStatus] ??
        "bg-slate-100 text-slate-700";

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeStyle}`}
        >
          {normalizedStatus}
        </span>
      );
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return String(value);
  };

  return (
    <div>
      <div className="mb-4 rounded-xl border bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 lg:max-w-md"
          />

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-600">
              Showing {visibleRows.length} of {filteredData.length} records
            </p>

            <button
              type="button"
              onClick={exportCsv}
              className="rounded-lg border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Export CSV
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
            <p className="mr-1 text-sm font-semibold text-slate-700">
              {selectedIds.length} selected:
            </p>

            {onStatusChangeSelected &&
              statusActions.map((action) => (
                <button
                  key={action.value}
                  type="button"
                  onClick={() => updateSelectedStatus(action.value)}
                  disabled={Boolean(updatingStatus) || deleting}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
                >
                  {updatingStatus === action.value
                    ? "Updating..."
                    : action.label}
                </button>
              ))}

            {onDeleteSelected && (
              <button
                type="button"
                onClick={deleteSelected}
                disabled={deleting || Boolean(updatingStatus)}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              {selectionEnabled && (
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleVisibleRows}
                    aria-label="Select all visible rows"
                    className="h-4 w-4"
                  />
                </th>
              )}

              {columns.map((column) => (
                <th key={column.key} className="whitespace-nowrap p-4">
                  {column.label}
                </th>
              ))}

              {editBasePath && <th className="p-4">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (editBasePath ? 1 : 0) +
                    (selectionEnabled ? 1 : 0)
                  }
                  className="p-8 text-center text-slate-500"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => {
                const rowId = String(row.id);
                const selected = selectedIds.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    className={`border-b last:border-b-0 ${
                      selected ? "bg-blue-50" : ""
                    }`}
                  >
                    {selectionEnabled && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(rowId)}
                          aria-label={`Select record ${rowId}`}
                          className="h-4 w-4"
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td key={column.key} className="p-4">
                        {renderCellValue(column, row[column.key])}
                      </td>
                    ))}

                    {editBasePath && (
                      <td className="p-4">
                        <Link
                          href={`${editBasePath}/${row.id}/edit`}
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > rowsPerPage && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
              disabled={currentPage === 1}
              className="rounded-lg border px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}