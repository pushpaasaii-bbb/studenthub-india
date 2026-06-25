import Link from "next/link";
import exams from "../../data/exams.json";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function ExamDetailsPage({ params }: PageProps) {
  const exam = exams.find((item) => item.slug === params.slug);

  if (!exam) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Exam not found</h1>

        <Link
          href="/exams"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Back to Exams
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/exams"
        className="text-sm font-semibold text-blue-700"
      >
        ← Back to Exams
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-4xl font-bold">{exam.name}</h1>

        <p className="mt-3 text-slate-600">
          Conducted by: {exam.conductingBody}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-slate-500">Level</p>
            <p className="text-xl font-bold">{exam.level}</p>
          </div>

          <div className="rounded-xl bg-orange-50 p-4">
            <p className="text-sm text-slate-500">Category</p>
            <p className="text-xl font-bold">{exam.category}</p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-slate-500">Application Deadline</p>
            <p className="text-lg font-bold">
              {exam.applicationDeadline}
            </p>
          </div>

          <div className="rounded-xl bg-purple-50 p-4">
            <p className="text-sm text-slate-500">Exam Date</p>
            <p className="text-lg font-bold">
              {exam.examDate}
            </p>
          </div>
        </div>

        <a
          href={exam.officialWebsite}
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