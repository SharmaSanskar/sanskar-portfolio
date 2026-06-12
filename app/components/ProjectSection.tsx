'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight } from 'lucide-react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  description: string[];
  tech: string[];
  githubUrl: string;
  image: string;
}

const projects: Project[] = [
  {
    title: 'GradHelp',
    description: [
      'Developed an ML application using React.js and FastAPI to predict university admission chances with 85% accuracy.',
      'Trained a Support Vector Classifier (SVC) and processed data from 500+ student profiles for model evaluation.',
      'Built a Keras-based neural network to provide personalized university recommendations based on user profiles.'
    ],
    tech: ['React.js', 'FastAPI', 'scikit-learn', 'Keras'],
    githubUrl: 'https://github.com/SharmaSanskar/ml-gradhelp',
    image: '/projects/gradhelp.png',
  },
  {
    title: 'CryptoPlace',
    description: [
      'Built an ML-powered Next.js app using LSTMs for cryptocurrency price prediction, improving forecasting accuracy by 10%.',
      'Designed an NLP pipeline for real-time sentiment analysis of 50+ cryptocurrencies using the Twitter API.',
      'Integrated a Flask and Redis backend to handle high-frequency data processing and real-time dashboard updates.'
    ],
    tech: ['Next.js', 'Flask', 'Redis', 'LSTM'],
    githubUrl: 'https://github.com/SharmaSanskar/nextjs-cryptoplace',
    image: '/projects/cryptoplace.png',
  },
  {
    title: 'Concord',
    description: [
      'Engineered a real-time video chat application using React and WebRTC for interest-based user matching.',
      'Integrated Firebase for real-time data management and low-latency peer-to-peer communication.',
      'Optimized Node.js backend to achieve 90% connection reliability for seamless, high-quality video calls.'
    ],
    tech: ['React', 'WebRTC', 'Firebase', 'Node.js'],
    githubUrl: 'https://github.com/SharmaSanskar/react-concord-videochat',
    image: '/projects/concord.png',
  },
];

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [titleTrigger, setTitleTrigger] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<TextGlitchHandle | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    if (currentIndex !== null) {
      titleRef.current?.scrambleTo(projects[currentIndex].title, false);
    } else {
      titleRef.current?.scrambleTo();
    }
  }, [hoveredIndex, activeIndex]);

  useGSAP(() => {
    if (!sectionRef.current || !containerRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      onEnter: () => setTitleTrigger(true),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 0.5,
      },
    });

    tl.fromTo(containerRef.current, 
      { x: '100vw', opacity: 0 }, 
      { x: '0', opacity: 1, duration: 0.5 }
    ).fromTo('.project-card', 
      { x: 100, opacity: 0 }, 
      { x: 0, opacity: 1, stagger: 0.1 }, 
      "-=0.2"
    );
  }, { scope: sectionRef });

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    if (activeIndex !== null && activeIndex !== index) {
      setActiveIndex(null); 
    }
    gsap.to(cardRefs.current[index], { scale: 1.05, transformOrigin: 'bottom right', duration: 0.4 });
  };

  const handleMouseLeave = (index: number) => {
    setHoveredIndex(null);
    gsap.to(cardRefs.current[index], { scale: 1, duration: 0.4 });
  };

  useEffect(() => {
    descriptionRefs.current.forEach((desc, i) => {
      if (i === activeIndex) {
        gsap.to(desc, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', visibility: 'visible' });
      } else {
        gsap.to(desc, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in', visibility: 'hidden' });
      }
    });
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-page">
      <div className="h-screen relative">
        {/* Left Column - Details */}
        <div className="absolute top-16 md:top-20 left-12 md:left-20 w-1/2 z-10">
          <TextGlitch
            ref={titleRef}
            trigger={titleTrigger}
            className="type-display text-heading"
            as="h2"
          >
            PROJECTS
          </TextGlitch>

          {/* Tech tags — appear below the glitch title on hover/active */}
          {(() => {
            const displayIndex = hoveredIndex ?? activeIndex;
            const show = displayIndex !== null;
            return (
              <div
                style={{
                  maxHeight: show ? '20px' : '0px',
                  opacity: show ? 1 : 0,
                  overflow: 'hidden',
                  marginTop: show ? '12px' : '0px',
                  transition: 'max-height 0.28s ease, opacity 0.22s ease, margin-top 0.28s ease',
                }}
              >
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted">
                  {show ? projects[displayIndex!].tech.join(' • ') : ''}
                </p>
              </div>
            );
          })()}

          {/* SIGNIFICANT GAP BETWEEN TITLE AND POINTS (mt-80) */}
          <div className="mt-4 md:mt-6 relative pl-2">
            {projects.map((project, index) => (
              <div
                key={`desc-${project.title}`}
                ref={(el) => { descriptionRefs.current[index] = el; }}
                className="absolute top-10 left-0 w-full max-w-xl flex flex-col gap-8 opacity-0 invisible -translate-y-5"
              >
                {/* SIGNIFICANT GAP BETWEEN INDIVIDUAL POINTS (space-y-12) */}
                <ul className="type-list text-secondary flex flex-col gap-2 md:gap-4 list-disc list-inside">
                  {project.description.map((point, i) => (
                    <li key={i}>
                      {point}
                    </li>
                  ))}
                </ul>
                
                {/* BUTTON CONTAINER - LARGE GAP FROM POINTS (mb-12) */}
               <div>
                <Link 
                  href={project.githubUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center h-8 gap-2 border-b border-edge text-heading hover:border-edge-strong transition-all duration-300 pointer-events-auto group/link"
                >
                  <Github size={16} />
                  <span className="type-label">View Repository</span>
                  <ArrowUpRight 
                    size={14} 
                    className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" 
                  />
                </Link>
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Project List */}
        <div
          ref={containerRef}
          className="absolute top-16 md:top-20 right-12 md:right-20 w-1/2 h-[calc(100vh-8rem)] flex flex-col justify-start gap-12 opacity-0 translate-x-[100vw]"
        >
          {projects.map((p, index) => (
            <div key={p.title} className="w-full flex justify-end">
              <div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="project-card flex items-end gap-8 group"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setActiveIndex(prev => (prev === index ? null : index))}
              >
                <div className="flex flex-col items-end mb-2">
                  <span className="type-index text-muted mb-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`text-lg font-medium transition-colors duration-300 tracking-tight ${hoveredIndex === index || activeIndex === index ? 'text-heading' : 'text-muted'}`}>
                    {p.title}
                  </h3>
                </div>

                <div className={`w-48 h-32 md:w-64 md:h-40 flex items-center justify-center border flex-shrink-0 relative cursor-pointer bg-surface overflow-hidden transition-[border-color,box-shadow] duration-500 ${activeIndex === index ? 'border-edge-strong shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-edge-subtle'}`}>
                  <img 
                    src={p.image} 
                    alt={p.title}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                      hoveredIndex === index || activeIndex === index ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
                    }`}
                  />
                  
                  <div className={`absolute inset-0 z-10 flex items-center justify-center bg-overlay transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="type-overlay text-heading">
                      {activeIndex === index ? 'Close' : 'View Details'}
                    </span>
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