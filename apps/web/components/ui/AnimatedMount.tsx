'use client';

import React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type AnimationVariant = 'fade' | 'slide-up' | 'slide-down' | 'scale-in' | 'zoom-in';

interface AnimatedMountProps {
  children: React.ReactNode;
  /** Animation variant */
  animation?: AnimationVariant;
  /** Delay in ms before the animation starts */
  delay?: number;
  /** Duration in ms for the animation (defaults to Tailwind's animation duration) */
  durationMs?: number;
  /** Additional class names */
  className?: string;
  /** Optional: render as a different HTML element */
  as?: 'div' | 'span' | 'section';
  /** Click handler (forwarded to the wrapper element) */
  onClick?: (e: React.MouseEvent) => void;
}

const animClassMap: Record<AnimationVariant, string> = {
  'fade': 'animate-fade-in',
  'slide-up': 'animate-slide-in-from-bottom',
  'slide-down': 'animate-slide-in-from-top',
  'scale-in': 'animate-scale-in',
  'zoom-in': 'animate-zoom-in',
};

/**
 * AnimatedMount — wraps children with a mount animation when they first appear.
 * Respects prefers-reduced-motion: when active, skips animation classes
 * and only renders a wrapper if className contains layout styles.
 *
 * @example
 * <AnimatedMount animation="slide-up" delay={100} durationMs={700}>
 *   <div>Content that fades in and slides up</div>
 * </AnimatedMount>
 *
 * @example with onClick (for modals with stopPropagation)
 * <AnimatedMount animation="zoom-in" onClick={(e) => e.stopPropagation()}>
 *   <div>Modal content</div>
 * </AnimatedMount>
 */
export function AnimatedMount({
  children,
  animation = 'fade',
  delay = 0,
  durationMs,
  className = '',
  as: Tag = 'div',
  onClick,
}: AnimatedMountProps) {
  const reduced = useReducedMotion();

  // When reduced motion is active:
  // - If no className and no onClick: render children directly (no extra wrapper)
  // - If className or onClick: render wrapper with className only
  if (reduced) {
    if (!className && !onClick) return <>{children}</>;
    return <Tag className={className} onClick={onClick}>{children}</Tag>;
  }

  const animClass = animClassMap[animation];
  const style: React.CSSProperties = {
    animationDelay: `${delay}ms`,
    animationFillMode: 'backwards',
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  if (durationMs !== undefined) {
    style.animationDuration = `${durationMs}ms`;
  }

  return (
    <Tag
      className={`${animClass} ${className}`.trim()}
      style={style}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
