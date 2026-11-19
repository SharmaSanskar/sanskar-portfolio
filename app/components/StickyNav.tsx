'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { RollText } from './RollText';

const links = [
  { label: 'WORK',     href: '#work' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT',  href: '#contact' },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('');

  // A hairline under the pill fills with the whole-page scroll: one thread
  // that tells the visitor where they are in the story.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight the link for the section currently in view
  useEffect(() => {
    const ids = ['work', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      style={{
        background: 'var(--color-nav)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderColor: 'var(--color-glass-border)',
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, ${visible ? 0 : -8}px)`,
        pointerEvents: visible ? 'auto' : 'none',
        // A backdrop-filter at opacity 0 is still composited every frame, so
        // visibility is dropped once the fade-out has finished.
        visibility: visible ? 'visible' : 'hidden',
        transition: visible
          ? 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1), visibility 0s'
          : 'opacity 0.4s ease, transform 0.4s ease, visibility 0s linear 0.4s',
      }}
      className="fixed top-4 md:top-6 left-1/2 z-50 w-max border overflow-hidden"
      aria-label="Section navigation"
    >
      <div className="flex">
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={`type-label px-4 md:px-5 py-4 md:py-3.5 transition-colors duration-200 ${
              active === href ? 'text-accent' : 'text-secondary hover:text-heading'
            }`}
          >
            <RollText>{label}</RollText>
          </a>
        ))}
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute left-0 bottom-0 h-px w-full bg-accent origin-left"
        style={{ scaleX: progress }}
      />
    </nav>
  );
}
