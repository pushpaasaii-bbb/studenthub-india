"use client";
import Link from "next/link";
import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "../../lib/supabase";


const BATCH_SIZE = 100;
const MAX_ROWS_PER_IMPORT = 1000;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const importTypes = [
  { label: "🎓 Colleges", value: "colleges" },
  { label: "💼 Jobs", value: "jobs" },
  { label: "🧭 Careers", value: "careers" },
  { label: "🏫 Schools", value: "schools" },
  { label: "📝 Exams", value: "exams" },
  { label: "🎁 Scholarships", value: "scholarships" },
] as const;

type ImportType = (typeof importTypes)[number]["value"];
type CsvRow = Record<string, string>;

type FailedRow = {
  rowNumber: number;
  error: string;
  row: CsvRow;
};

const cleanText = (value?: string) => {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
};

const cleanSlug = (value?: string) =>
  value?.trim().toLowerCase() || "";

const cleanStatus = (value?: string) => {
  const status = value?.trim().toLowerCase();
  const allowedStatuses = [
    "published",
    "draft",
    "review",
    "archived",
  ];

  return allowedStatuses.includes(status || "") ? status : "draft";
};

const cleanVerificationStatus = (value?: string) => {
  const status = value?.trim().toLowerCase();
  const allowedStatuses = [
    "unverified",
    "verified",
    "needs_review",
    "outdated",
  ];

  return allowedStatuses.includes(status || "")
    ? status
    : "unverified";
};

const cleanDate = (value?: string) => {
  const cleaned = value?.trim();

  if (!cleaned) {
    return null;
  }

  return Number.isNaN(new Date(cleaned).getTime())
    ? null
    : cleaned;
};

const cleanNumber = (value?: string) => {
  const cleaned = value?.trim();

  if (!cleaned) {
    return null;
  }

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
};

const splitPipeValues = (value?: string) =>
  value
    ? value
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

const getQualityFields = (row: CsvRow) => ({
  source_name: cleanText(row.source_name),
  source_url: cleanText(row.source_url),
  last_verified_at: cleanDate(row.last_verified_at),
  verification_status: cleanVerificationStatus(
    row.verification_status
  ),
});

