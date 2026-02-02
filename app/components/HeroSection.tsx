'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextGlitch, type TextGlitchHandle } from './TextGlitch';
import { PaperShader } from './PaperShader';

const roles = [
  'Software Engineer',
  'Creative Developer',
  'UI Engineer',
  'Fullstack Architect',
];

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const glitchRef = useRef<TextGlitchHandle>(null);

  // Scroll progress for the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Box scale: expands to fill viewport edge-to-edge
  const boxScale = useTransform(scrollYProgress, [0, 0.4], [1, 3.5]);
  const boxBorderRadius = useTransform(scrollYProgress, [0, 0.4], [16, 0]);

  // Hero text transformations on scroll - faster fade
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Description lines animate in sequentially
  const line1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0.4, 0.5], [50, 0]);
  
  const line2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const line2Y = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);
  
  const line3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
  const line3Y = useTransform(scrollYProgress, [0.6, 0.7], [50, 0]);

  useEffect(() => {
    // Trigger entry animation after mount
    const timer = setTimeout(() => setHasLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Cycle through roles every 6 seconds
  useEffect(() => {
    if (!hasLoaded) return;

    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => {
        const nextIndex = (prev + 1) % roles.length;
        glitchRef.current?.scrambleTo(roles[nextIndex], true);
        return nextIndex;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [hasLoaded]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-primary"
    >
      {/* Sticky container for the hero content */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* The Central Box with PaperShader - slow start, slight speed bump at end */}
        <motion.div
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1.4,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{ 
            scale: boxScale,
            borderRadius: boxBorderRadius,
          }}
          className="relative w-[50vw] h-[60vh] overflow-hidden"
        >
          {/* PaperShader - the expanding element */}
          <PaperShader 
            colors={['#0a0a0a', '#1c1917', '#292524', '#57534e']}
            speed={0.3}
          />

          {/* Subtle border */}
          <motion.div 
            className="absolute inset-0 border opacity-20 pointer-events-none z-10"
            style={{ 
              borderColor: 'var(--color-stone-600)',
              borderRadius: boxBorderRadius,
            }}
          />
        </motion.div>

        {/* Hero Typography - CENTERED with two lines */}
        <motion.div
          style={{ scale: textScale, opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center uppercase z-20"
        >
          <div className="flex flex-col items-center text-center gap-6">
            {/* Line 1: Scramble text */}
            <TextGlitch
              as="h1"
              trigger={hasLoaded}
              duration={1.2}
              speed={0.05}
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-stone-200"
              style={{
                letterSpacing: '0.1em',
              }}
            >
              Hey, I'm Sanskar
            </TextGlitch>

            {/* Line 2: Glitching role text */}
            <TextGlitch
              ref={glitchRef}
              as="h1"
              trigger={hasLoaded}
              duration={0.5}
              speed={0.03}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-200"
              style={{ 
                letterSpacing: '0.1em'
              }}
            >
              {roles[0]}
            </TextGlitch>
          </div>
        </motion.div>

        {/* Description - LEFT ALIGNED, slides up sequentially */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-4xl z-20">
          <div className="flex flex-col items-start text-left gap-8">
            {/* Line 1 */}
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line1Y, opacity: line1Opacity }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
              >
                <span className='text-stone-200'>
                  I turn ideas into interfaces people love using.
                </span>
              </motion.p>
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line2Y, opacity: line2Opacity }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
              >
                <span className='text-stone-200'>
                  Balancing performance, design, and scalability in every build.
                </span>
              </motion.p>
            </div>

            {/* Line 3 */}
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line3Y, opacity: line3Opacity }}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight"
              >
                <span className='text-stone-200'>
                  Writing code with intention, shipping products with purpose.
                </span>
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}