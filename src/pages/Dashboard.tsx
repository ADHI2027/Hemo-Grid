import React, { useState } from 'react';
import InventoryPanel from '../panels/InventoryPanel';
import ExpiryRiskPanel from '../panels/ExpiryRiskPanel';
import ShortageRiskPanel from '../panels/ShortageRiskPanel';
import NetworkPanel from '../panels/NetworkPanel';
import TopRecommendationPanel from '../panels/TopRecommendationPanel';
import ImpactPanel from '../panels/ImpactPanel';
import StatusChip from '../components/StatusChip';
import { RecommendationItem, Component } from '../types';

export interface ShockSimulationResponse {
  before_top_3: RecommendationItem[];
  after_top_3: RecommendationItem[];
  withdrawn: Array<{
    recommendation: RecommendationItem;
    reason: string;
    failed_codes: string[];
  }>;
}

const INITIAL_TOP_3: RecommendationItem[] = [
  {
    id: 'REC-8042',
    status: 'GENERATED',
    source_lot_id: 'LOT-2026-0814',
    source_facility_id: 'FAC-01',
    source_facility_name: 'Metro Central Blood Bank',
    dest_facility_id: 'FAC-02',
    dest_facility_name: "St. Jude Children's Hospital",
    blood_group: 'O-',
    component: 'RBC',
    units: 12,
    rescue_score: 0.88,
    transit_hours: 1.5,
    factors: { er: 0.92, sr: 0.85, feas: 0.95, cov: 0.9, damp: 0.95, gate: 1.0, contrib_er: 0.28, contrib_sr: 0.26, contrib_feas: 0.22, contrib_cov: 0.24, raw: 1.0, inputs: {} },
    explanation: { why_source: '', why_destination: '', why_quantity: '', why_now: 'Immediate transfer needed for O- RBC deficit prior to clinical peak.' },
    checks: [],
    created_at: '2026-09-15T14:30:00Z',
  },
  {
    id: 'REC-8043',
    status: 'GENERATED',
    source_lot_id: 'LOT-2026-0819',
    source_facility_id: 'FAC-05',
    source_facility_name: 'Eastside Medical Center',
    dest_facility_id: 'FAC-03',
    dest_facility_name: 'City General Hospital',
    blood_group: 'B+',
    component: 'PLATELETS',
    units: 8,
    rescue_score: 0.74,
    transit_hours: 2.0,
    factors: { er: 0.8, sr: 0.75, feas: 0.85, cov: 0.8, damp: 0.9, gate: 1.0, contrib_er: 0.24, contrib_sr: 0.22, contrib_feas: 0.2, contrib_cov: 0.2, raw: 0.86, inputs: {} },
    explanation: { why_source: '', why_destination: '', why_quantity: '', why_now: 'Prevents platelet expiration at Eastside.' },
    checks: [],
    created_at: '2026-09-15T14:32:00Z',
  },
  {
    id: 'REC-8044',
    status: 'GENERATED',
    source_lot_id: 'LOT-2026-0808',
    source_facility_id: 'FAC-01',
    source_facility_name: 'Metro Central Blood Bank',
    dest_facility_id: 'FAC-04',
    dest_facility_name: 'Regional Trauma Center',
    blood_group: 'A+',
    component: 'RBC',
    units: 15,
    rescue_score: 0.69,
    transit_hours: 1.0,
    factors: { er: 0.7, sr: 0.7, feas: 0.9, cov: 0.75, damp: 0.9, gate: 1.0, contrib_er: 0.2, contrib_sr: 0.2, contrib_feas: 0.22, contrib_cov: 0.19, raw: 0.81, inputs: {} },
    explanation: { why_source: '', why_destination: '', why_quantity: '', why_now: 'Covers trauma baseline demand.' },
    checks: [],
    created_at: '2026-09-15T14:35:00Z',
  },
];

