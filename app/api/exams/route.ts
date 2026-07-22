import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const MAX_PAGE_SIZE = 24;
const DEFAULT_PAGE_SIZE = 12;
const MAX_FILTER_LENGTH = 100;

function getSafeText(value: string | null) {
  return (value || "").trim().slice(0, MAX_FILTER_LENGTH);
}

function getPositiveNumber(value: string | null, fallback: number) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : fallback;
}

export async function GET(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Server configuration is missing." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);

  const page = getPositiveNumber(searchParams.get("page"), 1);
  const pageSize = Math.min(
    getPositiveNumber(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE
  );

  const search = getSafeText(searchParams.get("search"));
  const category = getSafeText(searchParams.get("category"));
  const level = getSafeText(searchParams.get("level"));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let query = supabase
    .from("exams")
    .select(
      "id, exam_name, slug, category, conducting_body, level, application_end, exam_date, official_website",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("exam_date", {
      ascending: true,
      nullsFirst: false,
    })
    .range(from, to);

  if (search) {
    query = query.ilike("exam_name", `%${search}%`);
  }

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  if (level) {
    query = query.ilike("level", `%${level}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Public exams API error:", error);

    return NextResponse.json(
      { error: "Could not load exams right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    exams: data || [],
    totalExams: count || 0,
    page,
    pageSize,
  });
}