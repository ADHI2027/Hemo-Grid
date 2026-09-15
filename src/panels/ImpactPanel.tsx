import React from 'react';

export interface ImpactData {
  addressable_units: number;
  coverable_gaps: number;
}

const DEFAULT_DATA: ImpactData = {
  addressable_units: 35,
  coverable_gaps: 27,
};

export default function ImpactPanel({ data = DEFAULT_DATA }: { data?: ImpactData }) {
  return (
    <div className="p-4 border border-rule rounded bg-paper space-y-4 shadow-xs">
      <div className="border-b border-rule pb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">Potential network impact</h3>
          <p className="text-[11px] text-ink-mid">Rescuable units and deficit coverage potential</p>
        </div>
        {/* MANDATORY VISIBLE TEXT LABEL */}
        <span className="text-[11px] font-mono text-ink-mid bg-surface px-2 py-0.5 rounded border border-rule">
          Simulated — not a guaranteed result
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded bg-state-normal/10 border border-state-normal/30 space-y-1">
          <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">
            Addressable Units
          </div>
          <div className="text-2xl font-mono font-bold text-state-normal">
            {data.addressable_units}u
          </div>
          <div className="text-[10px] text-ink-mid">Potential waste prevented</div>
        </div>

        <div className="p-3 rounded bg-accent/10 border border-accent/30 space-y-1">
          <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">
            Coverable Gaps
          </div>
          <div className="text-2xl font-mono font-bold text-accent">
            {data.coverable_gaps}u
          </div>
          <div className="text-[10px] text-ink-mid">Hospital deficits resolved</div>
        </div>
      </div>
    </div>
  );
}
