"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Wifi, 
  Crown,
  Volume2,
  VolumeX,
  Mic,
  Tent,
  Sparkles
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";
import { soundFx } from "@/lib/audio/sound-fx";
import { PixelBunting } from "@/components/PixelBunting";

export default function ProjectorDisplayPage() {
  const { standings, activeGame, eventState, lastBroadcastEvent, teams, games, realtimeStatus } = useArena();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [muted, setMuted] = useState(soundFx.getIsMuted());

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleSound = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  // Find last update text
  const getLastUpdateText = () => {
    if (!lastBroadcastEvent) {
      return "PIXELPALOOZA MAIN STAGE LIVE // AWAITING NEXT SCORE DISPATCH";
    }
    const team = teams.find((t) => t.id === lastBroadcastEvent.team_id);
    const game = games.find((g) => g.id === lastBroadcastEvent.game_id);
    const sign = lastBroadcastEvent.points >= 0 ? "+" : "";
    return `${team ? team.name.toUpperCase() : "SQUAD"} ${sign}${lastBroadcastEvent.points} XP 🎵 (${game ? game.name.toUpperCase() : "ARENA"})`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-festival-pink selection:text-white relative overflow-hidden">
      {/* Pixel Bunting Banner across top */}
      <PixelBunting />

      {/* Top Projector Header Bar */}
      <header className="bg-obsidian-950/90 border-b-2 border-voxel-border px-6 py-4 flex items-center justify-between shadow-stage-glow z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/leaderboard"
            className="p-2 bg-obsidian-900 border border-slate-700 hover:border-festival-pink text-slate-400 hover:text-white transition-all shadow-voxel-sm"
            title="Exit Projector Mode to Main Leaderboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl lg:text-3xl font-black tracking-wider text-white flex items-center gap-1.5">
                <span>PIXELPALOOZA</span>
                <span className="text-festival-pink">🎵</span>
              </span>
              <div className="flex items-center gap-1.5 bg-festival-emerald/15 border border-festival-emerald px-3 py-0.5 text-xs font-bold text-festival-emerald">
                <span className="w-2.5 h-2.5 rounded-full bg-festival-emerald animate-ping" />
                <span>● FESTIVAL LIVE</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="text-realm-gold font-bold italic">
                &quot;Where ideas get Unhinged&quot; ✨
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-festival-cyan uppercase font-bold tracking-wider">
                GDGOC · NMIMS NAVI MUMBAI
              </span>
            </div>
          </div>
        </div>

        {/* Center Current Game Banner */}
        <div className="hidden md:flex flex-col items-center bg-obsidian-900 border-2 border-festival-pink px-6 py-2 shadow-festival-pink">
          <span className="text-[10px] text-festival-pink uppercase font-black tracking-widest flex items-center gap-1">
            <Mic className="w-3 h-3" />
            <span>CURRENT ATTRACTION</span>
          </span>
          <span className="text-xl lg:text-2xl font-black text-white tracking-wide">
            {activeGame ? `${activeGame.name.toUpperCase()} (${activeGame.attraction_stage?.toUpperCase() || "MAIN STAGE"})` : "TECH JEOPARDY"}
          </span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2.5 bg-obsidian-900 border border-slate-700 hover:border-festival-pink text-slate-300 hover:text-white transition-all"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-festival-emerald" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-festival-orange text-black font-black px-4 py-2 text-sm shadow-voxel-sm hover:brightness-110 transition-all active:translate-y-0.5"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</span>
          </button>
        </div>
      </header>

      {/* Main Projector Scoreboard Body */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-realm-gold text-lg lg:text-xl font-bold tracking-widest uppercase mb-1">
            <Trophy className="w-6 h-6 fill-realm-gold" />
            <span>🏆 LIVE LEADERBOARD</span>
          </div>
        </div>

        {/* High-visibility rows or Standby Banner */}
        {standings.length === 0 ? (
          <div className="border-2 border-slate-800 bg-obsidian-900/90 p-10 sm:p-14 text-center shadow-voxel relative overflow-hidden my-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-festival-pink via-festival-cyan to-festival-emerald" />
            <div className="w-20 h-20 bg-obsidian-950 border border-slate-700 mx-auto flex items-center justify-center text-realm-gold mb-4 shadow-inner">
              <Trophy className="w-10 h-10 fill-realm-gold" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2">
              STAGE PROJECTOR HUD ACTIVE
            </h3>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed mb-4 font-mono">
              Waiting for festival squads to register and score dispatches to begin. Realtime WebSocket sync is live and standing by.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-obsidian-950 border border-festival-pink text-festival-pink text-xs font-mono font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-festival-pink animate-ping" />
              <span>STAGE STANDBY // AUDIO &amp; VISUAL READY</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {standings.slice(0, 8).map((item, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;

                const medal = isFirst ? "🥇" : isSecond ? "🥈" : isThird ? "🥉" : `${index + 1}`;
                const borderColor = isFirst
                  ? "border-realm-gold shadow-festival-gold bg-obsidian-850"
                  : isSecond
                  ? "border-slate-400 bg-obsidian-900"
                  : isThird
                  ? "border-amber-700 bg-obsidian-900"
                  : "border-slate-800 bg-obsidian-950";

                const textColor = isFirst
                  ? "text-festival-emerald"
                  : isSecond
                  ? "text-slate-100"
                  : isThird
                  ? "text-amber-200"
                  : "text-slate-300";

                const xpColor = isFirst
                  ? "text-realm-gold"
                  : isSecond
                  ? "text-white"
                  : isThird
                  ? "text-amber-300"
                  : "text-slate-200";

                return (
                  <motion.div
                    key={item.team.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`border-2 p-3 sm:p-4 flex items-center justify-between transition-all ${borderColor}`}
                  >
                    {/* Left: Medal / Rank & Team Name */}
                    <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                      <span className="text-2xl sm:text-3xl font-black w-10 text-center shrink-0">
                        {medal}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wider truncate flex items-center gap-1.5 ${textColor}`}>
                            <span>{item.team.name}</span>
                            <span>{item.team.music_icon || "🎵"}</span>
                          </span>
                          {isFirst && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black bg-gradient-to-r from-realm-gold to-festival-pink text-black px-2 py-0.5">
                              <Crown className="w-3 h-3 fill-current" />
                              HEADLINER
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 tracking-wider">
                          CAPTAIN: {item.team.captain.toUpperCase()} • {item.games_played} STAGES PLAYED
                        </div>
                      </div>
                    </div>

                    {/* Right: Score Total */}
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className={`text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight ${xpColor}`}>
                        {item.total_xp}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-400">XP</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Bottom Large Ticker */}
      <footer className="bg-obsidian-950 border-t-2 border-voxel-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-festival-pink animate-pulse" />
          <span className="text-slate-400 uppercase tracking-widest font-bold text-xs">
            LAST UPDATE:
          </span>
          <span className="text-festival-emerald font-black text-base sm:text-lg tracking-wide">
            {getLastUpdateText()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Wifi className="w-4 h-4 text-festival-emerald" />
          <span>PROJECTOR SYNC: REALTIME ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
