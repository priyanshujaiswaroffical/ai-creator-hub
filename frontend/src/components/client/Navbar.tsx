/**
 * Navbar — Glassmorphic fixed navigation bar with active section tracking.
 * Uses IntersectionObserver to highlight the current section.
 * Includes ThemeToggle for dark/light mode switching.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Skills', href: '#skills', sectionId: 'skills' },
  { label: 'Projects', href: '#projects', sectionId: 'projects' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track scroll for glass background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.sectionId);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-lg'
          : 'bg-transparent'
      }`}
      style={{ borderBottom: scrolled ? '1px solid var(--glass-border)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: 'var(--accent-gradient)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
            }}
          >
            CH
          </div>
          <span
            className="text-lg font-semibold tracking-tight hidden sm:block"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Creator<span className="text-gradient">Hub</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium transition-colors rounded-full"
              style={{
                color: activeSection === link.sectionId ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {activeSection === link.sectionId && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'var(--bg-card-hover)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
          <div className="ml-3 pl-3 border-l flex items-center gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
            <ThemeToggle />
            <a href="#contact" className="btn-primary !py-2 !px-5 !text-sm !rounded-lg">
              Let&apos;s Talk
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                transform: mobileOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                transform: mobileOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base py-2 transition-colors"
                  style={{ color: activeSection === link.sectionId ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
                >
                  {activeSection === link.sectionId && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ background: 'var(--accent-cyan)' }} />
                  )}
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="btn-primary !text-sm mt-2"
              >
                Let&apos;s Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
