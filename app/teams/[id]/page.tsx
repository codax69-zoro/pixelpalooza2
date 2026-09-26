"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import { FooterStatus } from "@/components/FooterStatus";
import { PixelBunting } from "@/components/PixelBunting";
import { 
  ArrowLeft, 
  Crown, 
  Flame, 
  Users, 
  Trophy, 
  Clock,
  Sparkles,
  Mic,
  Music
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
      <div className="flex-1 flex flex-col font-mono">
        <Navbar />
        <LiveFeedTicker />
        <PixelBunting />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center">
          <div className="voxel-card border-2 border-slate-800 bg-obsidian-900 p-8 shadow-voxel">
            <h2 className="text-xl font-black text-white uppercase mb-2">SQUAD DOSSIER NOT FOUND</h2>
            <p className="text-xs text-slate-400 mb-6">
              The requested squad ID does not exist in the active festival registry.
            </p>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-festival-pink text-white font-bold text-xs uppercase tracking-wider shadow-festival-pink"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO LEADERBOARD</span>
            </Link>
          </div>
        </main>
        <FooterStatus />
      </div>
    );
  }

  const isLeader = standing?.rank === 1;

  return (
    <div className="flex-1 flex flex-col font-mono">
      <Navbar />
      <LiveFeedTicker />
      <PixelBunting />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 lg:px-6 pt-6 pb-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO LIVE LEADERBOARD</span>
          </Link>
        </div>

        {/* Squad Hero Card */}
        <div
          className={`voxel-card border-2 p-6 sm:p-8 mb-8 shadow-voxel relative overflow-hidden ${
            isLeader
              ? "border-realm-gold bg-obsidian-850 shadow-festival-gold"
              : "border-voxel-border bg-obsidian-900"
          }`}
        >
          {isLeader && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-realm-gold via-amber-300 to-festival-pink" />
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  PIXELPALOOZA SQUAD DOSSIER // TIER 1
                </span>
                {isLeader && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-realm-gold to-festival-pink text-black text-[10px] font-black px-2 py-0.5">
                    <Crown className="w-3 h-3 fill-black" />
                    MAIN STAGE HEADLINER
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>{team.name}</span>
                <span className="text-2xl">{team.music_icon || "🎤"}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500">CAPTAIN: </span>
                  <span className="font-bold text-slate-200">{team.captain}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500">ROSTER: </span>
                  <span className="font-bold text-slate-200">
                    {team.members.length > 0 ? team.members.join(", ") : "Squad Roster Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Score & Rank Highlights */}
            <div className="flex items-center gap-4 bg-obsidian-950 border border-slate-800 p-4 shadow-inner">
              <div className="text-center pr-4 border-r border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">RANK</div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  #{standing ? standing.rank : "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">TOTAL SCORE</div>
                <div className="text-2xl sm:text-3xl font-black text-festival-emerald">
                  {standing ? standing.total_xp : 0}{" "}
                  <span className="text-xs font-bold text-slate-400">XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown by Games */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-realm-gold" />
            <span>ATTRACTION STAGE BREAKDOWN ({standing?.games_played || 0} OF 7 COMPLETED)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => {
              const gameScore = standing?.game_breakdown[game.id] || 0;
              const hasPlayed = gameScore > 0;

              return (
                <div
                  key={game.id}
                  className={`border p-4 flex items-center justify-between transition-all ${
                    hasPlayed
                      ? "bg-obsidian-900 border-festival-emerald/50"
                      : "bg-obsidian-950/40 border-slate-850 opacity-60"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white uppercase">{game.name}</div>
                    <div className="text-[10px] text-festival-cyan uppercase">{game.attraction_stage || "Stage"}</div>
                  </div>

                  <div className="text-right">
                    <div className={`text-base font-bold ${hasPlayed ? "text-festival-emerald" : "text-slate-600"}`}>
                      {gameScore} XP
                    </div>
                    {hasPlayed && (
                      <span className="text-[9px] text-festival-emerald uppercase font-semibold">
                        COMPLETED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score History Timeline */}
        <div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-festival-cyan" />
            <span>SQUAD AUDIT TIMELINE ({teamEvents.length} DISPATCHES)</span>
          </h2>

          <div className="voxel-card border-2 border-voxel-border overflow-hidden shadow-voxel">
            {teamEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No score dispatches recorded yet for this squad.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {teamEvents.map((evt) => {
                  const game = games.find((g) => g.id === evt.game_id);
                  const isPenalty = evt.points < 0;
                  const isReversal = evt.type === "REVERSAL";

                  return (
                    <div
                      key={evt.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-obsidian-850/60 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPenalty
                              ? "bg-festival-redstone/20 text-festival-redstone border border-festival-redstone/50"
                              : isReversal
                              ? "bg-amber-900/30 text-amber-400 border border-amber-600/50"
                              : "bg-festival-emerald/20 text-festival-emerald border border-festival-emerald/50"
                          }`}
                        >
                          {isPenalty ? "−" : isReversal ? "↩" : "+"}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-white uppercase flex items-center gap-2">
                            <span>{game ? game.name : "Tournament Adjustment"}</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({evt.type})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {evt.reason || "Score dispatch"}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center">
                        <div
                          className={`text-base font-bold ${
                            isPenalty
                              ? "text-festival-redstone"
                              : isReversal
                              ? "text-amber-400"
                              : "text-festival-emerald"
                          }`}
                        >
                          {evt.points >= 0 ? "+" : ""}
                          {evt.points} XP 🎵
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(evt.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          by {evt.created_by}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <FooterStatus />
      </main>
    </div>
  );
}
