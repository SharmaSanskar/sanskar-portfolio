'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TextGlitch } from './TextGlitch';

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh]"
      style={{ background: 'var(--color-primary-black)' }}
    >
      {/* Sticky container for the hero content */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* The Central Box - slow start, slight speed bump at end */}
        <motion.div
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1.4,
            delay: 0.3, // Pause a beat before starting
            ease: [0.25, 0.1, 0.25, 1] // Slow start, slight bump at end
          }}
          style={{ 
            scale: boxScale,
            borderRadius: boxBorderRadius,
          }}
          className="relative w-[50vw] h-[60vh] overflow-hidden"
        >
          {/* Image inside - shrinks MORE and takes LONGER */}
          <motion.div
            initial={{ scale: 1.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1.8, // Longer than box (1.4s)
              delay: 0.3, // Same start time
              ease: [0.25, 0.1, 0.25, 1] // Same easing
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div
              className="absolute inset-0 w-full h-full bg-stone-700/30"
              style={{
                backgroundImage: `url('/hero-bg.jpg')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </motion.div>

          {/* Subtle border */}
          <motion.div 
            className="absolute inset-0 border opacity-20 pointer-events-none"
            style={{ 
              borderColor: 'var(--color-stone-600)',
              borderRadius: boxBorderRadius,
            }}
          />
        </motion.div>

        {/* Hero Typography - CENTERED with increased spacing */}
        <motion.div
          style={{ scale: textScale, opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center uppercase"
        >
          <div className="flex flex-col items-center text-center space-y-8">
            <TextGlitch
              as="h1"
              trigger={hasLoaded}
              duration={1.2}
              speed={0.05}
              className="text-6xl md:text-7xl lg:text-8xl font-bold"
              style={{ 
                color: 'var(--color-stone-200)',
                letterSpacing: '0.1em'
              }}
            >
              Hello There
            </TextGlitch>
            <TextGlitch
              as="h1"
              trigger={hasLoaded}
              duration={1.2}
              speed={0.05}
              className="text-6xl md:text-7xl lg:text-8xl font-bold"
              style={{ 
                color: 'var(--color-stone-200)',
                letterSpacing: '0.1em'
              }}
            >
              I'm Sanskar
            </TextGlitch>
            <TextGlitch
              as="h1"
              trigger={hasLoaded}
              duration={1.2}
              speed={0.05}
              className="text-6xl md:text-7xl lg:text-8xl font-bold"
              style={{ 
                color: 'var(--color-stone-400)',
                letterSpacing: '0.1em'
              }}
            >
              Software Engineer
            </TextGlitch>
          </div>
        </motion.div>

        {/* Description - LEFT ALIGNED, slides up sequentially */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 max-w-4xl">
          <div className="flex flex-col items-start text-left space-y-4">
            {/* Line 1 */}
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line1Y, opacity: line1Opacity }}
                className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-tight"
              >
                <span style={{ color: 'var(--color-stone-200)' }}>
                  A software engineer
                </span>
              </motion.p>
            </div>

            {/* Line 2 */}
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line2Y, opacity: line2Opacity }}
                className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-tight"
              >
                <span style={{ color: 'var(--color-stone-200)' }}>
                  blending
                </span>
              </motion.p>
            </div>

            {/* Line 3 */}
            <div className="overflow-hidden">
              <motion.p
                style={{ y: line3Y, opacity: line3Opacity }}
                className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-tight"
              >
                <span style={{ color: 'var(--color-stone-300)' }}>
                  creativity and code
                </span>
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}