'use client';

import { type JSX, useEffect, useState, useRef, useImperativeHandle, useCallback, forwardRef } from 'react';
import { motion, type MotionProps } from 'motion/react';

type TextScrambleProps = {
  children?: string;
  /** fallback property if text is passed instead of children */
  text?: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * `motion.create()` is NOT memoized by Motion's proxy (only `motion.div`-style
 * property access is). Calling it in a render body returns a new component type
 * every render, which makes React unmount and remount the whole subtree — once
 * per scramble tick. Cache by tag so each tag maps to one stable component.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MotionTagComponent = React.ComponentType<any>;

const motionComponentCache = new Map<string, MotionTagComponent>();

function getMotionComponent(tag: React.ElementType): MotionTagComponent {
  const key = typeof tag === 'string' ? tag : 'p';
  let cached = motionComponentCache.get(key);
  if (!cached) {
    cached = motion.create(key as keyof JSX.IntrinsicElements) as MotionTagComponent;
    motionComponentCache.set(key, cached);
  }
  return cached;
}

export type TextGlitchHandle = {
  scrambleTo: (target?: string, persist?: boolean) => void;
  element?: HTMLElement | null;
};

export const TextGlitch = forwardRef<TextGlitchHandle, TextScrambleProps>(
  function TextGlitch(
    {
      children,
      text: textProp,
      duration = 0.8,
      speed = 0.04,
      characterSet = defaultChars,
      className,
      as: Component = 'p',
      trigger = true,
      onScrambleComplete,
      ...props
    },
    ref
  ) {
    const MotionComponent = getMotionComponent(Component);

    const elementRef = useRef<HTMLElement | null>(null);
    const intervalRef = useRef<number | null>(null);

    const [baseText, setBaseText] = useState(children ?? textProp ?? '');
    const [displayText, setDisplayText] = useState(baseText);

    // Per-tick frames are written straight to the DOM instead of through React
    // state — a full render pass every 30ms was the bulk of the scramble cost.
    // React state still holds the settled text, so SSR output and prop-sync are
    // unchanged, and React won't clobber our writes (it only patches children
    // when `displayText` itself changes).
    const paint = useCallback((value: string) => {
      if (elementRef.current) elementRef.current.textContent = value;
    }, []);

    // keep in sync with incoming props
    useEffect(() => {
      const next = children ?? textProp ?? '';
      setBaseText(next);
      setDisplayText(next);
    }, [children, textProp]);

    const scrambleTo = useCallback(
      (target?: string, persist = true) => {
        // stop any running animation
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        const src = baseText;
        const tgt = target ?? baseText;
        const maxLen = Math.max(src.length, tgt.length);
        const steps = Math.max(1, Math.round(duration / speed));
        let step = 0;

        intervalRef.current = window.setInterval(() => {
          let scrambled = '';
          const progress = step / steps;

          for (let i = 0; i < maxLen; i++) {
            const finalChar = i < tgt.length ? tgt[i] : '';

            if (finalChar === ' ') {
              scrambled += ' ';
              continue;
            }

            if (progress * maxLen > i) {
              scrambled += finalChar;
            } else {
              scrambled +=
                characterSet[Math.floor(Math.random() * characterSet.length)];
            }
          }

          paint(scrambled);
          step++;

          if (step > steps) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            paint(tgt);
            setDisplayText(tgt);
            if (persist) setBaseText(tgt);
            onScrambleComplete?.();
          }
        }, speed * 1000);
      },
      [baseText, characterSet, duration, speed, onScrambleComplete, paint]
    );

    useImperativeHandle(
      ref,
      () => ({
        scrambleTo: (t?: string, p = true) => scrambleTo(t, p),
        element: elementRef.current,
      }),
      [scrambleTo]
    );

    useEffect(() => {
      if (!trigger) return;
      scrambleTo(undefined, true);
    }, [trigger, scrambleTo]);

    // The scramble interval previously outlived unmount.
    useEffect(() => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    return (
      <MotionComponent ref={elementRef as any} className={className} {...props}>
        {displayText}
      </MotionComponent>
    );
  }
);