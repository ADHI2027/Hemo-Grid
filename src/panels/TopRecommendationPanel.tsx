import React from 'react';
import { Link } from 'react-router-dom';
import StatusChip from '../components/StatusChip';
import { RecommendationItem } from '../types';

const DEFAULT_RECOMMENDATION: RecommendationItem = {
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
  factors: {
    er: 0.92,
    sr: 0.85,
    feas: 0.95,
    cov: 0.9,
    damp: 0.95,
    gate: 1.0,
    contrib_er: 0.28,
    contrib_sr: 0.26,
    contrib_feas: 0.22,
    contrib_cov: 0.24,
    raw: 1.0,
    inputs: {},
  },
  explanation: {
    why_source: 'Source facility Metro Central has 12 units of O- RBC expiring in 8 days with excess surplus.',
    why_destination: 'Destination St. Jude Hospital has a projected critical shortage of O- RBC within 48 hours.',
    why_quantity: 'Transfer quantity of 12 units completely fulfills the destination deficit without creating a deficit at source.',
    why_now: 'Transit window requires immediate dispatch to arrive prior to peak clinical demand schedule.',
  },
  checks: [],
  created_at: '2026-09-15T14:30:00Z',
};

export default function TopRecommendationPanel({
  recommendation = DEFAULT_RECOMMENDATION,
}: {
  recommendation?: RecommendationItem;
}) {
  return (
    <div className="p-4 border-2 border-accent rounded bg-paper space-y-4 shadow-sm relative">
      <div className="flex items-center justify-between border-b border-rule pb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-accent text-paper font-mono font-bold text-xs">
            RANK #1
          </span>
          <h3 className="text-sm font-bold text-ink tracking-tight">Top priority recommendation</h3>
        </div>
        <StatusChip status={recommendation.status} />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-base font-bold text-ink flex items-center gap-1.5">
            <span>{recommendation.source_facility_name}</span>
            <span className="text-accent font-mono">→</span>
            <span>{recommendation.dest_facility_name}</span>
          </div>
          <div className="font-mono text-xs text-ink-mid mt-0.5">
            {recommendation.blood_group} {recommendation.component} • <strong className="text-ink">{recommendation.units} units</strong> • {recommendation.transit_hours}h transit
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-mono text-ink-mid uppercase">Rescue score</div>
          <div className="text-xl font-mono font-bold text-accent">
            {recommendation.rescue_score.toFixed(2)}
          </div>
        </div>
      </div>

      {/* One explanation line */}
      <div className="p-2.5 rounded bg-surface border border-rule text-xs text-ink leading-relaxed">
        <strong className="font-mono text-[11px] text-accent uppercase font-bold mr-1">Rationale:</strong>
        {recommendation.explanation.why_now}
      </div>

      <div className="text-right pt-1">
        <Link
          to={`/recommendations/${recommendation.id}`}
          className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
        >
          Review recommendation details →
        </Link>
      </div>
    </div>
  );
}
