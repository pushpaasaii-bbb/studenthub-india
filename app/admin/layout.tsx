import Link from "next/link";
import AdminGuard from "./AdminGuard";

const menu = [
  { name: "Dashboard", href: "/admin" },
  { name: "Colleges", href: "/admin/colleges" },
  { name: "Schools", href: "/admin/schools" },
  { name: "Careers", href: "/admin/careers" },
  { name: "Jobs", href: "/admin/jobs" },
  { name: "Exams", href: "/admin/exams" },
  { name: "Scholarships", href: "/admin/scholarships" },
  { name: "Blogs", href: "/admin/blogs" },
  { name: "Tools", href: "/admin/tools" },
  { name: "Bulk Import", href: "/admin/import" },
  { name: "Import History", href: "/admin/import-history" },
  { name: "Audit Logs", href: "/admin/audit-logs" },
  { name: "Notifications", href: "/admin/notifications" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <div className="flex">
          <aside className="min-h-screen w-72 border-r bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="p-6">
              <Link
                href="/admin"
                className="text-2xl font-bold text-blue-700"
              >
                StudentHub Admin
              </Link>

              <nav className="mt-8 space-y-2">
                {menu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="min-w-0 flex-1 p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}