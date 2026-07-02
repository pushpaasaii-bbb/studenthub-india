import SaveCollegeButton from "./SaveCollegeButton";
import Link from "next/link";

type CollegeCardProps = {
  name: string;
  slug: string;
  location: string;
  type: string;
  nirfRank?: number;
  fees: string;
};

export default function CollegeCard({
  name,
  slug,
  location,
  type,
  nirfRank,
  fees,
}: CollegeCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {name}
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        📍 {location}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {type}
        </span>

        {nirfRank && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            NIRF #{nirfRank}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
        Fees: {fees}
      </p>

      <Link
        href={`/colleges/${slug}`}
        className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        View Details
      </Link>
      <SaveCollegeButton collegeName={name} collegeSlug={slug} />
    </div>
  );
}