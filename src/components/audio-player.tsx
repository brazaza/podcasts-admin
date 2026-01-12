'use client'

import React from 'react'
import Link from 'next/link'
import { useAudio } from '@/hooks/use-audio'
import { getCoverUrl } from '@/lib/payload-helpers'
import type { Artist } from '@/payload-types'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Waveform } from '@/components/waveform'
import { motion, AnimatePresence } from 'framer-motion'

export function GlobalPlayer() {
  const {
    currentPodcast,
    isPlaying,
    togglePlay,
    stop,
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
    setRepeat,
    isMinimized,
    setIsMinimized,
  } = useAudio()

  if (!currentPodcast) return null

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const artistNames =
    currentPodcast.artists?.filter((a): a is Artist => typeof a === 'object').map((a) => a.name).join(' b2b ') ?? ''
  const podcastLabel = `${currentPodcast.title}${artistNames ? ` — ${artistNames}` : ''}`

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{
        y: 0,
        height: isMinimized ? 72 : 'auto',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 35,
        mass: 1,
      }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white border-t border-white/10 overflow-hidden shadow-2xl"
    >
      <div className="relative flex flex-col w-full h-full">
        {/* Waveform - Transitioning height and scale */}
        <motion.div
          animate={{
            height: isMinimized ? 0 : 64,
            opacity: isMinimized ? 0 : 1,
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // Custom ease-out expo-like
          }}
          className="overflow-hidden origin-bottom bg-white/[0.02] relative z-0"
        >
          <Waveform
            progress={progress}
            duration={duration}
            onSeek={seek}
            seed={String(currentPodcast.number)}
            className="h-16 w-full"
            barColor="bg-white/10"
            activeColor="bg-white"
          />
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {!isMinimized ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-[72px] md:h-20"
              >
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-full">
                  <div className="flex items-center justify-between gap-3 md:gap-8 h-full">
                    {/* Left: Podcast Info */}
                    <div className="flex items-center gap-2 md:gap-4 md:w-[200px] lg:w-[350px] shrink-0 min-w-0 flex-1 md:flex-none">
                      <Link href={`/podcast/${currentPodcast.slug}`} className="shrink-0">
                        <img
                          src={getCoverUrl(currentPodcast)}
                          alt={currentPodcast.title}
                          className="w-9 h-9 md:w-12 md:h-12 object-cover border border-white/10 hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="overflow-hidden min-w-0">
                        <Link
                          href={`/podcast/${currentPodcast.slug}`}
                          className="block truncate group/title w-fit relative text-yellow-400 transition-colors"
                        >
                          <h4 className="text-[10px] md:text-sm font-black uppercase tracking-tight truncate font-display">
                            {currentPodcast.title}
                          </h4>
                          <span className="absolute bottom-0 left-0 w-0 h-px bg-yellow-400 transition-all duration-700 group-hover/title:w-full" />
                        </Link>
                        <div className="flex items-center gap-x-1 overflow-hidden truncate">
                        {(currentPodcast.artists ?? [])
                          .filter((a): a is Artist => typeof a === 'object')
                          .map(
                            (
                              a,
                              i: number,
                              arr
                            ) => (
                              <React.Fragment key={a.slug}>
                                <Link
                                  href={`/artist/${a.slug}`}
                                  className="text-[8px] md:text-[10px] font-bold text-yellow-400 transition-colors uppercase tracking-wider whitespace-nowrap relative group/artist inline-block"
                                >
                                  {a.name}
                                  <span className="absolute bottom-0 left-0 w-0 h-px bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
                                </Link>
                                {i < arr.length - 1 && (
                                  <span className="text-[7px] md:text-[9px] text-white font-bold uppercase whitespace-nowrap">
                                    b2b
                                  </span>
                                )}
                              </React.Fragment>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center: Controls */}
                    <div className="flex items-center justify-center gap-2 md:gap-6 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'text-zinc-500 hover:text-white transition-colors hidden lg:flex',
                          isShuffle && 'text-white',
                        )}
                        onClick={() => setShuffle(!isShuffle)}
                      >
                        <Shuffle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-white transition-colors hidden sm:flex"
                        onClick={previous}
                      >
                        <SkipBack className="w-5 h-5 fill-current" />
                      </Button>
                      <Button
                        className="w-10 h-10 md:w-12 md:h-12 bg-white text-black hover:bg-zinc-200 rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0"
                        onClick={togglePlay}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5 md:ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-500 hover:text-white transition-colors hidden sm:flex"
                        onClick={next}
                      >
                        <SkipForward className="w-5 h-5 fill-current" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'text-zinc-500 hover:text-white transition-colors hidden lg:flex',
                          isRepeat && 'text-white',
                        )}
                        onClick={() => setRepeat(!isRepeat)}
                      >
                        <Repeat className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Right: Tools & Actions */}
                    <div className="flex items-center justify-end gap-2 md:gap-4 md:w-[200px] lg:w-[350px] shrink-0">
                      <div className="hidden xl:block text-[10px] font-black font-mono text-zinc-500 tracking-widest mr-2">
                        {formatTime(progress)} / {formatTime(duration)}
                      </div>
                      <div className="hidden lg:flex items-center gap-3 w-24 mr-2">
                        <Volume2 className="w-4 h-4 text-zinc-500" />
                        <Slider
                          value={[volume * 100]}
                          max={100}
                          step={1}
                          className="w-full"
                          onValueChange={(val) => setVolume(val[0] / 100)}
                        />
                      </div>

                      <div className="flex items-center gap-1 border-l border-white/10 pl-2 md:pl-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-white h-8 w-8 transition-all active:scale-90"
                          onClick={() => setIsMinimized(true)}
                          title="Minimize"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-red-500 h-8 w-8 transition-transform active:scale-90"
                          onClick={stop}
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="minimized"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-[72px] md:h-20 cursor-pointer group hover:bg-white/[0.02] transition-colors relative"
                onClick={() => setIsMinimized(false)}
              >
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-full">
                  <div className="flex items-center justify-between gap-4 w-full h-full">
                    {/* Left: Play/Pause (aligned with info area) */}
                    <div className="md:w-[200px] lg:w-[350px] shrink-0 flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-10 h-10 md:w-12 md:h-12 bg-white text-black hover:bg-zinc-200 rounded-full shrink-0 transition-transform active:scale-90"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay()
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5" />
                        )}
                      </Button>
                    </div>

                    {/* Center: Marquee */}
                    <div className="flex-1 overflow-hidden relative h-full flex items-center [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                      <div className="flex whitespace-nowrap overflow-hidden w-full h-full items-center">
                        <div className="animate-marquee flex shrink-0 items-center">
                          {[...Array(6)].map((_, i) => (
                            <span
                              key={i}
                              className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-yellow-400 pr-8 transition-colors"
                            >
                              {podcastLabel}
                            </span>
                          ))}
                        </div>
                        <div
                          className="animate-marquee flex shrink-0 items-center"
                          aria-hidden="true"
                        >
                          {[...Array(6)].map((_, i) => (
                            <span
                              key={i}
                              className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-yellow-400 pr-8 transition-colors"
                            >
                              {podcastLabel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Tools (aligned with expanded) */}
                    <div className="flex items-center justify-end md:w-[200px] lg:w-[350px] shrink-0">
                      <div className="flex items-center gap-1 border-l border-white/10 pl-2 md:pl-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-white h-8 w-8 transition-all active:scale-90"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsMinimized(false)
                          }}
                        >
                          <ChevronUp className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-red-500 h-8 w-8 transition-transform active:scale-90"
                          onClick={(e) => {
                            e.stopPropagation()
                            stop()
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress line for minimized state */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                  <motion.div
                    initial={false}
                    animate={{ width: `${(progress / duration) * 100}%` }}
                    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
