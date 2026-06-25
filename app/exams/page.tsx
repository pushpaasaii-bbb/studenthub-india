import ExamCard from "../components/ExamCard";
import exams from "../data/exams.json";

export default function ExamsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Entrance Exams
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Explore national and state-level entrance exams including JEE Main,
          JEE Advanced, NEET, AP EAMCET, TS EAMCET and CUET.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam: (typeof exams)[number]) => (
          <ExamCard
            key={exam.id}
            name={exam.name}
            slug={exam.slug}
            conductingBody={exam.conductingBody}
            applicationDeadline={exam.applicationDeadline}
            examDate={exam.examDate}
            level={exam.level}
          />
        ))}
      </div>
    </main>
  );
}