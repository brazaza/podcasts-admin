"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAudio } from "@/hooks/use-audio";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { currentPodcast, isMinimized } = useAudio();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className={cn(
            "fixed right-8 z-50",
            "w-12 h-12 flex items-center justify-center",
            "bg-white text-black border border-white/10",
            "hover:bg-zinc-200 transition-all active:scale-95",
            currentPodcast 
              ? isMinimized 
                ? "bottom-16" 
                : "bottom-32 md:bottom-36"
              : "bottom-8"
          )}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
