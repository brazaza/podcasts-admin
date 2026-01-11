"use client";

import React from "react";
import { Podcast } from "@/lib/data";
import { useAudio } from "@/hooks/use-audio";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/waveform";
import { cn } from "@/lib/utils";

export function PodcastPagePlayer({ podcast }: { podcast: Podcast }) {
  const { 
    currentPodcast, 
    isPlaying, 
    togglePlay, 
    play,
    progress, 
    duration, 
    seek,
    isShuffle,
    setShuffle,
    isRepeat,
    setRepeat
  } = useAudio();

  const isCurrent = currentPodcast?.number === podcast.number;
  
  // Use current player progress if it's the current podcast, otherwise 0
  const displayProgress = isCurrent ? progress : 0;
  const displayDuration = isCurrent ? duration : 0;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      play(podcast);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span>{formatTime(displayProgress)}</span>
          <span>{formatTime(displayDuration)}</span>
        </div>
        <Waveform 
          progress={displayProgress} 
          duration={displayDuration} 
          onSeek={seek} 
          seed={podcast.number}
          className="h-24"
        />
      </div>

      <div className="flex items-center justify-center gap-8">
        <Button 
          variant="ghost" size="icon" 
          className={cn("text-zinc-500 hover:text-white", isShuffle && "text-white")}
          onClick={() => setShuffle(!isShuffle)}
        >
          <Shuffle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
          <SkipBack className="w-6 h-6 fill-current" />
        </Button>
        <Button 
          className="w-20 h-20 bg-white text-black hover:bg-zinc-200 rounded-full flex items-center justify-center transition-transform hover:scale-105"
          onClick={handlePlay}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
          <SkipForward className="w-6 h-6 fill-current" />
        </Button>
        <Button 
          variant="ghost" size="icon" 
          className={cn("text-zinc-500 hover:text-white", isRepeat && "text-white")}
          onClick={() => setRepeat(!isRepeat)}
        >
          <Repeat className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
