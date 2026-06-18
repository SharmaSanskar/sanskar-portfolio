'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Canonical GSAP + Lenis integration: a single RAF loop driven by GSAP's
    // ticker powers both Lenis momentum and ScrollTrigger, kept in sync.
    let bound = false;
    const update = (time: number) => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (!bound) {
        lenis.on('scroll', ScrollTrigger.update);
        bound = true;
      }
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off('scroll', ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // duration + easing (NOT lerp) gives the flowing "release and glide" feel.
        duration: 1.5,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.7, // more travel per wheel tick (move more on a little scroll)
        touchMultiplier: 2.2,
        autoRaf: false, // we drive raf from gsap.ticker above
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
