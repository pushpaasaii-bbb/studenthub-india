import Link from "next/link";
import blogs from "../data/blogs.json";

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        StudentHub India Blog
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Guides on colleges, exams, scholarships, careers and student life.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-blue-700">
              {article.category}
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {article.title}
            </h2>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              {article.description}
            </p>

            <p className="mt-4 font-semibold text-blue-700">Read Article →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}