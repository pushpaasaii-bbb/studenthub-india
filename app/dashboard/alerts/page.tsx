"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type UserNotification = {
  id: number;
  title: string;
  message: string;
  notification_type:
    | "exam"
    | "job"
    | "scholarship"
    | "college"
    | "general";
  link: string | null;
  is_read: boolean;
  created_at: string;
};

const typeIcon: Record<UserNotification["notification_type"], string> = {
  exam: "📝",
  job: "💼",
  scholarship: "🎁",
  college: "🎓",
  general: "🔔",
};

export default function AlertsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  useEffect(() => {
    const loadNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data, error } = await supabase
        .from("user_notifications")
        .select(
          "id, title, message, notification_type, link, is_read, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Could not load notifications:", error);
      }

      setNotifications((data || []) as UserNotification[]);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    setUpdatingId(id);

    const { error } = await supabase
      .from("user_notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Could not mark notification as read:", error);
      setUpdatingId(null);
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );

    setUpdatingId(null);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) {
      return;
    }

    const { error } = await supabase
      .from("user_notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Could not mark all notifications as read:", error);
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-slate-600 dark:text-slate-400">
          Loading notifications...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/dashboard"
        className="text-sm font-semibold text-blue-700 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h1>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount === 1 ? "" : "s"
                  }`
                : "You are all caught up."}
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="rounded-lg border border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark All as Read
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                No notifications yet
              </p>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Exam, job, scholarship and college updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-xl border p-5 ${
                  notification.is_read
                    ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-slate-800"
                }`}
              >
                <div className="flex gap-4">
                  <span className="text-2xl">
                    {typeIcon[notification.notification_type]}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h2 className="font-bold text-slate-900 dark:text-white">
                        {notification.title}
                      </h2>

                      {!notification.is_read && (
                        <span className="w-fit rounded-full bg-blue-700 px-2 py-1 text-xs font-semibold text-white">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      {formatDate(notification.created_at)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {notification.link && (
                        <Link
                          href={notification.link}
                          className="text-sm font-semibold text-blue-700 hover:underline"
                        >
                          View details →
                        </Link>
                      )}

                      {!notification.is_read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          disabled={updatingId === notification.id}
                          className="text-sm font-semibold text-slate-700 hover:underline dark:text-slate-300"
                        >
                          {updatingId === notification.id
                            ? "Updating..."
                            : "Mark as read"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}