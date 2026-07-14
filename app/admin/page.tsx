"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Compass,
  GraduationCap,
  Plus,
  RefreshCw,
  School,
  Upload,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import AdminBarChart from "../components/admin/AdminBarChart";

type DashboardStats = {
  colleges: number;
  jobs: number;
  careers: number;
  schools: number;
  exams: number;
  scholarships: number;
};

type ActivityItem = {
  id: string;
  type: "college" | "job" | "career" | "school";
  title: string;
  createdAt: string;
  href: string;
};

type ImportHistoryItem = {
  id: number;
  import_type: string;
  file_name: string;
  total_rows: number;
  imported_rows: number;
  failed_rows: number;
  status: string;
  created_at: string;
};

const initialStats: DashboardStats = {
  colleges: 0,
  jobs: 0,
  careers: 0,
  schools: 0,
  exams: 0,
  scholarships: 0,
};

const importStatusStyles: Record<string, string> = {
  processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  completed_with_errors: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [recentImports, setRecentImports] = useState<
    ImportHistoryItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCount = async (table: string) => {
    const { count, error } = await supabase
      .from(table)
      .select("*", {
        count: "exact",
        head: true,
      });

    return {
      count: count ?? 0,
      error,
    };
  };

  const loadRecentActivity = async () => {
    const [collegesResult, jobsResult, careersResult, schoolsResult] =
      await Promise.all([
        supabase
          .from("colleges")
          .select("id, name, created_at")
          .order("created_at", { ascending: false })
          .limit(5),

        supabase
          .from("jobs_v2")
          .select("id, title, created_at")
          .order("created_at", { ascending: false })
          .limit(5),

        supabase
          .from("careers")
          .select("id, title, created_at")
          .order("created_at", { ascending: false })
          .limit(5),

        supabase
          .from("schools")
          .select("id, name, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    const recentItems: ActivityItem[] = [
      ...(collegesResult.data || []).map((college) => ({
        id: `college-${college.id}`,
        type: "college" as const,
        title: college.name,
        createdAt: college.created_at,
        href: "/admin/colleges",
      })),

      ...(jobsResult.data || []).map((job) => ({
        id: `job-${job.id}`,
        type: "job" as const,
        title: job.title,
        createdAt: job.created_at,
        href: "/admin/jobs",
      })),

      ...(careersResult.data || []).map((career) => ({
        id: `career-${career.id}`,
        type: "career" as const,
        title: career.title,
        createdAt: career.created_at,
        href: "/admin/careers",
      })),

      ...(schoolsResult.data || []).map((school) => ({
        id: `school-${school.id}`,
        type: "school" as const,
        title: school.name,
        createdAt: school.created_at,
        href: "/admin/schools",
      })),
    ];

    recentItems.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setActivities(recentItems.slice(0, 10));
  };

  const loadRecentImports = async () => {
    const { data, error } = await supabase
      .from("import_history")
      .select(
        "id, import_type, file_name, total_rows, imported_rows, failed_rows, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Could not load recent imports:", error);
      setRecentImports([]);
      return;
    }

    setRecentImports(data || []);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const [
      collegesResult,
      jobsResult,
      careersResult,
      schoolsResult,
      examsResult,
      scholarshipsResult,
    ] = await Promise.all([
      loadCount("colleges"),
      loadCount("jobs_v2"),
      loadCount("careers"),
      loadCount("schools"),
      loadCount("exams"),
      loadCount("scholarships"),
    ]);

    const failedResults = [
      collegesResult,
      jobsResult,
      careersResult,
      schoolsResult,
      examsResult,
      scholarshipsResult,
    ].filter((result) => result.error);

    if (failedResults.length > 0) {
      setErrorMessage(
        "Some dashboard information could not be loaded. Check your Supabase RLS policies."
      );
    }

    setStats({
      colleges: collegesResult.count,
      jobs: jobsResult.count,
      careers: careersResult.count,
      schools: schoolsResult.count,
      exams: examsResult.count,
      scholarships: scholarshipsResult.count,
    });

    await Promise.all([
      loadRecentActivity(),
      loadRecentImports(),
    ]);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const statCards = [
    {
      title: "Colleges",
      count: stats.colleges,
      href: "/admin/colleges",
      icon: GraduationCap,
      description: "College records",
    },
    {
      title: "Jobs",
      count: stats.jobs,
      href: "/admin/jobs",
      icon: Briefcase,
      description: "Job opportunities",
    },
    {
      title: "Careers",
      count: stats.careers,
      href: "/admin/careers",
      icon: Compass,
      description: "Career guides",
    },
    {
      title: "Schools",
      count: stats.schools,
      href: "/admin/schools",
      icon: School,
      description: "School records",
    },
    {
      title: "Exams",
      count: stats.exams,
      href: "/admin/exams",
      icon: BookOpen,
      description: "Exam records",
    },
    {
      title: "Scholarships",
      count: stats.scholarships,
      href: "/admin/scholarships",
      icon: Award,
      description: "Scholarship records",
    },
  ];

  const quickActions = [
    {
      label: "Add College",
      href: "/admin/colleges/new",
      icon: GraduationCap,
    },
    {
      label: "Add Job",
      href: "/admin/jobs/new",
      icon: Briefcase,
    },
    {
      label: "Add Career",
      href: "/admin/careers/new",
      icon: Compass,
    },
    {
      label: "Bulk Import",
      href: "/admin/import",
      icon: Upload,
    },
  ];

  const totalRecords =
    stats.colleges +
    stats.jobs +
    stats.careers +
    stats.schools +
    stats.exams +
    stats.scholarships;

  const chartData = [
    { label: "Colleges", value: stats.colleges },
    { label: "Jobs", value: stats.jobs },
    { label: "Careers", value: stats.careers },
    { label: "Schools", value: stats.schools },
    { label: "Exams", value: stats.exams },
    { label: "Scholarships", value: stats.scholarships },
  ];

  const activityLabel = (type: ActivityItem["type"]) => {
    if (type === "college") return "College added";
    if (type === "job") return "Job added";
    if (type === "career") return "Career added";

    return "School added";
  };

  const activityEmoji = (type: ActivityItem["type"]) => {
    if (type === "college") return "🎓";
    if (type === "job") return "💼";
    if (type === "career") return "🧭";

    return "🏫";
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            StudentHub Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor and manage all StudentHub India platform data.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-700 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Stats
        </button>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          {errorMessage}
        </div>
      )}

      <section className="mt-8 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-900 p-7 text-white shadow-sm">
        <p className="text-sm font-semibold text-blue-100">
          Total database records
        </p>

        <p className="mt-2 text-5xl font-bold">
          {loading ? "..." : totalRecords.toLocaleString("en-IN")}
        </p>

        <p className="mt-3 text-blue-100">
          Combined records across colleges, jobs, careers, schools, exams and
          scholarships.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-900">
          Platform Statistics
        </h2>

        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.description}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {card.title}
                    </h3>

                    <p className="mt-4 text-4xl font-bold text-blue-700">
                      {loading
                        ? "..."
                        : card.count.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <AdminBarChart
          title="Platform Content Distribution"
          description="Visual overview of all records stored in StudentHub India."
          data={chartData}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 font-semibold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>

                {action.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Upload className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Imports
              </h2>

              <p className="mt-1 text-slate-600">
                Latest CSV upload results.
              </p>
            </div>
          </div>

          <Link
            href="/admin/import-history"
            className="font-semibold text-blue-700 hover:underline"
          >
            View All History →
          </Link>
        </div>

        <div className="mt-6 divide-y divide-slate-200">
          {loading ? (
            <p className="py-5 text-slate-600">
              Loading recent imports...
            </p>
          ) : recentImports.length === 0 ? (
            <p className="py-5 text-slate-600">
              No CSV imports have been recorded yet.
            </p>
          ) : (
            recentImports.map((item) => (
              <Link
                key={item.id}
                href="/admin/import-history"
                className="flex flex-col gap-3 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold capitalize text-slate-900">
                    {item.import_type} import
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.file_name} · {item.imported_rows}/
                    {item.total_rows} rows imported
                    {item.failed_rows > 0
                      ? ` · ${item.failed_rows} failed`
                      : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      importStatusStyles[item.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.status.replaceAll("_", " ")}
                  </span>

                  <p className="text-xs text-slate-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-2 text-green-700">
            <Plus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-slate-600">
              Latest records added across StudentHub India.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-slate-200">
          {loading ? (
            <p className="py-5 text-slate-600">
              Loading recent activity...
            </p>
          ) : activities.length === 0 ? (
            <p className="py-5 text-slate-600">
              No recent activity is available yet.
            </p>
          ) : (
            activities.map((activity) => (
              <Link
                key={activity.id}
                href={activity.href}
                className="flex items-start justify-between gap-4 py-4 transition hover:bg-slate-50"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {activityEmoji(activity.type)}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      {activityLabel(activity.type)}
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {activity.title}
                    </p>
                  </div>
                </div>

                <p className="text-right text-xs text-slate-500">
                  {formatDate(activity.createdAt)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}