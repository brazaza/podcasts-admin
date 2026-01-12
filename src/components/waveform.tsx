"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WaveformProps {
  progress: number;
  duration: number;
  onSeek: (val: number) => void;
  seed?: string;
  className?: string;
  barColor?: string;
  activeColor?: string;
}

export function Waveform({ 
  progress, 
  duration, 
  onSeek, 
  seed = "default",
  className,
  barColor = "bg-white/20",
  activeColor = "bg-white"
}: WaveformProps) {
  const bars = 100;
  
  const barData = useMemo(() => {
    // Deterministic random heights based on seed
    const hash = seed.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return Array.from({ length: bars }, (_, i) => {
      const val = Math.sin(hash + i * 0.5) * Math.cos(hash * 0.3 + i * 0.2) * 0.5 + 0.5;
      return 0.2 + val * 0.8;
    });
  }, [seed, bars]);
  
  const currentPercent = duration > 0 ? (progress / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    onSeek(percent * duration);
  };

  return (
    <div 
      className={cn("relative h-16 w-full flex items-center gap-[2px] cursor-pointer group", className)}
      onClick={handleClick}
    >
      {barData.map((height, i) => {
        const barPercent = (i / bars) * 100;
        const isActive = barPercent <= currentPercent;
        return (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-300",
              isActive ? activeColor : cn(barColor, "group-hover:bg-white/30")
            )}
            style={{ 
              height: `${height * 100}%`,
              transitionDelay: `${i * 5}ms`
            }}
          />
        );
      })}
    </div>
  );
}
