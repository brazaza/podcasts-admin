"use client";

import React from "react";
import Link from "next/link";
import type { Podcast } from "@/payload-types";
import { ListenNowButton } from "./listen-now-button";
import { motion } from "framer-motion";
import { getCoverUrl, formatReleaseDate } from "@/lib/payload-helpers";

import { ShareDropdown } from "./share-dropdown";

const VKIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.162 18.994c-6.098 0-9.57-4.172-9.714-11.108h3.047c.105 5.092 2.348 7.247 4.127 7.691V7.886h2.868v4.39c1.755-.188 3.606-2.18 4.228-4.39h2.868c-.464 2.686-2.433 4.678-3.84 5.32 1.407.656 3.658 2.406 4.453 5.788h-3.141c-.622-1.94-2.168-3.435-4.568-3.673v3.673h-2.868z" />
  </svg>
);

const SoundCloudIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.56 16.5c0 .35-.04.68-.11 1.01l-.22.99H20.5c1.93 0 3.5-1.57 3.5-3.5 0-1.83-1.42-3.33-3.21-3.48-.12-3.15-2.73-5.52-5.79-5.52-2.19 0-4.14 1.25-5.07 3.09-.28-.06-.57-.09-.87-.09-1.95 0-3.56 1.44-3.85 3.32-.45-.14-.93-.22-1.42-.22-2.48 0-4.5 2.02-4.5 4.5 0 .28.03.55.08.82L0 18.5h9.44l.22-1.01c.07-.31.11-.64.11-.99 0-1.38-.56-2.63-1.47-3.54C9.2 12.38 10.3 12 11.5 12c1.2 0 2.3.38 3.2 1.04-.91.91-1.47 2.16-1.47 3.54v.96h-1.67v-1.04z" />
  </svg>
);

export function FeaturedHero({ podcast }: { podcast: Podcast }) {
  const titleLength = podcast.title.length;
  const artists = podcast.artists || [];
  const artistsLength = artists.reduce((acc: number, a) => {
    if (typeof a === 'number') return acc;
    return acc + (a.name?.length || 0);
  }, 0);
  const coverUrl = getCoverUrl(podcast, 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&h=800&fit=crop');

  const getTitleSize = () => {
    const words = podcast.title.split(' ');
    const longestWord = Math.max(...words.map(w => w.length));
    
    if (longestWord >= 12 || titleLength > 25) return "text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl";
    if (longestWord >= 10 || titleLength > 20) return "text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl";
    if (longestWord >= 8 || titleLength > 15) return "text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl";
    if (longestWord >= 7 || titleLength > 12) return "text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl";
    if (longestWord >= 5) return "text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl";
    return "text-5xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-8xl";
  };

  const getArtistSize = () => {
    if (artistsLength > 40) return "text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl";
    if (artistsLength > 25) return "text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl";
    return "text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl";
  };

  return (
    <div className="relative w-full bg-zinc-950 overflow-hidden border-b border-white/5">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] items-center">
        {/* Left: Info */}
        <div className="p-8 lg:p-24 space-y-8 z-10 order-2 lg:order-1">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
              >
                <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-tighter">
                  Latest Release
                </span>
              </motion.div>
              
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  >
                              <Link href={`/podcast/${podcast.number}`} className="block group/title w-fit max-w-full overflow-hidden">
                                  <h1 className={`${getTitleSize()} font-black tracking-tighter uppercase leading-[0.9] font-display text-yellow-400 transition-colors`}>
                                    {podcast.title.split(' ').map((word, idx) => (
                                    <span key={idx} className="block relative w-fit whitespace-nowrap">
                                      {word}
                                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 transition-all duration-700 group-hover/title:w-full" />
                                    </span>
                                  ))}
                                </h1>
                            </Link>
                  </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {artists.map((artist, i) => {
                  if (typeof artist === 'number') return null;
                  return (
                    <React.Fragment key={artist.slug}>
                      <Link 
                        href={`/artist/${artist.slug}`}
                        className={`${getArtistSize()} font-black text-yellow-400 transition-colors uppercase tracking-tighter relative group/artist inline-block`}
                      >
                        {artist.name}
                        <span className="absolute bottom-[2px] left-0 w-0 h-1 bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
                      </Link>
                      {i < artists.length - 1 && (
                        <span className="text-xl font-black text-white uppercase">b2b</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                  Released: {formatReleaseDate(podcast.release_date)}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-8"
          >
            <ListenNowButton podcast={podcast} />
            <div className="flex items-center gap-6">
              <a 
                href={podcast.mirrors?.vk || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-500 hover:text-white transition-colors"
                onClick={(e) => !podcast.mirrors?.vk && e.preventDefault()}
              >
                <VKIcon className="w-5 h-5" />
              </a>
              <a 
                href={podcast.mirrors?.soundcloud || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-500 hover:text-white transition-colors"
                onClick={(e) => !podcast.mirrors?.soundcloud && e.preventDefault()}
              >
                <SoundCloudIcon className="w-5 h-5" />
              </a>
              <ShareDropdown 
                path={`/podcast/${podcast.number}`}
                title={`${podcast.title}`}
                triggerClassName="text-zinc-500 hover:text-white transition-colors p-0 h-auto w-auto"
                iconClassName="w-5 h-5"
              />
            </div>
          </motion.div>
        </div>

        {/* Right: Large Square Image */}
        <div className="relative aspect-square order-1 lg:order-2 lg:h-full lg:aspect-auto overflow-hidden">
            <Link href={`/podcast/${podcast.number}`} className="block h-full">
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                src={coverUrl} 
                alt={podcast.title} 
                className="w-full h-full object-cover transition-all duration-1000"
              />
            </Link>

          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-transparent lg:block hidden pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:hidden block pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
