import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-on_primary shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95',
      secondary: 'bg-secondary text-on_secondary shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-95',
      outline: 'bg-transparent border border-charcoal_border text-on_surface hover:bg-surface_container_high active:scale-95',
      ghost: 'bg-transparent text-on_surface_variant hover:text-on_surface hover:bg-surface_container_high active:scale-95',
      danger: 'bg-error_red/10 text-error_red border border-error_red/20 hover:bg-error_red hover:text-white active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[12px] rounded-md',
      md: 'px-6 py-2.5 text-[14px] rounded-lg font-bold',
      lg: 'px-8 py-3.5 text-[16px] rounded-xl font-bold',
      icon: 'p-2.5 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
