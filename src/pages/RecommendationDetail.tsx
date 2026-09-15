import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusChip from '../components/StatusChip';
import ScoreBar from '../components/ScoreBar';
import GateChecklist from '../components/GateChecklist';
import { RecommendationItem, RecStatus } from '../types';

export interface ReviewLogItem {
  id: string;
  status: RecStatus;
  note?: string;
  timestamp: string;
}

export interface CounterfactualData {
  do_nothing: {
    units_wasted: number;
    shortage_unmet: number;
    description: string;
  };
  act: {
    units_wasted: number;
    shortage_unmet: number;
    description: string;
  };
  delta: {
    units_saved: number;
    shortage_covered: number;
  };
}

interface RecommendationDetailProps {
  recommendation?: RecommendationItem;
  counterfactual?: CounterfactualData;
  reviewLogs?: ReviewLogItem[];
  onReviewAction?: (newStatus: RecStatus, note?: string) => void;
}

export default function RecommendationDetail({
  recommendation: propRec,
  counterfactual: propCounterfactual,
  reviewLogs: propReviewLogs,
  onReviewAction,
}: RecommendationDetailProps) {
  const { id } = useParams<{ id: string }>();

  // Inline state for reject note dialog (no external modal library)
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  // Fallback demo object if no prop passed
  const rec: RecommendationItem = propRec || {
    id: id || 'REC-8042',
    status: 'GENERATED',
    source_lot_id: 'LOT-2026-0814',
    source_facility_id: 'FAC-01',
    source_facility_name: 'Metro Central Blood Bank',
    dest_facility_id: 'FAC-04',
    dest_facility_name: 'St. Jude Children\'s Hospital',
    blood_group: 'O-',
    component: 'RBC',
    units: 12,
    rescue_score: 0.88,
    transit_hours: 1.5,
    factors: {
      er: 0.92,
      sr: 0.85,
      feas: 0.95,
      cov: 0.90,
      damp: 0.95,
      gate: 1.0,
      contrib_er: 0.28,
      contrib_sr: 0.26,
      contrib_feas: 0.22,
      contrib_cov: 0.24,
      raw: 1.0,
      inputs: {
        collection_date: '2026-08-20',
        expiry_date: '2026-09-24',
        storage_temp: '2°C - 6°C',
        confidence_text: 'High confidence — verified with 30-day historical consumption rate and low variance',
      },
    },
    explanation: {
      why_source: 'Source facility Metro Central has 12 units of O- RBC expiring in 8 days with excess surplus beyond forecasted local demand.',
      why_destination: 'Destination St. Jude Hospital has a projected critical shortage of O- RBC within 48 hours.',
      why_quantity: 'Transfer quantity of 12 units completely fulfills the destination deficit without creating a deficit at source.',
      why_now: 'Transit window requires immediate dispatch to arrive prior to peak clinical demand schedule.',
    },
    checks: [
      { code: 'CHK-01', label: 'Component compatibility check', passed: true, detail: 'O- RBC is compatible with all recipient pools.' },
      { code: 'CHK-02', label: 'Shelf-life remaining threshold', passed: true, detail: 'Units have 8 days remaining (> 3-day min threshold).' },
      { code: 'CHK-03', label: 'Transit time & temperature stability', passed: true, detail: '1.5h transit is well within the 4h thermal container limit.' },
      { code: 'CHK-04', label: 'Source minimum reserve maintained', passed: true, detail: 'Source retains 15 units of O- above safety baseline.' },
      { code: 'CHK-05', label: 'Cold chain compliance history', passed: true, detail: 'Lot temperature records show continuous 4°C compliance.' },
      { code: 'CHK-06', label: 'Destination storage capacity', passed: true, detail: 'Destination fridge capacity verified for 12 incoming units.' },
      { code: 'CHK-07', label: 'Transport courier availability', passed: true, detail: 'Active dispatch courier confirmed on route FAC-01 to FAC-04.' },
      { code: 'CHK-08', label: 'Regulatory transfer authorization', passed: true, detail: 'Inter-facility transfer agreement active and validated.' },
    ],
    created_at: '2026-09-15T14:30:00Z',
  };

  const counterfactual: CounterfactualData = propCounterfactual || {
    do_nothing: {
      units_wasted: 12,
      shortage_unmet: 12,
      description: '12 units expire unused at source; destination faces unmet critical shortage.',
    },
    act: {
      units_wasted: 0,
      shortage_unmet: 0,
      description: '12 units successfully transferred and transfused; zero waste, shortage resolved.',
    },
    delta: {
      units_saved: 12,
      shortage_covered: 12,
    },
  };

  const [currentStatus, setCurrentStatus] = useState<RecStatus>(rec.status);
  const [logs, setLogs] = useState<ReviewLogItem[]>(
    propReviewLogs || [
      { id: 'log-1', status: 'GENERATED', timestamp: rec.created_at, note: 'System generated recommendation' },
    ]
  );

  const handleStatusChange = (newStatus: RecStatus, note?: string) => {
    setCurrentStatus(newStatus);
    const newLog: ReviewLogItem = {
      id: `log-${Date.now()}`,
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || (newStatus === 'APPROVED' ? 'Approved by operator' : newStatus === 'UNDER_REVIEW' ? 'Review initiated' : 'Status updated'),
    };
    setLogs((prev) => [newLog, ...prev]);
    if (onReviewAction) {
      onReviewAction(newStatus, note);
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectNote.trim()) return;
    handleStatusChange('REJECTED', rejectNote.trim());
    setShowRejectInput(false);
    setRejectNote('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="space-y-3 border-b border-rule pb-4">
        <Link
          to="/recommendations"
          className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
        >
          ← Back to recommendations
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-ink tracking-tight">
                Recommendation {rec.id}
              </h1>
              <StatusChip status={currentStatus} />
            </div>
            <p className="text-xs text-ink-mid mt-1 font-mono">
              Lot {rec.source_lot_id} • Created {new Date(rec.created_at).toLocaleString()}
            </p>
          </div>
          <div className="text-right bg-surface border border-rule px-4 py-2 rounded">
            <div className="text-[11px] font-mono text-ink-mid uppercase tracking-wide">
              Rescue Score
            </div>
            <div className="text-2xl font-mono font-bold text-accent">
              {rec.rescue_score.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 1. EXPLANATION (VERBATIM SENTENCES) */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          1. Operational Explanation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded border border-rule bg-paper space-y-1">
            <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">Source Rationale</div>
            <p className="text-xs text-ink leading-relaxed">{rec.explanation.why_source}</p>
          </div>
          <div className="p-3.5 rounded border border-rule bg-paper space-y-1">
            <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">Destination Need</div>
            <p className="text-xs text-ink leading-relaxed">{rec.explanation.why_destination}</p>
          </div>
          <div className="p-3.5 rounded border border-rule bg-paper space-y-1">
            <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">Transfer Quantity</div>
            <p className="text-xs text-ink leading-relaxed">{rec.explanation.why_quantity}</p>
          </div>
          <div className="p-3.5 rounded border border-rule bg-paper space-y-1">
            <div className="text-[11px] font-mono text-ink-mid uppercase font-semibold">Timing Window</div>
            <p className="text-xs text-ink leading-relaxed">{rec.explanation.why_now}</p>
          </div>
        </div>
      </section>

      {/* 2. SCORE BREAKDOWN */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          2. Score Breakdown
        </h2>
        <div className="p-4 border border-rule rounded bg-paper space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreBar label="Expiry Risk Contribution (contrib_er)" contribution={rec.factors.contrib_er} />
            <ScoreBar label="Shortage Risk Contribution (contrib_sr)" contribution={rec.factors.contrib_sr} />
            <ScoreBar label="Feasibility Contribution (contrib_feas)" contribution={rec.factors.contrib_feas} />
            <ScoreBar label="Coverage Contribution (contrib_cov)" contribution={rec.factors.contrib_cov} />
          </div>

          <div className="pt-3 border-t border-rule/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="text-ink-mid">
              Damping Multiplier (damp): <span className="text-ink font-bold">{rec.factors.damp.toFixed(2)}</span>
            </div>
            <div className="text-ink-mid">
              Raw Score Sum: <span className="text-ink font-bold">{rec.factors.raw.toFixed(2)}</span>
            </div>
            <div className="text-accent font-bold">
              Final Score: {rec.rescue_score.toFixed(2)}
            </div>
          </div>
        </div>
      </section>

      {/* 3. GATE CHECKLIST */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          3. Gate Checklist (All 8 Checks)
        </h2>
        <GateChecklist checks={rec.checks} />
      </section>

      {/* 4. TRACEABILITY CHAIN */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          4. Traceability Chain
        </h2>
        <div className="p-4 border border-rule rounded bg-paper">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            <div>
              <div className="font-mono text-[11px] text-ink-mid uppercase">Trace / Lot ID</div>
              <div className="font-mono font-bold text-ink mt-0.5">{rec.source_lot_id}</div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-ink-mid uppercase">Source Facility</div>
              <div className="font-medium text-ink mt-0.5">{rec.source_facility_name}</div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-ink-mid uppercase">Component & Group</div>
              <div className="font-mono font-bold text-ink mt-0.5">{rec.blood_group} {rec.component} ({rec.units}u)</div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-ink-mid uppercase">Collection Date</div>
              <div className="font-mono text-ink mt-0.5">
                {String(rec.factors.inputs?.collection_date || '2026-08-20')}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-ink-mid uppercase">Expiry Date</div>
              <div className="font-mono text-ink mt-0.5">
                {String(rec.factors.inputs?.expiry_date || '2026-09-24')}
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] text-ink-mid uppercase">Storage Spec</div>
              <div className="font-mono text-ink mt-0.5">
                {String(rec.factors.inputs?.storage_temp || '2°C - 6°C')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORECAST CONFIDENCE */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          5. Forecast Confidence
        </h2>
        <div className="p-3.5 border border-rule rounded bg-paper text-xs space-y-1">
          <div className="font-semibold text-ink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-state-normal inline-block" />
            Confidence level: High
          </div>
          <p className="text-ink-mid leading-relaxed">
            {String(
              rec.factors.inputs?.confidence_text ||
                'High confidence — predicted demand based on 30-day historical consumption patterns and stable admission trends.'
            )}
          </p>
        </div>
      </section>

      {/* 6. COUNTERFACTUAL */}
      <section className="space-y-3">
        <div className="border-b border-rule pb-1.5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-ink uppercase tracking-wide">
            6. Counterfactual Evaluation
          </h2>
          <span className="text-xs font-mono text-ink-mid bg-surface px-2 py-0.5 rounded border border-rule">
            Simulated planning outcome — not a guaranteed result.
          </span>
        </div>

        <div className="border border-rule rounded bg-paper overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
            {/* Column 1: Do Nothing */}
            <div className="p-4 space-y-2">
              <div className="text-xs font-bold font-mono text-state-critical uppercase tracking-wide">
                Option A: Do Nothing
              </div>
              <p className="text-xs text-ink-mid">{counterfactual.do_nothing.description}</p>
              <div className="pt-2 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-mid">Units wasted:</span>
                  <span className="text-state-critical font-bold">{counterfactual.do_nothing.units_wasted} u</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mid">Unmet shortage:</span>
                  <span className="text-state-critical font-bold">{counterfactual.do_nothing.shortage_unmet} u</span>
                </div>
              </div>
            </div>

            {/* Column 2: Act */}
            <div className="p-4 space-y-2 bg-state-normal/5">
              <div className="text-xs font-bold font-mono text-state-normal uppercase tracking-wide">
                Option B: Act on Recommendation
              </div>
              <p className="text-xs text-ink-mid">{counterfactual.act.description}</p>
              <div className="pt-2 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-ink-mid">Units wasted:</span>
                  <span className="text-state-normal font-bold">{counterfactual.act.units_wasted} u</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-mid">Unmet shortage:</span>
                  <span className="text-state-normal font-bold">{counterfactual.act.shortage_unmet} u</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Row */}
          <div className="bg-surface p-3 border-t border-rule font-mono text-xs flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold text-ink">Net Impact Delta (Act vs Do Nothing):</span>
            <div className="flex items-center gap-4 text-state-normal font-bold">
              <span>+ {counterfactual.delta.units_saved} units saved</span>
              <span>+ {counterfactual.delta.shortage_covered} units shortage covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REVIEW ACTIONS & STATUS TIMELINE */}
      <section className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-ink uppercase tracking-wide border-b border-rule pb-1.5">
          7. Review Actions & Status Timeline
        </h2>

        {/* Action Controls */}
        <div className="p-4 border border-rule rounded bg-paper space-y-3">
          <div className="text-xs font-semibold text-ink">Review actions:</div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleStatusChange('UNDER_REVIEW')}
              disabled={currentStatus === 'UNDER_REVIEW'}
              className="px-3 py-1.5 rounded border border-accent text-accent hover:bg-accent/10 disabled:opacity-50 text-xs font-medium"
            >
              Open recommendation
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('APPROVED')}
              disabled={currentStatus === 'APPROVED'}
              className="px-3 py-1.5 rounded bg-state-normal text-paper hover:opacity-90 disabled:opacity-50 text-xs font-semibold shadow-xs"
            >
              Approve recommendation
            </button>

            <button
              type="button"
              onClick={() => setShowRejectInput(!showRejectInput)}
              disabled={currentStatus === 'REJECTED'}
              className="px-3 py-1.5 rounded border border-state-critical text-state-critical hover:bg-state-critical/10 disabled:opacity-50 text-xs font-medium"
            >
              Reject recommendation
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange('CLOSED')}
              disabled={currentStatus === 'CLOSED'}
              className="px-3 py-1.5 rounded border border-rule bg-surface text-ink-mid hover:text-ink disabled:opacity-50 text-xs font-medium"
            >
              Close recommendation
            </button>
          </div>

          {/* Inline Reject Note Form (No Modal Library) */}
          {showRejectInput && (
            <form onSubmit={handleRejectSubmit} className="pt-2 border-t border-rule space-y-2">
              <label htmlFor="reject-note" className="block text-xs font-semibold text-state-critical">
                Rejection reason note (required):
              </label>
              <textarea
                id="reject-note"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Explain why this recommendation is being rejected..."
                required
                rows={2}
                className="w-full text-xs p-2 border border-rule rounded bg-paper text-ink focus:outline-none focus:border-state-critical"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="px-2.5 py-1 text-xs border border-rule text-ink-mid rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-state-critical text-paper font-semibold rounded"
                >
                  Confirm rejection
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Status Timeline */}
        <div className="p-4 border border-rule rounded bg-paper space-y-3">
          <div className="text-xs font-semibold text-ink">Status timeline:</div>
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded bg-surface border border-rule/60 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <StatusChip status={log.status} />
                  {log.note && <span className="text-ink font-medium">{log.note}</span>}
                </div>
                <div className="font-mono text-ink-mid text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
