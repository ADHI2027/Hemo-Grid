import React, { createContext, useContext, useState, useMemo } from 'react';
import type {
  Hospital,
  InventoryItem,
  ForecastRecord,
  Recommendation,
  AlertItem,
  PrototypeSettings
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_INVENTORY,
  INITIAL_FORECASTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_ALERTS,
  DEFAULT_SETTINGS
} from '../data/mockData';

interface SearchResult {
  id: string;
  type: 'hospital' | 'unit' | 'blood' | 'recommendation';
  title: string;
  subtitle: string;
  route: string;
  payload?: any;
}

interface AppContextType {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  hospitals: Hospital[];
  inventory: InventoryItem[];
  forecasts: ForecastRecord[];
  recommendations: Recommendation[];
  alerts: AlertItem[];
  settings: PrototypeSettings;
  updateSettings: (newSettings: Partial<PrototypeSettings>) => void;
  
  // Selected items for detail drawers/modals
  selectedTraceabilityItem: InventoryItem | null;
  setSelectedTraceabilityItem: (item: InventoryItem | null) => void;
  selectedRecommendation: Recommendation | null;
  setSelectedRecommendation: (rec: Recommendation | null) => void;
  selectedHospital: Hospital | null;
  setSelectedHospital: (hosp: Hospital | null) => void;

  // Simulator state
  demandIncreasePercent: number;
  setDemandIncreasePercent: (val: number) => void;
  
  // Actions
  updateRecommendationStatus: (id: string, status: Recommendation['status']) => void;
  markAlertRead: (id: string) => void;
  resetDemoData: () => void;

  // Global search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];

  // Dynamic calculated KPI metrics
  kpis: {
    totalInventory: number;
    expiryRiskCount: number;
    shortageRiskCount: number;
    rescueOpportunitiesCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState<string>('/dashboard');
  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [forecasts] = useState<ForecastRecord[]>(INITIAL_FORECASTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [settings, setSettings] = useState<PrototypeSettings>(DEFAULT_SETTINGS);

  // Modals & Drawers
  const [selectedTraceabilityItem, setSelectedTraceabilityItem] = useState<InventoryItem | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Simulator
  const [demandIncreasePercent, setDemandIncreasePercent] = useState<number>(40);

  // Global Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  const updateSettings = (newSettings: Partial<PrototypeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateRecommendationStatus = (id: string, status: Recommendation['status']) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status } : rec))
    );
    if (selectedRecommendation && selectedRecommendation.id === id) {
      setSelectedRecommendation((prev) => prev ? { ...prev, status } : null);
    }
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, read: true } : alt))
    );
  };

  const resetDemoData = () => {
    setInventory(INITIAL_INVENTORY);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setAlerts(INITIAL_ALERTS);
    setSettings(DEFAULT_SETTINGS);
    setDemandIncreasePercent(40);
    setSelectedRecommendation(null);
    setSelectedTraceabilityItem(null);
    setSelectedHospital(null);
  };

  // Search logic across hospitals, units, blood groups, recommendations
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Hospitals
    hospitals.forEach((h) => {
      if (h.name.toLowerCase().includes(q) || h.code.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)) {
        results.push({
          id: `hosp-${h.id}`,
          type: 'hospital',
          title: h.name,
          subtitle: `${h.tier} • ${h.city}`,
          route: '/network',
          payload: h
        });
      }
    });

    // Inventory Units
    inventory.forEach((item) => {
      if (
        item.unitOrBatchId.toLowerCase().includes(q) ||
        item.bloodGroup.toLowerCase().includes(q) ||
        item.component.toLowerCase().includes(q) ||
        item.hospitalName.toLowerCase().includes(q)
      ) {
        results.push({
          id: `inv-${item.id}`,
          type: 'unit',
          title: `${item.unitOrBatchId} (${item.bloodGroup} ${item.component})`,
          subtitle: `${item.hospitalName} • ${item.quantity} units • ${item.daysToExpiry}d to expiry`,
          route: '/inventory',
          payload: item
        });
      }
    });

    // Recommendations
    recommendations.forEach((rec) => {
      if (
        rec.id.toLowerCase().includes(q) ||
        rec.sourceHospitalName.toLowerCase().includes(q) ||
        rec.destinationHospitalName.toLowerCase().includes(q) ||
        rec.bloodGroup.toLowerCase().includes(q)
      ) {
        results.push({
          id: `rec-${rec.id}`,
          type: 'recommendation',
          title: `Match: ${rec.sourceHospitalName} → ${rec.destinationHospitalName}`,
          subtitle: `${rec.quantity} units ${rec.bloodGroup} ${rec.component} • Score ${rec.score}/100`,
          route: '/recommendations',
          payload: rec
        });
      }
    });

    return results.slice(0, 7);
  }, [searchQuery, hospitals, inventory, recommendations]);

  // Calculated KPIs from state
  const kpis = useMemo(() => {
    const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const expiryRiskCount = inventory.filter((item) => item.riskLevel === 'HIGH' || item.daysToExpiry <= settings.expiryRiskWindowDays).reduce((sum, i) => sum + i.quantity, 0);
    const shortageRiskCount = forecasts.filter((f) => f.projectedGap < 0).length;
    const rescueOpportunitiesCount = recommendations.filter((r) => r.status !== 'EXCLUDED').length;

    return {
      totalInventory,
      expiryRiskCount,
      shortageRiskCount,
      rescueOpportunitiesCount
    };
  }, [inventory, forecasts, recommendations, settings]);

  return (
    <AppContext.Provider
      value={{
        activeRoute,
        setActiveRoute,
        hospitals,
        inventory,
        forecasts,
        recommendations,
        alerts,
        settings,
        updateSettings,
        selectedTraceabilityItem,
        setSelectedTraceabilityItem,
        selectedRecommendation,
        setSelectedRecommendation,
        selectedHospital,
        setSelectedHospital,
        demandIncreasePercent,
        setDemandIncreasePercent,
        updateRecommendationStatus,
        markAlertRead,
        resetDemoData,
        searchQuery,
        setSearchQuery,
        searchResults,
        kpis
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
