'use client';

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { Globe } from 'lucide-react';

const DATA = [
  { name: 'Center (Yaoundé)', value: 42, color: '#79d8b7' },
  { name: 'Littoral (Douala)', value: 38, color: '#ffb3ae' },
  { name: 'West (Bafoussam)', value: 15, color: '#ecc300' },
  { name: 'Others', value: 5, color: '#333538' },
];

export default function RegionalActivity() {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-charcoal_border bg-surface_container/50">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[18px] font-bold text-on_surface">Regional Activity</h3>
          <span className="text-on_surface_variant text-[14px]">Cameroon Network</span>
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
                  backgroundColor: '#1e2023', 
                  border: '1px solid #2D343F', 
                  borderRadius: '12px',
                  color: '#e2e2e6' 
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

      <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none w-64 h-64 text-on_surface_variant">
        <Globe size={200} />
      </div>
    </div>
  );
}
