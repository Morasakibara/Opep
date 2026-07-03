'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

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
    <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col border border-charcoal_border bg-surface_container/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[18px] font-bold text-on_surface">Revenue Growth</h3>
          <p className="text-[14px] text-on_surface_variant">Monthly platform transaction volume (Millions FCFA)</p>
        </div>
        <select className="bg-surface_container_high border border-charcoal_border rounded-lg text-[14px] px-4 py-2 outline-none focus:border-primary cursor-pointer text-on_surface">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#79d8b7" stopOpacity={1} />
                <stop offset="100%" stopColor="#79d8b7" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D343F" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#bdc9c2', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#bdc9c2', fontSize: 10 }}
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#1e2023', 
                border: '1px solid #2D343F', 
                borderRadius: '12px',
                color: '#e2e2e6' 
              }}
              itemStyle={{ color: '#79d8b7', fontWeight: 'bold' }}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]} 
              barSize={40}
            >
              {DATA.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === 'APR' ? '#79d8b7' : 'rgba(121, 216, 183, 0.2)'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
