import Link from "next/link";

const materials = [
  {
    id: 1,
    title: "Engineering Mathematics Notes",
    slug: "engineering-mathematics-notes",
    category: "Engineering",
    type: "PDF Notes",
  },
  {
    id: 2,
    title: "Physics Important Formulas",
    slug: "physics-important-formulas",
    category: "Intermediate",
    type: "Formula Sheet",
  },
  {
    id: 3,
    title: "AP EAMCET Preparation Guide",
    slug: "ap-eamcet-preparation-guide",
    category: "Entrance Exams",
    type: "Guide",
  },
];

export default function StudyMaterialsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Study Materials
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Notes, formulas and preparation guides for students.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((item) => (
          <Link
            key={item.id}
            href={`/study-materials/${item.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              {item.category}
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              {item.title}
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {item.type}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}