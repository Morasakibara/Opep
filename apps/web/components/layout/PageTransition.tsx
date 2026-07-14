'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Fade out
    setIsVisible(false);
    
    const timeout = setTimeout(() => {
      // Swap children during fade
      setDisplayChildren(children);
      // Fade in
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Initial mount
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {displayChildren}
    </div>
  );
}

/**
 * StaggeredItem — wraps individual items in a staggered animation list.
 * Usage: wrap each item with <StaggeredItem index={i}>...</StaggeredItem>
 */
export function StaggeredItem({ 
  children, 
  index = 0,
  className = '',
}: { 
  children: React.ReactNode; 
  index?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * 75);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        mounted 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-6 scale-95'
      } ${className}`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      {children}
    </div>
  );
}