export default function Dashboard() {
  // Demand Shock Input Controls State
  const [shockFacility, setShockFacility] = useState('FAC-02');
  const [shockGroup, setShockGroup] = useState('O-');
  const [shockComponent, setShockComponent] = useState<Component>('RBC');
  const [shockUnits, setShockUnits] = useState(25);

  const [simulationResult, setSimulationResult] = useState<ShockSimulationResponse | null>(null);

  const handleInjectShock = (e: React.FormEvent) => {
    e.preventDefault();

    // Reordered post-shock ranking simulation
    // REC-8044 climbs to #1 due to massive trauma shock demand
    // REC-8042 shifts to #2
    // REC-8043 is WITHDRAWN due to temperature/route lock after shock prioritization
    const afterTop3: RecommendationItem[] = [
      {
        ...INITIAL_TOP_3[2], // REC-8044 moves to #1
        rescue_score: 0.96,
        units: 25,
      },
      {
        ...INITIAL_TOP_3[0], // REC-8042 moves to #2
        rescue_score: 0.84,
      },
      {
        id: 'REC-8048',
        status: 'GENERATED',
        source_lot_id: 'LOT-2026-0821',
        source_facility_id: 'FAC-05',
        source_facility_name: 'Eastside Medical Center',
        dest_facility_id: 'FAC-02',
        dest_facility_name: "St. Jude Children's Hospital",
        blood_group: 'O-',
        component: 'RBC',
        units: 20,
        rescue_score: 0.79,
        transit_hours: 1.2,
        factors: { er: 0.85, sr: 0.85, feas: 0.9, cov: 0.85, damp: 0.9, gate: 1.0, contrib_er: 0.25, contrib_sr: 0.25, contrib_feas: 0.22, contrib_cov: 0.22, raw: 0.94, inputs: {} },
        explanation: { why_source: '', why_destination: '', why_quantity: '', why_now: 'Emergency surge response transfer.' },
        checks: [],
        created_at: '2026-09-15T15:00:00Z',
      },
    ];

    const result: ShockSimulationResponse = {
      before_top_3: INITIAL_TOP_3,
      after_top_3: afterTop3,
      withdrawn: [
        {
          recommendation: INITIAL_TOP_3[1], // REC-8043
          reason: 'WITHDRAWN: Transport courier re-routed to emergency demand shock at St. Jude; CHK-07 transport courier availability check failed.',
          failed_codes: ['CHK-07'],
        },
      ],
    };

    setSimulationResult(result);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="border-b border-rule pb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Operations Dashboard</h1>
          <p className="text-xs text-ink-mid mt-0.5">
            Network-level blood inventory decision support console.
          </p>
        </div>
        <div className="text-xs font-mono text-ink-mid bg-surface px-3 py-1.5 rounded border border-rule">
          System State: NORMAL • Live Feed
        </div>
      </div>

      {/* DEMAND SHOCK DEMO CONTROL */}
      <section className="p-5 border-2 border-accent rounded bg-paper space-y-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
          <div>
            <h2 className="text-base font-bold text-ink tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent inline-block" />
              Demand Shock Simulation Control
            </h2>
            <p className="text-xs text-ink-mid mt-0.5">
              Inject a sudden demand spike at a facility to evaluate network ranking reordering and recommendation withdrawals.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2.5 py-1 rounded border border-accent/30">
            DEMO MODE
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleInjectShock} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="space-y-1">
            <label htmlFor="facility-select" className="block text-xs font-semibold text-ink">Target Facility:</label>
            <select
              id="facility-select"
              value={shockFacility}
              onChange={(e) => setShockFacility(e.target.value)}
              className="w-full text-xs p-2 border border-rule rounded bg-paper text-ink font-mono focus:outline-none focus:border-accent"
            >
              <option value="FAC-02">FAC-02: St. Jude Children's</option>
              <option value="FAC-04">FAC-04: Regional Trauma Center</option>
              <option value="FAC-03">FAC-03: City General Hospital</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="group-select" className="block text-xs font-semibold text-ink">Blood Group:</label>
            <select
              id="group-select"
              value={shockGroup}
              onChange={(e) => setShockGroup(e.target.value)}
              className="w-full text-xs p-2 border border-rule rounded bg-paper text-ink font-mono focus:outline-none focus:border-accent"
            >
              <option value="O-">O- (Universal Donor)</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="component-select" className="block text-xs font-semibold text-ink">Component:</label>
            <select
              id="component-select"
              value={shockComponent}
              onChange={(e) => setShockComponent(e.target.value as Component)}
              className="w-full text-xs p-2 border border-rule rounded bg-paper text-ink font-mono focus:outline-none focus:border-accent"
            >
              <option value="RBC">RBC</option>
              <option value="PLATELETS">PLATELETS</option>
              <option value="PLASMA">PLASMA</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="units-input" className="block text-xs font-semibold text-ink">Shock Demand Units:</label>
            <input
              id="units-input"
              type="number"
              min={1}
              max={100}
              value={shockUnits}
              onChange={(e) => setShockUnits(Number(e.target.value))}
              className="w-full text-xs p-2 border border-rule rounded bg-paper text-ink font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full text-xs py-2 px-3 bg-accent text-paper font-bold rounded hover:opacity-90 transition-none shadow-xs"
            >
              Inject demand shock
            </button>
          </div>
        </form>

        {/* BEFORE / AFTER SIDE-BY-SIDE COMPARISON */}
        {simulationResult && (
          <div className="space-y-6 pt-4 border-t-2 border-rule">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                Simulation Response: Side-by-Side Top 3 Reordering
              </h3>
              <button
                type="button"
                onClick={() => setSimulationResult(null)}
                className="text-xs text-ink-mid hover:underline font-mono"
              >
                Reset simulation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* COLUMN 1: BEFORE SHOCK */}
              <div className="border-2 border-rule rounded bg-paper p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-rule pb-2">
                  <span className="font-mono text-xs font-bold text-ink-mid uppercase tracking-wide">
                    Baseline Ranking (Before)
                  </span>
                  <span className="text-[11px] font-mono text-ink-mid">Top 3</span>
                </div>
                <div className="space-y-2">
                  {simulationResult.before_top_3.map((rec, idx) => (
                    <div
                      key={rec.id}
                      className="p-3 border border-rule rounded bg-surface space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-ink-mid">
                          #{idx + 1} • {rec.id}
                        </span>
                        <span className="font-mono font-bold text-xs text-accent">
                          Score {rec.rescue_score.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-ink">
                        {rec.source_facility_name} → {rec.dest_facility_name}
                      </div>
                      <div className="text-[11px] font-mono text-ink-mid flex items-center justify-between">
                        <span>{rec.blood_group} {rec.component} ({rec.units}u)</span>
                        <StatusChip status={rec.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 2: AFTER SHOCK */}
              <div className="border-2 border-state-rescue rounded bg-state-rescue/5 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-state-rescue/40 pb-2">
                  <span className="font-mono text-xs font-bold text-state-rescue uppercase tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-state-rescue inline-block" />
                    Post-Shock Ranking (After)
                  </span>
                  <span className="text-[11px] font-mono text-state-rescue font-bold">REORDERED</span>
                </div>
                <div className="space-y-2">
                  {simulationResult.after_top_3.map((rec, idx) => {
                    const isNewOrReordered = rec.id !== simulationResult.before_top_3[idx]?.id;

                    return (
                      <div
                        key={rec.id}
                        className={`p-3 border rounded space-y-1.5 ${
                          isNewOrReordered
                            ? 'border-state-rescue bg-paper shadow-sm'
                            : 'border-rule bg-surface'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-ink">
                              #{idx + 1} • {rec.id}
                            </span>
                            {isNewOrReordered && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-state-rescue text-paper">
                                RANK CHANGED
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-xs text-state-rescue">
                            Score {rec.rescue_score.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-ink">
                          {rec.source_facility_name} → {rec.dest_facility_name}
                        </div>
                        <div className="text-[11px] font-mono text-ink-mid flex items-center justify-between">
                          <span>{rec.blood_group} {rec.component} ({rec.units}u)</span>
                          <StatusChip status={rec.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* WITHDRAWN RECOMMENDATIONS SECTION */}
            <div className="border-2 border-state-critical rounded bg-state-critical/10 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-state-critical/30 pb-2">
                <h4 className="text-xs font-bold text-state-critical font-mono uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-state-critical inline-block" />
                  Withdrawn Recommendations ({simulationResult.withdrawn.length})
                </h4>
                <span className="text-[11px] font-mono text-state-critical font-bold">
                  SAFETY WITHDRAWAL LOG
                </span>
              </div>

              <div className="space-y-2">
                {simulationResult.withdrawn.map((item) => (
                  <div
                    key={item.recommendation.id}
                    className="p-3 rounded bg-paper border border-state-critical/40 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-1.5">
                      <div className="text-xs font-bold text-ink">
                        {item.recommendation.id}: {item.recommendation.source_facility_name} → {item.recommendation.dest_facility_name}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.failed_codes.map((code) => (
                          <span key={code} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-state-critical text-paper">
                            FAILED: {code}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-mono text-state-critical font-semibold leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SIX DASHBOARD PANELS COMPOSED */}
      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          Network Operations Overview
        </h2>

        {/* Row 1: Top Priority Card + Impact Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopRecommendationPanel />
          <ImpactPanel />
        </div>

        {/* Row 2: Inventory Panel + Expiry Risk Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryPanel />
          <ExpiryRiskPanel />
        </div>

        {/* Row 3: Shortage Risk Panel + Network Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShortageRiskPanel />
          <NetworkPanel />
        </div>
      </section>
    </div>
  );
}
