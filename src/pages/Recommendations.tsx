import React from 'react';
import { Link } from 'react-router-dom';
import StatusChip from '../components/StatusChip';
import { RecommendationItem, ExclusionItem } from '../types';

interface RecommendationsProps {
  recommendations?: RecommendationItem[];
  exclusions?: ExclusionItem[];
}

export default function Recommendations({
  recommendations = [],
  exclusions = [],
}: RecommendationsProps) {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* SECTION ONE: Ranked Recommendations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div>
            <h2 className="text-lg font-bold text-ink tracking-tight">Ranked recommendations</h2>
            <p className="text-xs text-ink-mid mt-0.5">
              Network optimization recommendations ordered by rescue score.
            </p>
          </div>
          {recommendations.length > 0 && (
            <span className="font-mono text-xs text-ink-mid bg-surface px-2.5 py-1 rounded border border-rule">
              {recommendations.length} recommendations
            </span>
          )}
        </div>

        {recommendations.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-rule rounded bg-paper space-y-2 my-4">
            <p className="text-sm text-ink font-medium">
              No recommendations in the current window. Inject a demand shock to see the network respond.
            </p>
          </div>
        ) : (
          <div className="border border-rule rounded bg-paper overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-rule font-mono text-ink-mid uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-semibold">Rank</th>
                  <th className="py-2.5 px-4 font-semibold">Rescue score</th>
                  <th className="py-2.5 px-4 font-semibold">Source → Destination</th>
                  <th className="py-2.5 px-4 font-semibold">Group</th>
                  <th className="py-2.5 px-4 font-semibold">Component</th>
                  <th className="py-2.5 px-4 font-semibold">Units</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold">Transit</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/60">
                {recommendations.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-ink-mid">
                      #{index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-accent text-sm">
                      {item.rescue_score.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink">
                        {item.source_facility_name}
                      </div>
                      <div className="text-ink-mid text-[11px] flex items-center gap-1">
                        <span>→</span>
                        <span>{item.dest_facility_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-ink">
                      {item.blood_group}
                    </td>
                    <td className="py-3 px-4 font-mono text-ink-mid">
                      {item.component}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      {item.units}
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip status={item.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-ink-mid">
                      {item.transit_hours}h
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/recommendations/${item.id}`}
                        className="inline-flex items-center text-accent hover:underline font-medium text-xs"
                      >
                        Inspect details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECTION TWO: Excluded Candidates (Equal Visual Weight) */}
      <section className="space-y-4 pt-4 border-t-2 border-rule">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div>
            <h2 className="text-lg font-bold text-ink tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-state-critical inline-block" />
              Excluded candidates
            </h2>
            <p className="text-xs text-ink-mid mt-0.5">
              Evaluated candidates blocked by safety gate checks prior to network ranking.
            </p>
          </div>
          {exclusions.length > 0 && (
            <span className="font-mono text-xs text-state-critical bg-state-critical/10 px-2.5 py-1 rounded border border-state-critical/30 font-medium">
              {exclusions.length} excluded
            </span>
          )}
        </div>

        {exclusions.length === 0 ? (
          <div className="p-6 text-center border border-rule rounded bg-paper text-xs text-ink-mid">
            No candidate exclusions logged in the current window.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {exclusions.map((item, idx) => {
              const failedChecks = item.checks.filter((c) => !c.passed);

              return (
                <div
                  key={`${item.source_lot_id}-${item.dest_facility_id}-${idx}`}
                  className="border border-state-critical/30 rounded bg-paper p-4 space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-rule/60 pb-2">
                    <div>
                      <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                        <span>{item.source_facility_name}</span>
                        <span className="text-ink-mid">→</span>
                        <span>{item.dest_facility_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-ink-mid mt-1">
                        <span>Group: <strong className="text-ink">{item.blood_group}</strong></span>
                        <span>Component: <strong className="text-ink">{item.component}</strong></span>
                        <span>Lot: <strong className="text-ink">{item.source_lot_id}</strong></span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.failed_codes.map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-state-critical text-paper"
                        >
                          FAILED: {code}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Failed check reasons */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono uppercase text-ink-mid font-semibold">
                      Failed safety gate criteria:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {failedChecks.map((check) => (
                        <div
                          key={check.code}
                          className="p-2 rounded bg-surface border border-rule/80 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-state-critical font-bold text-[11px]">
                              [{check.code}] {check.label}
                            </span>
                            <span className="font-mono text-[10px] text-state-critical uppercase font-bold">
                              Failed
                            </span>
                          </div>
                          <p className="text-ink-mid text-[11px]">{check.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
