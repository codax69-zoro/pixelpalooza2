"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import { FooterStatus } from "@/components/FooterStatus";
import { PixelBunting } from "@/components/PixelBunting";
import { FestoonLights } from "@/components/FestoonLights";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { 
  ArrowLeft, 
  Crown, 
  Flame, 
  Users, 
  Trophy, 
  Clock,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Gamepad2
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export default function TeamProfilePage() {
  const params = useParams();
  const teamId = params?.id as string;
  const { teams, standings, games, scoreEvents } = useArena();

  const team = teams.find((t) => t.id === teamId);
  const standing = standings.find((s) => s.team.id === team?.id);

  const teamEvents = scoreEvents
    .filter((e) => e.team_id === team?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (!team) {
    return (
      <div className="flex-1 flex flex-col font-sans bg-[#0B0F19] text-white min-h-screen selection:bg-fest-yellow selection:text-black">
        <Navbar />
        <LiveFeedTicker />
        <FestoonLights />
        <PixelBunting />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-20 text-center">
          <div className="bg-white text-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 retro-shadow-black">
            <span className="font-grotesk text-xs uppercase font-black px-3 py-1 bg-fest-magenta text-white rounded">
              ERROR 404
            </span>
            <h2 className="font-anton text-4xl sm:text-5xl uppercase text-black my-4">
              SQUAD DOSSIER NOT FOUND
            </h2>
            <p className="font-sans text-sm text-slate-600 mb-8 max-w-md mx-auto">
              The requested squad identifier is not present in the active festival registry.
            </p>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-fest-yellow text-black font-anton text-lg uppercase tracking-wider rounded-xl border-3 border-black retro-shadow-black hover:bg-black hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>RETURN TO LEADERBOARD</span>
            </Link>
          </div>
        </main>
        <FooterStatus />
      </div>
    );
  }

  const isLeader = standing?.rank === 1;
  const isPodium = standing?.rank && standing.rank <= 3;

  return (
    <div className="flex-1 flex flex-col font-sans bg-[#0D9488] text-white selection:bg-fest-yellow selection:text-black min-h-screen">
      <Navbar />
      <LiveFeedTicker />
      <FestoonLights />
      <PixelBunting />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 lg:px-6 pt-8 pb-16">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 border border-white/20 text-xs font-grotesk font-bold uppercase tracking-wider text-slate-200 hover:text-fest-yellow hover:border-fest-yellow transition-all shadow-[2px_2px_0px_#000]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO LIVE LEADERBOARD</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fest-yellow animate-ping" />
            <span className="font-grotesk text-xs uppercase font-black tracking-widest text-black bg-fest-yellow px-3 py-1 rounded-full border border-black shadow-[2px_2px_0px_#000]">
              [ SQUAD DOSSIER ]
            </span>
          </div>
        </div>

        {/* Hero Passport Dossier Card (Neo-Brutalist White Card) */}
        <div className="bg-white text-slate-900 border-4 border-black rounded-3xl p-6 sm:p-10 retro-shadow-black mb-10 relative overflow-hidden">
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-fest-yellow via-fest-coral to-fest-pink" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-2">
            <div>
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded-md bg-black text-white border border-black">
                  COLLEGIATE DIVISION
                </span>
                {isLeader ? (
                  <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded-md bg-fest-yellow text-black border border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>#1 FESTIVAL HEADLINER</span>
                  </span>
                ) : isPodium ? (
                  <span className="font-grotesk text-xs uppercase font-black px-3 py-1 rounded-md bg-fest-coral text-white border border-black shadow-[2px_2px_0px_#000]">
                    TOP 3 MAIN STAGE PODIUM
                  </span>
                ) : (
                  <span className="font-grotesk text-xs uppercase font-bold px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
                    UNDERCARD SQUAD
                  </span>
                )}
              </div>

              {/* Squad Name */}
              <h1 className="font-anton text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-black leading-none mb-3">
                {team.name}
              </h1>

              {/* Captain & Roster */}
              <div className="space-y-1.5">
                <p className="font-grotesk text-sm uppercase font-bold text-slate-700 flex items-center gap-2">
                  <span className="text-fest-magenta font-black">LEAD CAPTAIN:</span>
                  <span className="px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded font-black text-black">
                    {team.captain || "UNASSIGNED"}
                  </span>
                </p>

                {team.members && team.members.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="font-grotesk text-xs uppercase font-bold text-slate-500 mr-1">
                      ROSTER:
                    </span>
                    {team.members.map((member, idx) => (
                      <span
                        key={idx}
                        className="font-grotesk text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Score & Rank Scorecard */}
            <div className="flex items-center gap-4 bg-slate-50 border-3 border-black rounded-2xl p-5 retro-shadow-black">
              <div className="text-center px-4 border-r-2 border-slate-300">
                <span className="font-grotesk text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-1">
                  CURRENT RANK
                </span>
                <span className="font-anton text-5xl text-black">
                  #{standing?.rank || "-"}
                </span>
              </div>

              <div className="text-center px-4">
                <span className="font-grotesk text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-1">
                  TOTAL FESTIVAL XP
                </span>
                <span className="font-anton text-5xl text-fest-magenta">
                  <AnimatedCounter value={standing?.total_xp || 0} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Attractions Performance & Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 spans): Stage Performance Matrix */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/85 text-white border-4 border-black rounded-3xl p-6 sm:p-8 retro-shadow-black">
              <div className="flex items-center justify-between mb-6 border-b-2 border-white/20 pb-4">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-fest-yellow" />
                  <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                    7 BIOME STAGE BREAKDOWN
                  </h3>
                </div>
                <span className="font-grotesk text-xs uppercase font-bold text-fest-cyan">
                  {games.length} ATTRACTIONS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {games.map((game, gIdx) => {
                  const gamePoints = teamEvents
                    .filter((e) => e.game_id === game.id)
                    .reduce((acc, curr) => acc + curr.points, 0);
                  const played = gamePoints > 0;

                  return (
                    <div
                      key={game.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        played
                          ? "bg-white/10 border-fest-yellow shadow-[2px_2px_0px_#FFE500]"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400">
                          STAGE 0{gIdx + 1}
                        </span>
                        <span
                          className={`font-grotesk text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                            played
                              ? "bg-fest-yellow text-black"
                              : "bg-white/10 text-slate-400"
                          }`}
                        >
                          {played ? "COMPLETED" : "PENDING"}
                        </span>
                      </div>

                      <h4 className="font-anton text-xl uppercase tracking-tight text-white mb-2 truncate">
                        {game.name}
                      </h4>

                      <div className="flex items-center justify-between text-xs font-grotesk font-bold">
                        <span className="text-slate-400">XP EARNED:</span>
                        <span className={`text-base font-anton ${played ? "text-fest-cyan" : "text-slate-500"}`}>
                          +{gamePoints} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1 span): Score Event Timeline */}
          <div className="space-y-6">
            <div className="bg-black/85 text-white border-4 border-black rounded-3xl p-6 retro-shadow-black">
              <div className="flex items-center justify-between mb-4 border-b-2 border-white/20 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-fest-pink" />
                  <h3 className="font-anton text-xl uppercase tracking-wider text-white">
                    LIVE COMBAT LOG
                  </h3>
                </div>
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400">
                  {teamEvents.length} DISPATCHES
                </span>
              </div>

              {teamEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-sans text-xs">
                  No score transactions logged yet for this squad. Referees will dispatch points once attractions kick off!
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {teamEvents.map((evt) => {
                    const game = games.find((g) => g.id === evt.game_id);
                    const isPenalty = evt.points < 0 || evt.type === "PENALTY";
                    const isReversal = evt.type === "REVERSAL";

                    return (
                      <div
                        key={evt.id}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          isPenalty
                            ? "bg-red-950/40 border-red-500/50"
                            : isReversal
                            ? "bg-amber-950/40 border-amber-500/50"
                            : "bg-white/5 border-white/15 hover:border-fest-yellow"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-grotesk text-[10px] uppercase font-black text-slate-400 truncate max-w-[120px]">
                            {game?.name || "ARENA"}
                          </span>
                          <span
                            className={`font-anton text-base ${
                              isPenalty
                                ? "text-red-400"
                                : isReversal
                                ? "text-amber-400"
                                : "text-fest-yellow"
                            }`}
                          >
                            {evt.points > 0 ? `+${evt.points}` : evt.points} XP
                          </span>
                        </div>

                        <p className="font-sans text-xs text-slate-300 line-clamp-1">
                          {evt.reason || (isPenalty ? "Penalty deduction" : "Stage achievement")}
                        </p>

                        <span className="font-grotesk text-[9px] uppercase font-medium text-slate-500 block mt-1">
                          {new Date(evt.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  href="/admin"
                  className="w-full py-2.5 px-4 bg-fest-yellow hover:bg-white text-black font-anton text-sm uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black transition-all flex items-center justify-center gap-1.5"
                >
                  DISPATCH SQUAD XP IN BOOTH ⚡
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterStatus />
      </main>
    </div>
  );
}
