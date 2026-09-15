import React from 'react';
import { useApp } from '../context/AppContext';
import { Eye, ArrowRight } from 'lucide-react';
import { DisclaimerFooter } from '../components/common/DisclaimerFooter';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, setSelectedRecommendation } = useApp();

  const activeOppCount = recommendations.length;
  const highPriorityCount = recommendations.filter((r) => r.priority === 'HIGH').length;
  const awaitingReviewCount = recommendations.filter((r) => r.status === 'ELIGIBLE_FOR_REVIEW').length;
  const excludedRecommendedCount = recommendations.filter((r) => r.status === 'EXCLUDED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Redistribution Opportunities</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Ranked, explainable opportunities for authorized review.
        </p>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Opportunities</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">{activeOppCount}</span>
          <span className="text-[11px] text-emerald-800 font-semibold">Evaluated by Network</span>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">High Priority</span>
          <span className="text-3xl font-black text-amber-700 mt-1 block">{highPriorityCount}</span>
          <span className="text-[11px] text-amber-700 font-semibold">Immediate Action Window</span>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Awaiting Review</span>
          <span className="text-3xl font-black text-emerald-900 mt-1 block">{awaitingReviewCount}</span>
          <span className="text-[11px] text-emerald-800 font-semibold">Ready for Signoff</span>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-card border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Excluded Candidates</span>
          <span className="text-3xl font-black text-rose-700 mt-1 block">{excludedRecommendedCount}</span>
          <span className="text-[11px] text-rose-700 font-semibold">Excluded by Safety Gate</span>
        </div>
      </div>

      {/* RECOMMENDATIONS TABLE */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Ranked Opportunity Matrix</h3>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Sorted by Rescue Score
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] whitespace-nowrap">
              <tr>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Source Facility</th>
                <th className="py-3.5 px-4">Destination Facility</th>
                <th className="py-3.5 px-4">Blood & Component</th>
                <th className="py-3.5 px-4">Candidate Qty</th>
                <th className="py-3.5 px-4">Rescue Score</th>
                <th className="py-3.5 px-4">Operational Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recommendations.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => setSelectedRecommendation(rec)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      rec.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      rec.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">{rec.sourceHospitalName}</td>
                  <td className="py-4 px-4 font-semibold text-slate-800 flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    {rec.destinationHospitalName}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-emerald-900">{rec.bloodGroup}</span>{' '}
                    <span className="text-slate-500 font-medium">{rec.component}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">{rec.quantity} Units</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-emerald-900">{rec.score}</span>
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap inline-block ${
                      rec.status === 'ELIGIBLE_FOR_REVIEW' ? 'bg-emerald-100 text-emerald-900' :
                      rec.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-900' :
                      rec.status === 'EXCLUDED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.status === 'ELIGIBLE_FOR_REVIEW' && 'Eligible for Review'}
                      {rec.status === 'UNDER_REVIEW' && 'Under Active Review'}
                      {rec.status === 'EXCLUDED' && 'Candidate Excluded'}
                      {rec.status === 'NEW' && 'New Match'}
                      {rec.status === 'COMPLETED' && 'Completed'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecommendation(rec);
                      }}
                      className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Match
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DisclaimerFooter />
    </div>
  );
};
