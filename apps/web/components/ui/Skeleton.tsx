import React from 'react';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** Base animated skeleton block */
function SkeletonBlock({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`shimmer-loading ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a card (glass-card shaped) */
export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 space-y-4 ${className}`}>
      <div className="flex justify-between items-start">
        <SkeletonBlock className="w-12 h-12 rounded-xl" />
        <SkeletonBlock className="w-16 h-5 rounded-full" />
      </div>
      <SkeletonBlock className="w-3/4 h-5 rounded-lg" />
      <SkeletonBlock className="w-1/2 h-4 rounded-lg" />
      <div className="pt-4 border-t border-charcoal_border">
        <div className="flex gap-4">
          <SkeletonBlock className="w-20 h-4 rounded-lg" />
          <SkeletonBlock className="w-20 h-4 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a table row */
export function SkeletonTableRow({ columns = 5, className = '' }: { columns?: number; className?: string }) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <SkeletonBlock className={`h-4 rounded-lg ${i === 0 ? 'w-24' : i === 1 ? 'w-32' : i === 2 ? 'w-40' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a text block (multiple lines) */
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={`h-4 rounded-lg ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

/** Skeleton for a chart (bar chart shape) */
export function SkeletonChart({ className = '' }: SkeletonProps) {
  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <SkeletonBlock className="w-40 h-5 rounded-lg" />
          <SkeletonBlock className="w-56 h-4 rounded-lg" />
        </div>
        <SkeletonBlock className="w-32 h-8 rounded-lg" />
      </div>
      <div className="flex items-end gap-3 h-64">
        {[70, 45, 60, 90, 55, 75].map((h, i) => (
          <SkeletonBlock key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

/** Skeleton for stat cards grid (4 cards) */
export function SkeletonStatsGrid({ className = '' }: SkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="w-12 h-12 rounded-xl" />
            <SkeletonBlock className="w-16 h-5 rounded-full" />
          </div>
          <SkeletonBlock className="w-20 h-3 rounded-lg" />
          <SkeletonBlock className="w-3/4 h-7 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for the full dashboard page */
export function DashboardSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="space-y-2">
        <SkeletonBlock className="w-48 h-7 rounded-lg" />
        <SkeletonBlock className="w-72 h-4 rounded-lg" />
      </div>
      <SkeletonStatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonChart className="lg:col-span-2" />
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <SkeletonBlock className="w-32 h-5 rounded-lg" />
          <SkeletonBlock className="w-full h-64 rounded-xl" />
        </div>
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the buses page (grid of bus cards) */
export function BusesSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock className="w-56 h-7 rounded-lg" />
          <SkeletonBlock className="w-64 h-4 rounded-lg" />
        </div>
        <SkeletonBlock className="w-40 h-12 rounded-xl" />
      </div>
      <div className="flex gap-4">
        <SkeletonBlock className="flex-1 max-w-md h-10 rounded-xl" />
        <SkeletonBlock className="w-[180px] h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the trips page (tabs + routes grid) */
export function TripsSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock className="w-56 h-7 rounded-lg" />
          <SkeletonBlock className="w-64 h-4 rounded-lg" />
        </div>
        <SkeletonBlock className="w-40 h-12 rounded-xl" />
      </div>
      <SkeletonBlock className="w-80 h-10 rounded-xl" />
      <div className="flex gap-4">
        <SkeletonBlock className="flex-1 max-w-md h-10 rounded-xl" />
        <SkeletonBlock className="w-[140px] h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <SkeletonBlock className="w-2 h-2 rounded-full" />
              <SkeletonBlock className="w-0.5 h-6" />
              <SkeletonBlock className="w-2 h-2 rounded-full" />
            </div>
            <div className="space-y-2">
              <SkeletonBlock className="w-1/2 h-5 rounded-lg" />
              <SkeletonBlock className="w-1/3 h-4 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal_border">
              <SkeletonBlock className="w-16 h-4 rounded-lg" />
              <SkeletonBlock className="w-16 h-4 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the reservations page (search + table) */
export function ReservationsSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock className="w-56 h-7 rounded-lg" />
          <SkeletonBlock className="w-64 h-4 rounded-lg" />
        </div>
        <SkeletonBlock className="w-36 h-10 rounded-xl" />
      </div>
      <SkeletonBlock className="w-full h-16 rounded-2xl" />
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr>{[1, 2, 3, 4, 5, 6].map((_, i) => (<th key={i} className="px-6 py-4"><SkeletonBlock className="w-16 h-4 rounded-lg" /></th>))}</tr></thead>
            <tbody className="divide-y divide-charcoal_border">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={6} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-charcoal_border">
          <SkeletonBlock className="w-40 h-4 rounded-lg" />
        </div>
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the employees page (stats + search + table) */
export function EmployeesSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock className="w-48 h-7 rounded-lg" />
          <SkeletonBlock className="w-64 h-4 rounded-lg" />
        </div>
        <SkeletonBlock className="w-36 h-12 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 space-y-3">
            <SkeletonBlock className="w-16 h-4 rounded-lg" />
            <SkeletonBlock className="w-20 h-8 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-charcoal_border">
          <SkeletonBlock className="w-72 h-10 rounded-xl" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr>{[1, 2, 3, 4, 5].map((_, i) => (<th key={i} className="px-6 py-4"><SkeletonBlock className="w-16 h-4 rounded-lg" /></th>))}</tr></thead>
            <tbody className="divide-y divide-charcoal_border">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonTableRow key={i} columns={5} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the reports page (KPI grid + charts) */
export function ReportsSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock className="w-64 h-7 rounded-lg" />
          <SkeletonBlock className="w-72 h-4 rounded-lg" />
        </div>
        <SkeletonBlock className="w-40 h-10 rounded-xl" />
      </div>
      <SkeletonStatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonChart />
        <div className="glass-card rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <SkeletonBlock className="w-48 h-5 rounded-lg" />
            <SkeletonBlock className="w-6 h-6 rounded-lg" />
          </div>
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <SkeletonBlock className="w-32 h-4 rounded-lg" />
                <SkeletonBlock className="w-12 h-4 rounded-lg" />
              </div>
              <SkeletonBlock className="w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the settings page (sidebar + form) */
export function SettingsSkeleton() {
  return (
    <AnimatedMount animation="fade" className="space-y-8 duration-300">
      <div className="space-y-2">
        <SkeletonBlock className="w-48 h-7 rounded-lg" />
        <SkeletonBlock className="w-64 h-4 rounded-lg" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 space-y-2">
          {[1, 2, 3, 4].map((_, i) => (
            <SkeletonBlock key={i} className="w-full h-12 rounded-xl" />
          ))}
        </div>
        <div className="flex-1 glass-card rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-6">
            <SkeletonBlock className="w-24 h-24 rounded-2xl" />
            <div className="space-y-2">
              <SkeletonBlock className="w-40 h-5 rounded-lg" />
              <SkeletonBlock className="w-56 h-4 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBlock className="w-24 h-4 rounded-lg" />
                <SkeletonBlock className="w-full h-12 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <SkeletonBlock className="w-36 h-12 rounded-xl" />
          </div>
        </div>
      </div>
    </AnimatedMount>
  );
}

/** Skeleton for the scanner page (camera + result panel) */
export function ScannerSkeleton() {
  return (
    <AnimatedMount animation="fade" className="max-w-5xl mx-auto space-y-8 duration-300">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <SkeletonBlock className="w-56 h-7 rounded-lg" />
          <SkeletonBlock className="w-64 h-4 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <SkeletonBlock className="w-28 h-8 rounded-xl" />
          <SkeletonBlock className="w-20 h-8 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-3xl overflow-hidden aspect-square lg:aspect-[4/3]">
          <div className="w-full h-full bg-surface flex flex-col items-center justify-center p-6">
            <SkeletonBlock className="w-16 h-16 rounded-2xl mb-4" />
            <SkeletonBlock className="w-40 h-5 rounded-lg mb-2" />
            <SkeletonBlock className="w-56 h-4 rounded-lg mb-6" />
            <SkeletonBlock className="w-32 h-12 rounded-xl" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 space-y-6">
            <SkeletonBlock className="w-24 h-8 rounded-full" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <SkeletonBlock className="w-20 h-4 rounded-lg" />
                  <SkeletonBlock className="w-32 h-4 rounded-lg" />
                </div>
              ))}
            </div>
            <SkeletonBlock className="w-full h-12 rounded-xl" />
          </div>
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="w-5 h-5 rounded-lg" />
              <SkeletonBlock className="w-32 h-5 rounded-lg" />
            </div>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <SkeletonBlock className="w-24 h-3 rounded-lg" />
                  <SkeletonBlock className="w-40 h-2 rounded-lg" />
                </div>
                <SkeletonBlock className="w-12 h-3 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedMount>
  );
}

export default SkeletonBlock;
