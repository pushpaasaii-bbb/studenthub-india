import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

type NotificationBody = {
  userId: string;
  title: string;
  message: string;
  notificationType:
    | "exam"
    | "job"
    | "scholarship"
    | "college"
    | "general";
  link?: string;
};

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Your login session is invalid." },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access is required." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as NotificationBody;

    if (
      !body.userId ||
      !body.title?.trim() ||
      !body.message?.trim() ||
      !body.notificationType
    ) {
      return NextResponse.json(
        { error: "User, title, message and notification type are required." },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("user_notifications")
      .insert({
        user_id: body.userId,
        title: body.title.trim(),
        message: body.message.trim(),
        notification_type: body.notificationType,
        link: body.link?.trim() || null,
      });

    if (insertError) {
      console.error("Notification insert failed:", insertError);

      return NextResponse.json(
        { error: "Could not create notification." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully.",
    });
  } catch (error) {
    console.error("Send notification API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while sending the notification." },
      { status: 500 }
    );
  }
}