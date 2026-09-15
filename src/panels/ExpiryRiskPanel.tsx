import React from 'react';
import StateBadge from '../components/StateBadge';
import { WindowState, Component } from '../types';

export interface ExpiryRiskData {
  by_state: Record<WindowState, number>;
  top_at_risk_lots: Array<{
    lot_id: string;
    facility_name: string;
    blood_group: string;
    component: Component;
    units: number;
    days_remaining: number;
    window_state: WindowState;
  }>;
}

const DEFAULT_DATA: ExpiryRiskData = {
  by_state: {
    NORMAL: 320,
    WATCH: 45,
    RESCUE_WINDOW: 18,
    UNRESCUABLE: 6,
  },
  top_at_risk_lots: [
    { lot_id: 'LOT-2026-0814', facility_name: 'Metro Central', blood_group: 'O-', component: 'RBC', units: 12, days_remaining: 2, window_state: 'RESCUE_WINDOW' },
    { lot_id: 'LOT-2026-0819', facility_name: 'Eastside Medical', blood_group: 'A+', component: 'PLATELETS', units: 6, days_remaining: 1, window_state: 'RESCUE_WINDOW' },
    { lot_id: 'LOT-2026-0802', facility_name: 'City General', blood_group: 'B-', component: 'RBC', units: 8, days_remaining: 4, window_state: 'WATCH' },
  ],
};

export default function ExpiryRiskPanel({ data = DEFAULT_DATA }: { data?: ExpiryRiskData }) {
  return (
    <div className="p-4 border border-rule rounded bg-paper space-y-4 shadow-xs">
      <div className="border-b border-rule pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">Expiry risk summary</h3>
          <p className="text-[11px] text-ink-mid">Units categorized by expiration window state</p>
        </div>
      </div>

      {/* State breakdown counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2 rounded bg-surface border border-rule flex flex-col items-center justify-between gap-1">
          <StateBadge state="NORMAL" />
          <span className="font-mono font-bold text-xs text-ink">{data.by_state.NORMAL}u</span>
        </div>
        <div className="p-2 rounded bg-surface border border-rule flex flex-col items-center justify-between gap-1">
          <StateBadge state="WATCH" />
          <span className="font-mono font-bold text-xs text-ink">{data.by_state.WATCH}u</span>
        </div>
        <div className="p-2 rounded bg-state-rescue/10 border border-state-rescue flex flex-col items-center justify-between gap-1">
          <StateBadge state="RESCUE_WINDOW" />
          <span className="font-mono font-bold text-xs text-state-rescue">{data.by_state.RESCUE_WINDOW}u</span>
        </div>
        <div className="p-2 rounded bg-surface border border-rule flex flex-col items-center justify-between gap-1">
          <StateBadge state="UNRESCUABLE" />
          <span className="font-mono font-bold text-xs text-state-critical">{data.by_state.UNRESCUABLE}u</span>
        </div>
      </div>

      {/* Top at-risk lots list */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">Top at-risk lots</div>
        <div className="divide-y divide-rule/60 text-xs">
          {data.top_at_risk_lots.map((lot) => (
            <div key={lot.lot_id} className="py-2 flex items-center justify-between gap-2">
              <div>
                <div className="font-medium text-ink flex items-center gap-1.5">
                  <span>{lot.facility_name}</span>
                  <span className="font-mono text-ink-mid">({lot.blood_group} {lot.component})</span>
                </div>
                <div className="font-mono text-[11px] text-ink-mid">
                  Lot {lot.lot_id} • {lot.days_remaining}d remaining
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-ink">{lot.units}u</span>
                <StateBadge state={lot.window_state} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
