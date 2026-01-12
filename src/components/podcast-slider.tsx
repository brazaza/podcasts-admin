"use client";

import React, { useRef, useEffect } from "react";
import type { Podcast } from "@/payload-types";
import { PodcastCard } from "./podcast-card";
import { motion, useScroll, useSpring } from "framer-motion";

interface PodcastSliderProps {
  podcasts: Podcast[];
}

export function PodcastSlider({ podcasts }: PodcastSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      // Detect if it's a touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      let targetScrollLeft = el.scrollLeft;
      let currentScrollLeft = el.scrollLeft;
      let rafId: number;

      const smoothScroll = () => {
        const diff = targetScrollLeft - currentScrollLeft;
        if (Math.abs(diff) > 0.5) {
          currentScrollLeft += diff * 0.2;
          el.scrollLeft = Math.round(currentScrollLeft);
          rafId = requestAnimationFrame(smoothScroll);
        } else {
          el.scrollLeft = targetScrollLeft;
          currentScrollLeft = targetScrollLeft;
        }
      };

    const handleWheel = (e: WheelEvent) => {
      // Skip for touchpads and touch devices
      if (isTouchDevice) return;
      
      // If user is already scrolling horizontally (tilt wheel), let native handle it
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Mouse wheel heuristic
      const isMouseWheel = e.deltaMode !== 0 || Math.abs(e.deltaY) >= 15;
      if (!isMouseWheel) return;

      const canScrollLeft = el.scrollLeft > 0;
      const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;

      if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
        e.preventDefault();
        
        if (Math.abs(el.scrollLeft - targetScrollLeft) > 1) {
          targetScrollLeft = el.scrollLeft;
          currentScrollLeft = el.scrollLeft;
        }

        targetScrollLeft += e.deltaY * 1.5;
        targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, el.scrollWidth - el.clientWidth));
        
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(smoothScroll);
      }
    };

    // Mouse drag logic
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let moved = false;

    const handleMouseDown = (e: MouseEvent) => {
      if (isTouchDevice) return;
      isDown = true;
      moved = false;
      el.classList.add('active');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      el.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      el.classList.remove('active');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown || isTouchDevice) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      
      if (Math.abs(x - startX) > 5) {
        moved = true;
        e.preventDefault();
        el.scrollLeft = scrollLeft - walk;
        
        targetScrollLeft = el.scrollLeft;
        currentScrollLeft = el.scrollLeft;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative group/slider">
      {/* Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pb-12 no-scrollbar md:cursor-grab md:active:cursor-grabbing md:select-none touch-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {podcasts.map((podcast) => (
          <div 
            key={podcast.number} 
            className="w-[280px] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0 flex"
          >
            <PodcastCard podcast={podcast} />
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-4 left-0 right-0 h-px bg-white/5 overflow-hidden">
        <motion.div 
          className="h-full bg-white/40 w-full origin-left"
          style={{ scaleX }}
        />
      </div>
    </div>
  );
}
