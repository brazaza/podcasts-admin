"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { podcasts, artists } from "@/lib/data";
import { PodcastSlider } from "@/components/podcast-slider";
import { motion } from "framer-motion";

export default function NotFound() {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFlipped(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get a random artist who has podcasts
  const artistsWithPodcasts = artists.filter(artist => 
    podcasts.some(p => p.artists.some(a => a.slug === artist.slug))
  );
  
  const randomArtist = artistsWithPodcasts[Math.floor(Math.random() * artistsWithPodcasts.length)] || artists[0];
  const artistPodcasts = podcasts.filter(p => 
    p.artists.some(a => a.slug === randomArtist.slug)
  );

  return (
    <div className="flex flex-col min-h-screen items-center justify-center pt-20 pb-12 px-6 overflow-x-hidden">
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
            The frequency you&apos;re looking for is out of range, but here are our latest transmissions from <Link 
              href={`/artist/${randomArtist.slug}`} 
              className="text-yellow-400 font-black uppercase relative group/artist inline-block"
            >
              {randomArtist.name}
              <span className="absolute bottom-[2px] left-0 w-0 h-[2px] bg-yellow-400 transition-all duration-700 group-hover/artist:w-full" />
            </Link>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/"
            className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Back to Home
          </Link>
          <Link 
            href="/podcasts"
            className="px-6 py-3 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
          >
            Browse Podcasts
          </Link>
        </div>
      </div>

      {/* Podcast Slider - Full width matching the podcast page layout */}
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
    </div>
  );
}
