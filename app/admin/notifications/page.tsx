"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

type NotificationType =
  | "exam"
  | "job"
  | "scholarship"
  | "college"
  | "general";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("StudentHub Test Notification");
  const [message, setMessage] = useState(
    "Your in-app notifications are working correctly."
  );
  const [notificationType, setNotificationType] =
    useState<NotificationType>("general");
  const [link, setLink] = useState("/dashboard");
  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const sendTestNotification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSending(true);
    setResultMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!user || !session) {
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
        userId: user.id,
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

    setResultMessage("Test notification sent successfully.");
    setSending(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Send Test Notification</h1>

      <p className="mt-2 text-slate-600">
        Send a real in-app notification to your own administrator account.
      </p>

      <form
        onSubmit={sendTestNotification}
        className="mt-8 max-w-2xl rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
              Notification Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-slate-700">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              rows={4}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-slate-700">
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
            <label htmlFor="link" className="block text-sm font-semibold text-slate-700">
              Optional Link
            </label>
            <input
              id="link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="/exams/gate-2026"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
            />
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
          {sending ? "Sending..." : "Send Me a Test Notification"}
        </button>
      </form>
    </div>
  );
}