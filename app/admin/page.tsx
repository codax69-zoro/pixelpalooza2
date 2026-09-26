"use client";

import React, { useState, useEffect } from "react";
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
  Snowflake, 
  Sparkles, 
  LogOut, 
  Edit3, 
  Trash2, 
  Grid, 
  PenTool, 
  Bug, 
  Clock, 
  Bot, 
  Zap, 
  Wifi, 
  ShieldAlert,
  Mic,
  Music,
  Tent,
  BarChart3,
  Gamepad2,
  Radio,
  Sliders,
  CheckCircle2,
  Star,
  Pause,
  Play,
  FileSpreadsheet,
  Upload
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";
import { Game, Team, ScoreEventType } from "@/types/arena";
import { soundFx } from "@/lib/audio/sound-fx";
import { PixelBunting } from "@/components/PixelBunting";
import { DEMO_SAMPLE_TEAMS, DEMO_SAMPLE_SCORES } from "@/lib/constants/seed-teams";
import confetti from "canvas-confetti";

export default function AdminFestivalControlBooth() {
  const router = useRouter();
  const {
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

  // Score Entry State
  const [selectedGameId, setSelectedGameId] = useState<string>(
    activeGame?.id || games[5]?.id || games[0]?.id || ""
  );
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    teams[0]?.id || ""
  );
  const [pointsInput, setPointsInput] = useState<number>(100);
  const [scoreReason, setScoreReason] = useState<string>("");
  const [confirmBanner, setConfirmBanner] = useState<{
    teamName: string;
    points: number;
    newTotal: number;
  } | null>(null);

  // Undo confirmation state
  const [undoTargetId, setUndoTargetId] = useState<string | null>(null);

  // Team Registration Form
  const [newTeamName, setNewTeamName] = useState("");
  const [newCaptain, setNewCaptain] = useState("");
  const [newRoster, setNewRoster] = useState("");
  const [newInitialXp, setNewInitialXp] = useState(0);

  // Bulk Import Modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);

  // Editing Team Modal
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Danger reset modal
  const [showResetModal, setShowResetModal] = useState<"scores" | "all" | null>(null);

  // Selected team object
  const currentSelectedTeam = teams.find((t) => t.id === selectedTeamId) || teams[0];
  const currentSelectedStanding = standings.find((s) => s.team.id === currentSelectedTeam?.id);

  // Keep selectedTeamId synced if teams change
  useEffect(() => {
    if (teams.length > 0 && !teams.some((t) => t.id === selectedTeamId)) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Presets from Stitch design
  const scorePresets = [
    { value: 10, label: "+10" },
    { value: 25, label: "+25" },
    { value: 50, label: "+50" },
    { value: 100, label: "+100 ⚡", highlighted: true },
    { value: 200, label: "+200" },
    { value: 300, label: "+300" },
    { value: 500, label: "+500 ★", gold: true },
  ];

  const penaltyPresets = [-10, -25, -50, -100];

  // Submit score with duplicate submission protection
  const handleAddScore = async (overridePoints?: number, type: ScoreEventType = "SCORE") => {
    const pointsToSubmit = overridePoints !== undefined ? overridePoints : pointsInput;
    if (!selectedTeamId || !pointsToSubmit) return;

    const res = await addScore({
      teamId: selectedTeamId,
      gameId: selectedGameId || null,
      points: pointsToSubmit,
      type: type,
      reason: scoreReason || undefined,
    });

    if (res.success) {
      const updatedTotal = (currentSelectedStanding?.total_xp || 0) + pointsToSubmit;
      setConfirmBanner({
        teamName: currentSelectedTeam?.name || "Team",
        points: pointsToSubmit,
        newTotal: updatedTotal,
      });

      setScoreReason("");

      // Confetti burst for big points
      if (pointsToSubmit >= 300) {
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch {}
      }

      setTimeout(() => {
        setConfirmBanner(null);
      }, 4000);
    } else {
      alert(res.error || "Failed to add score");
    }
  };

  // Trigger undo with confirmation
  const handleConfirmUndo = async () => {
    if (!undoTargetId) return;
    const res = await undoScore(undoTargetId);
    if (!res.success) {
      alert(res.error || "Failed to undo score");
    }
    setUndoTargetId(null);
  };

  // Team Registration
  const handleRegisterTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newCaptain.trim()) return;

    const rosterList = newRoster.split(",").map((s) => s.trim()).filter(Boolean);
    const success = await createTeam(newTeamName, newCaptain, rosterList);

    if (success) {
      if (newInitialXp > 0) {
        setTimeout(() => {
          const created = teams.find((t) => t.name === newTeamName.trim());
          if (created) {
            addScore({
              teamId: created.id,
              gameId: null,
              points: newInitialXp,
              type: "MANUAL_ADJUSTMENT",
              reason: "Initial roster seed points",
            });
          }
        }, 300);
      }

      setNewTeamName("");
      setNewCaptain("");
      setNewRoster("");
      setNewInitialXp(0);
    }
  };

  // Bulk Team Importer
  const handleBulkImport = async () => {
    setBulkError(null);
    if (!bulkCsvText.trim()) {
      setBulkError("Please paste squad entries in CSV or line format.");
      return;
    }

    const lines = bulkCsvText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let importedCount = 0;
    for (const line of lines) {
      // Split by comma
      const parts = line.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const teamName = parts[0];
        const captain = parts[1];
        const members = parts.slice(2);
        await createTeam(teamName, captain, members);
        importedCount++;
      } else if (parts.length === 1) {
        // Just team name
        await createTeam(parts[0], "Captain", []);
        importedCount++;
      }
    }

    if (importedCount > 0) {
      setBulkCsvText("");
      setShowBulkModal(false);
      alert(`Successfully registered ${importedCount} squads for the festival!`);
    } else {
      setBulkError("Could not parse squads. Format: Team Name, Captain, Member 1, Member 2...");
    }
  };

  const handleQuickAdjustSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleStageFx = () => {
    try {
      soundFx.playChampionFanfare();
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { y: 0.5 },
      });
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("gdgoc_admin_session");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col lg:flex-row font-mono text-xs selection:bg-festival-pink selection:text-white">
      {/* =================================================================== */}
      {/* LEFT NAVIGATION SIDEBAR (Matching media_1790449798804.png) */}
      {/* =================================================================== */}
      <aside className="w-full lg:w-64 bg-obsidian-900 border-r border-voxel-border flex flex-col justify-between shrink-0 p-4 lg:min-h-screen z-20">
        <div>
          {/* Top Brand with Audio Waveform Logo */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-festival-pink to-purple-600 border border-festival-pink/60 flex items-center justify-center shadow-voxel-sm">
              <span className="text-white font-mono text-base font-black tracking-tighter">
                |||
              </span>
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wide flex items-center gap-1">
                <span>PIXELPALOOZA</span>
                <span className="text-festival-pink text-xs">🎵</span>
              </div>
              <div className="text-[10px] text-festival-cyan font-bold tracking-wider uppercase">
                CONTROL BOOTH
              </div>
            </div>
          </div>

          {/* Organizer Access Level Badge */}
          <div className="bg-obsidian-950 border border-slate-800 px-3 py-1.5 flex items-center justify-between mb-6 shadow-voxel-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-festival-emerald" />
              <span>ORGANIZER DESK</span>
            </span>
            <span className="text-[10px] text-realm-gold font-bold bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.2">
              LVL 9 👑
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveSidebarTab("control-booth")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none font-bold text-xs uppercase tracking-wider transition-all shadow-voxel-sm ${
                activeSidebarTab === "control-booth"
                  ? "bg-festival-pink text-white border-2 border-festival-pink shadow-festival-pink font-black"
                  : "bg-obsidian-950 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-slate-800"
              }`}
            >
              <Tent className="w-4 h-4" />
              <span>CONTROL BOOTH</span>
            </button>

            <Link
              href="/leaderboard"
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-obsidian-950 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-voxel-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>SCORE MATRIX</span>
            </Link>

            <Link
              href="/games"
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-obsidian-950 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-voxel-sm"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>MANAGE GAMES</span>
            </Link>

            <button
              onClick={() => {
                setActiveSidebarTab("registry");
                const reg = document.getElementById("squad-registry-panel");
                if (reg) reg.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-obsidian-950 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-voxel-sm text-left"
            >
              <Users className="w-4 h-4" />
              <span>TEAM REGISTRY</span>
            </button>

            <Link
              href="/display"
              target="_blank"
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-obsidian-950 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-voxel-sm"
            >
              <Mic className="w-4 h-4" />
              <span>STAGE HUD OUTPUT</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Bottom: Festival Engine Meter */}
        <div className="mt-8 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1.5">
            <span className="flex items-center gap-1 text-realm-gold">
              <span>FESTIVAL ENGINE</span>
            </span>
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-1.5 py-0.2">
              LIVE
            </span>
          </div>

          <div className="text-[11px] font-bold text-white mb-2 flex items-center gap-1">
            <span>STAGE 03 / FINALS</span>
            <span className="text-realm-gold">✨</span>
          </div>

          <div className="w-full h-2 bg-obsidian-950 border border-slate-800 overflow-hidden shadow-inner">
            <div className="h-full w-[72%] bg-gradient-to-r from-festival-pink via-festival-cyan to-festival-emerald" />
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-obsidian-900 border-b border-voxel-border px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-voxel-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">BACK TO PUBLIC ARENA</span>
            </Link>

            {/* GDG ON CAMPUS · NMIMS NAVI MUMBAI Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-obsidian-950 border border-festival-cyan/40 text-festival-cyan px-2.5 py-1 text-[11px] font-bold tracking-wider">
              <span>GDG ON CAMPUS · NMIMS NAVI MUMBAI</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Festival Live Pill */}
            <div className="flex items-center gap-1.5 bg-obsidian-950 border border-realm-emerald/50 px-2.5 py-1 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-realm-emerald animate-pulse" />
              <span className="text-realm-emerald font-bold">FESTIVAL LIVE</span>
            </div>

            {/* Squads count */}
            <div className="hidden sm:flex items-center gap-1 bg-obsidian-950 border border-slate-800 px-2 py-1 text-[11px] text-slate-300">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{teams.length} SQUADS</span>
            </div>

            {/* Stage Projector Button (Amber with tent icon) */}
            <Link
              href="/display"
              target="_blank"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-festival-orange text-black font-black px-3 py-1 text-xs shadow-voxel-sm hover:brightness-110 transition-all active:translate-y-0.5"
            >
              <Tent className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">STAGE PROJECTOR ↗</span>
            </Link>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="p-1.5 bg-obsidian-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-700 text-slate-400 hover:text-red-300 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* =================================================================== */}
          {/* TOP SESSION CARD WITH PIXEL BUNTING (media_1790449798804.png) */}
          {/* =================================================================== */}
          <div className="voxel-card border-2 border-voxel-border bg-obsidian-900 shadow-voxel overflow-hidden relative">
            <PixelBunting />

            <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                {/* Tag row */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-festival-pink text-white font-black text-[10px] px-2 py-0.5 tracking-wider uppercase shadow-voxel-sm">
                    PIXELPALOOZA - FESTIVAL DISPATCH
                  </span>
                  <span className="bg-obsidian-950 border border-festival-cyan/60 text-festival-cyan font-bold text-[10px] px-2 py-0.5">
                    SYS_ID: OP-7849
                  </span>
                </div>

                {/* Festival Tagline */}
                <div className="text-xs text-realm-gold font-bold italic tracking-wide mb-1 flex items-center gap-1">
                  <span>&quot;Where ideas get Unhinged&quot;</span>
                  <span>✨</span>
                </div>

                {/* Heading */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    GDGOC FESTIVAL CONTROL BOOTH
                  </h1>
                  <span className="bg-festival-cyan text-obsidian-950 font-black text-[10px] px-2 py-0.5 uppercase tracking-wider">
                    LIVE SCORING
                  </span>
                </div>
              </div>

              {/* Stat Boxes */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="bg-obsidian-950 border border-slate-800 p-2.5 text-center min-w-[95px] shadow-inner">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">SCORES LOGGED</div>
                  <div className="text-base font-bold text-festival-cyan">{scoreEvents.length} entries</div>
                </div>

                <div className="bg-obsidian-950 border border-slate-800 p-2.5 text-center min-w-[95px] shadow-inner">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">LAST LOGGED</div>
                  <div className="text-base font-bold text-festival-emerald">
                    {scoreEvents[0]
                      ? new Date(scoreEvents[0].created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </div>
                </div>

                <div className="bg-obsidian-950 border border-slate-800 p-2.5 min-w-[130px] shadow-inner">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500">ACTIVE ARENA</div>
                  <div className="text-xs font-bold text-realm-gold truncate flex items-center gap-1">
                    <span>🎤</span>
                    <span>{activeGame?.name || "Tech Jeopardy"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Banner popup after adding score */}
          {confirmBanner && (
            <div className="bg-festival-emerald/15 border-2 border-festival-emerald p-4 text-festival-emerald shadow-festival-emerald flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-festival-emerald text-obsidian-950 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">SCORE COMMITTED TO REALTIME</div>
                  <div className="text-sm font-bold text-white">
                    {confirmBanner.teamName} {confirmBanner.points >= 0 ? "+" : ""}{confirmBanner.points} XP 🎵 
                    <span className="text-slate-400 font-normal ml-2">
                      (New Total: {confirmBanner.newTotal} XP)
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Auto-synced across open screens
              </span>
            </div>
          )}

          {/* =================================================================== */}
          {/* 2-COLUMN LAYOUT: Scoring Desk (Left), Squads & Actions (Right) */}
          {/* =================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Dispatch Desk & Recent Score Transactions */}
            <div className="lg:col-span-8 space-y-6">
              {/* FESTIVAL SCORE DISPATCH BOOTH */}
              <div className="voxel-card border-2 border-voxel-border bg-obsidian-900 p-5 shadow-voxel">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🗂️</span>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      FESTIVAL SCORE DISPATCH BOOTH
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-festival-emerald bg-festival-emerald/10 border border-festival-emerald/40 px-2 py-0.5">
                    ● DISPATCH: READY
                  </span>
                </div>

                {/* STEP 1: Select Arena Event / Attraction */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 bg-obsidian-950 border border-slate-700 flex items-center justify-center text-[10px] text-festival-emerald font-bold">
                        1
                      </span>
                      <span>SELECT ARENA EVENT / ATTRACTION</span>
                    </label>
                    <span className="text-[10px] text-realm-gold font-bold">
                      MULTIPLIER: {games.find((g) => g.id === selectedGameId)?.multiplier || 1.0}X
                    </span>
                  </div>

                  {/* 7 Attraction Buttons matching Stitch design */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {games.map((g) => {
                      const isSelected = selectedGameId === g.id;
                      const tagColor =
                        g.stage_color === "red"
                          ? "bg-red-900/80 text-red-200 border-red-700"
                          : g.stage_color === "orange"
                          ? "bg-orange-950/80 text-orange-200 border-orange-700"
                          : g.stage_color === "yellow"
                          ? "bg-amber-950/80 text-amber-200 border-amber-700"
                          : g.stage_color === "cyan"
                          ? "bg-cyan-950/80 text-cyan-200 border-cyan-700"
                          : g.stage_color === "pink"
                          ? "bg-festival-pink/30 text-festival-pink border-festival-pink"
                          : "bg-amber-950/80 text-amber-200 border-amber-700";

                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setSelectedGameId(g.id);
                            setCurrentGame(g.id);
                          }}
                          className={`p-2 border text-center transition-all flex flex-col items-center justify-between min-h-[72px] shadow-voxel-sm ${
                            isSelected
                              ? "bg-gradient-to-b from-festival-pink/20 to-festival-pink/10 border-festival-pink text-white font-bold shadow-festival-pink ring-1 ring-festival-pink"
                              : "bg-obsidian-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                          }`}
                        >
                          <span className={`text-[8px] font-black uppercase px-1 py-0.2 border ${tagColor} mb-1 w-full truncate`}>
                            {g.stage_tag || "STAGE"}
                          </span>

                          <span className="text-[10px] font-bold leading-tight uppercase truncate w-full text-white">
                            {g.name.replace("Tech ", "")}
                          </span>

                          <span className="text-[9px] text-slate-400 truncate w-full mt-0.5">
                            {g.attraction_stage || "Attraction"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: Target Participating Squad */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 bg-obsidian-950 border border-slate-700 flex items-center justify-center text-[10px] text-festival-emerald font-bold">
                        2
                      </span>
                      <span>TARGET PARTICIPATING SQUAD</span>
                    </label>
                    <span className="text-[10px] text-realm-gold font-bold">
                      {teams.length === 0 ? "NO SQUADS REGISTERED YET" : `TIER 1 // RANK #${currentSelectedStanding ? currentSelectedStanding.rank : "—"}`}
                    </span>
                  </div>

                  {teams.length === 0 ? (
                    <div className="p-3 bg-obsidian-950 border border-amber-800/80 text-amber-300 text-xs flex items-center justify-between">
                      <span>No squads registered yet. Use the panel on the right to register your squads!</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="flex-1 bg-obsidian-950 border-2 border-slate-700 text-white px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-festival-pink font-bold cursor-pointer"
                      >
                        {standings.map((st) => (
                          <option key={st.team.id} value={st.team.id}>
                            {st.team.name.toUpperCase()} (Current XP: {st.total_xp}) — #{st.rank}
                          </option>
                        ))}
                      </select>

                      <div className="bg-obsidian-950 border border-slate-800 px-4 py-2 flex items-center justify-between sm:justify-start gap-3">
                        <div>
                          <div className="text-[9px] text-slate-500 uppercase">CURRENT TOTAL</div>
                          <div className="text-base font-black text-festival-emerald">
                            {currentSelectedStanding ? currentSelectedStanding.total_xp : 0} XP
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-amber-950/40 border border-realm-gold/60 flex items-center justify-center text-realm-gold">
                          <Trophy className="w-4 h-4 fill-realm-gold" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP 3: Select XP Voucher or Enter Amount */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 bg-obsidian-950 border border-slate-700 flex items-center justify-center text-[10px] text-festival-emerald font-bold">
                        3
                      </span>
                      <span>SELECT XP VOUCHER OR ENTER AMOUNT</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setPointsInput(0)}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      [ RESET VALUE ]
                    </button>
                  </div>

                  {/* Preset Chips */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-3">
                    {scorePresets.map((chip) => {
                      const isSelected = pointsInput === chip.value;
                      return (
                        <button
                          key={chip.value}
                          type="button"
                          onClick={() => setPointsInput(chip.value)}
                          className={`py-2 border font-bold text-xs transition-all shadow-voxel-sm ${
                            isSelected
                              ? "bg-festival-pink text-white border-festival-pink font-black shadow-festival-pink"
                              : chip.highlighted
                              ? "bg-obsidian-950 border-festival-cyan text-festival-cyan hover:bg-festival-cyan/10"
                              : chip.gold
                              ? "bg-amber-950/60 border-realm-gold text-realm-gold hover:bg-realm-gold/10"
                              : "bg-obsidian-950 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct Input & Reason */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
                    <div className="sm:col-span-6 relative">
                      <span className="absolute left-3 top-2.5 text-xs text-festival-cyan font-bold flex items-center gap-1">
                        <span>🎵</span>
                        <span>ARENA:SCORE$</span>
                      </span>
                      <input
                        type="number"
                        value={pointsInput || ""}
                        onChange={(e) => setPointsInput(Number(e.target.value))}
                        placeholder="100"
                        className="w-full bg-obsidian-950 border-2 border-slate-700 text-white pl-32 pr-16 py-2 text-base font-bold focus:outline-none focus:border-festival-pink"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-bold">
                        XP UNITS
                      </span>
                    </div>

                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        placeholder="Optional reason (e.g. Correct answer, Round 2)"
                        value={scoreReason}
                        onChange={(e) => setScoreReason(e.target.value)}
                        className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-festival-pink"
                      />
                    </div>
                  </div>

                  {/* Big CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleAddScore(undefined, "SCORE")}
                    disabled={isProcessing || !pointsInput || teams.length === 0}
                    className="w-full btn-voxel bg-festival-emerald hover:bg-emerald-400 text-obsidian-950 font-black py-3 text-sm uppercase tracking-wider transition-all border-festival-emerald shadow-festival-emerald flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span className="text-base">🎵</span>
                    <span>
                      {isProcessing
                        ? "COMMITTING SCORE..."
                        : teams.length === 0
                        ? "REGISTER A SQUAD FIRST"
                        : `+ ADD SCORE TO LIVE LEADERBOARD (${pointsInput > 0 ? "+" : ""}${pointsInput} XP)`}
                    </span>
                  </button>
                </div>

                {/* REDSTONE PENALTY DEDUCTION DESK */}
                <div className="p-3 bg-red-950/20 border border-red-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-festival-redstone shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-white uppercase flex items-center gap-2">
                        <span>REDSTONE PENALTY DEDUCTION DESK</span>
                        <span className="text-[9px] bg-red-900 text-red-200 px-1.5 py-0.2 font-bold">
                          CONFIRM REQUIRED
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Accidental-entry safe deduction mechanism
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {penaltyPresets.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          if (confirm(`Apply ${val} XP penalty to ${currentSelectedTeam?.name}?`)) {
                            handleAddScore(val, "PENALTY");
                          }
                        }}
                        disabled={teams.length === 0}
                        className="px-2 py-1 bg-obsidian-950 border border-red-900 hover:border-red-500 text-red-400 text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {val} XP
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Apply -50 XP penalty to ${currentSelectedTeam?.name}?`)) {
                          handleAddScore(-50, "PENALTY");
                        }
                      }}
                      disabled={teams.length === 0}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase flex items-center gap-1 disabled:opacity-50"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>DEDUCT</span>
                    </button>
                  </div>
                </div>

                {/* REALTIME AUDITORIUM HUD PREVIEW */}
                <div className="p-3 bg-obsidian-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-6 h-6 bg-festival-cyan/20 text-festival-cyan border border-festival-cyan/40 flex items-center justify-center font-bold text-xs shrink-0">
                      📺
                    </div>
                    <div className="truncate">
                      <div className="text-white font-bold flex items-center gap-1.5">
                        <span className="text-festival-emerald">✓</span>
                        <span>
                          {currentSelectedTeam
                            ? `PREVIEW: ${currentSelectedTeam.name} +${pointsInput} XP 🎵 → NEW TOTAL: ${(currentSelectedStanding?.total_xp || 0) + pointsInput} XP`
                            : "PREVIEW: Awaiting squad selection"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Auto-syncs Stage Projector & Participant Mobile PWA displays on commit.
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-festival-emerald bg-festival-emerald/10 border border-festival-emerald/40 px-2 py-1 shrink-0 uppercase">
                    LIVE SYNC ACTIVE
                  </span>
                </div>
              </div>

              {/* RECENT SCORE TRANSACTIONS (LIVE SYNC) - ROLLBACK ENABLED */}
              <div className="voxel-card border-2 border-voxel-border bg-obsidian-900 p-5 shadow-voxel">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-festival-cyan" />
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      RECENT SCORE TRANSACTIONS (LIVE SYNC)
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-festival-cyan bg-festival-cyan/10 border border-festival-cyan/40 px-2 py-0.5">
                    ● ROLLBACK ENABLED
                  </span>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 bg-obsidian-950 border border-slate-800/80">
                    No score transactions recorded yet. Add scores above to begin live tournament audit logging.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest">
                          <th className="pb-2">TIME</th>
                          <th className="pb-2">TEAM</th>
                          <th className="pb-2 hidden sm:table-cell">GAME</th>
                          <th className="pb-2">SCORE CHANGE</th>
                          <th className="pb-2 hidden md:table-cell">NEW TOTAL</th>
                          <th className="pb-2 hidden lg:table-cell">LOGGED BY</th>
                          <th className="pb-2 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {transactions.slice(0, 7).map((tx) => {
                          const isNegative = tx.score_change < 0;
                          const isReversal = tx.is_reversal;
                          const teamObj = teams.find((t) => t.id === tx.team_id);
                          const musicIcon = teamObj?.music_icon || "🎵";

                          return (
                            <tr key={tx.id} className="hover:bg-obsidian-950/60 transition-colors">
                              <td className="py-2.5 text-slate-400 whitespace-nowrap">{tx.time}</td>
                              <td className="py-2.5 font-bold text-white uppercase whitespace-nowrap">
                                <span className="mr-1.5">{musicIcon}</span>
                                <span>{tx.team_name}</span>
                              </td>
                              <td className="py-2.5 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                                {tx.game_name}
                              </td>
                              <td className="py-2.5 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 font-bold ${
                                    isNegative
                                      ? "bg-festival-redstone/20 text-festival-redstone border border-festival-redstone/40"
                                      : isReversal
                                      ? "bg-amber-900/30 text-amber-400 border border-amber-600/40"
                                      : "bg-festival-emerald/20 text-festival-emerald border border-festival-emerald/40"
                                  }`}
                                >
                                  {tx.score_change >= 0 ? "+" : ""}
                                  {tx.score_change} XP {tx.type === "PENALTY" ? "PENALTY" : ""}
                                </span>
                              </td>
                              <td className="py-2.5 font-bold text-slate-200 hidden md:table-cell whitespace-nowrap">
                                {tx.new_total} XP
                              </td>
                              <td className="py-2.5 text-slate-500 hidden lg:table-cell whitespace-nowrap">
                                {tx.logged_by}
                              </td>
                              <td className="py-2.5 text-right whitespace-nowrap">
                                {!isReversal && (
                                  <button
                                    onClick={() => setUndoTargetId(tx.id)}
                                    className="px-2 py-0.5 bg-obsidian-950 hover:bg-amber-950 border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-300 transition-all font-bold text-[11px]"
                                  >
                                    ↶ UNDO
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Festival Squads & Stage Actions */}
            <div className="lg:col-span-4 space-y-6">
              {/* REGISTER SQUAD PANEL + BULK IMPORT BUTTON */}
              <div id="squad-registry-panel" className="voxel-card border-2 border-voxel-border bg-obsidian-900 p-5 shadow-voxel">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎪</span>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      FESTIVAL SQUADS ({teams.length})
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-realm-gold bg-amber-950/60 border border-amber-700 px-2 py-0.5">
                    POOL A & B
                  </span>
                </div>

                {/* Bulk Import Button */}
                <button
                  type="button"
                  onClick={() => setShowBulkModal(true)}
                  className="w-full mb-4 px-3 py-2 bg-obsidian-950 hover:bg-festival-cyan/15 border border-festival-cyan/60 hover:border-festival-cyan text-festival-cyan font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-voxel-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>+ BULK IMPORT SQUADS (CSV)</span>
                </button>

                <div className="text-[11px] font-bold text-festival-cyan uppercase mb-3 flex items-center gap-1.5">
                  <span>+</span>
                  <span>REGISTER SINGLE SQUAD</span>
                </div>

                <form onSubmit={handleRegisterTeam} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">
                      TEAM DESIGNATION
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cyber Dragons 🐲"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      required
                      className="w-full bg-obsidian-950 border border-slate-700 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-festival-pink"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                        CAPTAIN
                      </label>
                      <input
                        type="text"
                        placeholder="Krishna"
                        value={newCaptain}
                        onChange={(e) => setNewCaptain(e.target.value)}
                        required
                        className="w-full bg-obsidian-950 border border-slate-700 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-festival-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                        INITIAL XP
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={newInitialXp || ""}
                        onChange={(e) => setNewInitialXp(Number(e.target.value))}
                        className="w-full bg-obsidian-950 border border-slate-700 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-festival-pink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      ROSTER (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      placeholder="Rahul, Aarav, Riya"
                      value={newRoster}
                      onChange={(e) => setNewRoster(e.target.value)}
                      className="w-full bg-obsidian-950 border border-slate-700 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-festival-pink"
                    />
                  </div>

                  {/* Neon Magenta Button */}
                  <button
                    type="submit"
                    className="w-full btn-voxel bg-festival-pink text-white font-black py-2.5 text-xs uppercase tracking-wider hover:bg-pink-600 transition-all border-festival-pink shadow-festival-pink flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>+ ADD NEW SQUAD</span>
                  </button>
                </form>
              </div>

              {/* SQUADS LIST */}
              <div className="voxel-card border-2 border-voxel-border bg-obsidian-900 p-4 shadow-voxel max-h-[460px] overflow-y-auto">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center justify-between">
                  <span>CURRENT STANDINGS SQUADS</span>
                  <span className="text-festival-cyan">{standings.length} ACTIVE</span>
                </div>

                {standings.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-obsidian-950 border border-slate-800">
                    No squads registered yet. Add or import squads above to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {standings.map((st) => (
                      <div
                        key={st.team.id}
                        className="p-2.5 bg-obsidian-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 bg-obsidian-900 px-1 border border-slate-800">
                              #{st.rank}
                            </span>
                            <span className="font-bold text-white uppercase truncate max-w-[130px] flex items-center gap-1">
                              <span>{st.team.name}</span>
                              <span>{st.team.music_icon || "🎤"}</span>
                            </span>
                          </div>
                          <span className="text-xs font-bold text-festival-emerald">{st.total_xp} XP</span>
                        </div>

                        <div className="text-[10px] text-slate-500 truncate">
                          Cap: {st.team.captain} // {st.team.members.length} Members
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-900">
                          <button
                            onClick={() => handleQuickAdjustSelect(st.team.id)}
                            className="px-2 py-0.5 bg-obsidian-900 text-festival-cyan border border-festival-cyan/30 hover:border-festival-cyan text-[10px] font-bold"
                          >
                            [ ADJUST SCORE ]
                          </button>

                          <button
                            onClick={() => setEditingTeam(st.team)}
                            className="px-2 py-0.5 bg-obsidian-900 text-slate-300 border border-slate-800 hover:border-slate-600 text-[10px]"
                          >
                            EDIT
                          </button>

                          <Link
                            href={`/teams/${st.team.id}`}
                            className="px-2 py-0.5 bg-obsidian-900 text-slate-300 border border-slate-800 hover:border-slate-600 text-[10px]"
                          >
                            PROFILE
                          </Link>

                          <button
                            onClick={() => {
                              if (confirm(`Delete squad "${st.team.name}" and their scores?`)) {
                                deleteTeam(st.team.id);
                              }
                            }}
                            className="ml-auto text-slate-600 hover:text-red-400 p-1"
                            title="Delete Squad"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STAGE BROADCAST ACTIONS */}
              <div className="voxel-card border-2 border-voxel-border bg-obsidian-900 p-4 shadow-voxel">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                  <span>🎆</span>
                  <span>STAGE BROADCAST ACTIONS</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={toggleHudFreeze}
                    className={`p-2.5 border text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-voxel-sm ${
                      eventState.is_hud_frozen
                        ? "bg-amber-500 text-black border-amber-600 font-black"
                        : "bg-obsidian-950 border-amber-800/80 text-amber-400 hover:border-amber-500"
                    }`}
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>{eventState.is_hud_frozen ? "HUD FROZEN" : "FREEZE HUD"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStageFx}
                    className="p-2.5 bg-gradient-to-r from-amber-500 to-festival-orange text-black font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-voxel-sm hover:brightness-110"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-black" />
                    <span>STAGE FX</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowResetModal("scores")}
                    className="p-1.5 bg-obsidian-950 hover:bg-red-950/40 border border-red-900/60 hover:border-red-600 text-red-400 font-bold text-[10px] transition-all"
                  >
                    RESET SCORES
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetModal("all")}
                    className="p-1.5 bg-obsidian-950 hover:bg-red-950/40 border border-red-900/60 hover:border-red-600 text-red-400 font-bold text-[10px] transition-all"
                  >
                    CLEAR ALL SQUADS
                  </button>
                </div>

                {/* Optional Organizer Sample Seed Test Button */}
                <div className="mt-3 pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Load sample test squads & scores for dry-run testing?")) {
                        for (const dt of DEMO_SAMPLE_TEAMS) {
                          await createTeam(dt.name, dt.captain, dt.members);
                        }
                        for (const ds of DEMO_SAMPLE_SCORES) {
                          await addScore({
                            teamId: ds.team_id,
                            gameId: ds.game_id,
                            points: ds.points,
                            type: ds.type,
                            reason: ds.reason,
                          });
                        }
                      }
                    }}
                    className="text-[10px] text-slate-500 hover:text-festival-cyan transition-colors"
                  >
                    ⚡ [Dry-Run] Load Sample College Squads (Testing Only)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =================================================================== */}
      {/* BULK IMPORT MODAL */}
      {/* =================================================================== */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="voxel-card border-2 border-festival-cyan bg-obsidian-900 p-6 max-w-lg w-full shadow-voxel">
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-festival-cyan" />
              <span>BULK IMPORT FESTIVAL SQUADS</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Paste your team list below. Each line will create one squad:
              <br />
              <code className="text-festival-cyan font-mono text-[11px]">
                Team Name, Captain, Member 1, Member 2, Member 3
              </code>
            </p>

            {bulkError && (
              <div className="mb-3 p-2 bg-red-950/60 border border-red-800 text-red-300 text-xs">
                {bulkError}
              </div>
            )}

            <textarea
              rows={8}
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              placeholder="Byte Bandits, Krishna, Rahul, Aarav, Riya&#10;Code Raiders, Tanya, Sneha, Rohan, Aditya&#10;Pixel Pioneers, Vikram, Kabir, Ananya, Dev"
              className="w-full bg-obsidian-950 border-2 border-slate-700 text-white p-3 text-xs font-mono focus:outline-none focus:border-festival-cyan mb-3 leading-relaxed"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setBulkCsvText(
                    "Byte Bandits, Krishna, Rahul, Aarav, Riya\nCode Raiders, Tanya, Sneha, Rohan, Aditya\nPixel Pioneers, Vikram, Kabir, Ananya, Dev\nDebug Squad, Sarah, Mihir, Kavya, Siddharth\nBinary Beasts, Dev, Nikhil, Diya, Alok\nSyntax Squad, Ananya, Varun, Meera, Arjun"
                  );
                }}
                className="text-[11px] text-festival-cyan hover:underline"
              >
                Insert Example Template
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-3 py-1.5 bg-obsidian-950 border border-slate-700 text-slate-300 text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="btn-voxel px-4 py-1.5 bg-festival-cyan text-obsidian-950 border-festival-cyan font-black text-xs uppercase tracking-wider"
                >
                  IMPORT SQUADS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNDO CONFIRMATION MODAL */}
      {undoTargetId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="voxel-card border-2 border-amber-600 bg-obsidian-900 p-6 max-w-md w-full shadow-voxel">
            <h3 className="text-base font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              <span>CONFIRM SCORE REVERSAL (UNDO)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              This action will NOT delete the original record. Instead, it creates an audited 
              REVERSAL score event that deducts the points and maintains full tournament traceability.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setUndoTargetId(null)}
                className="px-4 py-2 bg-obsidian-950 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmUndo}
                className="btn-voxel px-4 py-2 bg-amber-500 text-black border-amber-600 text-xs font-black uppercase tracking-wider hover:bg-amber-400"
              >
                CONFIRM REVERSAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TEAM MODAL */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="voxel-card border-2 border-voxel-border bg-obsidian-900 p-6 max-w-md w-full shadow-voxel">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-festival-emerald" />
              <span>EDIT SQUAD DETAILS</span>
            </h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">TEAM NAME</label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-festival-pink"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">CAPTAIN</label>
                <input
                  type="text"
                  value={editingTeam.captain}
                  onChange={(e) => setEditingTeam({ ...editingTeam, captain: e.target.value })}
                  className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-festival-pink"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">
                  MEMBERS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={editingTeam.members.join(", ")}
                  onChange={(e) =>
                    setEditingTeam({
                      ...editingTeam,
                      members: e.target.value.split(",").map((m) => m.trim()),
                    })
                  }
                  className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-festival-pink"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingTeam(null)}
                className="px-4 py-2 bg-obsidian-950 border border-slate-700 text-slate-300 text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  await updateTeam(
                    editingTeam.id,
                    editingTeam.name,
                    editingTeam.captain,
                    editingTeam.members
                  );
                  setEditingTeam(null);
                }}
                className="btn-voxel px-4 py-2 bg-festival-emerald text-obsidian-950 border-festival-emerald text-xs font-bold uppercase tracking-wider"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="voxel-card border-2 border-red-600 bg-obsidian-900 p-6 max-w-md w-full shadow-voxel">
            <h3 className="text-base font-black text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>DANGER: CONFIRM {showResetModal === "scores" ? "SCORE RESET" : "CLEAR ALL SQUADS"}</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {showResetModal === "scores"
                ? "This will clear all recorded score events and reset all team scores to 0 XP. Teams will NOT be deleted."
                : "This will delete all squads and scores, leaving a completely clean slate for your event."}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetModal(null)}
                className="px-4 py-2 bg-obsidian-950 border border-slate-700 text-slate-300 text-xs font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  if (showResetModal === "scores") {
                    await resetScores();
                  } else {
                    await clearAllTeams();
                  }
                  setShowResetModal(null);
                }}
                className="btn-voxel px-4 py-2 bg-red-600 text-white border-red-700 text-xs font-black uppercase tracking-wider hover:bg-red-500"
              >
                CONFIRM {showResetModal === "scores" ? "RESET SCORES" : "CLEAR ALL SQUADS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
