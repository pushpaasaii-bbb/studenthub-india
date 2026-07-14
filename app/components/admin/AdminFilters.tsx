"use client";

type FilterOption = {
  label: string;
  value: string;
};

type AdminFiltersProps = {
  categoryValue?: string;
  stateValue?: string;
  sortValue?: string;

  categoryOptions?: FilterOption[];
  stateOptions?: FilterOption[];

  categoryLabel?: string;
  categoryAllLabel?: string;
  stateLabel?: string;
  stateAllLabel?: string;

  onCategoryChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onReset?: () => void;

  showCategory?: boolean;
  showState?: boolean;
  showSort?: boolean;
};

const defaultSortOptions: FilterOption[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name A–Z", value: "name-asc" },
  { label: "Name Z–A", value: "name-desc" },
];

export default function AdminFilters({
  categoryValue = "",
  stateValue = "",
  sortValue = "newest",

  categoryOptions = [],
  stateOptions = [],

  categoryLabel = "Category",
  categoryAllLabel = "All Categories",
  stateLabel = "State",
  stateAllLabel = "All States",

  onCategoryChange,
  onStateChange,
  onSortChange,
  onReset,

  showCategory = true,
  showState = true,
  showSort = true,
}: AdminFiltersProps) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {showCategory && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {categoryLabel}
            </label>

            <select
              value={categoryValue}
              onChange={(event) =>
                onCategoryChange?.(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="">{categoryAllLabel}</option>

              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showState && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {stateLabel}
            </label>

            <select
              value={stateValue}
              onChange={(event) =>
                onStateChange?.(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              <option value="">{stateAllLabel}</option>

              {stateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showSort && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Sort By
            </label>

            <select
              value={sortValue}
              onChange={(event) => onSortChange?.(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {defaultSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}