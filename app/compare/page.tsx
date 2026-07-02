"use client";

import { useState } from "react";
import colleges from "../data/colleges.json";

export default function ComparePage() {
  const [firstSlug, setFirstSlug] = useState("");
  const [secondSlug, setSecondSlug] = useState("");

  const firstCollege = colleges.find((college) => college.slug === firstSlug);
  const secondCollege = colleges.find((college) => college.slug === secondSlug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Compare Colleges
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Compare colleges by rank, fees, type and location.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <select
          value={firstSlug}
          onChange={(e) => setFirstSlug(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">Select first college</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.slug}>
              {college.name}
            </option>
          ))}
        </select>

        <select
          value={secondSlug}
          onChange={(e) => setSecondSlug(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">Select second college</option>
          {colleges.map((college) => (
            <option key={college.id} value={college.slug}>
              {college.name}
            </option>
          ))}
        </select>
      </div>

      {firstCollege && secondCollege && (
        <div className="mt-10 overflow-x-auto rounded-xl border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-slate-700">
                <th className="p-4">Feature</th>
                <th className="p-4">{firstCollege.shortName}</th>
                <th className="p-4">{secondCollege.shortName}</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b dark:border-slate-700">
                <td className="p-4 font-semibold">Full Name</td>
                <td className="p-4">{firstCollege.name}</td>
                <td className="p-4">{secondCollege.name}</td>
              </tr>

              <tr className="border-b dark:border-slate-700">
                <td className="p-4 font-semibold">Type</td>
                <td className="p-4">{firstCollege.type}</td>
                <td className="p-4">{secondCollege.type}</td>
              </tr>

              <tr className="border-b dark:border-slate-700">
                <td className="p-4 font-semibold">Location</td>
                <td className="p-4">
                  {firstCollege.city}, {firstCollege.state}
                </td>
                <td className="p-4">
                  {secondCollege.city}, {secondCollege.state}
                </td>
              </tr>

              <tr className="border-b dark:border-slate-700">
                <td className="p-4 font-semibold">NIRF Rank</td>
                <td className="p-4">#{firstCollege.nirfRank}</td>
                <td className="p-4">#{secondCollege.nirfRank}</td>
              </tr>

              <tr>
                <td className="p-4 font-semibold">Fees</td>
                <td className="p-4">₹{firstCollege.fees.toLocaleString()}</td>
                <td className="p-4">₹{secondCollege.fees.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}