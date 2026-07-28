'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition — wraps page content with smooth enter/exit animations.
 * Uses a two-phase transition: fade-out → swap content → fade-in with scale.
 * The exit animation slides content up with reduced opacity and scale,
 * then the enter animation slides it back in from below with full opacity.
 * Respects prefers-reduced-motion: when active, skips all animations.
 */
export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'entering' | 'visible' | 'leaving'>(reduced ? 'visible' : 'entering');
  const [displayChildren, setDisplayChildren] = useState(children);

  // Handle route changes
  useEffect(() => {
    if (phase === 'visible') {
      if (reduced) {
        // Skip animation when reduced motion is preferred
        setDisplayChildren(children);
        setPhase('visible');
        return;
      }
      
      // Start exit animation
      setPhase('leaving');
      
      const exitTimeout = setTimeout(() => {
        // Swap content during the exit
        setDisplayChildren(children);
        // Start enter animation
        setPhase('entering');
        
        const enterTimeout = setTimeout(() => {
          setPhase('visible');
        }, 50); // Small delay to trigger the CSS transition
        
        return () => clearTimeout(enterTimeout);
      }, 200); // Exit animation duration

      return () => clearTimeout(exitTimeout);
    }    }, [pathname, phase, reduced]);

  // Initial mount: skip exit, go straight to visible
  useEffect(() => {
    if (reduced) {
      setPhase('visible');
      return;
    }
    const mountTimeout = setTimeout(() => {
      setPhase('visible');
    }, 100);
    return () => clearTimeout(mountTimeout);
  }, [reduced]);

  function getAnimationClass() {
    if (reduced) return '';
    switch (phase) {
      case 'leaving':
        return 'opacity-0 -translate-y-2 scale-[0.98] blur-[1px]';
      case 'entering':
        return 'opacity-0 translate-y-4 scale-[0.98]';
      case 'visible':
      default:
        return 'opacity-100 translate-y-0 scale-100 blur-0';
    }
  }

  return (
    <div
      className={`${
        reduced ? '' :
        `transition-all ${
          phase === 'leaving'
            ? 'duration-[180ms] ease-in'
            : 'duration-[350ms] cubic-bezier(0.23, 1, 0.32, 1)'
        }`
      } ${getAnimationClass()} ${className}`}
    >
      {displayChildren}
    </div>
  );
}

/**
 * StaggeredItem — wraps individual items in a staggered animation list.
 * Each item appears sequentially with a configurable delay between items.
 * Supports both fade-in-slide-up and scale effects.
 *
 * Usage:
 * ```tsx
 * <StaggeredItem index={0}>First</StaggeredItem>
 * <StaggeredItem index={1}>Second</StaggeredItem>
 * <StaggeredItem index={2} className="lg:col-span-2">Third</StaggeredItem>
 * ```
 */
export function StaggeredItem({ 
  children, 
  index = 0,
  className = '',
  delay = 75,
  animation = 'slide-up',
}: { 
  children: React.ReactNode; 
  index?: number;
  className?: string;
  /** Delay in ms between each item */
  delay?: number;
  /** Animation style */
  animation?: 'slide-up' | 'scale-in' | 'fade-in';
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(reduced ? true : false);

  useEffect(() => {
    if (reduced) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(true), index * delay);
    return () => clearTimeout(timer);
  }, [index, delay, reduced]);

  const getAnimClass = () => {
    if (!mounted) {
      switch (animation) {
        case 'slide-up': return 'opacity-0 translate-y-6';
        case 'scale-in': return 'opacity-0 scale-95';
        case 'fade-in': return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 scale-100';
  };    return (
    <div
      className={`transition-all duration-[400ms] cubic-bezier(0.23, 1, 0.32, 1) ${getAnimClass()} ${className}`}
      style={{ transitionDelay: mounted ? '0ms' : `${index * delay}ms` }}
    >
      {children}
    </div>
  );
}
