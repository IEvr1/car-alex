"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CarImage } from "@/lib/types";

type CarGalleryProps = {
  images: CarImage[];
  title: string;
};

export function CarGallery({ images, title }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-muted text-muted-foreground">
        Δεν υπάρχουν φωτογραφίες
      </div>
    );
  }

  const goPrev = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative block h-full w-full cursor-zoom-in"
        >
          <Image
            src={images[activeIndex].url}
            alt={`${title} - φωτογραφία ${activeIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        </button>

        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              onClick={goPrev}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              onClick={goNext}
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image.pathname}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={image.url}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl border-none bg-black/95 p-2 sm:p-4">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={images[activeIndex].url}
              alt={`${title} - μεγέθυνση`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 pb-2">
              <Button type="button" variant="secondary" size="icon" onClick={goPrev}>
                <ChevronLeft className="size-5" />
              </Button>
              <span className="text-sm text-white/80">
                {activeIndex + 1} / {images.length}
              </span>
              <Button type="button" variant="secondary" size="icon" onClick={goNext}>
                <ChevronRight className="size-5" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="ml-4"
                onClick={() => setLightboxOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
