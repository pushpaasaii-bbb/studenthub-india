import { supabase } from "./supabase";

/*
  Public careers list:
  only Published careers can appear on the student-facing website.
*/
export async function getCareers() {
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("status", "published")
    .order("title");

  if (error) {
    console.error("Could not load public careers:", error);
    return [];
  }

  return data;
}

/*
  Public career details:
  even if someone knows a slug, Draft/Review/Archived careers stay hidden.
*/
export async function getCareer(slug: string) {
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    return null;
  }

  return data;
}

/*
  Admin-only helper:
  it intentionally loads any career status for editing.
*/
export async function getCareerById(id: string) {
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/*
  Admin-only helper:
  it intentionally allows updating any career status.
*/
export async function updateCareer(
  id: string,
  career: {
    title: string;
    slug: string;
    category: string;
    qualification: string;
    average_salary: string;
    description: string;
  }
) {
  const { error } = await supabase
    .from("careers")
    .update(career)
    .eq("id", id);

  return !error;
}