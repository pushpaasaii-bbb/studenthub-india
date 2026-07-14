"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "../../lib/supabase";

type ImportHistoryItem = {
  id: number;
  import_type: string;
  file_name: string;
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  status: string;
  error_summary: string | null;
  created_by: string | null;
  created_at: string;
  completed_at: string | null;
};

const statusStyles: Record<string, string> = {
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  completed_with_errors: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminImportHistoryPage() {
  const [imports, setImports] = useState<ImportHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadImports = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("import_history")
      .select(
        "id, import_type, file_name, total_rows, imported_rows, failed_rows, status, error_summary, created_by, created_at, completed_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Could not load import history:", error);
      setErrorMessage(error.message);
      setImports([]);
      setLoading(false);
      return;
    }

    setImports(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadImports();
  }, [loadImports]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import History</h1>

          <p className="mt-2 text-slate-600">
            Review the latest CSV imports, row counts, and any errors.
          </p>
        </div>

        <button
          type="button"
          onClick={loadImports}
          disabled={loading}
          className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh History"}
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
        {loading ? (
          <div className="p-8 text-slate-600">
            Loading import history...
          </div>
        ) : errorMessage ? (
          <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load import history: {errorMessage}
          </div>
        ) : imports.length === 0 ? (
          <div className="p-8 text-slate-600">
            No imports have been recorded yet. Import a CSV file first.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="whitespace-nowrap p-4">Type</th>
                <th className="whitespace-nowrap p-4">File</th>
                <th className="whitespace-nowrap p-4">Total</th>
                <th className="whitespace-nowrap p-4">Imported</th>
                <th className="whitespace-nowrap p-4">Failed</th>
                <th className="whitespace-nowrap p-4">Status</th>
                <th className="whitespace-nowrap p-4">Imported At</th>
                <th className="whitespace-nowrap p-4">Error Details</th>
              </tr>
            </thead>

            <tbody>
              {imports.map((item) => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="p-4 font-semibold capitalize">
                    {item.import_type}
                  </td>

                  <td className="max-w-xs truncate p-4">
                    {item.file_name}
                  </td>

                  <td className="p-4">{item.total_rows}</td>

                  <td className="p-4 font-semibold text-green-700">
                    {item.imported_rows}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      item.failed_rows > 0
                        ? "text-red-600"
                        : "text-slate-600"
                    }`}
                  >
                    {item.failed_rows}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[item.status] ||
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="whitespace-nowrap p-4">
                    {formatDate(item.created_at)}
                  </td>

                  <td className="max-w-xs p-4 text-slate-600">
                    {item.error_summary || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}