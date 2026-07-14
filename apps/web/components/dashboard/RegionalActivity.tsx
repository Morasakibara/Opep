'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Globe } from 'lucide-react';

const DATA = [
  { name: 'Centre (Yaoundé)', value: 42, color: 'var(--color-primary)' },
  { name: 'Littoral (Douala)', value: 38, color: 'var(--color-secondary)' },
  { name: 'Ouest (Bafoussam)', value: 15, color: 'var(--color-tertiary)' },
  { name: 'Autres', value: 5, color: 'var(--color-surface-container-highest)' },
];

export default function RegionalActivity() {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[18px] font-bold text-on_surface">Activité Régionale</h3>
          <span className="text-on_surface_variant text-[14px]">Réseau Cameroun</span>
        </div>
        
        <div className="flex-1 min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-surface-container)', 
                  border: '1px solid var(--color-charcoal-border)', 
                  borderRadius: '12px',
                  color: 'var(--color-on-surface)' 
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                formatter={(value) => <span className="text-[12px] text-on_surface_variant font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none w-64 h-64 text-on_surface_variant">
        <Globe size={200} />
      </div>
    </div>
  );
}
