'use client'

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'

// Simplified podcast type for audio player - compatible with Payload Podcast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AudioPodcast {
  id?: string | number
  number: number | string
  slug?: string
  title: string
  audioFile?: string
  audio_url?: string | null
  coverImage?: string
  cover?: any // Allow any Media type from Payload
  artists?: any // Allow any artist array from Payload
}

interface AudioContextType {
  currentPodcast: AudioPodcast | null
  isPlaying: boolean
  progress: number
  duration: number
  volume: number
  play: (podcast: AudioPodcast) => void
  pause: () => void
  stop: () => void
  togglePlay: () => void
  seek: (value: number) => void
  setVolume: (value: number) => void
  next: () => void
  previous: () => void
  isShuffle: boolean
  setShuffle: (value: boolean) => void
  isRepeat: boolean
  setRepeat: (value: boolean) => void
  isMinimized: boolean
  setIsMinimized: (value: boolean) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// Helper to get audio URL from podcast
function getAudioUrl(podcast: AudioPodcast): string {
  // TODO: take types from payload without type adapters
  // @ts-ignore
  return podcast.audio.url
}

export function AudioProvider({
  children,
  podcasts,
}: {
  children: React.ReactNode
  podcasts: AudioPodcast[]
}) {
  const [currentPodcast, setCurrentPodcast] = useState<AudioPodcast | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isShuffle, setShuffle] = useState(false)
  const [isRepeat, setRepeat] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
  }, [])

  const play = useCallback(
    async (podcast: AudioPodcast) => {
      if (currentPodcast?.number === podcast.number) {
        if (audioRef.current) {
          try {
            if (isPlaying) {
              audioRef.current.pause()
              setIsPlaying(false)
            } else {
              await audioRef.current.play()
              setIsPlaying(true)
            }
          } catch (error: any) {
            if (error.name !== 'AbortError') console.error('Playback error:', error)
          }
        }
        return
      }

      setCurrentPodcast(podcast)
      if (audioRef.current) {
        try {
          audioRef.current.src = getAudioUrl(podcast)
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error: any) {
          if (error.name !== 'AbortError') console.error('Playback error:', error)
        }
      }
    },
    [currentPodcast, isPlaying],
  )

  const pause = useCallback(() => {
    if (!audioRef.current || !currentPodcast) return
    audioRef.current.pause()
    setIsPlaying(false)
  }, [currentPodcast])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setCurrentPodcast(null)
    setIsPlaying(false)
    setProgress(0)
  }, [])

  const togglePlay = useCallback(async () => {
    if (!audioRef.current || !currentPodcast) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') console.error('Playback error:', error)
    }
  }, [currentPodcast, isPlaying])

  const seek = useCallback((value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setProgress(value)
    }
  }, [])

  const next = useCallback(() => {
    if (!currentPodcast || podcasts.length === 0) return
    const currentIndex = podcasts.findIndex((p) => p.number === currentPodcast.number)
    let nextIndex

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * podcasts.length)
    } else {
      nextIndex = (currentIndex + 1) % podcasts.length
    }

    play(podcasts[nextIndex])
  }, [currentPodcast, podcasts, isShuffle, play])

  const previous = useCallback(() => {
    if (!currentPodcast || podcasts.length === 0) return
    const currentIndex = podcasts.findIndex((p) => p.number === currentPodcast.number)
    const prevIndex = (currentIndex - 1 + podcasts.length) % podcasts.length
    play(podcasts[prevIndex])
  }, [currentPodcast, podcasts, play])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setProgress(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = async () => {
      if (isRepeat) {
        audio.currentTime = 0
        try {
          await audio.play()
        } catch (error: any) {
          if (error.name !== 'AbortError') console.error('Playback error:', error)
        }
      } else {
        next()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [isRepeat, next])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  return (
    <AudioContext.Provider
      value={{
        currentPodcast,
        isPlaying,
        progress,
        duration,
        volume,
        play,
        pause,
        stop,
        togglePlay,
        seek,
        setVolume,
        next,
        previous,
        isShuffle,
        setShuffle,
        isRepeat,
        setRepeat,
        isMinimized,
        setIsMinimized,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
