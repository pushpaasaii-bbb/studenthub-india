"use client";

import { useState } from "react";

export default function EamcetRankPredictorPage() {
  const [marks, setMarks] = useState("");
  const [rank, setRank] = useState<number | null>(null);

  const predictRank = () => {
    const score = Number(marks);

    if (score < 0 || score > 160 || Number.isNaN(score)) {
      alert("Please enter valid EAMCET marks between 0 and 160.");
      return;
    }

    let predictedRank = 0;

    if (score >= 140) predictedRank = 500;
    else if (score >= 130) predictedRank = 1500;
    else if (score >= 120) predictedRank = 4000;
    else if (score >= 110) predictedRank = 8000;
    else if (score >= 100) predictedRank = 15000;
    else if (score >= 90) predictedRank = 25000;
    else if (score >= 80) predictedRank = 40000;
    else if (score >= 70) predictedRank = 60000;
    else if (score >= 60) predictedRank = 85000;
    else predictedRank = 120000;

    setRank(predictedRank);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        EAMCET Rank Predictor
      </h1>

      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Estimate your AP/TS EAMCET rank based on your marks out of 160.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div>
          <label className="block text-sm font-medium">EAMCET Marks</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Example: 105"
          />
        </div>

        <button
          onClick={predictRank}
          className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
        >
          Predict Rank
        </button>

        {rank !== null && (
          <div className="rounded-lg bg-green-100 p-4 text-center">
            <h2 className="text-xl font-bold">
              Estimated Rank: {rank.toLocaleString()}
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              This is only an approximate prediction. Actual rank depends on exam
              difficulty, normalization and total candidates.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}