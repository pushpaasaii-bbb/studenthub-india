"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error || !profile || profile.role !== "admin") {
        console.error("Admin access denied:", error);
        window.location.href = "/";
        return;
      }

      setAllowed(true);
      setChecking(false);
    };

    checkAdmin();
  }, []);

  if (checking || !allowed) {
    return <p className="p-8">Checking admin access...</p>;
  }

  return <>{children}</>;
}