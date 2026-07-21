import Link from "next/link";

export const metadata = {
  title: "Correction Policy",
  description:
    "Learn how StudentHub India receives, reviews, and corrects reported information issues.",
};

export default function CorrectionPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
          Trust & Transparency
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Correction Policy
        </h1>

        <p className="mt-5 leading-8 text-slate-700 dark:text-slate-300">
          StudentHub India values accurate and reliable student information. If
          you find an error, outdated detail, broken official link, or missing
          source, you can report it for review.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            What you can report
          </h2>

          <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-700 dark:text-slate-300">
            <li>Incorrect or outdated dates, eligibility, fees, or details</li>
            <li>Broken, missing, or incorrect official website links</li>
            <li>Incorrect college, school, exam, job, scholarship, or career information</li>
            <li>Content that needs a clearer official source</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            How corrections are handled
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Reported issues are reviewed against reliable sources. If a
            correction is confirmed, the relevant content may be updated,
            temporarily removed from public access, or moved for further
            verification.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Before you report an issue
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Please include the page link, the information you believe is
            incorrect, and an official source link where possible. This helps
            us review the report faster and more accurately.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Report a correction
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Use our contact page to submit correction requests or source
            concerns.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Report a correction
          </Link>
        </section>
      </div>
    </main>
  );
}