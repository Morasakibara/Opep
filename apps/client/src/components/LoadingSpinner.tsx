import React from 'react';

interface LoadingSpinnerProps {
  /** Size variant: 'sm' (small), 'md' (medium, default), 'lg' (large) */
  size?: 'sm' | 'md' | 'lg';
  /** Optional text to display below the spinner */
  text?: string;
  /** Whether to render as a fullscreen overlay */
  overlay?: boolean;
  /** Extra className for the container */
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-2',
  lg: 'h-14 w-14 border-[3px]',
};

export default function LoadingSpinner({
  size = 'md',
  text,
  overlay = false,
  className = '',
}: LoadingSpinnerProps) {
  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm gap-4">
        <div
          className={`${sizeMap[size]} border-primary border-t-transparent rounded-full animate-spin`}
        />
        {text && (
          <p className="text-on_surface text-sm font-medium">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-12 gap-3 ${className}`}>
      <div
        className={`${sizeMap[size]} border-primary border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p className="text-on_surface_variant text-sm">{text}</p>
      )}
    </div>
  );
}
