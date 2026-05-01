/**
 * StatsSection — Animated counting numbers with 4 key stats.
 * Uses IntersectionObserver to trigger count-up animation on scroll.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: 4, suffix: '+', label: 'Featured Projects', accent: 'var(--accent-cyan)' },
  { value: 3, suffix: '', label: 'Core Specializations', accent: 'var(--accent-purple)' },
  { value: 15, suffix: '+', label: 'Technologies Mastered', accent: 'var(--accent-cyan)' },
  { value: 100, suffix: '%', label: 'AI-Native Workflow', accent: 'var(--accent-purple)' },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span style={{ fontFamily: 'var(--font-display)' }}>
      {count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) setInView(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.3 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section className="section-alt">
      <div ref={ref} className="section">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
            style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}
          >
            By The Numbers
          </span>
          <h2 className="heading-lg">
            Impact at a <span className="text-gradient">Glance</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="stat-card"
            >
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: stat.accent }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
