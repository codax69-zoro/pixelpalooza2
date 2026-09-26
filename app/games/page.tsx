"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import { FooterStatus } from "@/components/FooterStatus";
import { PixelBunting } from "@/components/PixelBunting";
import { 
  Grid, 
  PenTool, 
  Bug, 
  Clock, 
  Bot, 
  Trophy, 
  Zap, 
  Timer, 
  Award, 
  ChevronDown,
  ChevronUp,
  Tent,
  Mic,
  Music
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export default function GamesHubPage() {
  const { games, activeGame } = useArena();
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedGameId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 flex flex-col font-mono">
      <Navbar />
      <LiveFeedTicker />
      <PixelBunting />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 pt-6 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-festival-pink font-bold mb-1 tracking-wider uppercase">
            <span>PIXELPALOOZA FESTIVAL ATTRACTIONS & STAGES</span>
            <span className="w-2 h-2 rounded-full bg-festival-pink inline-block animate-pulse" />
          </div>

          <div className="text-xs text-realm-gold font-bold italic tracking-wide mb-1">
            &quot;Where ideas get Unhinged&quot; · GDGOC NMIMS NAVI MUMBAI
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            FESTIVAL ATTRACTIONS // PROTOCOL
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            All 7 physical arena attractions conducted live by GDGOC organizers during Pixelpalooza. 
            Referees verify completions and dispatch points directly to the live scoring grid.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const Icon = getGameIcon(game.slug);
            const isExpanded = expandedGameId === game.id;
            const isActive = activeGame?.id === game.id;

            return (
              <div
                key={game.id}
                className={`voxel-card border-2 transition-all p-5 flex flex-col justify-between shadow-voxel ${
                  isActive
                    ? "border-festival-pink bg-obsidian-850 shadow-festival-pink ring-1 ring-festival-pink"
                    : "border-voxel-border bg-obsidian-900 hover:border-slate-600"
                }`}
              >
                <div>
                  {/* Top Bar with Number & Stage Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-obsidian-950 border border-slate-700 flex items-center justify-center text-festival-pink">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase block">
                          STAGE {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-black text-festival-cyan uppercase">
                          {game.attraction_stage || "Attraction"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black px-2 py-0.5 border border-amber-600 bg-amber-950/60 text-realm-gold">
                        {game.stage_tag || "ARENA"}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-bold text-festival-pink animate-pulse">
                          ● ACTIVE STAGE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">
                    {game.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {game.description}
                  </p>

                  {/* Meta Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="bg-obsidian-950 p-2 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                      <Timer className="w-3.5 h-3.5 text-festival-cyan" />
                      <span className="text-[11px] truncate">{game.duration}</span>
                    </div>

                    <div className="bg-obsidian-950 p-2 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                      <Award className="w-3.5 h-3.5 text-realm-gold" />
                      <span className="text-[11px] truncate">{game.scoring_type}</span>
                    </div>
                  </div>

                  {/* Expandable Rules Section */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        OFFICIAL ATTRACTION RULES:
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        {game.rules.map((rule, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5 text-[11px]">
                            <span className="text-festival-pink font-bold mt-0.5">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleExpand(game.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                  >
                    <span>{isExpanded ? "HIDE RULES" : "VIEW ATTRACTION RULES"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <Link
                    href={`/leaderboard`}
                    className="text-xs text-festival-emerald hover:underline font-bold"
                  >
                    STANDINGS →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <FooterStatus />
      </main>
    </div>
  );
}
