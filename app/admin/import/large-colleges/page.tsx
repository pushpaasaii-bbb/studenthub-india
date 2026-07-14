"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type ImportResult = {
  success?: boolean;
  message?: string;
  totalRows?: number;
  importedRows?: number;
  failedRows?: number;
  status?: string;
  error?: string;
};

export default function LargeCollegeImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    if (!file) {
      alert("Please select a college CSV file first.");
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert("Please log in again as the admin.");
        window.location.href = "/auth/login";
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/admin/large-college-import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const data: ImportResult = await response.json();

      if (!response.ok) {
        setResult(data);
        return;
      }

      setResult(data);
      setFile(null);
    } catch (error) {
      console.error("Large college import error:", error);

      setResult({
        error:
          "Could not connect to the server import route. Please try again.",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/import"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Standard Import
      </Link>

      <h1 className="mt-5 text-3xl font-bold">
        Large College Import
      </h1>

      <p className="mt-2 text-slate-600">
        Upload verified college CSV files with up to 50,000 rows.
        The file is processed on the server in batches of 500.
      </p>

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <p className="font-bold">Use only verified data.</p>

        <p className="mt-2 text-sm">
          Include official source details in your CSV whenever
          possible: source_name, source_url, last_verified_at and
          verification_status.
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700">
          College CSV File
        </label>

        <input
          type="file"
          accept=".csv,text/csv"
          disabled={importing}
          onChange={(event) => {
            setFile(event.target.files?.[0] || null);
            setResult(null);
          }}
          className="mt-3 block w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {file && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-semibold">File:</span> {file.name}
            </p>

            <p className="mt-1">
              <span className="font-semibold">Size:</span>{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={!file || importing}
          className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {importing
            ? "Importing Large CSV... Please Wait"
            : "Start Large College Import"}
        </button>
      </div>

      {result && (
        <div
          className={`mt-6 rounded-xl border p-6 ${
            result.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {result.error ? (
            <>
              <h2 className="text-xl font-bold">Import Failed</h2>
              <p className="mt-2">{result.error}</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">
                Large Import Finished
              </h2>

              <p className="mt-2">
                {result.message || "Import completed."}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-4">
                  <p className="text-sm text-slate-500">Total Rows</p>
                  <p className="mt-1 text-2xl font-bold">
                    {result.totalRows ?? 0}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-4">
                  <p className="text-sm text-slate-500">Imported</p>
                  <p className="mt-1 text-2xl font-bold text-green-700">
                    {result.importedRows ?? 0}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-4">
                  <p className="text-sm text-slate-500">Failed</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">
                    {result.failedRows ?? 0}
                  </p>
                </div>
              </div>

              <Link
                href="/admin/import-history"
                className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
              >
                View Import History →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}