'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { PaperShader } from './PaperShader';
import { shaderColors } from '@/app/constants/colors';

const roles = [
  'Software Engineer',
  'Creative Developer',
  'UI Engineer',
  'Fullstack Architect',
];

// Marquee items — two identical copies for seamless -50% loop
const MARQUEE_ITEMS = [
  'Software Engineer',
  'Creative Developer',
  'Full Stack',
  'Open to Work',
  'UI Engineer',
  'Fullstack Architect',
];

// Build [item, ·, item, ·, ...] with a trailing · so copies tile seamlessly
const MARQUEE_SET = MARQUEE_ITEMS.flatMap(item => [
  { type: 'text', value: item },
  { type: 'sep',  value: '·' },
]);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const glitchRef = useRef<TextGlitchHandle>(null);

  // Scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Box scale: expands to fill viewport edge-to-edge
  const boxScale = useTransform(scrollYProgress, [0, 0.4], [1, 3.5]);
  const boxBorderRadius = useTransform(scrollYProgress, [0, 0.4], [16, 0]);

  // Hero text transformations on scroll - faster fade
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Description lines animate in sequentially
  const line1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);

  const line2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);

  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.6, 0.7], [50, 0]);

  // Marquee: appears after the description lines, floats up from bottom
  const marqueeOpacity = useTransform(scrollYProgress, [0.74, 0.86], [0, 1]);
  const marqueeY = useTransform(scrollYProgress, [0.74, 0.86], [24, 0]);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.dataset.theme !== 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    const interval = setInterval(() => {
      const nextIndex = (currentRoleIndex + 1) % roles.length;
      setCurrentRoleIndex(nextIndex);
      glitchRef.current?.scrambleTo(roles[nextIndex], true);
    }, 6000);
    return () => clearInterval(interval);
  }, [hasLoaded, currentRoleIndex]);

  return (
    // Increased to 500vh to give room for the marquee phase after the description
    <section ref={sectionRef} className="relative h-[500vh] bg-page">

      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── Shader box ── */}
        <motion.div
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ scale: boxScale, borderRadius: boxBorderRadius }}
          className="relative w-[50vw] h-[60vh] overflow-hidden"
        >
          <PaperShader
            colors={isDark ? shaderColors.dark : shaderColors.light}
            speed={0.3}
          />
          <motion.div
            className="absolute inset-0 border border-edge-subtle opacity-20 pointer-events-none z-10"
            style={{ borderRadius: boxBorderRadius }}
          />
        </motion.div>

        {/* ── Hero typography (fades out on scroll) ── */}
        <motion.div
          style={{ scale: textScale, opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center uppercase z-20"
        >
          <div className="flex flex-col items-center text-center gap-6">
            <TextGlitch
              as="h1"
              trigger={hasLoaded}
              duration={1.2}
              speed={0.05}
              className="text-6xl md:text-7xl lg:text-8xl type-hero text-heading"
              style={{ letterSpacing: '0.1em' }}
            >
              Hey, I'm Sanskar
            </TextGlitch>
            <TextGlitch
              ref={glitchRef}
              as="h1"
              trigger={hasLoaded}
              duration={0.5}
              speed={0.03}
              className="text-5xl md:text-6xl lg:text-7xl type-hero text-heading"
              style={{ letterSpacing: '0.1em' }}
            >
              {roles[0]}
            </TextGlitch>
          </div>
        </motion.div>

        {/* ── Description lines (slide up sequentially) ── */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-4xl z-20">
          <div className="flex flex-col items-start text-left gap-8">
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line1Y, opacity: line1Opacity }}
                className="text-4xl md:text-5xl lg:text-6xl type-statement text-heading"
              >
                I turn ideas into interfaces people love using.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line2Y, opacity: line2Opacity }}
                className="text-4xl md:text-5xl lg:text-6xl type-statement text-heading"
              >
                Balancing performance, design, and scalability in every build.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line3Y, opacity: line3Opacity }}
                className="text-4xl md:text-5xl lg:text-6xl type-statement text-heading"
              >
                Writing code with intention, shipping products with purpose.
              </motion.p>
            </div>
          </div>
        </div>

        {/* ── Hero marquee — glassmorphism strip, floats in at bottom ── */}
        <motion.div
          style={{
            opacity: marqueeOpacity,
            y: marqueeY,
            background: 'var(--color-glass)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            borderColor: 'var(--color-glass-border)',
          }}
          className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden py-5 border-t"
          aria-hidden="true"
        >
          {/*
           * Two identical sets inside separate flex wrappers with matching padding-right.
           * pr-8 == gap-8, so the trailing space of set-1 equals the gap within each set,
           * making the seam at -50% translateX perfectly equidistant.
           */}
          <div className="flex items-center" style={{ width: 'max-content', animation: 'marquee 28s linear infinite', willChange: 'transform' }}>
            {/* Set 1 */}
            <div className="flex items-center gap-8 pr-8 flex-shrink-0">
              {MARQUEE_SET.map((item, i) =>
                item.type === 'sep' ? (
                  <span key={`a-sep-${i}`} className="text-dim flex-shrink-0 text-base select-none">·</span>
                ) : (
                  <span
                    key={`a-${i}`}
                    className="flex-shrink-0 text-heading font-semibold uppercase select-none"
                    style={{ fontSize: '13px', letterSpacing: '0.25em' }}
                  >
                    {item.value}
                  </span>
                )
              )}
            </div>
            {/* Set 2 — identical, creates the seamless loop */}
            <div className="flex items-center gap-8 pr-8 flex-shrink-0">
              {MARQUEE_SET.map((item, i) =>
                item.type === 'sep' ? (
                  <span key={`b-sep-${i}`} className="text-dim flex-shrink-0 text-base select-none">·</span>
                ) : (
                  <span
                    key={`b-${i}`}
                    className="flex-shrink-0 text-heading font-semibold uppercase select-none"
                    style={{ fontSize: '13px', letterSpacing: '0.25em' }}
                  >
                    {item.value}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
