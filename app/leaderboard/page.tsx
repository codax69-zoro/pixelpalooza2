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
import { useArena } from "@/lib/store/arena-context";

export default function LeaderboardPage() {
  const { standings, games, realtimeStatus } = useArena();

  return (
    <div className="flex-1 flex flex-col font-sans bg-[#0B0F19] text-white selection:bg-fest-yellow selection:text-black min-h-screen">
      <Navbar />
      <LiveFeedTicker />

      {/* Hanging Festoon Lights and Pixel Bunting across top */}
      <FestoonLights />
      <PixelBunting />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 pt-8 pb-16">
        {/* Title & Transmission Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-fest-yellow pb-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow bg-yellow-950/70 border border-fest-yellow px-4 py-1.5 rounded-full">
                [ FESTIVAL MAIN STAGE PODIUM ]
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping inline-block" />
            </div>

            <h1 className="font-anton text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-none">
              WHO&apos;S HEADLINING?
            </h1>

            <p className="font-sans text-sm sm:text-base text-slate-300 mt-2 max-w-2xl font-medium">
              Real-time standings from the 7 physical arena attractions. Organizer score dispatches synchronized live across campus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/display"
              target="_blank"
              className="px-5 py-2.5 bg-fest-yellow text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all active:translate-y-0.5"
            >
              [ STAGE PROJECTOR HUD ↗ ]
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
        <StagePodium standings={standings} />

        {/* Complete Leaderboard Table with game filters */}
        <LeaderboardTable standings={standings} games={games} />

        {/* Protocol info and status */}
        <FooterStatus />
      </main>
    </div>
  );
}
