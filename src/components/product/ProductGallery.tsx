'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  images: string[];
  alt: string;
  intervalMs?: number;
}

/**
 * Auto-rotating image carousel for the product page. Cross-fades between
 * the supplied images every `intervalMs` and pauses while the pointer is
 * over the gallery. Includes clickable bullet indicators.
 */
export default function ProductGallery({ images, alt, intervalMs = 4500 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % images.length);
    }, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [images.length, intervalMs, paused]);

  return (
    <div
      className="pd-gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src + i}
          src={src}
          alt={i === 0 ? alt : ''}
          className={`pd-slide ${active === i ? 'on' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      {images.length > 1 && (
        <div className="pd-dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={active === i ? 'on' : ''}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
