/**
 * ErrorBoundary3D — Gracefully catches WebGL/Three.js errors.
 * Ensures the rest of the site does not crash if the 3D canvas fails.
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary3D extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Graceful fallback UI for the 3D background
      return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
             style={{
               background: 'radial-gradient(circle at 50% 50%, var(--accent-cyan) 0%, transparent 50%)',
             }}
        />
      );
    }

    return this.props.children;
  }
}
