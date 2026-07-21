export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-16">
      <div
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        role="status"
        aria-live="polite"
      >
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
        <span className="font-medium">Loading StudentHub India...</span>
      </div>
    </main>
  );
}