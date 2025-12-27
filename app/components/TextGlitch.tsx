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
    const MotionComponent = motion.create(
      Component as keyof JSX.IntrinsicElements
    ) as React.ComponentType<any>;

    const elementRef = useRef<HTMLElement | null>(null);
    const intervalRef = useRef<number | null>(null);

    const [baseText, setBaseText] = useState(children ?? textProp ?? '');
    const [displayText, setDisplayText] = useState(baseText);
    const [isAnimating, setIsAnimating] = useState(false);

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

        setIsAnimating(true);

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

          setDisplayText(scrambled);
          step++;

          if (step > steps) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setDisplayText(tgt);
            setIsAnimating(false);
            if (persist) setBaseText(tgt);
            onScrambleComplete?.();
          }
        }, speed * 1000);
      },
      [baseText, characterSet, duration, speed, onScrambleComplete]
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

    return (
      <MotionComponent ref={elementRef as any} className={className} {...props}>
        {displayText}
      </MotionComponent>
    );
  }
);