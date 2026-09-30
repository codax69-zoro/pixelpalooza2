import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { INITIAL_SCORE_EVENTS } from "@/lib/constants/seed-teams";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(INITIAL_SCORE_EVENTS, { status: 200 });
  }

  const { data, error } = await supabase
    .from("score_events")
    .select("*, teams(name), games(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, team_id, game_id, points, type = "SCORE", reason, created_by = "Referee API", created_at, day } = body;

    if (!team_id || typeof points !== "number") {
      return NextResponse.json({ error: "Missing team_id or points" }, { status: 400 });
    }

    const eventRecord = {
      id: id || crypto.randomUUID(),
      team_id,
      game_id: game_id || null,
      day: day || 1,
      points,
      type,
      reason: reason || `Performance Points (+${points} PTS)`,
      created_by,
      created_at: created_at || new Date().toISOString(),
    };

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: "Offline mock mode active",
        event: eventRecord,
      });
    }

    const { data, error } = await supabase
      .from("score_events")
      .upsert([eventRecord], { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.warn("Supabase score insert warning:", error);
      // Return success with local record so client doesn't panic
      return NextResponse.json({ success: true, event: eventRecord, warning: error.message });
    }

    return NextResponse.json({ success: true, event: data || eventRecord });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record score" },
      { status: 500 }
    );
  }
}
