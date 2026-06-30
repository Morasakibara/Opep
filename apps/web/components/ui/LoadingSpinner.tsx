import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

export function LoadingSpinner({ size = 24, text = 'Chargement...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 size={size} className="text-primary animate-spin" />
      <p className="mt-4 text-sm text-neutre-mid font-medium">{text}</p>
    </div>
  );
}

export function PageSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl w-full" />
      ))}
    </div>
  );
}
