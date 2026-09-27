"use client";

import React, { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 600,
  className = "",
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [glowState, setGlowState] = useState<"up" | "down" | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;
    prevValueRef.current = value;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    if (endVal > startVal) {
      setGlowState("up");
    } else {
      setGlowState("down");
    }

    const glowTimer = setTimeout(() => {
      setGlowState(null);
    }, 1200);

    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(endVal);
      }
    };

    const animId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(glowTimer);
    };
  }, [value, duration]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        glowState === "up"
          ? "text-emerald-400 scale-105 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]"
          : glowState === "down"
          ? "text-rose-400 scale-105 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]"
          : ""
      } ${className}`}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}
