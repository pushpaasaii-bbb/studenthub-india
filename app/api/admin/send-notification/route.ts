import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const notificationTypes = [
  "exam",
  "job",
  "scholarship",
  "college",
  "general",
] as const;

type NotificationType = (typeof notificationTypes)[number];

type NotificationBody = {
  userId?: string;
  userEmail?: string;
  title: string;
  message: string;
  notificationType: NotificationType;
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
    const title = body.title?.trim();
    const message = body.message?.trim();
    const link = body.link?.trim() || null;

    if (!title || !message || !body.notificationType) {
      return NextResponse.json(
        { error: "Title, message and notification type are required." },
        { status: 400 }
      );
    }

    if (!notificationTypes.includes(body.notificationType)) {
      return NextResponse.json(
        { error: "Notification type is invalid." },
        { status: 400 }
      );
    }

    if (title.length > 120 || message.length > 2000) {
      return NextResponse.json(
        { error: "Title or message is too long." },
        { status: 400 }
      );
    }

    if (link && (!link.startsWith("/") || link.startsWith("//"))) {
      return NextResponse.json(
        { error: "Link must be a safe internal path starting with /." },
        { status: 400 }
      );
    }

    let targetUserId = body.userId?.trim();

    if (body.userEmail?.trim()) {
      const targetEmail = body.userEmail.trim().toLowerCase();

      const { data: targetProfile, error: targetProfileError } =
        await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", targetEmail)
          .maybeSingle();

      if (targetProfileError || !targetProfile) {
        return NextResponse.json(
          { error: "No StudentHub user was found with that email address." },
          { status: 404 }
        );
      }

      targetUserId = targetProfile.id;
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: "A target user is required." },
        { status: 400 }
      );
    }

    const { data: targetProfile, error: targetProfileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("id", targetUserId)
        .maybeSingle();

    if (targetProfileError || !targetProfile) {
      return NextResponse.json(
        { error: "The selected user does not exist." },
        { status: 404 }
      );
    }

    const { data: rateLimitAllowed, error: rateLimitError } =
      await supabaseAdmin.rpc("consume_admin_notification_rate_limit", {
        p_admin_user_id: user.id,
      });

    if (rateLimitError) {
      console.error("Notification rate-limit check failed:", rateLimitError);

      return NextResponse.json(
        { error: "Could not send notification right now." },
        { status: 500 }
      );
    }

    if (!rateLimitAllowed) {
      return NextResponse.json(
        {
          error:
            "Notification limit reached. Please wait before sending more notifications.",
        },
        { status: 429 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from("user_notifications")
      .insert({
        user_id: targetUserId,
        title,
        message,
        notification_type: body.notificationType,
        link,
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