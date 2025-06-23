"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

interface ImageGalleryProps {
  images: {
    url: string;
    title?: string;
    description?: string;
    fileName?: string;
    mimeType?: string;
  }[];
  alt: string;
  roadName: string;
  roadType: string;
}

export function ImageGallery({
  images,
  alt,
  roadName,
  roadType,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    // Reset loading state when image changes
    setIsLoaded(false);
  }, [currentIndex]);

  // Navigation functions
  const goNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      // Min swipe distance
      if (diff > 0) {
        goNext(); // Swipe left
      } else {
        goPrev(); // Swipe right
      }
    }
  };

  if (images.length === 0) return null;

  // Generate descriptive alt text for SEO
  const getImageAlt = (image: (typeof images)[0], index: number) => {
    if (image.title) return image.title;
    return `${roadName} ${roadType} तस्वीर ${index + 1} - ${alt}`;
  };

  // Generate rich captions for SEO
  const getCaption = (image: (typeof images)[0]) => {
    if (image.title && image.description)
      return `${image.title} - ${image.description}`;
    if (image.title) return image.title;
    if (image.description) return image.description;
    return `${roadName} ${roadType} तस्वीर`;
  };

  return (
    <div
      className="space-y-6"
      itemScope
      itemType="http://schema.org/ImageGallery"
    >
      <meta itemProp="about" content={roadName} />
      <meta
        itemProp="description"
        content={`${roadName} ${roadType} सडकका तस्वीरहरू`}
      />

      {/* Main featured image */}
      <figure
        className="relative aspect-[16/9] rounded-lg overflow-hidden bg-black/5 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        itemScope
        itemType="http://schema.org/ImageObject"
      >
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${isLoaded ? "opacity-0" : "opacity-100"}`}
        >
          <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
        </div>

        <Image
          src={images[currentIndex].url}
          alt={getImageAlt(images[currentIndex], currentIndex)}
          fill
          className={`object-contain transition-opacity ${isLoaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          priority
          onLoad={() => setIsLoaded(true)}
          itemProp="contentUrl"
        />
        <meta
          itemProp="name"
          content={
            images[currentIndex].title ||
            `${roadName} तस्वीर ${currentIndex + 1}`
          }
        />
        <meta
          itemProp="description"
          content={
            images[currentIndex].description ||
            `${roadName} ${roadType} सडकको तस्वीर`
          }
        />

        {/* Navigation controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-black/50 hover:bg-black/70"
            onClick={goPrev}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-black/50 hover:bg-black/70"
            onClick={goNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Image counter */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Zoom button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setLightboxOpen(true)}
          aria-label="Zoom image"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        {/* Caption if available - Enhanced for SEO */}
        {(images[currentIndex].title || images[currentIndex].description) && (
          <figcaption
            className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform"
            itemProp="caption"
          >
            {images[currentIndex].title && (
              <p className="font-medium">{images[currentIndex].title}</p>
            )}
            {images[currentIndex].description && (
              <p className="text-sm opacity-90">
                {images[currentIndex].description}
              </p>
            )}
          </figcaption>
        )}
      </figure>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                currentIndex === index
                  ? "ring-2 ring-primary scale-95 opacity-100"
                  : "hover:opacity-80 opacity-60 hover:scale-95"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={getImageAlt(image, index)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 10vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-0"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative h-[90vh] flex items-center justify-center">
            <Image
              src={images[currentIndex].url}
              alt={getImageAlt(images[currentIndex], currentIndex)}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 text-white hover:bg-white/20 z-50"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 text-white hover:bg-white/20 rounded-full h-12 w-12"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 text-white hover:bg-white/20 rounded-full h-12 w-12"
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Caption with enhanced metadata */}
            {(images[currentIndex].title ||
              images[currentIndex].description) && (
              <div className="absolute bottom-14 left-0 right-0 mx-auto max-w-3xl text-center bg-black/70 text-white p-3 rounded-md">
                {images[currentIndex].title && (
                  <p className="font-medium">{images[currentIndex].title}</p>
                )}
                {images[currentIndex].description && (
                  <p className="text-sm opacity-90">
                    {images[currentIndex].description}
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
