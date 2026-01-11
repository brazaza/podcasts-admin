"use client";

import { useAudio } from "@/hooks/use-audio";
import { Podcast } from "@/lib/data";
import { Play, Pause } from "lucide-react";

export function ListenNowButton({ podcast }: { podcast: Podcast }) {
  const { play, currentPodcast, isPlaying } = useAudio();
  const isCurrent = currentPodcast?.number === podcast.number;

  return (
    <button 
      onClick={() => play(podcast)}
      className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-tighter hover:bg-zinc-200 transition-colors"
    >
      {isCurrent && isPlaying ? (
        <Pause className="w-5 h-5 fill-current" />
      ) : (
        <Play className="w-5 h-5 fill-current" />
      )}
      {isCurrent && isPlaying ? "Playing Now" : "Listen Now"}
    </button>
  );
}
