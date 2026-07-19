import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verification Policy | StudentHub India",
  description:
    "Learn how StudentHub India verifies colleges, schools, exams, jobs, scholarships, and careers before publishing them.",
};

export default function VerificationPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold text-blue-700">
          StudentHub India Trust Centre
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
          Verification Policy
        </h1>

        <p className="mt-5 leading-8 text-slate-700 dark:text-slate-300">
          StudentHub India aims to help students make informed decisions. We
          publish content only when it has a clear source and an appropriate
          verification status.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Our publishing standard
          </h2>

          <p className="mt-3 leading-8 text-slate-700 dark:text-slate-300">
            Public college, school, exam, job, scholarship, and career records
            must include a source name and source link. Records without
            sufficient source information are kept as drafts and are not shown
            to public users.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sources we prefer
          </h2>

          <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-700 dark:text-slate-300">
            <li>Official college, school, university, or institution websites.</li>
            <li>Government departments and recognised education portals.</li>
            <li>Official exam conducting bodies and notification portals.</li>
            <li>Official employer recruitment pages for jobs.</li>
            <li>Official scholarship provider or government scholarship portals.</li>
            <li>Official datasets, including recognised education datasets.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Verification labels
          </h2>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-green-50 p-4 dark:bg-slate-800">
              <h3 className="font-bold text-green-700">Verified</h3>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                The record has been checked against an appropriate source.
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4 dark:bg-slate-800">
              <h3 className="font-bold text-yellow-700">Needs review</h3>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                The record needs a further review before it can be relied on.
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4 dark:bg-slate-800">
              <h3 className="font-bold text-red-700">May be outdated</h3>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                The information may have changed and should be checked again
                with the official source.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Important notice
          </h2>

          <p className="mt-3 leading-8 text-slate-700 dark:text-slate-300">
            Dates, eligibility rules, fees, vacancies, rankings, and admission
            processes can change. Always confirm important details directly on
            the linked official website before applying or making a decision.
          </p>
        </section>

        <section className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Found an issue?
          </h2>

          <p className="mt-2 text-slate-700 dark:text-slate-300">
            If you find incorrect or outdated information, please tell us so we
            can review it.
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Report an Issue
          </Link>
        </section>
      </div>
    </main>
  );
}