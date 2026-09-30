"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { 
  Team, 
  Game, 
  GameParticipation, 
  GameParticipationStatus, 
  WalletTransaction, 
  WalletTransactionType, 
  ScoreEvent, 
  ScoreEventType, 
  AuctionQuestion, 
  AuctionBid, 
  AuctionResult, 
  EventStatus, 
  EventState, 
  TeamStanding, 
  ScoreTransaction 
} from "@/types/arena";
import { OFFICIAL_GAMES } from "@/lib/constants/games";
import { SAMPLE_AUCTION_QUESTIONS } from "@/lib/constants/auction-questions";
import { INITIAL_TEAMS, INITIAL_SCORE_EVENTS } from "@/lib/constants/seed-teams";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { soundFx } from "@/lib/audio/sound-fx";

interface ArenaContextType {
  teams: Team[];
  games: Game[];
  activeGames: Game[];
  day1Games: Game[];
  day2Games: Game[];
  gameParticipations: GameParticipation[];
  walletTransactions: WalletTransaction[];
  scoreEvents: ScoreEvent[];
  auctionQuestions: AuctionQuestion[];
  activeAuctionQuestion: AuctionQuestion | null;
  eventState: EventState;
  standings: TeamStanding[];
  day1Standings: TeamStanding[];
  day2Standings: TeamStanding[];
  overallStandings: TeamStanding[];
  transactions: ScoreTransaction[];
  currentLeader: TeamStanding | null;
  activeGame: Game | null;
  realtimeStatus: "connected" | "reconnecting" | "local";
  realtimeTransport: "websocket" | "supabase" | "livesync" | "local";
  activeDeviceCount: number;
  isProcessing: boolean;
  lastBroadcastEvent: ScoreEvent | null;
  // Team Management
  createTeam: (name: string, captain: string, members: string[]) => Promise<{ success: boolean; error?: string; team?: Team }>;
  updateTeam: (id: string, name: string, captain: string, members: string[]) => Promise<boolean>;
  deleteTeam: (id: string) => Promise<boolean>;
  // Game Registration & Participation
  registerForGame: (teamId: string, gameId: string) => Promise<{ success: boolean; error?: string }>;
  skipGame: (teamId: string, gameId: string) => Promise<{ success: boolean; error?: string }>;
  updateGameParticipationStatus: (teamId: string, gameId: string, status: GameParticipationStatus) => Promise<boolean>;
  recordGameReward: (teamId: string, gameId: string, points: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  // Wallet & Audit Transactions
  recordManualAdjustment: (teamId: string, amount: number, reason: string) => Promise<{ success: boolean; error?: string }>;
  reverseWalletTransaction: (transactionId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  // Direct Score Events
  addScore: (params: {
    teamId: string;
    gameId: string | null;
    points: number;
    type?: ScoreEventType;
    reason?: string;
    day?: 1 | 2;
  }) => Promise<{ success: boolean; error?: string; event?: ScoreEvent }>;
  undoScore: (scoreEventId: string) => Promise<{ success: boolean; error?: string }>;
  // Auction Controls (Day 2)
  setCurrentAuctionQuestion: (questionId: string | null) => Promise<void>;
  placeAuctionBid: (questionId: string, teamId: string, bidAmount: number) => Promise<{ success: boolean; error?: string }>;
  sellAuctionQuestion: (questionId: string, teamId: string, winningBid: number) => Promise<{ success: boolean; error?: string }>;
  recordAuctionAnswer: (questionId: string, answerStatus: 'CORRECT' | 'INCORRECT') => Promise<{ success: boolean; error?: string }>;
  skipAuctionQuestion: (questionId: string) => Promise<{ success: boolean }>;
  resetAuctionQuestion: (questionId: string) => Promise<{ success: boolean }>;
  updateAuctionQuestion: (questionId: string, updates: Partial<AuctionQuestion>) => Promise<boolean>;
  // Event State Controls
  setEventDay: (day: 1 | 2) => Promise<void>;
  setEventStatus: (status: EventStatus) => Promise<void>;
  setCurrentGame: (gameId: string | null) => Promise<void>;
  updateEventConfig: (updates: Partial<EventState>) => Promise<void>;
  updateGame: (gameId: string, updates: Partial<Game>) => Promise<boolean>;
  toggleHudFreeze: () => Promise<void>;
  resetScores: () => Promise<void>;
  resetEvent: () => Promise<void>;
  clearAllTeams: () => Promise<void>;
  simulateLiveScore: () => void;
}

const ArenaContext = createContext<ArenaContextType | null>(null);

const STORAGE_KEY_TEAMS = "gdgoc_pixelpalooza_teams_v3";
const STORAGE_KEY_GAMES = "gdgoc_pixelpalooza_games_v3";
const STORAGE_KEY_PARTICIPATION = "gdgoc_pixelpalooza_participation_v3";
const STORAGE_KEY_TRANSACTIONS = "gdgoc_pixelpalooza_transactions_v3";
const STORAGE_KEY_SCORES = "gdgoc_pixelpalooza_scores_v3";
const STORAGE_KEY_AUCTION = "gdgoc_pixelpalooza_auction_v3";
const STORAGE_KEY_STATE = "gdgoc_pixelpalooza_state_v3";

// Conflict-free smart merge helpers
function mergeTeamsList(current: Team[], incoming: Team[]): Team[] {
  if (!incoming || incoming.length === 0) return current;
  const map = new Map<string, Team>();
  for (const t of current) map.set(t.id, t);
  for (const t of incoming) {
    const existing = map.get(t.id);
    if (!existing) {
      map.set(t.id, t);
    } else {
      const incTime = new Date(t.updated_at || 0).getTime();
      const curTime = new Date(existing.updated_at || 0).getTime();
      map.set(t.id, incTime >= curTime ? { ...existing, ...t } : { ...t, ...existing });
    }
  }
  return Array.from(map.values());
}

function mergeScoreEventsList(current: ScoreEvent[], incoming: ScoreEvent[]): ScoreEvent[] {
  if (!incoming || incoming.length === 0) return current;
  const map = new Map<string, ScoreEvent>();
  for (const s of incoming) map.set(s.id, s);
  for (const s of current) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function mergeWalletTransactionsList(current: WalletTransaction[], incoming: WalletTransaction[]): WalletTransaction[] {
  if (!incoming || incoming.length === 0) return current;
  const map = new Map<string, WalletTransaction>();
  for (const tx of incoming) map.set(tx.id, tx);
  for (const tx of current) {
    if (!map.has(tx.id)) map.set(tx.id, tx);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function mergeParticipationsList(current: GameParticipation[], incoming: GameParticipation[]): GameParticipation[] {
  if (!incoming || incoming.length === 0) return current;
  const map = new Map<string, GameParticipation>();
  for (const p of current) map.set(`${p.team_id}_${p.game_id}`, p);
  for (const p of incoming) {
    const key = `${p.team_id}_${p.game_id}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, p);
    } else {
      const weights: Record<string, number> = {
        COMPLETED: 5,
        PLAYING: 4,
        REGISTERED: 3,
        SKIPPED: 2,
        NOT_SELECTED: 1,
      };
      const curW = weights[existing.status] || 0;
      const incW = weights[p.status] || 0;
      map.set(key, incW >= curW ? { ...existing, ...p } : { ...p, ...existing });
    }
  }
  return Array.from(map.values());
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function ArenaProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [games, setGames] = useState<Game[]>(OFFICIAL_GAMES);
  const [gameParticipations, setGameParticipations] = useState<GameParticipation[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>(INITIAL_SCORE_EVENTS);
  const [auctionQuestions, setAuctionQuestions] = useState<AuctionQuestion[]>(SAMPLE_AUCTION_QUESTIONS);
  
  const [eventState, setEventState] = useState<EventState>({
    id: 1,
    current_day: 1,
    event_status: "LIVE",
    current_game_id: "00000000-0000-0000-0000-000000000101", // Balloon + Cup Tower
    current_auction_question_id: "q-001",
    auction_name: "TECH AUCTION",
    active_round: "Day 1: Arena Attractions",
    announcement: "Pixelpalooza 2-Day Festival is LIVE! Starting budget: 1500 points. Spend wisely!",
    is_hud_frozen: false,
    day1_weight: 1.0,
    day2_weight: 1.0,
    wallet_to_score_ratio: 0.0,
    reward_destination: "score_only",
    auction_incorrect_penalty: 0,
    is_live: true,
    updated_at: new Date().toISOString(),
  });

  const [realtimeStatus, setRealtimeStatus] = useState<"connected" | "reconnecting" | "local">("local");
  const [realtimeTransport, setRealtimeTransport] = useState<"websocket" | "supabase" | "livesync" | "local">("local");
  const [activeDeviceCount, setActiveDeviceCount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastBroadcastEvent, setLastBroadcastEvent] = useState<ScoreEvent | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  const wsRef = React.useRef<WebSocket | null>(null);
  const supabaseChannelRef = React.useRef<any>(null);

  // Unified message handler across WebSockets, Supabase Broadcast, and SSE
  const handleIncomingMessage = useCallback((data: any) => {
    if (!data) return;

    if (data.type === "CLIENT_COUNT" && typeof data.count === "number") {
      setActiveDeviceCount(data.count);
      return;
    }

    if (data.type === "STATE_SYNC") {
      if (data.teams && Array.isArray(data.teams) && data.teams.length > 0) {
        setTeams((prev) => mergeTeamsList(prev, data.teams));
      }
      if (data.games && Array.isArray(data.games) && data.games.length > 0) {
        setGames(data.games);
      }
      if (data.participations && Array.isArray(data.participations) && data.participations.length > 0) {
        setGameParticipations((prev) => mergeParticipationsList(prev, data.participations));
      }
      if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
        setWalletTransactions((prev) => mergeWalletTransactionsList(prev, data.transactions));
      }
      if (data.scores && Array.isArray(data.scores) && data.scores.length > 0) {
        setScoreEvents((prev) => mergeScoreEventsList(prev, data.scores));
      }
      if (data.auction && Array.isArray(data.auction) && data.auction.length > 0) {
        setAuctionQuestions(data.auction);
      }
      if (data.eventState && typeof data.eventState === "object") {
        setEventState((prev) => ({ ...prev, ...data.eventState }));
      }
    } else if (data.type === "SCORE_ADDED") {
      const newEvt = data.event;
      if (newEvt) {
        setScoreEvents((prev) => mergeScoreEventsList(prev, [newEvt]));
        setLastBroadcastEvent(newEvt);
        if (newEvt.points >= 0) soundFx.playScoreAdded();
        else soundFx.playPenalty();
      }
    } else if (data.type === "WALLET_UPDATED") {
      if (data.teams && Array.isArray(data.teams) && data.teams.length > 0) {
        setTeams((prev) => mergeTeamsList(prev, data.teams));
      }
      if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
        setWalletTransactions((prev) => mergeWalletTransactionsList(prev, data.transactions));
      }
      soundFx.playPowerUp();
    } else if (data.type === "EVENT_STATE_UPDATE") {
      if (data.state) setEventState((prev) => ({ ...prev, ...data.state }));
    }
  }, []);

  // Initialize data and load from localStorage, WebSocket, Supabase, or Vercel Live-Sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const channel = new BroadcastChannel("gdgoc_arena_bus_v3");
    setBroadcastChannel(channel);

    channel.onmessage = (msg) => {
      handleIncomingMessage(msg.data);
    };

    // Load from localStorage
    try {
      const storedTeams = localStorage.getItem(STORAGE_KEY_TEAMS);
      const storedGames = localStorage.getItem(STORAGE_KEY_GAMES);
      const storedParticipation = localStorage.getItem(STORAGE_KEY_PARTICIPATION);
      const storedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      const storedScores = localStorage.getItem(STORAGE_KEY_SCORES);
      const storedAuction = localStorage.getItem(STORAGE_KEY_AUCTION);
      const storedState = localStorage.getItem(STORAGE_KEY_STATE);

      // Migration from v2 if v3 is not found
      if (!storedTeams) {
        const v2Teams = localStorage.getItem("gdgoc_pixelpalooza_teams_v2");
        if (v2Teams) {
          try {
            const parsed = JSON.parse(v2Teams);
            if (Array.isArray(parsed)) {
              // Ensure starting_wallet and current_wallet exist
              const migrated = parsed.map((t: any) => ({
                ...t,
                starting_wallet: t.starting_wallet ?? 1500,
                current_wallet: t.current_wallet ?? 1500,
              }));
              setTeams(migrated);
            }
          } catch {}
        }
      } else {
        const parsed = JSON.parse(storedTeams);
        if (Array.isArray(parsed)) setTeams(parsed);
      }

      if (storedGames) {
        try {
          const parsed = JSON.parse(storedGames);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge to ensure all 5 Day-1 games and 1 Day-2 game exist
            const merged = OFFICIAL_GAMES.map((official) => {
              const existing = parsed.find((p: Game) => p.id === official.id || p.slug === official.slug);
              return existing ? { ...official, ...existing } : official;
            });
            setGames(merged);
          } else {
            setGames(OFFICIAL_GAMES);
          }
        } catch {
          setGames(OFFICIAL_GAMES);
        }
      } else {
        setGames(OFFICIAL_GAMES);
      }

      if (storedParticipation) {
        const parsed = JSON.parse(storedParticipation);
        if (Array.isArray(parsed)) setGameParticipations(parsed);
      }

      if (storedTransactions) {
        const parsed = JSON.parse(storedTransactions);
        if (Array.isArray(parsed)) setWalletTransactions(parsed);
      }

      if (storedScores) {
        const parsed = JSON.parse(storedScores);
        if (Array.isArray(parsed)) setScoreEvents(parsed);
      }

      if (storedAuction) {
        const parsed = JSON.parse(storedAuction);
        if (Array.isArray(parsed) && parsed.length > 0) setAuctionQuestions(parsed);
      }

      if (storedState) {
        const parsed = JSON.parse(storedState);
        if (parsed && typeof parsed === "object") {
          setEventState((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn("Could not read local storage:", e);
    }

    setIsLoaded(true);

    // -------------------------------------------------------------
    // REALTIME TRANSPORT 1: Direct Dedicated WebSocket Server
    // -------------------------------------------------------------
    let ws: WebSocket | null = null;
    let wsConnected = false;

    const configuredWsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const defaultWsUrl =
      typeof window !== "undefined" &&
      window.location.protocol === "http:" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.startsWith("192.168."))
        ? `ws://${window.location.hostname}:3001`
        : null;

    const targetWsUrl = configuredWsUrl || defaultWsUrl;

    if (targetWsUrl) {
      try {
        ws = new WebSocket(targetWsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          wsConnected = true;
          setRealtimeStatus("connected");
          setRealtimeTransport("websocket");
          console.log("[Arena] Connected to Dedicated WebSocket Server at", targetWsUrl);
        };

        ws.onmessage = (evt) => {
          try {
            const parsed = JSON.parse(evt.data);
            handleIncomingMessage(parsed);
          } catch {}
        };

        ws.onerror = () => {
          // Fallback silently to Supabase or Live-Sync
        };

        ws.onclose = () => {
          wsRef.current = null;
          wsConnected = false;
        };
      } catch (e) {
        console.warn("[Arena] Could not connect to direct WebSocket:", e);
      }
    }

    // -------------------------------------------------------------
    // REALTIME TRANSPORT 2: Supabase Realtime (WebSockets + Broadcast)
    // -------------------------------------------------------------
    let supabaseChannel: any = null;
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        setRealtimeStatus("reconnecting");
        const fetchInitialData = async () => {
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

            if (teamsRes.data && teamsRes.data.length > 0) {
              setTeams((prev) => mergeTeamsList(prev, teamsRes.data));
            }
            if (gamesRes.data && gamesRes.data.length > 0) {
              setGames(gamesRes.data);
            }
            if (scoresRes.data && scoresRes.data.length > 0) {
              setScoreEvents((prev) => mergeScoreEventsList(prev, scoresRes.data));
            }
            if (stateRes.data) {
              setEventState((prev) => ({ ...prev, ...stateRes.data }));
            }
            if (transRes.data && transRes.data.length > 0) {
              setWalletTransactions((prev) => mergeWalletTransactionsList(prev, transRes.data));
            }
            if (partRes.data && partRes.data.length > 0) {
              setGameParticipations((prev) => mergeParticipationsList(prev, partRes.data));
            }
            if (auctRes.data && auctRes.data.length > 0) {
              setAuctionQuestions(auctRes.data);
            }

            // Proactive Data Rescue: If local storage has teams or scores not yet in Supabase, upload them!
            try {
              const localTeamsRaw = localStorage.getItem(STORAGE_KEY_TEAMS);
              const localScoresRaw = localStorage.getItem(STORAGE_KEY_SCORES);
              if (localTeamsRaw) {
                const parsedTeams: Team[] = JSON.parse(localTeamsRaw);
                if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
                  const remoteIds = new Set((teamsRes.data || []).map((t: any) => t.id));
                  const unuploadedTeams = parsedTeams.filter((t) => !remoteIds.has(t.id));
                  if (unuploadedTeams.length > 0) {
                    await supabase.from("teams").upsert(unuploadedTeams, { onConflict: "id" });
                  }
                }
              }
              if (localScoresRaw) {
                const parsedScores: ScoreEvent[] = JSON.parse(localScoresRaw);
                if (Array.isArray(parsedScores) && parsedScores.length > 0) {
                  const remoteIds = new Set((scoresRes.data || []).map((s: any) => s.id));
                  const unuploadedScores = parsedScores.filter((s) => !remoteIds.has(s.id));
                  if (unuploadedScores.length > 0) {
                    await supabase.from("score_events").upsert(unuploadedScores, { onConflict: "id" });
                  }
                }
              }
            } catch (err) {
              console.warn("[Arena] Local data rescue upload notice:", err);
            }
          } catch (err) {
            console.warn("Supabase fetch failed, continuing in local mode:", err);
          }
        };

        fetchInitialData();

        supabaseChannel = supabase
          .channel("arena-realtime-v3")
          // Instant Broadcast Channel over WebSockets (<30ms)
          .on("broadcast", { event: "ARENA_SYNC" }, ({ payload }: any) => {
            handleIncomingMessage({ type: "STATE_SYNC", ...payload });
          })
          .on("broadcast", { event: "SCORE_ADDED" }, ({ payload }: any) => {
            handleIncomingMessage({ type: "SCORE_ADDED", ...payload });
          })
          // Postgres CDC Table Listeners
          .on("postgres_changes", { event: "*", schema: "public", table: "score_events" }, async () => {
            const res = await supabase.from("score_events").select("*").order("created_at", { ascending: false });
            if (res.data && res.data.length > 0) setScoreEvents((prev) => mergeScoreEventsList(prev, res.data));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "wallet_transactions" }, async () => {
            const res = await supabase.from("wallet_transactions").select("*").order("created_at", { ascending: false });
            if (res.data && res.data.length > 0) setWalletTransactions((prev) => mergeWalletTransactionsList(prev, res.data));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "event_state" }, (payload) => {
            if (payload.new) setEventState((prev) => ({ ...prev, ...(payload.new as EventState) }));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, async () => {
            const res = await supabase.from("teams").select("*");
            if (res.data && res.data.length > 0) setTeams((prev) => mergeTeamsList(prev, res.data));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "games" }, async () => {
            const res = await supabase.from("games").select("*");
            if (res.data && res.data.length > 0) setGames(res.data);
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "game_participation" }, async () => {
            const res = await supabase.from("game_participation").select("*");
            if (res.data && res.data.length > 0) setGameParticipations((prev) => mergeParticipationsList(prev, res.data));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "auction_questions" }, async () => {
            const res = await supabase.from("auction_questions").select("*");
            if (res.data && res.data.length > 0) setAuctionQuestions(res.data);
          })
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              setRealtimeStatus("connected");
              setRealtimeTransport("supabase");
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              if (!wsConnected) setRealtimeStatus("local");
            }
          });

        supabaseChannelRef.current = supabaseChannel;
      }
    }

