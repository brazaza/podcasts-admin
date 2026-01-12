"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Podcast, Artist } from "@/payload-types";
import { useAudio } from "@/hooks/use-audio";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShareDropdown } from "@/components/share-dropdown";
import { getCoverUrl, getCoverBlurHash, formatReleaseDate } from "@/lib/payload-helpers";
import { BlurHashImage } from "@/components/blurhash-image";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VKIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.162 18.994c-6.098 0-9.57-4.172-9.714-11.108h3.047c.105 5.092 2.348 7.247 4.127 7.691V7.886h2.868v4.39c1.755-.188 3.606-2.18 4.228-4.39h2.868c-.464 2.686-2.433 4.678-3.84 5.32 1.407.656 3.658 2.406 4.453 5.788h-3.141c-.622-1.94-2.168-3.435-4.568-3.673v3.673h-2.868z" />
  </svg>
);

const SoundCloudIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.56 16.5c0 .35-.04.68-.11 1.01l-.22.99H20.5c1.93 0 3.5-1.57 3.5-3.5 0-1.83-1.42-3.33-3.21-3.48-.12-3.15-2.73-5.52-5.79-5.52-2.19 0-4.14 1.25-5.07 3.09-.28-.06-.57-.09-.87-.09-1.95 0-3.56 1.44-3.85 3.32-.45-.14-.93-.22-1.42-.22-2.48 0-4.5 2.02-4.5 4.5 0 .28.03.55.08.82L0 18.5h9.44l.22-1.01c.07-.31.11-.64.11-.99 0-1.38-.56-2.63-1.47-3.54C9.2 12.38 10.3 12 11.5 12c1.2 0 2.3.38 3.2 1.04-.91.91-1.47 2.16-1.47 3.54v.96h-1.67v-1.04z" />
  </svg>
);

export function PodcastCard({ podcast, isLatest: _isLatest = false }: { podcast: Podcast, isLatest?: boolean }) {
  const { play, pause, currentPodcast, isPlaying } = useAudio();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCurrentlyPlaying = currentPodcast?.number === podcast.number && isPlaying;
  
  const coverUrl = getCoverUrl(podcast, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop');
  const blurHash = getCoverBlurHash(podcast);
  const artists = (podcast.artists || []).filter((a): a is Artist => typeof a !== 'number');

  return (
        <div className={cn(
          "group flex flex-col h-full bg-zinc-950 border transition-all duration-300 relative overflow-hidden",
          isMenuOpen 
            ? "border-white/20 bg-white/[0.03] z-[10] shadow-2xl" 
            : "border-white/5 hover:border-white/20 hover:bg-white/[0.01]"
        )}>
      {/* Image Container */}
        <div className="relative aspect-square overflow-hidden block">
          <Link href={`/podcast/${podcast.slug}`}>
            <BlurHashImage
              src={coverUrl}
              alt={podcast.title}
              blurHash={blurHash}
              className="w-full h-full"
              imgClassName={cn(
                "transition-all duration-700",
                isMenuOpen 
                  ? "grayscale-0 scale-110" 
                  : "md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-110"
              )}
            />
          </Link>
        </div>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow space-y-2 sm:space-y-3">
          <div className="space-y-1">
              <Link 
                href={`/podcast/${podcast.slug}`}
                className="text-xs sm:text-sm font-bold uppercase tracking-tight block font-display line-clamp-2 relative group/title w-fit text-yellow-400 transition-colors"
              >
              {podcast.title}
              <span className="absolute bottom-[1px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/title:w-full" />
            </Link>
            <div className="flex flex-wrap items-center gap-x-1">
              {artists.map((artist, i) => (
                  <React.Fragment key={artist.slug}>
                          <Link 
                            href={`/artist/${artist.slug}`}
                            className="text-[10px] sm:text-[11px] font-bold text-yellow-400 transition-colors uppercase tracking-wider relative group/artist inline-block"
                          >
                            {artist.name}
                            <span className="absolute bottom-[1px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
                          </Link>
                    {i < artists.length - 1 && (
                      <span className="text-[9px] sm:text-[10px] text-white font-bold uppercase">b2b</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-widest pt-1">
              {formatReleaseDate(podcast.release_date)}
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/5 mt-auto gap-1">
            <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
                  <Button 
                    onClick={() => isCurrentlyPlaying ? pause() : play(podcast)}
                    className={cn(
                      "h-7 sm:h-8 w-7 sm:w-20 flex items-center justify-center transition-all duration-300 rounded-none text-[9px] sm:text-[10px] font-black uppercase tracking-tighter border-none shrink-0",
                      isCurrentlyPlaying 
                        ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:bg-white" 
                        : "bg-white text-black hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                    )}
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="w-2.5 h-2.5 sm:w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-2.5 h-2.5 sm:w-3 h-3 fill-current" />
                    )}
                  </Button>
            
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-1">
              <a 
                href={podcast.mirrors?.vk || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors p-1"
                onClick={(e) => !podcast.mirrors?.vk && e.preventDefault()}
              >
                <VKIcon />
              </a>

              {podcast.mirrors?.soundcloud && (
                <a 
                  href={podcast.mirrors.soundcloud} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors p-1"
                >
                  <SoundCloudIcon />
                </a>
              )}
            </div>
          </div>

                <div className="flex items-center gap-0.5 sm:gap-1">
                    <ShareDropdown 
                      path={`/podcast/${podcast.slug}`}
                      title={`Listen to ${podcast.title} on SYSTEM108`}
                      onOpenChange={setIsMenuOpen}
                      triggerClassName="h-7 w-7 sm:h-8 sm:w-8 text-zinc-500 hover:text-white transition-colors p-0"
                      iconClassName="w-3.5 h-3.5 sm:w-4 h-4"
                    />

                {/* More Menu for Mobile */}
                <div className="md:hidden">
                  <DropdownMenu onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white transition-colors p-0 rounded-none">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="top" className="bg-zinc-900 border-white/10 text-white rounded-none min-w-[120px] z-[60]">
                      <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer p-3 focus:bg-white/10 focus:text-white">
                        <a href={podcast.mirrors?.vk || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 uppercase font-black text-[10px] tracking-widest w-full">
                          <VKIcon className="w-3 h-3" /> VK
                        </a>
                      </DropdownMenuItem>
                      {podcast.mirrors?.soundcloud && (
                        <DropdownMenuItem asChild className="hover:bg-white/10 cursor-pointer p-3 border-t border-white/5 focus:bg-white/10 focus:text-white">
                          <a href={podcast.mirrors.soundcloud} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 uppercase font-black text-[10px] tracking-widest w-full">
                            <SoundCloudIcon className="w-3 h-3" /> SoundCloud
                          </a>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
