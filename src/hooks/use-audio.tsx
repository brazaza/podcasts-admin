"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Podcast } from "@/lib/data";

interface AudioContextType {
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: (podcast: Podcast) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  next: () => void;
  previous: () => void;
  isShuffle: boolean;
  setShuffle: (value: boolean) => void;
  isRepeat: boolean;
  setRepeat: (value: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children, podcasts }: { children: React.ReactNode, podcasts: Podcast[] }) {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setShuffle] = useState(false);
  const [isRepeat, setRepeat] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (podcast: Podcast) => {
    if (currentPodcast?.number === podcast.number) {
      togglePlay();
      return;
    }
    
    setCurrentPodcast(podcast);
    if (audioRef.current) {
      audioRef.current.src = podcast.audioFile;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentPodcast) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const seek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const next = () => {
    if (!currentPodcast || podcasts.length === 0) return;
    const currentIndex = podcasts.findIndex(p => p.number === currentPodcast.number);
    let nextIndex;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * podcasts.length);
    } else {
      nextIndex = (currentIndex + 1) % podcasts.length;
    }
    
    play(podcasts[nextIndex]);
  };

  const previous = () => {
    if (!currentPodcast || podcasts.length === 0) return;
    const currentIndex = podcasts.findIndex(p => p.number === currentPodcast.number);
    let prevIndex = (currentIndex - 1 + podcasts.length) % podcasts.length;
    play(podcasts[prevIndex]);
  };

  return (
    <AudioContext.Provider value={{
      currentPodcast,
      isPlaying,
      progress,
      duration,
      volume,
      play,
      pause,
      togglePlay,
      seek,
      setVolume,
      next,
      previous,
      isShuffle,
      setShuffle,
      isRepeat,
      setRepeat
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
