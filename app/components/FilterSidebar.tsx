"use client";

type FilterSidebarProps = {
  title?: string;
};

export default function FilterSidebar({
  title = "Filters",
}: FilterSidebarProps) {
  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:w-72">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            State
          </label>
          <select className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <option>All India</option>
            <option>Andhra Pradesh</option>
            <option>Telangana</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <option>All Categories</option>
            <option>Engineering</option>
            <option>Medical</option>
            <option>Degree</option>
            <option>Government Jobs</option>
            <option>Scholarships</option>
          </select>
        </div>

        <button className="w-full rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">
          Apply Filters
        </button>
      </div>
    </aside>
  );
}