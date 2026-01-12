"use client";

import React from "react";
import Link from "next/link";
import type { Artist } from "@/payload-types";
import { cn } from "@/lib/utils";
import { getArtistSquareUrl, getArtistSquareBlurHash } from "@/lib/payload-helpers";
import { BlurHashImage } from "@/components/blurhash-image";

export function ArtistCard({ artist }: { artist: Artist }) {
  const imageUrl = getArtistSquareUrl(artist, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop')
  const blurHash = getArtistSquareBlurHash(artist)
  
  return (
    <div className={cn(
      "group flex flex-col h-full bg-zinc-950 border transition-all duration-300 relative overflow-hidden",
      "border-white/5 hover:border-white/20 hover:bg-white/[0.01]"
    )}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden block">
        <Link href={`/artist/${artist.slug}`}>
          <BlurHashImage
            src={imageUrl}
            alt={artist.name}
            blurHash={blurHash}
            className="w-full h-full"
            imgClassName={cn(
              "transition-all duration-700",
              "md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-110"
            )}
          />
        </Link>
      </div>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex flex-col items-center">
        <Link 
          href={`/artist/${artist.slug}`}
          className="text-xs sm:text-sm font-bold uppercase tracking-tight block font-display relative group/title w-fit text-yellow-400 transition-colors text-center"
        >
          {artist.name}
          <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/title:w-full" />
        </Link>
      </div>
    </div>
  );
}
