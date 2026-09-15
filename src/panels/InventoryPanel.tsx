import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export interface InventoryData {
  totals: {
    RBC: number;
    PLATELETS: number;
    PLASMA: number;
  };
  by_group: Array<{ group: string; units: number }>;
}

const DEFAULT_DATA: InventoryData = {
  totals: { RBC: 340, PLATELETS: 85, PLASMA: 190 },
  by_group: [
    { group: 'O+', units: 180 },
    { group: 'O-', units: 45 },
    { group: 'A+', units: 150 },
    { group: 'A-', units: 40 },
    { group: 'B+', units: 110 },
    { group: 'B-', units: 25 },
    { group: 'AB+', units: 45 },
    { group: 'AB-', units: 20 },
  ],
};

export default function InventoryPanel({ data = DEFAULT_DATA }: { data?: InventoryData }) {
  return (
    <div className="p-4 border border-rule rounded bg-paper space-y-4 shadow-xs">
      <div className="border-b border-rule pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">Inventory summary</h3>
          <p className="text-[11px] text-ink-mid">Current total units by component & blood group</p>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded bg-surface border border-rule">
          <div className="text-[10px] font-mono text-ink-mid uppercase">RBC</div>
          <div className="text-lg font-mono font-bold text-accent">{data.totals.RBC}u</div>
        </div>
        <div className="p-2 rounded bg-surface border border-rule">
          <div className="text-[10px] font-mono text-ink-mid uppercase">Platelets</div>
          <div className="text-lg font-mono font-bold text-accent">{data.totals.PLATELETS}u</div>
        </div>
        <div className="p-2 rounded bg-surface border border-rule">
          <div className="text-[10px] font-mono text-ink-mid uppercase">Plasma</div>
          <div className="text-lg font-mono font-bold text-accent">{data.totals.PLASMA}u</div>
        </div>
      </div>

      {/* Bar Chart by Blood Group */}
      <div className="h-40 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.by_group} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="group" tick={{ fontSize: 10, fill: '#5A626A' }} />
            <YAxis tick={{ fontSize: 10, fill: '#5A626A' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1D20', borderColor: '#2D3238', borderRadius: 4, color: '#E6E9EC', fontSize: 11 }}
            />
            <Bar dataKey="units" fill="#0B6E7F" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
