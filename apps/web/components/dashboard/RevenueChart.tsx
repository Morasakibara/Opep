'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DATA = [
  { name: 'JAN', value: 18 },
  { name: 'FEB', value: 22 },
  { name: 'MAR', value: 20 },
  { name: 'APR', value: 28 },
  { name: 'MAY', value: 25 },
  { name: 'JUN', value: 27 },
];

export default function RevenueChart() {
  return (
    <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[18px] font-bold text-on_surface">Croissance des Revenus</h3>
          <p className="text-[14px] text-on_surface_variant">Volume mensuel des transactions (Millions FCFA)</p>
        </div>
        <select className="bg-surface_container_high border border-charcoal_border rounded-lg text-[14px] px-4 py-2 outline-none focus:border-primary cursor-pointer text-on_surface">
          <option>6 derniers mois</option>
          <option>12 derniers mois</option>
        </select>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-charcoal-border)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-surface-container)', 
                border: '1px solid var(--color-charcoal-border)', 
                borderRadius: '12px',
                color: 'var(--color-on-surface)' 
              }}
              itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {DATA.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === 'APR' ? 'var(--color-primary)' : 'color-mix(in srgb, var(--color-primary) 20%, transparent)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
