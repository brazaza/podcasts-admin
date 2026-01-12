"use client";

import React, { useState, useEffect, useRef } from "react";
import { decode } from "blurhash";
import { cn } from "@/lib/utils";

interface BlurHashImageProps {
  src: string;
  alt: string;
  blurHash?: string | null;
  width?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}

export function BlurHashImage({
  src,
  alt,
  blurHash,
  width = 32,
  height = 32,
  className,
  imgClassName,
  priority = false,
}: BlurHashImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!blurHash || blurHash.length < 6) return;

    try {
      const pixels = decode(blurHash, width, height);
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);

      setBlurDataUrl(canvas.toDataURL());
    } catch (error) {
      console.error("[BlurHash] Failed to decode:", error);
    }
  }, [blurHash, width, height]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Hidden canvas for BlurHash decoding */}
      <canvas ref={canvasRef} className="hidden" />

      {/* BlurHash placeholder */}
      {blurDataUrl && !isLoaded && (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover scale-110 blur-sm",
            imgClassName
          )}
        />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
    </div>
  );
}

interface BlurHashCanvasProps {
  blurHash: string;
  width?: number;
  height?: number;
  punch?: number;
  className?: string;
}

export function BlurHashCanvas({
  blurHash,
  width = 32,
  height = 32,
  punch = 1,
  className,
}: BlurHashCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!blurHash || blurHash.length < 6) return;

    try {
      const pixels = decode(blurHash, width, height, punch);
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error("[BlurHash] Failed to decode:", error);
    }
  }, [blurHash, width, height, punch]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full object-cover", className)}
    />
  );
}
