/**
 * ScrollCanvas — Constrains the 3D scene to the hero section only.
 * This prevents the crystal from overlapping content in other sections.
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import { useScrollStore } from '@/store/scroll-store';
import ErrorBoundary3D from './ErrorBoundary3D';

// Dynamically import the heavy 3D Scene with ssr disabled to protect Lighthouse LCP
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Initializing 3D Canvas...</span>
      </div>
    </div>
  );
}

export default function ScrollCanvas() {
  const setScrollProgress = useScrollStore((s) => s.setScrollProgress);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalScroll;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  // Render inside the hero — this component is placed inside HeroSection
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <ErrorBoundary3D>
        <Suspense fallback={<LoadingScreen />}>
          <Scene3D />
        </Suspense>
      </ErrorBoundary3D>
    </div>
  );
}
