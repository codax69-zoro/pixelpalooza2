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
  Bug, 
  Clock, 
  Bot, 
  Trophy, 
  Zap, 
  Timer, 
  Award, 
  ChevronRight,
  Sparkles,
  Tent,
  Radio,
  Sliders,
  CheckCircle2,
  X
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export default function GamesHubPage() {
  const { games, activeGame } = useArena();
  const [selectedGameRules, setSelectedGameRules] = useState<{
    id: string;
    name: string;
    stage: string;
    rules: string[];
    scoring_type: string;
    duration: string;
    description: string;
  } | null>(null);

  const getGameIcon = (slug: string) => {
    switch (slug) {
      case "tech-tambola": return Grid;
      case "tech-pictionary": return PenTool;
      case "debug-the-code": return Bug;
      case "tech-bomb-defusal": return Clock;
      case "ai-or-human": return Bot;
      case "tech-jeopardy": return Zap;
      case "code-relay": return Sliders;
      default: return Trophy;
    }
  };

  const getGameAccentColor = (index: number) => {
    const colors = [
      { border: "border-fest-yellow", text: "text-fest-yellow", bg: "bg-fest-yellow/10", chip: "bg-fest-yellow text-black" },
      { border: "border-fest-cyan", text: "text-fest-cyan", bg: "bg-fest-cyan/10", chip: "bg-fest-cyan text-black" },
      { border: "border-fest-pink", text: "text-fest-pink", bg: "bg-fest-pink/10", chip: "bg-fest-pink text-white" },
      { border: "border-fest-coral", text: "text-fest-coral", bg: "bg-fest-coral/10", chip: "bg-fest-coral text-white" },
      { border: "border-emerald-400", text: "text-emerald-400", bg: "bg-emerald-400/10", chip: "bg-emerald-400 text-black" },
      { border: "border-purple-400", text: "text-purple-400", bg: "bg-purple-400/10", chip: "bg-purple-400 text-white" },
      { border: "border-fest-yellow", text: "text-fest-yellow", bg: "bg-fest-yellow/10", chip: "bg-fest-yellow text-black" },
    ];
    return colors[index % colors.length];
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
                [ 7 BIOME STAGES // ARENA PROTOCOL ]
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping inline-block" />
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-none">
              7 FESTIVAL ATTRACTIONS
            </h1>

            <p className="font-sans text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-medium">
              Physical competitive gaming stages conducted live across NMIMS Navi Mumbai. Referees verify algorithmic completions and stream XP directly to the master leaderboard.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/60 border-2 border-white/20 rounded-xl px-4 py-2.5 retro-shadow-black">
              <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">TOTAL ATTRACTIONS</span>
              <span className="font-anton text-2xl text-fest-yellow">7 LIVE STAGES</span>
            </div>
            <div className="bg-black/60 border-2 border-white/20 rounded-xl px-4 py-2.5 retro-shadow-black">
              <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block">MAX XP POOL</span>
              <span className="font-anton text-2xl text-fest-cyan">1,800+ XP</span>
            </div>
            <Link
              href="/admin"
              className="px-5 py-3 bg-fest-yellow text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all active:translate-y-0.5"
            >
              DISPATCH XP ⚡
            </Link>
          </div>
        </div>

        {/* 7 Attractions Grid with Neo-Brutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const Icon = getGameIcon(game.slug);
            const isActive = activeGame?.id === game.id;
            const accent = getGameAccentColor(index);
            const rules = Array.isArray(game.rules) ? game.rules : [];

            return (
              <div
                key={game.id}
                className={`bg-black/80 rounded-2xl border-4 p-6 flex flex-col justify-between transition-all duration-200 relative group hover:-translate-y-1.5 ${
                  isActive
                    ? "border-fest-yellow ring-4 ring-fest-yellow/20 retro-shadow-yellow shadow-[6px_6px_0px_#FFE500]"
                    : "border-black retro-shadow-black hover:border-white/50"
                }`}
              >
                {/* Active Stage Floating Ribbon */}
                {isActive && (
                  <div className="absolute -top-3.5 right-6 bg-fest-yellow text-black font-anton text-xs uppercase px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 animate-bounce">
                    <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                    <span>NOW ACTIVE ON STAGE</span>
                  </div>
                )}

                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-12 h-12 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center ${accent.text} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="font-grotesk text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                          STAGE {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-grotesk text-xs uppercase font-black text-fest-cyan">
                          {game.attraction_stage || `ZONE 0${index + 1}`}
                        </span>
                      </div>
                    </div>

                    <span className={`font-grotesk text-[10px] uppercase font-black px-2.5 py-1 rounded-md ${accent.chip} border border-black shadow-[1px_1px_0px_#000]`}>
                      +300 XP MAX
                    </span>
                  </div>

                  {/* Attraction Title */}
                  <h3 className="font-anton text-3xl uppercase tracking-tight text-white mb-2 group-hover:text-fest-yellow transition-colors leading-tight">
                    {game.name}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                    {game.description || "Fast-paced collegiate competitive technology sprint with live referee verification."}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    <span className="font-grotesk text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                      ⏱ {game.duration ? game.duration.toUpperCase() : "15 MIN"}
                    </span>
                    <span className="font-grotesk text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
                      🎯 {game.scoring_type?.toUpperCase() || "XP BASED"}
                    </span>
                  </div>

                  {/* Rules Preview */}
                  {rules.length > 0 && (
                    <div className="border-t border-white/10 pt-3 mb-4 space-y-1.5">
                      {rules.slice(0, 2).map((rule, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2 text-[11px] font-sans text-slate-300">
                          <span className="text-fest-yellow font-bold">›</span>
                          <span className="line-clamp-1">{rule}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inspect Action */}
                <button
                  onClick={() =>
                    setSelectedGameRules({
                      id: game.id,
                      name: game.name,
                      stage: game.attraction_stage || `Zone 0${index + 1}`,
                      rules: rules.length > 0 ? rules : ["Standard GDGOC tournament scoring applies.", "Referees evaluate accuracy and time taken.", "Zero unauthorized aids permitted."],
                      scoring_type: game.scoring_type || "Standard XP",
                      duration: game.duration || "15 minutes",
                      description: game.description || "Collegiate attraction stage.",
                    })
                  }
                  className="w-full py-2.5 px-4 bg-white/10 hover:bg-fest-yellow hover:text-black text-white font-grotesk text-xs uppercase font-black tracking-wider rounded-xl border-2 border-white/20 hover:border-black transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-y-0.5"
                >
                  <span>INSPECT STAGE RULES</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal: Interactive Rules Inspector */}
        {selectedGameRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white text-slate-900 border-4 border-black rounded-3xl max-w-lg w-full p-6 sm:p-8 retro-shadow-black relative">
              <button
                onClick={() => setSelectedGameRules(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-black hover:text-white transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-grotesk text-[10px] uppercase font-black px-2.5 py-0.5 bg-fest-magenta text-white rounded">
                  {selectedGameRules.stage}
                </span>
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-500">
                  DURATION: {selectedGameRules.duration}
                </span>
              </div>

              <h3 className="font-anton text-3xl uppercase tracking-tight text-black mb-3">
                {selectedGameRules.name}
              </h3>

              <p className="font-sans text-sm text-slate-700 mb-5 leading-relaxed">
                {selectedGameRules.description}
              </p>

              <h4 className="font-grotesk text-xs uppercase font-black tracking-wider text-black mb-2 flex items-center gap-1.5">
                <span>OFFICIAL STAGE RULES & PROTOCOL</span>
                <span className="text-fest-coral">●</span>
              </h4>

              <div className="space-y-2 mb-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                {selectedGameRules.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                    <span className="w-5 h-5 rounded-full bg-fest-yellow text-black font-anton text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="flex-1 py-3 px-4 bg-fest-yellow hover:bg-fest-coral hover:text-white text-black font-anton text-base uppercase tracking-wider rounded-xl border-3 border-black retro-shadow-black transition-all text-center"
                >
                  SCORE THIS STAGE IN BOOTH ⚡
                </Link>
                <button
                  onClick={() => setSelectedGameRules(null)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-black font-grotesk text-xs uppercase font-black rounded-xl border-2 border-black transition-all"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

        <FooterStatus />
      </main>
    </div>
  );
}
