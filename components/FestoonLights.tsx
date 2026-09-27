"use client";

import React from "react";

export function FestoonLights() {
  // Bulb positions along two catenary curves across the screen
  const bulbsRow1 = [
    { left: "4%", top: "8px", color: "#FDE68A", glow: "#F59E0B", delay: "0s" },
    { left: "12%", top: "18px", color: "#FEF08A", glow: "#EAB308", delay: "0.4s" },
    { left: "20%", top: "25px", color: "#FED7AA", glow: "#F97316", delay: "0.8s" },
    { left: "28%", top: "28px", color: "#FDE68A", glow: "#F59E0B", delay: "0.2s" },
    { left: "36%", top: "26px", color: "#BAE6FD", glow: "#0EA5E9", delay: "0.6s" },
    { left: "44%", top: "20px", color: "#FDE68A", glow: "#F59E0B", delay: "0.3s" },
    { left: "52%", top: "12px", color: "#FECDD3", glow: "#F43F5E", delay: "0.7s" },
    { left: "60%", top: "18px", color: "#FDE68A", glow: "#F59E0B", delay: "0.1s" },
    { left: "68%", top: "26px", color: "#FEF08A", glow: "#EAB308", delay: "0.5s" },
    { left: "76%", top: "28px", color: "#A7F3D0", glow: "#10B981", delay: "0.9s" },
    { left: "84%", top: "24px", color: "#FDE68A", glow: "#F59E0B", delay: "0.3s" },
    { left: "92%", top: "16px", color: "#FDE68A", glow: "#F59E0B", delay: "0.7s" },
    { left: "97%", top: "8px", color: "#FED7AA", glow: "#F97316", delay: "0.4s" },
  ];

  return (
    <div className="relative w-full h-10 overflow-hidden pointer-events-none select-none z-30">
      {/* Curved wire SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 40"
        fill="none"
      >
        <path
          d="M0,5 Q300,45 600,12 Q900,45 1200,5"
          stroke="#475569"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.85"
        />
      </svg>

      {/* Bulbs */}
      {bulbsRow1.map((b, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 flex flex-col items-center"
          style={{
            left: b.left,
            top: b.top,
          }}
        >
          {/* Socket cap */}
          <div className="w-1.5 h-1.5 bg-slate-800 border border-slate-600 rounded-t-xs" />
          {/* Glowing bulb */}
          <div
            className="w-3.5 h-4 rounded-full transition-all animate-pulse"
            style={{
              backgroundColor: b.color,
              boxShadow: `0 0 10px 3px ${b.glow}, 0 0 20px 6px ${b.glow}44`,
              animationDuration: "2.4s",
              animationDelay: b.delay,
            }}
          />
        </div>
      ))}
    </div>
  );
}
