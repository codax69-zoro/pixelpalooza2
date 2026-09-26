"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { 
  Team, 
  Game, 
  ScoreEvent, 
  ScoreEventType, 
  TeamStanding, 
  EventState, 
  ScoreTransaction 
} from "@/types/arena";
import { OFFICIAL_GAMES } from "@/lib/constants/games";
import { INITIAL_TEAMS, INITIAL_SCORE_EVENTS } from "@/lib/constants/seed-teams";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { soundFx } from "@/lib/audio/sound-fx";

interface ArenaContextType {
  teams: Team[];
  games: Game[];
  scoreEvents: ScoreEvent[];
  eventState: EventState;
  standings: TeamStanding[];
  transactions: ScoreTransaction[];
  currentLeader: TeamStanding | null;
  activeGame: Game | null;
  realtimeStatus: "connected" | "reconnecting" | "local";
  isProcessing: boolean;
  lastBroadcastEvent: ScoreEvent | null;
  // Actions
  addScore: (params: {
    teamId: string;
    gameId: string | null;
    points: number;
    type?: ScoreEventType;
    reason?: string;
  }) => Promise<{ success: boolean; error?: string; event?: ScoreEvent }>;
  undoScore: (scoreEventId: string) => Promise<{ success: boolean; error?: string }>;
  createTeam: (name: string, captain: string, members: string[]) => Promise<boolean>;
  updateTeam: (id: string, name: string, captain: string, members: string[]) => Promise<boolean>;
  deleteTeam: (id: string) => Promise<boolean>;
  setCurrentGame: (gameId: string) => Promise<void>;
  toggleHudFreeze: () => Promise<void>;
  resetScores: () => Promise<void>;
  resetEvent: () => Promise<void>;
  clearAllTeams: () => Promise<void>;
  simulateLiveScore: () => void;
}

const ArenaContext = createContext<ArenaContextType | null>(null);

const STORAGE_KEY_TEAMS = "gdgoc_pixelpalooza_teams_v2";
const STORAGE_KEY_SCORES = "gdgoc_pixelpalooza_scores_v2";
const STORAGE_KEY_STATE = "gdgoc_pixelpalooza_state_v2";

