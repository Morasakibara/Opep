'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  wide,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-gutter md:p-lg bg-background/80 backdrop-blur-md">
      <div className={`glass-panel-floating w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-3xl p-lg relative transform scale-95 transition-transform duration-300 overflow-y-auto max-h-[80vh]`}>
        <div className="flex justify-between items-center mb-lg">
          <div>
            <h2 className="font-title-md text-primary">{title}</h2>
            {description && <p className="text-on-surface-variant text-body-md">{description}</p>}
          </div>
          <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
        {footer && <div className="mt-lg">{footer}</div>}
      </div>
    </div>
  );
}
