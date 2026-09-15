import React from 'react';
import StateBadge from '../components/StateBadge';
import { ShortageTier, Component } from '../types';

export interface ShortageRiskData {
  facilities_by_tier: Array<{
    facility_id: string;
    facility_name: string;
    shortage_tier: ShortageTier;
    gap_units: number;
    component: Component;
    blood_group: string;
  }>;
}

const DEFAULT_DATA: ShortageRiskData = {
  facilities_by_tier: [
    { facility_id: 'FAC-02', facility_name: "St. Jude Children's Hospital", shortage_tier: 'CRITICAL', gap_units: 12, component: 'RBC', blood_group: 'O-' },
    { facility_id: 'FAC-04', facility_name: 'Regional Trauma Center', shortage_tier: 'HIGH', gap_units: 15, component: 'RBC', blood_group: 'A+' },
    { facility_id: 'FAC-03', facility_name: 'City General Hospital', shortage_tier: 'WATCH', gap_units: 8, component: 'PLATELETS', blood_group: 'B+' },
    { facility_id: 'FAC-01', facility_name: 'Metro Central Blood Bank', shortage_tier: 'STABLE', gap_units: 0, component: 'RBC', blood_group: 'O+' },
  ],
};

export default function ShortageRiskPanel({ data = DEFAULT_DATA }: { data?: ShortageRiskData }) {
  return (
    <div className="p-4 border border-rule rounded bg-paper space-y-4 shadow-xs">
      <div className="border-b border-rule pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">Shortage risk summary</h3>
          <p className="text-[11px] text-ink-mid">Facility shortage tier classification & supply gap</p>
        </div>
      </div>

      {/* Facilities table */}
      <div className="divide-y divide-rule/60 text-xs">
        {data.facilities_by_tier.map((fac) => (
          <div key={`${fac.facility_id}-${fac.blood_group}`} className="py-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-ink truncate">{fac.facility_name}</div>
              <div className="font-mono text-[11px] text-ink-mid">
                {fac.blood_group} {fac.component}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right font-mono">
                <span className="text-ink-mid text-[11px]">Gap: </span>
                <span className={fac.gap_units > 0 ? 'font-bold text-state-critical' : 'text-ink-mid'}>
                  {fac.gap_units}u
                </span>
              </div>
              <StateBadge state={fac.shortage_tier} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
