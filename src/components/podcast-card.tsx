"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Podcast } from "@/lib/data";
import { useAudio } from "@/hooks/use-audio";
import { Play, Pause, Share2, Download, Copy, Twitter, Facebook } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

export function PodcastCard({ podcast, isLatest = false }: { podcast: Podcast, isLatest?: boolean }) {
  const { play, pause, currentPodcast, isPlaying } = useAudio();
  const isCurrentlyPlaying = currentPodcast?.number === podcast.number && isPlaying;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${podcast.number}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const shareToSocial = (platform: string) => {
    const url = `${window.location.origin}/${podcast.number}`;
    const text = `Listen to ${podcast.title} on SYSTEM108`;
    let shareUrl = "";

    switch (platform) {
      case "vk":
        shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "fb":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="group flex flex-col bg-zinc-950 border border-white/5 overflow-hidden transition-colors hover:border-white/10 relative">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden block">
        <Link href={`/${podcast.number}`}>
          <motion.img 
            src={podcast.coverImage} 
            alt={podcast.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Only show play button if isLatest or if it's the current one playing */}
        {(isLatest || isCurrentlyPlaying) && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 pointer-events-auto cursor-pointer" onClick={() => isCurrentlyPlaying ? pause() : play(podcast)}>
              {isCurrentlyPlaying ? (
                <Pause className="w-8 h-8 text-black fill-current" />
              ) : (
                <Play className="w-8 h-8 text-black fill-current ml-1" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <Link 
            href={`/${podcast.number}`}
            className="text-sm font-bold uppercase tracking-tight hover:underline block truncate font-display"
          >
            {podcast.title}
          </Link>
          <div className="flex flex-wrap items-center gap-x-1">
            {podcast.artists.map((artist, i) => (
              <React.Fragment key={artist.slug}>
                <Link 
                  href={`/artist/${artist.slug}`}
                  className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  {artist.name}
                </Link>
                {i < podcast.artists.length - 1 && (
                  <span className="text-[10px] text-zinc-700 font-bold uppercase">b2b</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pt-1">
            {podcast.releaseDate}
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => isCurrentlyPlaying ? pause() : play(podcast)}
              className="h-8 px-3 bg-white text-black hover:bg-zinc-200 rounded-none text-[10px] font-black uppercase tracking-tighter"
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current mr-1.5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current mr-1.5" />
                  Play
                </>
              )}
            </Button>
            
            {/* VK now a direct link if provided, otherwise a placeholder */}
            <a 
              href={podcast.vkUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors p-1"
              onClick={(e) => !podcast.vkUrl && e.preventDefault()}
            >
              <VKIcon />
            </a>

            {podcast.soundcloudUrl && (
              <a 
                href={podcast.soundcloudUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                <SoundCloudIcon />
              </a>
            )}
          </div>

          <div className="flex items-center gap-1">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-zinc-500 hover:text-white transition-colors p-1">
                  <Share2 className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="bg-zinc-900 border-white/10 text-white rounded-none min-w-[150px]">
                <DropdownMenuItem onClick={handleCopyLink} className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                  <Copy className="w-3 h-3" /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('vk')} className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                  <VKIcon className="w-3 h-3" /> VK
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('x')} className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                  <Twitter className="w-3 h-3" /> Twitter (X)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('fb')} className="hover:bg-white/10 cursor-pointer flex items-center gap-2 uppercase font-black text-[10px] tracking-widest">
                  <Facebook className="w-3 h-3" /> Facebook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a 
              href={podcast.audioFile} 
              download 
              className="text-zinc-500 hover:text-white transition-colors p-1"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
