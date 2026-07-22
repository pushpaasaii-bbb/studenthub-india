import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 24;
const MAX_FILTER_LENGTH = 100;

function getSafeText(value: string | null) {
  return (value || "").trim().slice(0, MAX_FILTER_LENGTH);
}

function getSafePage(value: string | null) {
  const page = Number.parseInt(value || "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

function getSafePageSize(value: string | null) {
  const pageSize = Number.parseInt(value || String(PAGE_SIZE), 10);

  if (!Number.isFinite(pageSize) || pageSize < 1) {
    return PAGE_SIZE;
  }

  return Math.min(pageSize, MAX_PAGE_SIZE);
}

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Server configuration is incomplete." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);

  const page = getSafePage(searchParams.get("page"));
  const pageSize = getSafePageSize(searchParams.get("pageSize"));
  const search = getSafeText(searchParams.get("search"));
  const collegeType = getSafeText(searchParams.get("collegeType"));
  const state = getSafeText(searchParams.get("state"));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let query = supabase
    .from("colleges")
    .select(
      "id, name, slug, city, state, college_type, average_fees",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("nirf_rank", {
      ascending: true,
      nullsFirst: false,
    })
    .range(from, to);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (collegeType) {
    query = query.ilike("college_type", `%${collegeType}%`);
  }

  if (state) {
    query = query.ilike("state", `%${state}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Public colleges API error:", error);

    return NextResponse.json(
      { error: "Could not load colleges right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    colleges: data || [],
    totalColleges: count || 0,
    page,
    pageSize,
  });
}