'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactSection } from './ContactSection';

gsap.registerPlugin(ScrollTrigger);

export default function AboutContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const portalRef = useRef<HTMLSpanElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const about = aboutRef.current;
    const heading = headingRef.current;
    const aboutContent = aboutContentRef.current;

    if (!container || !about || !heading || !aboutContent) return;

    // Set portal transform origin
    const setPortalOrigin = () => {
      const portal = portalRef.current;
      if (!portal || !heading) return;

      const pRect = portal.getBoundingClientRect();
      const hRect = heading.getBoundingClientRect();

      const originX = pRect.left + pRect.width / 2 - hRect.left;
      const originY = pRect.top + pRect.height / 2 - hRect.top;

      gsap.set(heading, { transformOrigin: `${originX}px ${originY}px` });
    };

    setPortalOrigin();
    gsap.set(aboutContent, { opacity: 0, y: 50 });
    window.addEventListener('resize', setPortalOrigin);

    // Main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=300%', // Extended for 3 phases
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    tl
      // Phase 1: Scale heading (0-40%)
      .to(heading, {
        scale: 20,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      // Phase 2: Portal effect (40-53%)
      .to(heading, {
        scale: 220,
        opacity: 0.3,
        duration: 0.13,
        ease: 'power2.in'
      })
      // Phase 3: Reveal about content (53-67%)
      .to(aboutContent, {
        opacity: 1,
        y: 0,
        duration: 0.14,
        ease: 'power2.out'
      })
      // Phase 4: Slide About section UP to reveal Contact (67-100%)
      .to(about, {
        yPercent: -100,
        duration: 0.33,
        ease: 'power2.inOut'
      }, '+=0.1'); // Small pause before curtain lift

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', setPortalOrigin);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen">
      {/* ABOUT SECTION - Will slide up */}
      <div
        ref={aboutRef}
        className="absolute inset-0 z-10"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Initial Greeting */}
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

        {/* About Content */}
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
      </div>

      {/* CONTACT SECTION - Sits beneath, will be revealed */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'var(--color-primary-black)',
        }}
      >
        <ContactSection />
      </div>
    </div>
  );
}