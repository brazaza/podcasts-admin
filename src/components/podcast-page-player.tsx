"use client";

import React from "react";
import type { Podcast } from "@/payload-types";
import { useAudio } from "@/hooks/use-audio";
import { podcastToAudioPodcast } from "@/lib/payload-helpers";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
    volume,
    setVolume,
    isShuffle,
    setShuffle,
    isRepeat,
    setRepeat,
    next,
    previous
  } = useAudio();

  const isCurrent = currentPodcast?.number === podcast.number;
  
  // Use current player progress if it's the current podcast, otherwise 0
  const displayProgress = isCurrent ? progress : 0;
  const displayDuration = isCurrent ? duration : 0;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      play(podcastToAudioPodcast(podcast));
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
          <span className="font-mono">{formatTime(displayProgress)}</span>
          <span className="font-mono">{formatTime(displayDuration)}</span>
        </div>
        <Waveform 
          progress={displayProgress} 
          duration={displayDuration} 
          onSeek={seek} 
          seed={String(podcast.number)}
          className="h-24"
          barColor="bg-white/10"
          activeColor="bg-white"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="hidden md:flex items-center gap-3 w-32">
          <Volume2 className="w-4 h-4 text-zinc-500" />
          <Slider 
            value={[volume * 100]} 
            max={100} 
            step={1} 
            className="w-full" 
            onValueChange={(val) => setVolume(val[0] / 100)}
          />
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8">
          <Button 
            variant="ghost" size="icon" 
            className={cn("text-zinc-500 hover:text-white transition-colors", isShuffle && "text-white")}
            onClick={() => setShuffle(!isShuffle)}
          >
            <Shuffle className="w-5 h-5" />
          </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-500 hover:text-white transition-colors" 
              onClick={previous}
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </Button>
                <Button 
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 rounded-full active:scale-95 shadow-xl border-none",
                    isCurrent && isPlaying 
                      ? "bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:bg-white" 
                      : "bg-white text-black hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                  )}
                  onClick={handlePlay}
                >
                  {isCurrent && isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-zinc-500 hover:text-white transition-colors" 
              onClick={next}
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </Button>
          <Button 
            variant="ghost" size="icon" 
            className={cn("text-zinc-500 hover:text-white transition-colors", isRepeat && "text-white")}
            onClick={() => setRepeat(!isRepeat)}
          >
            <Repeat className="w-5 h-5" />
          </Button>
        </div>

        <div className="hidden md:block w-32" /> {/* Spacer to center controls */}
      </div>
    </div>
  );
}
