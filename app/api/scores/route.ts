import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { INITIAL_SCORE_EVENTS } from "@/lib/constants/seed-teams";

export async function GET() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    // Return sample seed events when Supabase is not connected
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
    const { team_id, game_id, points, type = "SCORE", reason, created_by = "Referee API" } = body;

    if (!team_id || typeof points !== "number") {
      return NextResponse.json({ error: "Missing team_id or points" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        message: "Offline mock mode active",
        event: {
          id: crypto.randomUUID(),
          team_id,
          game_id,
          points,
          type,
          reason,
          created_by,
          created_at: new Date().toISOString(),
        },
      });
    }

    const { data, error } = await supabase
      .from("score_events")
      .insert([
        {
          team_id,
          game_id,
          points,
          type,
          reason,
          created_by,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to record score" },
      { status: 500 }
    );
  }
}
