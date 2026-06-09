'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const [contactRevealed, setContactRevealed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const about = aboutRef.current;
    const heading = headingRef.current;
    const aboutContent = aboutContentRef.current;

    if (!container || !about || !heading || !aboutContent) return;

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    tl
      .to(heading, {
        scale: 20,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .to(heading, {
        scale: 220,
        duration: 0.13,
        ease: 'power2.in'
      })
      .to(heading, {
        opacity: 0,
        duration: 0.05,
        ease: 'none',
      })
      .to(aboutContent, {
        opacity: 1,
        y: 0,
        duration: 0.14,
        ease: 'power2.out'
      }, '<')
      .to(about, {
        yPercent: -100,
        duration: 0.33,
        ease: 'power2.inOut',
        onStart: () => { setContactRevealed(true); },
        onComplete: () => { about.style.pointerEvents = 'none'; },
        onReverseComplete: () => { about.style.pointerEvents = ''; setContactRevealed(false); },
      }, '+=0.1');

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', setPortalOrigin);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen">
      {/* ABOUT SECTION */}
      <div
        ref={aboutRef}
        className="absolute inset-0 z-10 bg-stone-900 overflow-hidden"
      >
        {/* Initial Greeting */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            ref={headingRef}
            className="text-7xl md:text-8xl font-bold tracking-tight font-sans text-stone-200"
          >
            Hello <span className="inline-block">
              <span ref={portalRef} className="inline-block">T</span>here :)
            </span>
          </h1>
        </div>

        {/* About Content */}
        <div
          ref={aboutContentRef}
          className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 gap-12 md:gap-16 bg-stone-200"
        >
          {/* Top — Main Statement */}
          <h2
            className="text-4xl md:text-6xl font-light tracking-tight leading-tight text-center text-stone-900"
          >
            I build scalable software that turns complex problems into simple, reliable products.
          </h2>

          {/* Bottom — Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

            {/* Left — Staggered portrait images */}
            <div className="flex gap-4 items-start">
              {/* Image 1 — starts higher */}
              <div
                className="w-1/2 aspect-[3/4] overflow-hidden flex-shrink-0"
                style={{ border: '1px solid var(--color-border-subtle)' }}
              >
                <img
                  src="/about/photo1.jpg"
                  alt="Sanskar"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              {/* Image 2 — offset down */}
              <div
                className="w-1/2 aspect-[3/4] overflow-hidden flex-shrink-0 mt-10"
                style={{ border: '1px solid var(--color-border-subtle)' }}
              >
                <img
                  src="/about/photo2.jpg"
                  alt="Sanskar"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>

            {/* Right — Two indented paragraphs */}
            <div className="flex flex-col gap-8">
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--color-stone-700)', textIndent: '3rem' }}
              >
                I'm Sanskar Sharma, a CS grad student at Northeastern University. I like
                building products end-to-end—taking an idea, stressing it, breaking it,
                and then making it solid.
              </p>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--color-stone-700)', textIndent: '3rem' }}
              >
                Most of my time goes into writing code, fixing things I thought were already
                fixed, and chasing that one bug that refuses to exist when I look at it. When
                I'm not doing that, I'm usually exploring new tech, watching The Office, or
                judging coffee a little too seriously.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="absolute inset-0 bg-primary-black">
        <ContactSection isRevealed={contactRevealed} />
      </div>
    </div>
  );
}