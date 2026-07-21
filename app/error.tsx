"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("StudentHub page error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-16">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          We could not load this page
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
          Please try again. If the problem continues, return to the home page
          and report the issue with the page link.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Go to Home
          </Link>
        </div>
      </section>
    </main>
  );
}