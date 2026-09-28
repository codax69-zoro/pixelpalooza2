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
  Coins,
  History,
  Gavel,
  XCircle,
  HelpCircle,
  Award
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export default function TeamProfilePage() {
  const params = useParams();
  const teamId = params?.id as string;
  const { teams, standings, games, day1Games, day2Games, scoreEvents, walletTransactions, gameParticipations, auctionQuestions } = useArena();

  const team = teams.find((t) => t.id === teamId);
  const standing = standings.find((s) => s.team.id === team?.id);

  // Filter team transactions
  const teamTransactions = walletTransactions
    .filter((tx) => tx.team_id === team?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter team score events
  const teamEvents = scoreEvents
    .filter((e) => e.team_id === team?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter auction questions won
  const teamQuestionsWon = auctionQuestions.filter(
    (q) => q.winning_team_id === team?.id && (q.status === "SOLD" || q.status === "ANSWERED")
  );

  if (!team) {
    return (
      <div className="flex-1 flex flex-col font-sans bg-[#0B0F19] text-white min-h-screen selection:bg-fest-yellow selection:text-black">
        <Navbar />
        <LiveFeedTicker />
        <FestoonLights />
        <PixelBunting />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-20 text-center">
          <div className="bg-white text-slate-900 border-4 border-black rounded-3xl p-8 sm:p-12 retro-shadow-black">
            <span className="font-grotesk text-xs uppercase font-black px-3 py-1 bg-fest-coral text-white rounded">
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
              [ SQUAD STRATEGIC DOSSIER ]
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
                  PIXELPALOOZA 2-DAY TOURNAMENT
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
                ) : null}
              </div>

              {/* Squad Name */}
              <h1 className="font-anton text-5xl sm:text-6xl uppercase tracking-tight text-black flex items-center gap-3">
                <span>{team.name}</span>
                <span className="text-3xl">{team.music_icon || "🎸"}</span>
              </h1>

              {/* Roster & Captain */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-grotesk text-slate-600 uppercase font-bold mt-2">
                <span>CAPTAIN: <strong className="text-black">{team.captain}</strong></span>
                <span>•</span>
                <span>MEMBERS: <strong className="text-black">{team.members.length > 0 ? team.members.join(", ") : "Architect Crew"}</strong></span>
              </div>
            </div>

            {/* Main Metrics: Spendable Wallet & Total Score */}
            <div className="flex items-center gap-4">
              {/* Spendable Event Wallet */}
              <div className="bg-amber-50 border-3 border-black rounded-2xl p-4 sm:p-5 text-center min-w-[150px] shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-grotesk font-black text-amber-800 tracking-wider mb-1">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  AVAILABLE WALLET
                </div>
                <div className="font-anton text-4xl sm:text-5xl text-black">
                  <AnimatedCounter value={team.current_wallet} />
                </div>
                <div className="text-[10px] font-grotesk font-bold text-slate-500 uppercase mt-1">
                  / 1500 STARTING BUDGET
                </div>
              </div>

              {/* Tournament Overall Score */}
              <div className="bg-fest-yellow border-3 border-black rounded-2xl p-4 sm:p-5 text-center min-w-[150px] shadow-[4px_4px_0px_#000]">
                <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-grotesk font-black text-black tracking-wider mb-1">
                  <Trophy className="w-3.5 h-3.5" />
                  OVERALL SCORE
                </div>
                <div className="font-anton text-4xl sm:text-5xl text-black">
                  <AnimatedCounter value={standing?.total_score || 0} />
                </div>
                <div className="text-[10px] font-grotesk font-bold text-black/80 uppercase mt-1">
                  RANK #{standing?.rank || 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Strategy Breakdown: Day 1 Games & Day 2 Auction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Day 1: 5 Physical Games Participation Status */}
          <div className="lg:col-span-6 bg-slate-900/90 border-4 border-black rounded-3xl p-6 sm:p-8 retro-shadow-black">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6">
              <div>
                <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block">
                  DAY 1 SQUAD PERFORMANCE
                </span>
                <h3 className="font-anton text-2xl uppercase text-white">
                  5 PHYSICAL GAMES ({standing?.games_played || 0} / 5 PLAYED)
                </h3>
              </div>
              <span className="font-anton text-xl text-fest-cyan">
                {standing?.day1_score || 0} PTS
              </span>
            </div>

            <div className="space-y-3">
              {day1Games.map((game) => {
                const part = gameParticipations.find((p) => p.team_id === team.id && p.game_id === game.id);
                const score = standing?.game_breakdown[game.id] || 0;
                const status = part ? part.status : "NOT_SELECTED";

                return (
                  <div
                    key={game.id}
                    className="bg-black/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-anton text-base uppercase text-white">
                          {game.name}
                        </span>
                        <span className={`text-[10px] font-grotesk uppercase font-black px-1.5 py-0.5 rounded ${
                          game.difficulty === "Easy" ? "bg-emerald-950 text-emerald-400" :
                          game.difficulty === "Medium" ? "bg-amber-950 text-amber-400" :
                          "bg-red-950 text-red-400"
                        }`}>
                          {game.difficulty}
                        </span>
                      </div>
                      <span className="font-sans text-xs text-slate-400">
                        Entry Cost: <strong className="text-fest-cyan">{game.entry_cost} pts</strong>
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-grotesk uppercase font-black px-2 py-0.5 rounded border ${
                        status === "COMPLETED" ? "bg-emerald-950 text-emerald-400 border-emerald-800" :
                        status === "PLAYING" ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse" :
                        status === "REGISTERED" ? "bg-blue-950 text-blue-300 border-blue-800" :
                        status === "SKIPPED" ? "bg-slate-800 text-slate-400 border-slate-700" :
                        "bg-slate-900 text-slate-500 border-slate-800"
                      }`}>
                        {status === "NOT_SELECTED" ? "SKIPPED / UNPLAYED" : status}
                      </span>
                      {score > 0 && (
                        <span className="font-anton text-xs text-fest-yellow">
                          +{score} PTS
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day 2: The Tech Auction Status */}
          <div className="lg:col-span-6 bg-slate-900/90 border-4 border-black rounded-3xl p-6 sm:p-8 retro-shadow-black">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6">
              <div>
                <span className="font-grotesk text-xs uppercase font-black text-fest-pink tracking-widest block">
                  DAY 2 SQUAD PERFORMANCE
                </span>
                <h3 className="font-anton text-2xl uppercase text-white">
                  THE TECH AUCTION
                </h3>
              </div>
              <span className="font-anton text-xl text-fest-pink">
                {standing?.day2_score || 0} PTS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  QUESTIONS WON
                </span>
                <span className="font-anton text-3xl text-fest-pink">
                  {teamQuestionsWon.length}
                </span>
              </div>
              <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 text-center">
                <span className="font-grotesk text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  AUCTION EARNINGS
                </span>
                <span className="font-anton text-3xl text-fest-yellow">
                  +{standing?.day2_score || 0} PTS
                </span>
              </div>
            </div>

            {teamQuestionsWon.length === 0 ? (
              <div className="bg-black/40 border border-slate-800 rounded-2xl p-6 text-center text-xs font-sans text-slate-400">
                <Gavel className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                No auction questions acquired yet. On Day 2, the squad can bid using their remaining budget of {team.current_wallet} points.
              </div>
            ) : (
              <div className="space-y-2">
                <span className="font-grotesk text-xs uppercase font-bold text-slate-400 block mb-1">
                  ACQUIRED QUESTIONS:
                </span>
                {teamQuestionsWon.map((q) => (
                  <div key={q.id} className="bg-black/50 border border-slate-800 rounded-xl p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-anton text-fest-yellow mr-2">Q#{q.question_number}</span>
                      <span className="text-slate-300 font-medium">{q.category}</span>
                    </div>
                    <span className="font-anton text-emerald-400">
                      +{q.reward_points} PTS ({q.answer_status || "PENDING"})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Complete Auditable Wallet Transaction Ledger */}
        <div className="bg-slate-900/90 border-4 border-black rounded-3xl p-6 sm:p-8 retro-shadow-black">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6">
            <div>
              <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block">
                FINANCIAL INTEGRITY & AUDIT TRAIL
              </span>
              <h3 className="font-anton text-2xl uppercase text-white">
                SQUAD WALLET TRANSACTION HISTORY ({teamTransactions.length})
              </h3>
            </div>
            <span className="font-grotesk text-xs text-slate-400">
              Spendable Balance: <strong className="text-fest-yellow">{team.current_wallet} PTS</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 font-grotesk text-xs uppercase text-slate-400">
                  <th className="py-2.5 px-3">TIME</th>
                  <th className="py-2.5 px-3">TRANSACTION TYPE</th>
                  <th className="py-2.5 px-3 text-right">POINTS DELTA</th>
                  <th className="py-2.5 px-3">DESCRIPTION / AUDIT NOTE</th>
                  <th className="py-2.5 px-3">RECORDED BY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs font-sans">
                {teamTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500 font-grotesk uppercase">
                      No wallet transactions recorded.
                    </td>
                  </tr>
                ) : (
                  teamTransactions.map((tx) => (
                    <tr key={tx.id} className={`hover:bg-slate-800/30 ${tx.is_reversed ? "opacity-40 line-through" : ""}`}>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {new Date(tx.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-grotesk uppercase font-black ${
                          tx.transaction_type === "INITIAL_ALLOCATION" ? "bg-fest-yellow/20 text-fest-yellow border border-fest-yellow/40" :
                          tx.transaction_type === "GAME_ENTRY" ? "bg-fest-coral/20 text-fest-coral border border-fest-coral/40" :
                          tx.transaction_type === "AUCTION_PURCHASE" ? "bg-purple-950 text-purple-300 border border-purple-800" :
                          tx.transaction_type === "REVERSAL" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                          "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }`}>
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-anton text-base ${
                        tx.amount >= 0 ? "text-emerald-400" : "text-fest-coral"
                      }`}>
                        {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} PTS
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-medium">
                        {tx.description}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {tx.created_by}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <FooterStatus />
      </main>
    </div>
  );
}
