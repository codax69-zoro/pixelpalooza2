"use client";

import React from "react";

interface PixelBuntingProps {
  className?: string;
}

export function PixelBunting({ className = "" }: PixelBuntingProps) {
  // Vibrant festival colors alternating: Pink, Cyan, Yellow, Green, Orange, Purple, Emerald, Red
  const flagColors = [
    "#FF2D78", // Festival Pink
    "#00E5FF", // Cyan
    "#FFD700", // Yellow / Gold
    "#00E676", // Emerald
    "#FF6B35", // Orange
    "#8338EC", // Purple
    "#38BDF8", // Sky Blue
    "#FF1744", // Redstone
    "#A855F7", // Lavender
    "#FBBF24", // Amber
  ];

  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none relative z-10 ${className}`}>
      {/* Top String Wire Line */}
      <div className="w-full h-[2px] bg-slate-700/60" />

      {/* Row of Pixel Triangular Bunting Flags */}
      <div className="flex w-full justify-between items-start -mt-[1px]">
        {Array.from({ length: 36 }).map((_, idx) => {
          const color = flagColors[idx % flagColors.length];
          return (
            <div
              key={idx}
              className="flex flex-col items-center flex-1 max-w-[28px]"
              style={{ minWidth: "12px" }}
            >
              {/* Flag top border / notch */}
              <div
                className="w-full h-3 sm:h-3.5 transition-transform"
                style={{
                  backgroundColor: color,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  boxShadow: `0 2px 4px ${color}33`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
