"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useArena } from "@/lib/store/arena-context";
import { soundFx } from "@/lib/audio/sound-fx";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { 
  Trophy, 
  Coins, 
  Gavel, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  HelpCircle,
  Flame,
  CheckCircle2,
  Tv,
  Users,
  Radio
} from "lucide-react";
import confetti from "canvas-confetti";

export default function StitchPixelpaloozaFullPage() {
  const {
    teams,
    games,
    day1Games,
    day2Games,
    standings,
    overallStandings,
    eventState,
    activeGame,
    activeAuctionQuestion,
    currentLeader,
    scoreEvents,
    realtimeStatus,
  } = useArena();

  // Active headliner from overall standings
  const headliner = overallStandings[0];
  const second = overallStandings[1];
  const third = overallStandings[2];

  // Selected game rules modal state
  const [selectedGameRules, setSelectedGameRules] = useState<{
    name: string;
    rules: string[];
    scoring_type: string;
    duration: string;
    difficulty: string;
    entry_cost: number;
    description: string;
  } | null>(null);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCollege, setRsvpCollege] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    soundFx.playScoreAdded();
    setRsvpSubmitted(true);
    try {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.8 } });
    } catch {}
  };

  const isFinished = eventState.event_status === "FINISHED";

  return (
    <div className="bg-white font-sans text-slate-900 antialiased selection:bg-fest-yellow selection:text-black overflow-x-hidden min-h-screen">
      {/* ========================================================================= */}
      {/* FLOATING FESTIVAL EDITORIAL NAVBAR                                        */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto bg-black/85 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-4 md:px-6 py-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          {/* Brand & Mascot Logo */}
          <Link className="flex items-center gap-3 group" href="#">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 p-0.5 border border-white/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="font-anton text-xl text-fest-yellow">P26</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-anton text-2xl tracking-wider text-white uppercase group-hover:text-fest-yellow transition-colors flex items-center gap-1.5">
                PIXELPALOOZA
                <span className="text-xs font-grotesk px-1.5 py-0.5 bg-fest-coral text-white rounded font-black tracking-normal">
                  ’26
                </span>
              </span>
              <span className="font-grotesk text-[10px] uppercase font-bold tracking-widest text-fest-cyan">
                GDG ON CAMPUS • NMIMS NAVI MUMBAI
              </span>
            </div>
          </Link>

          {/* Festival Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 font-grotesk text-xs uppercase font-bold tracking-wider text-white/80">
            <a className="hover:text-fest-yellow transition-colors" href="#manifesto">
              THE FESTIVAL
            </a>
            <a className="hover:text-fest-cyan transition-colors" href="#strategy">
              1500 STRATEGY
            </a>
            <a className="hover:text-fest-yellow transition-colors" href="#day1-arena">
              DAY 1 (5 GAMES)
            </a>
            <a className="hover:text-fest-pink transition-colors" href="#day2-auction">
              DAY 2 (THE AUCTION)
            </a>
            <a className="hover:text-fest-gold transition-colors" href="#leaderboard">
              HEADLINERS
            </a>
            <a className="hover:text-fest-coral transition-colors" href="#passes">
              PASSES
            </a>
            <Link className="text-fest-yellow hover:text-white transition-colors" href="/admin">
              [ CONTROL BOOTH ]
            </Link>
          </nav>

          {/* Live Indicator & Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/30 border border-red-500/60 text-red-300 font-grotesk text-xs uppercase font-bold tracking-wider"
              href="/display"
              target="_blank"
              title="Launch Auditorium Stage Projector HUD"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              DAY {eventState.current_day} HUD ↗
            </Link>
            <a
              className="inline-flex items-center justify-center font-grotesk text-xs md:text-sm uppercase font-black px-4 md:px-5 py-2 rounded-xl bg-fest-yellow text-black border-2 border-black retro-shadow-black hover:-translate-y-0.5 hover:bg-white transition-all"
              href="#passes"
            >
              [ GET PASS ]
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO & FESTIVAL ENTRANCE                                       */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-[#22D3EE] via-[#38BDF8] to-[#0284C7] pt-28 md:pt-36 pb-20 px-4 md:px-8 overflow-hidden flex flex-col justify-between">
        {/* Festoon Lights Hanging Across Canopy */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none overflow-hidden select-none">
          <svg className="w-full h-24 text-fest-gold" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 90">
            <path d="M-10,10 Q360,55 720,10 Q1080,55 1450,10" fill="none" stroke="#FDE047" strokeWidth="2.5"></path>
            <path d="M-10,30 Q360,85 720,30 Q1080,85 1450,30" fill="none" stroke="#FDE047" strokeDasharray="6 6" strokeWidth="1.5"></path>
          </svg>
          <div className="absolute top-4 left-0 right-0 flex justify-around max-w-7xl mx-auto px-6">
            <span className="w-4 h-4 rounded-full bg-fest-gold shadow-[0_0_18px_#FDE047] animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-coral shadow-[0_0_18px_#F97316] mt-4 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-pink shadow-[0_0_18px_#FF2A85] mt-6 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-gold shadow-[0_0_18px_#FDE047] mt-3 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-cyan shadow-[0_0_18px_#00E5FF] mt-7 animate-pulse"></span>
          </div>
        </div>

        {/* Hero Core Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto flex flex-col items-center text-center">
          {/* Chapter Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white border-2 border-fest-yellow shadow-[4px_4px_0_#FFE500] mb-6 animate-bounce">
            <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping"></span>
            <span className="font-grotesk text-xs md:text-sm uppercase font-black tracking-widest text-fest-yellow">
              GDG ON CAMPUS • NMIMS NAVI MUMBAI PRESENTS
            </span>
          </div>

          {/* Monumental Editorial Hero Typography */}
          <div className="relative w-full my-2">
            <h1 className="font-anton text-[76px] sm:text-[120px] md:text-[170px] lg:text-[200px] leading-[0.85] tracking-tight uppercase text-white drop-shadow-[0_12px_0_#0F172A] select-none">
              PIXELPALOOZA
            </h1>

            {/* Angled Ribbon */}
            <div className="inline-block transform -rotate-2 -mt-4 sm:-mt-8 md:-mt-12 bg-fest-pink text-white font-anton text-xl sm:text-3xl md:text-4xl uppercase px-6 py-2 border-4 border-black retro-shadow-black">
              2 DAYS • 5 DAY-1 GAMES • 1 DAY-2 AUCTION • 1500 STARTING BUDGET
            </div>
          </div>

          {/* Festival Strategic Descriptor */}
          <p className="font-sans font-semibold text-base sm:text-xl md:text-2xl text-slate-900 max-w-4xl mx-auto mt-6 leading-snug bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border-2 border-black retro-shadow-black">
            The strategic 2-day collegiate tech festival. Squads start with{" "}
            <span className="text-fest-magenta font-black">1500 Event Points</span> in their spendable wallet.
            Participate in 5 Day-1 coordination challenges, or save points to bid aggressively in the{" "}
            <span className="text-blue-900 font-black">Day-2 Tech Auction</span>!
          </p>

          {/* Festival CTA Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            <a
              className="inline-flex items-center gap-3 bg-fest-yellow text-black font-anton text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 rounded-2xl border-4 border-black retro-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] transition-all"
              href="#strategy"
            >
              <Coins className="w-7 h-7" />
              [ HOW 1500 WALLET WORKS ]
            </a>
            <a
              className="inline-flex items-center gap-3 bg-black text-white font-anton text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 rounded-2xl border-4 border-white retro-shadow-cyan hover:translate-x-1 hover:translate-y-1 transition-all"
              href="#leaderboard"
            >
              <Trophy className="w-7 h-7 text-fest-yellow" />
              [ LIVE LEADERBOARD ]
            </a>
          </div>

          {/* Quick Festival Stage Ticker / Live Pill */}
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 bg-black/90 text-white px-6 py-3 rounded-full border-2 border-fest-cyan shadow-[0_0_24px_rgba(0,229,255,0.4)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-fest-pink animate-ping"></span>
              <span className="font-grotesk text-xs uppercase font-black text-fest-pink">
                DAY {eventState.current_day} ON AIR
              </span>
            </div>
            <span className="text-white/40">|</span>
            <span className="font-grotesk text-xs sm:text-sm font-bold text-fest-yellow">
              {eventState.current_day === 1 
                ? (activeGame ? activeGame.name.toUpperCase() : "5 DAY-1 GAMES")
                : (activeAuctionQuestion ? `AUCTION Q#${activeAuctionQuestion.question_number} (${activeAuctionQuestion.category})` : "TECH AUCTION")}
            </span>
            <span className="text-white/40">|</span>
            <span className="font-grotesk text-xs sm:text-sm font-bold text-fest-cyan">
              {headliner ? (
                <>LEADER: {headliner.team.name.toUpperCase()} ({headliner.total_score} PTS)</>
              ) : (
                "AWAITING ARENA SQUADS"
              )}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-12 md:h-20 text-[#FFE500]" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 80">
            <path d="M0,0 C480,100 960,100 1440,0 L1440,80 L0,80 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 1500 WALLET & STRATEGY EXPLAINER (Sunny Festival Yellow)        */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-yellow text-black pt-20 pb-32 px-4 md:px-8 border-b-8 border-black overflow-hidden" id="strategy">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-grotesk text-xs sm:text-sm font-black uppercase tracking-widest bg-black text-fest-yellow px-4 py-1.5 rounded-full inline-block mb-3">
              THE 1500-POINT TOURNAMENT ECONOMY
            </span>
            <h2 className="font-anton text-5xl sm:text-7xl uppercase tracking-tight leading-none text-black">
              STRATEGY OVER SCRIPT
            </h2>
            <p className="font-sans font-bold text-base sm:text-lg text-slate-900 mt-4 leading-relaxed">
              Pixelpalooza is not just a game; it is a live resource-management strategy. Every squad makes critical decisions on which games to play, which to skip, and how many points to reserve for Day 2&apos;s Tech Auction.
            </p>
          </div>

          {/* 5 Strategy Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1: 1500 Starting Budget */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 retro-shadow-black flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black text-fest-yellow flex items-center justify-center font-anton text-2xl mb-4">
                  1500
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wide text-black mb-2">
                  1500 STARTING WALLET
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  When a squad registers, the arena automatically allocates 1500 points into their spendable event wallet. This is your capital to enter games and bid on auction questions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-grotesk uppercase font-black text-emerald-700">
                ✓ AUTOMATICALLY ALLOCATED UPON REGISTRATION
              </div>
            </div>

            {/* Card 2: Inverse Game Entry Costs */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 retro-shadow-black flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-fest-coral text-white flex items-center justify-center font-anton text-2xl mb-4">
                  $$$
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wide text-black mb-2">
                  INVERSE ENTRY COSTS
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Easy games have higher entry costs (e.g. 400 pts), while difficult games have lower entry costs (e.g. 150 pts). High entry fees yield safer plays; low fees reward bold risk-takers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-grotesk uppercase font-black text-fest-coral">
                ⚡ EASY = HIGHER COST • HARD = LOWER COST
              </div>
            </div>

            {/* Card 3: Optional Participation */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 retro-shadow-black flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-fest-cyan text-black flex items-center justify-center font-anton text-2xl mb-4">
                  SKIP
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wide text-black mb-2">
                  OPTIONAL PARTICIPATION
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Squads are NEVER required to play all 5 games! You can enter 1, 2, 3, 4, or 5 games. Choosing to SKIP costs 0 points and preserves your wallet for future rounds.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-grotesk uppercase font-black text-blue-900">
                🛡️ 0 PENALTY FOR SKIPPING GAMES
              </div>
            </div>

            {/* Card 4: Day 2 The Tech Auction */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 retro-shadow-black flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-anton text-2xl mb-4">
                  DAY 2
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wide text-black mb-2">
                  DAY 2: THE TECH AUCTION
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  50–70 curated technical questions are auctioned live. Squads spend their remaining points to win question rights. Correct answers award massive championship scores!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-grotesk uppercase font-black text-purple-700">
                🏛️ 50–70 QUESTIONS • CLIMAX SHOWDOWN
              </div>
            </div>

            {/* Card 5: Wallet vs Earned Score */}
            <div className="bg-white border-4 border-black rounded-3xl p-6 retro-shadow-black flex flex-col justify-between lg:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-fest-pink text-white flex items-center justify-center font-anton text-2xl mb-4">
                  PTS
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wide text-black mb-2">
                  WALLET VS EARNED SCORE
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Your wallet is your spendable event budget. Your score is what you earn through verified performance and correct answers. Organizers configure ranking rules to determine the ultimate Pixelpalooza Grand Champion!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t-2 border-black/10 text-[11px] font-grotesk uppercase font-black text-fest-magenta">
                🏆 TOURNAMENT SCORE DETERMINES THE CHAMPION
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-10 md:h-16 text-fest-cobalt" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 60">
            <path d="M0,0 L40,60 L80,0 L120,60 L160,0 L200,60 L240,0 L280,60 L320,0 L360,60 L400,0 L440,60 L480,0 L520,60 L560,0 L600,60 L640,0 L680,60 L720,0 L760,60 L800,0 L840,60 L880,0 L920,60 L960,0 L1000,60 L1040,0 L1080,60 L1120,0 L1160,60 L1200,0 L1240,60 L1280,0 L1320,60 L1360,0 L1400,60 L1440,0 L1440,60 L0,60 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: DAY 1 ATTRACTIONS (Royal Cobalt & 5 Physical Games)            */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-cobalt text-white pt-20 pb-32 px-4 md:px-8 overflow-hidden" id="day1-arena">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white/20 pb-6 mb-12">
            <div>
              <span className="font-grotesk text-sm uppercase font-black tracking-widest text-fest-cyan bg-fest-cobalt-light px-4 py-1.5 rounded-full border border-fest-cyan/40">
                [ DAY 1 ARENA ATTRACTIONS ]
              </span>
              <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-white mt-3 leading-none">
                5 PHYSICAL GAMES
              </h2>
            </div>
            <p className="font-sans text-base sm:text-lg font-medium text-slate-300 max-w-md">
              Physical coordination, algorithmic deduction, and spatial puzzles. Teams pay entry fees to participate or skip to save budget.
            </p>
          </div>

          {/* 5 Day-1 Game Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {day1Games.map((game, idx) => (
              <div
                key={game.id}
                className="group relative rounded-3xl bg-black p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between"
              >
                <div className="bg-slate-900 rounded-[22px] p-6 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-anton text-sm uppercase px-3 py-1 bg-black text-fest-yellow rounded-md border border-fest-yellow/40">
                        GAME 0{idx + 1} • {game.attraction_stage}
                      </span>
                      <span className="font-grotesk text-xs uppercase font-black bg-fest-coral text-white px-2.5 py-1 rounded">
                        ENTRY: {game.entry_cost} PTS
                      </span>
                    </div>

                    <h3 className="font-anton text-3xl sm:text-4xl uppercase tracking-wide text-white group-hover:text-fest-yellow transition-colors">
                      {game.name}
                    </h3>

                    <div className="flex items-center gap-2 my-2 text-xs font-grotesk">
                      <span className="text-fest-cyan uppercase font-bold">DIFFICULTY: {game.difficulty}</span>
                      <span>•</span>
                      <span className="text-slate-400">{game.duration}</span>
                    </div>

                    <p className="font-sans text-sm text-slate-300 mt-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-white/10 flex items-center justify-between">
                    <span className="font-grotesk text-xs font-bold uppercase text-slate-400">
                      {game.rules.length} RULES
                    </span>
                    <button
                      onClick={() =>
                        setSelectedGameRules({
                          name: game.name,
                          rules: game.rules,
                          scoring_type: game.scoring_type,
                          duration: game.duration,
                          difficulty: game.difficulty,
                          entry_cost: game.entry_cost,
                          description: game.description,
                        })
                      }
                      className="px-4 py-1.5 bg-fest-yellow text-black font-anton text-xs uppercase rounded-lg hover:bg-white transition-colors"
                    >
                      VIEW BRIEF &gt;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-12 md:h-20 text-[#0B0F19]" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 80">
            <path d="M0,60 C400,0 1000,100 1440,20 L1440,80 L0,80 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: DAY 2 THE TECH AUCTION CLIMAX                                  */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#0B0F19] text-white pt-20 pb-32 px-4 md:px-8 border-b-8 border-fest-yellow overflow-hidden" id="day2-auction">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-fest-cyan pb-6 mb-12">
            <div>
              <span className="font-grotesk text-sm uppercase font-black tracking-widest text-fest-cyan bg-cyan-950/70 border border-fest-cyan px-4 py-1.5 rounded-full">
                [ DAY 2 GRAND SHOWDOWN ]
              </span>
              <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-white mt-3 leading-none">
                THE TECH AUCTION
              </h2>
            </div>
            <p className="font-sans text-base sm:text-lg font-medium text-slate-300 max-w-md">
              Approximately 50–70 technical questions. Bids deduct from available wallet. Correct answers award championship points!
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-4 border-black rounded-3xl p-8 retro-shadow-black">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest block mb-2">
                  AUCTION MECHANICS
                </span>
                <h3 className="font-anton text-4xl sm:text-5xl uppercase text-white mb-4">
                  BID SMART. CRACK THE PROMPT. WIN THE TITLE.
                </h3>
                <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  Questions are presented on the main auditorium stage one by one. Teams use their remaining Day 1 wallet points to outbid rivals. Winning a question gives exclusive rights to answer it; correct answers reward points directly into the master tournament score.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/games"
                    className="px-6 py-3.5 bg-fest-yellow text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all"
                  >
                    EXPLORE 2-DAY SCHEDULE ↗
                  </Link>
                  <Link
                    href="/admin"
                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-grotesk text-xs uppercase font-bold rounded-xl border border-white/20 transition-all"
                  >
                    AUCTION CONTROLLER CONSOLE
                  </Link>
                </div>
              </div>

              {/* Auction Live Card */}
              <div className="lg:col-span-5 bg-black/80 border-2 border-fest-yellow/40 rounded-2xl p-6 retro-shadow-yellow shadow-[4px_4px_0px_#FFE500]">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-fest-pink animate-ping" />
                    <span className="font-anton text-sm text-fest-yellow uppercase">
                      {eventState.current_day === 2 ? "🔴 AUCTION LIVE IN ARENA" : "FEATURED AUCTION QUESTION"}
                    </span>
                  </div>
                  <span className="text-xs font-grotesk text-slate-400">
                    Q#{activeAuctionQuestion?.question_number || 1}
                  </span>
                </div>

                <span className="text-[10px] font-grotesk uppercase font-black text-fest-cyan bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                  {activeAuctionQuestion?.category} • {activeAuctionQuestion?.difficulty}
                </span>

                <p className="font-sans text-base font-semibold text-white my-3 leading-relaxed">
                  &ldquo;{activeAuctionQuestion?.question_text}&rdquo;
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">BASE BID</span>
                    <span className="font-anton text-base text-slate-200">{activeAuctionQuestion?.base_price} PTS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">REWARD POOL</span>
                    <span className="font-anton text-base text-fest-yellow">+{activeAuctionQuestion?.reward_points} PTS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: LIVE LEADERBOARD (Day 1 / Day 2 / Overall Tabs)                */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#070913] text-white pt-20 pb-32 px-4 md:px-8 border-b-8 border-fest-yellow overflow-hidden" id="leaderboard">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-fest-yellow pb-6 mb-8">
            <div>
              <span className="font-grotesk text-sm uppercase font-black tracking-widest text-fest-yellow bg-yellow-950/70 border border-fest-yellow px-4 py-1.5 rounded-full">
                [ FESTIVAL MAIN STAGE PODIUM ]
              </span>
              <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-white mt-3 leading-none">
                WHO&apos;S HEADLINING?
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/leaderboard"
                className="px-5 py-2.5 bg-fest-yellow text-black font-anton text-base uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all active:translate-y-0.5"
              >
                STANDALONE LEADERBOARD ↗
              </Link>
            </div>
          </div>

          {/* Integrated Multi-Day Leaderboard Table */}
          <LeaderboardTable standings={standings} games={games} initialTab="overall" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: SQUAD ROSTER CARDS                                             */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-coral text-black pt-20 pb-32 px-4 md:px-8 overflow-hidden" id="passes">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="rounded-3xl bg-white border-4 border-black retro-shadow-lg p-6 sm:p-12 relative overflow-hidden">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white font-grotesk text-xs uppercase font-black tracking-widest mb-4">
                🎟️ OFFICIAL FESTIVAL PASS PORTAL
              </div>
              <h2 className="font-anton text-6xl sm:text-8xl uppercase tracking-tight text-black leading-none">
                CLAIM YOUR FESTIVAL WRISTBAND
              </h2>
              <p className="font-sans text-lg sm:text-xl font-bold text-slate-800 mt-4 leading-relaxed">
                All enrolled students enter free with Student ID. Check in at the NMIMS STME gate to collect your badge &amp; RFID wristband.
              </p>

              {rsvpSubmitted ? (
                <div className="mt-8 p-6 bg-fest-yellow rounded-2xl border-2 border-black retro-shadow-black">
                  <div className="font-anton text-3xl uppercase text-black">
                    🎉 WRISTBAND RSVP CONFIRMED FOR {rsvpName.toUpperCase()}!
                  </div>
                  <p className="font-grotesk text-sm font-bold text-slate-900 mt-2">
                    Show your Student ID at the GDG Checkpoint to enter the Pixelpalooza Arena.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-black font-grotesk text-sm font-bold uppercase focus:outline-none focus:ring-4 focus:ring-fest-yellow"
                    placeholder="STUDENT FULL NAME"
                    type="text"
                  />
                  <input
                    value={rsvpCollege}
                    onChange={(e) => setRsvpCollege(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-black font-grotesk text-sm font-bold uppercase focus:outline-none focus:ring-4 focus:ring-fest-yellow"
                    placeholder="COLLEGE / ROLL NO."
                    type="text"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-black text-white font-anton text-xl uppercase tracking-wider rounded-xl border-2 border-black hover:bg-fest-yellow hover:text-black transition-colors"
                  >
                    CLAIM PASS &gt;
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: MONUMENTAL FESTIVAL FOOTER                                     */}
      {/* ========================================================================= */}
      <footer className="relative w-full bg-black text-white pt-16 pb-12 px-4 md:px-8 border-t-8 border-fest-yellow overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="w-full select-none text-center border-b-4 border-white/20 pb-12 mb-12">
            <div className="font-anton text-[70px] sm:text-[130px] md:text-[180px] lg:text-[230px] uppercase tracking-tight text-white leading-[0.8] drop-shadow-[0_10px_0_#FFE500]">
              PIXELPALOOZA
            </div>
            <div className="font-anton text-2xl sm:text-4xl md:text-5xl text-fest-cyan uppercase tracking-widest mt-4">
              2 DAYS • 5 GAMES • 1 AUCTION ★ 2026
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/20">
            <div className="space-y-3">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow">
                ORGANIZED BY
              </div>
              <h4 className="font-anton text-2xl uppercase text-white">GDG ON CAMPUS</h4>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                NMIMS Navi Mumbai Chapter · School of Technology Management &amp; Engineering.
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-cyan">
                DAY 1 GAMES
              </div>
              <ul className="space-y-1.5 font-grotesk text-xs font-bold uppercase text-slate-300">
                <li><Link className="hover:text-fest-yellow transition-colors" href="/games">Balloon + Cup Tower</Link></li>
                <li><Link className="hover:text-fest-cyan transition-colors" href="/games">GDG Logo Puzzle</Link></li>
                <li><Link className="hover:text-fest-pink transition-colors" href="/games">Tech Pictionary</Link></li>
                <li><Link className="hover:text-fest-coral transition-colors" href="/games">Tech Tambola</Link></li>
                <li><Link className="hover:text-purple-400 transition-colors" href="/games">AI or Human?</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-pink">
                DAY 2 CLIMAX
              </div>
              <ul className="space-y-1.5 font-grotesk text-xs font-bold uppercase text-slate-300">
                <li><Link className="hover:text-white transition-colors" href="/games">The Tech Auction (50–70 Qs)</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/admin">Auctioneer Desk</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/display">Stage Projector HUD</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/leaderboard">Final Tournament Leaderboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow">
                FESTIVAL LOCATION
              </div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed font-semibold">
                NMIMS STME Campus Ground, Sector 33, Kharghar, Navi Mumbai.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-pixel text-[10px] text-fest-yellow block">HOURS: 2-DAY GAUNTLET</span>
                <span className="font-grotesk text-xs text-slate-400 mt-1 block">ENTRY: Free with College ID</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-grotesk text-xs text-slate-400">
            <div>© 2026 PIXELPALOOZA. All festival rights reserved.</div>
            <div className="flex items-center gap-6 uppercase font-bold text-slate-300">
              <Link className="hover:text-fest-yellow" href="/games">FESTIVAL RULES</Link>
              <Link className="hover:text-fest-cyan" href="/leaderboard">LIVE STANDINGS</Link>
              <Link className="hover:text-fest-pink" href="/admin">ADMIN CONTROL</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Rules Modal */}
      {selectedGameRules && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border-4 border-fest-yellow p-6 sm:p-8 rounded-3xl max-w-xl w-full text-white retro-shadow-lg relative">
            <button
              onClick={() => setSelectedGameRules(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-fest-pink text-white font-grotesk font-black flex items-center justify-center border-2 border-black"
            >
              ✕
            </button>
            <div className="font-grotesk text-xs text-fest-cyan uppercase font-bold tracking-widest mb-1">
              DAY 1 ATTRACTION BRIEFING
            </div>
            <h3 className="font-anton text-4xl uppercase text-white mb-2">
              {selectedGameRules.name}
            </h3>
            <div className="flex items-center gap-3 text-xs font-grotesk font-bold text-fest-yellow mb-4">
              <span>⏱ DURATION: {selectedGameRules.duration}</span>
              <span>•</span>
              <span className="text-fest-coral">ENTRY COST: {selectedGameRules.entry_cost} PTS</span>
              <span>•</span>
              <span>DIFFICULTY: {selectedGameRules.difficulty}</span>
            </div>
            <p className="font-sans text-xs text-slate-300 mb-4 leading-relaxed">
              {selectedGameRules.description}
            </p>
            <div className="space-y-2 text-sm font-sans text-slate-300 border-t border-slate-800 pt-4">
              {selectedGameRules.rules.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-fest-yellow font-black">›</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedGameRules(null)}
                className="px-6 py-2.5 bg-fest-yellow text-black font-anton text-base uppercase rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all"
              >
                CLOSE [ ESC ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
