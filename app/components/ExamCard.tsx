import Link from "next/link";
import SaveExamButton from "./SaveExamButton";

type ExamCardProps = {
  name: string;
  slug: string;
  conductingBody: string;
  applicationDeadline: string;
  examDate: string;
  level: string;
};

export default function ExamCard({
  name,
  slug,
  conductingBody,
  applicationDeadline,
  examDate,
  level,
}: ExamCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {name}
      </h3>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Conducted by: {conductingBody}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {level}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
        Application Deadline: {applicationDeadline}
      </p>

      <p className="text-sm text-slate-700 dark:text-slate-300">
        Exam Date: {examDate}
      </p>

      <Link
        href={`/exams/${slug}`}
        className="mt-5 inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        View Details
      </Link>
      <SaveExamButton
  examName={name}
  examSlug={slug}
/>
    </div>
  );
}