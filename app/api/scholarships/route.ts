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
  const provider = getSafeText(searchParams.get("provider"));
  const category = getSafeText(searchParams.get("category"));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let query = supabase
    .from("scholarships")
    .select(
      "id, name, slug, provider, category, eligibility, amount, application_end, official_website",
      { count: "exact" }
    )
    .eq("status", "published")
    .order("application_end", {
      ascending: true,
      nullsFirst: false,
    })
    .range(from, to);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (provider) {
    query = query.ilike("provider", `%${provider}%`);
  }

  if (category) {
    query = query.ilike("category", `%${category}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Public scholarships API error:", error);

    return NextResponse.json(
      { error: "Could not load scholarships right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    scholarships: data || [],
    totalScholarships: count || 0,
    page,
    pageSize,
  });
}