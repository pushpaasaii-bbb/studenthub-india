"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export default function SearchBar({
  placeholder = "Search colleges, exams, jobs...",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <button
        onClick={handleSearch}
        className="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
      >
        Search
      </button>
    </div>
  );
}