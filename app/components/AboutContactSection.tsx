'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactSection } from './ContactSection';
import { ChapterLabel } from './ChapterLabel';
import { SCRUB } from '@/app/constants/motion';

gsap.registerPlugin(ScrollTrigger);

export default function AboutContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const portalRef = useRef<HTMLSpanElement>(null);
  const greetLabelRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [contactRevealed, setContactRevealed] = useState(false);

  useGSAP(() => {
    const container = containerRef.current;
    const about = aboutRef.current;
    const heading = headingRef.current;
    const aboutContent = aboutContentRef.current;
    const contact = contactRef.current;

    if (!container || !about || !heading || !aboutContent || !contact) return;

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
    const revealEls = aboutContent.querySelectorAll('[data-reveal]');
    // Everything sits on the shared page canvas. Zooming through the "T" floods
    // the screen with light for a beat, which then dissolves back into the dark
    // canvas as the About content materialises — no separate panel colour.
    gsap.set(aboutContent, { opacity: 0 });
    gsap.set(contact, { autoAlpha: 0, y: '6vh' });
    gsap.set(revealEls, { autoAlpha: 0, filter: 'blur(14px)', scale: 1.06 });
    window.addEventListener('resize', setPortalOrigin);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: SCRUB,
        anticipatePin: 1,
      }
    });

    tl
      // The chapter label introduces the greeting, then steps aside for the zoom.
      .to(greetLabelRef.current, {
        autoAlpha: 0,
        y: -24,
        duration: 0.06,
        ease: 'power1.in',
      })
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
        duration: 0.1,
        ease: 'power1.out',
      })
      .to(aboutContent, {
        opacity: 1,
        duration: 0.06,
        ease: 'none'
      }, '<')
      .to(revealEls, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.18,
        stagger: 0.05,
        ease: 'power2.out'
      }, '<0.02')
      // Handoff: About lifts and fades while Contact rises into the same space.
      .to(about, {
        y: '-12vh',
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '+=0.12')
      // Contact starts rising as About finishes leaving — a relay, never both
      // chapters' content on screen at once.
      .to(contact, {
        y: 0,
        autoAlpha: 1,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => { setContactRevealed(true); },
        onReverseComplete: () => { setContactRevealed(false); },
      }, '-=0.06');

    // Only tear down what this section owns. This previously called
    // ScrollTrigger.getAll().forEach(t => t.kill()), which also destroyed the
    // triggers belonging to WorkSection and ProjectSection.
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      window.removeEventListener('resize', setPortalOrigin);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen">
      {/* ABOUT SECTION */}
      <div
        ref={aboutRef}
        className="absolute inset-0 z-10 overflow-hidden"
      >
        {/* Initial Greeting */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 md:gap-8">
          <div ref={greetLabelRef}>
            <ChapterLabel index={3}>About</ChapterLabel>
          </div>
          <h1
            ref={headingRef}
            className="type-greeting text-heading"
          >
            Hello <span className="inline-block">
              <span ref={portalRef} className="inline-block">T</span>here <span className="wink text-accent" aria-label=":)"><span className="wink-open" aria-hidden="true">:)</span><span className="wink-shut" aria-hidden="true">;)</span></span>
            </span>
          </h1>
        </div>

        {/* About Content */}
        <div
          ref={aboutContentRef}
          className="absolute inset-0 flex flex-col justify-center px-gutter pt-24 pb-8 gap-8 md:gap-14"
        >
          {/* Top — Main Statement */}
          <h2
            data-reveal
            className="type-statement text-[1.6rem] md:text-5xl lg:text-6xl md:text-center text-heading max-w-5xl md:mx-auto"
          >
            I build <span className="text-accent">scalable software</span> that turns complex problems into simple, reliable products.
          </h2>

          {/* Bottom — Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

            {/* Left — Staggered portrait images */}
            <div className="flex gap-3 md:gap-4 items-start md:h-[42vh]">
              {/* Image 1 */}
              <div
                data-reveal
                className="relative w-1/2 md:w-auto md:h-full aspect-[4/5] md:aspect-[3/4] overflow-hidden flex-shrink-0"
                style={{ border: '1px solid var(--color-accent-soft)' }}
              >
                <Image
                  src="/about/photo1.jpg"
                  alt="Sanskar"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              {/* Image 2 — offset down for the stagger */}
              <div
                data-reveal
                className="relative w-1/2 md:w-auto md:h-full aspect-[4/5] md:aspect-[3/4] overflow-hidden flex-shrink-0 mt-8 md:mt-14"
                style={{ border: '1px solid var(--color-accent-soft)' }}
              >
                <Image
                  src="/about/photo2.jpg"
                  alt="Sanskar"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right — Two indented paragraphs */}
            <div className="flex flex-col gap-5 md:gap-8">
              <p
                data-reveal
                className="type-body text-secondary md:indent-12"
              >
                I'm Sanskar Sharma, a CS grad student at Northeastern University. I like
                building products end-to-end—taking an idea, stressing it, breaking it,
                and then making it solid.
              </p>
              <p
                data-reveal
                className="type-body text-secondary md:indent-12"
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
      <div ref={contactRef} className="absolute inset-0 overflow-hidden">
        <ContactSection isRevealed={contactRevealed} />
      </div>
    </div>
  );
}