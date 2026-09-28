"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import { StagePodium } from "@/components/StagePodium";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { FooterStatus } from "@/components/FooterStatus";
import { PixelBunting } from "@/components/PixelBunting";
import { FestoonLights } from "@/components/FestoonLights";
import { Crown, Sparkles, Trophy, Tv } from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export default function LeaderboardPage() {
  const { standings, overallStandings, games, realtimeStatus, eventState } = useArena();

  const isFinished = eventState.event_status === "FINISHED";
  const champion = overallStandings[0];

  return (
    <div className="flex-1 flex flex-col font-sans bg-[#0B0F19] text-white selection:bg-fest-yellow selection:text-black min-h-screen">
      <Navbar />
      <LiveFeedTicker />

      {/* Hanging Festoon Lights and Pixel Bunting across top */}
      <FestoonLights />
      <PixelBunting />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 pt-8 pb-16">
        {/* EVENT FINISHED GRAND CELEBRATION BANNER */}
        {isFinished && champion && (
          <div className="mb-8 p-6 md:p-8 bg-gradient-to-r from-fest-yellow via-amber-400 to-fest-coral text-black rounded-3xl border-4 border-black retro-shadow-black text-center relative overflow-hidden animate-pulse">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-8 h-8 fill-black" />
              <span className="font-anton text-3xl md:text-5xl uppercase tracking-wider">
                PIXELPALOOZA GRAND CHAMPION
              </span>
              <Crown className="w-8 h-8 fill-black" />
            </div>
            <h2 className="font-anton text-4xl md:text-6xl uppercase tracking-tight my-2">
              {champion.team.name}
            </h2>
            <p className="font-grotesk font-black text-sm md:text-base uppercase tracking-widest text-black/90">
              VICTORIOUS WITH {champion.total_score} TOTAL TOURNAMENT POINTS • {champion.current_wallet} REMAINING WALLET
            </p>
          </div>
        )}

        {/* Title & Transmission Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-fest-yellow pb-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow bg-yellow-950/70 border border-fest-yellow px-4 py-1.5 rounded-full">
                [ {isFinished ? "FESTIVAL FINAL RESULTS" : "FESTIVAL MAIN STAGE PODIUM"} ]
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping inline-block" />
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-none">
              {isFinished ? "FINAL RESULTS" : "WHO'S HEADLINING?"}
            </h1>

            <p className="font-sans text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-medium">
              Real-time standings across Day 1 (5 physical games) and Day 2 (The Tech Auction). Starting wallet: 1500 points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/display"
              target="_blank"
              className="px-5 py-2.5 bg-fest-yellow text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all active:translate-y-0.5 flex items-center gap-1.5"
            >
              <Tv className="w-4 h-4" />
              STAGE HUD ↗
            </Link>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-grotesk text-xs uppercase font-bold text-slate-300">
                {realtimeStatus === "connected" ? "LIVE SYNC ACTIVE" : "LOCAL BROADCAST"}
              </span>
            </div>
          </div>
        </div>

        {/* Stage Podium for Top 3 */}
        <StagePodium standings={overallStandings} />

        {/* Complete Leaderboard Table with Day 1 / Day 2 / Overall tabs */}
        <LeaderboardTable standings={standings} games={games} initialTab={isFinished ? "overall" : "overall"} />

        {/* Protocol info and status */}
        <FooterStatus />
      </main>
    </div>
  );
}
