'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  date: string;
  description: string[];
  tech: string[];
  githubUrl: string;
  image: string;
}

const projects: Project[] = [
  {
    title: 'GradHelp',
    date: '05 2023',
    description: [
      'Developed an ML application using React.js and FastAPI to predict university admission chances with 85% accuracy.',
      'Trained a Support Vector Classifier (SVC) and processed data from 500+ student profiles for model evaluation.',
      'Built a Keras-based neural network to provide personalized university recommendations based on user profiles.',
    ],
    tech: ['React.js', 'FastAPI', 'scikit-learn', 'Keras'],
    githubUrl: 'https://github.com/SharmaSanskar/ml-gradhelp',
    image: '/projects/gradhelp.png',
  },
  {
    title: 'CryptoPlace',
    date: '11 2022',
    description: [
      'Built an ML-powered Next.js app using LSTMs for cryptocurrency price prediction, improving forecasting accuracy by 10%.',
      'Designed an NLP pipeline for real-time sentiment analysis of 50+ cryptocurrencies using the Twitter API.',
      'Integrated a Flask and Redis backend to handle high-frequency data processing and real-time dashboard updates.',
    ],
    tech: ['Next.js', 'Flask', 'Redis', 'LSTM'],
    githubUrl: 'https://github.com/SharmaSanskar/nextjs-cryptoplace',
    image: '/projects/cryptoplace.png',
  },
  {
    title: 'Concord',
    date: '03 2022',
    description: [
      'Engineered a real-time video chat application using React and WebRTC for interest-based user matching.',
      'Integrated Firebase for real-time data management and low-latency peer-to-peer communication.',
      'Optimized Node.js backend to achieve 90% connection reliability for seamless, high-quality video calls.',
    ],
    tech: ['React', 'WebRTC', 'Firebase', 'Node.js'],
    githubUrl: 'https://github.com/SharmaSanskar/react-concord-videochat',
    image: '/projects/concord.png',
  },
];

const N = projects.length;
const ROW_GAP = 120; // px between name rows
const pad = (n: number) => String(n).padStart(2, '0');

export function ProjectSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const titleRefs = useRef<(TextGlitchHandle | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [reduce, setReduce] = useState(false);

  // Cursor tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15, mass: 0.3 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15, mass: 0.3 });

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Glitch the active name once the section enters.
  useEffect(() => {
    if (!entered) return;
    titleRefs.current[activeRef.current]?.scrambleTo(projects[activeRef.current].title, true);
  }, [entered]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const path = pathRef.current;
      if (!section || !track || reduce) return;

      const pathLen = path?.getTotalLength() ?? 0;
      if (path && pathLen) {
        path.style.strokeDasharray = `${pathLen}`;
        path.style.strokeDashoffset = `${pathLen}`;
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: () => setEntered(true),
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${N * 40}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Smoothly slide the list so the active name stays centered.
          track.style.transform = `translateY(${(N - 1) * (0.5 - p) * ROW_GAP}px)`;
          // Draw the swooping line + subtle drift.
          if (path && pathLen) {
            path.style.strokeDashoffset = `${pathLen * (1 - p)}`;
          }
          const idx = Math.round(p * (N - 1));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    },
    { scope: sectionRef, dependencies: [reduce] }
  );

  // ── Reduced motion: static vertical stack ──
  if (reduce) {
    return (
      <section ref={sectionRef} className="relative bg-page py-24 px-8 md:px-20">
        <p className="type-label text-accent mb-10">Selected Work</p>
        <div className="flex flex-col gap-24">
          {projects.map((p, i) => (
            <div key={p.title} className="grid md:grid-cols-2 gap-10 items-center">
              <img src={p.image} alt={p.title} className="w-full aspect-[4/3] object-cover border border-edge-subtle" />
              <div>
                <span className="type-index text-accent">{pad(i + 1)} / {pad(N)}</span>
                <h3 className="font-bold text-heading tracking-tight my-3" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>{p.title}</h3>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-accent mb-4">{p.tech.join(' • ')}</p>
                <ul className="type-list text-secondary list-disc list-inside flex flex-col gap-2">
                  {p.description.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
                <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-6 text-heading link-underline hover:text-accent transition-colors">
                  <Github size={16} /><span className="type-label">View Repository</span><ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const project = projects[active];

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 18);
    rx.set(-py * 18);
  };
  const onCardLeave = () => { rx.set(0); ry.set(0); };
  const onCardEnter = () => titleRefs.current[activeRef.current]?.scrambleTo(projects[activeRef.current].title, true);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-page">
      {/* Swooping indigo line (drawn by scroll) */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M -160 760 C 360 300, 760 1060, 1180 360 S 1700 120, 1640 -40"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="90"
          strokeLinecap="round"
          style={{ opacity: 0.7 }}
        />
      </svg>

      <div className="relative z-10 h-screen grid grid-cols-1 md:grid-cols-2 items-center px-8 md:px-20">

        {/* Left — counter + scrolling name list */}
        <div className="relative h-full flex items-center">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 type-label text-muted tabular-nums">
            ({pad(active + 1)})
          </span>

          <div
            className="relative w-full pl-10 md:pl-16"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
            }}
          >
            <div ref={trackRef} className="will-change-transform">
              {projects.map((p, i) => (
                <div
                  key={p.title}
                  className="flex items-center border-t border-edge-subtle"
                  style={{ height: ROW_GAP }}
                >
                  <TextGlitch
                    ref={(el) => { titleRefs.current[i] = el; }}
                    as="h3"
                    trigger={false}
                    duration={0.5}
                    speed={0.03}
                    className={`font-bold tracking-tight leading-none transition-all duration-500 ${
                      i === active ? 'text-heading' : 'text-dim'
                    }`}
                    style={{ fontSize: i === active ? 'clamp(2.6rem, 5vw, 5rem)' : 'clamp(1.6rem, 3vw, 3rem)' }}
                  >
                    {p.title}
                  </TextGlitch>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — tilting preview card */}
        <div className="hidden md:flex items-center justify-center" style={{ perspective: 1000 }}>
          <motion.div
            data-cursor="view"
            onMouseEnter={onCardEnter}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
            style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
            className="group relative w-[64%] aspect-[16/10] cursor-pointer"
          >
            {/* labels */}
            <div className="absolute -top-7 left-0 right-0 flex justify-between z-20">
              <span className="type-label text-muted group-hover:text-heading transition-colors duration-300 tabular-nums">{project.date}</span>
              <span className="type-label text-muted group-hover:text-heading transition-colors duration-300">Preview</span>
            </div>

            <div className="relative w-full h-full overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* tech line under the card */}
            <p className="absolute -bottom-7 left-0 text-xs font-medium uppercase tracking-[0.25em] text-muted group-hover:text-heading transition-colors duration-300">
              {project.tech.join(' • ')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
