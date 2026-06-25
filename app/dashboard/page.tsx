export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Student Dashboard
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Welcome back! This dashboard will help you track your study progress.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Saved Colleges</h2>
          <p className="mt-4 text-4xl font-bold text-blue-700">0</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Saved Exams</h2>
          <p className="mt-4 text-4xl font-bold text-green-700">0</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Saved Jobs</h2>
          <p className="mt-4 text-4xl font-bold text-orange-600">0</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold">Study Tools Used</h2>
          <p className="mt-4 text-4xl font-bold text-purple-700">0</p>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-bold">
          Recent Activity
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Your recent searches, saved colleges, favorite exams, scholarship
          applications, and tool history will appear here after Supabase
          authentication is connected.
        </p>
      </section>
    </main>
  );
}