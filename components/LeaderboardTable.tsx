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
  Bug,
  Clock,
  Bot,
  Trophy,
  Zap,
  Mic,
  Radio,
  Users
} from "lucide-react";
import { TeamStanding, Game } from "@/types/arena";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface LeaderboardTableProps {
  standings: TeamStanding[];
  games: Game[];
}

export function LeaderboardTable({ standings, games }: LeaderboardTableProps) {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "games" | "streak">("score");

  // Filter and sort
  const filteredStandings = useMemo(() => {
    let result = [...standings];

    if (selectedGameFilter !== "all") {
      result = result.map((item) => {
        const gameXp = item.game_breakdown[selectedGameFilter] || 0;
        return {
          ...item,
          total_xp: gameXp,
        };
      });
    }

    if (sortBy === "score") {
      result.sort((a, b) => b.total_xp - a.total_xp);
    } else if (sortBy === "games") {
      result.sort((a, b) => b.games_played - a.games_played);
    } else if (sortBy === "streak") {
      result.sort((a, b) => b.streak - a.streak);
    }

    return result;
  }, [standings, selectedGameFilter, sortBy]);

  const getGameIcon = (slug: string) => {
    switch (slug) {
      case "tech-tambola": return Grid;
      case "tech-pictionary": return PenTool;
      case "debug-the-code": return Bug;
      case "tech-bomb-defusal": return Clock;
      case "ai-or-human": return Bot;
      case "tech-jeopardy": return Mic;
      case "code-relay": return Zap;
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
      {/* Filter and Sort Controls Bar */}
      <div className="bg-obsidian-900 border border-voxel-border p-3 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-voxel-sm">
        {/* Game Filters */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto text-xs font-mono">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-festival-pink" />
            ATTRACTION:
          </span>

          <button
            onClick={() => setSelectedGameFilter("all")}
            className={`px-2.5 py-1 text-xs font-bold transition-all ${
              selectedGameFilter === "all"
                ? "bg-festival-pink text-white font-black shadow-festival-pink"
                : "bg-obsidian-950 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            ALL STAGES
          </button>

          {games.map((g) => {
            const isSelected = selectedGameFilter === g.id;
            const Icon = getGameIcon(g.slug);
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGameFilter(g.id)}
                className={`px-2 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-festival-pink text-white font-bold shadow-festival-pink"
                    : "bg-obsidian-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="truncate max-w-[130px]">{g.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "games" | "streak")}
            className="bg-obsidian-950 border border-slate-700 text-festival-cyan px-2 py-1 text-xs font-mono focus:outline-none focus:border-festival-pink cursor-pointer"
          >
            <option value="score">HIGHEST SCORE ▼</option>
            <option value="games">STAGES PLAYED</option>
            <option value="streak">ACTIVE STREAK</option>
          </select>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="voxel-card border-2 border-voxel-border overflow-hidden shadow-voxel">
        {filteredStandings.length === 0 ? (
          /* Atmospheric Pre-Game Standby Card */
          <div className="p-12 text-center bg-obsidian-950/80">
            <div className="w-12 h-12 bg-obsidian-900 border border-slate-800 mx-auto flex items-center justify-center text-festival-cyan mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">
              ARENA SCORING GRID STANDING BY
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-4">
              No squads or scores have been dispatched yet. Registered teams will appear on this live grid as soon as organizers dispatch points.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-festival-pink text-white font-bold text-xs uppercase tracking-wider shadow-festival-pink hover:bg-pink-600 transition-all"
            >
              <span>ORGANIZER CONTROL BOOTH</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="bg-obsidian-950 border-b border-voxel-border text-[10px] tracking-widest uppercase text-slate-400">
                  <th className="py-3 px-4 w-16">RANK</th>
                  <th className="py-3 px-4">SQUAD & CAPTAIN</th>
                  <th className="py-3 px-4 hidden sm:table-cell">STAGES PLAYED</th>
                  <th className="py-3 px-4 hidden md:table-cell">LAST DISPATCH</th>
                  <th className="py-3 px-4 text-right">TOTAL SCORE (XP)</th>
                  <th className="py-3 px-4 text-center hidden lg:table-cell">STREAK</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <AnimatePresence>
                  {filteredStandings.map((item, index) => {
                    const rankNumber = String(index + 1).padStart(2, "0");
                    const isTop3 = index < 3;
                    const rankColor =
                      index === 0
                        ? "text-festival-emerald border-realm-gold"
                        : index === 1
                        ? "text-slate-200 border-slate-400"
                        : index === 2
                        ? "text-amber-400 border-amber-600"
                        : "text-slate-400 border-slate-700";

                    const maxPossibleXp = 1000;
                    const xpPercent = Math.min(100, Math.round((item.total_xp / maxPossibleXp) * 100));

                    return (
                      <motion.tr
                        key={item.team.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`hover:bg-obsidian-850/90 transition-colors group ${
                          isTop3 ? "bg-obsidian-900/60" : "bg-obsidian-950/40"
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-base font-bold font-mono ${rankColor}`}>
                              {rankNumber}
                            </span>
                            {index < 2 && item.total_xp > 0 && (
                              <span className="text-[10px] text-festival-emerald flex items-center font-bold">
                                <ArrowUp className="w-2.5 h-2.5" />
                                <span className="text-[8px]">1</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Squad & Captain */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-obsidian-950 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-festival-pink transition-colors shrink-0">
                              {item.team.music_icon || getTeamInitials(item.team.name)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-festival-pink transition-colors flex items-center gap-1.5">
                                <span>{item.team.name}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                CAPTAIN: {item.team.captain.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Stages Played */}
                        <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="inline-block px-2 py-0.5 bg-obsidian-950 border border-slate-800 text-xs text-slate-300">
                            {item.games_played} / 7 STAGES
                          </span>
                        </td>

                        {/* Last Dispatch */}
                        <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">
                          {item.last_score_delta !== undefined ? (
                            <div className="flex flex-col">
                              <span
                                className={`text-xs font-bold px-1.5 py-0.5 inline-block w-fit ${
                                  item.last_score_delta >= 0
                                    ? "bg-festival-emerald/15 text-festival-emerald border border-festival-emerald/30"
                                    : "bg-festival-redstone/15 text-festival-redstone border border-festival-redstone/30"
                                }`}
                              >
                                {item.last_score_delta >= 0 ? "+" : ""}
                                {item.last_score_delta} XP 🎵 {item.last_score_type === "PENALTY" ? "PENALTY" : ""}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase mt-0.5">
                                {item.last_game_name || "Special"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>

                        {/* Total Score (XP) */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span className="text-base font-bold text-white group-hover:text-festival-emerald transition-colors">
                                <AnimatedCounter value={item.total_xp} />
                              </span>
                              <span className="text-[11px] text-slate-400 font-semibold">XP</span>
                            </div>
                            <div className="w-20 h-1 bg-obsidian-950 border border-slate-800 mt-1 overflow-hidden">
                              <div
                                className="h-full bg-festival-emerald"
                                style={{ width: `${xpPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Streak */}
                        <td className="py-3 px-4 text-center whitespace-nowrap hidden lg:table-cell">
                          {item.streak > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                              <Flame className="w-3.5 h-3.5 fill-current" />
                              <span>{item.streak}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-600">0</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/teams/${item.team.id}`}
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-festival-pink transition-colors font-semibold"
                          >
                            <span className="hidden xl:inline">Squad Breakdown</span>
                            <span className="xl:hidden">Details</span>
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

        {/* Table Footer */}
        {filteredStandings.length > 0 && (
          <div className="bg-obsidian-950 border-t border-voxel-border px-4 py-3 flex items-center justify-between text-xs font-mono text-slate-400">
            <div>
              DISPLAYING ACTIVE QUALIFIERS (RANKS 01 - {String(filteredStandings.length).padStart(2, "0")} OF {standings.length} SQUADS)
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2 py-0.5 bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40" disabled>
                PREV
              </button>
              <span className="px-2 py-0.5 bg-festival-pink text-white font-bold">1</span>
              <button className="px-2 py-0.5 bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40" disabled>
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
