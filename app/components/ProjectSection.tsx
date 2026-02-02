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
      end: '+=100%',
      pin: true,
      pinSpacing: true,
      onEnter: () => setTitleTrigger(true),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1,
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
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#0a0a0a]">
      <div className="h-screen relative">
        {/* Left Column - Details */}
        <div className="absolute top-16 md:top-20 left-12 md:left-20 w-1/2 z-10">
          <TextGlitch
            ref={titleRef}
            trigger={titleTrigger}
            className="text-8xl md:text-9xl font-bold tracking-tighter text-stone-200"
            as="h2"
          >
            PROJECTS
          </TextGlitch>

          {/* SIGNIFICANT GAP BETWEEN TITLE AND POINTS (mt-80) */}
          <div className="mt-72 md:mt-80 relative pl-2">
            {projects.map((project, index) => (
              <div
                key={`desc-${project.title}`}
                ref={(el) => { descriptionRefs.current[index] = el; }}
                className="absolute top-10 left-0 w-full max-w-xl flex flex-col gap-8"
                style={{ opacity: 0, visibility: 'hidden', transform: 'translateY(-20px)' }}
              >
                {/* SIGNIFICANT GAP BETWEEN INDIVIDUAL POINTS (space-y-12) */}
                <ul className="flex flex-col gap-2 md:gap-4">
                  {project.description.map((point, i) => (
                    <li key={i} className="flex items-start gap-6 group/item">
                      <span className="h-[1px] w-8 bg-stone-700 shrink-0 transition-all group-hover/item:w-12 group-hover/item:bg-stone-400" />
                      <p className="text-stone-400 text-lg md:text-xl leading-relaxed font-light tracking-wide">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
                
                {/* BUTTON CONTAINER - LARGE GAP FROM POINTS (mb-12) */}
               <div>
                <Link 
                  href={project.githubUrl} 
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 py-1 border-b border-stone-500 text-stone-200 hover:text-white hover:border-white transition-all duration-300 pointer-events-auto group/link"
                >
                  <Github size={16} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">View Repository</span>
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
          className="absolute top-16 md:top-20 right-12 md:right-20 w-1/2 h-[calc(100vh-8rem)] flex flex-col justify-start gap-12"
          style={{ opacity: 0, transform: 'translateX(100vw)' }}
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
                   <span className="text-[10px] font-mono text-stone-600 mb-1">
                     {String(index + 1).padStart(2, '0')}
                   </span>
                   <h3 className={`text-lg font-medium transition-colors duration-300 tracking-tight ${hoveredIndex === index || activeIndex === index ? 'text-stone-100' : 'text-stone-500'}`}>
                    {p.title}
                  </h3>
                </div>

                <div className={`w-48 h-32 md:w-64 md:h-40 flex items-center justify-center border flex-shrink-0 relative cursor-pointer bg-stone-900 overflow-hidden transition-all duration-500 ${activeIndex === index ? 'border-stone-200 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-stone-500/20'}`}>
                  <img 
                    src={p.image} 
                    alt={p.title}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                      hoveredIndex === index || activeIndex === index ? 'scale-110 opacity-100' : 'scale-100 opacity-70'
                    }`}
                  />
                  
                  <div className={`absolute inset-0 z-10 flex items-center justify-center bg-stone-950/80 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-[10px] tracking-[0.4em] text-stone-100 uppercase font-bold">
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