export type WindowState  = "NORMAL" | "WATCH" | "RESCUE_WINDOW" | "UNRESCUABLE";
export type ShortageTier = "STABLE" | "WATCH" | "HIGH" | "CRITICAL";
export type RecStatus    = "GENERATED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CLOSED";
export type Component    = "RBC" | "PLATELETS" | "PLASMA";

export interface GateCheck {
  code: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ScoreFactors {
  er: number;
  sr: number;
  feas: number;
  cov: number;
  damp: number;
  gate: number;
  contrib_er: number;
  contrib_sr: number;
  contrib_feas: number;
  contrib_cov: number;
  raw: number;
  inputs: Record<string, number | string>;
}

export interface Explanation {
  why_source: string;
  why_destination: string;
  why_quantity: string;
  why_now: string;
}

export interface RecommendationItem {
  id: string;
  status: RecStatus;
  source_lot_id: string;
  source_facility_id: string;
  source_facility_name: string;
  dest_facility_id: string;
  dest_facility_name: string;
  blood_group: string;
  component: Component;
  units: number;
  rescue_score: number;
  transit_hours: number;
  factors: ScoreFactors;
  explanation: Explanation;
  checks: GateCheck[];          // always 8
  created_at: string;
}

export interface ExclusionItem {
  source_lot_id: string;
  source_facility_id: string;
  source_facility_name: string;
  dest_facility_id: string;
  dest_facility_name: string;
  blood_group: string;
  component: Component;
  failed_codes: string[];
  checks: GateCheck[];          // always 8
}

// Remaining shapes to be provided from backend contract (§7 / schemas.py):
// NetworkSummary, FacilityItem, LotRiskItem, ShortageItem, ReviewItem, CounterfactualResult, ShockResult
