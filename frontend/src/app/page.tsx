/**
 * Main Page — Composes all sections into a single-page scrolling experience.
 * Server component that imports client components.
 */

import Navbar from '@/components/client/Navbar';
import HeroSection from '@/components/client/HeroSection';
import AboutSection from '@/components/client/AboutSection';
import SkillsSection from '@/components/client/SkillsSection';
import StatsSection from '@/components/client/StatsSection';
import ProjectsSection from '@/components/client/ProjectsSection';
import TestimonialsSection from '@/components/client/TestimonialsSection';
import ContactSection from '@/components/client/ContactSection';
import AIChatWidget from '@/components/client/AIChatWidget';
import Footer from '@/components/server/Footer';

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />

        <div className="section-divider" />
        <AboutSection />

        <div className="section-divider" />
        <SkillsSection />

        <StatsSection />

        <div className="section-divider" />
        <ProjectsSection />

        <TestimonialsSection />

        <div className="section-divider" />
        <ContactSection />
      </main>

      <Footer />

      {/* Floating AI Chat */}
      <AIChatWidget />
    </>
  );
}
