'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';

gsap.registerPlugin(ScrollTrigger);

interface WorkExperience {
  company: string;
  period: string;
  logo: string;
}

const experiences: WorkExperience[] = [
  {
    company: 'Anthropic',
    period: '2022 - Present',
    logo: '/logos/anthropic.svg',
  },
  {
    company: 'OpenAI',
    period: '2020 - 2022',
    logo: '/logos/openai.svg',
  },
];

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [titleTrigger, setTitleTrigger] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<TextGlitchHandle | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return;

      const section = sectionRef.current;
      const container = containerRef.current;

      // Trigger TextGlitch when section enters viewport
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        once: true,
        onEnter: () => setTitleTrigger(true),
      });

      // Pin the section during the animation
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      // Container Animation Timeline - Single path for both cards
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
        },
      });

      // Slide the cards straight horizontally from off-screen right to their final position
      tl.fromTo(
        container,
        {
          x: '100vw',
          opacity: 0,
        },
        {
          x: '0',
          opacity: 1,
          ease: 'power2.out',
        }
      );

      // Smoothly tween the section background from the current color to a dark Tailwind 'stone' color
      // (approximate hex used for `stone-900`) — synced to the same timeline so the transition follows the scroll
      tl.to(
        section,
        {
          backgroundColor: '#292524',
          borderColor: 'rgba(30,28,25,0.3)',
          ease: 'none',
        },
        0
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-t"
      style={{
        background: '#0a0a0a',
        borderColor: 'rgba(168, 162, 158, 0.3)',
      }}
    >
      <div className="h-screen relative">
        {/* Title - Aligned Left */}
        <div className="absolute top-16 md:top-20 left-12 md:left-20 z-10">
          <TextGlitch
            ref={titleRef}
            trigger={titleTrigger}
            className="text-8xl md:text-9xl font-bold tracking-tighter text-stone-200"
            as="h2"
          >
            WORK
          </TextGlitch>
        </div>

        {/* Container for Both Cards */}
        <div
          ref={containerRef}
          className="absolute top-64 md:top-72 left-12 md:left-20 grid grid-cols-2 gap-20 md:gap-28 w-[90vw] max-w-[1400px] mb-12"
          style={{
            opacity: 0,
            transform: 'translateX(100vw)',
            willChange: 'transform',
          }}
        >
          {/* Work Experience 1 */}
          <div
            className="flex justify-end"
            onMouseEnter={() => titleRef.current?.scrambleTo(experiences[0].company, false)}
            onMouseLeave={() => titleRef.current?.scrambleTo()}
          >
            <WorkCard experience={experiences[0]} />
          </div>

          {/* Work Experience 2 */}
          <div
            className="flex justify-start"
            onMouseEnter={() => titleRef.current?.scrambleTo(experiences[1].company, false)}
            onMouseLeave={() => titleRef.current?.scrambleTo()}
          >
            <WorkCard experience={experiences[1]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ experience }: { experience: WorkExperience }) {
  return (
    <div className="relative">
      {/* Period Label */}
      <div className="mb-6 text-sm tracking-wider text-stone-400 uppercase">
        {experience.period}
      </div>

      <div className="flex items-end gap-6 md:gap-8">
        {/* Logo Box */}
        <div
          className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex items-center justify-center border flex-shrink-0"
          style={{
            background: '#0a0a0a',
            borderColor: 'rgba(168, 162, 158, 0.4)',
          }}
        >
          {/* Placeholder for logo - replace with actual image */}
          <div className="text-5xl md:text-6xl text-stone-700">
            {experience.company.charAt(0)}
          </div>
        </div>

        {/* Company Name */}
        <div className="pb-3 md:pb-6">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-200 tracking-tight whitespace-nowrap">
            {experience.company}
          </h3>
        </div>
      </div>
    </div>
  );
}