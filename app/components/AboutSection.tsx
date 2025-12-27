"use client";

import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const portalRef = useRef<HTMLSpanElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    const heading = headingRef.current;
    const aboutContent = aboutContentRef.current;

    if (!container || !heading || !aboutContent) return;

    // Compute and set the heading transform-origin to the center of the portal letter
    const setPortalOrigin = () => {
      const portal = portalRef.current;
      const headingEl = headingRef.current;
      if (!portal || !headingEl) return;

      const pRect = portal.getBoundingClientRect();
      const hRect = headingEl.getBoundingClientRect();

      const originX = pRect.left + pRect.width / 2 - hRect.left;
      const originY = pRect.top + pRect.height / 2 - hRect.top;

      // Use pixel values for transform-origin so the center lines up with the letter
      gsap.set(headingEl, { transformOrigin: `${originX}px ${originY}px` });
    };

    // set initial states
    setPortalOrigin();
    gsap.set(aboutContent, {
      opacity: 0,
      y: 50
    });

    // update transform origin on resize
    window.addEventListener('resize', setPortalOrigin);

    // Create the main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=200%', // Scroll distance = 200% of viewport height
        pin: true,
        scrub: 1, // Smooth scrubbing, links animation to scrollbar
        anticipatePin: 1,
        // markers: true, // Uncomment to debug
      }
    });

    // Animation sequence
    tl
      // Phase 1: Scale up the heading significantly (0-60%)
      .to(heading, {
        scale: 20,
        duration: 0.6,
        ease: 'power2.inOut'
      })
      // Phase 2: Continue scaling to create portal effect (60-80%) — much larger so the 'T' reaches edges
      .to(heading, {
        scale: 220,
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.in'
      })
      // Phase 3: Reveal about content (80-100%)
      .to(aboutContent, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out'
      });

    return () => {
      // Kill timeline (also removes its ScrollTrigger)
      tl.kill();
      // remove any ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // remove resize listener
      window.removeEventListener('resize', setPortalOrigin);
    };
  }, []);

  // Sync Lenis with GSAP ScrollTrigger
  useEffect(() => {
    if (lenisRef.current?.lenis) {
      const lenis = lenisRef.current.lenis;
      
      // Update ScrollTrigger on every Lenis scroll event
      lenis.on('scroll', ScrollTrigger.update);
      
      return () => {
        lenis.off('scroll', ScrollTrigger.update);
      };
    }
  }, []);

  return (
    <>
      {/* Wrap entire app with ReactLenis for smooth scrolling */}
      <ReactLenis 
        root 
        options={{ 
          lerp: 0.1,
          duration: 1.2,
          smoothWheel: true
        }}
        ref={lenisRef}
      >
        {/* Scale-to-Fill Section */}
        <section
          ref={containerRef}
          className="relative h-screen overflow-hidden"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Initial Greeting (will scale) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1
              ref={headingRef}
              className="text-7xl md:text-8xl font-bold tracking-tight"
              style={{
                color: '#1e3a8a',
                fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)'
              }}
            >
              Hello <span className="inline-block">
                <span ref={portalRef} className="inline-block">T</span>here :)
              </span>
            </h1>
          </div>

          {/* About Content (revealed after scale) */}
          <div
            ref={aboutContentRef}
            className="absolute inset-0 flex items-center justify-center px-6"
          >
            <div className="max-w-2xl text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-stone-900">
                About Me
              </h2>
              <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-4">
                I'm a Creative Developer and Senior Frontend Engineer specializing in building
                immersive digital experiences that push the boundaries of web technology.
              </p>
              <p className="text-lg md:text-xl text-stone-700 leading-relaxed">
                With expertise in Next.js, TypeScript, and cutting-edge animation libraries like
                GSAP and Motion, I craft interfaces that are both beautiful and performant.
              </p>
            </div>
          </div>
        </section>
      </ReactLenis>
    </>
  );
}