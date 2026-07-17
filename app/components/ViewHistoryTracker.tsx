"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

type ViewHistoryContentType =
  | "college"
  | "exam"
  | "job"
  | "scholarship"
  | "school"
  | "career";

type ViewHistoryTrackerProps = {
  contentType: ViewHistoryContentType;
  contentId: string | number;
  contentSlug: string;
  contentTitle: string;
};

export default function ViewHistoryTracker({
  contentType,
  contentId,
  contentSlug,
  contentTitle,
}: ViewHistoryTrackerProps) {
  useEffect(() => {
    const saveViewHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { error } = await supabase.from("view_history").upsert(
        {
          user_id: user.id,
          content_type: contentType,
          content_id: String(contentId),
          content_slug: contentSlug,
          content_title: contentTitle,
          viewed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,content_type,content_id",
        }
      );

      if (error) {
        console.error("Could not save view history:", error);
      }
    };

    if (contentId && contentSlug && contentTitle) {
      saveViewHistory();
    }
  }, [contentId, contentSlug, contentTitle, contentType]);

  return null;
}