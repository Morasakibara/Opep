'use client';

import React from 'react';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: { direction: 'up' | 'down' | 'stable'; text: string };
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning';
  accentBorder?: boolean;
  progressBar?: { value: number; max: number };
}

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', bar: 'bg-secondary' },
  tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary', bar: 'bg-tertiary' },
  success: { bg: 'bg-success-green/10', text: 'text-success-green', bar: 'bg-success-green' },
  warning: { bg: 'bg-warning-yellow/10', text: 'text-warning-yellow', bar: 'bg-warning-yellow' },
};

export default function StatsCard({
  icon,
  label,
  value,
  trend,
  color = 'primary',
  accentBorder,
  progressBar,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`glass-panel p-gutter rounded-2xl flex flex-col justify-between h-32 ${accentBorder ? `border-l-2 border-${color}` : ''}`}>
      <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
      <div className="flex items-end justify-between">
        <span className="text-display-lg font-bold text-on-surface leading-none">{value}</span>
        {trend && (
          <div className={`flex items-center ${colors.text} text-label-sm font-bold px-2 py-0.5 rounded-full ${colors.bg}`}>
            <span className="material-symbols-outlined text-[14px]">
              {trend.direction === 'up' ? 'trending_up' : trend.direction === 'down' ? 'trending_down' : 'trending_flat'}
            </span>
            {trend.text}
          </div>
        )}
      </div>
      {progressBar && (
        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mt-2">
          <div className={`h-full ${colors.bar}`} style={{ width: `${(progressBar.value / progressBar.max) * 100}%` }} />
        </div>
      )}
    </div>
  );
}
