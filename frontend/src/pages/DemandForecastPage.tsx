import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Info, Filter, ArrowRight } from 'lucide-react';
import { DisclaimerFooter } from '../components/common/DisclaimerFooter';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const DemandForecastPage: React.FC = () => {
  const { forecasts, hospitals, setSelectedRecommendation, recommendations } = useApp();

  const [selectedHospitalId, setSelectedHospitalId] = useState('h2'); // City General default
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('O+');
  const [selectedComponent, setSelectedComponent] = useState('RBC');

  // Selected forecast item
  const selectedFc = forecasts.find(
    (f) => f.hospitalId === selectedHospitalId && f.bloodGroup === selectedBloodGroup && f.component === selectedComponent
  ) || forecasts[0];

  // Chart data: 7 days historical + 7 days forecast
  const chartData = [
    { date: 'Sep 08', historical: 7, forecast: null },
    { date: 'Sep 09', historical: 8, forecast: null },
    { date: 'Sep 10', historical: 6, forecast: null },
    { date: 'Sep 11', historical: 9, forecast: null },
    { date: 'Sep 12', historical: 11, forecast: null },
    { date: 'Sep 13', historical: 10, forecast: null },
    { date: 'Sep 14 (Today)', historical: 6, forecast: 6 },
    { date: 'Sep 15 (+1d)', historical: null, forecast: 7 },
    { date: 'Sep 16 (+2d)', historical: null, forecast: 8 },
    { date: 'Sep 17 (+3d)', historical: null, forecast: 9 },
    { date: 'Sep 18 (+4d)', historical: null, forecast: 10 },
    { date: 'Sep 19 (+5d)', historical: null, forecast: 10 },
    { date: 'Sep 20 (+6d)', historical: null, forecast: 11 },
    { date: 'Sep 21 (+7d)', historical: null, forecast: 11 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Demand Forecast</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          See what each facility may need before the shortage occurs.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mr-2">
            <Filter className="w-4 h-4 text-emerald-800" />
            <span>Select Target Locus:</span>
          </div>

          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="RBC">RBC</option>
            <option value="Platelets">Platelets</option>
            <option value="Plasma">Plasma</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Forecast Horizon:</span>
          <span className="px-3 py-1 bg-emerald-900 text-white rounded-full text-xs font-bold">
            7 Days
          </span>
        </div>
      </div>

      {/* MAIN CHART */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {selectedFc.hospitalName} • {selectedFc.bloodGroup} {selectedFc.component}
            </h3>
            <p className="text-xs text-slate-500">Historical Consumption (Solid) vs 7-Day Predictive Demand (Dashed)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-full bg-slate-700"></span> Historical Usage
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-3 rounded-full bg-emerald-700"></span> Predicted Demand
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }} />
              <Line type="monotone" dataKey="historical" stroke="#334155" strokeWidth={3} dot={{ r: 4 }} connectNulls={false} />
              <Line type="monotone" dataKey="forecast" stroke="#15803d" strokeWidth={3} strokeDasharray="6 6" dot={{ r: 4 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FORECAST SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Facility Demand Forecast Breakdown</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block">Target Facility</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{selectedFc.hospitalName}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block">Current Local Stock</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{selectedFc.currentUnits} Units</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block">7-Day Projected Demand</span>
            <span className="text-xl font-black text-emerald-900 mt-1 block">{selectedFc.forecast7Days} Units</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-medium text-slate-500 block">Forecast Confidence</span>
            <span className="text-sm font-bold text-emerald-800 mt-1 block flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {selectedFc.confidence} Confidence
            </span>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <span className="text-xs font-medium text-rose-700 block">Projected Deficit / Gap</span>
            <span className="text-xl font-black text-rose-800 mt-1 block">{selectedFc.projectedGap} Units</span>
          </div>
        </div>

        {/* Action Link to Match */}
        {selectedFc.projectedGap < 0 && (
          <div className="p-4 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Network Intervention Opportunity</span>
              <p className="text-xs text-emerald-100 mt-0.5">
                Redistribution match available: Greenfield Medical Center has 12 surplus units of O+ RBC available.
              </p>
            </div>
            <button
              onClick={() => {
                const rec = recommendations.find(r => r.id === 'HG-REC-001') || null;
                setSelectedRecommendation(rec);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-full transition-colors shrink-0 flex items-center gap-1.5"
            >
              Review Matching Opportunity <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mandated Engineering indicator notice */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>Forecast confidence is an engineering indicator for this prototype, not a clinical probability.</span>
        </div>
      </div>

      <DisclaimerFooter />
    </div>
  );
};
