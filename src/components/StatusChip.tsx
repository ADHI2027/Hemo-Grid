import React from 'react';
import { RecStatus } from '../types';

interface StatusChipProps {
  status: RecStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  switch (status) {
    case 'GENERATED':
      // Dashed border, sharp square corners, quiet watch color, hollow circle mark
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none border-2 border-dashed border-state-watch bg-transparent text-state-watch font-mono text-xs tracking-wider uppercase font-medium">
          <span>○</span>
          <span>GENERATED</span>
        </span>
      );

    case 'APPROVED':
      // Solid filled green pill, rounded-full, check mark, bold text
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-state-normal text-paper font-bold text-xs shadow-sm tracking-wide">
          <span>✓</span>
          <span>APPROVED</span>
        </span>
      );

    case 'UNDER_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-accent bg-accent/10 text-accent font-mono text-xs">
          <span>⟳</span>
          <span>UNDER REVIEW</span>
        </span>
      );

    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-state-critical bg-state-critical/10 text-state-critical font-mono text-xs">
          <span>✕</span>
          <span>REJECTED</span>
        </span>
      );

    case 'CLOSED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-rule bg-surface text-ink-mid font-mono text-xs">
          <span>•</span>
          <span>CLOSED</span>
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded border border-rule text-ink-mid font-mono text-xs">
          {status}
        </span>
      );
  }
}
