"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Maximize2, 
  Minimize2, 
  ArrowLeft, 
  Crown,
  Volume2,
  VolumeX,
  Radio,
  Coins,
  Gavel
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";
import { soundFx } from "@/lib/audio/sound-fx";
import { PixelBunting } from "@/components/PixelBunting";
import { FestoonLights } from "@/components/FestoonLights";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export default function ProjectorDisplayPage() {
  const { 
    overallStandings, 
    day1Standings, 
    day2Standings, 
    activeGame, 
    eventState, 
    lastBroadcastEvent, 
    teams, 
    games, 
    activeAuctionQuestion,
    realtimeStatus,
    realtimeTransport,
    activeDeviceCount
  } = useArena();
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
    return `${team ? team.name.toUpperCase() : "SQUAD"} ${sign}${lastBroadcastEvent.points} PTS (${game ? game.name.toUpperCase() : "ARENA"})`;
  };

  const currentStandings = eventState.current_day === 1 ? day1Standings : overallStandings;
  const top3 = currentStandings.slice(0, 3);
  const runnerUps = currentStandings.slice(3, 10);

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
                  ’26
                </span>
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-grotesk font-black text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  STAGE HUD • DAY {eventState.current_day} •{" "}
                  {realtimeTransport === "websocket"
                    ? "WEBSOCKET LIVE"
                    : realtimeTransport === "supabase"
                    ? "SUPABASE LIVE"
                    : "CLOUD SYNC"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-grotesk font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              <span className="text-fest-yellow">GDG ON CAMPUS</span>
              <span>•</span>
              <span>NMIMS NAVI MUMBAI</span>
            </div>
          </div>
        </div>

        {/* Center Current Game / Auction Banner */}
        <div className="hidden md:flex flex-col items-center bg-black/80 border-2 border-fest-yellow px-6 py-2 rounded-2xl retro-shadow-yellow shadow-[4px_4px_0px_#FFE500]">
          <span className="text-[10px] text-fest-yellow uppercase font-grotesk font-black tracking-widest flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>NOW ACTIVE ON MAIN STAGE</span>
          </span>
          <span className="font-anton text-xl lg:text-2xl text-white tracking-wide uppercase">
            {eventState.current_day === 1 
              ? (activeGame ? `${activeGame.name}` : "DAY 1 ARENA ATTRACTIONS")
              : (activeAuctionQuestion ? `THE AUCTION • Q#${activeAuctionQuestion.question_number} (${activeAuctionQuestion.category})` : "DAY 2: TECH AUCTION")}
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
            {eventState.event_status === "FINISHED" ? "PIXELPALOOZA CHAMPIONS" : "WHO'S HEADLINING PIXELPALOOZA?"}
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
                  <AnimatedCounter value={eventState.current_day === 1 ? top3[1].day1_score : top3[1].total_score} /> <span className="text-xl">PTS</span>
                </div>
                <div className="mt-2 text-xs font-grotesk font-bold text-slate-600">
                  Wallet: {top3[1].current_wallet} pts • {top3[1].games_played} Games
                </div>
              </div>
            )}

            {/* 1st Place Gold (Center Elevated) */}
            {top3[0] && (
              <div className="order-1 md:order-2 bg-fest-yellow text-black border-4 border-black rounded-3xl p-8 retro-shadow-black text-center md:-mt-4 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <Crown className="w-8 h-8 fill-black animate-bounce" />
                </div>
                <span className="font-grotesk text-xs uppercase font-black px-4 py-1.5 rounded-full bg-black text-white mb-3 inline-block shadow-[2px_2px_0px_#FFE500]">
                  #1 HEADLINER GOLD
                </span>
                <h3 className="font-anton text-4xl sm:text-5xl uppercase tracking-tight truncate my-1">
                  {top3[0].team.name}
                </h3>
                <p className="font-grotesk text-xs uppercase font-bold text-black/80 mb-4">
                  CAPTAIN: {top3[0].team.captain}
                </p>
                <div className="font-anton text-6xl text-black tracking-tight">
                  <AnimatedCounter value={eventState.current_day === 1 ? top3[0].day1_score : top3[0].total_score} /> <span className="text-2xl">PTS</span>
                </div>
                <div className="mt-3 text-xs font-grotesk font-black uppercase text-black/80">
                  Spendable Wallet: {top3[0].current_wallet} PTS • {top3[0].games_played} Games Played
                </div>
              </div>
            )}

            {/* 3rd Place Bronze */}
            {top3[2] && (
              <div className="order-3 bg-white text-black border-4 border-black rounded-3xl p-6 retro-shadow-black text-center">
                <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded bg-amber-200 text-amber-900 border border-black mb-3 inline-block">
                  #3 BRONZE TIER
                </span>
                <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight truncate">
                  {top3[2].team.name}
                </h3>
                <p className="font-grotesk text-xs uppercase font-bold text-slate-600 mb-3">
                  CAPTAIN: {top3[2].team.captain}
                </p>
                <div className="font-anton text-5xl text-black">
                  <AnimatedCounter value={eventState.current_day === 1 ? top3[2].day1_score : top3[2].total_score} /> <span className="text-xl">PTS</span>
                </div>
                <div className="mt-2 text-xs font-grotesk font-bold text-slate-600">
                  Wallet: {top3[2].current_wallet} pts • {top3[2].games_played} Games
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-12 bg-black/60 border-2 border-slate-800 rounded-3xl mb-8">
            <p className="font-anton text-2xl text-slate-400 uppercase">AWAITING ARENA SQUAD QUALIFIERS</p>
          </div>
        )}

        {/* Runner-ups Bar */}
        {runnerUps.length > 0 && (
          <div className="bg-black/80 border-2 border-white/20 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-grotesk">
            {runnerUps.map((runner) => (
              <div key={runner.team.id} className="flex items-center gap-2">
                <span className="font-anton text-slate-500">#{runner.rank}</span>
                <span className="font-anton text-white uppercase">{runner.team.name}:</span>
                <span className="font-anton text-fest-yellow">
                  {eventState.current_day === 1 ? runner.day1_score : runner.total_score} PTS
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Ticker at bottom */}
      <footer className="bg-black/95 border-t-2 border-white/20 px-6 py-3 flex items-center justify-between text-xs font-grotesk z-20">
        <div className="flex items-center gap-2 text-fest-yellow font-bold uppercase truncate max-w-3xl">
          <span className="w-2 h-2 rounded-full bg-fest-pink animate-ping" />
          <span>{getLastUpdateText()}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>REALTIME TOURNAMENT SYNC</span>
        </div>
      </footer>
    </div>
  );
}
