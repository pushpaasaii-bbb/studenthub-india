import Link from "next/link";

export const metadata = {
  title: "Editorial & Methodology Policy",
  description:
    "Learn how StudentHub India reviews, structures, and maintains student information.",
};

export default function EditorialPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
          Trust & Transparency
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          Editorial & Methodology Policy
        </h1>

        <p className="mt-5 leading-8 text-slate-700 dark:text-slate-300">
          StudentHub India is designed to make student information easier to
          discover and understand. Our editorial process focuses on clarity,
          traceability, and responsible publishing.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            How we prepare content
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            We organise information from primary and official sources into
            student-friendly pages. We aim to present important details such as
            eligibility, dates, course or career information, application
            pathways, and official links clearly where they are available.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Review before publishing
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Public content should be reviewed before publication. Records that
            are incomplete, unsupported, outdated, or awaiting verification may
            be kept as draft or review content instead of being shown to public
            users.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Updates and changes
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            Official information may change without notice. We update records
            when reliable new information is available, but students should
            always verify final decisions, deadlines, fees, and eligibility on
            the official website.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Editorial independence
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            StudentHub India does not guarantee admission, selection,
            employment, scholarship approval, or any outcome. Educational
            choices should be made using official information and personal
            judgement.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Help us improve
          </h2>

          <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
            If you notice an issue with information on StudentHub India, please
            report it. Your feedback helps us review and improve the platform.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Contact StudentHub India
          </Link>
        </section>
      </div>
    </main>
  );
}