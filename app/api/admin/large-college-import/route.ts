import { NextResponse } from "next/server";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const runtime = "nodejs";

const BATCH_SIZE = 500;
const MAX_ROWS = 50000;
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

type CsvRow = Record<string, string>;

const cleanText = (value?: string) => {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
};

const cleanSlug = (value?: string) =>
  value?.trim().toLowerCase() || "";

const cleanNumber = (value?: string) => {
  const cleaned = value?.trim();

  if (!cleaned) {
    return null;
  }

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
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

const cleanStatus = (value?: string) => {
  const status = value?.trim().toLowerCase();

  return ["published", "draft", "review", "archived"].includes(
    status || ""
  )
    ? status
    : "draft";
};

const cleanVerificationStatus = (value?: string) => {
  const status = value?.trim().toLowerCase();

  return [
    "unverified",
    "verified",
    "needs_review",
    "outdated",
  ].includes(status || "")
    ? status
    : "unverified";
};

const splitPipeValues = (value?: string) =>
  value
    ? value
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export async function POST(request: Request) {
  let historyId: number | null = null;

  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Your login session is invalid." },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a CSV file." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "CSV file is too large. Maximum size is 25 MB." },
        { status: 400 }
      );
    }

    const csvText = await file.text();

    const parsed = Papa.parse<CsvRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    const rows = parsed.data.filter((row) =>
      Object.values(row).some((value) => value?.trim())
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "The CSV file has no data rows." },
        { status: 400 }
      );
    }

    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        {
          error: `Maximum ${MAX_ROWS.toLocaleString()} rows are allowed per large import.`,
        },
        { status: 400 }
      );
    }

    const invalidRowIndex = rows.findIndex(
      (row) => !row.name?.trim() || !row.slug?.trim()
    );

    if (invalidRowIndex !== -1) {
      return NextResponse.json(
        {
          error: `Row ${
            invalidRowIndex + 2
          } is missing name or slug.`,
        },
        { status: 400 }
      );
    }

    const slugs = rows.map((row) => cleanSlug(row.slug));
    const duplicateSlug = slugs.find(
      (slug, index) => slugs.indexOf(slug) !== index
    );

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error: `Duplicate slug found in CSV: ${duplicateSlug}`,
        },
        { status: 400 }
      );
    }

    const formattedColleges = rows.map((row) => ({
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
      source_name: cleanText(row.source_name),
      source_url: cleanText(row.source_url),
      last_verified_at: cleanDate(row.last_verified_at),
      verification_status: cleanVerificationStatus(
        row.verification_status
      ),
      created_by: user.id,
      updated_by: user.id,
    }));

    const { data: history, error: historyError } =
      await supabaseAdmin
        .from("import_history")
        .insert({
          import_type: "colleges",
          file_name: file.name,
          total_rows: rows.length,
          imported_rows: 0,
          failed_rows: 0,
          status: "processing",
          created_by: user.id,
        })
        .select("id")
        .single();

    if (historyError || !history) {
      throw new Error(
        historyError?.message || "Could not create import history."
      );
    }

    historyId = history.id;
    let importedRows = 0;
    const failedBatches: string[] = [];

    for (
      let start = 0;
      start < formattedColleges.length;
      start += BATCH_SIZE
    ) {
      const batch = formattedColleges.slice(
        start,
        start + BATCH_SIZE
      );

      const { error } = await supabaseAdmin
        .from("colleges")
        .upsert(batch, { onConflict: "slug" });

      if (error) {
        failedBatches.push(
          `Rows ${start + 2}-${start + batch.length + 1}: ${
            error.message
          }`
        );
      } else {
        importedRows += batch.length;
      }
    }

    const failedRows = rows.length - importedRows;
    const finalStatus =
      failedRows === 0
        ? "completed"
        : importedRows > 0
          ? "completed_with_errors"
          : "failed";

    await supabaseAdmin
      .from("import_history")
      .update({
        imported_rows: importedRows,
        failed_rows: failedRows,
        status: finalStatus,
        error_summary:
          failedBatches.length > 0
            ? failedBatches.join(" | ")
            : null,
        completed_at: new Date().toISOString(),
      })
      .eq("id", historyId);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: user.id,
      action: "large_college_import_completed",
      entity_type: "colleges",
      entity_id: String(historyId),
      entity_name: file.name,
      details: {
        total_rows: rows.length,
        imported_rows: importedRows,
        failed_rows: failedRows,
        import_status: finalStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Large college import finished.",
      totalRows: rows.length,
      importedRows,
      failedRows,
      status: finalStatus,
    });
  } catch (error) {
    console.error("Large college import error:", error);

    if (historyId) {
      await supabaseAdmin
        .from("import_history")
        .update({
          status: "failed",
          error_summary:
            error instanceof Error
              ? error.message
              : "Unexpected server import error.",
          completed_at: new Date().toISOString(),
        })
        .eq("id", historyId);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server import error.",
      },
      { status: 500 }
    );
  }
}