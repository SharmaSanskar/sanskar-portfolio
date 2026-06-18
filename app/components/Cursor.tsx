'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'motion/react';

type Variant = 'default' | 'hover' | 'view';

/**
 * Site-wide custom cursor: a fast filled dot + a laggier outline ring.
 * The ring grows over interactive elements and turns into a "View" pill over
 * [data-cursor="view"] targets. Disabled on touch / coarse pointers and under
 * prefers-reduced-motion, where the native cursor is left untouched.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>('default');
  const [label, setLabel] = useState('');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.2 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    setEnabled(true);
    document.body.classList.add('cursor-none');

    // Single guarded handler: track position + re-evaluate the hovered target.
    // Only setState when variant/label actually change (no per-frame re-renders).
    let lastV: Variant = 'default';
    let lastL = '';
    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest('a, button, [data-cursor]');
      let v: Variant = 'default';
      let l = '';
      if (target) {
        const dc = target.getAttribute('data-cursor');
        if (dc) { v = 'view'; l = dc; } else { v = 'hover'; }
      }
      if (v !== lastV) { lastV = v; setVariant(v); }
      if (l !== lastL) { lastL = l; setLabel(l); }
    };

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      document.body.classList.remove('cursor-none');
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  const ringSize = variant === 'view' ? 72 : variant === 'hover' ? 46 : 30;
  const isView = variant === 'view';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Ring / View pill */}
      <motion.div className="fixed top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
          animate={{
            width: ringSize,
            height: ringSize,
            backgroundColor: isView ? 'var(--color-accent)' : 'rgba(0,0,0,0)',
            borderColor: isView ? 'rgba(0,0,0,0)' : 'var(--color-accent)',
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          style={{ borderWidth: 1.5, borderStyle: 'solid' }}
        >
          <AnimatePresence>
            {isView && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                key={label}
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-on-accent)' }}
              >
                {label ? label[0].toUpperCase() + label.slice(1) : 'View'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Dot */}
      <motion.div className="fixed top-0 left-0" style={{ x: dotX, y: dotY }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{ opacity: variant === 'default' ? 1 : 0, width: 6, height: 6 }}
          style={{ backgroundColor: 'var(--color-accent)' }}
        />
      </motion.div>
    </div>
  );
}
