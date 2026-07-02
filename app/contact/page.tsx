export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Contact Us
      </h1>

      <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-700 dark:text-slate-300">
          Have questions, suggestions, or feedback? We'd love to hear from you.
        </p>

        <div>
          <h2 className="text-xl font-bold">Email</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            support@studenthubindia.in
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Website</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            StudentHub India
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Purpose</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Helping students across India with colleges, exams, scholarships,
            jobs, and educational resources.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold">Response Time</h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            We typically respond within 24–48 hours.
          </p>
        </div>
      </div>
    </main>
  );
}