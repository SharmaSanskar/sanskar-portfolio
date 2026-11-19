'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { ChapterLabel } from './ChapterLabel';
import { SCRUB } from '@/app/constants/motion';
import { paletteMix, workProgressToMix } from '@/app/constants/backdrop';

gsap.registerPlugin(ScrollTrigger);
// Mobile address-bar show/hide resizes the viewport; without this every pinned
// section re-measures mid-swipe and jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

interface WorkExperience {
  company: string;
  period: string;
  logo: string;
  details: string[];
}

const experiences: WorkExperience[] = [
  {
    company: 'Lightmatter',
    period: 'May 2025 - Dec 2025',
    logo: '/work/lightmatter.jpeg',
    details: [
      'Building Next.js apps to visualize real-time hardware data',
      'Architecting full-stack features with Node.js, MongoDB, and AWS',
      'Integrating gRPC/GraphQL APIs and containerizing with Docker',
      'Shipping production-ready code in high-velocity Agile sprints',
    ],
  },
  {
    company: 'Fourie.ai',
    period: 'Oct 2022 - July 2024',
    logo: '/work/fourie.webp',
    details: [
      'Led frontend for an editing platform, doubling users in 3 months',
      'Integrated LLMs for STT/TTS processing in 600+ languages',
      'Reduced model inference latency by 40% through NLP tuning',
      'Mentored 4 interns to boost team-wide engineering productivity',
    ],
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Experience as a horizontal filmstrip: the chapter pins and the strip slides
 * sideways as you scroll down. Each role gets a full panel with every detail
 * visible. The strip's progress also drives the page-wide backdrop's one
 * colour change (Ink → Brass), so the morph happens while you travel through
 * the roles and then holds for the rest of the site.
 */
export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(TextGlitchHandle | null)[]>([]);
  const [titleTrigger, setTitleTrigger] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Reduced motion: no strip, but the backdrop still changes colour across
      // the section, so every visitor gets the same two-gradient story.
      if (reduce) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          end: 'bottom 40%',
          onUpdate: (self) => paletteMix.set(workProgressToMix(self.progress)),
          onLeave: () => paletteMix.set(1),
          onLeaveBack: () => paletteMix.set(0),
        });
        return;
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        once: true,
        onEnter: () => setTitleTrigger(true),
      });

      const mm = gsap.matchMedia();
      mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, (ctx) => {
        const { mobile } = ctx.conditions as { mobile: boolean };
        const distance = () => track.scrollWidth - window.innerWidth;
        // Phones cover the strip's (narrower) pixel width more slowly per swipe,
        // so the panels don't fly past.
        const pace = mobile ? 2.2 : 1.25;

        const strip = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance() * pace}`,
            pin: true,
            scrub: SCRUB,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
              paletteMix.set(workProgressToMix(self.progress));
            },
            // A nav jump can skip the strip entirely; land on the right palette.
            onLeave: () => paletteMix.set(1),
            onLeaveBack: () => paletteMix.set(0),
          },
        });

        experiences.forEach((exp, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;

          // The company name glitches as its panel settles into view.
          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: strip,
            start: 'left 60%',
            end: 'right 40%',
            onEnter: () => nameRefs.current[i]?.scrambleTo(exp.company, true),
            onEnterBack: () => nameRefs.current[i]?.scrambleTo(exp.company, true),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduce], revertOnUpdate: true }
  );

  // ── Reduced motion: a calm vertical list, nothing moves sideways ──
  if (reduce) {
    return (
      <section ref={sectionRef} className="relative px-gutter pt-chapter pb-28">
        <ChapterLabel index={1}>Experience</ChapterLabel>
        <h2 className="type-display text-heading mt-6">WORK</h2>
        <div className="mt-14 grid gap-16 md:grid-cols-2">
          {experiences.map((exp, i) => (
            <RolePanelContent key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="relative z-10 flex h-full w-max will-change-transform">
        {/* Intro panel */}
        <div className="w-screen md:w-[62vw] h-full flex flex-col px-gutter pt-chapter pb-24 flex-shrink-0">
          <ChapterLabel index={1}>Experience</ChapterLabel>
          <TextGlitch trigger={titleTrigger} className="type-display text-heading mt-5 md:mt-6" as="h2">
            WORK
          </TextGlitch>
          <p className="mt-auto type-label text-muted flex items-center gap-3" aria-hidden="true">
            Keep scrolling
            <span className="text-accent animate-nudge-x">→</span>
          </p>
        </div>

        {/* One panel per role */}
        {experiences.map((exp, i) => (
          <div
            key={exp.company}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="w-[88vw] md:w-[78vw] h-full flex items-center px-gutter pt-20 md:pt-0 flex-shrink-0"
          >
            <RolePanelContent
              exp={exp}
              index={i}
              nameRef={(el) => { nameRefs.current[i] = el; }}
            />
          </div>
        ))}

        {/* Outro sliver — the strip hands off downward */}
        <div className="w-[45vw] md:w-[28vw] h-full flex items-center px-gutter flex-shrink-0">
          <p className="type-label text-muted leading-loose">
            Next<br />
            <span className="text-secondary">Selected projects</span>{' '}
            <span className="text-accent inline-block animate-nudge-y">↓</span>
          </p>
        </div>
      </div>

      {/* Progress hairline */}
      <div className="absolute z-20 bottom-8 md:bottom-10 left-0 right-0 px-gutter" aria-hidden="true">
        <div className="relative h-px bg-edge">
          <div ref={fillRef} className="absolute inset-0 bg-accent origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
        <div className="mt-3 flex justify-between type-label text-muted tabular-nums">
          <span>{experiences[experiences.length - 1].period.split(' - ')[0]}</span>
          <span>{experiences[0].period.split(' - ')[1]}</span>
        </div>
      </div>
    </section>
  );
}

function RolePanelContent({
  exp,
  index,
  nameRef,
}: {
  exp: WorkExperience;
  index: number;
  nameRef?: (el: TextGlitchHandle | null) => void;
}) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-16 items-center">
      <div className="group relative w-20 h-20 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden border border-edge flex-shrink-0">
        <Image
          src={exp.logo}
          alt={exp.company}
          fill
          sizes="(max-width: 768px) 80px, 320px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>

      <div>
        <p className="type-label text-accent tabular-nums">
          {pad(index + 1)} / {pad(experiences.length)}
          <span className="text-muted ml-4">{exp.period}</span>
        </p>
        <TextGlitch
          ref={nameRef}
          as="h3"
          trigger={false}
          duration={0.6}
          speed={0.03}
          className="font-bold text-heading tracking-tight leading-none mt-4 md:mt-5"
          style={{ fontSize: 'clamp(2.4rem, 6.5vw, 6.5rem)' }}
        >
          {exp.company}
        </TextGlitch>
        <ul className="mt-6 md:mt-10 grid gap-3 md:gap-x-10 md:gap-y-4 md:grid-cols-2 border-l md:border-l-0 md:border-t border-edge-strong pl-5 md:pl-0 md:pt-8 max-w-4xl">
          {exp.details.map((d) => (
            <li key={d} className="text-[15px] md:text-base leading-relaxed text-secondary">{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
