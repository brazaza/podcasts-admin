"use client";

import { useAudio } from "@/hooks/use-audio";
import type { Podcast } from "@/payload-types";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export function ListenNowButton({ podcast }: { podcast: Podcast }) {
  const { play, pause, currentPodcast, isPlaying } = useAudio();
  const isCurrent = currentPodcast?.number === podcast.number;

  return (
    <button 
      onClick={() => isCurrent && isPlaying ? pause() : play(podcast)}
      className={cn(
        "flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-tighter transition-all duration-300 w-[200px] justify-center",
        isCurrent && isPlaying 
          ? "bg-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.4)] hover:bg-white" 
          : "bg-white text-black hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]"
      )}
    >
      {isCurrent && isPlaying ? (
        <Pause className="w-5 h-5 fill-current" />
      ) : (
        <Play className="w-5 h-5 fill-current" />
      )}
      <span className="whitespace-nowrap">
        {isCurrent && isPlaying ? "Playing Now" : "Listen Now"}
      </span>
    </button>
  );
}
