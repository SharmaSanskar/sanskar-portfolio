'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { RevealText } from './Reveal';
import { EASE } from '@/app/constants/motion';
import { RollText } from './RollText';
import { CONTACT_EMAIL } from '@/app/constants/site';

const RESUME_URL = 'https://drive.google.com/file/d/1IYAmDrdmkQ3MfcmaABN2AZqZ_DXA_zP4/preview';

const roles = ['Software Engineer', 'Creative Developer', 'UI Engineer', 'Fullstack Architect'];

const socials = [
  { label: 'GITHUB', href: 'https://github.com/SharmaSanskar' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/sharma-sanskar/' },
  { label: 'RÉSUMÉ', href: RESUME_URL },
];

/** Cursor-follow magnetic pull for CTAs. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.1 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [roleVisible, setRoleVisible] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const glitchRef = useRef<TextGlitchHandle>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 'end end' = progress 1 exactly when the sticky stage releases, so every
    // range below maps onto time the stage is actually on screen.
    offset: ['start start', 'end end'],
  });

  // Everything except the name fades out almost immediately on scroll.
  const elemsOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // The name rises to vertical center, then disintegrates: drifts up, scales,
  // blurs and fades.
  const nameY = useTransform(scrollYProgress, [0, 0.22, 0.4], ['0vh', '-30vh', '-38vh']);
  const nameScale = useTransform(scrollYProgress, [0.24, 0.4], [1, 1.18]);
  const nameBlur = useTransform(scrollYProgress, [0.24, 0.4], ['blur(0px)', 'blur(18px)']);
  const nameOpacity = useTransform(scrollYProgress, [0.28, 0.4], [1, 0]);

  // Description lines arrive one after another once the name has dissolved…
  const line1Opacity = useTransform(scrollYProgress, [0.44, 0.52], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.44, 0.52], [50, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.52, 0.6], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.52, 0.6], [50, 0]);
  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.68], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.6, 0.68], [50, 0]);
  // …hold, then lift away together.
  const linesOut = useTransform(scrollYProgress, [0.72, 0.84], [1, 0]);
  const linesOutY = useTransform(scrollYProgress, [0.72, 0.84], ['0vh', '-8vh']);

  // Handoff: the hero's words dissolve; the gradient behind them (Backdrop)
  // keeps going, so the next chapter rises out of the same surface.
  const stageOpacity = useTransform(scrollYProgress, [0.74, 0.9], [1, 0]);

  useEffect(() => {
    const t = setTimeout(() => setRoleVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!roleVisible) return;
    const interval = setInterval(() => {
      const next = (currentRoleIndex + 1) % roles.length;
      setCurrentRoleIndex(next);
      glitchRef.current?.scrambleTo(roles[next], true);
    }, 6000);
    return () => clearInterval(interval);
  }, [roleVisible, currentRoleIndex]);

  const nameStyle = { fontSize: 'clamp(3rem, 12vw, 13rem)', lineHeight: 0.92 } as const;

  return (
    <section ref={sectionRef} className="relative h-[300vh] md:h-[400vh]">
      <motion.div
        style={{ opacity: stageOpacity }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >

        {/* The gradient itself lives in the page-wide <Backdrop />, so it
            carries on unbroken into the next chapter. */}

        {/* ── z10: foreground ── */}
        <div className="absolute inset-0 z-10 flex flex-col px-gutter py-9 md:py-10 pointer-events-none">
          {/* Top row — quote (left) + rotating role (right) — fades on scroll */}
          <motion.div style={{ opacity: elemsOpacity }} className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE.out }}
              className="text-secondary leading-relaxed max-w-[30ch]"
              style={{ fontSize: '13px', letterSpacing: '0.01em' }}
            >
              Obsessed with the in-between.<br />
              <span className="italic">The quiet that makes noise worthwhile.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE.out }}
              className="flex items-center flex-shrink-0"
            >
              <TextGlitch
                ref={glitchRef}
                as="span"
                trigger={roleVisible}
                duration={0.5}
                speed={0.03}
                className="type-label text-secondary"
                style={{ fontSize: '0.95rem' }}
              >
                {roles[0]}
              </TextGlitch>
            </motion.div>
          </motion.div>

          <div className="flex-1" />

          {/* Split-baseline name — rises to center on scroll, then disintegrates */}
          <motion.div
            style={{ y: nameY, scale: nameScale, filter: nameBlur, opacity: nameOpacity }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-x-6 gap-y-1 mb-8 md:mb-10 origin-center will-change-transform"
          >
            <RevealText
              as="span"
              text="Sanskar"
              delay={0.5}
              duration={0.95}
              className="block font-medium text-heading tracking-tight"
              style={nameStyle}
            />
            <RevealText
              as="span"
              text="Sharma."
              delay={0.66}
              duration={0.95}
              className="block font-serif italic tracking-tight md:text-right"
              wordClassName="bg-gradient-to-br from-heading to-accent bg-clip-text text-transparent"
              style={nameStyle}
            />
          </motion.div>

          {/* Utility bar — fades on scroll */}
          <motion.div style={{ opacity: elemsOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: EASE.out }}
            className="border-t border-edge pt-5 flex flex-col items-start gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between pointer-events-auto"
          >
            {/* status */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="type-label text-secondary">Available for work</span>
            </div>

            {/* socials */}
            <div className="flex items-center gap-3">
              {socials.map((s, i) => (
                <span key={s.label} className="flex items-center gap-3">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="type-label text-secondary hover:text-accent transition-colors duration-200 link-underline"
                  >
                    <RollText>{s.label}</RollText>
                  </a>
                  {i < socials.length - 1 && <span className="text-dim text-xs select-none">/</span>}
                </span>
              ))}
            </div>

            {/* primary CTA */}
            <Magnetic>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="block px-6 py-3 type-label bg-accent text-on-accent transition-[background-color,box-shadow] duration-300 hover:bg-accent-hover hover:shadow-[0_10px_36px_var(--color-accent-glow)]"
              >
                <RollText>GET IN TOUCH</RollText>
              </a>
            </Magnetic>
          </motion.div>
          </motion.div>
        </div>

        {/* ── Description lines (after the name dissolves) ── */}
        <motion.div
          style={{ opacity: linesOut, y: linesOutY }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-gutter z-20 pointer-events-none"
        >
          <div className="flex flex-col items-start text-left gap-6 md:gap-10 max-w-4xl">
            <div className="overflow-hidden">
              <motion.p style={{ y: line1Y, opacity: line1Opacity }} className="text-3xl md:text-5xl lg:text-6xl type-statement text-heading">
                I turn ideas into interfaces people love using.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p style={{ y: line2Y, opacity: line2Opacity }} className="text-3xl md:text-5xl lg:text-6xl type-statement text-heading">
                Balancing performance, design, and scalability in every build.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p style={{ y: line3Y, opacity: line3Opacity }} className="text-3xl md:text-5xl lg:text-6xl type-statement text-heading">
                Writing code with intention, shipping products with purpose.
              </motion.p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
