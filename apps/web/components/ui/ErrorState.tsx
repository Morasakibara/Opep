import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Erreur', 
  message = 'Une erreur est survenue. Réessayez plus tard.',
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-error_container rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-error" />
      </div>
      <h3 className="text-lg font-bold text-on_surface mb-2">{title}</h3>
      <p className="text-sm text-on_surface_variant text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
        >
          <RefreshCw size={16} />
          <span>Réessayer</span>
        </button>
      )}
    </div>
  );
}
