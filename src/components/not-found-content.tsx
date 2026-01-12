"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getArtists, getPodcasts } from "@/lib/api";
import type { Artist, Podcast } from "@/lib/api";
import { PodcastSlider } from "@/components/podcast-slider";

export function NotFoundContent() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsFlipped(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, podcastsData] = await Promise.all([
          getArtists({ limit: 100 }),
          getPodcasts({ limit: 100 })
        ]);
        setArtists(artistsData.docs);
        setPodcasts(podcastsData.docs);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get a random artist who has podcasts
  const artistsWithPodcasts = artists.filter(artist => 
    podcasts.some(p => p.artists?.some((a: any) => a.slug === artist.slug))
  );
  
  const randomArtist = artistsWithPodcasts.length > 0 
    ? artistsWithPodcasts[Math.floor(Math.random() * artistsWithPodcasts.length)] 
    : null;

  const artistPodcasts = randomArtist 
    ? podcasts.filter(p => p.artists?.some((a: any) => a.slug === randomArtist.slug))
    : [];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center pt-20 pb-12 px-6 overflow-x-hidden">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl w-full">
          {/* Minimal loader - just the logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 opacity-50 animate-pulse">
             <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f54a7117-225b-4b88-b1af-ec55a82fa2c5/logo-symbol-color-white-version-normal-1768004565285.png?width=8000&height=8000&resize=contain" 
              alt="Loading..."
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center pt-20 pb-12 px-6 overflow-x-hidden">
      <div className="flex flex-col items-center text-center space-y-8 max-w-4xl w-full mb-12">
        {/* Animated logo */}
        <div className="relative group cursor-pointer">
          <motion.img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/f54a7117-225b-4b88-b1af-ec55a82fa2c5/logo-symbol-color-white-version-normal-1768004565285.png?width=8000&height=8000&resize=contain" 
            alt="404"
            className="w-24 h-24 md:w-32 md:h-32 object-contain"
            initial={{ rotate: 0 }}
            animate={{ rotate: isFlipped ? 180 : 0 }}
            whileHover={{ rotate: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase font-display">
            Page Not Found
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-md mx-auto leading-relaxed">
            The frequency you&apos;re looking for is out of range{randomArtist && `, but here are our latest transmissions from `} 
            {randomArtist && (
              <Link 
                href={`/artist/${randomArtist.slug}`} 
                className="text-yellow-400 font-black uppercase relative group/artist inline-block"
              >
                {randomArtist.name}
                <span className="absolute bottom-[2px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
              </Link>
            )}
          </p>
        </div>

        <Link 
          href="/"
          className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Podcast Slider - Full width matching the podcast page layout */}
      {randomArtist && artistPodcasts.length > 0 && (
        <div className="max-w-[1400px] mx-auto w-full pt-8 mt-auto border-t border-white/10">
          <h2 className="text-xl font-black tracking-tighter uppercase mb-6 border-b border-white/10 pb-4">
            More podcasts by <Link 
              href={`/artist/${randomArtist.slug}`} 
              className="text-yellow-400 uppercase relative group/artist inline-block"
            >
              {randomArtist.name}
              <span className="absolute bottom-[1px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
            </Link>
          </h2>
          <PodcastSlider podcasts={artistPodcasts} />
        </div>
      )}
    </div>
  );
}
