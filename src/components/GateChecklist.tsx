import React from 'react';
import { GateCheck } from '../types';

interface GateChecklistProps {
  checks: GateCheck[];
}

export default function GateChecklist({ checks }: GateChecklistProps) {
  return (
    <div className="space-y-2 border border-rule rounded p-3 bg-paper">
      <div className="text-xs font-mono text-ink-mid border-b border-rule pb-2 mb-2 uppercase tracking-wide">
        Gate Checklist ({checks.length} Checks)
      </div>
      <div className="divide-y divide-rule/50">
        {checks.map((check) => (
          <div key={check.code} className="py-2 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <span
                className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold font-mono shrink-0 ${
                  check.passed
                    ? 'bg-state-normal/15 text-state-normal border border-state-normal/30'
                    : 'bg-state-critical/15 text-state-critical border border-state-critical/30'
                }`}
              >
                {check.passed ? '✓' : '✕'}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-ink-mid uppercase">{check.code}</span>
                  <span className="text-xs font-semibold text-ink">{check.label}</span>
                </div>
                <p className="text-xs text-ink-mid mt-0.5 break-words">{check.detail}</p>
              </div>
            </div>
            <div className="shrink-0 font-mono text-xs">
              <span
                className={check.passed ? 'text-state-normal font-medium' : 'text-state-critical font-medium'}
              >
                {check.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
