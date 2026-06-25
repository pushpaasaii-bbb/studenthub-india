type Cutoff = {
  year: number;
  category: string;
  openingRank: number;
  closingRank: number;
};

type CutoffTableProps = {
  data: Cutoff[];
};

export default function CutoffTable({ data }: CutoffTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Year</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Opening Rank</th>
            <th className="px-4 py-3 text-left">Closing Rank</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800">
              <td className="px-4 py-3">{item.year}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">{item.openingRank.toLocaleString()}</td>
              <td className="px-4 py-3">{item.closingRank.toLocaleString()}</td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-slate-500"
              >
                No cutoff data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}