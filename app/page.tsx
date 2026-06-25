import Link from "next/link";
import { BookOpen, Briefcase, Calculator, GraduationCap } from "lucide-react";
import AdSlot from "./components/AdSlot";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold">
              All India Student Platform
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Your Complete Student Guide — Colleges, Exams, Jobs & Tools
            </h1>

            <p className="mt-5 text-lg text-blue-100">
              Explore colleges, AP EAMCET, TS EAMCET, national exams,
              government jobs, scholarships and useful calculators in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/colleges" className="rounded-lg bg-orange-500 px-6 py-3 text-center font-semibold text-white hover:bg-orange-600">
                Explore Colleges
              </Link>

              <Link href="/tools" className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-blue-800 hover:bg-blue-50">
                Student Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <AdSlot type="leaderboard" className="mb-10" />

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Colleges",
              desc: "Find IITs, NITs, state and private colleges.",
              href: "/colleges",
              icon: GraduationCap,
            },
            {
              title: "Exams",
              desc: "Track AP EAMCET, TS EAMCET, JEE, NEET and more.",
              href: "/exams",
              icon: BookOpen,
            },
            {
              title: "Jobs",
              desc: "Latest government jobs and student opportunities.",
              href: "/jobs",
              icon: Briefcase,
            },
            {
              title: "Tools",
              desc: "CGPA, attendance, percentage and rank calculators.",
              href: "/tools",
              icon: Calculator,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <Icon className="h-9 w-9 text-blue-700" />
                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}