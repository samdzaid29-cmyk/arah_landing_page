import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 270;

/**
 * Generates the frame path for ezgif-frame-001.jpg -> ezgif-frame-270.jpg
 */
const getFramePath = (index) => {
  const num = String(index + 1).padStart(3, '0');
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}frames/ezgif-frame-${num}.jpg`;
};

/**
 * Crystal-Clear CanvasSequenceBackground Component
 * Renders raw, crisp, untouched 270 frames with 1:1 pixel accuracy.
 */
export default function CanvasSequenceBackground({
  triggerRef,
  scrollDistance = 2200,
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions matching window size exactly
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderCurrentFrame();
    };

    const renderCurrentFrame = () => {
      const idx = frameIndexRef.current;
      const img = imagesRef.current[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      // Clean cover scaling calculation
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.max(hRatio, vRatio);
      const shiftX = (cw - iw * ratio) / 2;
      const shiftY = (ch - ih * ratio) / 2;

      // Render raw untouched image frame cleanly
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.filter = 'none';

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, ih, shiftX, shiftY, iw * ratio, ih * ratio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Preload all 270 frames
    const loadedImages = [];
    let isMounted = true;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (!isMounted) return;
        if (i === 0 || i === frameIndexRef.current) {
          renderCurrentFrame();
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        const num = String(i + 1).padStart(3, '0');
        const base = import.meta.env.BASE_URL.endsWith('/')
          ? import.meta.env.BASE_URL
          : `${import.meta.env.BASE_URL}/`;
        img.src = `${base}ezgif-frame-${num}.jpg`;
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;

    // GSAP ScrollTrigger Frame Scrubbing
    const triggerEl = triggerRef?.current || document.body;

    const ctxGsap = gsap.context(() => {
      const frameObj = { currentFrame: 0 };

      gsap.to(frameObj, {
        currentFrame: TOTAL_FRAMES - 1,
        snap: 'currentFrame',
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const newIdx = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(frameObj.currentFrame))
          );
          frameIndexRef.current = newIdx;
          renderCurrentFrame();
        },
      });
    });

    return () => {
      isMounted = false;
      window.removeEventListener('resize', updateCanvasSize);
      ctxGsap.revert();
    };
  }, [triggerRef, scrollDistance]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none object-cover"
    />
  );
}
