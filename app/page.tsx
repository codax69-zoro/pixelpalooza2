"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useArena } from "@/lib/store/arena-context";
import { soundFx } from "@/lib/audio/sound-fx";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import confetti from "canvas-confetti";

export default function StitchPixelpaloozaFullPage() {
  const {
    teams,
    games,
    standings,
    eventState,
    activeGame,
    currentLeader,
    scoreEvents,
    realtimeStatus,
    addScore,
  } = useArena();

  // Active headliners from real standings
  const headliner = standings[0];
  const second = standings[1];
  const third = standings[2];
  const undercard = standings.slice(3, 8);

  // Selected game rules modal state
  const [selectedGameRules, setSelectedGameRules] = useState<{
    name: string;
    rules: string[];
    scoring_type: string;
    duration: string;
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
          <nav className="hidden lg:flex items-center gap-8">
            <a
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-white/80 hover:text-fest-yellow transition-colors"
              href="#manifesto"
            >
              THE FESTIVAL
            </a>
            <a
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-white/80 hover:text-fest-cyan transition-colors"
              href="#arena"
            >
              7 GAME STAGES
            </a>
            <a
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-white/80 hover:text-fest-pink transition-colors flex items-center gap-2"
              href="#now-live"
            >
              <span className="w-2 h-2 rounded-full bg-fest-pink animate-ping"></span>
              LIVE STAGE
            </a>
            <a
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-white/80 hover:text-fest-gold transition-colors"
              href="#leaderboard"
            >
              HEADLINERS
            </a>
            <a
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-white/80 hover:text-fest-teal-mint transition-colors"
              href="#squads"
            >
              SQUADS
            </a>
            <a
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-white/80 hover:text-fest-coral transition-colors"
              href="#passes"
            >
              PASSES
            </a>
            <Link
              className="font-grotesk text-sm uppercase font-bold tracking-wider text-amber-300 hover:text-white transition-colors"
              href="/admin"
            >
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
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              STAGE 01 LIVE ↗
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
      {/* SECTION 1: HERO & FESTIVAL ENTRANCE (Electric Sky Blue Fairground)        */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-[#22D3EE] via-[#38BDF8] to-[#0284C7] pt-28 md:pt-36 pb-20 px-4 md:px-8 overflow-hidden flex flex-col justify-between">
        {/* Festoon Glowing Fairy Lights Strings Hanging Across Canopy */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none overflow-hidden select-none">
          <svg className="w-full h-24 text-fest-gold" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 90">
            <path d="M-10,10 Q360,55 720,10 Q1080,55 1450,10" fill="none" stroke="#FDE047" strokeWidth="2.5"></path>
            <path
              d="M-10,30 Q360,85 720,30 Q1080,85 1450,30"
              fill="none"
              stroke="#FDE047"
              strokeDasharray="6 6"
              strokeWidth="1.5"
            ></path>
          </svg>

          {/* Glowing Lantern Orbs */}
          <div className="absolute top-4 left-0 right-0 flex justify-around max-w-7xl mx-auto px-6">
            <span className="w-4 h-4 rounded-full bg-fest-gold shadow-[0_0_18px_#FDE047] animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-coral shadow-[0_0_18px_#F97316] mt-4 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-pink shadow-[0_0_18px_#FF2A85] mt-6 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-gold shadow-[0_0_18px_#FDE047] mt-3 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-cyan shadow-[0_0_18px_#00E5FF] mt-7 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-pink shadow-[0_0_18px_#FF2A85] mt-4 animate-pulse"></span>
            <span className="w-4 h-4 rounded-full bg-fest-gold shadow-[0_0_18px_#FDE047] animate-pulse"></span>
          </div>

          {/* Colorful Bunting Pennants */}
          <div className="flex justify-between w-full px-2 -mt-3">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-pink-500"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-emerald-400"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-purple-500"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-500"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-cyan-400"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-400"></div>
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
            <h1 className="font-anton text-[76px] sm:text-[120px] md:text-[170px] lg:text-[210px] leading-[0.85] tracking-tight uppercase text-white drop-shadow-[0_12px_0_#0F172A] select-none">
              PIXELPALOOZA
            </h1>

            {/* Angled Unhinged Festival Ribbon */}
            <div className="inline-block transform -rotate-2 -mt-4 sm:-mt-8 md:-mt-12 bg-fest-pink text-white font-anton text-2xl sm:text-4xl md:text-5xl uppercase px-6 py-2 border-4 border-black retro-shadow-black">
              WHERE IDEAS GET UNHINGED ★ 2026
            </div>
          </div>

          {/* Festival Editorial Descriptor */}
          <p className="font-sans font-semibold text-lg sm:text-2xl md:text-3xl text-slate-900 max-w-4xl mx-auto mt-6 leading-snug drop-shadow-sm bg-white/75 backdrop-blur-md p-4 sm:p-6 rounded-2xl border-2 border-black retro-shadow-black">
            The mega techno-cultural music festival &amp; competitive sandbox gaming arena.{" "}
            <span className="text-fest-magenta font-black">16 Collegiate Squads</span>,{" "}
            <span className="text-blue-900 font-black">7 Biome Stages</span>,{" "}
            <span className="text-emerald-700 font-black">8 Hours</span> of relentless algorithmic combat and digital sonic euphoria.
          </p>

          {/* Festival CTA Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            <a
              className="inline-flex items-center gap-3 bg-fest-yellow text-black font-anton text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 rounded-2xl border-4 border-black retro-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] transition-all"
              href="#arena"
            >
              <span className="material-symbols-outlined text-3xl">sports_esports</span>
              [ ENTER THE 7 GAME ARENAS ]
            </a>
            <a
              className="inline-flex items-center gap-3 bg-black text-white font-anton text-xl sm:text-2xl uppercase tracking-wider px-8 py-4 rounded-2xl border-4 border-white retro-shadow-cyan hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_#00E5FF] transition-all"
              href="#leaderboard"
            >
              <span className="material-symbols-outlined text-3xl text-fest-gold">emoji_events</span>
              [ WHO'S HEADLINING? ]
            </a>
          </div>

          {/* Quick Festival Stage Ticker / Live Pill */}
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 bg-black/90 text-white px-6 py-3 rounded-full border-2 border-fest-cyan shadow-[0_0_24px_rgba(0,229,255,0.4)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-fest-pink animate-ping"></span>
              <span className="font-grotesk text-xs uppercase font-black text-fest-pink">
                STAGE 01 ON AIR
              </span>
            </div>
            <span className="text-white/40">|</span>
            <span className="font-grotesk text-xs sm:text-sm font-bold text-fest-yellow">
              {activeGame ? activeGame.name.toUpperCase() : "TECH JEOPARDY"} {eventState.active_round || "ROUND 3"}
            </span>
            <span className="text-white/40">|</span>
            <span className="font-grotesk text-xs sm:text-sm font-bold text-fest-cyan">
              {headliner ? (
                <>
                  LEADER: {headliner.team.name.toUpperCase()} (
                  <AnimatedCounter value={headliner.total_xp} suffix=" XP" />)
                </>
              ) : (
                "LEADER: STANDBY FOR SQUADS"
              )}
            </span>
          </div>
        </div>

        {/* Monumental Fast Marquee Ticker */}
        <div className="relative z-10 w-full mt-12 -mx-4 md:-mx-8 bg-black border-y-4 border-fest-yellow py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee font-anton text-2xl sm:text-3xl text-fest-yellow uppercase tracking-widest gap-8">
            <span>⚡ 16 COLLEGIATE SQUADS</span>
            <span className="text-fest-cyan">✦</span>
            <span>7 MULTI-GENRE GAME STAGES</span>
            <span className="text-fest-pink">✦</span>
            <span>1 UNIFIED FESTIVAL HEADLINER CROWN</span>
            <span className="text-fest-cyan">✦</span>
            <span>LIVE DJ SET AT NOCTURNE ARENA</span>
            <span className="text-fest-pink">✦</span>
            <span>NEXT ARENA: BOMB DEFUSAL AT 15:30 IST</span>
            <span className="text-fest-cyan">✦</span>
            <span>GDG ON CAMPUS NMIMS NAVI MUMBAI</span>
            <span className="text-fest-pink">✦</span>
            <span>⚡ 16 COLLEGIATE SQUADS</span>
            <span className="text-fest-cyan">✦</span>
            <span>7 MULTI-GENRE GAME STAGES</span>
            <span className="text-fest-pink">✦</span>
            <span>1 UNIFIED FESTIVAL HEADLINER CROWN</span>
            <span className="text-fest-cyan">✦</span>
            <span>LIVE DJ SET AT NOCTURNE ARENA</span>
          </div>
        </div>

        {/* Organic Wave Divider to Yellow Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-12 md:h-20 text-fest-yellow" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 80">
            <path d="M0,40 C320,90 480,10 720,50 C960,90 1120,20 1440,60 L1440,80 L0,80 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: EDITORIAL MANIFESTO (Sunny Festival Yellow World)              */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-yellow text-black pt-16 pb-28 px-4 md:px-8 border-b-8 border-black overflow-hidden" id="manifesto">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Tag */}
          <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-10">
            <span className="font-grotesk text-sm sm:text-base font-black uppercase tracking-widest bg-black text-fest-yellow px-4 py-1 rounded-md">
              FESTIVAL MANIFESTO // VOL. 01
            </span>
            <span className="font-pixel text-[11px] uppercase font-bold tracking-tight text-black">
              [ UNHINGED EDITION ]
            </span>
          </div>

          {/* Giant Editorial Statement Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="font-anton text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.9] text-black">
                WHERE IDEAS <br />
                <span className="bg-black text-white px-3 sm:px-5 inline-block transform -rotate-1 mt-2">
                  GET UNHINGED.
                </span>
              </h2>

              <div className="flex flex-wrap gap-3 font-anton text-xl sm:text-3xl uppercase tracking-wider text-black pt-2">
                <span className="bg-white px-3 py-1 border-2 border-black retro-shadow-black">BUILD.</span>
                <span className="bg-fest-coral text-white px-3 py-1 border-2 border-black retro-shadow-black">PLAY.</span>
                <span className="bg-fest-cyan px-3 py-1 border-2 border-black retro-shadow-black">COMPETE.</span>
                <span className="bg-fest-pink text-white px-3 py-1 border-2 border-black retro-shadow-black">ONE CAMPUS.</span>
                <span className="bg-emerald-400 px-3 py-1 border-2 border-black retro-shadow-black">SEVEN GAMES.</span>
                <span className="bg-black text-fest-yellow px-3 py-1 border-2 border-black retro-shadow-black">ONE CHAMPION.</span>
              </div>

              <p className="font-sans text-xl sm:text-2xl font-bold leading-relaxed text-slate-900 max-w-2xl pt-4">
                Pixelpalooza replaces sterile whiteboard interviews and monotone presentations with an electric, open-air sandbox festival.
                Cheer on student guild captains as they crack live memory leaks, race buzzer timers, defuse terminal bombs, and duel under festival stage laser cannons.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-grotesk text-sm font-bold uppercase">
                  <span className="material-symbols-outlined text-fest-yellow">location_on</span>
                  NMIMS STME Campus, Navi Mumbai
                </div>
                <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-grotesk text-sm font-bold uppercase">
                  <span className="material-symbols-outlined text-fest-pink">schedule</span>
                  Single-Day 8HR Non-Stop Gauntlet
                </div>
              </div>
            </div>

            {/* Poster Visual Showcase Card */}
            <div className="lg:col-span-4">
              <div className="relative group">
                <div className="absolute -inset-3 bg-black rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform"></div>
                <div className="relative bg-white p-3 rounded-2xl border-4 border-black retro-shadow-lg overflow-hidden">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-black bg-slate-900">
                    <Image
                      src="/images/pixelpalooza-poster.jpeg"
                      alt="Official Pixelpalooza 2026 Festival Poster"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-fest-pink text-white font-grotesk text-xs uppercase font-black px-3 py-1 rounded-full border-2 border-black z-10">
                      OFFICIAL POSTER
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-anton text-2xl uppercase tracking-wide text-black">THE ORIGINAL LINEUP</div>
                    <p className="font-grotesk text-xs font-bold uppercase text-slate-600">Google Developer Groups On Campus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inverted Graphic Teeth Divider to Deep Cobalt Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-10 md:h-16 text-fest-cobalt" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 60">
            <path
              d="M0,0 L40,60 L80,0 L120,60 L160,0 L200,60 L240,0 L280,60 L320,0 L360,60 L400,0 L440,60 L480,0 L520,60 L560,0 L600,60 L640,0 L680,60 L720,0 L760,60 L800,0 L840,60 L880,0 L920,60 L960,0 L1000,60 L1040,0 L1080,60 L1120,0 L1160,60 L1200,0 L1240,60 L1280,0 L1320,60 L1360,0 L1400,60 L1440,0 L1440,60 L0,60 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE GAME ARENA (Royal Cobalt & 7 Game Stages)                  */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-cobalt text-white pt-20 pb-32 px-4 md:px-8 overflow-hidden" id="arena">
        {/* Stage Spotlights */}
        <div className="absolute -top-40 left-10 w-96 h-96 bg-fest-cyan/20 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-fest-pink/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-white/20 pb-6 mb-12">
            <div>
              <span className="font-grotesk text-sm uppercase font-black tracking-widest text-fest-cyan bg-fest-cobalt-light px-4 py-1.5 rounded-full border border-fest-cyan/40">
                [ FESTIVAL ATTRACTIONS &amp; STAGE MAP ]
              </span>
              <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-white mt-3 leading-none">
                7 GAME STAGES
              </h2>
            </div>
            <p className="font-sans text-base sm:text-lg font-medium text-slate-300 max-w-md">
              Just like festivalgoers jumping stages between indie, techno, and headliners—squads rotate continuously across 7 distinct arena challenges.
            </p>
          </div>

          {/* 7 Game Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CARD 1: TECH TAMBOLA */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-orange-500 rounded-[22px] p-6 h-full flex flex-col justify-between text-black">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] uppercase font-bold px-3 py-1 bg-black text-orange-400 rounded-md">
                      STAGE 01 • VOXEL BOOTH
                    </span>
                    <span className="font-grotesk text-xs uppercase font-black bg-white/90 px-2.5 py-1 rounded">
                      600 XP
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black text-orange-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">confirmation_number</span>
                  </div>
                  <h3 className="font-anton text-4xl uppercase tracking-wide text-white drop-shadow-[0_2px_0_#000]">
                    TECH TAMBOLA
                  </h3>
                  <p className="font-sans font-bold text-sm text-slate-900 mt-2 leading-relaxed">
                    Algorithmic numbers called via live code outputs! Crack quick syntax riddles to claim house, corners, and full-house before the next ticket falls.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-black/30 flex items-center justify-between">
                  <span className="font-grotesk text-xs font-black uppercase text-black">⚡ RAPID SYNTAX SPRINT</span>
                  <button
                    onClick={() =>
                      setSelectedGameRules({
                        name: "Tech Tambola",
                        rules: games[0]?.rules || [
                          "Participants receive tickets with technical terms.",
                          "Host delivers conceptual clues.",
                          "Fast claim verification by referees.",
                        ],
                        scoring_type: "Line & Full House Claims",
                        duration: "10–15 min",
                      })
                    }
                    className="px-4 py-1.5 bg-black text-white font-grotesk text-xs uppercase font-black rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    RULES &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: TECH PICTIONARY */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-cyan-400 to-teal-500 p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-cyan-400 rounded-[22px] p-6 h-full flex flex-col justify-between text-black">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] uppercase font-bold px-3 py-1 bg-black text-cyan-300 rounded-md">
                      STAGE 02 • BLUEPRINT LAB
                    </span>
                    <span className="font-grotesk text-xs uppercase font-black bg-white/90 px-2.5 py-1 rounded">
                      750 XP
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black text-cyan-300 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">draw</span>
                  </div>
                  <h3 className="font-anton text-4xl uppercase tracking-wide text-white drop-shadow-[0_2px_0_#000]">
                    TECH PICTIONARY
                  </h3>
                  <p className="font-sans font-bold text-sm text-slate-900 mt-2 leading-relaxed">
                    One technician draws cloud architectures, recursion trees, and database schemas on the digital tablet. Squads guess without verbal cues.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-black/30 flex items-center justify-between">
                  <span className="font-grotesk text-xs font-black uppercase text-black">🎨 VISUAL LOGIC ARENA</span>
                  <button
                    onClick={() =>
                      setSelectedGameRules({
                        name: "Tech Pictionary",
                        rules: games[1]?.rules || [
                          "Strict 45-second drawing window per prompt.",
                          "No speaking or writing letters/numbers.",
                          "Categories span Easy, Medium, and Hard architectures.",
                        ],
                        scoring_type: "45s Drawing Rushes",
                        duration: "5–10 min",
                      })
                    }
                    className="px-4 py-1.5 bg-black text-white font-grotesk text-xs uppercase font-black rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    RULES &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: DEBUG THE CODE */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-rose-600 to-red-600 p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-rose-600 rounded-[22px] p-6 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] uppercase font-bold px-3 py-1 bg-black text-rose-300 rounded-md">
                      STAGE 03 • REDSTONE FORGE
                    </span>
                    <span className="font-grotesk text-xs uppercase font-black bg-white text-black px-2.5 py-1 rounded">
                      900 XP
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black text-rose-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">bug_report</span>
                  </div>
                  <h3 className="font-anton text-4xl uppercase tracking-wide text-white drop-shadow-[0_2px_0_#000]">
                    DEBUG THE CODE
                  </h3>
                  <p className="font-sans font-medium text-sm text-rose-100 mt-2 leading-relaxed">
                    Live poisoned codebases! Squashing segmentation faults, race conditions, and infinite recursion loops under relentless strobe stage lights.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-white/30 flex items-center justify-between">
                  <span className="font-grotesk text-xs font-black uppercase text-white">🔥 HARDCORE CRACKING</span>
                  <button
                    onClick={() =>
                      setSelectedGameRules({
                        name: "Debug the Code",
                        rules: games[2]?.rules || [
                          "Round 1: Find the Bug — isolate off-by-one errors and type mismatches.",
                          "Round 2: Predict the Output without running the code.",
                          "Round 3: Rewrite broken snippets into working solutions under pressure.",
                        ],
                        scoring_type: "Multi-Round Code Audit",
                        duration: "10 min",
                      })
                    }
                    className="px-4 py-1.5 bg-white text-black font-grotesk text-xs uppercase font-black rounded-lg hover:bg-black hover:text-white transition-colors"
                  >
                    RULES &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 4: BOMB DEFUSAL */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-amber-500 to-red-500 p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-amber-500 rounded-[22px] p-6 h-full flex flex-col justify-between text-black">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] uppercase font-bold px-3 py-1 bg-black text-amber-300 rounded-md">
                      STAGE 04 • DANGER ZONE
                    </span>
                    <span className="font-grotesk text-xs uppercase font-black bg-white/90 px-2.5 py-1 rounded">
                      1,000 XP
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black text-amber-400 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">timer</span>
                  </div>
                  <h3 className="font-anton text-4xl uppercase tracking-wide text-white drop-shadow-[0_2px_0_#000]">
                    BOMB DEFUSAL
                  </h3>
                  <p className="font-sans font-bold text-sm text-slate-900 mt-2 leading-relaxed">
                    One engineer on terminal, two with cryptographic manuals. Cut the right logical wire before the audio countdown detonates festival penalties!
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-black/30 flex items-center justify-between">
                  <span className="font-grotesk text-xs font-black uppercase text-black">💣 CO-OP CRISIS COMM</span>
                  <button
                    onClick={() =>
                      setSelectedGameRules({
                        name: "Tech Bomb Defusal",
                        rules: games[3]?.rules || [
                          "Puzzle 1: Binary to Hexadecimal conversion.",
                          "Puzzle 2: Boolean Logic Gates evaluation.",
                          "Puzzle 3: Algorithmic output tracing.",
                          "Puzzle 4: Cryptographic Cipher decode.",
                          "Puzzle 5: Minecraft Redstone & Crafting logic puzzle.",
                        ],
                        scoring_type: "5:00 Pressure Countdown",
                        duration: "10–15 min",
                      })
                    }
                    className="px-4 py-1.5 bg-black text-white font-grotesk text-xs uppercase font-black rounded-lg hover:bg-white hover:text-black transition-colors"
                  >
                    RULES &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 5: AI OR HUMAN? */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-purple-600 rounded-[22px] p-6 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] uppercase font-bold px-3 py-1 bg-black text-fuchsia-300 rounded-md">
                      STAGE 05 • TURING BUNKER
                    </span>
                    <span className="font-grotesk text-xs uppercase font-black bg-white text-black px-2.5 py-1 rounded">
                      800 XP
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black text-fuchsia-300 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <h3 className="font-anton text-4xl uppercase tracking-wide text-white drop-shadow-[0_2px_0_#000]">
                    AI OR HUMAN?
                  </h3>
                  <p className="font-sans font-medium text-sm text-purple-100 mt-2 leading-relaxed">
                    Split-second Turing duels. Inspect raw Python snippets, synthetic audio, and pixel shaders to deduce: hand-coded student genius or Gemini prompt?
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-white/30 flex items-center justify-between">
                  <span className="font-grotesk text-xs font-black uppercase text-white">🧠 BLIND INTERROGATION</span>
                  <button
                    onClick={() =>
                      setSelectedGameRules({
                        name: "AI or Human?",
                        rules: games[4]?.rules || [
                          "Teams evaluate paired content: Image A vs B, Code A vs B, Text A vs B.",
                          "Teams submit verdicts on which is synthetic.",
                          "Bonus challenge: AI Minecraft screenshots vs genuine game rendering.",
                        ],
                        scoring_type: "Synthetic Discrimination",
                        duration: "5–10 min",
                      })
                    }
                    className="px-4 py-1.5 bg-white text-black font-grotesk text-xs uppercase font-black rounded-lg hover:bg-black hover:text-white transition-colors"
                  >
                    RULES &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 6: TECH JEOPARDY */}
            <div className="group relative rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 p-1 border-4 border-black retro-shadow-black hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-yellow-400 rounded-[22px] p-6 h-full flex flex-col justify-between text-black">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] uppercase font-bold px-3 py-1 bg-black text-fest-yellow rounded-md">
                      STAGE 06 • MAIN STAGE
                    </span>
                    <span className="font-grotesk text-xs uppercase font-black bg-black text-white px-2.5 py-1 rounded">
                      1,200 XP
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-black text-fest-yellow flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl">stars</span>
                  </div>
                  <h3 className="font-anton text-4xl uppercase tracking-wide text-black drop-shadow-[0_1px_0_#fff]">
                    TECH JEOPARDY
                  </h3>
                  <p className="font-sans font-bold text-sm text-slate-900 mt-2 leading-relaxed">
                    The flagship main stage buzzer spectacle! High-stakes categories from Linux Kernels to Meme Stacks with double multiplier Creeper Traps.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-black/30 flex items-center justify-between">
                  <span className="font-grotesk text-xs font-black uppercase text-black">👑 FLAGSHIP SPECTACLE</span>
                  <a
                    className="px-4 py-1.5 bg-black text-fest-yellow font-grotesk text-xs uppercase font-black rounded-lg hover:bg-white hover:text-black transition-colors"
                    href="#now-live"
                  >
                    WATCH LIVE &gt;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 7: CODE RELAY (Grand Finale Full-Width Banner) */}
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500 p-1 border-4 border-black retro-shadow-black">
            <div className="bg-emerald-500 rounded-[22px] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 text-black">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-black text-emerald-300 font-pixel text-xs px-3 py-1 rounded-md mb-3">
                  <span>STAGE 07</span>
                  <span>•</span>
                  <span>THE GRAND FINALE ARENA</span>
                </div>
                <h3 className="font-anton text-5xl sm:text-7xl uppercase tracking-tight text-white drop-shadow-[0_4px_0_#000] leading-none">
                  CODE RELAY SPRINT
                </h3>
                <p className="font-sans font-bold text-base sm:text-lg text-slate-950 mt-3 leading-relaxed">
                  4 Squad Members. Blind tag-out handoffs every 5 minutes. 400 lines of functional production code. The definitive test of collegiate cohesion and sheer adrenaline!
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-end shrink-0">
                <div className="font-anton text-6xl sm:text-7xl text-black leading-none drop-shadow-[0_2px_0_#fff]">
                  2,500 XP
                </div>
                <span className="font-grotesk text-xs uppercase font-black text-slate-900 tracking-wider">
                  CHAMPIONSHIP MULTIPLIER
                </span>
                <a
                  className="mt-4 px-8 py-3.5 bg-black text-white font-anton text-xl uppercase tracking-wider rounded-xl border-2 border-white retro-shadow-black hover:bg-white hover:text-black transition-colors"
                  href="#passes"
                >
                  [ ENTER CODE ARENA ]
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal Cut Divider to Hot Pink / Magenta Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-12 md:h-20 text-fest-magenta" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 70">
            <polygon fill="currentColor" points="0,70 1440,0 1440,70"></polygon>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: NOW LIVE (Concert Stage Night Atmosphere / Telemetry)           */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-magenta text-white pt-20 pb-32 px-4 md:px-8 overflow-hidden" id="now-live">
        {/* Laser Beam Graphic Streaks */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-1 h-full bg-fest-cyan absolute left-1/4 transform -rotate-12 blur-sm"></div>
          <div className="w-1 h-full bg-fest-yellow absolute right-1/4 transform rotate-12 blur-sm"></div>
          <div className="w-1 h-full bg-white absolute left-2/3 transform -rotate-45 blur-sm"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Tag Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 border-black pb-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-black px-4 py-1.5 rounded-full border border-white/20 mb-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-grotesk text-xs uppercase font-black text-white tracking-widest">
                  LIVE BROADCAST ON STAGE 01
                </span>
              </div>
              <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-white leading-none">
                NOW ON STAGE
              </h2>
            </div>
            <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-black">
              <span className="material-symbols-outlined text-fest-yellow text-3xl">sensors</span>
              <div>
                <div className="font-grotesk text-xs font-black uppercase text-fest-cyan">
                  AUDITORIUM AUDIO / VIDEO FEED
                </div>
                <div className="font-sans text-xs text-slate-300">
                  Live Stage Sync: {realtimeStatus === "connected" ? "WebSocket Synced" : "Local Broadcast"} • Latency: 9ms
                </div>
              </div>
            </div>
          </div>

          {/* Live Broadcast Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Live Virtual Screen Simulator HUD */}
            <div className="lg:col-span-8 bg-black rounded-3xl p-6 border-4 border-black retro-shadow-black flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="font-grotesk text-sm font-black uppercase text-white tracking-wider">
                    CAM-01 • MAIN AUDITORIUM
                  </span>
                </div>
                <span className="font-pixel text-[11px] text-fest-yellow uppercase">
                  {eventState.active_round || "ROUND 3 // QUESTION 08"}
                </span>
              </div>

              {/* Question Display Board */}
              <div className="my-6 bg-gradient-to-b from-slate-900 to-black p-8 rounded-2xl border-2 border-fest-cyan/40 text-center relative overflow-hidden">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-fest-pink/30 rounded-full blur-2xl"></div>
                <span className="font-pixel text-xs uppercase text-fest-pink tracking-widest">
                  [ CATEGORY: VOXEL CONCURRENCY ]
                </span>
                <h4 className="font-anton text-3xl sm:text-5xl uppercase text-white mt-4 tracking-wide leading-tight">
                  &quot;WHICH CONCURRENCY MODEL PREVENTS RACE CONDITIONS IN MULTI-THREADED VOXEL CHUNK GENERATION?&quot;
                </h4>
                <div className="mt-6 inline-flex items-center gap-3 px-6 py-2 rounded-xl bg-red-950/80 border border-red-500 text-red-200 font-mono text-base font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <span className="material-symbols-outlined text-red-400 animate-bounce">alarm</span>
                  BUZZER WINDOW EXPIRES IN: <span className="text-white text-xl font-black">00:08.4s</span>
                </div>

                {/* Active Stage Teams or Standby Indicator */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                  <div className="p-3 rounded-xl border bg-emerald-950/70 border-emerald-500 flex items-center justify-between">
                    <span className="font-grotesk text-xs uppercase font-black text-emerald-300">
                      {headliner ? headliner.team.name.toUpperCase() : "STAGE SQUAD ALPHA"}
                    </span>
                    <span className="font-pixel text-[10px] text-emerald-400">
                      {headliner ? "LOCKED IN" : "STANDBY"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                    <span className="font-grotesk text-xs uppercase font-bold text-slate-400">
                      {second ? second.team.name.toUpperCase() : "STAGE SQUAD BETA"}
                    </span>
                    <span className="font-pixel text-[10px] text-slate-500">
                      {second ? "ACTIVE" : "PENDING"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage Controls & Stream Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <Link
                    href="/display"
                    target="_blank"
                    className="px-5 py-2.5 bg-fest-pink text-white font-anton text-base uppercase tracking-wider rounded-xl border-2 border-white hover:bg-white hover:text-black transition-all flex items-center gap-2"
                  >
                    <span>[ AUDITORIUM STREAM ↗ ]</span>
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="px-4 py-2.5 bg-slate-800 text-fest-cyan font-grotesk text-xs uppercase font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    [ STANDINGS ]
                  </Link>
                </div>
                <span className="font-grotesk text-xs font-bold text-slate-400 uppercase">
                  STAGE HOST: GDG CORE ORGANIZERS
                </span>
              </div>
            </div>

            {/* Live Combat Telemetry Log */}
            <div className="lg:col-span-4 bg-fest-magenta-dark rounded-3xl p-6 border-4 border-black retro-shadow-black flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                  <span className="font-anton text-2xl uppercase tracking-wider text-white">LIVE COMBAT LOG</span>
                  <span className="font-pixel text-[10px] text-fest-cyan">AUTO-FEED</span>
                </div>
                <div className="mt-4 space-y-2.5 font-sans text-xs max-h-80 overflow-y-auto pr-1">
                  {/* Real Score Events from database/context */}
                  {scoreEvents.slice(0, 5).map((evt) => {
                    const squad = teams.find((t) => t.id === evt.team_id);
                    const game = games.find((g) => g.id === evt.game_id);
                    const time = new Date(evt.created_at).toTimeString().split(" ")[0];
                    return (
                      <div key={evt.id} className="p-3 rounded-xl bg-black/50 border border-white/10 text-slate-200">
                        <span className="text-fest-yellow font-bold">[{time}]</span>{" "}
                        <strong className="text-fest-cyan">{squad ? squad.name.toUpperCase() : "SQUAD"}</strong>{" "}
                        {evt.points >= 0 ? "scored" : "penalty"}{" "}
                        <span className={`font-bold ${evt.points >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {evt.points >= 0 ? `+${evt.points}` : evt.points} XP
                        </span>{" "}
                        in <span className="text-fest-pink">#{game ? game.name : "Arena"}</span>
                      </div>
                    );
                  })}

                  {/* Clean standby state if no events yet */}
                  {scoreEvents.length === 0 && (
                    <div className="p-5 rounded-xl bg-black/50 border border-white/10 text-center text-slate-400 font-grotesk text-xs leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-fest-cyan inline-block mr-2 animate-ping"></span>
                      ARENA FEED ACTIVE // Standby for live referee score dispatches from the 7 attraction stages.
                    </div>
                  )}
                </div>
              </div>

              {/* Festival Power Hour Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-fest-yellow text-black border-2 border-black retro-shadow-black">
                <div className="font-anton text-xl uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-red-600">local_fire_department</span>
                  FESTIVAL POWER HOUR
                </div>
                <p className="font-sans text-xs font-bold mt-1 text-slate-900 leading-snug">
                  All stage XP is currently multiplied by 1.5x until the next stage changeover!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Smooth Curve Divider to Midnight Obsidian Leaderboard */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-12 md:h-20 text-[#0B0F19]" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 80">
            <path d="M0,60 C400,0 1000,100 1440,20 L1440,80 L0,80 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: WHO'S HEADLINING? (Midnight Obsidian Festival Leaderboard)     */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-[#0B0F19] text-white pt-20 pb-32 px-4 md:px-8 border-b-8 border-fest-yellow overflow-hidden" id="leaderboard">
        {/* Golden Stage Spotlights Overhead */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-fest-yellow/20 via-fest-yellow/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-fest-yellow pb-6 mb-12">
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
                VIEW FULL LEADERBOARD ↗
              </Link>
              <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-grotesk text-xs uppercase font-bold text-slate-300">
                  {realtimeStatus === "connected" ? "WEBSOCKET SYNC ACTIVE" : "LOCAL BROADCAST LIVE"}
                </span>
              </div>
            </div>
          </div>

          {/* Top 3 Festival Headliners */}
          {standings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-16">
              {/* #02 CO-HEADLINER (Silver Stage) */}
              <div className="order-2 lg:order-1 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-900 p-1 border-4 border-slate-400 retro-shadow-black">
                <div className="bg-slate-900 rounded-[22px] p-6 text-center">
                  <div className="inline-flex items-center gap-2 font-pixel text-xs text-slate-300 px-3 py-1 rounded bg-slate-800 mb-4">
                    🥈 #02 CO-HEADLINER
                  </div>
                  <div className="font-grotesk text-xs uppercase font-bold text-fest-cyan truncate">
                    CAPTAIN: {second?.team.captain?.toUpperCase() || "TBA"}
                  </div>
                  <h3 className="font-anton text-4xl sm:text-5xl uppercase text-white mt-2 truncate">
                    {second ? second.team.name : "STANDBY SQUAD"}
                  </h3>
                  <p className="font-sans text-xs text-slate-400 mt-2">
                    {second?.team.members?.length ? `${second.team.members.length} Squad Members` : "Collegiate Contender"}
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-anton text-4xl text-fest-cyan">
                      <AnimatedCounter value={second?.total_xp || 0} suffix=" XP" />
                    </span>
                    <span className="font-grotesk text-xs uppercase font-bold text-emerald-400">
                      {second?.games_played || 0} STAGES
                    </span>
                  </div>
                </div>
              </div>

              {/* #01 FESTIVAL HEADLINER (Gold Stage - Gigantic Scale) */}
              <div className="order-1 lg:order-2 rounded-3xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 p-1.5 border-4 border-black retro-shadow-gold relative lg:-mt-10">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-fest-yellow font-anton text-base sm:text-lg uppercase px-6 py-1 rounded-full border-2 border-fest-yellow shadow-lg flex items-center gap-2 whitespace-nowrap">
                  👑 UNDISPUTED FESTIVAL HEADLINER
                </div>
                <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded-[20px] p-8 text-center text-white">
                  <div className="text-5xl mb-2">⚡</div>
                  <div className="font-grotesk text-xs uppercase font-black text-fest-yellow tracking-widest truncate">
                    CAPTAIN: {headliner?.team.captain?.toUpperCase() || "TBA"}
                  </div>
                  <h3 className="font-anton text-5xl sm:text-7xl uppercase text-white mt-2 leading-none truncate">
                    {headliner?.team.name || "HEADLINER SQUAD"}
                  </h3>
                  <p className="font-sans font-medium text-sm text-slate-300 mt-3 max-w-sm mx-auto">
                    Leading the festival arena standings across {headliner?.games_played || 0} completed stages.
                  </p>
                  <div className="mt-8 pt-6 border-t-2 border-fest-yellow/40 flex items-center justify-between">
                    <div className="text-left">
                      <span className="font-anton text-6xl sm:text-7xl text-fest-yellow leading-none">
                        <AnimatedCounter value={headliner?.total_xp || 0} />
                      </span>
                      <span className="font-anton text-2xl text-fest-yellow ml-1">XP</span>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-emerald-500 text-black font-grotesk text-xs uppercase font-black rounded">
                        PODIUM LEADER
                      </span>
                      <div className="font-sans text-[11px] text-slate-400 mt-1">
                        Rank 01 of {teams.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* #03 CO-HEADLINER (Bronze Stage) */}
              <div className="order-3 rounded-3xl bg-gradient-to-b from-amber-700 to-amber-950 p-1 border-4 border-amber-600 retro-shadow-black">
                <div className="bg-slate-900 rounded-[22px] p-6 text-center">
                  <div className="inline-flex items-center gap-2 font-pixel text-xs text-amber-400 px-3 py-1 rounded bg-slate-800 mb-4">
                    🥉 #03 CO-HEADLINER
                  </div>
                  <div className="font-grotesk text-xs uppercase font-bold text-fest-pink truncate">
                    CAPTAIN: {third?.team.captain?.toUpperCase() || "TBA"}
                  </div>
                  <h3 className="font-anton text-4xl sm:text-5xl uppercase text-white mt-2 truncate">
                    {third ? third.team.name : "STANDBY SQUAD"}
                  </h3>
                  <p className="font-sans text-xs text-slate-400 mt-2">
                    {third?.team.members?.length ? `${third.team.members.length} Squad Members` : "Collegiate Contender"}
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-anton text-4xl text-fest-pink">
                      <AnimatedCounter value={third?.total_xp || 0} suffix=" XP" />
                    </span>
                    <span className="font-grotesk text-xs uppercase font-bold text-slate-400">
                      {third?.games_played || 0} STAGES
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900/90 border-4 border-black p-10 text-center retro-shadow-black my-8">
              <span className="font-pixel text-xs uppercase tracking-widest text-fest-yellow bg-yellow-950/70 border border-fest-yellow px-4 py-1.5 rounded-full inline-block mb-4">
                👑 FESTIVAL HEADLINER STAGE
              </span>
              <h3 className="font-anton text-4xl sm:text-6xl text-white uppercase tracking-wider">
                STANDBY FOR QUALIFYING SQUADS
              </h3>
              <p className="font-sans text-sm text-slate-400 max-w-lg mx-auto mt-3">
                Live rankings will dynamically broadcast here the instant referees submit round scores from any of the 7 festival game attractions.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/leaderboard"
                  className="px-6 py-3 bg-fest-cyan text-black font-anton text-lg uppercase tracking-wider rounded-xl border-2 border-black retro-shadow-black hover:bg-white transition-all"
                >
                  OPEN LIVE STANDINGS
                </Link>
                <Link
                  href="/games"
                  className="px-6 py-3 bg-slate-800 text-white font-anton text-lg uppercase tracking-wider rounded-xl border-2 border-slate-700 hover:bg-slate-700 transition-all"
                >
                  EXPLORE 7 ATTRACTIONS
                </Link>
              </div>
            </div>
          )}

          {/* Chaser Squads Matrix (The Undercard) */}
          <div className="rounded-3xl bg-slate-900/90 border-4 border-black p-6 sm:p-8 retro-shadow-black">
            <div className="font-anton text-2xl uppercase tracking-wider text-fest-yellow pb-4 border-b border-slate-800 flex items-center justify-between">
              <span>THE UNDERCARD // SQUADS 04 — 08</span>
              <span className="font-grotesk text-xs font-bold text-slate-400 uppercase">XP CHANGER WINDOW: OPEN</span>
            </div>
            <div className="divide-y divide-slate-800 mt-2">
              {/* Dynamic Undercard from real standings */}
              {undercard.length > 0 ? (
                undercard.map((item, idx) => (
                  <div key={item.team.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="font-anton text-3xl text-slate-500 w-10">
                        {String(idx + 4).padStart(2, "0")}
                      </span>
                      <div>
                        <Link
                          href={`/teams/${item.team.id}`}
                          className="font-anton text-2xl uppercase text-white hover:text-fest-cyan transition-colors"
                        >
                          {item.team.name}
                        </Link>
                        <span className="font-sans text-xs text-slate-400 ml-3">
                          CAPTAIN: {item.team.captain?.toUpperCase() || "TBA"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-36 bg-slate-800 h-2.5 rounded-full overflow-hidden hidden md:block">
                        <div
                          className="bg-fest-cyan h-full"
                          style={{ width: `${Math.min(100, Math.round((item.total_xp / (headliner?.total_xp || 1000)) * 100))}%` }}
                        ></div>
                      </div>
                      <span className="font-anton text-2xl text-white">
                        <AnimatedCounter value={item.total_xp} suffix=" XP" />
                      </span>
                      <span className="font-grotesk text-xs font-bold text-emerald-400">
                        {item.games_played} STAGES
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 font-grotesk text-xs uppercase tracking-wider">
                  ● AWAITING ADDITIONAL QUALIFYING SQUADS (RANKS 04 — 08)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Festival Poster Teeth Divider to Teal Section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-10 md:h-16 text-fest-teal" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 60">
            <path d="M0,60 L720,0 L1440,60 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: MEET THE SQUADS (Electric Teal Festival Artist Lineup)         */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-teal text-white pt-20 pb-32 px-4 md:px-8 overflow-hidden" id="squads">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-6 mb-12">
            <div>
              <span className="font-grotesk text-sm uppercase font-black tracking-widest text-black bg-white px-4 py-1.5 rounded-full">
                [ SQUAD LINEUP &amp; ARTIST CARDS ]
              </span>
              <h2 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-white mt-3 leading-none">
                MEET THE SQUADS
              </h2>
            </div>
            <p className="font-sans text-base sm:text-lg font-bold text-slate-900 max-w-md">
              16 handpicked collegiate dev guilds. Formatted like festival headline artists with captain profiles, win rates, and stage specialties.
            </p>
          </div>

          {/* Squad Artist Cards Grid */}
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.slice(0, 8).map((team, idx) => {
                const teamStanding = standings.find((s) => s.team.id === team.id);
                const xp = teamStanding?.total_xp || 0;
                const badges = [
                  "🎤 HEADLINER",
                  "🎸 CO-HEADLINER",
                  "🎮 DEFUSAL UNIT",
                  "⚡ BUG PURGER",
                  "🔥 CODE BLITZ",
                  "💎 BIT CRUSHER",
                  "🚀 PIXEL FORCE",
                  "👾 VOXEL GUARD",
                ];
                const icons = ["🎤", "🎸", "🎮", "⚡", "🔥", "💎", "🚀", "👾"];
                const badgeText = badges[idx % badges.length];
                const icon = icons[idx % icons.length];

                return (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="rounded-3xl bg-black p-3 border-4 border-black retro-shadow-black group hover:-translate-y-2 transition-all block"
                  >
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 relative flex items-center justify-center">
                      <span className="text-6xl">{icon}</span>
                      <span className="absolute bottom-2 left-2 bg-fest-yellow text-black font-grotesk text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        {badgeText}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-anton text-2xl uppercase text-white group-hover:text-fest-yellow transition-colors truncate">
                          {team.name}
                        </h3>
                        <span className="text-xl">{idx === 0 ? "👑" : "★"}</span>
                      </div>
                      <p className="font-sans text-xs text-slate-300 mt-1 truncate">
                        {team.members?.length ? `${team.members.length} Squad Members` : "Collegiate Contender"}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between font-grotesk text-xs">
                        <span className="text-fest-cyan font-bold truncate max-w-[140px]">
                          LEAD: {team.captain?.toUpperCase() || "TBA"}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {xp > 0 ? `${xp} XP` : "READY"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-black/30 border-4 border-black p-10 text-center">
              <span className="font-anton text-3xl uppercase text-white">NO SQUADS REGISTERED YET</span>
              <p className="font-grotesk text-sm text-slate-800 font-bold mt-2">
                Teams will automatically appear here as they register and check in at the control booth.
              </p>
            </div>
          )}
        </div>

        {/* Geometric Sawtooth Divider to Radiant Coral Pass Portal */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-10 md:h-16 text-fest-coral" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 60">
            <path
              d="M0,0 L120,60 L240,0 L360,60 L480,0 L600,60 L720,0 L840,60 L960,0 L1080,60 L1200,0 L1320,60 L1440,0 L1440,60 L0,60 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: FESTIVAL PASS & REGISTRATION (Radiant Sunlit Coral / Orange)   */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-fest-coral text-black pt-20 pb-32 px-4 md:px-8 overflow-hidden" id="passes">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Ticket Pass Card */}
          <div className="rounded-3xl bg-white border-4 border-black retro-shadow-lg p-6 sm:p-12 relative overflow-hidden">
            {/* Ticket Stub Notches */}
            <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-fest-coral border-4 border-black"></div>
            <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-fest-coral border-4 border-black"></div>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black text-white font-grotesk text-xs uppercase font-black tracking-widest mb-4">
                🎟️ OFFICIAL FESTIVAL PASS PORTAL
              </div>
              <h2 className="font-anton text-6xl sm:text-8xl uppercase tracking-tight text-black leading-none">
                CLAIM YOUR FESTIVAL WRISTBAND
              </h2>
              <p className="font-sans text-lg sm:text-xl font-bold text-slate-800 mt-4 leading-relaxed">
                All enrolled college students enter free with Student ID. Collect your high-density RFID wristband at the NMIMS STME gate to register live stage buzzer tags and claim custom festival stickers.
              </p>

              {/* Interactive Wristband Form */}
              {rsvpSubmitted ? (
                <div className="mt-8 p-6 bg-fest-yellow rounded-2xl border-2 border-black retro-shadow-black">
                  <div className="font-anton text-3xl uppercase text-black">
                    🎉 WRISTBAND RSVP CONFIRMED FOR {rsvpName.toUpperCase()}!
                  </div>
                  <p className="font-grotesk text-sm font-bold text-slate-900 mt-2">
                    Show your Student ID at the GDG Checkpoint at STME Gate to collect your badge &amp; RFID wristband.
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

              {/* Festival Perks Chips */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-grotesk font-black uppercase text-slate-900">
                <span className="flex items-center gap-1.5 bg-fest-yellow px-3 py-1.5 rounded-lg border-2 border-black">
                  <span className="material-symbols-outlined text-base">check_circle</span> UNLIMITED STAGE ARENA ACCESS
                </span>
                <span className="flex items-center gap-1.5 bg-fest-cyan px-3 py-1.5 rounded-lg border-2 border-black">
                  <span className="material-symbols-outlined text-base">check_circle</span> OFFICIAL GDG MERCH STICKERS
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-300 px-3 py-1.5 rounded-lg border-2 border-black">
                  <span className="material-symbols-outlined text-base">check_circle</span> DJ STAGE &amp; NOCTURNE RAVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Monumental Wave Cut Divider to Giant Poster Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none translate-y-1">
          <svg className="w-full h-12 md:h-20 text-black" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 80">
            <path d="M0,0 C480,100 960,100 1440,0 L1440,80 L0,80 Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: MONUMENTAL FESTIVAL POSTER FINALE & FOOTER                     */}
      {/* ========================================================================= */}
      <footer className="relative w-full bg-black text-white pt-16 pb-12 px-4 md:px-8 border-t-8 border-fest-yellow overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Gigantic Overlapping Lettering */}
          <div className="w-full select-none text-center border-b-4 border-white/20 pb-12 mb-12">
            <div className="font-anton text-[70px] sm:text-[130px] md:text-[180px] lg:text-[230px] uppercase tracking-tight text-white leading-[0.8] drop-shadow-[0_10px_0_#FFE500]">
              PIXELPALOOZA
            </div>
            <div className="font-anton text-2xl sm:text-4xl md:text-5xl text-fest-cyan uppercase tracking-widest mt-4">
              WHERE IDEAS GET UNHINGED ★ 2026
            </div>
          </div>

          {/* Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/20">
            {/* Col 1: Organization */}
            <div className="space-y-3">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow">
                ORGANIZED BY
              </div>
              <h4 className="font-anton text-2xl uppercase text-white">GDG ON CAMPUS</h4>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                NMIMS Navi Mumbai Chapter · School of Technology Management &amp; Engineering. Ordeals in sandbox game design and algorithmic festivals.
              </p>
            </div>

            {/* Col 2: The 7 Stages */}
            <div className="space-y-2">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-cyan">
                THE 7 STAGES
              </div>
              <ul className="space-y-1.5 font-grotesk text-xs font-bold uppercase text-slate-300">
                <li><a className="hover:text-fest-yellow transition-colors" href="#arena">Stage 01: Tech Tambola</a></li>
                <li><a className="hover:text-fest-cyan transition-colors" href="#arena">Stage 02: Tech Pictionary</a></li>
                <li><a className="hover:text-fest-pink transition-colors" href="#arena">Stage 03: Debug the Code</a></li>
                <li><a className="hover:text-fest-coral transition-colors" href="#arena">Stage 04: Bomb Defusal</a></li>
                <li><a className="hover:text-purple-400 transition-colors" href="#arena">Stage 05: AI or Human?</a></li>
                <li><a className="hover:text-fest-yellow transition-colors" href="#arena">Stage 06: Tech Jeopardy (Main)</a></li>
                <li><a className="hover:text-emerald-400 transition-colors" href="#arena">Stage 07: Code Relay Sprint</a></li>
              </ul>
            </div>

            {/* Col 3: Festival Links */}
            <div className="space-y-2">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-pink">
                COMMUNITY &amp; LIVE COMMS
              </div>
              <ul className="space-y-1.5 font-grotesk text-xs font-bold uppercase text-slate-300">
                <li><Link className="hover:text-white transition-colors" href="/admin">Organizer Control Booth</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/display">Stage Projector Stream</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/leaderboard">Standalone Leaderboard</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/games">Game Stations Matrix</Link></li>
                <li><a className="hover:text-white transition-colors" href="#passes">Wristband Portal</a></li>
              </ul>
            </div>

            {/* Col 4: Campus Map & Details */}
            <div className="space-y-3">
              <div className="font-grotesk text-xs uppercase font-black tracking-widest text-fest-yellow">
                FESTIVAL LOCATION
              </div>
              <p className="font-sans text-xs text-slate-300 leading-relaxed font-semibold">
                NMIMS STME Campus Ground, Plot No. 2, Sector 33, Kharghar, Navi Mumbai, Maharashtra 410210.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-pixel text-[10px] text-fest-yellow block">HOURS: 09:00 - 21:00 IST</span>
                <span className="font-grotesk text-xs text-slate-400 mt-1 block">ENTRY: Free with College ID</span>
              </div>
            </div>
          </div>

          {/* Bottom Credits & Copyright */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-grotesk text-xs text-slate-400">
            <div>
              © 2026 PIXELPALOOZA. All festival trademarks, voxel stages, and campus rights reserved.
            </div>
            <div className="flex items-center gap-6 uppercase font-bold text-slate-300">
              <a className="hover:text-fest-yellow" href="#arena">FESTIVAL RULES</a>
              <a className="hover:text-fest-cyan" href="#">CODE OF CONDUCT</a>
              <a className="hover:text-fest-pink" href="#">ARENA SAFETY</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* RULES INSPECTION MODAL                                                    */}
      {/* ========================================================================= */}
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
              OFFICIAL ATTRACTION RULES &amp; SCORING
            </div>
            <h3 className="font-anton text-4xl uppercase text-white mb-2">
              {selectedGameRules.name}
            </h3>
            <div className="flex items-center gap-3 text-xs font-grotesk font-bold text-fest-yellow mb-4">
              <span>⏱ DURATION: {selectedGameRules.duration}</span>
              <span>•</span>
              <span>🏆 SCORING: {selectedGameRules.scoring_type}</span>
            </div>
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
