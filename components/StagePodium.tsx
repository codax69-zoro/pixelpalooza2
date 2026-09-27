"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, Trophy, Sparkles, Mic, Music, Radio } from "lucide-react";
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
    if (first && prevLeaderId && first.team.id !== prevLeaderId && first.total_xp > 0) {
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
            <span className="text-festival-pink font-black tracking-wider uppercase flex items-center gap-1">
              <Mic className="w-3.5 h-3.5" />
              <span>FESTIVAL STAGE PODIUM</span>
            </span>
            <span className="text-slate-600">·</span>
            <span>TIER 1 RECOGNITION</span>
          </div>
          <div className="flex items-center gap-1.5 text-realm-gold font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-festival-cyan" />
            <span className="text-festival-cyan">ARENA STANDBY // AWAITING QUALIFIERS</span>
          </div>
        </div>

        <div className="voxel-card border-2 border-slate-800 bg-obsidian-900 p-8 text-center shadow-voxel relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-festival-pink via-festival-cyan to-festival-emerald" />
          <div className="w-16 h-16 bg-obsidian-950 border border-slate-700 mx-auto flex items-center justify-center text-realm-gold mb-3 shadow-inner">
            <Trophy className="w-8 h-8 fill-realm-gold" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">
            MAIN STAGE PODIUM STANDING BY
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Registered squads will ascend to the Gold, Silver, and Bronze podiums as soon as 
            GDGOC organizers dispatch points from the 7 physical festival attraction booths.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase">
            <span>● 7 ATTRACTION STAGES ACTIVE</span>
            <span>·</span>
            <span>NMIMS NAVI MUMBAI</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-6">
      {/* Headliner Shift Toast Alert */}
      <AnimatePresence>
        {showHeadlinerAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-gradient-to-r from-festival-pink via-purple-600 to-festival-cyan text-white text-center font-black text-sm tracking-wider uppercase shadow-stage-glow flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>NEW HEADLINER: 🏆 {first.team.name.toUpperCase()} TAKES THE MAIN STAGE!</span>
            <Sparkles className="w-4 h-4 fill-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Header */}
      <div className="flex items-center justify-between text-xs font-mono mb-3 px-1 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-festival-pink font-black tracking-wider uppercase flex items-center gap-1">
            <Mic className="w-3.5 h-3.5" />
            <span>FESTIVAL STAGE PODIUM</span>
          </span>
          <span className="text-slate-600">·</span>
          <span>TIER 1 RECOGNITION V2</span>
        </div>
        <div className="flex items-center gap-1.5 text-realm-gold font-bold">
          <Trophy className="w-3.5 h-3.5 fill-realm-gold" />
          <span>MAIN STAGE HEADLINER ACTIVE</span>
        </div>
      </div>

      {/* 3 Columns Podium Layout */}
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
              <div className="voxel-card bg-obsidian-900 border-2 border-slate-700/80 group-hover:border-realm-silver transition-all p-5 shadow-voxel relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-200" />
                
                {/* Rank Badge */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-14 h-12 bg-obsidian-950 border border-slate-600 flex flex-col items-center justify-center shadow-voxel-sm">
                    <span className="text-lg font-bold font-mono text-slate-200">02</span>
                    <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 bg-slate-300 text-obsidian-950">
                      SILVER
                    </span>
                  </div>
                </div>

                {/* Team Info */}
                <div className="text-center mb-4">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider group-hover:text-slate-100 transition-colors font-mono flex items-center justify-center gap-1.5">
                    <span>{second.team.name}</span>
                    <span className="text-xs">{second.team.music_icon || "🎸"}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                    CAPTAIN: {second.team.captain.toUpperCase()}
                  </p>
                </div>

                {/* Score Total */}
                <div className="bg-obsidian-950/80 border border-slate-800 p-2.5 flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                    SCORE TOTAL
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-white">
                      <AnimatedCounter value={second.total_xp} />
                    </span>
                    <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-slate-800/80 pt-3 mb-3">
                  <div className="bg-obsidian-950/40 p-1.5 border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">STAGES</div>
                    <div className="font-bold text-slate-200">{second.games_played} PLAYED</div>
                  </div>
                  <div className="bg-obsidian-950/40 p-1.5 border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">RUN</div>
                    <div className="font-bold text-amber-400 flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>{second.streak} WINS</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] font-mono tracking-widest text-slate-500 uppercase border-t border-slate-800/80 pt-2">
                  #2 PODIUM // VOXEL SECTOR // DELTA
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="md:col-span-4 order-2 md:order-1">
            <div className="voxel-card bg-obsidian-950 border border-slate-800/60 p-5 text-center opacity-70">
              <div className="text-xs text-slate-500 uppercase">#2 SILVER PODIUM</div>
              <div className="text-[11px] text-slate-600 mt-1">Awaiting 2nd Qualifier</div>
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
            <div className="voxel-card bg-obsidian-850 border-2 border-realm-gold/90 group-hover:border-realm-gold p-6 shadow-festival-gold relative overflow-hidden champion-card">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-realm-gold via-amber-300 to-festival-pink" />

              {/* Headliner Badge */}
              <div className="flex justify-center -mt-2 mb-3">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-realm-gold via-amber-400 to-festival-pink text-black text-[10px] font-black font-mono px-3 py-0.5 shadow-voxel-sm">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  <span className="tracking-widest uppercase">MAIN STAGE HEADLINER</span>
                </div>
              </div>

              {/* Rank 01 Badge */}
              <div className="flex flex-col items-center mb-3">
                <div className="w-16 h-14 bg-obsidian-950 border-2 border-realm-gold flex flex-col items-center justify-center shadow-voxel-sm">
                  <span className="text-2xl font-black font-mono text-festival-emerald">01</span>
                  <span className="text-[9px] font-black tracking-widest uppercase px-2 bg-realm-gold text-obsidian-950">
                    GOLD
                  </span>
                </div>
              </div>

              {/* Team Info */}
              <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-black text-festival-emerald uppercase tracking-wider group-hover:text-emerald-300 transition-colors font-mono flex items-center justify-center gap-1.5">
                  <span>{first.team.name}</span>
                  <span>{first.team.music_icon || "🎤"}</span>
                </h2>
                <p className="text-xs text-slate-300 font-mono tracking-wider mt-0.5">
                  CAPTAIN: {first.team.captain.toUpperCase()}
                </p>
              </div>

              {/* Score Highlight Box */}
              <div className="bg-obsidian-950 border border-realm-gold/40 p-3 flex items-center justify-between mb-3 shadow-inner">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                    AGGREGATE STANDING
                  </div>
                  <div className="text-xs font-bold text-festival-emerald font-mono">
                    {first.last_game_name ? `${first.last_game_name.toUpperCase()} LEAD` : "HEADLINER LEAD"}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-festival-emerald">
                    <AnimatedCounter value={first.total_xp} />
                  </span>
                  <span className="text-xs font-bold text-realm-gold">XP</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-slate-800 pt-3 mb-3">
                <div className="bg-obsidian-950/60 p-2 border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">ATTRACTIONS</div>
                  <div className="font-bold text-white">{first.games_played} COMPLETED</div>
                </div>
                <div className="bg-obsidian-950/60 p-2 border border-slate-800">
                  <div className="text-[9px] text-slate-400 uppercase">ACTIVE RUN</div>
                  <div className="font-bold text-realm-gold flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{first.streak} STREAK</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar towards XP title ceiling */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>XP CEILING: 1000</span>
                  <span className="text-festival-emerald font-bold">
                    {Math.min(100, Math.round((first.total_xp / 1000) * 100))}% TO TITLE
                  </span>
                </div>
                <div className="w-full h-2 bg-obsidian-950 border border-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-festival-emerald via-festival-cyan to-festival-pink"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (first.total_xp / 1000) * 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Footer Banner */}
              <div className="text-center pt-2 border-t border-slate-800">
                <div className="text-sm font-black tracking-widest text-festival-emerald uppercase font-mono">
                  #1 HEADLINER
                </div>
                <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">
                  PIXELPALOOZA MAIN STAGE
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
              <div className="voxel-card bg-obsidian-900 border-2 border-amber-900/60 group-hover:border-realm-bronze transition-all p-5 shadow-voxel relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 to-amber-500" />

                {/* Rank Badge */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-14 h-12 bg-obsidian-950 border border-amber-900/80 flex flex-col items-center justify-center shadow-voxel-sm">
                    <span className="text-lg font-bold font-mono text-amber-200">03</span>
                    <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 bg-amber-600 text-obsidian-950">
                      BRONZE
                    </span>
                  </div>
                </div>

                {/* Team Info */}
                <div className="text-center mb-4">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider group-hover:text-amber-200 transition-colors font-mono flex items-center justify-center gap-1.5">
                    <span>{third.team.name}</span>
                    <span className="text-xs">{third.team.music_icon || "🎮"}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                    CAPTAIN: {third.team.captain.toUpperCase()}
                  </p>
                </div>

                {/* Score Total */}
                <div className="bg-obsidian-950/80 border border-slate-800 p-2.5 flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                    SCORE TOTAL
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-realm-gold">
                      <AnimatedCounter value={third.total_xp} />
                    </span>
                    <span className="text-xs font-bold text-slate-400">XP</span>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono border-t border-slate-800/80 pt-3 mb-3">
                  <div className="bg-obsidian-950/40 p-1.5 border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">STAGES</div>
                    <div className="font-bold text-slate-200">{third.games_played} PLAYED</div>
                  </div>
                  <div className="bg-obsidian-950/40 p-1.5 border border-slate-800/50">
                    <div className="text-[10px] text-slate-500 uppercase">RUN</div>
                    <div className="font-bold text-amber-500 flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>{third.streak} WINS</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] font-mono tracking-widest text-slate-500 uppercase border-t border-slate-800/80 pt-2">
                  #3 PODIUM // VOXEL SECTOR // BETA
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="md:col-span-4 order-3">
            <div className="voxel-card bg-obsidian-950 border border-slate-800/60 p-5 text-center opacity-70">
              <div className="text-xs text-slate-500 uppercase">#3 BRONZE PODIUM</div>
              <div className="text-[11px] text-slate-600 mt-1">Awaiting 3rd Qualifier</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
