"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type NotificationType =
  | "exam"
  | "job"
  | "scholarship"
  | "college"
  | "general";

export default function AdminNotificationsPage() {
  const [targetEmail, setTargetEmail] = useState("");
  const [title, setTitle] = useState("StudentHub Test Notification");
  const [message, setMessage] = useState(
    "Your in-app notifications are working correctly."
  );
  const [notificationType, setNotificationType] =
    useState<NotificationType>("general");
  const [link, setLink] = useState("/dashboard");
  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const loadAdminEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setTargetEmail(user.email);
      }
    };

    loadAdminEmail();
  }, []);

  const sendNotification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSending(true);
    setResultMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setResultMessage("Please log in again before sending a notification.");
      setSending(false);
      return;
    }

    const response = await fetch("/api/admin/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        userEmail: targetEmail,
        title,
        message,
        notificationType,
        link,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setResultMessage(data.error || "Could not send notification.");
      setSending(false);
      return;
    }

    setResultMessage(`Notification sent successfully to ${targetEmail}.`);
    setSending(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Send Targeted Notification</h1>

      <p className="mt-2 text-slate-600">
        Send one real in-app notification to a registered StudentHub user.
        Broadcast notifications are not available.
      </p>

      <form
        onSubmit={sendNotification}
        className="mt-8 max-w-2xl rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="targetEmail"
              className="block text-sm font-semibold text-slate-700"
            >
              StudentHub User Email
            </label>
            <input
              id="targetEmail"
              type="email"
              value={targetEmail}
              onChange={(event) => setTargetEmail(event.target.value)}
              placeholder="student@example.com"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
            <p className="mt-2 text-sm text-slate-500">
              Only a registered StudentHub user can receive this notification.
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-700"
            >
              Notification Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-slate-700"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              required
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-semibold text-slate-700"
            >
              Notification Type
            </label>
            <select
              id="type"
              value={notificationType}
              onChange={(event) =>
                setNotificationType(event.target.value as NotificationType)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            >
              <option value="general">General</option>
              <option value="exam">Exam</option>
              <option value="job">Job</option>
              <option value="scholarship">Scholarship</option>
              <option value="college">College</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="link"
              className="block text-sm font-semibold text-slate-700"
            >
              Optional Internal Link
            </label>
            <input
              id="link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="/exams"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
            <p className="mt-2 text-sm text-slate-500">
              Use only a StudentHub path beginning with /.
            </p>
          </div>
        </div>

        {resultMessage && (
          <p className="mt-5 rounded-lg bg-blue-50 p-4 font-medium text-blue-700">
            {resultMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Targeted Notification"}
        </button>
      </form>
    </div>
  );
}