export function ArenaProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [games, setGames] = useState<Game[]>(OFFICIAL_GAMES);
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>(INITIAL_SCORE_EVENTS);
  const [eventState, setEventState] = useState<EventState>({
    id: 1,
    is_live: true,
    current_game_id: "00000000-0000-0000-0000-000000000006", // Tech Jeopardy default
    active_round: "Round 3: Finals",
    announcement: "Tech Jeopardy live in arena. Fast score entries active.",
    is_hud_frozen: false,
    updated_at: new Date().toISOString(),
  });

  const [realtimeStatus, setRealtimeStatus] = useState<"connected" | "reconnecting" | "local">("local");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastBroadcastEvent, setLastBroadcastEvent] = useState<ScoreEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cross-tab broadcast channel for local mode
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  // Initialize data from localStorage or Supabase
  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel("gdgoc_arena_bus");
    setBroadcastChannel(channel);

    channel.onmessage = (msg) => {
      if (msg.data?.type === "SCORE_ADDED") {
        const newEvt = msg.data.event;
        setScoreEvents((prev) => {
          if (prev.some((e) => e.id === newEvt.id)) return prev;
          return [newEvt, ...prev];
        });
        setLastBroadcastEvent(newEvt);
        if (newEvt.points >= 0) soundFx.playScoreAdded();
        else soundFx.playPenalty();
      } else if (msg.data?.type === "SCORE_UNDONE") {
        const reversalEvt = msg.data.event;
        setScoreEvents((prev) => [reversalEvt, ...prev]);
        setLastBroadcastEvent(reversalEvt);
        soundFx.playUndo();
      } else if (msg.data?.type === "EVENT_STATE_UPDATE") {
        setEventState(msg.data.state);
      } else if (msg.data?.type === "RESET_SCORES") {
        setScoreEvents([]);
      } else if (msg.data?.type === "TEAMS_UPDATE") {
        setTeams(msg.data.teams);
      }
    };

    // Clean up legacy v1 prototype storage keys if present
    try {
      localStorage.removeItem("gdgoc_arena_teams_v1");
      localStorage.removeItem("gdgoc_arena_scores_v1");
      localStorage.removeItem("gdgoc_arena_state_v1");
    } catch {}

    // Load initial local storage if present
    try {
      const storedTeams = localStorage.getItem(STORAGE_KEY_TEAMS);
      const storedScores = localStorage.getItem(STORAGE_KEY_SCORES);
      const storedState = localStorage.getItem(STORAGE_KEY_STATE);

      if (storedTeams) {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed)) setTeams(parsed);
      }
      if (storedScores) {
        const parsed = JSON.parse(storedScores);
        if (Array.isArray(parsed)) setScoreEvents(parsed);
      }
      if (storedState) {
        const parsed = JSON.parse(storedState);
        if (parsed && typeof parsed === "object") setEventState(parsed);
      }
    } catch (e) {
      console.warn("Could not read local storage:", e);
    }

    setIsLoaded(true);

    // If Supabase is configured, initialize Supabase Realtime
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        setRealtimeStatus("reconnecting");
        
        // Fetch remote records
        const fetchInitialData = async () => {
          try {
            const [teamsRes, gamesRes, scoresRes, stateRes] = await Promise.all([
              supabase.from("teams").select("*"),
              supabase.from("games").select("*"),
              supabase.from("score_events").select("*").order("created_at", { ascending: false }),
              supabase.from("event_state").select("*").eq("id", 1).maybeSingle(),
            ]);

            if (teamsRes.data && teamsRes.data.length > 0) setTeams(teamsRes.data);
            if (gamesRes.data && gamesRes.data.length > 0) setGames(gamesRes.data);
            if (scoresRes.data) setScoreEvents(scoresRes.data);
            if (stateRes.data) setEventState(stateRes.data);
          } catch (err) {
            console.warn("Supabase fetch failed, continuing in local mode:", err);
          }
        };

        fetchInitialData();

        // Subscribe to real-time events
        const rtChannel = supabase
          .channel("arena-realtime-live")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "score_events" },
            (payload) => {
              const newScore = payload.new as ScoreEvent;
              setScoreEvents((prev) => {
                if (prev.some((e) => e.id === newScore.id)) return prev;
                return [newScore, ...prev];
              });
              setLastBroadcastEvent(newScore);
              if (newScore.points >= 0) soundFx.playScoreAdded();
              else soundFx.playPenalty();
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "event_state" },
            (payload) => {
              if (payload.new) setEventState(payload.new as EventState);
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "teams" },
            async () => {
              const res = await supabase.from("teams").select("*");
              if (res.data) setTeams(res.data);
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              setRealtimeStatus("connected");
            } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
              setRealtimeStatus("reconnecting");
            }
          });

        return () => {
          channel.close();
          supabase.removeChannel(rtChannel);
        };
      }
    }

    return () => {
      channel.close();
    };
  }, []);

  // Sync state to local storage for persistence across reloads in offline / dev mode
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scoreEvents));
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(eventState));
    } catch {
      // Ignore quota errors
    }
  }, [teams, scoreEvents, eventState, isLoaded]);

  // Compute standings dynamically from score events
  const standings: TeamStanding[] = useMemo(() => {
    // Accumulate points per team
    const teamTotals: Record<string, {
      total: number;
      games: Set<string>;
      breakdown: Record<string, number>;
      lastDelta?: number;
      lastType?: ScoreEventType;
      lastGameName?: string;
      lastTime?: string;
      recentHits: number;
    }> = {};

    teams.forEach((t) => {
      teamTotals[t.id] = {
        total: 0,
        games: new Set<string>(),
        breakdown: {},
        recentHits: 0,
      };
    });

    // Score events sorted ascending to build streak and timeline
    const sorted = [...scoreEvents].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sorted.forEach((se) => {
      if (!teamTotals[se.team_id]) {
        teamTotals[se.team_id] = {
          total: 0,
          games: new Set<string>(),
          breakdown: {},
          recentHits: 0,
        };
      }
      const entry = teamTotals[se.team_id];
      entry.total += se.points;
      if (se.game_id && se.points > 0) {
        entry.games.add(se.game_id);
        entry.breakdown[se.game_id] = (entry.breakdown[se.game_id] || 0) + se.points;
      }
      if (se.points > 0) {
        entry.recentHits += 1;
      } else if (se.points < 0 && se.type === "PENALTY") {
        entry.recentHits = Math.max(0, entry.recentHits - 1);
      }

      const g = games.find((x) => x.id === se.game_id);
      entry.lastDelta = se.points;
      entry.lastType = se.type;
      entry.lastGameName = g ? g.name : "Arena Bonus";
      entry.lastTime = se.created_at;
    });

    const list: TeamStanding[] = teams.map((team) => {
      const stats = teamTotals[team.id] || {
        total: 0,
        games: new Set(),
        breakdown: {},
        recentHits: 0,
      };
      return {
        team,
        total_xp: stats.total,
        rank: 0,
        games_played: stats.games.size,
        last_score_delta: stats.lastDelta,
        last_score_type: stats.lastType,
        last_game_name: stats.lastGameName,
        last_updated_at: stats.lastTime,
        streak: Math.min(stats.recentHits, 5),
        game_breakdown: stats.breakdown,
      };
    });

    // Sort descending by total_xp, tie breaker by games_played or name
    list.sort((a, b) => {
      if (b.total_xp !== a.total_xp) {
        return b.total_xp - a.total_xp;
      }
      return a.team.name.localeCompare(b.team.name);
    });

    // Assign 1-based ranks
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    return list;
  }, [teams, scoreEvents, games]);

  // Current tournament leader
  const currentLeader = useMemo(() => {
    return standings.length > 0 ? standings[0] : null;
  }, [standings]);

  // Active game object
  const activeGame = useMemo(() => {
    return games.find((g) => g.id === eventState.current_game_id) || games[0] || null;
  }, [games, eventState.current_game_id]);

  // Recent score transactions for audit & undo log
  const transactions: ScoreTransaction[] = useMemo(() => {
    const teamMap = new Map(teams.map((t) => [t.id, t.name]));
    const gameMap = new Map(games.map((g) => [g.id, g.name]));

    // Running totals
    const runningTotals: Record<string, number> = {};
    const sortedAsc = [...scoreEvents].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const txMap = new Map<string, number>();
    sortedAsc.forEach((e) => {
      runningTotals[e.team_id] = (runningTotals[e.team_id] || 0) + e.points;
      txMap.set(e.id, runningTotals[e.team_id]);
    });

    // Return in reverse chronological order
    return [...scoreEvents]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((e) => {
        const timeStr = new Date(e.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          id: e.id,
          time: timeStr,
          team_id: e.team_id,
          team_name: teamMap.get(e.team_id) || "Unknown Team",
          game_id: e.game_id,
          game_name: e.game_id ? gameMap.get(e.game_id) || "Special Round" : "General Arena",
          score_change: e.points,
          type: e.type,
          new_total: txMap.get(e.id) || 0,
          logged_by: e.created_by,
          reason: e.reason,
          is_reversal: e.type === "REVERSAL",
        };
      });
  }, [scoreEvents, teams, games]);

  // ADD SCORE
  const addScore = useCallback(
    async ({
      teamId,
      gameId,
      points,
      type = points >= 0 ? "SCORE" : "PENALTY",
      reason,
    }: {
      teamId: string;
      gameId: string | null;
      points: number;
      type?: ScoreEventType;
      reason?: string;
    }) => {
      if (isProcessing) return { success: false, error: "Submission in progress" };
      setIsProcessing(true);

      const newEvent: ScoreEvent = {
        id: crypto.randomUUID(),
        team_id: teamId,
        game_id: gameId,
        points: points,
        type: type,
        reason: reason || (points >= 0 ? "Score entry" : "Penalty deduction"),
        created_by: "Organizer",
        created_at: new Date().toISOString(),
      };

      try {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseBrowserClient();
          if (supabase) {
            const { error } = await supabase.from("score_events").insert([newEvent]);
            if (error) {
              console.error("Supabase insert error:", error);
              setIsProcessing(false);
              return { success: false, error: "Unable to update score. Please try again." };
            }
          }
        }

        // Optimistic / Local update
        setScoreEvents((prev) => [newEvent, ...prev]);
        setLastBroadcastEvent(newEvent);

        if (broadcastChannel) {
          broadcastChannel.postMessage({ type: "SCORE_ADDED", event: newEvent });
        }

        if (points >= 0) soundFx.playScoreAdded();
        else soundFx.playPenalty();

        // Brief delay to prevent accidental rapid double taps
        await new Promise((r) => setTimeout(r, 400));
        setIsProcessing(false);
        return { success: true, event: newEvent };
      } catch (err) {
        console.error("Score entry failure:", err);
        setIsProcessing(false);
        return { success: false, error: "Unable to update score. Please try again." };
      }
    },
    [isProcessing, broadcastChannel]
  );

  // UNDO SCORE (creates a reversal event for audit trail)
  const undoScore = useCallback(
    async (scoreEventId: string) => {
      const original = scoreEvents.find((e) => e.id === scoreEventId);
      if (!original) return { success: false, error: "Transaction not found" };

      const reversalEvent: ScoreEvent = {
        id: crypto.randomUUID(),
        team_id: original.team_id,
        game_id: original.game_id,
        points: -original.points,
        type: "REVERSAL",
        reason: `Reversal of event (${original.points > 0 ? "+" : ""}${original.points} XP): ${original.reason || "Score"}`,
        reversal_of_id: original.id,
        created_by: "Organizer Reversal",
        created_at: new Date().toISOString(),
      };

      try {
        if (isSupabaseConfigured()) {
          const supabase = getSupabaseBrowserClient();
          if (supabase) {
            const { error } = await supabase.from("score_events").insert([reversalEvent]);
            if (error) {
              return { success: false, error: "Database error reversing score." };
            }
          }
        }

        setScoreEvents((prev) => [reversalEvent, ...prev]);
        setLastBroadcastEvent(reversalEvent);

        if (broadcastChannel) {
          broadcastChannel.postMessage({ type: "SCORE_UNDONE", event: reversalEvent });
        }

        soundFx.playUndo();
        return { success: true };
      } catch (err) {
        return { success: false, error: "Failed to reverse score." };
      }
    },
    [scoreEvents, broadcastChannel]
  );

  // TEAM MANAGEMENT
  const createTeam = useCallback(
    async (name: string, captain: string, members: string[]) => {
      const newTeam: Team = {
        id: crypto.randomUUID(),
        name: name.trim(),
        captain: captain.trim(),
        members: members.map((m) => m.trim()).filter(Boolean),
        avatar: ["sword", "shield", "pickaxe", "helmet", "compass"][Math.floor(Math.random() * 5)],
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          const { error } = await supabase.from("teams").insert([newTeam]);
          if (error) {
            console.error("Team create error:", error);
            return false;
          }
        }
      }

      setTeams((prev) => {
        const updated = [...prev, newTeam];
        if (broadcastChannel) broadcastChannel.postMessage({ type: "TEAMS_UPDATE", teams: updated });
        return updated;
      });
      return true;
    },
    [broadcastChannel]
  );

  const updateTeam = useCallback(
    async (id: string, name: string, captain: string, members: string[]) => {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          await supabase
            .from("teams")
            .update({ name, captain, members })
            .eq("id", id);
        }
      }

      setTeams((prev) => {
        const updated = prev.map((t) =>
          t.id === id ? { ...t, name, captain, members } : t
        );
        if (broadcastChannel) broadcastChannel.postMessage({ type: "TEAMS_UPDATE", teams: updated });
        return updated;
      });
      return true;
    },
    [broadcastChannel]
  );

  const deleteTeam = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          await supabase.from("teams").delete().eq("id", id);
        }
      }

      setTeams((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        if (broadcastChannel) broadcastChannel.postMessage({ type: "TEAMS_UPDATE", teams: updated });
        return updated;
      });
      return true;
    },
    [broadcastChannel]
  );

  // CURRENT GAME SELECTION
  const setCurrentGame = useCallback(
    async (gameId: string) => {
      const g = games.find((x) => x.id === gameId);
      const newState: EventState = {
        ...eventState,
        current_game_id: gameId,
        announcement: g ? `Active Game: ${g.name}. Scoring in progress.` : eventState.announcement,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
          await supabase.from("event_state").update(newState).eq("id", 1);
        }
      }

      setEventState(newState);
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: "EVENT_STATE_UPDATE", state: newState });
      }
    },
    [games, eventState, broadcastChannel]
  );

  // FREEZE HUD
  const toggleHudFreeze = useCallback(async () => {
    const newState: EventState = {
      ...eventState,
      is_hud_frozen: !eventState.is_hud_frozen,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("event_state").update(newState).eq("id", 1);
      }
    }

    setEventState(newState);
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "EVENT_STATE_UPDATE", state: newState });
    }
  }, [eventState, broadcastChannel]);

  // RESET SCORES (clears score events without deleting teams)
  const resetScores = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("score_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
    }

    setScoreEvents([]);
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify([]));
    } catch {}

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "RESET_SCORES" });
    }
  }, [broadcastChannel]);

  // CLEAR ALL SQUADS & SCORES (complete clean slate for fest)
  const clearAllTeams = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("score_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        await supabase.from("teams").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      }
    }

    setTeams([]);
    setScoreEvents([]);
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify([]));
    } catch {}

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "TEAMS_UPDATE", teams: [] });
      broadcastChannel.postMessage({ type: "RESET_SCORES" });
    }
  }, [broadcastChannel]);

  // RESET EVENT (restores clean state with 0 sample teams)
  const resetEvent = useCallback(async () => {
    setTeams(INITIAL_TEAMS);
    setScoreEvents(INITIAL_SCORE_EVENTS);
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(INITIAL_TEAMS));
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(INITIAL_SCORE_EVENTS));
    } catch {}

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "TEAMS_UPDATE", teams: INITIAL_TEAMS });
      INITIAL_SCORE_EVENTS.forEach((e) => {
        broadcastChannel.postMessage({ type: "SCORE_ADDED", event: e });
      });
    }
  }, [broadcastChannel]);

  // SIMULATE LIVE SCORE (handy demo button on public leaderboard)
  const simulateLiveScore = useCallback(() => {
    if (teams.length === 0 || games.length === 0) return;
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    const pointOptions = [25, 50, 100, 150, 200, 300];
    const points = pointOptions[Math.floor(Math.random() * pointOptions.length)];

    addScore({
      teamId: randomTeam.id,
      gameId: randomGame.id,
      points,
      type: "SCORE",
      reason: `Live challenge solve in ${randomGame.name}`,
    });
  }, [teams, games, addScore]);

  return (
    <ArenaContext.Provider
      value={{
        teams,
        games,
        scoreEvents,
        eventState,
        standings,
        transactions,
        currentLeader,
        activeGame,
        realtimeStatus,
        isProcessing,
        lastBroadcastEvent,
        addScore,
        undoScore,
        createTeam,
        updateTeam,
        deleteTeam,
        setCurrentGame,
        toggleHudFreeze,
        resetScores,
        resetEvent,
        clearAllTeams,
        simulateLiveScore,
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
}

export function useArena() {
  const context = useContext(ArenaContext);
  if (!context) {
    throw new Error("useArena must be used within an ArenaProvider");
  }
  return context;
}
