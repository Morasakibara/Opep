import React from 'react';
import { FileText, Table as TableIcon, RefreshCw, Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const EXPORTS = [
  { 
    name: 'Q3_Revenue_Final.pdf', 
    type: 'pdf', 
    size: '2.4 MB', 
    source: 'Douala Hub', 
    status: 'Ready',
    icon: <FileText size={24} className="text-error_red" />,
    bg: 'bg-error_red/10'
  },
  { 
    name: 'Manifest_OCT_23.xlsx', 
    type: 'excel', 
    size: '850 KB', 
    source: 'All Branches', 
    status: 'Ready',
    icon: <TableIcon size={24} className="text-primary" />,
    bg: 'bg-primary/10'
  },
  { 
    name: 'Route_Efficiency_Q4.csv', 
    type: 'csv', 
    size: 'Estimating...', 
    source: 'Processing', 
    status: 'Processing',
    icon: <RefreshCw size={24} className="text-on_surface_variant animate-spin" />,
    bg: 'bg-surface_container_highest',
    dimmed: true
  }
];

export default function RecentExports() {
  return (
    <section className="glass-card rounded-[24px] p-8 h-full border border-charcoal_border bg-surface_container/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[18px] font-bold text-on_surface">Recent Exports</h3>
        <button className="text-primary hover:underline text-[12px] font-bold uppercase tracking-widest">View All</button>
      </div>

      <div className="space-y-6">
        {EXPORTS.map((exp, idx) => (
          <div 
            key={idx} 
            className={`p-4 bg-surface_container_low border border-charcoal_border rounded-2xl flex gap-4 hover:border-primary transition-all group ${exp.dimmed ? 'opacity-60' : ''}`}
          >
            <div className={`w-12 h-12 ${exp.bg} rounded-xl flex items-center justify-center`}>
              {exp.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-bold text-on_surface truncate pr-2">{exp.name}</p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${exp.status === 'Ready' ? 'bg-primary/20 text-primary' : 'bg-surface_container_highest text-on_surface_variant'}`}>
                  {exp.status}
                </span>
              </div>
              <p className="text-[11px] text-on_surface_variant mt-1">{exp.size} • {exp.source}</p>
              
              {!exp.dimmed && (
                <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[11px] text-primary font-bold flex items-center gap-1.5 hover:underline">
                    <Download size={14} /> Download
                  </button>
                  <button className="text-[11px] text-on_surface_variant font-bold flex items-center gap-1.5 hover:underline">
                    <Share2 size={14} /> Share
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="p-6 mt-8 border-2 border-dashed border-charcoal_border rounded-3xl flex flex-col items-center text-center bg-surface_container/20">
          <div className="w-16 h-16 rounded-full bg-surface_container_high flex items-center justify-center mb-4 shadow-inner">
            <Sparkles size={32} className="text-primary" />
          </div>
          <h4 className="font-bold text-on_surface mb-1">Smart Analytics Insight</h4>
          <p className="text-[11px] text-on_surface_variant leading-relaxed">
            The export tool suggests 'Passenger Manifests' are typically generated on Fridays for the Douala branch.
          </p>
          <Button variant="outline" size="sm" className="mt-6 rounded-full">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
