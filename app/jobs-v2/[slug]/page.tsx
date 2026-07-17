import Link from "next/link";
import { notFound } from "next/navigation";
import ViewHistoryTracker from "../../components/ViewHistoryTracker";
import { supabase } from "../../lib/supabase";

type Props = {
  params: {
    slug: string;
  };
};

export default async function JobDetailsPage({ params }: Props) {
  const { data: job, error } = await supabase
    .from("jobs_v2")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ViewHistoryTracker
        contentType="job"
        contentId={job.id}
        contentSlug={job.slug}
        contentTitle={job.title}
      />

      <Link href="/jobs-v2" className="font-semibold text-blue-700">
        ← Back to Jobs
      </Link>

      <section className="mt-8 rounded-2xl border bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {job.category && (
          <p className="text-sm font-semibold text-blue-700">
            {job.category}
          </p>
        )}

        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
          {job.title}
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {[job.company, job.location].filter(Boolean).join(" • ")}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Job Type</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {job.job_type || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Salary</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {job.salary || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl bg-orange-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Qualification</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {job.qualification || "Not listed"}
            </p>
          </div>

          <div className="rounded-xl bg-purple-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Experience</p>
            <p className="font-semibold text-slate-900 dark:text-white">
              {job.experience || "Not listed"}
            </p>
          </div>
        </div>

        {job.description && (
          <>
            <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
              Job Description
            </h2>

            <p className="mt-3 whitespace-pre-line leading-8 text-slate-700 dark:text-slate-300">
              {job.description}
            </p>
          </>
        )}

        {job.apply_link && (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Apply Now
          </a>
        )}
      </section>
    </main>
  );
}