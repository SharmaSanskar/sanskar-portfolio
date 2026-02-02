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

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        once: true,
        onEnter: () => setTitleTrigger(true),
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          scrub: 0.5,
        },
      });

      tl.fromTo(container, 
        { x: '100vw', opacity: 0 }, 
        { x: 0, opacity: 1, ease: 'none' }
      );

      tl.to(section, { backgroundColor: '#0a0a0a', ease: 'none' }, 0);
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#292524]">
      <div className="h-screen relative">
        {/* WORK Title */}
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

        {/* Cards Container */}
        <div
          ref={containerRef}
          className="absolute top-64 md:top-72 left-12 md:left-20 right-12 md:right-20 grid grid-cols-2 gap-20 md:gap-28"
          style={{ willChange: 'transform' }}
        >
          {experiences.map((exp, idx) => (
            <div
              key={exp.company}
              className={`flex ${idx === 0 ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => titleRef.current?.scrambleTo(exp.company, false)}
              onMouseLeave={() => titleRef.current?.scrambleTo()}
            >
              <WorkCard experience={exp} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkCard({ experience }: { experience: WorkExperience }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    if (!logoBoxRef.current || !textGroupRef.current || !titleRef.current) return;

    const boxHeight = logoBoxRef.current.offsetHeight;
    const titleHeight = titleRef.current.offsetHeight;
    const moveUpDistance = boxHeight - titleHeight;

    setIsExpanded(!isExpanded);

    gsap.to(textGroupRef.current, {
      y: !isExpanded ? -moveUpDistance : 0,
      duration: 0.7,
      ease: "power3.inOut"
    });

    if (!isExpanded) {
      gsap.fromTo(detailsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(detailsRef.current, { opacity: 0, y: 10, duration: 0.3 });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm tracking-wider text-stone-500 uppercase">
        {experience.period}
      </div>

      <div className="flex items-end gap-6 md:gap-8">
        {/* LOGO BOX */}
        <div
          ref={logoBoxRef}
          className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex items-center justify-center border flex-shrink-0 relative cursor-pointer bg-[#0a0a0a] border-stone-500/40 overflow-hidden"
          onClick={handleLogoClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {experience.logo ? (
            <img 
              src={experience.logo} 
              alt={experience.company}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          ) : (
            <div className="text-5xl md:text-6xl text-stone-700 font-bold">
              {experience.company.charAt(0)}
            </div>
          )}

          {/* View Details Overlay */}
          <div className={`absolute inset-0 z-10 flex items-center justify-center bg-stone-950/80 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs tracking-widest text-stone-300 uppercase font-medium">
              {isExpanded ? 'Close' : 'View Details'}
            </span>
          </div>
        </div>

        {/* TEXT AREA */}
        <div className="relative h-48 md:h-64 lg:h-80 flex flex-col justify-end">
          <div ref={textGroupRef} className="will-change-transform">
            <h3 
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-200 tracking-tight whitespace-nowrap leading-none"
            >
              {experience.company}
            </h3>

            <div
              ref={detailsRef}
              className="space-y-3 pointer-events-none"
              style={{ 
                opacity: 0,
                position: 'absolute',
                top: '100%', 
                left: 0,
                width: '320px',
                marginTop: '32px' 
              }}
            >
              {experience.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-stone-600 text-[8px] mt-2">●</span>
                  <p className="text-sm text-stone-400 leading-relaxed font-light">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}