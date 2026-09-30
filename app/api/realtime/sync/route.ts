import { NextRequest, NextResponse } from "next/server";

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
    games: [],
    participations: [],
    transactions: [],
    scores: [],
    auction: [],
    eventState: null,
    eventLog: [],
  };
}

const state = globalThis.__pixelpalooza_state__;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientVersion = parseInt(searchParams.get("v") || "0", 10);

  // Return full state or 304 if unchanged
  if (clientVersion >= state.version && clientVersion > 0) {
    return NextResponse.json({
      unchanged: true,
      version: state.version,
    });
  }

  return NextResponse.json(
    {
      unchanged: false,
      version: state.version,
      lastUpdated: state.lastUpdated,
      teams: state.teams,
      games: state.games,
      participations: state.participations,
      transactions: state.transactions,
      scores: state.scores,
      auction: state.auction,
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

    state.version++;
    state.lastUpdated = new Date().toISOString();

    if (data.teams && Array.isArray(data.teams)) state.teams = data.teams;
    if (data.games && Array.isArray(data.games)) state.games = data.games;
    if (data.participations && Array.isArray(data.participations)) state.participations = data.participations;
    if (data.transactions && Array.isArray(data.transactions)) state.transactions = data.transactions;
    if (data.scores && Array.isArray(data.scores)) state.scores = data.scores;
    if (data.auction && Array.isArray(data.auction)) state.auction = data.auction;
    if (data.eventState && typeof data.eventState === "object") state.eventState = data.eventState;

    if (data.type === "SCORE_ADDED" && data.event) {
      if (!state.scores.some((s) => s.id === data.event.id)) {
        state.scores = [data.event, ...state.scores];
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
