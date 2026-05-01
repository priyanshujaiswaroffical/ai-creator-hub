import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import CursorParticles from '@/components/client/CursorParticles';

export const metadata: Metadata = {
  title: 'CreatorHub — AI-Native Full-Stack Creator',
  description:
    'A premium startup + portfolio platform blending 3D web development, AI engineering, and cinematic video production into one immersive experience.',
  keywords: [
    'AI portfolio',
    'Full-Stack Creator',
    '3D web development',
    'React Three Fiber',
    'AI agents',
    'WhatsApp AI',
    'video production',
    'startup portfolio',
    'Priyanshu portfolio',
    'AI engineer',
    'creative developer',
  ],
  authors: [{ name: 'Priyanshu' }],
  creator: 'Priyanshu',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CreatorHub — AI-Native Full-Stack Creator',
    description:
      'Immersive 3D experiences, autonomous AI agents, and cinematic video production — all in one platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CreatorHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatorHub — AI-Native Full-Stack Creator',
    description:
      'Immersive 3D experiences, autonomous AI agents, and cinematic video production — all in one platform.',
    creator: '@priyanshu',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Priyanshu',
    jobTitle: 'AI-Native Full-Stack Creator',
    description:
      'Building immersive 3D web experiences, autonomous AI agents, and cinematic video production.',
    knowsAbout: [
      'React Three Fiber',
      'Three.js',
      'Next.js',
      'FastAPI',
      'Google Gemini',
      'LangChain',
      'DaVinci Resolve',
      'Video Production',
    ],
  };

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* FOUC prevention — apply saved theme before first paint */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ch-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`,
          }}
        />
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <CursorParticles />
      </body>
    </html>
  );
}
