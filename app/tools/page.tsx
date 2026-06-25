import Link from "next/link";
import {
  Calculator,
  CalendarCheck,
  GraduationCap,
  Percent,
  ClipboardList,
  BarChart3,
} from "lucide-react";

const tools = [
  {
    title: "CGPA Calculator",
    description: "Calculate semester CGPA from credits and grade points.",
    href: "/tools/cgpa-calculator",
    icon: Calculator,
  },
  {
    title: "Attendance Calculator",
    description: "Check attendance percentage and how many classes you can miss.",
    href: "/tools/attendance-calculator",
    icon: CalendarCheck,
  },
  {
    title: "Percentage Calculator",
    description: "Convert marks into percentage quickly.",
    href: "/tools/percentage-calculator",
    icon: Percent,
  },
  {
    title: "GPA Calculator",
    description: "Calculate GPA for subject-wise grade points.",
    href: "/tools/gpa-calculator",
    icon: BarChart3,
  },
  {
    title: "EAMCET Rank Predictor",
    description: "Estimate your AP/TS EAMCET rank from marks.",
    href: "/tools/eamcet-rank-predictor",
    icon: GraduationCap,
  },
  {
    title: "Backlog Tracker",
    description: "Track cleared and pending backlogs semester-wise.",
    href: "/tools/backlog-tracker",
    icon: ClipboardList,
  },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Student Tools
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Free calculators and tools for Indian students.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <Icon className="h-9 w-9 text-blue-700" />

              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                {tool.title}
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {tool.description}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}