export default function AdminImportPage() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [importType, setImportType] =
    useState<ImportType>("colleges");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedRows, setFailedRows] = useState<FailedRow[]>([]);

  const getRequiredFields = () => {
    if (importType === "jobs" || importType === "careers") {
      return ["title", "slug"];
    }

    if (importType === "exams") {
      return ["exam_name", "slug"];
    }

    return ["name", "slug"];
  };

  const validateRows = () => {
    const requiredFields = getRequiredFields();

    const missingFieldIndex = rows.findIndex((row) =>
      requiredFields.some((field) => !row[field]?.trim())
    );

    if (missingFieldIndex !== -1) {
      alert(
        `Row ${missingFieldIndex + 2} is missing a required field. Required columns: ${requiredFields.join(
          ", "
        )}`
      );
      return false;
    }

    const slugs = rows.map((row) => cleanSlug(row.slug));
    const duplicateSlugs = slugs.filter(
      (slug, index) => slugs.indexOf(slug) !== index
    );

    if (duplicateSlugs.length > 0) {
      alert(
        `Your CSV contains duplicate slugs, for example: ${duplicateSlugs[0]}. Each row must have a unique slug.`
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    setRows([]);
    setFailedRows([]);
    setProgress(0);

    if (!file) {
      setSelectedFileName("");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      alert("Please choose a CSV file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert("CSV file is too large. Maximum allowed size is 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFileName(file.name);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),

      complete: (result) => {
        const validRows = result.data.filter((row) =>
          Object.values(row).some((value) => value?.trim())
        );

        if (validRows.length > MAX_ROWS_PER_IMPORT) {
          alert(
            `This importer supports up to ${MAX_ROWS_PER_IMPORT} rows per upload. Your file has ${validRows.length} rows.`
          );
          setRows([]);
          setSelectedFileName("");
          return;
        }

        if (result.errors.length > 0) {
          console.warn("CSV parsing warnings:", result.errors);
        }

        setRows(validRows);
      },

      error: (error) => {
        console.error("CSV parse error:", error);
        alert("Could not read this CSV file.");
        setRows([]);
        setSelectedFileName("");
      },
    });
  };

  const createRecord = (row: CsvRow) => {
    if (importType === "jobs") {
      return {
        title: row.title.trim(),
        slug: cleanSlug(row.slug),
        category: cleanText(row.category),
        job_type: cleanText(row.job_type),
        company: cleanText(row.company),
        location: cleanText(row.location),
        qualification: cleanText(row.qualification),
        salary: cleanText(row.salary),
        experience: cleanText(row.experience),
        apply_link: cleanText(row.apply_link),
        description: cleanText(row.description),
        skills: splitPipeValues(row.skills),
        status: cleanStatus(row.status),
        ...getQualityFields(row),
      };
    }

    if (importType === "colleges") {
      return {
        name: row.name.trim(),
        slug: cleanSlug(row.slug),
        college_type: cleanText(row.college_type),
        state: cleanText(row.state),
        city: cleanText(row.city),
        university: cleanText(row.university),
        course_types: splitPipeValues(row.course_types),
        naac_grade: cleanText(row.naac_grade),
        nirf_rank: cleanNumber(row.nirf_rank),
        average_fees: cleanText(row.average_fees),
        average_package: cleanText(row.average_package),
        highest_package: cleanText(row.highest_package),
        established_year: cleanNumber(row.established_year),
        ownership: cleanText(row.ownership),
        hostel: row.hostel?.trim().toLowerCase() === "true",
        official_website: cleanText(row.official_website),
        description: cleanText(row.description),
        status: cleanStatus(row.status),
        ...getQualityFields(row),
      };
    }

    if (importType === "careers") {
      return {
        title: row.title.trim(),
        slug: cleanSlug(row.slug),
        alphabet:
          row.alphabet?.trim().toUpperCase() ||
          row.title.trim().charAt(0).toUpperCase(),
        category: cleanText(row.category),
        qualification: cleanText(row.qualification),
        average_salary: cleanText(row.average_salary),
        description: cleanText(row.description),
        skills: splitPipeValues(row.skills),
        scope: cleanText(row.scope),
        roadmap: cleanText(row.roadmap),
        status: cleanStatus(row.status),
        ...getQualityFields(row),
      };
    }

    if (importType === "schools") {
      return {
        name: row.name.trim(),
        slug: cleanSlug(row.slug),
        state: cleanText(row.state),
        city: cleanText(row.city),
        type: cleanText(row.type),
        board: cleanText(row.board),
        website: cleanText(row.website),
        status: cleanStatus(row.status),
        ...getQualityFields(row),
      };
    }

    if (importType === "exams") {
      return {
        exam_name: row.exam_name.trim(),
        slug: cleanSlug(row.slug),
        category: cleanText(row.category),
        conducting_body: cleanText(row.conducting_body),
        level: cleanText(row.level),
        application_start: cleanDate(row.application_start),
        application_end: cleanDate(row.application_end),
        exam_date: cleanDate(row.exam_date),
        official_website: cleanText(row.official_website),
        status: cleanStatus(row.status),
        ...getQualityFields(row),
      };
    }

    return {
      name: row.name.trim(),
      slug: cleanSlug(row.slug),
      provider: cleanText(row.provider),
      category: cleanText(row.category),
      eligibility: cleanText(row.eligibility),
      amount: cleanText(row.amount),
      application_start: cleanDate(row.application_start),
      application_end: cleanDate(row.application_end),
      official_website: cleanText(row.official_website),
      description: cleanText(row.description),
      status: cleanStatus(row.status),
      ...getQualityFields(row),
    };
  };

  const getTableName = () =>
    importType === "jobs" ? "jobs_v2" : importType;

  const downloadFailedRows = () => {
    if (failedRows.length === 0) {
      return;
    }

    const exportRows = failedRows.map((item) => ({
      row_number: item.rowNumber,
      error: item.error,
      ...item.row,
    }));

    const csv = Papa.unparse(exportRows);
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `failed-${importType}-rows.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (rows.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }

    if (!validateRows()) {
      return;
    }

    setImporting(true);
    setProgress(0);
    setFailedRows([]);

    let historyId: number | null = null;
    let importedRows = 0;
    const importFailures: FailedRow[] = [];

    try {
      const { data: history, error: historyError } = await supabase
        .from("import_history")
        .insert({
          import_type: importType,
          file_name: selectedFileName || `${importType}.csv`,
          total_rows: rows.length,
          imported_rows: 0,
          failed_rows: 0,
          status: "processing",
        })
        .select("id")
        .single();

      if (historyError || !history) {
        console.error("Could not create import history:", historyError);
        alert(
          "Could not start import history. Confirm you are logged in as the admin."
        );
        return;
      }

      historyId = history.id;

      const tableName = getTableName();
      const totalBatches = Math.ceil(rows.length / BATCH_SIZE);

      for (let start = 0; start < rows.length; start += BATCH_SIZE) {
        const batchRows = rows.slice(start, start + BATCH_SIZE);
        const batchNumber = start / BATCH_SIZE + 1;
        const formattedBatch = batchRows.map(createRecord);

        const { error } = await supabase
          .from(tableName)
          .upsert(formattedBatch, {
            onConflict: "slug",
          });

        if (error) {
          console.error(`Batch ${batchNumber} import error:`, error);

          batchRows.forEach((row, rowIndex) => {
            importFailures.push({
              rowNumber: start + rowIndex + 2,
              error: error.message,
              row,
            });
          });
        } else {
          importedRows += batchRows.length;
        }

        setProgress(
          Math.round((batchNumber / totalBatches) * 100)
        );
      }

      setFailedRows(importFailures);

      const finalStatus =
        importFailures.length === 0
          ? "completed"
          : importedRows > 0
            ? "completed_with_errors"
            : "failed";

      const { error: updateHistoryError } = await supabase
        .from("import_history")
        .update({
          imported_rows: importedRows,
          failed_rows: importFailures.length,
          status: finalStatus,
          error_summary:
            importFailures.length > 0
              ? `${importFailures.length} row(s) failed during import.`
              : null,
          completed_at: new Date().toISOString(),
        })
        .eq("id", historyId);

      if (updateHistoryError) {
        console.error(
          "Could not complete import history:",
          updateHistoryError
        );
      }

      const { error: auditLogError } = await supabase
        .from("audit_logs")
        .insert({
          action: "csv_import_completed",
          entity_type: importType,
          entity_id: String(historyId),
          entity_name:
            selectedFileName || `${importType}.csv`,
          details: {
            total_rows: rows.length,
            imported_rows: importedRows,
            failed_rows: importFailures.length,
            import_status: finalStatus,
          },
        });

      if (auditLogError) {
        console.error("Could not create audit log:", auditLogError);
      }

      if (importFailures.length === 0) {
        alert(
          `${importType} import completed successfully. Imported ${importedRows} rows.`
        );
        setRows([]);
        setSelectedFileName("");
      } else {
        alert(
          `Import finished with errors. Imported ${importedRows} rows and failed ${importFailures.length} rows. Download the failed-row report below.`
        );
      }
    } catch (error) {
      console.error("Unexpected import error:", error);

      if (historyId) {
        await supabase
          .from("import_history")
          .update({
            status: "failed",
            error_summary: "Unexpected error during import.",
            completed_at: new Date().toISOString(),
          })
          .eq("id", historyId);
      }

      alert("Something went wrong during the import.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
     <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
  <div>
    <h1 className="text-3xl font-bold">Bulk Import</h1>

    <p className="mt-2 text-slate-600">
      Import up to {MAX_ROWS_PER_IMPORT} CSV rows at a time. Every
      import is recorded in import history.
    </p>
  </div>

  <Link
    href="/admin/import/large-colleges"
    className="inline-flex items-center justify-center rounded-lg border border-blue-700 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
  >
    Large College Import →
  </Link>
</div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">
          Select Import Type
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {importTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              disabled={importing}
              onClick={() => {
                setImportType(type.value);
                setRows([]);
                setSelectedFileName("");
                setFailedRows([]);
                setProgress(0);
              }}
              className={`rounded-lg border p-4 text-left font-semibold transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 ${
                importType === type.value
                  ? "border-blue-700 bg-blue-50 text-blue-700"
                  : "bg-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <p className="mb-3 font-semibold">
          Current Import Type:{" "}
          <span className="capitalize text-blue-700">
            {importType}
          </span>
        </p>

        <input
          key={`${importType}-${selectedFileName}`}
          type="file"
          accept=".csv,text/csv"
          disabled={importing}
          onChange={handleFileUpload}
          className="block w-full rounded-lg border p-3 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {selectedFileName && (
          <p className="mt-3 text-sm text-slate-600">
            Selected file:{" "}
            <span className="font-semibold">
              {selectedFileName}
            </span>
          </p>
        )}

        <p className="mt-4 text-sm text-slate-600">
          Rows detected: {rows.length} / {MAX_ROWS_PER_IMPORT}
        </p>

        {importing && (
          <div className="mt-5">
            <div className="flex justify-between text-sm font-semibold text-slate-700">
              <span>Importing in batches of {BATCH_SIZE}...</span>
              <span>{progress}%</span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-700 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={importing || rows.length === 0}
          className="mt-5 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {importing ? "Importing..." : "Import to Supabase"}
        </button>
      </div>

      {failedRows.length > 0 && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-700">
            Failed Rows: {failedRows.length}
          </h2>

          <p className="mt-2 text-sm text-red-700">
            Download the report, correct the CSV rows, then import only
            those corrected rows again.
          </p>

          <button
            type="button"
            onClick={downloadFailedRows}
            className="mt-4 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
          >
            Download Failed Rows CSV
          </button>
        </div>
      )}

      {rows.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                {Object.keys(rows[0]).map((key) => (
                  <th key={key} className="whitespace-nowrap p-3">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.slice(0, 10).map((row, index) => (
                <tr key={index} className="border-t">
                  {Object.keys(rows[0]).map((key) => (
                    <td
                      key={key}
                      className="max-w-xs whitespace-nowrap p-3"
                    >
                      {String(row[key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length > 10 && (
            <p className="border-t p-4 text-sm text-slate-600">
              Showing the first 10 of {rows.length} rows.
            </p>
          )}
        </div>
      )}
    </div>
  );
}