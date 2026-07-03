import React, { useState } from 'react';

interface ApiErrorProps {
  message: string;
  /** Shows a dismiss (X) button */
  dismissible?: boolean;
  /** Extra className */
  className?: string;
}

export default function ApiError({ message, dismissible = false, className = '' }: ApiErrorProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={`mx-4 mt-4 p-4 bg-error_container/20 border border-error_red/30 rounded-xl ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-error text-sm font-bold">Erreur</p>
          <p className="text-on_surface_variant text-xs mt-1 break-words">{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="text-on_surface_variant hover:text-error transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
