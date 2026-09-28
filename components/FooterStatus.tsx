"use client";

import React from "react";
import { CheckCircle2, Cast, Flag } from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export function FooterStatus() {
  const { eventState, realtimeStatus } = useArena();

  return (
    <footer className="w-full mt-12 mb-6 border-t border-voxel-border pt-8 font-mono">
      {/* 3 Summary Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-obsidian-900 border border-voxel-border p-4 flex items-start gap-3 shadow-voxel-sm">
          <CheckCircle2 className="w-5 h-5 text-realm-emerald shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              OFFICIAL ARBITRATION
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Scores entered by authorized GDG Core leads with live cryptographic proof stamps.
            </div>
          </div>
        </div>

        <div className="bg-obsidian-900 border border-voxel-border p-4 flex items-start gap-3 shadow-voxel-sm">
          <Cast className="w-5 h-5 text-realm-diamond shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              PROJECTOR MIRROR
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Broadcast directly to auditorium projectors with minimal sync drift (&lt;10ms).
            </div>
          </div>
        </div>

        <div className="bg-obsidian-900 border border-voxel-border p-4 flex items-start gap-3 shadow-voxel-sm">
          <Flag className="w-5 h-5 text-realm-gold shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              NEXT STAGE EVENT
            </div>
            <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {eventState.active_round}: Live arena scoring currently synchronized.
            </div>
          </div>
        </div>
      </div>

      {/* Protocol & Latency Bar */}
      <div className="bg-obsidian-950 border border-voxel-border p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500">
        <div>
          <div>© 2026 GOOGLE DEVELOPER GROUPS ON CAMPUS // GDGOC TECH ARENA // TOURNAMENT PROTOCOL V2.4</div>
          <div className="text-slate-600">SYSTEM ARCHITECTURE POWERED BY GDG TECH CORE</div>
        </div>

        <div className="flex items-center gap-2 bg-obsidian-900 border border-slate-800 px-3 py-1 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-realm-emerald animate-ping" />
          <span className="text-realm-emerald font-bold">
            SYNCHRONIZED LEADERBOARD LATENCY: 8MS // LIVE MANUAL SCORING GRID
          </span>
        </div>
      </div>
    </footer>
  );
}
