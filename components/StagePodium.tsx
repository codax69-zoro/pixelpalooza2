"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, Trophy, Sparkles, Mic, Music, Radio, Coins } from "lucide-react";
import { TeamStanding } from "@/types/arena";
import confetti from "canvas-confetti";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface StagePodiumProps {
  standings: TeamStanding[];
}

export function StagePodium({ standings }: StagePodiumProps) {
  const first = standings[0];
  const second = standings[1];
  const third = standings[2];

  // Headliner shift celebration
  const [prevLeaderId, setPrevLeaderId] = useState<string | null>(null);
  const [showHeadlinerAlert, setShowHeadlinerAlert] = useState(false);

  useEffect(() => {
    if (first && prevLeaderId && first.team.id !== prevLeaderId && first.total_score > 0) {
      setShowHeadlinerAlert(true);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
      } catch {}
      const timer = setTimeout(() => setShowHeadlinerAlert(false), 5000);
      return () => clearTimeout(timer);
    }
    if (first) {
      setPrevLeaderId(first.team.id);
    }
  }, [first, prevLeaderId]);

  // Stage Pre-Event Standby Mode when no teams are registered yet
  if (!first) {
    return (
      <div className="w-full my-6">
        <div className="flex items-center justify-between text-xs font-mono mb-3 px-1 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-fest-pink font-black tracking-wider uppercase flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              <span>FESTIVAL STAGE PODIUM</span>
            </span>
            <span className="text-slate-600">·</span>
            <span>TIER 1 RECOGNITION</span>
          </div>
          <div className="flex items-center gap-1.5 text-fest-yellow font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-fest-cyan" />
            <span className="text-fest-cyan">ARENA STANDBY // AWAITING SQUADS</span>
          </div>
        </div>

        <div className="border-4 border-black rounded-3xl bg-slate-900/90 p-8 text-center retro-shadow-black relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-fest-pink via-fest-cyan to-fest-yellow" />
          <div className="w-16 h-16 bg-black border-2 border-slate-700 rounded-2xl mx-auto flex items-center justify-center text-fest-yellow mb-3 shadow-inner">
            <Trophy className="w-8 h-8 fill-fest-yellow" />
          </div>
          <h3 className="text-xl font-anton text-white uppercase tracking-wider mb-1">
            MAIN STAGE PODIUM READY FOR PIXELPALOOZA
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-4 font-sans">
            Headliner positions are computed dynamically across Day 1 arena challenges and the Day 2 auction climax.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[11px] font-grotesk text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AWAITING ORGANIZER SCORE DISPATCHES
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6">
      {/* Live Headliner Shift Alert */}
      <AnimatePresence>
        {showHeadlinerAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4 p-3 bg-gradient-to-r from-fest-yellow via-amber-400 to-fest-coral text-black font-anton text-sm tracking-wider uppercase rounded-2xl border-2 border-black retro-shadow-black flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 fill-current animate-bounce" />
              <span>NEW HEADLINER ON THE MAIN STAGE: {first.team.name.toUpperCase()} HAS TAKEN RANK #1!</span>
            </div>
            <Sparkles className="w-4 h-4 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3-Column Podium */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* #2 PODIUM (Silver) - Left Column */}
        {second ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-4 order-2 md:order-1"
          >
            <Link href={`/teams/${second.team.id}`} className="block group">
              <div className="bg-slate-900 border-3 border-slate-300 group-hover:border-white transition-all p-5 rounded-3xl retro-shadow-black relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-300" />

                {/* Rank Badge */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-14 h-12 bg-black border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-lg font-black font-anton text-slate-200">02</span>
                    <span className="text-[9px] font-black tracking-wider uppercase px-2 bg-slate-300 text-black rounded-b">
                      SILVER
                    </span>
                  </div>
                </div>

                {/* Team Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-anton text-white uppercase tracking-wider group-hover:text-fest-yellow transition-colors flex items-center justify-center gap-1.5">
                    <span>{second.team.name}</span>
                    <span className="text-xs">{second.team.music_icon || "🎸"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Captain: {second.team.captain}
                  </p>
                </div>

                {/* Score Total */}
                <div className="bg-black/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-grotesk">
                    OVERALL SCORE
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-anton text-white">
                      <AnimatedCounter value={second.total_score} />
                    </span>
                    <span className="text-xs font-bold text-slate-400">PTS</span>
                  </div>
                </div>

                {/* Wallet & Games */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-grotesk border-t border-slate-800 pt-3">
                  <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">WALLET</div>
                    <div className="font-anton text-fest-yellow">{second.current_wallet} PTS</div>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">GAMES</div>
                    <div className="font-anton text-fest-cyan">{second.games_played} PLAYED</div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="md:col-span-4 order-2 md:order-1">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-center opacity-70">
              <div className="text-xs text-slate-400 uppercase font-anton">#2 SILVER PODIUM</div>
              <div className="text-xs text-slate-500 mt-1">Awaiting 2nd Qualifier</div>
            </div>
          </div>
        )}

        {/* #1 PODIUM (Gold / Main Stage Headliner) - Center Column Elevated */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-4 order-1 md:order-2 z-10 -mt-2 md:-mt-4"
        >
          <Link href={`/teams/${first.team.id}`} className="block group">
            <div className="bg-slate-900 border-4 border-fest-yellow group-hover:border-white p-6 rounded-3xl retro-shadow-black relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-fest-yellow via-amber-400 to-fest-coral" />

              {/* Headliner Badge */}
              <div className="flex justify-center -mt-2 mb-3">
                <div className="inline-flex items-center gap-1.5 bg-fest-yellow text-black text-xs font-black font-grotesk px-3 py-1 rounded-full shadow-[2px_2px_0px_#000]">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  <span className="tracking-widest uppercase">MAIN STAGE HEADLINER</span>
                </div>
              </div>

              {/* Rank 01 Badge */}
              <div className="flex flex-col items-center mb-3">
                <div className="w-16 h-14 bg-black border-2 border-fest-yellow rounded-xl flex flex-col items-center justify-center">
                  <span className="text-2xl font-black font-anton text-fest-yellow">01</span>
                  <span className="text-[9px] font-black tracking-widest uppercase px-2 bg-fest-yellow text-black rounded-b">
                    GOLD
                  </span>
                </div>
              </div>

              {/* Team Info */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-anton text-white uppercase tracking-wider group-hover:text-fest-yellow transition-colors flex items-center justify-center gap-1.5">
                  <span>{first.team.name}</span>
                  <span>{first.team.music_icon || "👑"}</span>
                </h2>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Captain: {first.team.captain}
                </p>
              </div>

              {/* Score Highlight Box */}
              <div className="bg-black/70 border border-fest-yellow/40 rounded-2xl p-4 flex items-center justify-between mb-4">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-grotesk font-bold">
                    AGGREGATE SCORE
                  </div>
                  <div className="text-xs font-anton text-fest-yellow uppercase">
                    HEADLINER LEAD
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-anton text-fest-yellow">
                    <AnimatedCounter value={first.total_score} />
                  </span>
                  <span className="text-xs font-bold text-fest-yellow">PTS</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-grotesk border-t border-slate-800 pt-3">
                <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">SPENDABLE WALLET</div>
                  <div className="font-anton text-fest-yellow text-sm">{first.current_wallet} PTS</div>
                </div>
                <div className="bg-black/50 p-2 rounded-xl border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase font-bold">GAMES PLAYED</div>
                  <div className="font-anton text-fest-cyan text-sm">{first.games_played} / 5</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* #3 PODIUM (Bronze) - Right Column */}
        {third ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:col-span-4 order-3"
          >
            <Link href={`/teams/${third.team.id}`} className="block group">
              <div className="bg-slate-900 border-3 border-amber-600 group-hover:border-white transition-all p-5 rounded-3xl retro-shadow-black relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-600" />

                {/* Rank Badge */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-14 h-12 bg-black border-2 border-amber-600 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-lg font-black font-anton text-amber-400">03</span>
                    <span className="text-[9px] font-black tracking-wider uppercase px-1.5 bg-amber-600 text-black rounded-b">
                      BRONZE
                    </span>
                  </div>
                </div>

                {/* Team Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-anton text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5">
                    <span>{third.team.name}</span>
                    <span className="text-xs">{third.team.music_icon || "🎮"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Captain: {third.team.captain}
                  </p>
                </div>

                {/* Score Total */}
                <div className="bg-black/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-grotesk">
                    OVERALL SCORE
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-anton text-amber-400">
                      <AnimatedCounter value={third.total_score} />
                    </span>
                    <span className="text-xs font-bold text-slate-400">PTS</span>
                  </div>
                </div>

                {/* Wallet & Games */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-grotesk border-t border-slate-800 pt-3">
                  <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">WALLET</div>
                    <div className="font-anton text-fest-yellow">{third.current_wallet} PTS</div>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">GAMES</div>
                    <div className="font-anton text-fest-cyan">{third.games_played} PLAYED</div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="md:col-span-4 order-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-center opacity-70">
              <div className="text-xs text-slate-400 uppercase font-anton">#3 BRONZE PODIUM</div>
              <div className="text-xs text-slate-500 mt-1">Awaiting 3rd Qualifier</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
