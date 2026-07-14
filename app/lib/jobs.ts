import { supabase } from "./supabase";

export async function getJobs() {
  const { data, error } = await supabase
    .from("jobs_v2")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from("jobs_v2")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  return data;
}

export async function createJob(job: {
  title: string;
  slug: string;
  category: string;
  job_type: string;
  company: string;
  location: string;
  qualification: string;
  salary: string;
  experience: string;
  apply_link: string;
  description: string;
  skills: string[];
}) {
  const { error } = await supabase
    .from("jobs_v2")
    .insert(job);

  return !error;
}

export async function updateJob(
  id: string,
  job: {
    title: string;
    slug: string;
    category: string;
    job_type: string;
    company: string;
    location: string;
    qualification: string;
    salary: string;
    experience: string;
    apply_link: string;
    description: string;
    skills: string[];
  }
) {
  const { error } = await supabase
    .from("jobs_v2")
    .update(job)
    .eq("id", id);

  return !error;
}

export async function deleteJob(id: string) {
  const { error } = await supabase
    .from("jobs_v2")
    .delete()
    .eq("id", id);

  return !error;
}