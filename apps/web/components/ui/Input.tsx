import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-[12px] font-bold uppercase tracking-widest text-on_surface_variant">
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant group-focus-within:text-primary transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-surface_container_low border rounded-lg p-3 text-[14px] text-on_surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on_surface_variant/40',
              error ? 'border-error_red' : 'border-charcoal_border',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on_surface_variant">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-error_red text-[11px] font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
