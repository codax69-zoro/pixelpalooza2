import { NextRequest, NextResponse } from "next/server";
import { OFFICIAL_GAMES } from "@/lib/constants/games";
import { SAMPLE_AUCTION_QUESTIONS } from "@/lib/constants/auction-questions";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Global in-memory cache preserved across warm serverless invocations
interface ArenaGlobalState {
  version: number;
  lastUpdated: string;
  teams: any[];
  games: any[];
  participations: any[];
  transactions: any[];
  scores: any[];
  auction: any[];
  eventState: any;
  eventLog: Array<{ id: string; timestamp: string; data: any }>;
}

declare global {
  var __pixelpalooza_state__: ArenaGlobalState | undefined;
}

if (!globalThis.__pixelpalooza_state__) {
  globalThis.__pixelpalooza_state__ = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    teams: [],
    games: OFFICIAL_GAMES,
    participations: [],
    transactions: [],
    scores: [],
    auction: SAMPLE_AUCTION_QUESTIONS,
    eventState: {
      id: 1,
      current_day: 1,
      event_status: "LIVE",
      active_round: "Day 1: Arena Attractions",
      announcement: "Welcome to Pixelpalooza 2-Day Tech Festival!",
    },
    eventLog: [],
  };
}

const state = globalThis.__pixelpalooza_state__;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientVersion = parseInt(searchParams.get("v") || "0", 10);

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const [teamsRes, gamesRes, scoresRes, stateRes, transRes, partRes, auctRes] = await Promise.all([
        supabase.from("teams").select("*"),
        supabase.from("games").select("*"),
        supabase.from("score_events").select("*").order("created_at", { ascending: false }),
        supabase.from("event_state").select("*").eq("id", 1).maybeSingle(),
        supabase.from("wallet_transactions").select("*").order("created_at", { ascending: false }),
        supabase.from("game_participation").select("*"),
        supabase.from("auction_questions").select("*").order("question_number", { ascending: true }),
      ]);

      if (teamsRes.data) {
        state.teams = teamsRes.data;
      }
      if (gamesRes.data && gamesRes.data.length > 0) {
        state.games = gamesRes.data;
      }
      if (scoresRes.data) {
        state.scores = scoresRes.data;
      }
      if (stateRes.data) {
        state.eventState = stateRes.data;
      }
      if (transRes.data) {
        state.transactions = transRes.data;
      }
      if (partRes.data) {
        state.participations = partRes.data;
      }
      if (auctRes.data && auctRes.data.length > 0) {
        state.auction = auctRes.data;
      }
    } catch (e) {
      console.warn("[Sync GET] Supabase read fallback to memory:", e);
    }
  }

  // Never return an empty games array
  const safeGames = state.games && state.games.length > 0 ? state.games : OFFICIAL_GAMES;
  const safeAuction = state.auction && state.auction.length > 0 ? state.auction : SAMPLE_AUCTION_QUESTIONS;

  return NextResponse.json(
    {
      unchanged: false,
      version: state.version,
      lastUpdated: state.lastUpdated,
      teams: state.teams,
      games: safeGames,
      participations: state.participations,
      transactions: state.transactions,
      scores: state.scores,
      auction: safeAuction,
      eventState: state.eventState,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = getSupabaseAdminClient();

    state.version++;
    state.lastUpdated = new Date().toISOString();

    // 1. Teams: Smart Upsert (never wipe out existing teams)
    if (data.teams && Array.isArray(data.teams) && data.teams.length > 0) {
      const teamMap = new Map(state.teams.map((t) => [t.id, t]));
      for (const t of data.teams) {
        teamMap.set(t.id, { ...teamMap.get(t.id), ...t });
      }
      state.teams = Array.from(teamMap.values());

      if (supabase) {
        try {
          await supabase.from("teams").upsert(data.teams, { onConflict: "id" });
        } catch (e) {
          console.warn("[Sync POST] Supabase teams upsert failed:", e);
        }
      }
    }

    // 2. Games: Must never be empty
    if (data.games && Array.isArray(data.games) && data.games.length > 0) {
      state.games = data.games;
    }

    // 3. Participations: Smart Upsert
    if (data.participations && Array.isArray(data.participations) && data.participations.length > 0) {
      const partMap = new Map(state.participations.map((p) => [`${p.team_id}_${p.game_id}`, p]));
      for (const p of data.participations) {
        partMap.set(`${p.team_id}_${p.game_id}`, { ...partMap.get(`${p.team_id}_${p.game_id}`), ...p });
      }
      state.participations = Array.from(partMap.values());

      if (supabase) {
        try {
          await supabase.from("game_participation").upsert(data.participations, { onConflict: "team_id,game_id" });
        } catch (e) {
          console.warn("[Sync POST] Supabase participation upsert failed:", e);
        }
      }
    }

    // 4. Wallet Transactions: Smart Append/Merge
    if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
      const txMap = new Map(state.transactions.map((tx) => [tx.id, tx]));
      for (const tx of data.transactions) {
        txMap.set(tx.id, tx);
      }
      state.transactions = Array.from(txMap.values());

      if (supabase) {
        try {
          await supabase.from("wallet_transactions").upsert(data.transactions, { onConflict: "id" });
        } catch (e) {
          console.warn("[Sync POST] Supabase tx upsert failed:", e);
        }
      }
    }

    // 5. Scores: Append-only Immutable Merge
    if (data.scores && Array.isArray(data.scores) && data.scores.length > 0) {
      const scoreMap = new Map(state.scores.map((s) => [s.id, s]));
      for (const s of data.scores) {
        scoreMap.set(s.id, s);
      }
      state.scores = Array.from(scoreMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      if (supabase) {
        try {
          await supabase.from("score_events").upsert(data.scores, { onConflict: "id" });
        } catch (e) {
          console.warn("[Sync POST] Supabase scores upsert failed:", e);
        }
      }
    }

    // 6. Single Score Added event
    if (data.type === "SCORE_ADDED" && data.event) {
      if (!state.scores.some((s) => s.id === data.event.id)) {
        state.scores = [data.event, ...state.scores];
      }
      if (supabase) {
        try {
          await supabase.from("score_events").upsert([data.event], { onConflict: "id" });
        } catch (e) {
          console.warn("[Sync POST] Supabase single score insert failed:", e);
        }
      }
    }

    // 7. Event State
    if (data.eventState && typeof data.eventState === "object") {
      state.eventState = { ...state.eventState, ...data.eventState };
      if (supabase) {
        try {
          await supabase.from("event_state").upsert({ id: 1, ...state.eventState }, { onConflict: "id" });
        } catch (e) {
          console.warn("[Sync POST] Supabase event_state upsert failed:", e);
        }
      }
    }

    state.eventLog.push({
      id: `${state.version}-${Date.now()}`,
      timestamp: state.lastUpdated,
      data,
    });

    if (state.eventLog.length > 100) {
      state.eventLog = state.eventLog.slice(-100);
    }

    return NextResponse.json({
      success: true,
      version: state.version,
      timestamp: state.lastUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to sync" },
      { status: 400 }
    );
  }
}
