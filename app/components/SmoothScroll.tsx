'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (lenisRef.current?.lenis) {
      const lenis = lenisRef.current.lenis;
      lenis.on('scroll', ScrollTrigger.update);
      
      return () => {
        lenis.off('scroll', ScrollTrigger.update);
      };
    }
  }, []);

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}