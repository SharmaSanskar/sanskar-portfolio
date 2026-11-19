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
        // lerp gives a continuous glide that never "lands" abruptly, and keeps
        // wheel travel 1:1 so pinned chapters advance at a predictable pace.
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
        // Touch stays native: momentum scrolling on phones already feels right,
        // and syncing it through Lenis adds input lag.
        syncTouch: false,
        anchors: { offset: 0, duration: 1.6 },
        autoRaf: false, // we drive raf from gsap.ticker above
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
