import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ 
  icon, 
  title = 'Aucune donnée', 
  message = 'Aucun élément trouvé.',
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        {icon || <Inbox size={32} className="text-gray-400" />}
      </div>
      <h3 className="text-lg font-bold text-neutre-dark mb-2">{title}</h3>
      <p className="text-sm text-neutre-mid text-center max-w-md">{message}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-blue-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
