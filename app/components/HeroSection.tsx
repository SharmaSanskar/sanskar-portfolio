'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { PaperShader } from './PaperShader';
import { shaderColors } from '@/app/constants/colors';

const RESUME_URL = 'https://drive.google.com/file/d/1IYAmDrdmkQ3MfcmaABN2AZqZ_DXA_zP4/preview';

const roles = [
  'Software Engineer',
  'Creative Developer',
  'UI Engineer',
  'Fullstack Architect',
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
  { type: 'sep',  value: '·' },
]);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  // Step 4 trigger — fires when role + buttons become visible (~1.95s)
  const [roleVisible, setRoleVisible] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const glitchRef = useRef<TextGlitchHandle>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Shader scroll scale: expands to fill viewport
  const boxScale = useTransform(scrollYProgress, [0, 0.4], [1, 3.5]);
  const boxBorderRadius = useTransform(scrollYProgress, [0, 0.4], [0, 0]);

  // All hero foreground fades out early on scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Description lines
  const line1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const line1Y      = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);
  const line2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const line2Y      = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);
  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const line3Y      = useTransform(scrollYProgress, [0.6, 0.7], [50, 0]);

  // Marquee
  const marqueeOpacity = useTransform(scrollYProgress, [0.74, 0.86], [0, 1]);
  const marqueeY       = useTransform(scrollYProgress, [0.74, 0.86], [24, 0]);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.dataset.theme !== 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Step 1 & 2 kickoff — mark loaded after brief delay
    const t1 = setTimeout(() => setHasLoaded(true), 100);
    // Step 4 — role + buttons become visible at ~1.9s
    const t2 = setTimeout(() => setRoleVisible(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
    <section ref={sectionRef} className="relative h-[500vh] bg-page">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── Step 1: EMERGE — ghost background, first to appear ── */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-bold text-heading whitespace-nowrap"
            style={{ fontSize: '23vw', letterSpacing: '0.04em', lineHeight: 1 }}
          >
            EMERGE
          </motion.span>
        </motion.div>

        {/* ── Step 2: Shader box — grows from zero after EMERGE appears ── */}
        {/*   Outer wrapper drives the entrance scale 0→1                  */}
        {/*   Inner wrapper drives the scroll scale 1→3.5                  */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <motion.div
            style={{ scale: boxScale, borderRadius: boxBorderRadius }}
            className="relative w-[50vw] h-[60vh] overflow-hidden z-10"
          >
            <PaperShader
              colors={isDark ? shaderColors.dark : shaderColors.light}
              speed={0.3}
            />

            {/* ── Step 3: Shader content — appears after box is fully grown ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 1.95 }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <motion.div
                style={{ opacity: textOpacity }}
                className="absolute inset-0"
              >
                {/* Quote — top left */}
                <div className="absolute top-5 left-5 max-w-[50%]">
                  <p
                    className="text-heading leading-relaxed"
                    style={{ fontSize: '11px', letterSpacing: '0.03em', opacity: 0.5 }}
                  >
                    Obsessed with the in-between.<br />
                    The quiet that makes noise worthwhile.
                  </p>
                </div>

                {/* Name — bottom right: SHARMA brighter + larger, SANSKAR dimmer + smaller */}
                <div className="absolute bottom-4 right-5 flex flex-col items-end">
                  <span
                    className="font-bold text-heading leading-[0.88]"
                    style={{ fontSize: 'clamp(2.8rem, 5.2vw, 6rem)', opacity: 0.52 }}
                  >
                    SANSKAR
                  </span>
                  <span
                    className="font-bold text-heading leading-[0.88]"
                    style={{ fontSize: 'clamp(3.8rem, 7.5vw, 9rem)', opacity: 0.88 }}
                  >
                    SHARMA
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute inset-0 border border-edge-subtle opacity-20 pointer-events-none z-10"
              style={{ borderRadius: boxBorderRadius }}
            />
          </motion.div>
        </motion.div>

        {/* ── Step 4a: Corner markers — outside shader box, at its exact corners ── */}
        {/*   Shader is 50vw × 60vh centered → corners at (25vw,20vh) and (75vw,80vh) */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 pointer-events-none z-20"
          aria-hidden="true"
        >
          {/* Top-left corner */}
          <motion.div
            className="absolute"
            style={{ top: 'calc(20vh - 16px)', left: 'calc(25vw - 16px)' }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity, repeatType: 'mirror', delay: 2.5, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute top-0 left-0 h-px w-9 bg-heading"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.38, delay: 2.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: 'left' }}
            />
            <motion.div
              className="absolute top-0 left-0 w-px h-9 bg-heading"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.38, delay: 2.45, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: 'top' }}
            />
          </motion.div>

          {/* Bottom-right corner */}
          <motion.div
            className="absolute"
            style={{ bottom: 'calc(20vh - 16px)', right: 'calc(25vw - 16px)' }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity, repeatType: 'mirror', delay: 2.8, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute bottom-0 right-0 h-px w-9 bg-heading"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.38, delay: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: 'right' }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-px h-9 bg-heading"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.38, delay: 2.65, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: 'bottom' }}
            />
          </motion.div>
        </motion.div>

        {/* ── Step 4b: Role + CTAs — appears with corner markers ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-0 right-0 z-20"
          style={{ top: 'calc(50% + 34vh)' }}
        >
          <motion.div
            style={{ opacity: textOpacity }}
            className="flex flex-col items-center gap-5"
          >
            <TextGlitch
              ref={glitchRef}
              as="p"
              trigger={roleVisible}
              duration={0.5}
              speed={0.03}
              className="type-hero text-muted uppercase"
              style={{ letterSpacing: '0.12em', fontSize: 'clamp(0.85rem, 1.6vw, 1.6rem)' }}
            >
              {roles[0]}
            </TextGlitch>

            <div className="flex items-center gap-4">
              <a
                href="mailto:sharma.sans@northeastern.edu"
                className="px-6 py-3 type-label bg-heading text-page hover:opacity-80 transition-opacity duration-200"
              >
                CONTACT ME
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 type-label border border-edge text-heading hover:border-edge-strong transition-colors duration-200"
              >
                VIEW RESUME
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Description lines (scroll 40–70%) ── */}
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
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
