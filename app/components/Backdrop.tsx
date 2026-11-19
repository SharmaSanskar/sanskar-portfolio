'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { PaperShader } from './PaperShader';
import { ACCENTS, PALETTES, paletteMix, mixPalettes, hexToRgba } from '@/app/constants/backdrop';
import { EASE } from '@/app/constants/motion';

/** Colour updates are quantised: ~48 React renders across the whole morph,
 *  each one a cheap uniform update inside the shader. */
const STEPS = 48;

/**
 * One living gradient behind the entire page. It plays at full strength in the
 * hero, settles under a soft veil once the hero hands off (so chapters stay
 * readable), and morphs Ink → Brass while Work scrolls — never a cut, never a
 * second backdrop.
 */
export function Backdrop() {
  const reduce = useReducedMotion();
  const [isDark, setIsDark] = useState(true);
  const [step, setStep] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const { scrollY } = useScroll();

  // Where the hero hands off: measured from the first chapter's anchor so it
  // tracks the hero's real height at every breakpoint.
  const heroEnd = useRef(Infinity);
  const vh = useRef(800);
  useEffect(() => {
    const measure = () => {
      const work = document.getElementById('work');
      vh.current = window.innerHeight;
      if (work) heroEnd.current = work.getBoundingClientRect().top + window.scrollY;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.dataset.theme !== 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(paletteMix, 'change', (v) => {
    const s = Math.round(v * STEPS);
    setStep((prev) => (prev === s ? prev : s));
  });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const past = y > heroEnd.current - vh.current * 0.2;
    setPastHero((prev) => (prev === past ? prev : past));
  });

  // Hero bloom: the gradient swells as the name dissolves, then holds.
  const scale = useTransform(scrollY, (y) => {
    const end = Math.max(1, heroEnd.current * 0.45);
    return 1 + 0.45 * Math.min(1, Math.max(0, y / end));
  });

  // Veil: none in the hero (full colour), ~half across the hero's last screen
  // and from then on — the same gradient, quieter, behind the content.
  const veil = useTransform(scrollY, (y) => {
    const start = heroEnd.current - vh.current * 1.3;
    return 0.5 * Math.min(1, Math.max(0, (y - start) / vh.current));
  });

  const pair = isDark ? PALETTES.dark : PALETTES.light;
  const colors = useMemo(() => mixPalettes(pair.ink, pair.brass, step / STEPS), [pair, step]);

  // The accent follows the same morph (frost → brass). Written as root CSS
  // variables, so every accent use on the page — buttons, nav, labels, the
  // hero name — moves with the backdrop. ~48 writes across the whole morph.
  useEffect(() => {
    const a = isDark ? ACCENTS.dark : ACCENTS.light;
    const [accent] = mixPalettes([a.ink], [a.brass], step / STEPS);
    const [hover] = mixPalettes([accent], [a.toward], 0.2);
    const root = document.documentElement.style;
    root.setProperty('--color-accent', accent);
    root.setProperty('--color-accent-hover', hover);
    root.setProperty('--color-accent-soft', hexToRgba(accent, a.soft));
    root.setProperty('--color-accent-glow', hexToRgba(accent, a.glow));
  }, [isDark, step]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-page">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE.out }}
        className="absolute inset-0"
      >
        <motion.div style={reduce ? undefined : { scale }} className="absolute inset-0">
          <PaperShader
            colors={colors}
            speed={reduce ? 0 : pastHero ? 0.15 : 0.32}
            minPixelRatio={1}
            maxPixelCount={1280 * 800}
          />
        </motion.div>
      </motion.div>

      {/* Readability veil (opacity only) */}
      <motion.div className="absolute inset-0 bg-page" style={{ opacity: veil }} />

      {/* Constant soft vignette: the same top/bottom edges on every chapter */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in srgb, var(--color-page) 75%, transparent) 0%, transparent 22%, transparent 70%, color-mix(in srgb, var(--color-page) 80%, transparent) 100%)',
        }}
      />
    </div>
  );
}
