import type {
  Hospital,
  InventoryItem,
  ForecastRecord,
  Recommendation,
  AlertItem,
  PrototypeSettings,
  ConsumptionRecord
} from '../types';

export const INITIAL_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Greenfield Medical Center', code: 'GMC-01', city: 'Metro North', location: { x: 220, y: 150 }, tier: 'Trauma Center', totalCapacity: 120 },
  { id: 'h2', name: 'City General Hospital', code: 'CGH-02', city: 'Central City', location: { x: 450, y: 220 }, tier: 'General Hospital', totalCapacity: 95 },
  { id: 'h3', name: 'Apollo Care Hospital', code: 'ACH-03', city: 'East District', location: { x: 620, y: 120 }, tier: 'Specialty Clinic', totalCapacity: 80 },
  { id: 'h4', name: 'Metro Blood Centre', code: 'MBC-04', city: 'Central Hub', location: { x: 380, y: 350 }, tier: 'Blood Center', totalCapacity: 250 },
  { id: 'h5', name: "St. Mary's Medical Institute", code: 'SMMI-05', city: 'South District', location: { x: 180, y: 380 }, tier: 'Trauma Center', totalCapacity: 110 },
  { id: 'h6', name: 'Sunrise Hospital', code: 'SH-06', city: 'West Valley', location: { x: 120, y: 240 }, tier: 'General Hospital', totalCapacity: 70 },
  { id: 'h7', name: 'Central Trauma Centre', code: 'CTC-07', city: 'Downtown Core', location: { x: 520, y: 410 }, tier: 'Trauma Center', totalCapacity: 140 },
  { id: 'h8', name: 'Lakeside Medical Center', code: 'LMC-08', city: 'North Lake', location: { x: 340, y: 90 }, tier: 'General Hospital', totalCapacity: 60 },
  { id: 'h9', name: 'Unity Healthcare', code: 'UH-09', city: 'East Suburbs', location: { x: 720, y: 280 }, tier: 'Specialty Clinic', totalCapacity: 75 },
  { id: 'h10', name: 'North District Hospital', code: 'NDH-10', city: 'Far North', location: { x: 500, y: 50 }, tier: 'General Hospital', totalCapacity: 50 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  // Golden Scenario Source Item
  {
    id: 'inv-001',
    unitOrBatchId: 'HG-O-RBC-00128',
    hospitalId: 'h1',
    hospitalName: 'Greenfield Medical Center',
    bloodGroup: 'O+',
    component: 'RBC',
    quantity: 20, // 7 units close to expiry, 12 surplus
    collectionDate: '2026-08-20',
    expiryDate: '2026-09-18', // 3 days left
    daysToExpiry: 3,
    storageStatus: 'NORMAL',
    temperature: 4.2,
    riskLevel: 'HIGH',
    traceabilityId: 'HG-O-RBC-00128',
    donorBatchRef: 'BATCH-2026-8802'
  },
  // Golden Scenario Destination Item
  {
    id: 'inv-002',
    unitOrBatchId: 'HG-O-RBC-00142',
    hospitalId: 'h2',
    hospitalName: 'City General Hospital',
    bloodGroup: 'O+',
    component: 'RBC',
    quantity: 6,
    collectionDate: '2026-09-02',
    expiryDate: '2026-10-05',
    daysToExpiry: 20,
    storageStatus: 'NORMAL',
    temperature: 3.9,
    riskLevel: 'CRITICAL',
    traceabilityId: 'HG-O-RBC-00142',
    donorBatchRef: 'BATCH-2026-9011'
  },
  // Other Hospital Inventory Items
  {
    id: 'inv-003',
    unitOrBatchId: 'HG-A-PLT-00301',
    hospitalId: 'h4',
    hospitalName: 'Metro Blood Centre',
    bloodGroup: 'A+',
    component: 'Platelets',
    quantity: 35,
    collectionDate: '2026-09-12',
    expiryDate: '2026-09-17',
    daysToExpiry: 2,
    storageStatus: 'NORMAL',
    temperature: 22.1,
    riskLevel: 'HIGH',
    traceabilityId: 'HG-A-PLT-00301'
  },
  {
    id: 'inv-004',
    unitOrBatchId: 'HG-ON-RBC-00412',
    hospitalId: 'h5',
    hospitalName: "St. Mary's Medical Institute",
    bloodGroup: 'O-',
    component: 'RBC',
    quantity: 14,
    collectionDate: '2026-08-28',
    expiryDate: '2026-09-21',
    daysToExpiry: 6,
    storageStatus: 'NORMAL',
    temperature: 4.0,
    riskLevel: 'WATCH',
    traceabilityId: 'HG-ON-RBC-00412'
  },
  {
    id: 'inv-005',
    unitOrBatchId: 'HG-B-FFP-00520',
    hospitalId: 'h3',
    hospitalName: 'Apollo Care Hospital',
    bloodGroup: 'B+',
    component: 'Plasma',
    quantity: 28,
    collectionDate: '2026-06-10',
    expiryDate: '2026-12-10',
    daysToExpiry: 86,
    storageStatus: 'NORMAL',
    temperature: -18.5,
    riskLevel: 'STABLE',
    traceabilityId: 'HG-B-FFP-00520'
  },
  {
    id: 'inv-006',
    unitOrBatchId: 'HG-ABN-RBC-00609',
    hospitalId: 'h7',
    hospitalName: 'Central Trauma Centre',
    bloodGroup: 'AB-',
    component: 'RBC',
    quantity: 3,
    collectionDate: '2026-08-30',
    expiryDate: '2026-09-25',
    daysToExpiry: 10,
    storageStatus: 'REVIEW_REQUIRED',
    temperature: 6.8, // Temperature spike
    riskLevel: 'CRITICAL',
    traceabilityId: 'HG-ABN-RBC-00609'
  },
  {
    id: 'inv-007',
    unitOrBatchId: 'HG-A-RBC-00780',
    hospitalId: 'h6',
    hospitalName: 'Sunrise Hospital',
    bloodGroup: 'A+',
    component: 'RBC',
    quantity: 18,
    collectionDate: '2026-08-25',
    expiryDate: '2026-09-19',
    daysToExpiry: 4,
    storageStatus: 'NORMAL',
    temperature: 4.1,
    riskLevel: 'HIGH',
    traceabilityId: 'HG-A-RBC-00780'
  },
  {
    id: 'inv-008',
    unitOrBatchId: 'HG-O-FFP-00892',
    hospitalId: 'h8',
    hospitalName: 'Lakeside Medical Center',
    bloodGroup: 'O+',
    component: 'Plasma',
    quantity: 40,
    collectionDate: '2026-07-01',
    expiryDate: '2027-01-01',
    daysToExpiry: 108,
    storageStatus: 'NORMAL',
    temperature: -20.0,
    riskLevel: 'STABLE',
    traceabilityId: 'HG-O-FFP-00892'
  },
  {
    id: 'inv-009',
    unitOrBatchId: 'HG-BP-PLT-00911',
    hospitalId: 'h9',
    hospitalName: 'Unity Healthcare',
    bloodGroup: 'B+',
    component: 'Platelets',
    quantity: 12,
    collectionDate: '2026-09-13',
    expiryDate: '2026-09-18',
    daysToExpiry: 3,
    storageStatus: 'NORMAL',
    temperature: 21.8,
    riskLevel: 'HIGH',
    traceabilityId: 'HG-BP-PLT-00911'
  },
  {
    id: 'inv-010',
    unitOrBatchId: 'HG-ON-RBC-01050',
    hospitalId: 'h10',
    hospitalName: 'North District Hospital',
    bloodGroup: 'O-',
    component: 'RBC',
    quantity: 4,
    collectionDate: '2026-09-01',
    expiryDate: '2026-10-02',
    daysToExpiry: 17,
    storageStatus: 'NORMAL',
    temperature: 3.8,
    riskLevel: 'CRITICAL',
    traceabilityId: 'HG-ON-RBC-01050'
  },
  {
    id: 'inv-011',
    unitOrBatchId: 'HG-ABP-FFP-01122',
    hospitalId: 'h1',
    hospitalName: 'Greenfield Medical Center',
    bloodGroup: 'AB+',
    component: 'Plasma',
    quantity: 22,
    collectionDate: '2026-08-10',
    expiryDate: '2026-11-10',
    daysToExpiry: 56,
    storageStatus: 'NORMAL',
    temperature: -19.2,
    riskLevel: 'STABLE',
    traceabilityId: 'HG-ABP-FFP-01122'
  },
  {
    id: 'inv-012',
    unitOrBatchId: 'HG-AN-RBC-01289',
    hospitalId: 'h4',
    hospitalName: 'Metro Blood Centre',
    bloodGroup: 'A-',
    component: 'RBC',
    quantity: 46,
    collectionDate: '2026-08-22',
    expiryDate: '2026-09-20',
    daysToExpiry: 5,
    storageStatus: 'NORMAL',
    temperature: 4.0,
    riskLevel: 'WATCH',
    traceabilityId: 'HG-AN-RBC-01289'
  },
];

