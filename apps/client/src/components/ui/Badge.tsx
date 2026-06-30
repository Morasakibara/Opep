interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
}

const VARIANTS: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
};

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-bold uppercase ${VARIANTS[variant]} ${
      size === 'sm' ? 'px-2 py-0.5 text-[10px] rounded-full' : 'px-3 py-1 text-xs rounded-lg'
    }`}>
      {label}
    </span>
  );
}
