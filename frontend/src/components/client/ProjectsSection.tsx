/**
 * ProjectsSection — Showcase cards with spotlight mouse-tracking,
 * 3D perspective tilt, and proper SVG icons (no emojis).
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Rocket, Bot, Globe, Film } from 'lucide-react';

const PROJECTS = [
  {
    title: 'AI-Native Creator Hub',
    category: 'Academic Prototype',
    description:
      'A premium concept for a hybrid startup/portfolio platform showcasing 3D scrollytelling, a custom AI chat assistant built with Gemini, and lead capture logic.',
    tech: ['Next.js', 'React Three Fiber', 'FastAPI', 'Gemini', 'Zustand'],
    status: 'v1.0 Live',
    accent: 'var(--accent-cyan)',
    icon: <Rocket size={28} className="text-[var(--accent-cyan)]" />,
    href: '#',
  },
  {
    title: 'WhatsApp AI Agency',
    category: 'Startup Concept',
    description:
      'A proof-of-concept for digital workers targeting small businesses. Explores using LangChain and Gemini to handle FAQ responses and scheduling automations.',
    tech: ['Python', 'LangChain', 'Gemini 3 Flash', 'FastAPI'],
    status: 'Prototyping',
    accent: 'var(--accent-purple)',
    icon: <Bot size={28} className="text-[var(--accent-purple)]" />,
    href: null,
  },
  {
    title: '3D Scrollytelling Demo',
    category: 'Engineering Sandbox',
    description:
      'An immersive, scroll-bound 3D experiment where an abstract geometric model reacts to scroll position and dynamic mouse constraints.',
    tech: ['Three.js', 'GSAP', 'React Three Fiber', 'WebGL'],
    status: 'Deployed',
    accent: 'var(--accent-cyan)',
    icon: <Globe size={28} className="text-[var(--accent-cyan)]" />,
    href: '#',
  },
  {
    title: 'Cinematic Mock Reels',
    category: 'Creative Sandbox',
    description:
      'High-end video editing and motion graphics concepts designed to study audience retention techniques, pacing, and visual storytelling.',
    tech: ['DaVinci Resolve', 'After Effects', 'Premiere Pro'],
    status: 'Iterating',
    accent: 'var(--accent-purple)',
    icon: <Film size={28} className="text-[var(--accent-purple)]" />,
    href: null,
  },
];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  return (
    <>
    <section id="projects" className="section">
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
          Portfolio
        </span>
        <h2 className="heading-lg">
          Featured <span className="text-gradient">Projects</span>
        </h2>
        <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          A selection of work that blends creativity, engineering, and AI into premium digital products.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((project, index) => (
          <div key={project.title} className="group block">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
              className="card card-spotlight group cursor-pointer relative overflow-hidden h-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setSelectedProject(project)}
              style={{ transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s, border-color 0.4s, background-color 0.4s' }}
            >
              {/* Accent line — solid */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{ background: project.accent }}
              />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'var(--bg-card-hover)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {project.icon}
                  </div>
                  <div>
                    <h3 className="heading-md !text-lg">{project.title}</h3>
                    <span className="text-xs font-medium" style={{ color: project.accent }}>
                      {project.category}
                    </span>
                  </div>
                </div>
                <span
                  className="px-3 py-1 text-xs rounded-full font-medium flex-shrink-0"
                  style={{
                    background: 'var(--bg-card)',
                    color: project.accent,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map((t, tIdx) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + tIdx * 0.05, duration: 0.3 }}
                    className="px-3 py-1 text-xs rounded-full transition-colors duration-300 group-hover:border-[var(--border-accent)]"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                  {project.href ? 'External Link' : 'Case Study Pending'}
                </span>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold hover:underline transition-transform duration-300 hover:translate-x-1"
                    style={{ color: 'var(--accent-cyan)' }}
                  >
                    Explore Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-xs font-bold italic" style={{ color: 'var(--text-muted)' }}>Coming Soon</span>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
      
      {/* Project Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0"
              style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-accent)',
              }}
            >
              {/* Top Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: selectedProject?.accent }}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6 sm:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'var(--bg-card-hover)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {selectedProject?.icon}
                  </div>
                  <div>
                    <span className="text-sm font-semibold tracking-wide uppercase" style={{ color: selectedProject?.accent }}>
                      {selectedProject?.category}
                    </span>
                    <h3 className="heading-lg !text-2xl sm:!text-3xl mt-1">{selectedProject?.title}</h3>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Project Overview</h4>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {selectedProject?.description}
                  </p>
                  <p className="text-base leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
                    This is a placeholder for a more detailed case study. In a real scenario, you would break down the problem, the solution, the technical architecture, and the business impact here.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject?.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 text-sm rounded-full font-medium"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  {selectedProject?.href ? (
                    <a
                      href={selectedProject.href || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full sm:w-auto text-center justify-center"
                    >
                      Visit Live Site
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <button disabled className="btn-primary w-full sm:w-auto opacity-50 cursor-not-allowed text-center justify-center">
                      Case Study Pending
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="btn-secondary w-full sm:w-auto text-center justify-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
