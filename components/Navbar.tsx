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
  Terminal,
  Tent
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
    { href: "/", label: "FESTIVAL ARENA", icon: Gamepad2 },
    { href: "/leaderboard", label: "LIVE LEADERBOARD", icon: Trophy },
    { href: "/games", label: "2-DAY ATTRACTIONS", icon: Gamepad2 },
    { href: teams[0] ? `/teams/${teams[0].id}` : "/#leaderboard", label: "SQUAD DOSSIER", icon: Users },
    { href: "/display", label: "STAGE HUD", icon: Tv },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b-2 border-white/20 px-3 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* P26 Badge */}
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/10 p-0.5 border border-white/30 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="font-anton text-lg text-fest-yellow">P26</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-anton text-xl tracking-wider text-white uppercase group-hover:text-fest-yellow transition-colors flex items-center gap-1.5">
                PIXELPALOOZA
                <span className="text-[10px] font-grotesk px-1.5 py-0.5 bg-fest-coral text-white rounded font-black tracking-normal">
                  ’26
                </span>
              </span>
              <span className="font-grotesk text-[9px] uppercase font-bold tracking-widest text-fest-cyan">
                GDG ON CAMPUS • NMIMS NAVI MUMBAI
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-2 font-grotesk text-xs uppercase font-bold tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-fest-yellow text-black font-black shadow-[2px_2px_0px_#000]"
                    : "text-white/80 hover:text-fest-yellow hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Pills & Admin Action */}
        <div className="flex items-center gap-2">
          {/* Day Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-anton text-fest-yellow uppercase">
            <span>DAY {eventState.current_day}</span>
          </div>

          {/* Admin Control Booth Button */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-fest-cobalt hover:bg-fest-pink text-white border border-white/30 px-3 py-1.5 rounded-lg text-xs font-grotesk font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_#000] active:translate-y-0.5"
          >
            <Terminal className="w-3.5 h-3.5 text-fest-yellow" />
            <span className="hidden sm:inline">CONTROL BOOTH</span>
          </Link>

          {/* Event Status Live Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/60 border border-white/20 px-2.5 py-1.5 rounded-lg text-[11px] font-grotesk uppercase font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400">
              {eventState.event_status === "LIVE" ? "FESTIVAL LIVE" : eventState.event_status}
            </span>
          </div>

          {/* Stage Projector Button */}
          <Link
            href="/display"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 bg-fest-yellow text-black font-anton tracking-wider px-3 py-1.5 rounded-lg text-xs uppercase border-2 border-black retro-shadow-black hover:bg-white transition-all active:translate-y-0.5"
            title="Open Stage Projector HUD"
          >
            <Tent className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>HUD ↗</span>
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={muted ? "Unmute audio" : "Mute audio"}
            className="p-2 rounded-lg bg-black/60 hover:bg-white/10 border border-white/20 text-white/80 hover:text-white transition-all"
            title={muted ? "Unmute Audio" : "Mute Audio"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-fest-yellow" />}
          </button>
        </div>
      </div>
    </header>
  );
}
