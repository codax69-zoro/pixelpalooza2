"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import { FooterStatus } from "@/components/FooterStatus";
import { PixelBunting } from "@/components/PixelBunting";
import { FestoonLights } from "@/components/FestoonLights";
import { 
  Grid, 
  PenTool, 
  Bot, 
  Trophy, 
  Zap, 
  ChevronRight,
  Music,
  Coins,
  Gavel,
  ShieldAlert,
  X,
  HelpCircle,
  Flame,
  Award
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export default function GamesHubPage() {
  const { games, day1Games, day2Games, activeGame, eventState, activeAuctionQuestion, teams } = useArena();
  const [selectedGameRules, setSelectedGameRules] = useState<{
    id: string;
    name: string;
    stage: string;
    day: number;
    difficulty: string;
    entry_cost: number;
    rules: string[];
    scoring_type: string;
    duration: string;
    description: string;
  } | null>(null);

  const getGameIcon = (slug: string) => {
    switch (slug) {
      case "balloon-cup-tower": return Trophy;
      case "gdg-logo-puzzle": return Grid;
      case "tech-pictionary": return PenTool;
      case "tech-tambola": return Music;
      case "ai-or-human": return Bot;
      case "tech-auction": return Zap;
      default: return Trophy;
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-950 text-emerald-400 border border-emerald-800";
      case "Medium":
        return "bg-amber-950 text-amber-400 border border-amber-800";
      case "Hard":
        return "bg-red-950 text-red-400 border border-red-800";
      default:
        return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans bg-[#1E1B4B] text-white selection:bg-fest-yellow selection:text-black min-h-screen">
      <Navbar />
      <LiveFeedTicker />
      <FestoonLights />
      <PixelBunting />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 pt-8 pb-16">
        {/* Header Hero matching Stitch Royal Cobalt Theme */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-fest-yellow pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow bg-yellow-950/80 border border-fest-yellow px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#000]">
                [ 2-DAY STRATEGIC EVENT SCHEDULE ]
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping inline-block" />
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-none">
              EVENT ATTRACTIONS
            </h1>

            <p className="font-sans text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-medium">
              Teams start with 1500 event wallet points. Games have entry costs inversely proportional to difficulty. Participation is optional — choose where to spend or save your budget for Day 2&apos;s Tech Auction!
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/60 border-2 border-white/20 rounded-xl px-4 py-2.5 retro-shadow-black">
              <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">STARTING WALLET</span>
              <span className="font-anton text-2xl text-fest-yellow">1500 PTS</span>
            </div>
            <div className="bg-black/60 border-2 border-white/20 rounded-xl px-4 py-2.5 retro-shadow-black">
              <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">DAY 1</span>
              <span className="font-anton text-2xl text-fest-cyan">5 PHYSICAL GAMES</span>
            </div>
            <div className="bg-black/60 border-2 border-white/20 rounded-xl px-4 py-2.5 retro-shadow-black">
              <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">DAY 2</span>
              <span className="font-anton text-2xl text-fest-pink">THE AUCTION</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DAY 1: 5 PHYSICAL GAMES SECTION                                           */}
        {/* ========================================================================= */}
        <div className="mb-14">
          <div className="flex items-center justify-between border-b-2 border-fest-yellow/40 pb-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fest-yellow text-black font-anton text-sm uppercase rounded-lg shadow-[2px_2px_0px_#000]">
                DAY 1
              </span>
              <h2 className="font-anton text-3xl sm:text-4xl uppercase text-white tracking-wide">
                5 PHYSICAL ARENA GAMES
              </h2>
            </div>
            <span className="font-grotesk text-xs text-slate-400 hidden sm:inline">
              Teams can enter any combination or skip games to preserve points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {day1Games.map((game, index) => {
              const Icon = getGameIcon(game.slug);
              const isActive = eventState.current_day === 1 && activeGame?.id === game.id;
              const rules = Array.isArray(game.rules) ? game.rules : [];

              return (
                <div
                  key={game.id}
                  className={`bg-black/80 rounded-3xl border-4 p-6 flex flex-col justify-between transition-all duration-200 relative group hover:-translate-y-1.5 ${
                    isActive
                      ? "border-fest-yellow ring-4 ring-fest-yellow/20 shadow-[6px_6px_0px_#FFE500]"
                      : "border-black retro-shadow-black hover:border-white/50"
                  }`}
                >
                  {/* Active Game Ribbon */}
                  {isActive && (
                    <div className="absolute -top-3.5 right-6 bg-fest-yellow text-black font-anton text-xs uppercase px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 animate-bounce">
                      <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                      <span>NOW LIVE IN ARENA</span>
                    </div>
                  )}

                  <div>
                    {/* Header with Number & Difficulty Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-anton text-lg text-fest-yellow">
                        0{index + 1}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-grotesk uppercase font-black px-2.5 py-1 rounded-full ${getDifficultyBadge(game.difficulty)}`}>
                          {game.difficulty}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-fest-yellow">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Game Title */}
                    <h3 className="font-anton text-2xl uppercase tracking-wide text-white mb-1 group-hover:text-fest-yellow transition-colors">
                      {game.name}
                    </h3>

                    {/* Cost Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-grotesk text-xs uppercase font-black px-2.5 py-1 bg-fest-coral text-white rounded-lg border border-black shadow-[1px_1px_0px_#000] flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        ENTRY: {game.entry_cost} PTS
                      </span>
                      <span className="font-grotesk text-[11px] text-slate-400">
                        {game.duration}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {game.description}
                    </p>
                  </div>

                  {/* Rules Footer */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-grotesk text-slate-400">
                      {rules.length} official tournament rules
                    </span>

                    <button
                      onClick={() =>
                        setSelectedGameRules({
                          id: game.id,
                          name: game.name,
                          stage: game.attraction_stage || "Physical Arena",
                          day: game.day,
                          difficulty: game.difficulty,
                          entry_cost: game.entry_cost,
                          rules: game.rules,
                          scoring_type: game.scoring_type,
                          duration: game.duration,
                          description: game.description,
                        })
                      }
                      className="px-3 py-1.5 bg-white/10 hover:bg-fest-yellow hover:text-black rounded-lg text-xs font-grotesk uppercase font-bold text-white transition-colors flex items-center gap-1"
                    >
                      HOW TO PLAY
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DAY 2: THE TECH AUCTION SECTION                                           */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-fest-cyan/40 pb-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-fest-cyan text-black font-anton text-sm uppercase rounded-lg shadow-[2px_2px_0px_#000]">
                DAY 2
              </span>
              <h2 className="font-anton text-3xl sm:text-4xl uppercase text-white tracking-wide">
                THE TECH AUCTION (50–70 QUESTIONS)
              </h2>
            </div>
            <span className="font-grotesk text-xs text-fest-cyan hidden sm:inline">
              Spend remaining Day 1 wallet to bid on questions & earn championship rewards
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-blue-950/80 rounded-3xl border-4 border-black p-6 sm:p-8 retro-shadow-black">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-fest-cyan text-black font-anton text-xs uppercase rounded-full mb-3">
                  <Gavel className="w-3.5 h-3.5" />
                  DAY 2 GRAND CLIMAX
                </div>

                <h3 className="font-anton text-3xl sm:text-5xl uppercase text-white tracking-tight mb-3">
                  BUY THE QUESTION. ANSWER IT. EARN THE POINTS.
                </h3>

                <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  Day 2 is not a standard game. It is a live auction of 50–70 high-stakes technology questions. Squads use their remaining budget points from Day 1 to outbid rivals. The winning bidder gets exclusive answering rights. A correct answer delivers massive tournament points toward the champion podium.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-black/50 border border-slate-700 rounded-2xl p-3">
                    <span className="font-grotesk text-[10px] text-slate-400 uppercase font-bold block">QUESTION POOL</span>
                    <span className="font-anton text-xl text-fest-yellow">50–70 QUESTIONS</span>
                  </div>
                  <div className="bg-black/50 border border-slate-700 rounded-2xl p-3">
                    <span className="font-grotesk text-[10px] text-slate-400 uppercase font-bold block">CURRENCY</span>
                    <span className="font-anton text-xl text-fest-cyan">REMAINING WALLET</span>
                  </div>
                  <div className="bg-black/50 border border-slate-700 rounded-2xl p-3">
                    <span className="font-grotesk text-[10px] text-slate-400 uppercase font-bold block">PAYOUTS</span>
                    <span className="font-anton text-xl text-fest-coral">+250 TO +800 PTS</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/leaderboard"
                    className="px-6 py-3.5 bg-fest-yellow hover:bg-fest-gold text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black transition-all"
                  >
                    CHECK LEADERBOARD ↗
                  </Link>
                  <Link
                    href="/admin"
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-grotesk text-xs uppercase font-bold rounded-xl border border-white/20 transition-all"
                  >
                    AUCTIONEER CONSOLE
                  </Link>
                </div>
              </div>

              {/* Auction Live Preview Card */}
              <div className="lg:col-span-5 bg-black/80 border-2 border-fest-cyan/40 rounded-2xl p-6 retro-shadow-black">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping" />
                    <span className="font-anton text-base text-fest-cyan uppercase">
                      {eventState.current_day === 2 ? "🔴 AUCTION LIVE ON MAIN STAGE" : "AUCTION PREVIEW"}
                    </span>
                  </div>
                  <span className="text-xs font-grotesk text-slate-400 font-bold uppercase">
                    Q#{activeAuctionQuestion?.question_number || 1}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-grotesk uppercase font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                    {activeAuctionQuestion?.category} • {activeAuctionQuestion?.difficulty}
                  </span>
                  <p className="font-sans text-sm font-semibold text-white mt-2 leading-relaxed">
                    &ldquo;{activeAuctionQuestion?.question_text}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 rounded-xl p-3 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">BASE BID</span>
                    <span className="font-anton text-base text-slate-200">{activeAuctionQuestion?.base_price} PTS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">REWARD POOL</span>
                    <span className="font-anton text-base text-fest-yellow">+{activeAuctionQuestion?.reward_points} PTS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <FooterStatus />
      </main>

      {/* Rules Modal */}
      {selectedGameRules && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-4 border-black rounded-3xl max-w-xl w-full p-6 retro-shadow-black">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block mb-1">
                  DAY {selectedGameRules.day} ATTRACTION BRIEFING
                </span>
                <h3 className="font-anton text-3xl uppercase text-white">
                  {selectedGameRules.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGameRules(null)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-grotesk uppercase font-black px-2.5 py-1 rounded ${getDifficultyBadge(selectedGameRules.difficulty)}`}>
                DIFFICULTY: {selectedGameRules.difficulty}
              </span>
              <span className="text-xs font-grotesk uppercase font-black px-2.5 py-1 bg-fest-coral text-white rounded">
                ENTRY COST: {selectedGameRules.entry_cost} PTS
              </span>
              <span className="text-xs font-grotesk text-slate-400">
                Duration: {selectedGameRules.duration}
              </span>
            </div>

            <p className="font-sans text-xs text-slate-300 mb-4 leading-relaxed">
              {selectedGameRules.description}
            </p>

            <div className="mb-6">
              <span className="font-grotesk text-xs uppercase font-black text-slate-400 tracking-wider block mb-2">
                OFFICIAL TOURNAMENT RULES:
              </span>
              <ul className="space-y-2 text-xs font-sans text-slate-200">
                {selectedGameRules.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-anton text-fest-yellow mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedGameRules(null)}
                className="px-6 py-2.5 bg-fest-yellow text-black font-anton text-sm uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_#000]"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