export const INITIAL_FORECASTS: ForecastRecord[] = [
  // Golden Destination
  {
    hospitalId: 'h2',
    hospitalName: 'City General Hospital',
    bloodGroup: 'O+',
    component: 'RBC',
    currentUnits: 6,
    forecast7Days: 11,
    confidence: 'Medium',
    projectedGap: -5,
    riskLevel: 'CRITICAL'
  },
  // Golden Source
  {
    hospitalId: 'h1',
    hospitalName: 'Greenfield Medical Center',
    bloodGroup: 'O+',
    component: 'RBC',
    currentUnits: 20,
    forecast7Days: 8,
    confidence: 'High',
    projectedGap: 12, // Surplus
    riskLevel: 'HIGH' // Expiry risk
  },
  {
    hospitalId: 'h7',
    hospitalName: 'Central Trauma Centre',
    bloodGroup: 'AB-',
    component: 'RBC',
    currentUnits: 3,
    forecast7Days: 9,
    confidence: 'High',
    projectedGap: -6,
    riskLevel: 'CRITICAL'
  },
  {
    hospitalId: 'h10',
    hospitalName: 'North District Hospital',
    bloodGroup: 'O-',
    component: 'RBC',
    currentUnits: 4,
    forecast7Days: 8,
    confidence: 'Medium',
    projectedGap: -4,
    riskLevel: 'CRITICAL'
  },
  {
    hospitalId: 'h6',
    hospitalName: 'Sunrise Hospital',
    bloodGroup: 'A+',
    component: 'RBC',
    currentUnits: 18,
    forecast7Days: 21,
    confidence: 'High',
    projectedGap: -3,
    riskLevel: 'WATCH'
  },
  {
    hospitalId: 'h4',
    hospitalName: 'Metro Blood Centre',
    bloodGroup: 'A+',
    component: 'Platelets',
    currentUnits: 35,
    forecast7Days: 15,
    confidence: 'High',
    projectedGap: 20,
    riskLevel: 'HIGH' // Expiry risk for platelets
  },
  {
    hospitalId: 'h5',
    hospitalName: "St. Mary's Medical Institute",
    bloodGroup: 'O-',
    component: 'RBC',
    currentUnits: 14,
    forecast7Days: 16,
    confidence: 'Medium',
    projectedGap: -2,
    riskLevel: 'WATCH'
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  // Golden Primary Demo Scenario
  {
    id: 'HG-REC-001',
    sourceHospitalId: 'h1',
    sourceHospitalName: 'Greenfield Medical Center',
    destinationHospitalId: 'h2',
    destinationHospitalName: 'City General Hospital',
    bloodGroup: 'O+',
    component: 'RBC',
    quantity: 5,
    score: 94,
    status: 'ELIGIBLE_FOR_REVIEW',
    priority: 'HIGH',
    estimatedTransitTimeMinutes: 24,
    timestamp: '10 mins ago',
    reasons: [
      'High expiry risk at source (7 units expire in 3 days)',
      'Predicted shortage at destination (Projected gap: -5 units)',
      'Eligible inventory available with verified temperature history',
      'Storage status acceptable (4.2°C continuous cold chain)',
      'Within configured 5-day expiry window',
      'Full batch traceability available (HG-O-RBC-00128)'
    ],
    checks: [
      { name: 'Expiry Window Check', status: 'PASS', details: 'Unit has 3 days remaining (Threshold: 5 days)' },
      { name: 'Cold Chain & Storage Status', status: 'PASS', details: 'Normal storage, 4.2°C log continuous' },
      { name: 'Component & Blood Group Match', status: 'PASS', details: 'Identical O+ RBC unit specification' },
      { name: 'Redistribution Eligibility Gate', status: 'PASS', details: 'Source surplus (12 units) exceeds requested quantity (5 units)' },
      { name: 'Traceability & Quarantine Log', status: 'PASS', details: 'Verified donor batch HG-O-RBC-00128' },
      { name: 'Authorized Review Protocol', status: 'PASS', details: 'Configured for dual-signoff blood bank protocol' }
    ]
  },
  {
    id: 'HG-REC-002',
    sourceHospitalId: 'h4',
    sourceHospitalName: 'Metro Blood Centre',
    destinationHospitalId: 'h9',
    destinationHospitalName: 'Unity Healthcare',
    bloodGroup: 'A+',
    component: 'Platelets',
    quantity: 4,
    score: 88,
    status: 'ELIGIBLE_FOR_REVIEW',
    priority: 'HIGH',
    estimatedTransitTimeMinutes: 18,
    timestamp: '35 mins ago',
    reasons: [
      'Short platelet lifespan at source (2 days remaining)',
      'Acute surgical demand forecasted at destination',
      'Short transport radius (18 mins)'
    ],
    checks: [
      { name: 'Expiry Window Check', status: 'PASS', details: '2 days to expiry' },
      { name: 'Cold Chain & Storage Status', status: 'PASS', details: '22.1°C agitation log normal' },
      { name: 'Component & Blood Group Match', status: 'PASS', details: 'A+ Platelets matched' },
      { name: 'Redistribution Eligibility Gate', status: 'PASS', details: 'Surplus verified' },
      { name: 'Traceability & Quarantine Log', status: 'PASS', details: 'Batch verified' },
      { name: 'Authorized Review Protocol', status: 'PASS', details: 'Pending medical review' }
    ]
  },
  {
    id: 'HG-REC-003',
    sourceHospitalId: 'h5',
    sourceHospitalName: "St. Mary's Medical Institute",
    destinationHospitalId: 'h10',
    destinationHospitalName: 'North District Hospital',
    bloodGroup: 'O-',
    component: 'RBC',
    quantity: 3,
    score: 82,
    status: 'NEW',
    priority: 'MEDIUM',
    estimatedTransitTimeMinutes: 42,
    timestamp: '1 hour ago',
    reasons: [
      'Universal donor O- reserve optimization',
      'Prevent critical deficit at North District'
    ],
    checks: [
      { name: 'Expiry Window Check', status: 'PASS', details: '6 days remaining' },
      { name: 'Cold Chain & Storage Status', status: 'PASS', details: '4.0°C normal' },
      { name: 'Component & Blood Group Match', status: 'PASS', details: 'O- RBC matched' },
      { name: 'Redistribution Eligibility Gate', status: 'PASS', details: 'Eligible reserve' },
      { name: 'Traceability & Quarantine Log', status: 'PASS', details: 'Batch verified' },
      { name: 'Authorized Review Protocol', status: 'PASS', details: 'Pending protocol' }
    ]
  },
  {
    id: 'HG-REC-004',
    sourceHospitalId: 'h1',
    sourceHospitalName: 'Greenfield Medical Center',
    destinationHospitalId: 'h7',
    destinationHospitalName: 'Central Trauma Centre',
    bloodGroup: 'AB-',
    component: 'RBC',
    quantity: 2,
    score: 45,
    status: 'EXCLUDED',
    priority: 'LOW',
    estimatedTransitTimeMinutes: 30,
    timestamp: '2 hours ago',
    reasons: [
      'Temperature spike detected in storage unit at Central Trauma Centre',
      'Failed safety gate: Storage condition requires review'
    ],
    checks: [
      { name: 'Expiry Window Check', status: 'PASS', details: '10 days remaining' },
      { name: 'Cold Chain & Storage Status', status: 'FAIL', details: 'Storage temperature spike (6.8°C exceeds 6.0°C safety limit)' },
      { name: 'Component & Blood Group Match', status: 'PASS', details: 'AB- RBC matched' },
      { name: 'Redistribution Eligibility Gate', status: 'FAIL', details: 'Candidate excluded due to storage anomaly' },
      { name: 'Traceability & Quarantine Log', status: 'PASS', details: 'Batch verified' },
      { name: 'Authorized Review Protocol', status: 'FAIL', details: 'Excluded pending technical inspection' }
    ]
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-001',
    category: 'EXPIRY',
    severity: 'HIGH',
    title: '12 Units O+ RBC Approaching Expiry Window',
    description: 'Greenfield Medical Center has 7 units expiring in 3 days. Total surplus available: 12 units.',
    hospitalName: 'Greenfield Medical Center',
    bloodGroup: 'O+',
    timestamp: '15 mins ago',
    targetRoute: '/recommendations',
    read: false
  },
  {
    id: 'alt-002',
    category: 'SHORTAGE',
    severity: 'CRITICAL',
    title: 'Predicted Deficit of 5 Units O+ RBC',
    description: 'City General Hospital current stock is 6 units against 11 units 7-day projected demand.',
    hospitalName: 'City General Hospital',
    bloodGroup: 'O+',
    timestamp: '25 mins ago',
    targetRoute: '/forecast',
    read: false
  },
  {
    id: 'alt-003',
    category: 'STORAGE_REVIEW',
    severity: 'HIGH',
    title: 'Storage Temperature Anomaly Detected',
    description: 'Central Trauma Centre Unit AB- (HG-ABN-RBC-00609) reported 6.8°C. Candidate candidate excluded.',
    hospitalName: 'Central Trauma Centre',
    bloodGroup: 'AB-',
    timestamp: '1 hour ago',
    targetRoute: '/inventory',
    read: false
  },
  {
    id: 'alt-004',
    category: 'RECOMMENDATION',
    severity: 'MEDIUM',
    title: 'High-Priority Redistribution Candidate Available',
    description: 'Greenfield → City General (5 units O+ RBC). Score: 94/100.',
    hospitalName: 'Greenfield Medical Center',
    bloodGroup: 'O+',
    timestamp: '10 mins ago',
    targetRoute: '/recommendations',
    read: true
  }
];

export const INITIAL_CONSUMPTION: ConsumptionRecord[] = [
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-08', unitsUsed: 4 },
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-09', unitsUsed: 3 },
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-10', unitsUsed: 5 },
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-11', unitsUsed: 2 },
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-12', unitsUsed: 4 },
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-13', unitsUsed: 3 },
  { hospitalId: 'h1', hospitalName: 'Greenfield Medical Center', bloodGroup: 'O+', component: 'RBC', date: '2026-09-14', unitsUsed: 3 },

  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-08', unitsUsed: 7 },
  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-09', unitsUsed: 8 },
  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-10', unitsUsed: 6 },
  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-11', unitsUsed: 9 },
  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-12', unitsUsed: 11 },
  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-13', unitsUsed: 10 },
  { hospitalId: 'h2', hospitalName: 'City General Hospital', bloodGroup: 'O+', component: 'RBC', date: '2026-09-14', unitsUsed: 12 }
];

export const DEFAULT_SETTINGS: PrototypeSettings = {
  expiryRiskWindowDays: 5,
  forecastWindowDays: 7,
  shortageThresholdUnits: 5,
  safetyStrictProtocol: true,
  autoMatchRadiusKm: 50,
  demoMode: true
};
