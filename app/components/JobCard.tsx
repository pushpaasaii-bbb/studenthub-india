import Link from "next/link";

type JobCardProps = {
  title: string;
  slug: string;
  organization: string;
  location: string;
  qualification: string;
  lastDate: string;
};

export default function JobCard({
  title,
  slug,
  organization,
  location,
  qualification,
  lastDate,
}: JobCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {organization}
      </p>

      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        📍 {location}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {qualification}
        </span>
      </div>

      <p className="mt-4 text-sm text-red-600 font-medium">
        Last Date: {lastDate}
      </p>

      <Link
        href={`/jobs/${slug}`}
        className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        View Details
      </Link>
    </div>
  );
}