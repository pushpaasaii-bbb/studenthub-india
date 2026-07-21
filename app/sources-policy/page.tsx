import Link from "next/link";

export const metadata = {
  title: "Sources Policy",
  description:
    "Learn how StudentHub India selects, verifies, displays, and updates information sources.",
};

export default function SourcesPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
          Trust & Transparency
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Sources Policy
        </h1>

        <p className="mt-5 leading-8 text-slate-700 dark:text-slate-300">
          StudentHub India aims to help students make informed decisions using
          reliable, traceable information. We prefer official and primary
          sources wherever they are available.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Our source priority
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-slate-700 dark:text-slate-300">
            <li>Official government portals and government notifications</li>
            <li>Official institution, university, school, or employer websites</li>
            <li>Official examination, scholarship, or recruitment authorities</li>
            <li>
              Recognised public datasets and documents published by authorised
              bodies
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            How information is published
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Content is reviewed before it is published. Where source details
            are available, StudentHub India displays the official website or
            source information with the record. Content that cannot be
            appropriately verified may remain unpublished, be moved to review,
            or be removed from public access.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Important student notice
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Dates, eligibility rules, fees, vacancies, admission processes, and
            application requirements can change. Always confirm the latest
            information directly on the relevant official website before taking
            action or submitting an application.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Report a source issue
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            If you find an outdated, incorrect, missing, or broken source, let
            us know so we can review it.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Report an issue
          </Link>
        </section>
      </div>
    </main>
  );
}