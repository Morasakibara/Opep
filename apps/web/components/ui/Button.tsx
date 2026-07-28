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
  /** Disable ripple effect animation */
  noRipple?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, noRipple, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    React.useImperativeHandle(ref, () => buttonRef.current!);

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mouse-x', `${x}%`);
      el.style.setProperty('--mouse-y', `${y}%`);
    }, []);

    // Reset ripple on mouse leave
    const handleMouseLeave = React.useCallback(() => {
      const el = buttonRef.current;
      if (!el) return;
      el.style.removeProperty('--mouse-x');
      el.style.removeProperty('--mouse-y');
    }, []);

    const variants = {
      primary: 'bg-primary text-on_primary shadow-lg shadow-primary/20 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] transition-[transform,box-shadow,filter] duration-200 relative overflow-hidden',
      secondary: 'bg-secondary text-on_secondary shadow-lg shadow-secondary/20 hover:brightness-110 hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.97] transition-[transform,box-shadow,filter] duration-200 relative overflow-hidden',
      outline: 'bg-transparent border border-charcoal_border text-on_surface hover:bg-surface_container_high hover:border-primary/50 active:scale-[0.97] transition-[transform,background-color,border-color] duration-200 relative overflow-hidden',
      ghost: 'bg-transparent text-on_surface_variant hover:text-on_surface hover:bg-surface_container_high active:scale-[0.97] transition-[transform,background-color,color] duration-200 relative overflow-hidden',
      danger: 'bg-error_red/10 text-error_red border border-error_red/20 hover:bg-error_red hover:text-white hover:shadow-lg hover:shadow-error_red/20 active:scale-[0.97] transition-[transform,background-color,color,border-color,box-shadow] duration-200 relative overflow-hidden',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[12px] rounded-md',
      md: 'px-6 py-2.5 text-[14px] rounded-lg font-bold',
      lg: 'px-8 py-3.5 text-[16px] rounded-xl font-bold',
      icon: 'p-2.5 rounded-lg',
    };

    return (
      <button
        ref={buttonRef}
        disabled={disabled || isLoading}
        onMouseMove={!noRipple ? handleMouseMove : undefined}
        onMouseLeave={!noRipple ? handleMouseLeave : undefined}
        className={cn(
          'flex items-center justify-center gap-2 transition-[transform,box-shadow,filter] duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          noRipple ? '' : 'btn-ripple',
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
