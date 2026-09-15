export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
export type ComponentType = 'RBC' | 'Platelets' | 'Plasma';
export type RiskLevel = 'STABLE' | 'WATCH' | 'HIGH' | 'CRITICAL';
export type StorageStatus = 'NORMAL' | 'REVIEW_REQUIRED' | 'EXCLUDED';
export type RecommendationStatus = 'NEW' | 'UNDER_REVIEW' | 'ELIGIBLE_FOR_REVIEW' | 'EXCLUDED' | 'COMPLETED';

export interface Hospital {
  id: string;
  name: string;
  code: string;
  city: string;
  location: { x: number; y: number }; // For network graph layout
  tier: 'Trauma Center' | 'General Hospital' | 'Blood Center' | 'Specialty Clinic';
  totalCapacity: number;
}

export interface InventoryItem {
  id: string;
  unitOrBatchId: string;
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  quantity: number;
  collectionDate: string;
  expiryDate: string;
  daysToExpiry: number;
  storageStatus: StorageStatus;
  temperature: number; // e.g. 4.2 °C
  riskLevel: RiskLevel;
  traceabilityId: string;
  donorBatchRef?: string;
}

export interface ConsumptionRecord {
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  date: string;
  unitsUsed: number;
}

export interface ForecastRecord {
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  currentUnits: number;
  forecast7Days: number;
  confidence: 'High' | 'Medium' | 'Low';
  projectedGap: number; // e.g. -5 if shortage
  riskLevel: RiskLevel;
}

export interface RecommendationCheck {
  name: string;
  status: 'PASS' | 'FAIL' | 'REVIEW_REQUIRED';
  details: string;
}

export interface Recommendation {
  id: string;
  sourceHospitalId: string;
  sourceHospitalName: string;
  destinationHospitalId: string;
  destinationHospitalName: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  quantity: number;
  score: number; // 0-100
  status: RecommendationStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
  checks: RecommendationCheck[];
  timestamp: string;
  estimatedTransitTimeMinutes: number;
}

export interface RiskSummaryItem {
  id: string;
  type: 'EXPIRY' | 'SHORTAGE';
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  affectedUnits: number;
  severity: RiskLevel;
  details: string;
  daysRemainingOrGap: number;
}

export interface AlertItem {
  id: string;
  category: 'EXPIRY' | 'SHORTAGE' | 'STORAGE_REVIEW' | 'RECOMMENDATION';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  description: string;
  hospitalName: string;
  bloodGroup?: BloodGroup;
  timestamp: string;
  targetRoute: string;
  read: boolean;
}

export interface PrototypeSettings {
  expiryRiskWindowDays: number;
  forecastWindowDays: number;
  shortageThresholdUnits: number;
  safetyStrictProtocol: boolean;
  autoMatchRadiusKm: number;
  demoMode: boolean;
}
