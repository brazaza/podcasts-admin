"use client";

import React, { useState, useEffect, useRef } from "react";
import { Podcast } from "@/lib/data";
import { PodcastCard } from "./podcast-card";
import { Spinner } from "./ui/spinner";

interface PodcastGridProps {
  initialPodcasts: Podcast[];
}

export function PodcastGrid({ initialPodcasts }: PodcastGridProps) {
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  const displayedPodcasts = initialPodcasts.slice(0, displayCount);
  const hasMore = displayCount < initialPodcasts.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, displayCount]);

  const loadMore = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setDisplayCount((prev) => prev + 12);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {displayedPodcasts.map((podcast, index) => (
            <PodcastCard 
              key={podcast.number} 
              podcast={podcast} 
              isLatest={index < 3} 
            />
          ))}
        </div>

      {hasMore && (
        <div 
          ref={observerTarget} 
          className="flex justify-center py-12"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Spinner className="w-8 h-8 text-white" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                Loading more sonic data
              </span>
            </div>
          ) : (
            <div className="h-20" />
          )}
        </div>
      )}
      
      {!hasMore && initialPodcasts.length > 0 && (
        <div className="text-center py-12 border-t border-white/5">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
            End of transmission
          </p>
        </div>
      )}
    </div>
  );
}
