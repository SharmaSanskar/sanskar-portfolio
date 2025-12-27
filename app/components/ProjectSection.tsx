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

      // Create a timeline attached to a ScrollTrigger that plays on scroll-down and reverses on scroll-up
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          // start later so animation happens further down the page
          start: 'top 70%',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse',
          onEnter: () => setTitleTrigger(true),
          onEnterBack: () => setTitleTrigger(true),
        },
      });

      tl.fromTo(
        container,
        { x: '100vw', opacity: 0 },
        { x: '0', opacity: 1, ease: 'power2.out' }
      )
        .fromTo(
          container.querySelectorAll('.project-card'),
          { x: 200, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            stagger: { each: 0.5, from: 'start' },
            ease: 'power3.out',
          },
          '+=0.35' // wait 0.45s after the container tween before starting stagger
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[160vh] overflow-hidden border-t"
      style={{ background: '#0a0a0a', borderColor: 'rgba(168, 162, 158, 0.3)' }}
    >
      <div className="h-screen relative">
        <div className="absolute inset-0 flex items-start">
          {/* Left Column - Title occupies half the width */}
          <div className="w-1/2 pt-24 pl-12 md:pl-20 pr-6">
            <TextGlitch
              ref={titleRef}
              trigger={titleTrigger}
              className="w-full text-8xl md:text-9xl font-bold tracking-tighter text-stone-200 leading-tight"
              as="h2"
            >
              PROJECTS
            </TextGlitch>
          </div>

          {/* Right Column - Projects (half width) aligned to right edge */}
          <div
            ref={containerRef}
            className="w-1/2 pt-24 pr-12 md:pr-20 flex flex-col items-end gap-16"
            style={{ opacity: 0, transform: 'translateX(100vw)' }}
          >
            {projects.map((p) => (
              <div key={p.title} className="w-full flex justify-end">
                <div
                  className="project-card relative p-4 shadow-sm w-full max-w-[480px]"
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
      </div>
    </section>
  );
}
