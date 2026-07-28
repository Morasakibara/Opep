'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={20} />,
  error: <AlertCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertTriangle size={20} />,
};

const COLORS: Record<ToastType, string> = {
  success: 'bg-success_green/10 border-success_green/30 text-success_green',
  error: 'bg-error_red/10 border-error_red/30 text-error_red',
  info: 'bg-primary/10 border-primary/30 text-primary',
  warning: 'bg-warning_yellow/10 border-warning_yellow/30 text-warning_yellow',
};

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastIdCounter}`;
    const duration = toast.duration ?? 4000;
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 6000 });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message, duration: 5000 });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Container - fixed position bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <AnimatedMount
            key={toast.id}
            animation="slide-up"
            durationMs={300}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-md min-w-[320px] max-w-[420px] ${COLORS[toast.type]}`}
          >
            <div className="flex-shrink-0 mt-0.5">{ICONS[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{toast.title}</p>
              {toast.message && (
                <p className="text-xs mt-1 opacity-80">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X size={16} />
            </button>
          </AnimatedMount>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    if (typeof window === 'undefined') {
      // SSR fallback
      return {
        toasts: [],
        addToast: () => {},
        removeToast: () => {},
        success: () => {},
        error: () => {},
        info: () => {},
        warning: () => {},
      };
    }
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
