"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, 
  Gamepad2, 
  Tv, 
  Volume2, 
  VolumeX, 
  Users, 
  ExternalLink,
  Terminal,
  Music,
  Tent,
  Radio
} from "lucide-react";
import { useArena } from "@/lib/store/arena-context";
import { soundFx } from "@/lib/audio/sound-fx";

export function Navbar() {
  const pathname = usePathname();
  const { eventState, activeGame, teams, realtimeStatus } = useArena();
  const [muted, setMuted] = useState(soundFx.getIsMuted());

  const toggleSound = () => {
    const isMuted = soundFx.toggleMute();
    setMuted(isMuted);
  };

  const navLinks = [
    { href: "/", label: "PUBLIC ARENA", icon: Gamepad2 },
    { href: "/leaderboard", label: "LIVE LEADERBOARD", icon: Trophy },
    { href: "/games", label: "FESTIVAL ATTRACTIONS", icon: Gamepad2 },
    { href: teams[0] ? `/teams/${teams[0].id}` : "/teams", label: "SQUAD PROFILE", icon: Users },
    { href: "/display", label: "STAGE HUD", icon: Tv },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-obsidian-950/95 backdrop-blur border-b border-voxel-border px-3 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Audio Wave Logo matching Stitch screen */}
            <div className="w-8 h-8 bg-gradient-to-br from-festival-pink to-purple-600 border border-festival-pink/60 flex items-center justify-center shadow-voxel-sm group-hover:scale-105 transition-all">
              <span className="text-white font-mono text-xs font-black">|||</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-sm tracking-wide font-mono flex items-center gap-1">
                  <span>PIXELPALOOZA</span>
                  <span className="text-festival-pink text-xs">🎵</span>
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-400 uppercase font-mono font-medium flex items-center gap-1">
                <span className="text-festival-cyan font-bold">GDG ON CAMPUS</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">NMIMS NAVI MUMBAI</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 transition-all flex items-center gap-1.5 border-b-2 ${
                  isActive
                    ? "text-festival-pink border-festival-pink bg-festival-pink/10 font-bold"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Pills & Admin Action */}
        <div className="flex items-center gap-2">
          {/* Admin Control Booth Button */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-obsidian-900 hover:bg-festival-pink/15 text-festival-pink border border-festival-pink/60 hover:border-festival-pink px-2.5 py-1 text-xs font-mono font-semibold transition-all shadow-voxel-sm active:translate-y-0.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CONTROL BOOTH</span>
          </Link>

          {/* Event Status Live Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-obsidian-900 border border-slate-800 px-2.5 py-1 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-realm-emerald animate-pulse" />
            <span className="text-realm-emerald font-bold">FESTIVAL LIVE</span>
          </div>

          {/* Active Attraction Pill */}
          <div className="hidden xl:flex items-center gap-1.5 bg-obsidian-900 border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300">
            <span className="text-[9px] uppercase tracking-wider text-slate-500">STAGE:</span>
            <span className="font-semibold text-festival-cyan truncate max-w-[120px]">
              {activeGame?.attraction_stage || activeGame?.name || "Main Stage"}
            </span>
          </div>

          {/* Squads Count */}
          <div className="hidden sm:flex items-center gap-1 bg-obsidian-900 border border-slate-800 px-2 py-1 text-[11px] font-mono text-slate-300">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{teams.length} SQUADS</span>
          </div>

          {/* Stage Projector Button (Amber with tent icon matching Stitch) */}
          <Link
            href="/display"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-festival-orange text-black font-black px-2.5 py-1 text-[11px] font-mono shadow-voxel-sm hover:brightness-110 transition-all active:translate-y-0.5"
            title="Open Stage Projector HUD"
          >
            <Tent className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>STAGE PROJECTOR ↗</span>
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            className="p-1.5 bg-obsidian-900 hover:bg-obsidian-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-festival-emerald" />}
          </button>
        </div>
      </div>
    </header>
  );
}
