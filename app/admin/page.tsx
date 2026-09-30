"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Terminal, 
  ArrowLeft, 
  Tv, 
  ExternalLink, 
  Users, 
  Trophy, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Check, 
  RotateCcw, 
  Flame, 
  Sparkles, 
  LogOut, 
  Edit3, 
  Trash2, 
  Grid, 
  PenTool, 
  Clock, 
  Bot, 
  Zap, 
  Radio, 
  Sliders, 
  CheckCircle2, 
  Star, 
  Search,
  Wallet,
  Coins,
  History,
  Tag,
  DollarSign,
  Gavel,
  ShieldCheck,
  XCircle,
  Play,
  Pause,
  Layers,
  ChevronRight,
  Info
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";
import { Game, Team, ScoreEventType, GameParticipationStatus, AuctionQuestion, EventStatus } from "@/types/arena";
import { soundFx } from "@/lib/audio/sound-fx";
import { PixelBunting } from "@/components/PixelBunting";
import { FestoonLights } from "@/components/FestoonLights";
import confetti from "canvas-confetti";

export default function AdminFestivalControlBooth() {
  const router = useRouter();
  const {
    teams,
    games,
    day1Games,
    day2Games,
    activeGames,
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
    currentLeader,
    activeGame,
    realtimeStatus,
    realtimeTransport,
    activeDeviceCount,
    isProcessing,
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
  } = useArena();

  // Authentication check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("gdgoc_admin_session");
      if (!session) {
        router.push("/admin/login");
      }
    }
  }, [router]);

  // Sidebar active view state
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>("control-booth");

  // Selected Day 1 Game & Team
  const [selectedGameId, setSelectedGameId] = useState<string>(
    day1Games[0]?.id || games[0]?.id || ""
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    teams[0]?.id || ""
  );

  // Sync selectedGameId if day1Games changes
  useEffect(() => {
    if (day1Games.length > 0 && !day1Games.some((g) => g.id === selectedGameId)) {
      setSelectedGameId(day1Games[0].id);
    }
  }, [day1Games, selectedGameId]);

  // Pre-select game station from URL query parameter ?game=<id_or_slug>
  useEffect(() => {
    if (typeof window !== "undefined" && games.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get("game");
      if (gameParam) {
        const found = games.find(
          (g) =>
            g.id === gameParam ||
            g.slug.toLowerCase() === gameParam.toLowerCase() ||
            g.name.toLowerCase().includes(gameParam.toLowerCase())
        );
        if (found) {
          setSelectedGameId(found.id);
        }
      }
    }
  }, [games]);

  // Sync selectedTeamId if teams changes
  useEffect(() => {
    if (teams.length > 0 && !teams.some((t) => t.id === selectedTeamId)) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const currentSelectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
  const currentSelectedGame = games.find((g) => g.id === selectedGameId) || day1Games[0];
  const currentParticipation = gameParticipations.find(
    (p) => p.team_id === currentSelectedTeam?.id && p.game_id === currentSelectedGame?.id
  );

  // Score Entry state
  const [pointsInput, setPointsInput] = useState<number>(100);
  const [scoreReason, setScoreReason] = useState<string>("");
  const [rewardPointsInput, setRewardPointsInput] = useState<number>(250);
  const [confirmBanner, setConfirmBanner] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Manual Wallet Adjustment state
  const [walletAdjustAmount, setWalletAdjustAmount] = useState<number>(100);
  const [walletAdjustReason, setWalletAdjustReason] = useState<string>("");

  // Day 2 Live Auction State
  const [selectedAuctionQId, setSelectedAuctionQId] = useState<string>(
    auctionQuestions[0]?.id || "q-001"
  );
  const [auctionBidderTeamId, setAuctionBidderTeamId] = useState<string>(
    teams[0]?.id || ""
  );
  const currentAuctionQ = auctionQuestions.find((q) => q.id === selectedAuctionQId) || auctionQuestions[0];
  const [currentBidAmount, setCurrentBidAmount] = useState<number>(
    currentAuctionQ?.base_price || 100
  );

  useEffect(() => {
    if (currentAuctionQ) {
      setCurrentBidAmount(currentAuctionQ.winning_bid || currentAuctionQ.base_price || 100);
    }
  }, [selectedAuctionQId, currentAuctionQ]);

  // Team Registration Form State (Defaults to 1500 automatic budget!)
  const [newTeamName, setNewTeamName] = useState("");
  const [newCaptain, setNewCaptain] = useState("");
  const [newRoster, setNewRoster] = useState("");

  // Inspect Team Modal / Drawer
  const [inspectTeamId, setInspectTeamId] = useState<string | null>(null);
  const inspectedTeam = teams.find((t) => t.id === inspectTeamId);
  const inspectedTeamStanding = standings.find((s) => s.team.id === inspectTeamId);
  const inspectedTeamTransactions = useMemo(() => {
    if (!inspectTeamId) return [];
    return walletTransactions
      .filter((tx) => tx.team_id === inspectTeamId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [inspectTeamId, walletTransactions]);

  // Question Search in Question Bank
  const [questionSearch, setQuestionSearch] = useState("");
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState("all");

  // Danger reset modal
  const [showResetModal, setShowResetModal] = useState<"scores" | "tournament" | "all" | null>(null);

  // Banner helper
  const showBanner = (text: string, type: "success" | "error" | "info" = "success") => {
    setConfirmBanner({ text, type });
    setTimeout(() => setConfirmBanner(null), 5000);
  };

  // ==========================================
  // HANDLERS
  // ==========================================

  // Register for Game
  const handleRegisterGame = async () => {
    if (!currentSelectedTeam || !currentSelectedGame) return;
    const res = await registerForGame(currentSelectedTeam.id, currentSelectedGame.id);
    if (res.success) {
      showBanner(`Registered ${currentSelectedTeam.name} for ${currentSelectedGame.name}! Entry fee of ${currentSelectedGame.entry_cost} deducted.`, "success");
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      showBanner(res.error || "Failed to register team.", "error");
    }
  };

  // Skip Game
  const handleSkipGame = async () => {
    if (!currentSelectedTeam || !currentSelectedGame) return;
    const res = await skipGame(currentSelectedTeam.id, currentSelectedGame.id);
    if (res.success) {
      showBanner(`${currentSelectedTeam.name} skipped ${currentSelectedGame.name}. 0 points deducted; budget saved.`, "info");
    }
  };

  // Record Game Reward
  const handleRecordGameReward = async () => {
    if (!currentSelectedTeam || !currentSelectedGame) return;
    const res = await recordGameReward(
      currentSelectedTeam.id,
      currentSelectedGame.id,
      rewardPointsInput,
      scoreReason || `${currentSelectedGame.name} Performance Reward`
    );
    if (res.success) {
      showBanner(`Awarded +${rewardPointsInput} points to ${currentSelectedTeam.name} for ${currentSelectedGame.name}!`, "success");
      setScoreReason("");
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } else {
      showBanner(res.error || "Failed to award points.", "error");
    }
  };

  // Manual Adjust Wallet
  const handleManualWalletAdjust = async (amount: number) => {
    if (!currentSelectedTeam) return;
    const res = await recordManualAdjustment(
      currentSelectedTeam.id,
      amount,
      walletAdjustReason || (amount >= 0 ? "Organizer Bonus" : "Organizer Penalty")
    );
    if (res.success) {
      showBanner(`Wallet adjusted by ${amount >= 0 ? "+" : ""}${amount} PTS for ${currentSelectedTeam.name}.`, "success");
      setWalletAdjustReason("");
    } else {
      showBanner(res.error || "Failed to adjust wallet.", "error");
    }
  };

  // Reverse Transaction
  const handleReverseTransaction = async (txId: string) => {
    const res = await reverseWalletTransaction(txId);
    if (res.success) {
      showBanner("Transaction successfully reversed! Wallet balance updated and reversal audited.", "success");
    } else {
      showBanner(res.error || "Failed to reverse transaction.", "error");
    }
  };

  // Auction: Sell to bidder
  const handleSellAuctionQuestion = async () => {
    if (!currentAuctionQ || !auctionBidderTeamId) return;
    const team = teams.find((t) => t.id === auctionBidderTeamId);
    if (!team) return;

    const res = await sellAuctionQuestion(currentAuctionQ.id, team.id, currentBidAmount);
    if (res.success) {
      showBanner(`Question #${currentAuctionQ.question_number} sold to ${team.name} for ${currentBidAmount} points!`, "success");
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      } catch {}
    } else {
      showBanner(res.error || "Failed to complete auction sale.", "error");
    }
  };

  // Auction: Record answer
  const handleGradeAuctionAnswer = async (status: "CORRECT" | "INCORRECT") => {
    if (!currentAuctionQ) return;
    const res = await recordAuctionAnswer(currentAuctionQ.id, status);
    if (res.success) {
      if (status === "CORRECT") {
        showBanner(`CORRECT! Awarded +${currentAuctionQ.reward_points} reward points to winning team!`, "success");
        try {
          confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
        } catch {}
      } else {
        showBanner(`INCORRECT recorded for Question #${currentAuctionQ.question_number}.`, "info");
      }
    } else {
      showBanner(res.error || "Failed to record answer.", "error");
    }
  };

  // Create Team Submit
  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const rosterArray = newRoster
      .split(/[\n,]+/)
      .map((m) => m.trim())
      .filter(Boolean);

    const res = await createTeam(newTeamName, newCaptain, rosterArray);
    if (res.success) {
      showBanner(`Squad "${newTeamName}" enrolled with 1500 spendable starting budget!`, "success");
      setNewTeamName("");
      setNewCaptain("");
      setNewRoster("");
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } else {
      showBanner(res.error || "Could not enroll squad.", "error");
    }
  };

  // Filtered Auction Questions for Question Bank Tab
  const filteredAuctionQuestions = useMemo(() => {
    return auctionQuestions.filter((q) => {
      const matchCat = questionCategoryFilter === "all" || q.category === questionCategoryFilter;
      const matchSearch = questionSearch === "" || 
        q.question_text.toLowerCase().includes(questionSearch.toLowerCase()) ||
        q.category.toLowerCase().includes(questionSearch.toLowerCase()) ||
        String(q.question_number).includes(questionSearch);
      return matchCat && matchSearch;
    });
  }, [auctionQuestions, questionCategoryFilter, questionSearch]);

  const categories = useMemo(() => {
    const cats = new Set(auctionQuestions.map((q) => q.category));
    return Array.from(cats);
  }, [auctionQuestions]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans selection:bg-fest-yellow selection:text-black">
      {/* Top Banner Lights */}
      <FestoonLights />
      <PixelBunting />

      {/* ========================================================================= */}
      {/* TOP EVENT CONTROL & STATUS BAR                                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b-2 border-white/20 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand & Nav */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 text-xs font-grotesk uppercase font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO PUBLIC FESTIVAL
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-anton text-2xl text-fest-yellow tracking-wider">PIXELPALOOZA</span>
              <span className="font-grotesk text-xs bg-fest-coral text-white font-black px-2 py-0.5 rounded">
                ADMIN ARENA 2.0
              </span>
            </div>
          </div>

          {/* Realtime Day & Event State Switchers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Day 1 / Day 2 Selector */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => setEventDay(1)}
                className={`px-3 py-1.5 rounded-lg font-anton text-xs uppercase tracking-wider transition-all ${
                  eventState.current_day === 1
                    ? "bg-fest-yellow text-black shadow-[0_0_12px_rgba(255,221,0,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                DAY 1 (5 GAMES)
              </button>
              <button
                onClick={() => setEventDay(2)}
                className={`px-3 py-1.5 rounded-lg font-anton text-xs uppercase tracking-wider transition-all ${
                  eventState.current_day === 2
                    ? "bg-fest-cyan text-black shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                DAY 2 (THE AUCTION)
              </button>
            </div>

            {/* Event Status Dropdown */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-grotesk text-xs uppercase font-bold text-slate-300">STATUS:</span>
              <select
                value={eventState.event_status}
                onChange={(e) => setEventStatus(e.target.value as EventStatus)}
                className="bg-black/60 text-white font-grotesk text-xs uppercase font-black px-2 py-1 rounded border border-slate-700 focus:outline-none focus:border-fest-yellow"
              >
                <option value="NOT_STARTED">NOT STARTED</option>
                <option value="LIVE">LIVE ARENA</option>
                <option value="BETWEEN_GAMES">BETWEEN GAMES</option>
                <option value="PAUSED">PAUSED</option>
                <option value="FINISHED">FINISHED (FINAL RESULTS)</option>
              </select>
            </div>

            {/* Realtime WebSocket Sync Status Pill */}
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/60 px-3 py-1.5 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-grotesk text-xs uppercase font-black text-emerald-400">
                {realtimeTransport === "websocket"
                  ? "WEBSOCKET LIVE"
                  : realtimeTransport === "supabase"
                  ? "SUPABASE REALTIME"
                  : "LIVE SYNC ACTIVE"}
              </span>
              {activeDeviceCount > 1 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {activeDeviceCount} DEVICES
                </span>
              )}
            </div>

            {/* Stage HUD link */}
            <Link
              href="/display"
              target="_blank"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-grotesk text-xs uppercase font-bold rounded-lg border border-purple-400 flex items-center gap-1.5 transition-colors shadow-[2px_2px_0px_#000]"
            >
              <Tv className="w-3.5 h-3.5" />
              STAGE HUD ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Multi-Device Game Station Quick Bar for Referees */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fest-yellow animate-ping" />
            <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-wider">
              REFEREE STATION:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {games
              .filter((g) => g.active)
              .map((g) => {
                const isSelected = g.id === selectedGameId;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGameId(g.id);
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `/admin?game=${g.slug}`);
                      }
                    }}
                    className={`px-3 py-1 rounded-xl font-anton text-xs uppercase tracking-wider whitespace-nowrap border transition-all ${
                      isSelected
                        ? "bg-fest-yellow text-black border-fest-yellow shadow-[0_0_10px_rgba(255,221,0,0.4)] scale-105"
                        : "bg-black/60 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    <span>{g.name}</span>
                    <span className="ml-1.5 opacity-80 font-mono text-[10px]">
                      ({g.entry_cost} pts)
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Confirmation / Alert Banner */}
      {confirmBanner && (
        <div
          className={`px-4 py-3 text-center font-grotesk text-sm font-bold uppercase tracking-wider transition-all animate-bounce ${
            confirmBanner.type === "success"
              ? "bg-emerald-500 text-black border-b-2 border-black"
              : confirmBanner.type === "error"
              ? "bg-fest-coral text-white border-b-2 border-black"
              : "bg-fest-yellow text-black border-b-2 border-black"
          }`}
        >
          {confirmBanner.text}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN ADMIN WORKSPACE                                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-slate-800 pb-3">
          {[
            { id: "control-booth", label: "🎮 LIVE CONTROL BOOTH", icon: Zap },
            { id: "squads-wallets", label: "💰 SQUADS & 1500 WALLETS", icon: Wallet },
            { id: "auction-bank", label: "🏛️ TECH AUCTION BANK (60 Qs)", icon: Gavel },
            { id: "economics", label: "⚙️ GAME ECONOMICS & RULES", icon: Sliders },
            { id: "audit-trail", label: "📜 AUDIT TRANSACTIONS LEDGER", icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-anton text-sm uppercase tracking-wider border-2 transition-all ${
                  active
                    ? "bg-fest-yellow text-black border-fest-yellow shadow-[4px_4px_0px_#000]"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: LIVE CONTROL BOOTH (Day 1 Physical Games & Day 2 Tech Auction)      */}
        {/* ========================================================================= */}
        {activeSidebarTab === "control-booth" && (
          <div className="flex flex-col gap-8">
            
            {/* Quick Announcement Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border-2 border-white/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-fest-yellow text-black rounded-xl font-anton text-lg">
                  DAY {eventState.current_day}
                </span>
                <div>
                  <h3 className="font-anton text-xl uppercase tracking-wide text-white">
                    {eventState.current_day === 1 ? "DAY 1: 5 PHYSICAL ARENA ATTRACTIONS" : "DAY 2: THE TECH AUCTION CLIMAX"}
                  </h3>
                  <p className="font-sans text-xs text-slate-300">
                    {eventState.current_day === 1
                      ? "Balloon + Cup Tower • GDG Logo Puzzle • Tech Pictionary • Tech Tambola • AI or Human? (Entry costs check wallet)"
                      : "50–70 curated questions. Bids deduct spendable wallet. Correct answers award massive tournament score points."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-grotesk text-xs uppercase font-bold text-slate-400">CURRENT LIVE ATTRACTION:</span>
                <select
                  value={eventState.current_game_id || ""}
                  onChange={(e) => setCurrentGame(e.target.value)}
                  className="bg-black text-fest-yellow font-anton text-sm uppercase px-3 py-1.5 rounded-xl border border-fest-yellow/40 focus:outline-none"
                >
                  {games.filter((g) => g.active).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Day {g.day})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DAY 1 CONTROL DECK */}
            {eventState.current_day === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Squad & Game Selector */}
                <div className="lg:col-span-5 flex flex-col gap-5 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest">
                      1. SELECT SQUAD & GAME
                    </span>
                    <span className="text-xs font-grotesk px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                      DAY 1 ARENA
                    </span>
                  </div>

                  {/* Team Selector */}
                  <div>
                    <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-2">
                      SELECT PARTICIPATING SQUAD:
                    </label>
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full bg-black text-white font-anton text-lg uppercase px-4 py-3 rounded-2xl border-2 border-slate-700 focus:border-fest-yellow focus:outline-none"
                    >
                      {teams.length === 0 ? (
                        <option value="">No squads registered yet</option>
                      ) : (
                        teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} (Wallet: {t.current_wallet} pts)
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Squad Wallet Pill */}
                  {currentSelectedTeam && (
                    <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">
                          AVAILABLE EVENT WALLET
                        </span>
                        <span className="font-anton text-3xl text-fest-yellow">
                          {currentSelectedTeam.current_wallet}
                          <span className="text-sm font-grotesk text-slate-400 ml-1">/ 1500 PTS</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setInspectTeamId(currentSelectedTeam.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-grotesk uppercase font-bold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        AUDIT LEDGER
                      </button>
                    </div>
                  )}

                  {/* Game Selector (The 5 Day-1 Games) */}
                  <div>
                    <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-2">
                      SELECT DAY 1 ATTRACTION (5 GAMES):
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {day1Games.map((g) => {
                        const selected = selectedGameId === g.id;
                        const part = gameParticipations.find(
                          (p) => p.team_id === currentSelectedTeam?.id && p.game_id === g.id
                        );
                        return (
                          <button
                            key={g.id}
                            onClick={() => setSelectedGameId(g.id)}
                            className={`p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                              selected
                                ? "bg-fest-yellow/10 border-fest-yellow shadow-[2px_2px_0px_#000]"
                                : "bg-black/40 border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-anton text-base uppercase ${selected ? "text-fest-yellow" : "text-white"}`}>
                                  {g.name}
                                </span>
                                <span className={`text-[10px] font-grotesk uppercase font-black px-1.5 py-0.5 rounded ${
                                  g.difficulty === "Easy" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                                  g.difficulty === "Medium" ? "bg-amber-950 text-amber-400 border border-amber-800" :
                                  "bg-red-950 text-red-400 border border-red-800"
                                }`}>
                                  {g.difficulty}
                                </span>
                              </div>
                              <span className="font-sans text-xs text-slate-400 block mt-0.5">
                                Entry Cost: <strong className="text-fest-cyan">{g.entry_cost} PTS</strong>
                              </span>
                            </div>

                            {/* Status badge for selected team */}
                            <span className={`text-[10px] font-grotesk uppercase font-black px-2 py-1 rounded border ${
                              !part || part.status === "NOT_SELECTED" ? "bg-slate-900 text-slate-500 border-slate-800" :
                              part.status === "REGISTERED" ? "bg-blue-950 text-blue-300 border-blue-800" :
                              part.status === "PLAYING" ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse" :
                              part.status === "COMPLETED" ? "bg-emerald-950 text-emerald-400 border-emerald-800" :
                              "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                              {part ? part.status : "NOT ENTERED"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Actions Deck (Game Entry, Skip, Reward Points, Status) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Strategic Action 1: Game Registration & Skip */}
                  <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
                    <span className="font-grotesk text-xs uppercase font-black text-fest-cyan tracking-widest block mb-4">
                      2. SQUAD PARTICIPATION ACTION (OPTIONAL PARTICIPATION)
                    </span>

                    <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-grotesk text-xs text-slate-400 uppercase font-bold">ATTRACTION:</span>
                        <span className="font-anton text-lg text-white uppercase">{currentSelectedGame?.name}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-grotesk text-xs text-slate-400 uppercase font-bold">REQUIRED ENTRY COST:</span>
                        <span className="font-anton text-xl text-fest-coral">-{currentSelectedGame?.entry_cost} PTS</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-grotesk text-xs text-slate-400 uppercase font-bold">SQUAD CURRENT BALANCE:</span>
                        <span className="font-anton text-xl text-fest-yellow">{currentSelectedTeam?.current_wallet || 0} PTS</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <span className="font-grotesk text-slate-400 uppercase font-bold">CURRENT STATUS:</span>
                        <span className="font-grotesk uppercase font-black text-white px-2 py-0.5 bg-slate-800 rounded">
                          {currentParticipation?.status || "NOT ENTERED"}
                        </span>
                      </div>
                    </div>

                    {/* Registration / Skip Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={handleRegisterGame}
                        disabled={
                          !currentSelectedTeam || 
                          (currentParticipation && currentParticipation.status !== "NOT_SELECTED" && currentParticipation.status !== "SKIPPED") ||
                          (currentSelectedTeam && currentSelectedTeam.current_wallet < (currentSelectedGame?.entry_cost || 0))
                        }
                        className="py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-anton text-base uppercase tracking-wider rounded-2xl border-2 border-black retro-shadow-black transition-all active:translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        CONFIRM ENTRY (-{currentSelectedGame?.entry_cost} PTS)
                      </button>

                      <button
                        onClick={handleSkipGame}
                        disabled={!currentSelectedTeam}
                        className="py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-anton text-base uppercase tracking-wider rounded-2xl border-2 border-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        SKIP / DON&apos;T PLAY (0 PTS)
                      </button>
                    </div>

                    {/* Participation Status Override Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <span className="font-grotesk text-[10px] uppercase font-bold text-slate-500">STAGE STATUS:</span>
                      {(["PLAYING", "COMPLETED", "DISQUALIFIED"] as GameParticipationStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            if (currentSelectedTeam && currentSelectedGame) {
                              updateGameParticipationStatus(currentSelectedTeam.id, currentSelectedGame.id, status);
                              showBanner(`Status updated to ${status}`, "info");
                            }
                          }}
                          className={`text-xs font-grotesk uppercase font-bold px-3 py-1 rounded-lg border transition-colors ${
                            currentParticipation?.status === status
                              ? "bg-white text-black border-white"
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                          }`}
                        >
                          MARK {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Action 2: Reward Performance Score */}
                  <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
                    <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block mb-4">
                      3. RECORD GAME PERFORMANCE SCORE / REWARD
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-2">
                          REWARD POINTS TO AWARD:
                        </label>
                        <input
                          type="number"
                          value={rewardPointsInput}
                          onChange={(e) => setRewardPointsInput(parseInt(e.target.value) || 0)}
                          className="w-full bg-black text-fest-yellow font-anton text-2xl px-4 py-2.5 rounded-xl border-2 border-slate-700 focus:outline-none focus:border-fest-yellow"
                        />
                      </div>

                      <div>
                        <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-2">
                          PERFORMANCE REASON / NOTES:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1st Place Tower Completion, Line Claim..."
                          value={scoreReason}
                          onChange={(e) => setScoreReason(e.target.value)}
                          className="w-full bg-black text-white font-sans text-sm px-4 py-3 rounded-xl border-2 border-slate-700 focus:outline-none focus:border-fest-yellow"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      <span className="font-grotesk text-[10px] uppercase font-bold text-slate-500">QUICK PRESETS:</span>
                      {[100, 200, 250, 300, 400, 500].map((pts) => (
                        <button
                          key={pts}
                          onClick={() => setRewardPointsInput(pts)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-fest-yellow hover:text-black text-xs font-anton uppercase rounded-lg border border-slate-700 transition-colors"
                        >
                          +{pts}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleRecordGameReward}
                      disabled={!currentSelectedTeam || rewardPointsInput <= 0}
                      className="w-full py-4 bg-fest-yellow hover:bg-fest-gold text-black font-anton text-lg uppercase tracking-wider rounded-2xl border-2 border-black retro-shadow-black transition-all flex items-center justify-center gap-2"
                    >
                      <Trophy className="w-5 h-5" />
                      RECORD GAME PERFORMANCE (+{rewardPointsInput} PTS)
                    </button>
                  </div>

                  {/* Strategic Action 3: Manual Wallet Adjustment (Audited Bonus/Penalty) */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
                    <span className="font-grotesk text-xs uppercase font-black text-slate-400 tracking-widest block mb-3">
                      MANUAL WALLET ADJUSTMENT (DISCRETIONARY BONUS OR PENALTY)
                    </span>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Reason for adjustment (required for audit)"
                        value={walletAdjustReason}
                        onChange={(e) => setWalletAdjustReason(e.target.value)}
                        className="flex-1 min-w-[200px] bg-black text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                      />
                      <button
                        onClick={() => handleManualWalletAdjust(100)}
                        className="px-3 py-2 bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 text-xs font-anton uppercase rounded-xl transition-colors"
                      >
                        +100 BONUS
                      </button>
                      <button
                        onClick={() => handleManualWalletAdjust(50)}
                        className="px-3 py-2 bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 text-xs font-anton uppercase rounded-xl transition-colors"
                      >
                        +50 BONUS
                      </button>
                      <button
                        onClick={() => handleManualWalletAdjust(-50)}
                        className="px-3 py-2 bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 text-xs font-anton uppercase rounded-xl transition-colors"
                      >
                        -50 PENALTY
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* DAY 2 THE TECH AUCTION CONTROL DECK */}
            {eventState.current_day === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Active Auction Question Live Card */}
                <div className="lg:col-span-6 flex flex-col gap-5 bg-gradient-to-b from-purple-950/40 to-slate-900/90 border-2 border-fest-yellow/40 rounded-3xl p-6 retro-shadow-black">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-fest-pink animate-ping" />
                      <span className="font-anton text-xl uppercase tracking-wider text-fest-yellow">
                        LIVE QUESTION #{currentAuctionQ?.question_number || 1}
                      </span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-grotesk uppercase font-black border ${
                      currentAuctionQ?.status === "AVAILABLE" ? "bg-emerald-950 text-emerald-400 border-emerald-800" :
                      currentAuctionQ?.status === "AUCTIONED" ? "bg-amber-950 text-amber-400 border-amber-800 animate-pulse" :
                      currentAuctionQ?.status === "SOLD" ? "bg-blue-950 text-blue-300 border-blue-800" :
                      "bg-purple-950 text-purple-300 border-purple-800"
                    }`}>
                      {currentAuctionQ?.status || "AVAILABLE"}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="bg-black/60 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-grotesk uppercase font-bold text-fest-cyan">
                        CATEGORY: {currentAuctionQ?.category}
                      </span>
                      <span className="text-xs font-grotesk uppercase font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                        {currentAuctionQ?.difficulty} TIER
                      </span>
                    </div>

                    <p className="font-sans text-lg font-semibold text-white leading-relaxed mb-4">
                      &ldquo;{currentAuctionQ?.question_text}&rdquo;
                    </p>

                    {/* Organizer Answer Clue */}
                    <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-xs">
                      <span className="font-grotesk text-slate-400 uppercase font-black block mb-1">
                        OFFICIAL ANSWER / CLUE (ORGANIZER EYES ONLY):
                      </span>
                      <span className="font-sans font-bold text-fest-yellow">
                        {currentAuctionQ?.answer_clue || "Pending host verification."}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Reward Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/50 border border-slate-800 rounded-2xl p-4">
                      <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">
                        STARTING / BASE PRICE
                      </span>
                      <span className="font-anton text-2xl text-slate-200">
                        {currentAuctionQ?.base_price} PTS
                      </span>
                    </div>

                    <div className="bg-black/50 border border-slate-800 rounded-2xl p-4">
                      <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">
                        CORRECT ANSWER REWARD
                      </span>
                      <span className="font-anton text-2xl text-fest-yellow">
                        +{currentAuctionQ?.reward_points} PTS
                      </span>
                    </div>
                  </div>

                  {/* Question Navigator */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        const curIdx = auctionQuestions.findIndex((q) => q.id === selectedAuctionQId);
                        if (curIdx > 0) setSelectedAuctionQId(auctionQuestions[curIdx - 1].id);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-grotesk uppercase font-bold rounded-lg border border-slate-700"
                    >
                      ← PREVIOUS Q
                    </button>

                    <select
                      value={selectedAuctionQId}
                      onChange={(e) => setSelectedAuctionQId(e.target.value)}
                      className="bg-black text-white font-anton text-sm px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none"
                    >
                      {auctionQuestions.map((q) => (
                        <option key={q.id} value={q.id}>
                          #{q.question_number} — {q.category} ({q.status})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const curIdx = auctionQuestions.findIndex((q) => q.id === selectedAuctionQId);
                        if (curIdx < auctionQuestions.length - 1) setSelectedAuctionQId(auctionQuestions[curIdx + 1].id);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-grotesk uppercase font-bold rounded-lg border border-slate-700"
                    >
                      NEXT Q →
                    </button>
                  </div>
                </div>

                {/* Right: Live Bidding & Answering Console */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  
                  {/* Bidding Section */}
                  <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
                    <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block mb-4">
                      LIVE BIDDING DESK
                    </span>

                    {/* Select Bidding Team */}
                    <div className="mb-4">
                      <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-2">
                        CURRENT HIGHEST BIDDER SQUAD:
                      </label>
                      <select
                        value={auctionBidderTeamId}
                        onChange={(e) => setAuctionBidderTeamId(e.target.value)}
                        className="w-full bg-black text-white font-anton text-lg uppercase px-4 py-3 rounded-2xl border-2 border-slate-700 focus:border-fest-yellow focus:outline-none"
                      >
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} (Wallet: {t.current_wallet} pts)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Current Bid Input & Increments */}
                    <div className="mb-5">
                      <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-2">
                        BID AMOUNT (CANNOT EXCEED AVAILABLE WALLET):
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={currentBidAmount}
                          onChange={(e) => setCurrentBidAmount(parseInt(e.target.value) || 0)}
                          className="flex-1 bg-black text-fest-yellow font-anton text-3xl px-4 py-2.5 rounded-2xl border-2 border-slate-700 focus:outline-none focus:border-fest-yellow"
                        />
                        <div className="flex items-center gap-1.5">
                          {[+25, +50, +100].map((inc) => (
                            <button
                              key={inc}
                              onClick={() => setCurrentBidAmount((prev) => prev + inc)}
                              className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-fest-cyan text-sm font-anton uppercase rounded-xl border border-slate-700"
                            >
                              +{inc}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sell Button */}
                    <button
                      onClick={handleSellAuctionQuestion}
                      disabled={!auctionBidderTeamId || currentAuctionQ?.status === "SOLD" || currentAuctionQ?.status === "ANSWERED"}
                      className="w-full py-4 bg-fest-cyan hover:bg-cyan-300 disabled:opacity-40 text-black font-anton text-lg uppercase tracking-wider rounded-2xl border-2 border-black retro-shadow-black transition-all flex items-center justify-center gap-2 mb-3"
                    >
                      <Gavel className="w-5 h-5" />
                      SOLD TO SQUAD FOR {currentBidAmount} PTS (DEDUCTS WALLET)
                    </button>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Base: {currentAuctionQ?.base_price} pts</span>
                      <button
                        onClick={() => {
                          if (currentAuctionQ) skipAuctionQuestion(currentAuctionQ.id);
                        }}
                        className="text-slate-400 hover:text-white underline font-grotesk uppercase"
                      >
                        Pass / Skip Question
                      </button>
                    </div>
                  </div>

                  {/* Answering & Grading Section */}
                  <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
                    <span className="font-grotesk text-xs uppercase font-black text-fest-pink tracking-widest block mb-4">
                      GRADE ATTEMPT & REWARD POINTS
                    </span>

                    {currentAuctionQ?.winning_team_id ? (
                      <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 mb-4">
                        <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          QUESTION OWNED BY:
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="font-anton text-xl text-fest-yellow">
                            {teams.find((t) => t.id === currentAuctionQ.winning_team_id)?.name || "Squad"}
                          </span>
                          <span className="font-grotesk text-xs text-slate-300">
                            Bought for: {currentAuctionQ.winning_bid} pts
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="font-sans text-xs text-slate-400 mb-4 italic">
                        Sell question to a squad above first before recording their answer verdict.
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleGradeAuctionAnswer("CORRECT")}
                        disabled={!currentAuctionQ?.winning_team_id || currentAuctionQ.status === "ANSWERED"}
                        className="py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-anton text-lg uppercase tracking-wider rounded-2xl border-2 border-black retro-shadow-black transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        CORRECT (+{currentAuctionQ?.reward_points} PTS)
                      </button>

                      <button
                        onClick={() => handleGradeAuctionAnswer("INCORRECT")}
                        disabled={!currentAuctionQ?.winning_team_id || currentAuctionQ.status === "ANSWERED"}
                        className="py-4 bg-fest-coral hover:bg-rose-400 disabled:opacity-30 text-white font-anton text-lg uppercase tracking-wider rounded-2xl border-2 border-black retro-shadow-black transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        INCORRECT (0 PTS)
                      </button>
                    </div>

                    {currentAuctionQ?.answer_status && (
                      <div className="mt-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-grotesk uppercase font-black ${
                          currentAuctionQ.answer_status === "CORRECT" ? "bg-emerald-500 text-black" : "bg-fest-coral text-white"
                        }`}>
                          VERDICT: {currentAuctionQ.answer_status}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SQUADS & 1500 WALLETS MANAGER                                      */}
        {/* ========================================================================= */}
        {activeSidebarTab === "squads-wallets" && (
          <div className="flex flex-col gap-6">
            
            {/* Squad Enrollment Form with 1500 Budget Notice */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                <div>
                  <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                    REGISTER NEW SQUAD
                  </h3>
                  <p className="font-sans text-xs text-slate-400">
                    Squads automatically receive exactly 1500 points in their spendable event wallet upon registration.
                  </p>
                </div>

                <div className="bg-fest-yellow text-black font-anton text-sm uppercase px-4 py-2 rounded-xl border border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  1500 PTS STARTING BUDGET
                </div>
              </div>

              <form onSubmit={handleCreateTeamSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    SQUAD / TEAM NAME:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BYTE BANDITS"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-black text-white font-sans text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-fest-yellow"
                  />
                </div>

                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    TEAM CAPTAIN:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Architect"
                    value={newCaptain}
                    onChange={(e) => setNewCaptain(e.target.value)}
                    className="w-full bg-black text-white font-sans text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-fest-yellow"
                  />
                </div>

                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    ROSTER MEMBERS (COMMA SEPARATED):
                  </label>
                  <input
                    type="text"
                    placeholder="Member 1, Member 2, Member 3"
                    value={newRoster}
                    onChange={(e) => setNewRoster(e.target.value)}
                    className="w-full bg-black text-white font-sans text-sm px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-fest-yellow"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-3 bg-fest-yellow hover:bg-fest-gold text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    ENROLL SQUAD (AUTO +1500 PTS)
                  </button>
                </div>
              </form>
            </div>

            {/* Squads Ledger Table */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                  ENROLLED SQUADS & WALLET BALANCES ({teams.length})
                </h3>
                <span className="font-grotesk text-xs text-slate-400">
                  Click any squad to view complete auditable transaction history & reversals
                </span>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 font-grotesk text-xs uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-3">SQUAD</th>
                    <th className="py-3 px-3">CAPTAIN</th>
                    <th className="py-3 px-3 text-right">STARTING WALLET</th>
                    <th className="py-3 px-3 text-right">SPENDABLE WALLET</th>
                    <th className="py-3 px-3 text-center">DAY 1 GAMES</th>
                    <th className="py-3 px-3 text-right">DAY 1 SCORE</th>
                    <th className="py-3 px-3 text-right">DAY 2 SCORE</th>
                    <th className="py-3 px-3 text-right">OVERALL SCORE</th>
                    <th className="py-3 px-3 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm font-sans">
                  {teams.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 font-grotesk uppercase">
                        No squads enrolled yet. Create your first team above!
                      </td>
                    </tr>
                  ) : (
                    overallStandings.map((standing) => {
                      const t = standing.team;
                      return (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-anton text-base uppercase text-white">
                            {t.name}
                          </td>
                          <td className="py-3 px-3 text-slate-300 text-xs">
                            {t.captain}
                          </td>
                          <td className="py-3 px-3 text-right font-anton text-slate-400">
                            1500 PTS
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="font-anton text-lg text-fest-yellow">
                              {t.current_wallet}
                            </span>
                            <span className="text-[10px] font-grotesk text-slate-400 ml-1">PTS</span>
                          </td>
                          <td className="py-3 px-3 text-center font-anton text-fest-cyan">
                            {standing.games_played} / 5
                          </td>
                          <td className="py-3 px-3 text-right font-anton text-white">
                            {standing.day1_score}
                          </td>
                          <td className="py-3 px-3 text-right font-anton text-fest-pink">
                            {standing.day2_score}
                          </td>
                          <td className="py-3 px-3 text-right font-anton text-xl text-fest-yellow">
                            {standing.total_score}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setInspectTeamId(t.id)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-grotesk uppercase font-bold rounded border border-slate-700 transition-colors"
                              >
                                LEDGER
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete squad "${t.name}"?`)) deleteTeam(t.id);
                                }}
                                className="p-1 hover:text-fest-coral text-slate-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TECH AUCTION BANK (60 QUESTIONS)                                   */}
        {/* ========================================================================= */}
        {activeSidebarTab === "auction-bank" && (
          <div className="flex flex-col gap-6">
            
            {/* Header and Filter */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                    DAY 2 TECH AUCTION QUESTION BANK ({auctionQuestions.length} QUESTIONS)
                  </h3>
                  <p className="font-sans text-xs text-slate-400">
                    Comprehensive bank spanning AI, Cloud, Web, Security, Algorithms, and Trivia for live Day 2 bidding.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={questionSearch}
                      onChange={(e) => setQuestionSearch(e.target.value)}
                      className="bg-black text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-fest-yellow"
                    />
                  </div>

                  <select
                    value={questionCategoryFilter}
                    onChange={(e) => setQuestionCategoryFilter(e.target.value)}
                    className="bg-black text-white text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                  >
                    <option value="all">ALL CATEGORIES</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 font-grotesk text-xs uppercase text-slate-400 tracking-wider">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">CATEGORY</th>
                      <th className="py-2.5 px-3">TIER</th>
                      <th className="py-2.5 px-3">QUESTION</th>
                      <th className="py-2.5 px-3">BASE PRICE</th>
                      <th className="py-2.5 px-3">REWARD</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs font-sans">
                    {filteredAuctionQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-anton text-fest-yellow text-sm">
                          #{q.question_number}
                        </td>
                        <td className="py-3 px-3 font-grotesk text-slate-300">
                          {q.category}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-grotesk font-black text-[10px] uppercase ${
                            q.difficulty === "Easy" ? "bg-emerald-950 text-emerald-400" :
                            q.difficulty === "Medium" ? "bg-amber-950 text-amber-400" :
                            "bg-red-950 text-red-400"
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-md font-medium text-slate-200">
                          {q.question_text}
                        </td>
                        <td className="py-3 px-3 font-anton text-slate-300">
                          {q.base_price} PTS
                        </td>
                        <td className="py-3 px-3 font-anton text-fest-yellow">
                          +{q.reward_points} PTS
                        </td>
                        <td className="py-3 px-3 font-grotesk uppercase font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            q.status === "AVAILABLE" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                            q.status === "SOLD" ? "bg-blue-950 text-blue-300 border border-blue-800" :
                            q.status === "ANSWERED" ? "bg-purple-950 text-purple-300 border border-purple-800" :
                            "bg-slate-800 text-slate-400"
                          }`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedAuctionQId(q.id);
                                setEventDay(2);
                                setActiveSidebarTab("control-booth");
                                setCurrentAuctionQuestion(q.id);
                              }}
                              className="px-2 py-1 bg-fest-yellow hover:bg-fest-gold text-black text-[10px] font-anton uppercase rounded"
                            >
                              AUCTION NOW
                            </button>
                            {q.status !== "AVAILABLE" && (
                              <button
                                onClick={() => resetAuctionQuestion(q.id)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-grotesk uppercase rounded"
                              >
                                RESET
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: GAME ECONOMICS & TOURNAMENT RULES                                  */}
        {/* ========================================================================= */}
        {activeSidebarTab === "economics" && (
          <div className="flex flex-col gap-6">
            
            {/* Game Entry Costs & Difficulty Configuration */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
              <h3 className="font-anton text-2xl uppercase tracking-wider text-white mb-2">
                CONFIGURABLE GAME ENTRY COSTS & DIFFICULTIES
              </h3>
              <p className="font-sans text-xs text-slate-400 mb-6">
                Easy games cost more; difficult games cost less to encourage strategic risk-reward decisions. Organizers can change values anytime.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {games.map((g) => (
                  <div key={g.id} className="bg-black/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-anton text-lg text-white uppercase">{g.name}</span>
                      <span className="text-xs font-grotesk text-slate-400">DAY {g.day}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-grotesk uppercase font-bold text-slate-500 mb-1">
                          ENTRY COST (PTS)
                        </label>
                        <input
                          type="number"
                          value={g.entry_cost}
                          onChange={(e) => updateGame(g.id, { entry_cost: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-900 text-fest-yellow font-anton text-lg px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-grotesk uppercase font-bold text-slate-500 mb-1">
                          DIFFICULTY
                        </label>
                        <select
                          value={g.difficulty}
                          onChange={(e) => updateGame(g.id, { difficulty: e.target.value as any })}
                          className="w-full bg-slate-900 text-white font-grotesk text-xs uppercase px-2 py-2 rounded-lg border border-slate-700 focus:outline-none"
                        >
                          <option value="Easy">EASY</option>
                          <option value="Medium">MEDIUM</option>
                          <option value="Hard">HARD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-grotesk uppercase font-bold text-slate-500 mb-1">
                          ACTIVE IN ARENA
                        </label>
                        <select
                          value={g.active ? "true" : "false"}
                          onChange={(e) => updateGame(g.id, { active: e.target.value === "true" })}
                          className="w-full bg-slate-900 text-white font-grotesk text-xs uppercase px-2 py-2 rounded-lg border border-slate-700 focus:outline-none"
                        >
                          <option value="true">ACTIVE</option>
                          <option value="false">INACTIVE</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Scoring Weights & Formula */}
            <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
              <h3 className="font-anton text-2xl uppercase tracking-wider text-white mb-2">
                OVERALL LEADERBOARD RANKING FORMULA & REWARDS CONFIGURATION
              </h3>
              <p className="font-sans text-xs text-slate-400 mb-6">
                Formula: Overall Score = (Day 1 Score × Day 1 Weight) + (Day 2 Auction Score × Day 2 Weight) + (Remaining Wallet × Wallet Ratio)
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    DAY 1 WEIGHT MULTIPLIER:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={eventState.day1_weight}
                    onChange={(e) => updateEventConfig({ day1_weight: parseFloat(e.target.value) || 1.0 })}
                    className="w-full bg-black text-white font-anton text-xl px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    DAY 2 AUCTION WEIGHT:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={eventState.day2_weight}
                    onChange={(e) => updateEventConfig({ day2_weight: parseFloat(e.target.value) || 1.0 })}
                    className="w-full bg-black text-white font-anton text-xl px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    UNSPENT WALLET TO SCORE RATIO:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={eventState.wallet_to_score_ratio}
                    onChange={(e) => updateEventConfig({ wallet_to_score_ratio: parseFloat(e.target.value) || 0.0 })}
                    className="w-full bg-black text-white font-anton text-xl px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Reward Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    GAME & AUCTION REWARD DESTINATION:
                  </label>
                  <select
                    value={eventState.reward_destination}
                    onChange={(e) => updateEventConfig({ reward_destination: e.target.value as any })}
                    className="w-full bg-black text-white font-grotesk text-sm uppercase px-4 py-3 rounded-xl border border-slate-700 focus:outline-none"
                  >
                    <option value="score_only">SCORE ONLY (Wallet is spend-only)</option>
                    <option value="both">BOTH (Awards to Leaderboard Score AND Refills Wallet)</option>
                    <option value="wallet_only">WALLET ONLY (Converts into Spendable Budget)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-grotesk text-xs uppercase font-bold text-slate-400 mb-1.5">
                    DAY 2 AUCTION TITLE NAME:
                  </label>
                  <input
                    type="text"
                    value={eventState.auction_name}
                    onChange={(e) => updateEventConfig({ auction_name: e.target.value })}
                    className="w-full bg-black text-white font-anton text-lg px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone: Resets */}
            <div className="bg-red-950/20 border-2 border-red-900/50 rounded-3xl p-6">
              <h3 className="font-anton text-xl uppercase tracking-wider text-fest-coral mb-2">
                DANGER ZONE & FESTIVAL RESETS
              </h3>
              <p className="font-sans text-xs text-slate-400 mb-4">
                Tournament resets preserve team names but restore wallets back to 1500 and clear scores.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    if (confirm("Reset all team scores and wallet transactions? Teams will be restored to 1500 points starting budget.")) {
                      resetEvent();
                      showBanner("Festival reset! All squads restored to 1500 wallet points.", "info");
                    }
                  }}
                  className="px-4 py-2.5 bg-red-950 hover:bg-red-900 text-red-200 font-anton text-xs uppercase tracking-wider rounded-xl border border-red-800 transition-colors"
                >
                  RESET TOURNAMENT (RESTORE 1500 BUDGETS)
                </button>

                <button
                  onClick={() => {
                    if (confirm("CLEAR ALL TEAMS ENTIRELY? This removes all squads, wallets, and scores.")) {
                      clearAllTeams();
                      showBanner("All squads cleared.", "error");
                    }
                  }}
                  className="px-4 py-2.5 bg-red-900/60 hover:bg-red-800 text-white font-anton text-xs uppercase tracking-wider rounded-xl border border-red-700 transition-colors"
                >
                  CLEAR ALL SQUADS COMPLETELY
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AUDIT TRANSACTIONS LEDGER (Financial and Score Audit Trail)        */}
        {/* ========================================================================= */}
        {activeSidebarTab === "audit-trail" && (
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 retro-shadow-black">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
              <div>
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                  COMPLETE AUDIT TRANSACTIONS LEDGER ({walletTransactions.length} RECORDS)
                </h3>
                <p className="font-sans text-xs text-slate-400">
                  Every wallet debit, initial allocation, game entry, auction bid, bonus, and penalty is permanently recorded and auditable.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 font-grotesk text-xs uppercase text-slate-400 tracking-wider">
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">SQUAD</th>
                    <th className="py-2.5 px-3">TRANSACTION TYPE</th>
                    <th className="py-2.5 px-3 text-right">AMOUNT</th>
                    <th className="py-2.5 px-3">DESCRIPTION / AUDIT NOTE</th>
                    <th className="py-2.5 px-3">OPERATOR</th>
                    <th className="py-2.5 px-3 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-sans">
                  {walletTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-grotesk uppercase">
                        No transactions logged yet.
                      </td>
                    </tr>
                  ) : (
                    walletTransactions.map((tx) => {
                      const team = teams.find((t) => t.id === tx.team_id);
                      return (
                        <tr key={tx.id} className={`hover:bg-slate-800/40 transition-colors ${tx.is_reversed ? "opacity-40 line-through" : ""}`}>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                            {new Date(tx.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </td>
                          <td className="py-3 px-3 font-anton text-sm uppercase text-white">
                            {team?.name || "Unknown Squad"}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-grotesk uppercase font-black ${
                              tx.transaction_type === "INITIAL_ALLOCATION" ? "bg-fest-yellow/20 text-fest-yellow border border-fest-yellow/40" :
                              tx.transaction_type === "GAME_ENTRY" ? "bg-fest-coral/20 text-fest-coral border border-fest-coral/40" :
                              tx.transaction_type === "AUCTION_PURCHASE" ? "bg-purple-950 text-purple-300 border border-purple-800" :
                              tx.transaction_type === "REVERSAL" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                              "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            }`}>
                              {tx.transaction_type}
                            </span>
                          </td>
                          <td className={`py-3 px-3 text-right font-anton text-base ${
                            tx.amount >= 0 ? "text-emerald-400" : "text-fest-coral"
                          }`}>
                            {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} PTS
                          </td>
                          <td className="py-3 px-3 text-slate-300 font-medium max-w-sm">
                            {tx.description}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {tx.created_by}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {!tx.is_reversed && tx.transaction_type !== "REVERSAL" ? (
                              <button
                                onClick={() => handleReverseTransaction(tx.id)}
                                className="px-2 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 text-[10px] font-grotesk uppercase font-bold rounded border border-amber-800 transition-colors"
                              >
                                REVERSE
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-grotesk uppercase">
                                {tx.is_reversed ? "REVERSED" : "—"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SQUAD INSPECT MODAL / DRAWER                                              */}
      {/* ========================================================================= */}
      {inspectedTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-black rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col retro-shadow-black overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block mb-1">
                  SQUAD STRATEGIC DOSSIER
                </span>
                <h3 className="font-anton text-3xl uppercase text-white">
                  {inspectedTeam.name}
                </h3>
              </div>

              <button
                onClick={() => setInspectTeamId(null)}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-6 border-b border-slate-800 bg-black/40">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">STARTING WALLET</span>
                <span className="font-anton text-xl text-slate-300">1500 PTS</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">CURRENT WALLET</span>
                <span className="font-anton text-2xl text-fest-yellow">{inspectedTeam.current_wallet} PTS</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">TOTAL SCORE</span>
                <span className="font-anton text-2xl text-fest-cyan">{inspectedTeamStanding?.total_score || 0}</span>
              </div>
            </div>

            {/* Transactions History */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
              <span className="font-grotesk text-xs uppercase font-black text-slate-400 tracking-wider">
                AUDIT TRANSACTION LEDGER:
              </span>

              {inspectedTeamTransactions.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No transactions recorded.</p>
              ) : (
                inspectedTeamTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={`bg-black/50 border rounded-xl p-3 flex items-center justify-between text-xs ${
                      tx.is_reversed ? "opacity-40 line-through border-slate-800" : "border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400">
                          {tx.transaction_type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <span className="font-medium text-white">{tx.description}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`font-anton text-base ${tx.amount >= 0 ? "text-emerald-400" : "text-fest-coral"}`}>
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} PTS
                      </span>
                      {!tx.is_reversed && tx.transaction_type !== "REVERSAL" && (
                        <button
                          onClick={() => handleReverseTransaction(tx.id)}
                          className="px-2 py-0.5 bg-amber-950 text-amber-300 rounded border border-amber-800 text-[10px] uppercase font-bold"
                        >
                          REVERSE
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectTeamId(null)}
                className="px-5 py-2 bg-slate-800 text-white font-grotesk text-xs uppercase font-bold rounded-xl"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
