"use client";

import React, { useState, useEffect } from "react";
import { Zap, Wifi } from "lucide-react";
import { useArena } from "@/lib/store/arena-context";

export function LiveFeedTicker() {
  const { lastBroadcastEvent, teams, games, standings, overallStandings, realtimeStatus, eventState } = useArena();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (lastBroadcastEvent) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastBroadcastEvent]);

  // Construct message from the latest event
  const getTickerMessage = () => {
    if (!lastBroadcastEvent) {
      if (overallStandings.length > 0 && overallStandings[0].total_score > 0) {
        const leader = overallStandings[0];
        return `PIXELPALOOZA 2-DAY ARENA ACTIVE | CURRENT HEADLINER: ${leader.team.name.toUpperCase()} (${leader.total_score} PTS) | DAY ${eventState.current_day} LIVE`;
      }
      return `PIXELPALOOZA 2-DAY FESTIVAL // 1500 STARTING BUDGET // DAY 1: 5 GAMES • DAY 2: THE AUCTION // REALTIME SYNC ACTIVE`;
    }

    const team = teams.find((t) => t.id === lastBroadcastEvent.team_id);
    const game = games.find((g) => g.id === lastBroadcastEvent.game_id);
    const teamStanding = standings.find((s) => s.team.id === lastBroadcastEvent.team_id);
    const sign = lastBroadcastEvent.points >= 0 ? "+" : "";

    return `${team ? team.name.toUpperCase() : "SQUAD"} just ${
      lastBroadcastEvent.points >= 0 ? "earned" : "received penalty"
    } ${sign}${lastBroadcastEvent.points} PTS 🎵 in ${
      game ? game.name : "Tournament Challenge"
    }! (New Total: ${teamStanding ? teamStanding.total_score : 0} PTS)`;
  };

  return (
    <div
      className={`w-full py-1.5 px-4 text-xs font-mono border-y transition-colors duration-300 flex flex-wrap items-center justify-between gap-3 ${
        pulse
          ? "bg-festival-pink/20 border-festival-pink text-festival-pink"
          : "bg-obsidian-900/90 border-voxel-border text-slate-300"
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 flex-1">
        <span className="flex items-center gap-1 font-bold text-festival-pink shrink-0">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span>FESTIVAL FEED:</span>
        </span>
        <span className="font-medium truncate tracking-wide text-slate-200">
          {getTickerMessage()}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Wifi className={`w-3 h-3 ${realtimeStatus === "connected" ? "text-festival-emerald" : "text-amber-400"}`} />
          <span>
            {realtimeStatus === "connected" ? "WS://SUPABASE-REALTIME" : "WS://LOCAL-BROADCAST"}
          </span>
        </div>
      </div>
    </div>
  );
}
