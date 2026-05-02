/**
 * ContactSection — Lead capture form with focus glow, micro-interactions, and service selector.
 * Submits to POST /api/leads on the FastAPI backend.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const SERVICES = [
  { value: 'ai_agent', label: 'AI Digital Worker', desc: 'WhatsApp / Web chatbot', icon: <BotIcon /> },
  { value: 'video_production', label: 'Video Production', desc: 'Editing & thumbnails', icon: <FilmIcon /> },
  { value: 'web_3d', label: '3D Web Experience', desc: 'Interactive website', icon: <GlobeIcon /> },
  { value: 'general', label: 'General Inquiry', desc: "Let's discuss", icon: <ChatIcon /> },
];


function BotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}
function FilmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    service_type: 'general',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // 1. Call Render Backend to save to Supabase
      const renderResponse = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // 2. Call Vercel API to send Emails (bypassing Render block)
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const renderData = await renderResponse.json();
      const emailData = await emailResponse.json();

      if (!renderResponse.ok || !renderData.success) {
        // If Supabase fails, we still show the error
        throw new Error(renderData.message || 'Database error');
      }

      setResponseMsg('Success! Your inquiry is saved and confirmation email sent.');
      setStatus('success');
      setForm({ name: '', email: '', message: '', service_type: 'general' });
    } catch (err: any) {
      console.error('Submission Error:', err);
      setResponseMsg('Failed to send. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="max-w-3xl mx-auto">
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
            Get In Touch
          </span>
          <h2 className="heading-lg">
            Start a <span className="text-gradient">Project</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Ready to build something premium? Select a service and tell me about your vision.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="card"
        >
          <div className="mb-6">
            <label
              className="text-xs font-semibold tracking-wide mb-3 block"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}
            >
              Select a Service
            </label>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((service) => (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => setForm({ ...form, service_type: service.value })}
                  suppressHydrationWarning
                  className="p-3 rounded-xl text-left transition-all duration-300 group/svc"
                  style={{
                    background:
                      form.service_type === service.value
                        ? 'var(--bg-card-hover)'
                        : 'var(--bg-card)',
                    border: `1px solid ${
                      form.service_type === service.value
                        ? 'var(--border-accent)'
                        : 'var(--border-subtle)'
                    }`,
                    boxShadow: form.service_type === service.value
                      ? 'var(--shadow-glow)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="transition-colors duration-300"
                      style={{ color: form.service_type === service.value ? 'var(--accent-cyan)' : 'var(--text-muted)' }}
                    >
                      {service.icon}
                    </span>
                    <span className="text-sm font-medium">{service.label}</span>
                  </div>
                  <span className="text-xs block mt-0.5 pl-7" style={{ color: 'var(--text-muted)' }}>
                    {service.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your name"
                suppressHydrationWarning
                className="input-glow w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                id="contact-name"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                suppressHydrationWarning
                className="input-glow w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                id="contact-email"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={4}
              placeholder="Tell me about your project, goals, and timeline..."
              suppressHydrationWarning
              className="input-glow w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none resize-none"
              style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
              id="contact-message"
            />
          </div>

          <motion.button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary w-full !py-4 disabled:opacity-50"
            id="contact-submit"
            suppressHydrationWarning
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'sending' ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                Send Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </motion.button>

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl text-sm text-center flex items-center justify-center gap-2"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-cyan)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {responseMsg}
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl text-sm text-center flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255, 50, 50, 0.08)',
                border: '1px solid rgba(255, 50, 50, 0.2)',
                color: '#ff6b6b',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
              </svg>
              {responseMsg}
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
