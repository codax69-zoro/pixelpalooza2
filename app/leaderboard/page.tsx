"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import { StagePodium } from "@/components/StagePodium";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { FooterStatus } from "@/components/FooterStatus";
import { PixelBunting } from "@/components/PixelBunting";
import { useArena } from "@/lib/store/arena-context";

export default function LeaderboardPage() {
  const { standings, games } = useArena();

  return (
    <div className="flex-1 flex flex-col font-mono">
      <Navbar />
      <LiveFeedTicker />

      {/* Hanging Pixel Bunting across top */}
      <PixelBunting />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 pt-5 pb-12">
        {/* Title & Transmission Status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-festival-pink font-bold mb-1 tracking-wider uppercase">
            <span>PIXELPALOOZA FESTIVAL STAGE // REALTIME STANDINGS</span>
            <span className="w-2 h-2 rounded-full bg-festival-pink inline-block animate-ping" />
          </div>

          <div className="text-xs text-realm-gold font-bold italic tracking-wide mb-1 flex items-center gap-1">
            <span>&quot;Where ideas get Unhinged&quot;</span>
            <span>✨</span>
            <span className="text-slate-500 font-normal">·</span>
            <span className="text-festival-cyan font-bold tracking-widest uppercase">
              GDGOC NMIMS NAVI MUMBAI
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono tracking-tight flex items-center gap-3">
            <span>🏆 LIVE LEADERBOARD</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2 max-w-3xl leading-relaxed">
            Who headlines the Pixelpalooza realm? Real-time standings from physical classroom challenges. 
            Organizer score dispatch synchronized live to campus auditoriums.
          </p>
        </div>

        {/* Stage Podium for Top 3 */}
        <StagePodium standings={standings} />

        {/* Complete Leaderboard Table with game filters */}
        <LeaderboardTable standings={standings} games={games} />

        {/* Protocol info and status */}
        <FooterStatus />
      </main>
    </div>
  );
}
