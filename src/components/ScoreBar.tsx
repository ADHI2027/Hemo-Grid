import React from 'react';

interface ScoreBarProps {
  label: string;
  contribution: number;
  maxContribution?: number;
}

export default function ScoreBar({ label, contribution, maxContribution = 1 }: ScoreBarProps) {
  // Format contribution display value (formatting, not arithmetic)
  const formattedValue = contribution.toFixed(2);
  
  // Compute percentage width purely for visual rendering layout
  const pctWidth = Math.min(100, Math.max(0, (contribution / maxContribution) * 100));

  return (
    <div className="space-y-1 my-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-ink font-medium">{label}</span>
        <span className="font-mono text-ink-mid">{formattedValue}</span>
      </div>
      <div className="w-full h-2 bg-surface border border-rule rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${pctWidth}%` }}
        />
      </div>
    </div>
  );
}
