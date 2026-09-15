import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, QrCode, Thermometer, RotateCcw, Package } from 'lucide-react';
import { DisclaimerFooter } from '../components/common/DisclaimerFooter';

export const InventoryPage: React.FC = () => {
  const { inventory, hospitals, setSelectedTraceabilityItem } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('ALL');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedComponent, setSelectedComponent] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedStorage, setSelectedStorage] = useState('ALL');

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (searchTerm && !item.unitOrBatchId.toLowerCase().includes(searchTerm.toLowerCase()) && !item.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (selectedHospital !== 'ALL' && item.hospitalId !== selectedHospital) return false;
      if (selectedBloodGroup !== 'ALL' && item.bloodGroup !== selectedBloodGroup) return false;
      if (selectedComponent !== 'ALL' && item.component !== selectedComponent) return false;
      if (selectedRisk !== 'ALL' && item.riskLevel !== selectedRisk) return false;
      if (selectedStorage !== 'ALL' && item.storageStatus !== selectedStorage) return false;
      return true;
    });
  }, [inventory, searchTerm, selectedHospital, selectedBloodGroup, selectedComponent, selectedRisk, selectedStorage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedHospital('ALL');
    setSelectedBloodGroup('ALL');
    setSelectedComponent('ALL');
    setSelectedRisk('ALL');
    setSelectedStorage('ALL');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blood Inventory</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Track component-level inventory across the HemoGrid network.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Batch ID or facility..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800/20"
            />
          </div>

          {/* Hospital Filter */}
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Facilities</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          {/* Blood Group Filter */}
          <select
            value={selectedBloodGroup}
            onChange={(e) => setSelectedBloodGroup(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Blood Groups</option>
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* Component Filter */}
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Components</option>
            <option value="RBC">RBC</option>
            <option value="Platelets">Platelets</option>
            <option value="Plasma">Plasma</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Deficit</option>
            <option value="WATCH">Watch</option>
            <option value="STABLE">Stable</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing <strong className="text-slate-800 font-bold">{filteredInventory.length}</strong> batch records</span>
          <button
            onClick={resetFilters}
            className="font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Filters
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
        {filteredInventory.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No matching inventory found.</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter options.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] whitespace-nowrap">
                <tr>
                  <th className="py-3.5 px-4">Batch ID / Traceability</th>
                  <th className="py-3.5 px-4">Facility</th>
                  <th className="py-3.5 px-4">Blood & Component</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Days Left</th>
                  <th className="py-3.5 px-4">Cold Storage</th>
                  <th className="py-3.5 px-4">Risk State</th>
                  <th className="py-3.5 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedTraceabilityItem(item)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-mono font-bold text-emerald-900">
                        <QrCode className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        {item.unitOrBatchId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800">{item.hospitalName}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-emerald-900">{item.bloodGroup}</span>{' '}
                      <span className="text-slate-500">{item.component}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">{item.quantity} Units</td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">{item.expiryDate}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap inline-block ${
                        item.daysToExpiry <= 3 ? 'bg-amber-100 text-amber-800' :
                        item.daysToExpiry <= 7 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.daysToExpiry} days left
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Thermometer className={`w-3.5 h-3.5 ${
                          item.storageStatus === 'REVIEW_REQUIRED' ? 'text-rose-500' : 'text-emerald-600'
                        }`} />
                        <span>{item.temperature}°C</span>
                        {item.storageStatus === 'REVIEW_REQUIRED' && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold rounded whitespace-nowrap">REVIEW</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase whitespace-nowrap inline-block ${
                        item.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                        item.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        item.riskLevel === 'WATCH' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTraceabilityItem(item);
                        }}
                        className="px-3 py-1 bg-emerald-900 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition-colors whitespace-nowrap"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DisclaimerFooter />
    </div>
  );
};
