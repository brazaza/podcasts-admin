"use client";

import React from "react";
import { useAudio } from "@/hooks/use-audio";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Share2, Download } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Waveform } from "@/components/waveform";
import { toast } from "sonner";

export function GlobalPlayer() {
  const { 
    currentPodcast, 
    isPlaying, 
    togglePlay, 
    progress, 
    duration, 
    seek, 
    volume, 
    setVolume,
    next,
    previous,
    isShuffle,
    setShuffle,
    isRepeat,
    setRepeat
  } = useAudio();

  if (!currentPodcast) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleShare = () => {
    const url = `${window.location.origin}/${currentPodcast.number}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Full-width Waveform */}
      <Waveform 
        progress={progress} 
        duration={duration} 
        onSeek={seek} 
        seed={currentPodcast.number}
        className="h-12 w-full"
        barColor="bg-white/10"
        activeColor="bg-white"
      />
      
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Podcast Info */}
          <div className="flex items-center gap-4 min-w-[300px] flex-1 lg:flex-none">
            <img src={currentPodcast.coverImage} alt={currentPodcast.title} className="w-12 h-12 object-cover border border-white/10" />
            <div className="overflow-hidden">
              <h4 className="text-sm font-black uppercase tracking-tight truncate font-display">
                {currentPodcast.title}
              </h4>
              <div className="flex items-center gap-x-1 overflow-hidden truncate">
                {currentPodcast.artists.map((a, i) => (
                  <React.Fragment key={a.slug}>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{a.name}</span>
                    {i < currentPodcast.artists.length - 1 && (
                      <span className="text-[9px] text-zinc-700 font-bold uppercase">b2b</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex items-center gap-3 md:gap-6 flex-1 justify-center">
            <Button 
              variant="ghost" size="icon" 
              className={cn("text-zinc-500 hover:text-white transition-colors hidden sm:flex", isShuffle && "text-white")}
              onClick={() => setShuffle(!isShuffle)}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white transition-colors hidden sm:flex" onClick={previous}>
              <SkipBack className="w-5 h-5 fill-current" />
            </Button>
            <Button 
              className="w-10 h-10 md:w-12 md:h-12 bg-white text-black hover:bg-zinc-200 rounded-full flex items-center justify-center transition-transform active:scale-95"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5 md:ml-1" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white transition-colors hidden sm:flex" onClick={next}>
              <SkipForward className="w-5 h-5 fill-current" />
            </Button>
            <Button 
              variant="ghost" size="icon" 
              className={cn("text-zinc-500 hover:text-white transition-colors hidden sm:flex", isRepeat && "text-white")}
              onClick={() => setRepeat(!isRepeat)}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Right: Tools */}
          <div className="flex items-center gap-2 md:gap-6 flex-1 justify-end">
            <div className="hidden lg:block text-[10px] font-black font-mono text-zinc-500 tracking-widest">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
            <div className="hidden sm:flex items-center gap-3 w-32">
              <Volume2 className="w-4 h-4 text-zinc-500" />
              <Slider 
                value={[volume * 100]} 
                max={100} 
                step={1} 
                className="w-full" 
                onValueChange={(val) => setVolume(val[0] / 100)}
              />
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <a 
                href={currentPodcast.audioFile} 
                download 
                className="text-zinc-500 hover:text-white transition-colors p-2 hidden xs:flex"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
              <Button 
                variant="ghost" size="icon" 
                className="text-zinc-500 hover:text-white transition-colors h-9 w-9"
                onClick={handleShare}
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
