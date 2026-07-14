"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type AuditLog = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  details: Record<string, unknown>;
  created_at: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatAction = (value: string) =>
  value.replaceAll("_", " ");

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("audit_logs")
      .select(
        "id, action, entity_type, entity_id, entity_name, details, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Could not load audit logs:", error);
      setErrorMessage(error.message);
      setLogs([]);
      setLoading(false);
      return;
    }

    setLogs((data || []) as AuditLog[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>

          <p className="mt-2 text-slate-600">
            Review important actions performed in the StudentHub admin
            panel.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={loading}
          className="rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Logs"}
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
        {loading ? (
          <div className="p-8 text-slate-600">
            Loading audit logs...
          </div>
        ) : errorMessage ? (
          <div className="m-6 rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load audit logs: {errorMessage}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-slate-600">
            No audit logs have been created yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="whitespace-nowrap p-4">Action</th>
                <th className="whitespace-nowrap p-4">Content Type</th>
                <th className="whitespace-nowrap p-4">Name / File</th>
                <th className="whitespace-nowrap p-4">Details</th>
                <th className="whitespace-nowrap p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-b-0">
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                      {formatAction(log.action)}
                    </span>
                  </td>

                  <td className="p-4 font-semibold capitalize">
                    {log.entity_type}
                  </td>

                  <td className="max-w-xs truncate p-4">
                    {log.entity_name || "-"}
                  </td>

                  <td className="max-w-sm p-4 text-slate-600">
                    <pre className="whitespace-pre-wrap break-words font-sans text-xs">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </td>

                  <td className="whitespace-nowrap p-4 text-slate-600">
                    {formatDate(log.created_at)}
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