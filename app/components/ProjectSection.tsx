'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  subtitle?: string;
  slug?: string;
}

const projects: Project[] = [
  { title: 'Atlas Dashboard', subtitle: 'Design System' },
  { title: 'Quill Editor', subtitle: 'Collaboration' },
  { title: 'Aurora Landing', subtitle: 'Marketing Site' },
];

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [titleTrigger, setTitleTrigger] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

      // Pin the section during the animation - reduced to 100%
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      // Container Animation Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
        },
      });

      // Add a slight delay before starting the animation (25% of the scroll range)
      tl.to({}, { duration: 0.25 });

      // Slide container from right
      tl.fromTo(
        container,
        { x: '100vw', opacity: 0 },
        { x: '0', opacity: 1, duration: 0.35, ease: 'power2.out' }
      );

      // Stagger in the project cards
      tl.fromTo(
        container.querySelectorAll('.project-card'),
        { x: 200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: { each: 0.12, from: 'start' },
          ease: 'power3.out',
        },
        '-=0.1'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-t"
      style={{ background: '#0a0a0a', borderColor: 'rgba(168, 162, 158, 0.3)' }}
    >
      <div className="h-screen relative">
        {/* Left Column - Title positioned absolutely to match Work section */}
        <div className="absolute top-16 md:top-20 left-12 md:left-20 w-1/2 z-10">
          <TextGlitch
            ref={titleRef}
            trigger={titleTrigger}
            className="text-8xl md:text-9xl font-bold tracking-tighter text-stone-200"
            as="h2"
          >
            PROJECTS
          </TextGlitch>
        </div>

        {/* Right Column - Projects positioned absolutely */}
        <div
          ref={containerRef}
          className="absolute top-16 md:top-20 right-12 md:right-20 w-1/2 h-[calc(100vh-8rem)] flex flex-col justify-between"
          style={{ opacity: 0, transform: 'translateX(100vw)', willChange: 'transform' }}
        >
          {projects.map((p) => (
            <div key={p.title} className="w-full flex justify-end">
              <div
                className="project-card relative w-full max-w-[480px]"
                onMouseEnter={() => titleRef.current?.scrambleTo(p.title, false)}
                onMouseLeave={() => titleRef.current?.scrambleTo()}
              >
                <div className="flex items-end gap-6">
                  {/* Project title on the left, bottom-aligned small font */}
                  <div className="w-28 text-sm text-stone-400 self-end">
                    {p.title}
                  </div>

                  {/* Preview box (square-like, taller) */}
                  <div className="h-36 md:h-44 w-36 md:w-44 flex items-center justify-center bg-stone-800 border border-stone-700 hover:border-stone-500 transition-colors">
                    <div className="text-stone-400">Preview</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}