"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SVGImageWithFallbackProps {
  svgSrc: string;
  fallbackSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function SVGImageWithFallback({
  svgSrc,
  fallbackSrc,
  alt,
  width,
  height,
  className,
  priority = false,
}: SVGImageWithFallbackProps) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check for SVG support
    const img = new window.Image();
    img.src = svgSrc;
    img.onerror = () => {
      setUseFallback(true);
    };
  }, [svgSrc]);

  return (
    <Image
      src={useFallback ? fallbackSrc : svgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      priority={priority}
    />
  );
}
