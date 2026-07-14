import { supabase } from "./supabase";

export async function getCollegesV2() {
  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .order("nirf_rank", { ascending: true, nullsFirst: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getCollegeV2(slug: string) {
  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return data;
}