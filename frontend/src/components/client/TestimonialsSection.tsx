/**
 * TestimonialsSection — Client feedback cards with quotes, names, and roles.
 * Three testimonial cards with realistic placeholder quotes.
 */

'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote:
      'The AI chatbot integration transformed our customer support workflow. Response times dropped by 80%, and the natural conversation flow keeps customers engaged.',
    name: 'Arjun Mehta',
    role: 'Founder, TechBridge Solutions',
    accent: 'var(--accent-cyan)',
  },
  {
    quote:
      'The 3D web experience he built for our product launch was unlike anything we\'d seen. Visitors spent 3x longer on the site, and conversion rates jumped significantly.',
    name: 'Sarah Chen',
    role: 'Marketing Director, Luxe Digital',
    accent: 'var(--accent-purple)',
  },
  {
    quote:
      'From concept to final cut, the video production quality was cinema-grade. The motion graphics and pacing made our brand story impossible to scroll past.',
    name: 'Dev Patel',
    role: 'Creative Lead, Narrative Studios',
    accent: 'var(--accent-cyan)',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-alt">
      <div className="section">
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
            What People Say
          </span>
          <h2 className="heading-lg">
            Client <span className="text-gradient">Feedback</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Real results from real collaborations — here&apos;s what clients have to say.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              className="testimonial-card"
            >
              {/* Quote mark */}
              <span className="quote-mark">&ldquo;</span>

              {/* Quote text */}
              <p
                className="text-sm leading-relaxed mb-6 pt-8 relative z-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.quote}
              </p>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                {/* Avatar placeholder */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: t.accent === 'var(--accent-cyan)'
                      ? 'rgba(8,145,178,0.1)'
                      : 'rgba(124,58,237,0.1)',
                    color: t.accent,
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
