import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import { DisclaimerFooter } from '../components/common/DisclaimerFooter';

export const SimulatorPage: React.FC = () => {
  const { demandIncreasePercent, setDemandIncreasePercent, setSelectedRecommendation, recommendations } = useApp();

  const [isSimulating, setIsSimulating] = useState(false);

  // Default values
  const currentInv = 6;
  const baseForecast = 11;

  // Calculated simulated forecast
  const simulatedForecast = Math.round(baseForecast * (1 + demandIncreasePercent / 100));
  const baseGap = currentInv - baseForecast; // -5
  const simulatedGap = currentInv - simulatedForecast; // e.g. -9 at 40%

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  const topRec = recommendations.find(r => r.id === 'HG-REC-001') || recommendations[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          Counterfactual Analysis Engine
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">What-If Simulator</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Explore how changing demand scenarios alter network risk and redistribution priorities.
        </p>
      </div>

      {/* SIMULATOR CONTROL PANEL */}
      <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base">Stress-Test Scenario Parameters</h3>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Simulation only. Results are based on prototype data.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Target Facility */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Target Facility
            </label>
            <select className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none">
              <option value="h2">City General Hospital</option>
              <option value="h7">Central Trauma Centre</option>
              <option value="h10">North District Hospital</option>
            </select>
          </div>

          {/* Blood Component */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Component & Group
            </label>
            <select className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none">
              <option value="O+ RBC">O+ Red Blood Cells (RBC)</option>
              <option value="O- RBC">O- Universal RBC</option>
              <option value="A+ PLT">A+ Platelets</option>
            </select>
          </div>

          {/* Demand Surge Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Surge Demand Increase
              </label>
              <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                +{demandIncreasePercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={demandIncreasePercent}
              onChange={(e) => setDemandIncreasePercent(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>Baseline (0%)</span>
              <span>+50% Surge</span>
              <span>+100% Critical Surge</span>
            </div>
          </div>

        </div>

        <button
          onClick={handleRunSimulation}
          className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          Run Counterfactual Simulation
        </button>
      </div>

      {/* COMPARISON CARDS: BEFORE VS AFTER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BEFORE STATE */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baseline Network State</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              Standard Forecast
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-medium block">Current Stock</span>
              <span className="text-xl font-bold text-slate-800 mt-0.5 block">{currentInv} Units</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-medium block">7-Day Demand</span>
              <span className="text-xl font-bold text-slate-800 mt-0.5 block">{baseForecast} Units</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <span className="text-[10px] text-amber-800 font-medium block">Projected Gap</span>
              <span className="text-xl font-bold text-amber-900 mt-0.5 block">{baseGap} Units</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Baseline Risk State</span>
            <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">WATCH / HIGH</span>
          </div>
        </div>

        {/* AFTER SURGE STATE */}
        <div className="bg-white rounded-3xl p-6 shadow-card border border-emerald-200 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Simulated State (+{demandIncreasePercent}% Demand Surge)
            </span>
            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
              Surge Scenario Active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-medium block">Current Stock</span>
              <span className="text-xl font-bold text-slate-800 mt-0.5 block">{currentInv} Units</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <span className="text-[10px] text-emerald-800 font-medium block">Simulated Demand</span>
              <span className="text-xl font-black text-emerald-900 mt-0.5 block">{simulatedForecast} Units</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-2xl">
              <span className="text-[10px] text-rose-700 font-medium block">Simulated Deficit</span>
              <span className="text-xl font-black text-rose-900 mt-0.5 block">{simulatedGap} Units</span>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">New Risk Classification</span>
            <span className="px-3 py-1 bg-rose-700 text-white text-xs font-bold rounded-full">CRITICAL DEFICIT</span>
          </div>
        </div>

      </div>

      {/* NEW NETWORK RESPONSE RECOMMENDATION CARD */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 rounded-3xl p-6 text-white shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <h3 className="font-extrabold text-base text-white">Dynamic Network Response Adjustment</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
            Simulated Score: 96/100
          </span>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-200 block font-medium">Recommended Allocation Adjustment</span>
            <p className="text-sm font-extrabold text-white mt-0.5">
              Greenfield Medical Center → City General Hospital (5 O+ RBC Units)
            </p>
            <p className="text-xs text-emerald-200/80 mt-1">
              Surge priority elevated from High to Critical due to 40% increased forecasted deficit.
            </p>
          </div>

          <button
            onClick={() => setSelectedRecommendation(topRec)}
            className="px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-full transition-colors shrink-0 flex items-center gap-1.5"
          >
            Review Simulation Candidate <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DisclaimerFooter />
    </div>
  );
};
