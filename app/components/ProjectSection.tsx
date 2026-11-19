'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useLenis } from 'lenis/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Github, ArrowUpRight, Plus } from 'lucide-react';
import { EASE } from '@/app/constants/motion';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { ChapterLabel } from './ChapterLabel';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  title: string;
  date: string;
  /** One line, shown under the preview as you scroll. */
  summary: string;
  description: string[];
  tech: string[];
  githubUrl: string;
  image: string;
}

const projects: Project[] = [
  {
    title: 'Mosaic',
    date: '08 2026',
    summary: 'A live multiplayer workspace where people and an AI agent think together on one shared canvas.',
    description: [
      'Built a real-time collaborative workspace where multiple users and an LLM agent share a live room.',
      'Engineered a lock-free Go WebSocket hub using one goroutine per room, streaming AI replies to all clients.',
      'Generated a self-updating reasoning DAG from chat context, rendered live with React Flow in a 3-pane UI.',
      'Cut per-user socket connections 75% via shared React Context; added JWT auth, rate limiting, token metrics.',
    ],
    tech: ['Go', 'Next.js', 'WebSockets', 'Supabase'],
    githubUrl: 'https://github.com/SharmaSanskar/mosaic-ai',
    image: '/projects/mosaic.png',
  },
  {
    title: 'GradHelp',
    date: '05 2023',
    summary: 'Predicts your admission chances and recommends universities that fit your profile.',
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
    summary: 'Crypto price forecasts paired with live Twitter sentiment for 50+ coins.',
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
    summary: 'Interest-matched video chat with peer-to-peer WebRTC calls.',
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
  const pinRef = useRef<ScrollTrigger | null>(null);
  const titleRefs = useRef<(TextGlitchHandle | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lenis = useLenis();

  // Card tilt (springy, soft) + a glare blob that follows the pointer.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.4 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareX = useTransform(gx, (v) => `${(v - 50) / 2}%`);
  const glareY = useTransform(gy, (v) => `${(v - 50) / 2}%`);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // On phones, the desktop carousel's preview card is hidden, so fall back to
  // the clean stacked layout (full project content). Desktop keeps the carousel.
  const useStatic = reduce || isMobile;

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
      if (!section || !track || useStatic) return;

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

      pinRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${N * 40}%`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // Smoothly slide the list so the active name stays centered.
          track.style.transform = `translateY(${(N - 1) * (0.5 - p) * ROW_GAP}px)`;
          // Draw the swooping line.
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
    // revertOnUpdate: when the layout flips to the static stack (phones,
    // reduced motion) the desktop pin must be torn down, or its pin-spacer and
    // inline height/padding stay glued onto the static section.
    { scope: sectionRef, dependencies: [useStatic], revertOnUpdate: true }
  );

  // ── Reduced motion / mobile: static vertical stack ──
  if (useStatic) {
    return (
      <section ref={sectionRef} className="relative px-gutter pt-chapter pb-28">
        <ChapterLabel index={2}>Selected projects</ChapterLabel>
        <div className="flex flex-col gap-24 mt-14">
          {projects.map((p, i) => <ProjectStackItem key={p.title} project={p} index={i} />)}
        </div>
      </section>
    );
  }

  const project = projects[active];

  /** Jump the pinned scroll to the point where project `i` is active. */
  const goTo = (i: number) => {
    const st = pinRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / (N - 1));
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const onCardEnter = () => titleRefs.current[activeRef.current]?.scrambleTo(projects[activeRef.current].title, true);
  const onCardMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 20);
    rx.set(-(py - 0.5) * 20);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onCardLeave = () => { rx.set(0); ry.set(0); gx.set(50); gy.set(50); };

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Swooping accent ribbon (drawn by scroll) */}
      {/* Own compositor layer: the stroke repaints on every scrolled frame,
          and without this the name list and preview card repaint with it. */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <path
          ref={pathRef}
          d="M -160 760 C 360 300, 760 1060, 1180 360 S 1700 120, 1640 -40"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="70"
          strokeLinecap="round"
          style={{ opacity: 0.28 }}
        />
      </svg>

      <ChapterLabel index={2} className="absolute top-0 left-0 z-20 px-gutter pt-chapter">Selected projects</ChapterLabel>

      <div className="relative z-10 h-screen grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-gutter">

        {/* Left — counter + scrolling name list */}
        <div className="relative h-full flex items-center">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 type-label text-muted tabular-nums">
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
                  // Rows have an explicit fixed height, so containing layout
                  // cannot change their geometry.
                  style={{ height: ROW_GAP, contain: 'layout' }}
                >
                  <h3>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show ${p.title}`}
                    aria-current={i === active}
                    className="group/row relative flex items-center text-left"
                  >
                    {/* Inactive rows nudge right and grow an accent dot on hover. */}
                    <span
                      aria-hidden="true"
                      className={`absolute -left-6 h-2 w-2 rounded-full bg-accent transition-[opacity,transform] duration-300 ${
                        i === active ? 'opacity-0' : 'opacity-0 scale-0 group-hover/row:opacity-100 group-hover/row:scale-100'
                      }`}
                    />
                    <span className={`block transition-transform duration-300 ease-out ${i === active ? '' : 'group-hover/row:translate-x-2'}`}>
                      <TextGlitch
                        ref={(el) => { titleRefs.current[i] = el; }}
                        as="span"
                        trigger={false}
                        duration={0.5}
                        speed={0.03}
                        // Every row is set at the active size and inactive rows
                        // are scaled down: a compositor-only transform that
                        // eases, instead of a font-size snap.
                        className={`block font-bold tracking-tight leading-none origin-left transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          i === active ? 'text-heading' : 'text-dim group-hover/row:text-secondary'
                        }`}
                        style={{ fontSize: 'clamp(2.6rem, 5vw, 5rem)', transform: `scale(${i === active ? 1 : 0.6})` }}
                      >
                        {p.title}
                      </TextGlitch>
                    </span>
                  </button>
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — tilting preview card + its description */}
        <div className="hidden md:flex flex-col items-center justify-center" style={{ perspective: 1000 }}>
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} on GitHub`}
            data-cursor="Code"
            onMouseEnter={onCardEnter}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
            className="group relative block w-[78%] aspect-[16/10]"
          >
            {/* labels */}
            <div className="absolute -top-7 left-0 right-0 flex justify-between z-20">
              <span className="type-label text-muted group-hover:text-heading transition-colors duration-300 tabular-nums">{project.date}</span>
              <span className="type-label text-muted group-hover:text-accent transition-colors duration-300">Hover for details</span>
            </div>

            <div className="relative w-full h-full overflow-hidden border border-edge">
              {/* All four previews are mounted and stacked, with only the active
                  one opaque — no fetch/decode mid-scroll. On hover they lift a
                  little to make room for the details panel. */}
              <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[12%]">
                {projects.map((p, i) => (
                  <Image
                    key={p.title}
                    src={p.image}
                    alt={p.title}
                    aria-hidden={i !== active}
                    fill
                    sizes="32vw"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
                    style={{ opacity: i === active ? 1 : 0 }}
                  />
                ))}
              </div>

              {/* Dim veil */}
              <div className="absolute inset-0 bg-page/0 group-hover:bg-page/55 transition-colors duration-500" aria-hidden="true" />

              {/* Glare that follows the pointer */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  x: glareX,
                  y: glareY,
                  background: 'radial-gradient(closest-side, rgba(255,255,255,0.16), transparent 70%)',
                }}
              />

              {/* Details panel — rises from the bottom edge on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-t from-page via-page/95 to-page/70 px-6 pt-8 pb-5">
                <ul className="flex flex-col gap-2.5">
                  {project.description.slice(0, 2).map((d) => (
                    <li key={d} className="text-[13px] leading-relaxed text-body flex gap-3">
                      <span className="text-accent mt-[0.45em] h-1 w-1 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-center gap-2 type-label text-accent">
                  <Github size={14} /> View repository <ArrowUpRight size={13} />
                </p>
              </div>
            </div>
          </motion.a>

          {/* Meta under the card: tech line + the one-line summary, which
              swaps with a masked slide whenever the active project changes. */}
          <div className="w-[78%] mt-5">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              {project.tech.join(' • ')}
            </p>
            <div className="relative mt-3 h-[3.4em] overflow-hidden text-lg leading-snug">
              <AnimatePresence initial={false}>
                <motion.p
                  key={project.title}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-110%', opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE.outExpo }}
                  className="absolute inset-0 type-statement text-heading"
                >
                  {project.summary}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Phone / reduced-motion card: summary up front, highlights on demand. */
function ProjectStackItem({ project: p, index: i }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const listId = `highlights-${i}`;

  return (
    <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <a
        href={p.githubUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative block w-full aspect-[16/10] overflow-hidden border border-edge"
      >
        <Image src={p.image} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </a>
      <div>
        <div className="flex items-baseline justify-between">
          <span className="type-label text-accent tabular-nums">{pad(i + 1)} / {pad(N)}</span>
          <span className="type-label text-muted tabular-nums">{p.date}</span>
        </div>
        <h3 className="font-bold text-heading tracking-tight mt-4 mb-3" style={{ fontSize: 'clamp(2.25rem,6vw,3.5rem)', lineHeight: 1 }}>{p.title}</h3>
        <p className="type-label text-secondary leading-loose">{p.tech.join(' · ')}</p>
        <p className="mt-4 text-lg leading-snug type-statement text-heading">{p.summary}</p>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={listId}
          className="mt-5 flex items-center gap-2 py-2 type-label text-secondary hover:text-accent transition-colors"
        >
          Highlights
          <Plus size={14} className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={listId}
              key="list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE.outExpo }}
              className="overflow-hidden"
            >
              <ul className="flex flex-col gap-3 border-l border-edge-strong pl-5 pt-2">
                {p.description.map((d) => <li key={d} className="text-[15px] leading-relaxed text-secondary">{d}</li>)}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 py-2 text-heading link-underline hover:text-accent transition-colors">
          <Github size={16} /><span className="type-label">View repository</span><ArrowUpRight size={14} />
        </a>
      </div>
    </article>
  );
}
