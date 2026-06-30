'use client';

import { useEffect, useState } from 'react';

const links = [
  { label: 'WORK',     href: '#work' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'CONTACT',  href: '#contact' },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-glass)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderColor: 'var(--color-glass-border)',
        opacity: !visible ? 0 : hovered ? 1 : 0.70,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease',
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-5 md:gap-8 px-5 md:px-6 py-3 border"
      aria-label="Section navigation"
    >
      {links.map(({ label, href }) => (
        <a
          key={href}
          href={href}
          className={`type-label link-underline transition-colors duration-200 ${
            active === href ? 'text-accent' : 'text-secondary hover:text-heading'
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
