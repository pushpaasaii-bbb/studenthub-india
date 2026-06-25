import Link from "next/link";

const materials = [
  {
    slug: "engineering-mathematics-notes",
    title: "Engineering Mathematics Notes",
    category: "Engineering",
    type: "PDF Notes",
    description:
      "Comprehensive engineering mathematics notes covering algebra, calculus, differential equations, matrices and probability.",
  },
  {
    slug: "physics-important-formulas",
    title: "Physics Important Formulas",
    category: "Intermediate",
    type: "Formula Sheet",
    description:
      "Quick revision sheet containing important formulas from mechanics, electricity, magnetism, optics and modern physics.",
  },
  {
    slug: "ap-eamcet-preparation-guide",
    title: "AP EAMCET Preparation Guide",
    category: "Entrance Exams",
    type: "Guide",
    description:
      "Preparation strategy, syllabus overview, previous year trends and important tips for AP EAMCET aspirants.",
  },
];

type PageProps = {
  params: {
    slug: string;
  };
};

export default function StudyMaterialDetailsPage({ params }: PageProps) {
  const material = materials.find((item) => item.slug === params.slug);

  if (!material) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold">Study Material Not Found</h1>

        <Link
          href="/study-materials"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          Back to Study Materials
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/study-materials"
        className="text-sm font-semibold text-blue-700"
      >
        ← Back to Study Materials
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {material.category}
        </span>

        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
          {material.title}
        </h1>

        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {material.description}
        </p>

        <div className="mt-8 rounded-xl bg-slate-100 p-5 dark:bg-slate-800">
          <h2 className="text-xl font-bold">Material Type</h2>
          <p className="mt-2">{material.type}</p>
        </div>

        <button
          className="mt-8 rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Download Material
        </button>
      </section>
    </main>
  );
}