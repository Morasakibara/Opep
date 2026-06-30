export function LoadingSpinner({ size = 24, text = 'Chargement...' }: { size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg 
        width={size} height={size} 
        className="animate-spin text-primary" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
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
