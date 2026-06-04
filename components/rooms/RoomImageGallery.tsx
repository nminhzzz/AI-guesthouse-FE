"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { RoomImage } from "@/types";

interface RoomImageGalleryProps {
  images: RoomImage[];
  title: string;
}

export default function RoomImageGallery({ images, title }: RoomImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">Chưa có ảnh</span>
      </div>
    );
  }

  function prev() {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }
  function next() {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }

  return (
    <>
      {/* Main gallery */}
      <div className="flex flex-col gap-2">
        {/* Main image */}
        <div
          className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[current].url}
            alt={`${title} - ảnh ${current + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
            priority={current === 0}
          />
          {/* Zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-80 transition-opacity" size={32} />
          </div>
          {/* Counter */}
          <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {images.length}
          </span>
          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Ảnh tiếp"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.public_id}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                  current === i
                    ? "border-orange-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
            aria-label="Đóng"
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={22} />
          </button>
          <div
            className="relative max-w-4xl w-full mx-16 aspect-[16/9]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[current].url}
              alt={`${title} - ảnh ${current + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={22} />
          </button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {current + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
