'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition — wraps page content with smooth enter/exit animations.
 * Uses a two-phase transition: fade-out → swap content → fade-in with scale.
 * The exit animation slides content up with reduced opacity and scale,
 * then the enter animation slides it back in from below with full opacity.
 */
export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'entering' | 'visible' | 'leaving'>('entering');
  const [displayChildren, setDisplayChildren] = useState(children);

  // Handle route changes
  useEffect(() => {
    if (phase === 'visible') {
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
    }    }, [pathname, phase]);

  // Initial mount: skip exit, go straight to entering → visible
  useEffect(() => {
    const mountTimeout = setTimeout(() => {
      setPhase('visible');
    }, 100);
    return () => clearTimeout(mountTimeout);
  }, []);

  function getAnimationClass() {
    switch (phase) {
      case 'leaving':
        return 'opacity-0 translate-y-3 scale-[0.98] blur-[1px]';
      case 'entering':
        return 'opacity-0 translate-y-6 scale-[0.97]';
      case 'visible':
      default:
        return 'opacity-100 translate-y-0 scale-100';
    }
  }

  return (
    <div
      className={`transition-all duration-[400ms] ease-out ${
        phase === 'leaving' ? 'duration-[200ms] ease-in' : 'duration-[400ms] ease-out'
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * delay);
    return () => clearTimeout(timer);
  }, [index, delay]);

  const getAnimClass = () => {
    if (!mounted) {
      switch (animation) {
        case 'slide-up': return 'opacity-0 translate-y-6';
        case 'scale-in': return 'opacity-0 scale-95';
        case 'fade-in': return 'opacity-0';
      }
    }
    return 'opacity-100 translate-y-0 scale-100';
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${getAnimClass()} ${className}`}
      style={{ transitionDelay: mounted ? '0ms' : `${index * delay}ms` }}
    >
      {children}
    </div>
  );
}
