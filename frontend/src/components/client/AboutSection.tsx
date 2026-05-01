/**
 * AboutSection — Three-pillar skill showcase with glassmorphic cards,
 * spotlight mouse-tracking, and staggered tool tag reveals.
 */

'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Globe2, Bot, Clapperboard } from 'lucide-react';

const PILLARS = [
  {
    icon: <Globe2 size={36} className="text-[var(--accent-cyan)]" />,
    title: '3D Web Development',
    description:
      'Interactive, scroll-animated 3D experiences using React Three Fiber, GSAP ScrollTrigger, and Three.js. Every pixel is crafted for a cinematic feel.',
    tools: ['React Three Fiber', 'GSAP', 'Three.js', 'Next.js'],
    accentColor: 'var(--accent-cyan)',
  },
  {
    icon: <Bot size={36} className="text-[var(--accent-purple)]" />,
    title: 'AI Engineering',
    description:
      'Autonomous AI agents for WhatsApp and web platforms, powered by Google Gemini. From RAG pipelines to intelligent digital workers that handle real business tasks.',
    tools: ['Google Gemini', 'LangChain', 'FastAPI', 'Supabase'],
    accentColor: 'var(--accent-purple)',
  },
  {
    icon: <Clapperboard size={36} className="text-[var(--accent-cyan)]" />,
    title: 'Video Production',
    description:
      'End-to-end cinematic video editing, motion graphics, and high-CTR thumbnail design. Content that captures attention and drives engagement.',
    tools: ['DaVinci Resolve', 'After Effects', 'Photoshop', 'Premiere Pro'],
    accentColor: 'var(--accent-cyan)',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

export default function AboutSection() {
  // Spotlight mouse-tracking handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <section id="about" className="section">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
          style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}
        >
          What I Do
        </span>
        <h2 className="heading-lg">
          Three Pillars of{' '}
          <span className="text-gradient">Creation</span>
        </h2>
        <p
          className="mt-4 max-w-xl mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          A unique blend of creative and technical expertise, unified into
          one AI-native platform.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {PILLARS.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="card card-spotlight group relative overflow-hidden"
            onMouseMove={handleMouseMove}
          >
            {/* Accent line — solid color, no gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-50"
              style={{ background: pillar.accentColor }}
            />

            {/* Icon with glow container */}
            <div
              className="mb-5 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {pillar.icon}
            </div>

            {/* Title */}
            <h3
              className="heading-md mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {pillar.title}
            </h3>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {pillar.description}
            </p>

            {/* Tool Tags — staggered entrance */}
            <div className="flex flex-wrap gap-2">
              {pillar.tools.map((tool, toolIndex) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.2 + toolIndex * 0.08,
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
                  }}
                  className="px-3 py-1 text-xs rounded-full transition-all duration-300 hover:border-[var(--border-accent)] hover:text-[var(--text-secondary)]"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
