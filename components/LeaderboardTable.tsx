"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUp, 
  Flame, 
  ChevronRight, 
  Filter, 
  Grid,
  PenTool,
  Clock,
  Bot,
  Trophy,
  Zap,
  Music,
  Users,
  Coins,
  Gavel,
  Crown
} from "lucide-react";
import { TeamStanding, Game } from "@/types/arena";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface LeaderboardTableProps {
  standings: TeamStanding[];
  games: Game[];
  initialTab?: "day1" | "day2" | "overall";
}

export function LeaderboardTable({ standings, games, initialTab = "overall" }: LeaderboardTableProps) {
  const [activeTab, setActiveTab] = useState<"day1" | "day2" | "overall">(initialTab);
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "wallet" | "games">("score");

  // Filter and sort based on active tab
  const filteredStandings = useMemo(() => {
    let result = [...standings];

    if (activeTab === "day1") {
      if (selectedGameFilter !== "all") {
        result = result.map((item) => ({
          ...item,
          day1_score: item.game_breakdown[selectedGameFilter] || 0,
        }));
      }
      if (sortBy === "score") {
        result.sort((a, b) => b.day1_score - a.day1_score || b.current_wallet - a.current_wallet);
      } else if (sortBy === "wallet") {
        result.sort((a, b) => b.current_wallet - a.current_wallet || b.day1_score - a.day1_score);
      } else if (sortBy === "games") {
        result.sort((a, b) => b.games_played - a.games_played || b.day1_score - a.day1_score);
      }
      return result.map((s, idx) => ({ ...s, rank: idx + 1 }));
    } else if (activeTab === "day2") {
      if (sortBy === "score") {
        result.sort((a, b) => b.day2_score - a.day2_score || b.questions_won - a.questions_won);
      } else if (sortBy === "wallet") {
        result.sort((a, b) => b.current_wallet - a.current_wallet || b.day2_score - a.day2_score);
      } else if (sortBy === "games") {
        result.sort((a, b) => b.questions_won - a.questions_won || b.day2_score - a.day2_score);
      }
      return result.map((s, idx) => ({ ...s, rank: idx + 1 }));
    } else {
      // Overall
      if (sortBy === "score") {
        result.sort((a, b) => b.total_score - a.total_score || b.current_wallet - a.current_wallet);
      } else if (sortBy === "wallet") {
        result.sort((a, b) => b.current_wallet - a.current_wallet || b.total_score - a.total_score);
      } else if (sortBy === "games") {
        result.sort((a, b) => b.games_played - a.games_played || b.total_score - a.total_score);
      }
      return result.map((s, idx) => ({ ...s, rank: idx + 1 }));
    }
  }, [standings, activeTab, selectedGameFilter, sortBy]);

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

  const getTeamInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full my-8">
      {/* 2-Day Tab Selectors in Stitch Festival Style */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border-2 border-white/20 retro-shadow-black">
          <button
            onClick={() => { setActiveTab("day1"); setSelectedGameFilter("all"); }}
            className={`px-5 py-2.5 rounded-xl font-anton text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "day1"
                ? "bg-fest-yellow text-black shadow-[2px_2px_0px_#000]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            DAY 1 (5 GAMES)
          </button>

          <button
            onClick={() => { setActiveTab("day2"); setSelectedGameFilter("all"); }}
            className={`px-5 py-2.5 rounded-xl font-anton text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "day2"
                ? "bg-fest-cyan text-black shadow-[2px_2px_0px_#000]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Gavel className="w-4 h-4" />
            DAY 2 (THE AUCTION)
          </button>

          <button
            onClick={() => { setActiveTab("overall"); setSelectedGameFilter("all"); }}
            className={`px-5 py-2.5 rounded-xl font-anton text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "overall"
                ? "bg-fest-coral text-white shadow-[2px_2px_0px_#000]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Crown className="w-4 h-4" />
            OVERALL TOURNAMENT
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs font-mono">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "wallet" | "games")}
            className="bg-black text-fest-yellow font-grotesk text-xs uppercase font-bold px-2 py-1 rounded border border-slate-700 focus:outline-none"
          >
            <option value="score">HIGHEST SCORE ▼</option>
            <option value="wallet">SPENDABLE WALLET ▼</option>
            <option value="games">{activeTab === "day2" ? "QUESTIONS WON" : "GAMES PLAYED"}</option>
          </select>
        </div>
      </div>

      {/* Day 1 Specific Sub-Attraction Filters */}
      {activeTab === "day1" && (
        <div className="bg-slate-900/80 border border-slate-800 p-3 mb-4 rounded-2xl flex flex-wrap items-center gap-2 shadow-voxel-sm">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-fest-yellow" />
            FILTER ATTRACTION:
          </span>

          <button
            onClick={() => setSelectedGameFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-anton uppercase transition-all ${
              selectedGameFilter === "all"
                ? "bg-fest-yellow text-black"
                : "bg-black/60 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            ALL 5 GAMES
          </button>

          {games.filter((g) => g.day === 1 && g.active).map((g) => {
            const isSelected = selectedGameFilter === g.id;
            const Icon = getGameIcon(g.slug);
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGameFilter(g.id)}
                className={`px-3 py-1 rounded-lg text-xs font-anton uppercase flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-fest-cyan text-black"
                    : "bg-black/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{g.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="bg-slate-900/90 border-4 border-black rounded-3xl overflow-hidden retro-shadow-black">
        {filteredStandings.length === 0 ? (
          <div className="p-12 text-center bg-black/40">
            <div className="w-12 h-12 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-fest-yellow mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-anton text-xl text-white uppercase tracking-wider mb-1">
              FESTIVAL ARENA SCORING GRID STANDING BY
            </h3>
            <p className="font-sans text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
              Registered squads will appear here in real-time as organizers record scores and game participation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/80 border-b-2 border-white/10 font-grotesk text-xs uppercase text-slate-400 tracking-wider">
                  <th className="py-4 px-4 w-16 text-center">RANK</th>
                  <th className="py-4 px-4">SQUAD</th>
                  <th className="py-4 px-4 text-right">SPENDABLE WALLET</th>
                  {activeTab === "day1" && (
                    <>
                      <th className="py-4 px-4 text-center">DAY 1 GAMES</th>
                      <th className="py-4 px-4 text-right">DAY 1 SCORE</th>
                    </>
                  )}
                  {activeTab === "day2" && (
                    <>
                      <th className="py-4 px-4 text-center">QUESTIONS WON</th>
                      <th className="py-4 px-4 text-right">AUCTION SCORE</th>
                    </>
                  )}
                  {activeTab === "overall" && (
                    <>
                      <th className="py-4 px-4 text-center">GAMES PLAYED</th>
                      <th className="py-4 px-4 text-right">DAY 1 PTS</th>
                      <th className="py-4 px-4 text-right">DAY 2 PTS</th>
                      <th className="py-4 px-4 text-right font-black text-white">OVERALL SCORE</th>
                    </>
                  )}
                  <th className="py-4 px-4 text-right">DOSSIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                <AnimatePresence>
                  {filteredStandings.map((item, index) => {
                    const isPodium = item.rank <= 3;
                    const rankBadgeColor =
                      item.rank === 1
                        ? "bg-fest-yellow text-black border-2 border-black"
                        : item.rank === 2
                        ? "bg-slate-200 text-black border-2 border-black"
                        : item.rank === 3
                        ? "bg-amber-600 text-white border-2 border-black"
                        : "bg-slate-800 text-slate-300";

                    return (
                      <motion.tr
                        key={item.team.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`transition-colors hover:bg-white/5 ${
                          isPodium ? "bg-white/[0.02]" : ""
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-anton text-sm ${rankBadgeColor} shadow-[2px_2px_0px_#000]`}
                          >
                            {item.rank}
                          </span>
                        </td>

                        {/* Squad Name & Captain */}
                        <td className="py-4 px-4">
                          <Link
                            href={`/teams/${item.team.id}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-anton text-sm text-fest-yellow group-hover:scale-105 transition-transform">
                              {getTeamInitials(item.team.name)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-anton text-lg uppercase tracking-wide text-white group-hover:text-fest-yellow transition-colors">
                                  {item.team.name}
                                </span>
                                {item.rank === 1 && (
                                  <Crown className="w-4 h-4 text-fest-yellow inline-block animate-bounce" />
                                )}
                              </div>
                              <span className="font-sans text-xs text-slate-400 block">
                                Lead: {item.team.captain}
                              </span>
                            </div>
                          </Link>
                        </td>

                        {/* Available Wallet */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-fest-yellow" />
                            <span className="font-anton text-lg text-fest-yellow">
                              <AnimatedCounter value={item.current_wallet} />
                            </span>
                            <span className="text-[10px] font-grotesk text-slate-400">PTS</span>
                          </div>
                        </td>

                        {/* Tab-dependent columns */}
                        {activeTab === "day1" && (
                          <>
                            <td className="py-4 px-4 text-center font-anton text-base text-fest-cyan">
                              {item.games_played} / 5
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-anton text-2xl text-white">
                                <AnimatedCounter value={item.day1_score} />
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === "day2" && (
                          <>
                            <td className="py-4 px-4 text-center font-anton text-base text-fest-pink">
                              {item.questions_won} WON
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-anton text-2xl text-fest-pink">
                                <AnimatedCounter value={item.day2_score} />
                              </span>
                            </td>
                          </>
                        )}

                        {activeTab === "overall" && (
                          <>
                            <td className="py-4 px-4 text-center font-anton text-sm text-slate-300">
                              {item.games_played} Games
                            </td>
                            <td className="py-4 px-4 text-right font-anton text-sm text-slate-400">
                              {item.day1_score}
                            </td>
                            <td className="py-4 px-4 text-right font-anton text-sm text-fest-pink">
                              {item.day2_score}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-anton text-3xl text-fest-yellow tracking-tight">
                                <AnimatedCounter value={item.total_score} />
                              </span>
                            </td>
                          </>
                        )}

                        {/* Link to Dossier */}
                        <td className="py-4 px-4 text-right">
                          <Link
                            href={`/teams/${item.team.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-fest-yellow hover:text-black rounded-lg text-xs font-grotesk uppercase font-bold text-white transition-colors"
                          >
                            DOSSIER
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
