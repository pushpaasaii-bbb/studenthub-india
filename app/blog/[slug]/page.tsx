import Link from "next/link";
import { notFound } from "next/navigation";
import blogs from "../../data/blogs.json";

type Props = {
  params: {
    slug: string;
  };
};

export default function BlogArticlePage({ params }: Props) {
  const article = blogs.find(
    (item) => item.slug === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/blog"
        className="font-semibold text-blue-700"
      >
        ← Back to Blog
      </Link>

      <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-700">
          {article.category}
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
          {article.title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
          {article.content}
        </p>

        <h2 className="mt-10 text-2xl font-bold text-slate-900 dark:text-white">
          Why this matters for students
        </h2>

        <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
          StudentHub India helps students make better decisions regarding
          colleges, exams, scholarships and careers through reliable information.
        </p>
      </article>
    </main>
  );
}