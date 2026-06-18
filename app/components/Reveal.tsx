'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { EASE } from '@/app/constants/motion';

type Tag = 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';

interface RevealTextProps {
  text: string;
  as?: Tag;
  className?: string;
  style?: React.CSSProperties;
  wordClassName?: string;
  /** Animate immediately on mount (default) vs. when scrolled into view. */
  inView?: boolean;
  /** When not inView, gate the animation on this flag (defaults to true). */
  trigger?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
}

/**
 * Splits `text` into words, each masked behind an overflow-hidden span, and
 * slides the words up from 110% with a stagger — the editorial "line reveal".
 * Falls back to static text under prefers-reduced-motion.
 */
export function RevealText({
  text,
  as = 'span',
  className = '',
  style,
  wordClassName = '',
  inView = false,
  trigger = true,
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
}: RevealTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as;
    return <Tag className={className} style={style}>{text}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: '115%' },
    show: { y: '0%', transition: { duration, ease: EASE.outExpo } },
  };

  const MotionTag = (motion as any)[as] as typeof motion.span;
  const words = text.split(' ');

  const activation = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.5 } }
    : { initial: 'hidden', animate: trigger ? 'show' : 'hidden' };

  return (
    <MotionTag className={className} style={style} variants={container} aria-label={text} {...activation}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.22em', marginBottom: '-0.22em' }}
        >
          <motion.span variants={child} className={`inline-block will-change-transform ${wordClassName}`}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
