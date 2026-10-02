import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { optimizedUrl } from '../utils/cloudinary';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  isDark?: boolean;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  isDark = false,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${
          isDark ? 'bg-neutral-800 text-neutral-600' : 'bg-neutral-100 text-neutral-300'
        } ${className}`}
      >
        <Tag className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="w-full h-full shrink-0 snap-center">
            <img
              src={optimizedUrl(src, 900)}
              alt={`${alt} ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          {/* Panah (desktop) */}
          {index > 0 && (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white items-center justify-center"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {index < images.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white items-center justify-center"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Penanda posisi */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
          <span className="absolute top-2 left-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-black/50 text-white">
            {index + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
};