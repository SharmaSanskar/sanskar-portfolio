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

const socials = [
  { label: 'GITHUB', href: 'https://github.com/SharmaSanskar' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/sharma-sanskar/' },
  { label: 'RÉSUMÉ', href: RESUME_URL },
];

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

  // Vibrant full-bleed shader blooms (scales) to fill on scroll → next-section handoff.
  const shaderScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.45]);

  // Everything except the name fades out almost immediately on scroll.
  const elemsOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // The name rises to vertical center (0→0.28), then disintegrates (0.3→0.5):
  // drifts up, scales, blurs, letters spread apart, and fades.
  const nameY = useTransform(scrollYProgress, [0, 0.28, 0.5], ['0vh', '-30vh', '-38vh']);
  const nameScale = useTransform(scrollYProgress, [0.3, 0.5], [1, 1.18]);
  const nameBlur = useTransform(scrollYProgress, [0.3, 0.5], ['blur(0px)', 'blur(18px)']);
  const nameLetter = useTransform(scrollYProgress, [0.3, 0.5], ['0em', '0.4em']);
  const nameOpacity = useTransform(scrollYProgress, [0.34, 0.5], [1, 0]);

  // Description lines (after the name has dissolved)
  const line1Opacity = useTransform(scrollYProgress, [0.55, 0.62], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.55, 0.62], [50, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.63, 0.70], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.63, 0.70], [50, 0]);
  const line3Opacity = useTransform(scrollYProgress, [0.71, 0.78], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.71, 0.78], [50, 0]);

  // Marquee
  const marqueeOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const marqueeY = useTransform(scrollYProgress, [0.82, 0.92], [24, 0]);

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

  const nameStyle = { fontSize: 'clamp(3rem, 12vw, 13rem)', lineHeight: 0.92 } as const;

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-page">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── z0: vibrant full-bleed shader ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE.out }}
          className="absolute inset-0 z-0"
        >
          <motion.div style={{ scale: shaderScale }} className="w-full h-full">
            <PaperShader colors={isDark ? shaderColors.dark : shaderColors.light} speed={0.32} />
          </motion.div>
        </motion.div>

        {/* ── z1: edge scrims (top + bottom) — center shader stays vibrant ── */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, var(--color-page) 0%, transparent 24%, transparent 52%, var(--color-page) 100%)' }}
          aria-hidden="true"
        />

        {/* ── z10: foreground ── */}
        <div className="absolute inset-0 z-10 flex flex-col px-8 md:px-12 py-9 md:py-10 pointer-events-none">
          {/* Top row — quote (left) + rotating role (right) — fades on scroll */}
          <motion.div style={{ opacity: elemsOpacity }} className="flex items-start justify-between gap-6">
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
              className="flex items-center gap-2.5 flex-shrink-0"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
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
            style={{ y: nameY, scale: nameScale, filter: nameBlur, letterSpacing: nameLetter, opacity: nameOpacity }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-x-6 mb-8 md:mb-10 origin-center will-change-transform"
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
              wordClassName="bg-gradient-to-br from-white to-[#A5B4FC] bg-clip-text text-transparent"
              style={nameStyle}
            />
          </motion.div>

          {/* Utility bar — fades on scroll */}
          <motion.div style={{ opacity: elemsOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.95, ease: EASE.out }}
            className="border-t border-edge pt-5 flex flex-wrap items-center justify-between gap-4 pointer-events-auto"
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
                    {s.label}
                  </a>
                  {i < socials.length - 1 && <span className="text-dim text-xs select-none">/</span>}
                </span>
              ))}
            </div>

            {/* primary CTA */}
            <Magnetic>
              <a
                href="mailto:sharma.sans@northeastern.edu"
                className="block px-6 py-3 type-label bg-accent text-on-accent transition-[background-color,box-shadow] duration-300 hover:bg-accent-hover hover:shadow-[0_10px_36px_var(--color-accent-glow)]"
              >
                GET IN TOUCH
              </a>
            </Magnetic>
          </motion.div>
          </motion.div>
        </div>

        {/* ── Description lines (after the name dissolves) ── */}
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
