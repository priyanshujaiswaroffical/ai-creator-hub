/**
 * SkillsSection — Interactive tech stack visualization with SVG icons and radial progress rings.
 * Replaces emoji icons with Lucide SVG. Adds animated circular progress indicators.
 */

'use client';

import { motion } from 'framer-motion';
import { Palette, Sparkles, Cpu, Film } from 'lucide-react';

const SKILL_CATEGORIES = [
  {
    title: 'Frontend',
    icon: <Palette size={22} className="text-[var(--accent-cyan)]" />,
    skills: [
      { name: 'Next.js / React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Framer Motion', level: 88 },
    ],
  },
  {
    title: '3D & Animation',
    icon: <Sparkles size={22} className="text-[var(--accent-purple)]" />,
    skills: [
      { name: 'React Three Fiber', level: 85 },
      { name: 'Three.js / WebGL', level: 80 },
      { name: 'GSAP ScrollTrigger', level: 88 },
      { name: 'Blender Basics', level: 65 },
    ],
  },
  {
    title: 'Backend & AI',
    icon: <Cpu size={22} className="text-[var(--accent-cyan)]" />,
    skills: [
      { name: 'Python / FastAPI', level: 90 },
      { name: 'Google Gemini', level: 92 },
      { name: 'LangChain / RAG', level: 85 },
      { name: 'Supabase / PostgreSQL', level: 82 },
    ],
  },
  {
    title: 'Creative',
    icon: <Film size={22} className="text-[var(--accent-purple)]" />,
    skills: [
      { name: 'DaVinci Resolve', level: 90 },
      { name: 'After Effects', level: 78 },
      { name: 'Thumbnail Design', level: 95 },
      { name: 'Motion Graphics', level: 75 },
    ],
  },
];

function RadialRing({ level, delay }: { level: number; delay: number }) {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative flex-shrink-0">
      <svg width="36" height="36" viewBox="0 0 36 36" className="transform -rotate-90">
        <circle cx="18" cy="18" r={radius} className="radial-ring-bg" strokeWidth="2.5" />
        <motion.circle
          cx="18"
          cy="18"
          r={radius}
          className="radial-ring-fg"
          strokeWidth="2.5"
          stroke="var(--accent-cyan)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
      >
        {level}
      </span>
    </div>
  );
}

function SkillRow({ name, level, delay }: { name: string; level: number; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 py-1.5 px-2 rounded-xl transition-all duration-300 group mb-1"
      style={{ ['--hover-bg' as string]: 'var(--bg-card-hover)' }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      <RadialRing level={level} delay={delay} />
      <div className="flex-1 min-w-0">
        <span
          className="text-xs font-medium block truncate transition-colors duration-300 group-hover:text-[var(--accent-cyan)]"
          style={{ color: 'var(--text-primary)' }}
        >
          {name}
        </span>
        <div className="h-1 rounded-full mt-1.5 overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent-cyan)' }}
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="section">
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
          Tech Stack
        </span>
        <h2 className="heading-lg">
          Skills & <span className="text-gradient">Technologies</span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          A curated set of modern tools and frameworks for building premium digital experiences.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((category, catIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: catIndex * 0.15, duration: 0.6 }}
            className="card !p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="skill-icon-box !w-10 !h-10 !rounded-lg">{category.icon}</div>
              <h3
                className="text-base font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {category.title}
              </h3>
            </div>
            {category.skills.map((skill, skillIndex) => (
              <SkillRow
                key={skill.name}
                name={skill.name}
                level={skill.level}
                delay={catIndex * 0.1 + skillIndex * 0.08}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
