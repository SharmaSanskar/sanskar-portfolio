'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

/**
 * Contextual hover label — the useful half of the old custom cursor, without
 * the always-on ring. Only elements carrying `data-cursor="Label"` summon it:
 * while the pointer is inside one, a small accent pill follows it; everywhere
 * else nothing listens to mousemove and nothing renders. The native cursor
 * always stays visible.
 */
export function HoverPill() {
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const active = useRef<Element | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };

    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest('[data-cursor]');
      if (!target || target === active.current) return;
      active.current = target;
      x.jump(e.clientX); y.jump(e.clientY);
      sx.jump(e.clientX); sy.jump(e.clientY);
      setLabel(target.getAttribute('data-cursor'));
      window.addEventListener('pointermove', move, { passive: true });
    };

    const out = (e: PointerEvent) => {
      if (!active.current) return;
      const to = e.relatedTarget as Node | null;
      if (to && active.current.contains(to)) return;
      active.current = null;
      setLabel(null);
      window.removeEventListener('pointermove', move);
    };

    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    return () => {
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      window.removeEventListener('pointermove', move);
    };
  }, [x, y, sx, sy]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{ x: sx, y: sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className="block ml-4 mt-4 px-3 py-1.5 rounded-full bg-accent text-on-accent text-[10px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap shadow-[0_8px_28px_var(--color-accent-glow)]"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
