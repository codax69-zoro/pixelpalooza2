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
  Sparkles,
  Radio
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";
import { soundFx } from "@/lib/audio/sound-fx";
import { PixelBunting } from "@/components/PixelBunting";
import { FestoonLights } from "@/components/FestoonLights";
import { AnimatedCounter } from "@/components/AnimatedCounter";

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

  const top3 = standings.slice(0, 3);
  const runnerUps = standings.slice(3, 10);

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col font-sans selection:bg-fest-yellow selection:text-black relative overflow-hidden">
      {/* Hanging Festoon Lights & Pixel Bunting Banner across top */}
      <FestoonLights />
      <PixelBunting />

      {/* Top Projector Header Bar */}
      <header className="bg-black/90 backdrop-blur-md border-b-2 border-white/20 px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/leaderboard"
            className="p-2.5 rounded-xl bg-white/10 border-2 border-white/20 hover:border-fest-yellow hover:text-fest-yellow text-slate-300 transition-all shadow-[2px_2px_0px_#000]"
            title="Exit Projector Mode to Main Leaderboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <span className="font-anton text-2xl lg:text-3xl tracking-wider text-white uppercase flex items-center gap-1.5">
                PIXELPALOOZA
                <span className="text-xs font-grotesk px-2 py-0.5 bg-fest-coral text-white rounded font-black tracking-normal">
                  ’25
                </span>
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-grotesk font-black text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>STAGE HUD ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-grotesk font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              <span className="text-fest-yellow">GDG ON CAMPUS</span>
              <span>•</span>
              <span>NMIMS NAVI MUMBAI</span>
            </div>
          </div>
        </div>

        {/* Center Current Game Banner */}
        <div className="hidden md:flex flex-col items-center bg-black/80 border-2 border-fest-yellow px-6 py-2 rounded-2xl retro-shadow-yellow shadow-[4px_4px_0px_#FFE500]">
          <span className="text-[10px] text-fest-yellow uppercase font-grotesk font-black tracking-widest flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>NOW ACTIVE ON STAGE</span>
          </span>
          <span className="font-anton text-xl lg:text-2xl text-white tracking-wide uppercase">
            {activeGame ? `${activeGame.name} (${activeGame.attraction_stage || "MAIN ARENA"})` : "TECH JEOPARDY"}
          </span>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-white/10 border-2 border-white/20 hover:border-white text-slate-300 hover:text-white transition-all shadow-[2px_2px_0px_#000]"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-fest-yellow" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 bg-fest-yellow text-black font-anton px-4 py-2 text-sm uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all active:translate-y-0.5"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</span>
          </button>
        </div>
      </header>

      {/* Main Projector Scoreboard Body */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow bg-yellow-950/60 border border-fest-yellow/40 px-4 py-1.5 rounded-full mb-2">
            <Trophy className="w-4 h-4 text-fest-yellow" />
            <span>CAMPUS AUDITORIUM MAIN DISPLAY</span>
          </div>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-white leading-none">
            WHO&apos;S HEADLINING PIXELPALOOZA?
          </h2>
        </div>

        {/* Podium for Top 3 */}
        {top3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
            {/* 2nd Place Silver */}
            {top3[1] && (
              <div className="order-2 md:order-1 bg-white text-black border-4 border-black rounded-3xl p-6 retro-shadow-black text-center">
                <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded bg-slate-200 text-slate-800 border border-black mb-3 inline-block">
                  #2 SILVER TIER
                </span>
                <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight truncate">
                  {top3[1].team.name}
                </h3>
                <p className="font-grotesk text-xs uppercase font-bold text-slate-600 mb-3">
                  CAPTAIN: {top3[1].team.captain}
                </p>
                <div className="font-anton text-5xl text-black">
                  <AnimatedCounter value={top3[1].total_xp} /> <span className="text-xl">XP</span>
                </div>
              </div>
            )}

            {/* 1st Place Gold Headliner */}
            {top3[0] && (
              <div className="order-1 md:order-2 bg-fest-yellow text-black border-4 border-black rounded-3xl p-8 retro-shadow-black text-center md:-translate-y-4 ring-4 ring-yellow-400/50">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-black text-fest-yellow flex items-center justify-center border-2 border-black animate-bounce">
                    <Crown className="w-6 h-6 fill-fest-yellow" />
                  </div>
                </div>
                <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded bg-black text-fest-yellow border border-black mb-3 inline-block shadow-[2px_2px_0px_#000]">
                  #1 FESTIVAL HEADLINER
                </span>
                <h3 className="font-anton text-4xl sm:text-5xl uppercase tracking-tight truncate">
                  {top3[0].team.name}
                </h3>
                <p className="font-grotesk text-sm uppercase font-black text-black/80 mb-4">
                  CAPTAIN: {top3[0].team.captain}
                </p>
                <div className="font-anton text-6xl sm:text-7xl text-black">
                  <AnimatedCounter value={top3[0].total_xp} /> <span className="text-2xl">XP</span>
                </div>
              </div>
            )}

            {/* 3rd Place Bronze */}
            {top3[2] && (
              <div className="order-3 bg-white text-black border-4 border-black rounded-3xl p-6 retro-shadow-black text-center">
                <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded bg-amber-100 text-amber-900 border border-black mb-3 inline-block">
                  #3 BRONZE TIER
                </span>
                <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight truncate">
                  {top3[2].team.name}
                </h3>
                <p className="font-grotesk text-xs uppercase font-bold text-slate-600 mb-3">
                  CAPTAIN: {top3[2].team.captain}
                </p>
                <div className="font-anton text-5xl text-black">
                  <AnimatedCounter value={top3[2].total_xp} /> <span className="text-xl">XP</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-4 border-black bg-white text-black rounded-3xl p-10 text-center retro-shadow-black my-8">
            <h3 className="font-anton text-3xl uppercase">AWAITING STAGE SCORING DISPATCHES</h3>
            <p className="font-sans text-sm text-slate-600 mt-2">
              Referees will begin scoring collegiate squads shortly across all 7 attractions.
            </p>
          </div>
        )}

        {/* Undercard Grid for Ranks 4-10 */}
        {runnerUps.length > 0 && (
          <div className="bg-black/80 border-4 border-black rounded-3xl p-6 retro-shadow-black">
            <h4 className="font-grotesk text-xs uppercase font-black tracking-widest text-slate-400 mb-4 border-b border-white/20 pb-2">
              RUNNER-UP SQUADS // AUDITORIUM TRACKER
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {runnerUps.map((s) => (
                <div
                  key={s.team.id}
                  className="bg-white/10 border-2 border-white/20 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-anton text-lg text-fest-yellow">#{s.rank}</span>
                    <span className="font-anton text-base text-white uppercase truncate max-w-[110px]">
                      {s.team.name}
                    </span>
                  </div>
                  <span className="font-anton text-lg text-fest-cyan">
                    <AnimatedCounter value={s.total_xp} /> XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Live Feed Marquee */}
      <footer className="bg-black/90 border-t-2 border-white/20 py-3 px-6 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping" />
          <span className="font-grotesk text-xs uppercase font-bold text-fest-yellow">
            LATEST STAGE TRANSMISSION:
          </span>
          <span className="font-sans text-slate-300 font-medium">
            {getLastUpdateText()}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-grotesk text-[11px] font-bold text-slate-400">
          <span>REALTIME WEBSOCKET: {realtimeStatus.toUpperCase()}</span>
        </div>
      </footer>
    </div>
  );
}
