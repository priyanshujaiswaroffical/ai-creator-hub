/**
 * HeroSection — Full-viewport hero with animated headline, CTA,
 * and decorative geometric SVG/CSS composition behind hero text.
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useScrollStore } from '@/store/scroll-store';

import ScrollCanvas from './ScrollCanvas';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

export default function HeroSection() {
  const setMousePosition = useScrollStore((s) => s.setMousePosition);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePosition(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [setMousePosition]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Canvas — contained within hero */}
      <ScrollCanvas />

      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Decorative Geometric Background Objects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Hexagon — top-right */}
        <svg
          className="absolute top-[15%] right-[10%] w-24 h-24 md:w-32 md:h-32 opacity-[0.07]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="var(--accent-cyan)"
          strokeWidth="1.5"
          style={{ animation: 'float-geo 8s ease-in-out infinite' }}
        >
          <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" />
        </svg>

        {/* Circle — bottom-left */}
        <svg
          className="absolute bottom-[20%] left-[8%] w-20 h-20 md:w-28 md:h-28 opacity-[0.06]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="var(--accent-purple)"
          strokeWidth="1.5"
          style={{ animation: 'float-geo-alt 10s ease-in-out infinite' }}
        >
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" strokeDasharray="5 5" />
        </svg>

        {/* Code Brackets — top-left */}
        <svg
          className="absolute top-[30%] left-[12%] w-16 h-16 md:w-20 md:h-20 opacity-[0.08]"
          viewBox="0 0 60 60"
          fill="none"
          stroke="var(--accent-cyan)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ animation: 'float-geo 12s ease-in-out infinite' }}
        >
          <path d="M20 10 L5 30 L20 50" />
          <path d="M40 10 L55 30 L40 50" />
        </svg>

        {/* Circuit lines — bottom-right */}
        <svg
          className="absolute bottom-[15%] right-[15%] w-32 h-32 opacity-[0.05]"
          viewBox="0 0 120 120"
          fill="none"
          stroke="var(--accent-purple)"
          strokeWidth="1"
          style={{ animation: 'float-geo-alt 9s ease-in-out infinite' }}
        >
          <path d="M10 60 H50 V20 H90" strokeDasharray="4 4" />
          <path d="M10 80 H40 V100 H80" strokeDasharray="4 4" />
          <circle cx="50" cy="20" r="3" fill="var(--accent-purple)" />
          <circle cx="90" cy="20" r="3" fill="var(--accent-cyan)" />
          <circle cx="80" cy="100" r="3" fill="var(--accent-purple)" />
        </svg>

        {/* Diamond — center-right */}
        <svg
          className="absolute top-[50%] right-[5%] w-12 h-12 opacity-[0.06]"
          viewBox="0 0 50 50"
          fill="none"
          stroke="var(--accent-cyan)"
          strokeWidth="1.5"
          style={{ animation: 'float-geo 7s ease-in-out infinite' }}
        >
          <rect x="7" y="7" width="36" height="36" rx="2" transform="rotate(45 25 25)" />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        className="section relative z-10 text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide"
            style={{
              background: 'rgba(8, 145, 178, 0.08)',
              border: '1px solid rgba(8, 145, 178, 0.2)',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
            AI-Native Full-Stack Creator
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="heading-xl mb-6">
          I Build{' '}
          <span className="text-gradient">Immersive 3D</span>
          <br />
          Experiences &{' '}
          <span className="text-gradient">AI Agents</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Blending cinematic video production, interactive 3D web development,
          and autonomous AI engineering into one premium platform.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#projects" className="btn-primary">
            View Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className="btn-secondary">
            Start a Project
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: 'var(--border-accent)' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-cyan)' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
