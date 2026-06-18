'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { PaperShader } from './PaperShader';
import { RevealText } from './Reveal';
import { shaderColors } from '@/app/constants/colors';
import { EASE } from '@/app/constants/motion';

const RESUME_URL = 'https://drive.google.com/file/d/1IYAmDrdmkQ3MfcmaABN2AZqZ_DXA_zP4/preview';

const roles = ['Software Engineer', 'Creative Developer', 'UI Engineer', 'Fullstack Architect'];

const MARQUEE_ITEMS = [
  'Always Shipping',
  'Zero to Deployed',
  'Pixel Perfect',
  'Style Has Opinions',
  'Curious by Default',
  'Types Over Prayers',
];
const MARQUEE_SET = MARQUEE_ITEMS.flatMap(item => [
  { type: 'text', value: item },
  { type: 'sep', value: '·' },
]);

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
  const [isDark, setIsDark] = useState(true);
  const glitchRef = useRef<TextGlitchHandle>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Centered shader portal grows to fill the viewport on scroll, becoming the
  // full-bleed background that the next section slides over.
  const boxScale = useTransform(scrollYProgress, [0, 0.4], [1, 3.6]);

  // All hero foreground fades out early on scroll.
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const nameY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);

  // Description lines (scroll 40–70%)
  const line1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);
  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.6, 0.7], [50, 0]);

  // Marquee (scroll 74–86%)
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

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-page">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── Centered shader portal (grows to full-bleed on scroll) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: EASE.outExpo }}
          className="relative"
        >
          <div className="relative w-[86vw] md:w-[52vw] h-[56vh] md:h-[66vh]">

              {/* Accent halo glowing around the portal edges */}
              <motion.div
                style={{ opacity: textOpacity, background: 'radial-gradient(ellipse at center, var(--color-accent-glow), transparent 70%)' }}
                className="absolute -inset-12 z-0 blur-[90px] pointer-events-none"
                aria-hidden="true"
              />

              {/* Shader (the element that scales to full-bleed) */}
              <motion.div
                style={{ scale: boxScale }}
                className="absolute inset-0 z-10 overflow-hidden"
              >
                <PaperShader colors={isDark ? shaderColors.dark : shaderColors.light} speed={0.3} />
              </motion.div>

              {/* Frame furniture — corner markers + quote (do not scale, fade on scroll) */}
              <motion.div style={{ opacity: textOpacity }} className="absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
                {/* top-left L */}
                <div className="absolute -top-2 -left-2">
                  <motion.div className="absolute top-0 left-0 h-px w-9 bg-accent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 1.6, ease: EASE.out }} style={{ transformOrigin: 'left' }} />
                  <motion.div className="absolute top-0 left-0 w-px h-9 bg-accent" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, delay: 1.72, ease: EASE.out }} style={{ transformOrigin: 'top' }} />
                </div>
                {/* bottom-right L */}
                <div className="absolute -bottom-2 -right-2">
                  <motion.div className="absolute bottom-0 right-0 h-px w-9 bg-accent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 1.8, ease: EASE.out }} style={{ transformOrigin: 'right' }} />
                  <motion.div className="absolute bottom-0 right-0 w-px h-9 bg-accent" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, delay: 1.92, ease: EASE.out }} style={{ transformOrigin: 'bottom' }} />
                </div>
                {/* quote — top-left inside portal */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.5, ease: EASE.out }}
                  className="absolute top-5 left-5 max-w-[60%]"
                >
                  <p className="text-heading leading-relaxed" style={{ fontSize: '11px', letterSpacing: '0.03em', opacity: 0.55 }}>
                    Obsessed with the in-between.<br />
                    The quiet that makes noise worthwhile.
                  </p>
                </motion.div>
              </motion.div>
            </div>
        </motion.div>

        {/* ── Foreground content — centered over the portal (depth layers) ── */}
        <motion.div
          style={{ opacity: textOpacity, y: nameY }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          {/* Eyebrow — rotating role with live status dot */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3, ease: EASE.out }}
            className="flex items-center justify-center gap-3 mb-5 md:mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <TextGlitch
              ref={glitchRef}
              as="p"
              trigger={roleVisible}
              duration={0.5}
              speed={0.03}
              className="type-label text-muted"
              style={{ letterSpacing: '0.18em' }}
            >
              {roles[0]}
            </TextGlitch>
          </motion.div>

          {/* Name — dimmer first name, brighter last name with accent period */}
          <RevealText
            as="h1"
            text="SANSKAR"
            delay={0.45}
            duration={0.95}
            className="block font-bold text-heading leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(2rem, 6.6vw, 7.2rem)', opacity: 0.5 }}
          />
          <div
            className="flex justify-center font-bold text-heading leading-[0.82] tracking-tight"
            style={{ fontSize: 'clamp(2.6rem, 9vw, 10rem)' }}
          >
            <RevealText text="SHARMA" delay={0.6} duration={0.95} className="inline-block" />
            <RevealText text="." delay={0.72} duration={0.95} className="inline-block" wordClassName="text-accent" />
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0, ease: EASE.out }}
            className="flex items-center justify-center gap-4 mt-8 md:mt-10 pointer-events-auto"
          >
            <Magnetic>
              <a
                href="mailto:sharma.sans@northeastern.edu"
                className="block px-6 py-3 type-label bg-accent text-on-accent transition-[background-color,box-shadow] duration-300 hover:bg-accent-hover hover:shadow-[0_10px_36px_var(--color-accent-glow)]"
              >
                CONTACT ME
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className="block px-6 py-3 type-label border border-edge text-heading transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                VIEW RESUME
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* ── Description lines (scroll 40–70%) ── */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-4xl z-20 pointer-events-none">
          <div className="flex flex-col items-start text-left gap-8">
            <div className="overflow-hidden">
              <motion.p style={{ y: line1Y, opacity: line1Opacity }} className="text-4xl md:text-5xl lg:text-6xl type-statement text-heading">
                I turn ideas into interfaces people love using.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p style={{ y: line2Y, opacity: line2Opacity }} className="text-4xl md:text-5xl lg:text-6xl type-statement text-heading">
                Balancing performance, design, and scalability in every build.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p style={{ y: line3Y, opacity: line3Opacity }} className="text-4xl md:text-5xl lg:text-6xl type-statement text-heading">
                Writing code with intention, shipping products with purpose.
              </motion.p>
            </div>
          </div>
        </div>

        {/* ── Marquee (scroll 74–86%) ── */}
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
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
            className="flex items-center"
            style={{ width: 'max-content' }}
          >
            {[0, 1].map(set => (
              <div key={set} className="flex items-center gap-8 pr-8 flex-shrink-0">
                {MARQUEE_SET.map((item, i) =>
                  item.type === 'sep' ? (
                    <span key={`${set}-sep-${i}`} className="text-accent flex-shrink-0 text-base select-none">·</span>
                  ) : (
                    <span
                      key={`${set}-${i}`}
                      className="flex-shrink-0 text-heading font-semibold uppercase select-none"
                      style={{ fontSize: '13px', letterSpacing: '0.25em' }}
                    >
                      {item.value}
                    </span>
                  )
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
