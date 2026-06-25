import Link from "next/link";
import jobs from "../../data/jobs.json";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function JobDetailsPage({ params }: PageProps) {
  const job = jobs.find((item) => item.slug === params.slug);

  if (!job) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Job not found</h1>

        <Link
          href="/jobs"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Back to Jobs
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/jobs" className="text-sm font-semibold text-blue-700">
        ← Back to Jobs
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          {job.title}
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {job.organization}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-slate-500">Location</p>
            <p className="text-xl font-bold">{job.location}</p>
          </div>

          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm text-slate-500">Qualification</p>
            <p className="text-xl font-bold">{job.qualification}</p>
          </div>

          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm text-slate-500">Last Date</p>
            <p className="text-xl font-bold">{job.lastDate}</p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-slate-500">Vacancies</p>
            <p className="text-xl font-bold">{job.vacancies}</p>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm text-slate-500">Salary</p>
            <p className="text-xl font-bold">{job.salary}</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">Job Type</p>
            <p className="text-xl font-bold">{job.jobType}</p>
          </div>
        </div>

        <a
          href={job.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Visit Official Website
        </a>
      </section>
    </main>
  );
}