import React from 'react';

export interface NetworkPanelData {
  facilities: Array<{
    facility_id: string;
    facility_name: string;
    surplus_units: number;
    need_units: number;
    component: string;
  }>;
}

const DEFAULT_DATA: NetworkPanelData = {
  facilities: [
    { facility_id: 'FAC-01', facility_name: 'Metro Central Blood Bank', surplus_units: 42, need_units: 0, component: 'RBC / O-' },
    { facility_id: 'FAC-05', facility_name: 'Eastside Medical Center', surplus_units: 28, need_units: 0, component: 'Platelets / A+' },
    { facility_id: 'FAC-03', facility_name: 'City General Hospital', surplus_units: 5, need_units: 8, component: 'Platelets / B+' },
    { facility_id: 'FAC-04', facility_name: 'Regional Trauma Center', surplus_units: 0, need_units: 15, component: 'RBC / A+' },
    { facility_id: 'FAC-02', facility_name: "St. Jude Children's Hospital", surplus_units: 0, need_units: 12, component: 'RBC / O-' },
  ],
};

export default function NetworkPanel({ data = DEFAULT_DATA }: { data?: NetworkPanelData }) {
  return (
    <div className="p-4 border border-rule rounded bg-paper space-y-4 shadow-xs">
      <div className="border-b border-rule pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink tracking-tight">Network balancing</h3>
          <p className="text-[11px] text-ink-mid">Facility surplus and clinical need distribution</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-rule font-mono text-ink-mid text-[11px] uppercase">
              <th className="py-1.5 px-2 font-semibold">Facility</th>
              <th className="py-1.5 px-2 font-semibold text-right text-state-normal">Surplus</th>
              <th className="py-1.5 px-2 font-semibold text-right text-state-critical">Need</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/50">
            {data.facilities.map((fac) => (
              <tr key={fac.facility_id} className="hover:bg-surface/50">
                <td className="py-2 px-2">
                  <div className="font-semibold text-ink">{fac.facility_name}</div>
                  <div className="font-mono text-[10px] text-ink-mid">{fac.component}</div>
                </td>
                <td className="py-2 px-2 text-right font-mono font-bold text-state-normal">
                  {fac.surplus_units > 0 ? `+${fac.surplus_units}u` : '0u'}
                </td>
                <td className="py-2 px-2 text-right font-mono font-bold text-state-critical">
                  {fac.need_units > 0 ? `-${fac.need_units}u` : '0u'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
