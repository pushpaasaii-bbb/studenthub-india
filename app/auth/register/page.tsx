"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    alert("Register form ready. Supabase signup will be connected later.");
  };

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Create Account
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Join StudentHub India and save your favorite colleges, exams and tools.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Full name"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Email address"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Password"
          />

          <button
            onClick={handleRegister}
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}