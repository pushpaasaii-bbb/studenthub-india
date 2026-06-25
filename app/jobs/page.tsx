import JobCard from "../components/JobCard";
import jobs from "../data/jobs.json";

export default function JobsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Government Jobs
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Latest central and state government job updates for students,
          graduates and job seekers across India.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job: (typeof jobs)[number]) => (
          <JobCard
            key={job.id}
            title={job.title}
            slug={job.slug}
            organization={job.organization}
            location={job.location}
            qualification={job.qualification}
            lastDate={job.lastDate}
          />
        ))}
      </div>
    </main>
  );
}