    // -------------------------------------------------------------
    // REALTIME TRANSPORT 3: Vercel Serverless Live-Sync Engine (SSE + Poll)
    // Always active as resilient fallback heartbeat across mobile connections
    // -------------------------------------------------------------
    let sseSource: EventSource | null = null;
    let pollInterval: any = null;

    try {
      sseSource = new EventSource("/api/realtime/events");
      sseSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleIncomingMessage(parsed);
        } catch {}
      };
    } catch (err) {
      // SSE silent fallback
    }

    // Delta sync polling every 3s for guaranteed consistency across mobile browsers
    let lastServerVersion = 0;
    const syncWithServer = async () => {
      try {
        const res = await fetch(`/api/realtime/sync?v=${lastServerVersion}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (!json.unchanged && json.version > lastServerVersion) {
            lastServerVersion = json.version;
            handleIncomingMessage({
              type: "STATE_SYNC",
              teams: json.teams,
              games: json.games,
              participations: json.participations,
              transactions: json.transactions,
              scores: json.scores,
              auction: json.auction,
              eventState: json.eventState,
            });
          }
        }
      } catch {}
    };

    syncWithServer();
    pollInterval = setInterval(syncWithServer, 3000);

    return () => {
      channel.close();
      if (ws) ws.close();
      if (supabaseChannel && isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        if (supabase) supabase.removeChannel(supabaseChannel);
      }
      if (sseSource) sseSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [handleIncomingMessage]);

  // Save to localStorage when state changes (guaranteed non-destructive)
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    try {
      if (teams && teams.length > 0) localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
      if (games && games.length > 0) localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
      if (gameParticipations && gameParticipations.length > 0) localStorage.setItem(STORAGE_KEY_PARTICIPATION, JSON.stringify(gameParticipations));
      if (walletTransactions && walletTransactions.length > 0) localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(walletTransactions));
      if (scoreEvents && scoreEvents.length > 0) localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scoreEvents));
      if (auctionQuestions && auctionQuestions.length > 0) localStorage.setItem(STORAGE_KEY_AUCTION, JSON.stringify(auctionQuestions));
      if (eventState) localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(eventState));
    } catch (e) {
      console.warn("Failed to persist to localStorage:", e);
    }
  }, [teams, games, gameParticipations, walletTransactions, scoreEvents, auctionQuestions, eventState, isLoaded]);

  // Broadcast state changes helper across all connected devices
  const broadcastSync = useCallback((patch: Record<string, any>) => {
    // 1. Same-device inter-tab sync
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: "STATE_SYNC",
          ...patch,
        });
      } catch {}
    }

    // 2. Direct WebSocket broadcast (if connected)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: "STATE_SYNC",
            ...patch,
          })
        );
      } catch (err) {
        console.warn("[WS] Send error:", err);
      }
    }

    // 3. Supabase Realtime Broadcast (if channel active)
    if (supabaseChannelRef.current) {
      try {
        supabaseChannelRef.current.send({
          type: "broadcast",
          event: "ARENA_SYNC",
          payload: patch,
        });
      } catch (err) {
        console.warn("[Supabase] Broadcast send error:", err);
      }
    }

    // 4. Serverless Live-Sync API route (syncs with Vercel / server)
    try {
      fetch("/api/realtime/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "STATE_SYNC",
          ...patch,
        }),
      }).catch(() => {});
    } catch {}
  }, [broadcastChannel]);

  // Derived filtered games - guaranteed fallback to OFFICIAL_GAMES
  const effectiveGames = useMemo(() => {
    return games && games.length > 0 ? games : OFFICIAL_GAMES;
  }, [games]);

  const activeGames = useMemo(() => effectiveGames.filter((g) => g.active), [effectiveGames]);
  const day1Games = useMemo(() => effectiveGames.filter((g) => g.day === 1 && g.active).sort((a, b) => a.order_index - b.order_index), [effectiveGames]);
  const day2Games = useMemo(() => effectiveGames.filter((g) => g.day === 2 && g.active).sort((a, b) => a.order_index - b.order_index), [effectiveGames]);
  
  const activeGame = useMemo(() => {
    return effectiveGames.find((g) => g.id === eventState.current_game_id) || effectiveGames[0] || null;
  }, [effectiveGames, eventState.current_game_id]);

  const effectiveAuctionQuestions = useMemo(() => {
    return auctionQuestions && auctionQuestions.length > 0 ? auctionQuestions : SAMPLE_AUCTION_QUESTIONS;
  }, [auctionQuestions]);

  const activeAuctionQuestion = useMemo(() => {
    return effectiveAuctionQuestions.find((q) => q.id === eventState.current_auction_question_id) || effectiveAuctionQuestions[0] || null;
  }, [effectiveAuctionQuestions, eventState.current_auction_question_id]);

  // Computed Standings (Day 1, Day 2, and Overall)
  const standings = useMemo(() => {
    return teams.map((team) => {
      // Day 1 score from Day 1 score events
      const teamEvents = scoreEvents.filter((e) => e.team_id === team.id);
      
      const day1_score = teamEvents
        .filter((e) => e.day === 1 || !e.day)
        .reduce((sum, e) => sum + e.points, 0);

      // Day 2 score from Day 2 score events
      const day2_score = teamEvents
        .filter((e) => e.day === 2)
        .reduce((sum, e) => sum + e.points, 0);

      // Games played count (Day 1)
      const completedGameIds = new Set(
        gameParticipations
          .filter((p) => p.team_id === team.id && (p.status === "COMPLETED" || p.status === "PLAYING" || p.status === "REGISTERED"))
          .map((p) => p.game_id)
      );
      // Also add games with positive score events
      teamEvents.forEach((e) => {
        if (e.game_id && e.points > 0) completedGameIds.add(e.game_id);
      });
      const games_played = completedGameIds.size;

      // Questions won count (Day 2)
      const questions_won = auctionQuestions.filter(
        (q) => q.winning_team_id === team.id && (q.status === "SOLD" || q.status === "ANSWERED")
      ).length;

      // Game status mapping
      const game_statuses: Record<string, GameParticipationStatus> = {};
      games.forEach((g) => {
        const part = gameParticipations.find((p) => p.team_id === team.id && p.game_id === g.id);
        game_statuses[g.id] = part ? part.status : "NOT_SELECTED";
      });

      // Breakdown per game
      const game_breakdown: Record<string, number> = {};
      games.forEach((g) => {
        const pts = teamEvents.filter((e) => e.game_id === g.id).reduce((sum, e) => sum + e.points, 0);
        game_breakdown[g.id] = pts;
        game_breakdown[g.slug] = pts;
      });

      // Overall Score formula based on configurable event rules
      // total = (day1_score * day1_weight) + (day2_score * day2_weight) + (current_wallet * wallet_to_score_ratio)
      const d1w = eventState.day1_weight ?? 1.0;
      const d2w = eventState.day2_weight ?? 1.0;
      const wr = eventState.wallet_to_score_ratio ?? 0.0;
      const total_score = Math.round((day1_score * d1w) + (day2_score * d2w) + (team.current_wallet * wr));

      const lastEvt = teamEvents[0];
      const lastGame = lastEvt?.game_id ? games.find((g) => g.id === lastEvt.game_id) : undefined;

      return {
        team,
        rank: 1,
        day1_score,
        day2_score,
        total_score,
        current_wallet: team.current_wallet,
        games_played,
        questions_won,
        game_statuses,
        game_breakdown,
        last_score_delta: lastEvt?.points,
        last_score_type: lastEvt?.type,
        last_game_name: lastGame?.name,
        last_updated_at: lastEvt?.created_at,
        streak: 1,
      } as TeamStanding;
    });
  }, [teams, games, gameParticipations, scoreEvents, auctionQuestions, eventState]);

  // Overall Standings sorted by total_score descending
  const overallStandings = useMemo(() => {
    return [...standings]
      .sort((a, b) => {
        if (b.total_score !== a.total_score) return b.total_score - a.total_score;
        if (b.current_wallet !== a.current_wallet) return b.current_wallet - a.current_wallet;
        return a.team.name.localeCompare(b.team.name);
      })
      .map((s, idx) => ({ ...s, rank: idx + 1 }));
  }, [standings]);

  // Day 1 Standings sorted by day1_score descending
  const day1Standings = useMemo(() => {
    return [...standings]
      .sort((a, b) => {
        if (b.day1_score !== a.day1_score) return b.day1_score - a.day1_score;
        if (b.games_played !== a.games_played) return b.games_played - a.games_played;
        return b.current_wallet - a.current_wallet;
      })
      .map((s, idx) => ({ ...s, rank: idx + 1 }));
  }, [standings]);

  // Day 2 Standings sorted by day2_score descending
  const day2Standings = useMemo(() => {
    return [...standings]
      .sort((a, b) => {
        if (b.day2_score !== a.day2_score) return b.day2_score - a.day2_score;
        if (b.questions_won !== a.questions_won) return b.questions_won - a.questions_won;
        return b.current_wallet - a.current_wallet;
      })
      .map((s, idx) => ({ ...s, rank: idx + 1 }));
  }, [standings]);

  const currentLeader = useMemo(() => {
    if (eventState.current_day === 1) {
      return day1Standings[0] || null;
    } else if (eventState.current_day === 2) {
      return day2Standings[0] || overallStandings[0] || null;
    }
    return overallStandings[0] || null;
  }, [eventState.current_day, day1Standings, day2Standings, overallStandings]);

  // Score Transaction history view for tables & live feed
  const transactions = useMemo(() => {
    return scoreEvents.map((evt) => {
      const team = teams.find((t) => t.id === evt.team_id);
      const game = games.find((g) => g.id === evt.game_id);
      return {
        id: evt.id,
        time: new Date(evt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        team_id: evt.team_id,
        team_name: team ? team.name : "Unknown Squad",
        music_icon: team?.music_icon || "🎸",
        game_id: evt.game_id,
        game_name: game ? game.name : "Festival Arena",
        score_change: evt.points,
        type: evt.type,
        new_total: 0,
        logged_by: evt.created_by,
        reason: evt.reason,
        is_reversal: evt.type === "REVERSAL",
      };
    });
  }, [scoreEvents, teams, games]);

  // ==========================================
  // ACTIONS
  // ==========================================

  // 1. Create Team (Allocates 1500 starting budget + initial wallet transaction)
  const createTeam = async (name: string, captain: string, members: string[]) => {
    if (!name.trim()) return { success: false, error: "Team name is required." };
    if (teams.some((t) => t.name.toLowerCase() === name.trim().toLowerCase())) {
      return { success: false, error: "A squad with this name already exists in the registry." };
    }

    setIsProcessing(true);
    const id = generateUUID();
    const musicIcons = ["🎸", "🥁", "🎹", "🎺", "🎷", "🪕", "🎻", "🎧", "🎤", "⚡"];
    const avatarList = ["sword", "heart", "gem", "shield", "sparkles", "trophy", "star", "flame"];
    
    const newTeam: Team = {
      id,
      name: name.trim(),
      captain: captain.trim() || "Lead Architect",
      members: members.filter(Boolean),
      avatar: avatarList[Math.floor(Math.random() * avatarList.length)],
      music_icon: musicIcons[Math.floor(Math.random() * musicIcons.length)],
      starting_wallet: 1500,
      current_wallet: 1500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Mandatory Initial Allocation Transaction (+1500 pts)
    const initialTx: WalletTransaction = {
      id: generateUUID(),
      team_id: id,
      amount: 1500,
      transaction_type: "INITIAL_ALLOCATION",
      reference_type: "system",
      description: "Initial Team Budget Allocation (1500 PTS)",
      created_by: "Arena System",
      created_at: new Date().toISOString(),
    };

    const nextTeams = [...teams, newTeam];
    const nextTxs = [initialTx, ...walletTransactions];

    setTeams(nextTeams);
    setWalletTransactions(nextTxs);

    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(nextTeams));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(nextTxs));
    } catch {}

    broadcastSync({ teams: nextTeams, transactions: nextTxs });
    soundFx.playPowerUp();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        try {
          await supabase.from("teams").upsert(newTeam, { onConflict: "id" });
          await supabase.from("wallet_transactions").upsert(initialTx, { onConflict: "id" });
        } catch (e) {
          console.warn("Supabase insert team failed:", e);
        }
      }
    }

    setIsProcessing(false);
    return { success: true, team: newTeam };
  };

  // 2. Update Team
  const updateTeam = async (id: string, name: string, captain: string, members: string[]) => {
    const nextTeams = teams.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          name: name.trim() || t.name,
          captain: captain.trim() || t.captain,
          members: members.filter(Boolean),
          updated_at: new Date().toISOString(),
        };
      }
      return t;
    });

    setTeams(nextTeams);
    broadcastSync({ teams: nextTeams });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("teams").update({ name, captain, members }).eq("id", id);
      }
    }
    return true;
  };

  // 3. Delete Team
  const deleteTeam = async (id: string) => {
    const nextTeams = teams.filter((t) => t.id !== id);
    const nextParts = gameParticipations.filter((p) => p.team_id !== id);
    const nextTxs = walletTransactions.filter((tx) => tx.team_id !== id);
    const nextScores = scoreEvents.filter((se) => se.team_id !== id);

    setTeams(nextTeams);
    setGameParticipations(nextParts);
    setWalletTransactions(nextTxs);
    setScoreEvents(nextScores);
    broadcastSync({ teams: nextTeams, participations: nextParts, transactions: nextTxs, scores: nextScores });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("teams").delete().eq("id", id);
      }
    }
    return true;
  };

  // 4. Register for a Game (Checks wallet, deducts entry cost, prevents double spend)
  const registerForGame = async (teamId: string, gameId: string) => {
    const team = teams.find((t) => t.id === teamId);
    const game = games.find((g) => g.id === gameId);

    if (!team) return { success: false, error: "Squad not found." };
    if (!game) return { success: false, error: "Game attraction not found." };

    // Prevent double registration / double spending
    const existing = gameParticipations.find((p) => p.team_id === teamId && p.game_id === gameId);
    if (existing && existing.status !== "SKIPPED" && existing.status !== "NOT_SELECTED") {
      return { success: false, error: `Squad "${team.name}" is already registered for ${game.name}.` };
    }

    // Check wallet funds
    if (team.current_wallet < game.entry_cost) {
      soundFx.playPenalty();
      return { 
        success: false, 
        error: `INSUFFICIENT POINTS! ${game.name} requires ${game.entry_cost} points to enter, but ${team.name} only has ${team.current_wallet} points.` 
      };
    }

    setIsProcessing(true);

    // Deduct entry cost
    const updatedWallet = team.current_wallet - game.entry_cost;
    const nextTeams = teams.map((t) => t.id === teamId ? { ...t, current_wallet: updatedWallet } : t);

    // Wallet transaction record
    const entryTx: WalletTransaction = {
      id: generateUUID(),
      team_id: teamId,
      amount: -game.entry_cost,
      transaction_type: "GAME_ENTRY",
      reference_type: "game",
      reference_id: gameId,
      description: `Entry fee for ${game.name} (-${game.entry_cost} PTS)`,
      created_by: "Arena Organizer",
      created_at: new Date().toISOString(),
    };

    // Participation record
    const newParticipation: GameParticipation = {
      id: existing ? existing.id : generateUUID(),
      team_id: teamId,
      game_id: gameId,
      status: "REGISTERED",
      entry_cost: game.entry_cost,
      registered_at: new Date().toISOString(),
    };

    const nextParts = existing 
      ? gameParticipations.map((p) => p.id === existing.id ? newParticipation : p)
      : [...gameParticipations, newParticipation];

    const nextTxs = [entryTx, ...walletTransactions];

    setTeams(nextTeams);
    setGameParticipations(nextParts);
    setWalletTransactions(nextTxs);

    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(nextTeams));
      localStorage.setItem(STORAGE_KEY_PARTICIPATION, JSON.stringify(nextParts));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(nextTxs));
    } catch {}

    broadcastSync({ teams: nextTeams, participations: nextParts, transactions: nextTxs });
    soundFx.playScoreAdded();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        try {
          await supabase.from("teams").update({ current_wallet: updatedWallet }).eq("id", teamId);
          await supabase.from("wallet_transactions").upsert(entryTx, { onConflict: "id" });
          await supabase.from("game_participation").upsert(newParticipation, { onConflict: "team_id,game_id" });
        } catch (e) {
          console.warn("Supabase register game failed:", e);
        }
      }
    }

    setIsProcessing(false);
    return { success: true };
  };

  // 5. Skip Game (Zero cost, no penalty, saves points)
  const skipGame = async (teamId: string, gameId: string) => {
    const existing = gameParticipations.find((p) => p.team_id === teamId && p.game_id === gameId);
    
    const skipRecord: GameParticipation = {
      id: existing ? existing.id : `part-skip-${Date.now()}`,
      team_id: teamId,
      game_id: gameId,
      status: "SKIPPED",
      entry_cost: 0,
      registered_at: existing ? existing.registered_at : new Date().toISOString(),
    };

    const nextParts = existing
      ? gameParticipations.map((p) => p.id === existing.id ? skipRecord : p)
      : [...gameParticipations, skipRecord];

    setGameParticipations(nextParts);
    broadcastSync({ participations: nextParts });
    return { success: true };
  };

  // 6. Update Game Participation Status (PLAYING, COMPLETED, DISQUALIFIED)
  const updateGameParticipationStatus = async (teamId: string, gameId: string, status: GameParticipationStatus) => {
    const existing = gameParticipations.find((p) => p.team_id === teamId && p.game_id === gameId);
    const game = games.find((g) => g.id === gameId);

    const record: GameParticipation = {
      id: existing ? existing.id : `part-${Date.now()}`,
      team_id: teamId,
      game_id: gameId,
      status,
      entry_cost: existing ? existing.entry_cost : (game?.entry_cost || 0),
      registered_at: existing ? existing.registered_at : new Date().toISOString(),
      completed_at: (status === "COMPLETED" || status === "DISQUALIFIED") ? new Date().toISOString() : undefined,
    };

    const nextParts = existing
      ? gameParticipations.map((p) => p.id === existing.id ? record : p)
      : [...gameParticipations, record];

    setGameParticipations(nextParts);
    broadcastSync({ participations: nextParts });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("game_participation").upsert(record);
      }
    }
    return true;
  };

  // 7. Record Game Reward Points
  const recordGameReward = async (teamId: string, gameId: string, points: number, reason?: string) => {
    const team = teams.find((t) => t.id === teamId);
    const game = games.find((g) => g.id === gameId);
    if (!team) return { success: false, error: "Squad not found." };

    const scoreEvt: ScoreEvent = {
      id: generateUUID(),
      team_id: teamId,
      game_id: gameId,
      day: game?.day || 1,
      points,
      type: "SCORE",
      reason: reason || `${game ? game.name : "Game"} Performance Reward (+${points} PTS)`,
      created_by: "Arena Organizer",
      created_at: new Date().toISOString(),
    };

    let nextTeams = teams;
    let nextTxs = walletTransactions;

    // Check if configured to return reward points to wallet
    if (eventState.reward_destination === "wallet_only" || eventState.reward_destination === "both") {
      const updatedWallet = team.current_wallet + points;
      nextTeams = teams.map((t) => t.id === teamId ? { ...t, current_wallet: updatedWallet } : t);

      const rewardTx: WalletTransaction = {
        id: generateUUID(),
        team_id: teamId,
        amount: points,
        transaction_type: "GAME_REWARD",
        reference_type: "game",
        reference_id: gameId,
        description: `Game performance reward for ${game?.name || "Game"} (+${points} PTS)`,
        created_by: "Arena Organizer",
        created_at: new Date().toISOString(),
      };
      nextTxs = [rewardTx, ...walletTransactions];
    }

    const nextScores = [scoreEvt, ...scoreEvents];

    // Mark participation as COMPLETED
    const existing = gameParticipations.find((p) => p.team_id === teamId && p.game_id === gameId);
    const updatedPart: GameParticipation = {
      id: existing ? existing.id : generateUUID(),
      team_id: teamId,
      game_id: gameId,
      status: "COMPLETED",
      entry_cost: existing ? existing.entry_cost : (game?.entry_cost || 0),
      registered_at: existing ? existing.registered_at : new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };
    const nextParts = existing
      ? gameParticipations.map((p) => p.id === existing.id ? updatedPart : p)
      : [...gameParticipations, updatedPart];

    setTeams(nextTeams);
    setScoreEvents(nextScores);
    setWalletTransactions(nextTxs);
    setGameParticipations(nextParts);
    setLastBroadcastEvent(scoreEvt);
    soundFx.playScoreAdded();

    // 1. Guaranteed immediate local persistence
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(nextScores));
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(nextTeams));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(nextTxs));
      localStorage.setItem(STORAGE_KEY_PARTICIPATION, JSON.stringify(nextParts));
    } catch {}

    // 2. Broadcast across tabs & devices
    broadcastSync({
      teams: nextTeams,
      scores: nextScores,
      transactions: nextTxs,
      participations: nextParts,
    });

    // 3. Dual-write to /api/scores for serverless persistence
    try {
      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreEvt),
      }).catch(() => {});
    } catch {}

    // 4. Upsert to Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        try {
          await supabase.from("score_events").upsert(scoreEvt, { onConflict: "id" });
          await supabase.from("game_participation").upsert(updatedPart, { onConflict: "team_id,game_id" });
          if (eventState.reward_destination !== "score_only") {
            await supabase.from("teams").update({ current_wallet: team.current_wallet + points }).eq("id", teamId);
          }
        } catch (e) {
          console.warn("Supabase reward logging failed:", e);
        }
      }
    }

    return { success: true };
  };

  // 8. Manual Wallet Adjustment (Bonus or Penalty with full audit)
  const recordManualAdjustment = async (teamId: string, amount: number, reason: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return { success: false, error: "Squad not found." };

    if (team.current_wallet + amount < 0) {
      return { success: false, error: `Adjustment would result in negative wallet balance (${team.current_wallet + amount}). Not allowed.` };
    }

    const updatedWallet = team.current_wallet + amount;
    const nextTeams = teams.map((t) => t.id === teamId ? { ...t, current_wallet: updatedWallet } : t);

    const tx: WalletTransaction = {
      id: generateUUID(),
      team_id: teamId,
      amount,
      transaction_type: amount >= 0 ? "BONUS" : "PENALTY",
      reference_type: "manual",
      description: reason || `Manual Wallet Adjustment (${amount >= 0 ? "+" : ""}${amount} PTS)`,
      created_by: "Arena Administrator",
      created_at: new Date().toISOString(),
    };

    const nextTxs = [tx, ...walletTransactions];
    setTeams(nextTeams);
    setWalletTransactions(nextTxs);

    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(nextTeams));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(nextTxs));
    } catch {}

    broadcastSync({ teams: nextTeams, transactions: nextTxs });
    if (amount >= 0) soundFx.playPowerUp();
    else soundFx.playPenalty();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("teams").update({ current_wallet: updatedWallet }).eq("id", teamId);
        await supabase.from("wallet_transactions").upsert(tx, { onConflict: "id" });
      }
    }

    return { success: true };
  };

  // 9. Reversal of Wallet Transaction (Audit safe: creates inverse transaction)
  const reverseWalletTransaction = async (transactionId: string, reason?: string) => {
    const original = walletTransactions.find((tx) => tx.id === transactionId);
    if (!original) return { success: false, error: "Transaction not found." };
    if (original.is_reversed) return { success: false, error: "This transaction has already been reversed." };

    const team = teams.find((t) => t.id === original.team_id);
    if (!team) return { success: false, error: "Squad not found." };

    // Reverse amount: if original was -300, reversal is +300
    const reverseAmount = -original.amount;
    const updatedWallet = team.current_wallet + reverseAmount;

    if (updatedWallet < 0) {
      return { success: false, error: "Reversal would result in negative wallet. Action cancelled." };
    }

    const nextTeams = teams.map((t) => t.id === team.id ? { ...t, current_wallet: updatedWallet } : t);

    const reversalTx: WalletTransaction = {
      id: generateUUID(),
      team_id: team.id,
      amount: reverseAmount,
      transaction_type: "REVERSAL",
      reference_type: "reversal",
      reference_id: original.id,
      reversal_of_id: original.id,
      description: reason || `Reversal of [${original.description}] (${reverseAmount >= 0 ? "+" : ""}${reverseAmount} PTS)`,
      created_by: "Arena Administrator",
      created_at: new Date().toISOString(),
    };

    // Mark original transaction as is_reversed = true
    const nextTxs = [
      reversalTx,
      ...walletTransactions.map((tx) => tx.id === original.id ? { ...tx, is_reversed: true } : tx),
    ];

    setTeams(nextTeams);
    setWalletTransactions(nextTxs);

    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(nextTeams));
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(nextTxs));
    } catch {}

    broadcastSync({ teams: nextTeams, transactions: nextTxs });
    soundFx.playUndo();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("teams").update({ current_wallet: updatedWallet }).eq("id", team.id);
        await supabase.from("wallet_transactions").upsert(reversalTx, { onConflict: "id" });
        await supabase.from("wallet_transactions").update({ is_reversed: true }).eq("id", original.id);
      }
    }

    return { success: true };
  };

  // 10. Add Score Event (Direct manual / stage quick score entry)
  const addScore = async ({
    teamId,
    gameId,
    points,
    type = "SCORE",
    reason,
    day,
  }: {
    teamId: string;
    gameId: string | null;
    points: number;
    type?: ScoreEventType;
    reason?: string;
    day?: 1 | 2;
  }) => {
    setIsProcessing(true);
    const newEvt: ScoreEvent = {
      id: generateUUID(),
      team_id: teamId,
      game_id: gameId,
      day: day || eventState.current_day || 1,
      points,
      type,
      reason,
      created_by: "Arena Organizer",
      created_at: new Date().toISOString(),
    };

    const nextScores = [newEvt, ...scoreEvents];
    setScoreEvents(nextScores);
    setLastBroadcastEvent(newEvt);

    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(nextScores));
    } catch {}

    if (points >= 0) soundFx.playScoreAdded();
    else soundFx.playPenalty();

    broadcastSync({ scores: nextScores });

    try {
      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvt),
      }).catch(() => {});
    } catch {}

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        try {
          await supabase.from("score_events").upsert(newEvt, { onConflict: "id" });
        } catch (e) {
          console.warn("Supabase add score failed:", e);
        }
      }
    }

    setIsProcessing(false);
    return { success: true, event: newEvt };
  };

  // 11. Undo Score Event
  const undoScore = async (scoreEventId: string) => {
    const target = scoreEvents.find((e) => e.id === scoreEventId);
    if (!target) return { success: false, error: "Score event not found." };

    const reversalEvt: ScoreEvent = {
      id: generateUUID(),
      team_id: target.team_id,
      game_id: target.game_id,
      day: target.day,
      points: -target.points,
      type: "REVERSAL",
      reason: `Reversal of event ${target.id.slice(0, 8)} (${target.reason || "Score entry"})`,
      reversal_of_id: target.id,
      created_by: "Arena Organizer",
      created_at: new Date().toISOString(),
    };

    const nextScores = [reversalEvt, ...scoreEvents];
    setScoreEvents(nextScores);
    setLastBroadcastEvent(reversalEvt);

    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(nextScores));
    } catch {}

    soundFx.playUndo();
    broadcastSync({ scores: nextScores });

    try {
      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reversalEvt),
      }).catch(() => {});
    } catch {}

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        try {
          await supabase.from("score_events").upsert(reversalEvt, { onConflict: "id" });
        } catch (e) {
          console.warn("Supabase undo score failed:", e);
        }
      }
    }

    return { success: true };
  };

  // ==========================================
  // AUCTION ACTIONS (Day 2 Tech Auction)
  // ==========================================

  // Set active auction question
  const setCurrentAuctionQuestion = async (questionId: string | null) => {
    const nextState = { ...eventState, current_auction_question_id: questionId, updated_at: new Date().toISOString() };
    setEventState(nextState);
    broadcastSync({ eventState: nextState });

    if (questionId) {
      setAuctionQuestions((prev) => 
        prev.map((q) => q.id === questionId && q.status === "AVAILABLE" ? { ...q, status: "AUCTIONED" } : q)
      );
    }
  };

  // Place Auction Bid (Checks wallet balance safety)
  const placeAuctionBid = async (questionId: string, teamId: string, bidAmount: number) => {
    const team = teams.find((t) => t.id === teamId);
    const question = auctionQuestions.find((q) => q.id === questionId);

    if (!team) return { success: false, error: "Squad not found." };
    if (!question) return { success: false, error: "Auction question not found." };

    if (bidAmount > team.current_wallet) {
      soundFx.playPenalty();
      return { 
        success: false, 
        error: `INSUFFICIENT POINTS! ${team.name} has only ${team.current_wallet} points remaining in wallet, but bid was ${bidAmount}.` 
      };
    }

    if (bidAmount < question.base_price) {
      return { success: false, error: `Bid must be at least the base price of ${question.base_price} points.` };
    }

    soundFx.playScoreAdded();
    return { success: true };
  };

  // Sell Auction Question (Deducts winning bid, logs AUCTION_PURCHASE transaction)
  const sellAuctionQuestion = async (questionId: string, teamId: string, winningBid: number) => {
    const team = teams.find((t) => t.id === teamId);
    const question = auctionQuestions.find((q) => q.id === questionId);

    if (!team) return { success: false, error: "Squad not found." };
    if (!question) return { success: false, error: "Auction question not found." };

    if (question.status === "SOLD" || question.status === "ANSWERED") {
      return { success: false, error: `Question #${question.question_number} is already sold.` };
    }

    if (winningBid > team.current_wallet) {
      soundFx.playPenalty();
      return { 
        success: false, 
        error: `INSUFFICIENT POINTS! ${team.name} only has ${team.current_wallet} points to spend.` 
      };
    }

    setIsProcessing(true);

    // Deduct winning bid from team wallet
    const updatedWallet = team.current_wallet - winningBid;
    const nextTeams = teams.map((t) => t.id === teamId ? { ...t, current_wallet: updatedWallet } : t);

    // Create AUCTION_PURCHASE wallet transaction
    const purchaseTx: WalletTransaction = {
      id: `tx-auct-${Date.now()}`,
      team_id: teamId,
      amount: -winningBid,
      transaction_type: "AUCTION_PURCHASE",
      reference_type: "auction_question",
      reference_id: questionId,
      description: `Purchased Auction Question #${question.question_number} (-${winningBid} PTS)`,
      created_by: "Auctioneer Host",
      created_at: new Date().toISOString(),
    };

    const nextTxs = [purchaseTx, ...walletTransactions];

    // Update Question Status to SOLD
    const nextQuestions = auctionQuestions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          status: "SOLD" as const,
          winning_team_id: teamId,
          winning_bid: winningBid,
          answer_status: "PENDING" as const,
          updated_at: new Date().toISOString(),
        };
      }
      return q;
    });

    setTeams(nextTeams);
    setWalletTransactions(nextTxs);
    setAuctionQuestions(nextQuestions);
    soundFx.playPowerUp();

    broadcastSync({
      teams: nextTeams,
      transactions: nextTxs,
      auction: nextQuestions,
    });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        try {
          await supabase.from("teams").update({ current_wallet: updatedWallet }).eq("id", teamId);
          await supabase.from("wallet_transactions").insert(purchaseTx);
          await supabase.from("auction_questions").update({
            status: "SOLD",
            winning_team_id: teamId,
            winning_bid: winningBid,
            answer_status: "PENDING",
          }).eq("id", questionId);
        } catch (e) {
          console.warn("Supabase auction sale failed:", e);
        }
      }
    }

    setIsProcessing(false);
    return { success: true };
  };

  // Record Answer on Auction Question (CORRECT awards reward_points; INCORRECT applies configured penalty)
  const recordAuctionAnswer = async (questionId: string, answerStatus: "CORRECT" | "INCORRECT") => {
    const question = auctionQuestions.find((q) => q.id === questionId);
    if (!question) return { success: false, error: "Question not found." };
    if (!question.winning_team_id) return { success: false, error: "No winning squad assigned to this question." };

    const team = teams.find((t) => t.id === question.winning_team_id);
    if (!team) return { success: false, error: "Winning squad not found." };

    setIsProcessing(true);

    let nextScores = scoreEvents;
    let nextTeams = teams;
    let nextTxs = walletTransactions;

    if (answerStatus === "CORRECT") {
      // Award Day 2 Auction score
      const rewardPoints = question.reward_points;
      const scoreEvt: ScoreEvent = {
        id: `score-auct-${Date.now()}`,
        team_id: team.id,
        game_id: "00000000-0000-0000-0000-000000000201", // Tech Auction ID
        day: 2,
        points: rewardPoints,
        type: "SCORE",
        reason: `Correct answer on Auction Question #${question.question_number} (+${rewardPoints} PTS)`,
        created_by: "Auctioneer Host",
        created_at: new Date().toISOString(),
      };
      nextScores = [scoreEvt, ...scoreEvents];
      setLastBroadcastEvent(scoreEvt);
      soundFx.playScoreAdded();

      // If configured to reward wallet too
      if (eventState.reward_destination === "wallet_only" || eventState.reward_destination === "both") {
        const updatedWallet = team.current_wallet + rewardPoints;
        nextTeams = teams.map((t) => t.id === team.id ? { ...t, current_wallet: updatedWallet } : t);
        const rewardTx: WalletTransaction = {
          id: `tx-auct-reward-${Date.now()}`,
          team_id: team.id,
          amount: rewardPoints,
          transaction_type: "GAME_REWARD",
          reference_type: "auction_question",
          reference_id: questionId,
          description: `Auction Question #${question.question_number} Reward (+${rewardPoints} PTS)`,
          created_by: "Auctioneer Host",
          created_at: new Date().toISOString(),
        };
        nextTxs = [rewardTx, ...walletTransactions];
      }
    } else {
      // Incorrect answer: apply penalty if configured
      soundFx.playPenalty();
      if (eventState.auction_incorrect_penalty > 0) {
        const penalty = eventState.auction_incorrect_penalty;
        const penaltyEvt: ScoreEvent = {
          id: `score-auct-pen-${Date.now()}`,
          team_id: team.id,
          game_id: "00000000-0000-0000-0000-000000000201",
          day: 2,
          points: -penalty,
          type: "PENALTY",
          reason: `Incorrect answer penalty on Auction Question #${question.question_number} (-${penalty} PTS)`,
          created_by: "Auctioneer Host",
          created_at: new Date().toISOString(),
        };
        nextScores = [penaltyEvt, ...scoreEvents];
      }
    }

    // Mark question as ANSWERED
    const nextQuestions = auctionQuestions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          status: "ANSWERED" as const,
          answer_status: answerStatus,
          updated_at: new Date().toISOString(),
        };
      }
      return q;
    });

    setTeams(nextTeams);
    setScoreEvents(nextScores);
    setWalletTransactions(nextTxs);
    setAuctionQuestions(nextQuestions);

    broadcastSync({
      teams: nextTeams,
      scores: nextScores,
      transactions: nextTxs,
      auction: nextQuestions,
    });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("auction_questions").update({
          status: "ANSWERED",
          answer_status: answerStatus,
        }).eq("id", questionId);
      }
    }

    setIsProcessing(false);
    return { success: true };
  };

  // Skip Auction Question
  const skipAuctionQuestion = async (questionId: string) => {
    const nextQuestions = auctionQuestions.map((q) => 
      q.id === questionId ? { ...q, status: "SKIPPED" as const, updated_at: new Date().toISOString() } : q
    );
    setAuctionQuestions(nextQuestions);
    broadcastSync({ auction: nextQuestions });
    return { success: true };
  };

  // Reset Auction Question back to AVAILABLE
  const resetAuctionQuestion = async (questionId: string) => {
    const nextQuestions = auctionQuestions.map((q) => 
      q.id === questionId ? { 
        ...q, 
        status: "AVAILABLE" as const, 
        winning_team_id: null, 
        winning_bid: null, 
        answer_status: null,
        updated_at: new Date().toISOString() 
      } : q
    );
    setAuctionQuestions(nextQuestions);
    broadcastSync({ auction: nextQuestions });
    return { success: true };
  };

  // Update Auction Question
  const updateAuctionQuestion = async (questionId: string, updates: Partial<AuctionQuestion>) => {
    const nextQuestions = auctionQuestions.map((q) => 
      q.id === questionId ? { ...q, ...updates, updated_at: new Date().toISOString() } : q
    );
    setAuctionQuestions(nextQuestions);
    broadcastSync({ auction: nextQuestions });
    return true;
  };

  // ==========================================
  // EVENT STATE CONTROLS
  // ==========================================

  // Set Event Day (1 or 2)
  const setEventDay = async (day: 1 | 2) => {
    const nextState: EventState = {
      ...eventState,
      current_day: day,
      current_game_id: day === 1 
        ? "00000000-0000-0000-0000-000000000101" 
        : "00000000-0000-0000-0000-000000000201",
      active_round: day === 1 ? "Day 1: Arena Attractions" : "Day 2: Grand Tech Auction",
      updated_at: new Date().toISOString(),
    };
    setEventState(nextState);
    broadcastSync({ eventState: nextState });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("event_state").update(nextState).eq("id", 1);
      }
    }
  };

  // Set Event Status (NOT_STARTED, LIVE, PAUSED, BETWEEN_GAMES, FINISHED)
  const setEventStatus = async (status: EventStatus) => {
    const nextState: EventState = {
      ...eventState,
      event_status: status,
      is_live: status === "LIVE",
      updated_at: new Date().toISOString(),
    };
    setEventState(nextState);
    broadcastSync({ eventState: nextState });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("event_state").update({ event_status: status, is_live: status === "LIVE" }).eq("id", 1);
      }
    }
  };

  // Set Current Live Game
  const setCurrentGame = async (gameId: string | null) => {
    const nextState = {
      ...eventState,
      current_game_id: gameId,
      updated_at: new Date().toISOString(),
    };
    setEventState(nextState);
    broadcastSync({ eventState: nextState });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("event_state").update({ current_game_id: gameId }).eq("id", 1);
      }
    }
  };

  // Update Event Config (Weights, scoring rules, announcements)
  const updateEventConfig = async (updates: Partial<EventState>) => {
    const nextState = {
      ...eventState,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    setEventState(nextState);
    broadcastSync({ eventState: nextState });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("event_state").update(nextState).eq("id", 1);
      }
    }
  };

  // Update Game Configuration (Difficulty, entry cost, active, description)
  const updateGame = async (gameId: string, updates: Partial<Game>) => {
    const nextGames = games.map((g) => g.id === gameId ? { ...g, ...updates, updated_at: new Date().toISOString() } : g);
    setGames(nextGames);
    broadcastSync({ games: nextGames });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("games").update(updates).eq("id", gameId);
      }
    }
    return true;
  };

  // Freeze HUD
  const toggleHudFreeze = async () => {
    const nextState = {
      ...eventState,
      is_hud_frozen: !eventState.is_hud_frozen,
      updated_at: new Date().toISOString(),
    };
    setEventState(nextState);
    broadcastSync({ eventState: nextState });
  };

  // Reset Scores (Keep teams and starting wallets, reset score events)
  const resetScores = async () => {
    setScoreEvents([]);
    broadcastSync({ scores: [] });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("score_events").delete().neq("id", "none");
      }
    }
  };

  // Reset Event (Restore wallets to 1500, clear participations & score events)
  const resetEvent = async () => {
    const restoredTeams = teams.map((t) => ({ ...t, starting_wallet: 1500, current_wallet: 1500 }));
    const resetQuestions = SAMPLE_AUCTION_QUESTIONS;
    
    // Create initial allocation transactions for each team
    const initialTxs: WalletTransaction[] = restoredTeams.map((t) => ({
      id: `tx-reset-${t.id}-${Date.now()}`,
      team_id: t.id,
      amount: 1500,
      transaction_type: "INITIAL_ALLOCATION",
      reference_type: "system",
      description: "Tournament Reset Allocation (1500 PTS)",
      created_by: "Arena System",
      created_at: new Date().toISOString(),
    }));

    setTeams(restoredTeams);
    setScoreEvents([]);
    setGameParticipations([]);
    setWalletTransactions(initialTxs);
    setAuctionQuestions(resetQuestions);

    broadcastSync({
      teams: restoredTeams,
      scores: [],
      participations: [],
      transactions: initialTxs,
      auction: resetQuestions,
    });
  };

  // Clear all teams completely
  const clearAllTeams = async () => {
    setTeams([]);
    setScoreEvents([]);
    setGameParticipations([]);
    setWalletTransactions([]);
    broadcastSync({
      teams: [],
      scores: [],
      participations: [],
      transactions: [],
    });

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        await supabase.from("teams").delete().neq("id", "none");
        await supabase.from("score_events").delete().neq("id", "none");
        await supabase.from("wallet_transactions").delete().neq("id", "none");
        await supabase.from("game_participation").delete().neq("id", "none");
      }
    }
  };

  // Simulate live score for demo testing
  const simulateLiveScore = () => {
    if (teams.length === 0) return;
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    const randomGame = day1Games[Math.floor(Math.random() * day1Games.length)] || games[0];
    const points = [50, 100, 150, 200, 250][Math.floor(Math.random() * 5)];
    addScore({
      teamId: randomTeam.id,
      gameId: randomGame?.id || null,
      points,
      type: "SCORE",
      reason: `Live Stage Performance at ${randomGame?.name}`,
      day: eventState.current_day,
    });
  };

  return (
    <ArenaContext.Provider
      value={{
        teams,
        games,
        activeGames,
        day1Games,
        day2Games,
        gameParticipations,
        walletTransactions,
        scoreEvents,
        auctionQuestions,
        activeAuctionQuestion,
        eventState,
        standings,
        day1Standings,
        day2Standings,
        overallStandings,
        transactions,
        currentLeader,
        activeGame,
        realtimeStatus,
        realtimeTransport,
        activeDeviceCount,
        isProcessing,
        lastBroadcastEvent,
        createTeam,
        updateTeam,
        deleteTeam,
        registerForGame,
        skipGame,
        updateGameParticipationStatus,
        recordGameReward,
        recordManualAdjustment,
        reverseWalletTransaction,
        addScore,
        undoScore,
        setCurrentAuctionQuestion,
        placeAuctionBid,
        sellAuctionQuestion,
        recordAuctionAnswer,
        skipAuctionQuestion,
        resetAuctionQuestion,
        updateAuctionQuestion,
        setEventDay,
        setEventStatus,
        setCurrentGame,
        updateEventConfig,
        updateGame,
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
