type ChartItem = {
  label: string;
  value: number;
};

type AdminBarChartProps = {
  title: string;
  description?: string;
  data: ChartItem[];
};

export default function AdminBarChart({
  title,
  description,
  data,
}: AdminBarChartProps) {
  const maximumValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}

      <div className="mt-6 space-y-5">
        {data.map((item) => {
          const width =
            item.value === 0
              ? 0
              : Math.max((item.value / maximumValue) * 100, 4);

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="font-medium text-slate-700">{item.label}</p>

                <p className="font-bold text-slate-900">
                  {item.value.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-700 transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}