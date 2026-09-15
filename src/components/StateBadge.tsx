import React from 'react';
import { WindowState, ShortageTier } from '../types';

interface StateBadgeProps {
  state: WindowState | ShortageTier;
}

export default function StateBadge({ state }: StateBadgeProps) {
  // RESCUE_WINDOW and CRITICAL are the only ones that get emphasis (filled background)
  const isEmphasized = state === 'RESCUE_WINDOW' || state === 'CRITICAL';

  let colorClasses = '';

  switch (state) {
    case 'NORMAL':
    case 'STABLE':
      colorClasses = isEmphasized
        ? 'bg-state-normal text-paper border-state-normal'
        : 'bg-transparent text-state-normal border-state-normal';
      break;
    case 'WATCH':
      colorClasses = isEmphasized
        ? 'bg-state-watch text-paper border-state-watch'
        : 'bg-transparent text-state-watch border-state-watch';
      break;
    case 'RESCUE_WINDOW':
    case 'HIGH':
      colorClasses = isEmphasized
        ? 'bg-state-rescue text-paper border-state-rescue font-semibold'
        : 'bg-transparent text-state-rescue border-state-rescue';
      break;
    case 'UNRESCUABLE':
    case 'CRITICAL':
      colorClasses = isEmphasized
        ? 'bg-state-critical text-paper border-state-critical font-semibold'
        : 'bg-transparent text-state-critical border-state-critical';
      break;
    default:
      colorClasses = 'bg-transparent text-ink-mid border-rule';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${colorClasses}`}
    >
      {state}
    </span>
  );
}
