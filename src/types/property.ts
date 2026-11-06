export type DistressType =
  | 'Sheriff Foreclosure Auction'
  | 'Tax Lien Certificate'
  | 'Tax Deed Sale'
  | 'Bank-Owned REO'
  | 'Pre-Foreclosure / Short Sale'
  | 'Probate / Estate Distress'
  | 'Distressed Value-Add Land';

export type ZoningClassification =
  | 'AG-1 (Exclusive Agricultural)'
  | 'AG-2 (General Agricultural & Agritourism)'
  | 'RC (Rural Commercial / Highway)'
  | 'M-1 (Light Industrial & Storage)'
  | 'R-R (Rural Residential & Hobby Farm)'
  | 'MU-R (Mixed-Use Rural)';

export interface WebCitation {
  title: string;
  url: string;
  sourceType: 'Government / USDA' | 'Municipal Zoning' | 'Local Market Study' | 'Tourism / Chamber' | 'Real Estate Data';
  excerpt: string;
}

export interface BusinessOpportunity {
  id: string;
  name: string;
  category: 'Agritourism & Events' | 'High-Value Food Production' | 'Commercial & Storage' | 'Hospitality / Eco-Stay' | 'Renewable Energy' | 'Artisanal Processing';
  startupCapex: number;
  estAnnualRevenue: number;
  estAnnualNOI: number;
  paybackPeriodYears: number;
  roiPercentage: number;
  whyUniqueToArea: string;
  keyRegulatoryHurdle: string;
  citations: WebCitation[];
}

export interface FoodCropSuitability {
  cropName: string;
  scientificFamily: string;
  suitabilityScore: number; // 0 - 100
  harvestWindow: string;
  estYieldPerAcre: string;
  estGrossRevenuePerAcre: number;
  waterRequirement: 'Very Low (Dryland)' | 'Low - Moderate' | 'Moderate (Drip)' | 'High (Irrigation Mandated)';
  soilPhPreference: string;
  soilTextureFit: string;
  marketDemandRating: 'High Niche / Premium' | 'Strong Wholesale' | 'Regional Direct-to-Consumer' | 'Export Grade';
  agronomicNotes: string;
}

export interface SoilProfile {
  soilSeries: string;
  usdaTaxonomy: string;
  textureDescription: string;
  phRange: [number, number];
  organicMatterPercentage: number;
  drainageClass: 'Excessively Drained' | 'Well Drained' | 'Moderately Well Drained' | 'Somewhat Poorly Drained';
  hardinessZone: string;
  frostFreeDays: number;
  annualRainfallInches: number;
  waterRightsIncluded: boolean;
  waterTableDepthFt: string;
  nrcsSoilSurveyRating: 'Prime Farmland' | 'Farmland of Statewide Importance' | 'Prime if Irrigated' | 'Not Prime';
}

export interface ZoningDetails {
  code: string;
  title: string;
  jurisdiction: string;
  permittedUses: string[];
  conditionalUses: string[];
  prohibitedUses: string[];
  setbacks: {
    frontFt: number;
    sideFt: number;
    rearFt: number;
  };
  maxBuildingHeightFt: number;
  maxLotCoveragePercent: number;
  minimumLotSizeAcres: number;
  overlayDistricts: string[];
  agRollbackTaxRisk: boolean;
  ordinanceRefUrl?: string;
}

export interface LienRecord {
  lienType: 'County Ad Valorem Tax' | '1st Mortgage / Deed of Trust' | '2nd Junior Mortgage' | 'Municipal Weed & Code Enforcement' | 'HOA / POA Special Assessment' | 'Mechanics Lien';
  claimant: string;
  amount: number;
  priority: 'Super-Priority' | 'Senior' | 'Junior' | 'Subordinate';
  status: 'Survives Foreclosure' | 'Extinguished at Sale' | 'Subject to Redemption' | 'Must Be Cleared';
  notes: string;
}

export interface FinancialMetrics {
  askingOrOpeningBid: number;
  estimatedARV: number;
  taxAssessedValue: number;
  delinquentTaxesTotal: number;
  juniorLiensTotal: number;
  estimatedClearingCosts: number;
  estimatedCapExRehab: number;
  holdingCostsAnnual: number;
  redemptionPeriodMonths: number;
  statutoryRedemptionInterestRate?: number; // e.g. 18% in Texas or Florida
  grossRentalPotentialAnnual: number;
  netOperatingIncomeProjected: number;
  capRate: number;
  cashOnCashReturn: number;
  irr5Year: number;
  lienToValueRatio: number;
  equitySpreadDiscount: number; // % discount below ARV
}

export interface LandGrantProgram {
  id: string;
  name: string;
  agency: string;
  grantType: 'Federal Cost-Share' | 'Renewable Energy Grant' | 'Conservation Subsidy' | 'Value-Added Ag Grant' | 'New & Beginning Farmer' | 'State Preservation';
  maxFundingAmount: number;
  matchRequirement: string;
  purpose: string;
  eligibilityCriteria: string;
  implementationSteps: string[];
  applicationWindow: string;
  officialUrl: string;
}

export interface InvestmentProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parcelIdAPN: string;
  acreage: number;
  distressType: DistressType;
  auctionDate?: string;
  auctionVenue?: string;
  isRedemptionPeriodActive: boolean;
  propertyType: 'Agricultural Land' | 'Mixed-Use Commercial & Ag' | 'Farmstead with Structures' | 'Rural Industrial' | 'Specialty Orchard / Vineyard' | 'Unimproved Acreage';
  currentCondition: 'Vacant Land' | 'Distressed Structures' | 'Operational Farm Needs Capital' | 'Abandoned Commercial / Ag Transition';
  imageUrl: string;
  summaryPitch: string;
  soil: SoilProfile;
  suitableCrops: FoodCropSuitability[];
  zoning: ZoningDetails;
  liens: LienRecord[];
  businessIdeas: BusinessOpportunity[];
  financials: FinancialMetrics;
  eligibleLandGrants?: LandGrantProgram[];
  tags: string[];
  featured?: boolean;
}

export interface FilterOptions {
  searchQuery: string;
  state: string;
  distressTypes: DistressType[];
  cropCategories: string[];
  businessCategories: string[];
  zoningTypes: string[];
  minAcreage: number;
  maxAcreage: number;
  minPrice: number;
  maxPrice: number;
  maxLienRisk: 'All' | 'Clean / Low Risk' | 'Moderate' | 'High Yield / Complex';
  soilQualityOnlyPrime: boolean;
  grantCategory?: string;
  minGrantFunding?: number;
  onlyValidated?: boolean;
  sortBy: 'price-low' | 'price-high' | 'cap-rate-high' | 'acreage-high' | 'arv-discount-high';
}

export type LegitimacyVerdict = 'VERIFIED_LEGITIMATE' | 'CONDITIONAL_CAUTION' | 'IRREGULAR_HIGH_RISK';

export interface LegitimacyCheck {
  category: 'County Title & APN' | 'Lien Survival & Debt' | 'NRCS Soil & Bioscience' | 'Satellite & Access' | 'Legal Notice & Docket';
  item: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  detail: string;
}

export interface PubChemSoilCompound {
  name: string;
  cid: number;
  formula: string;
  agronomicRole: string;
}

export interface PubMedAgronomyCitation {
  title: string;
  pmid: string;
  year: string;
  journal: string;
  finding: string;
}

export interface BioscienceSoilProfile {
  cationExchangeCapacity: number; // meq/100g (e.g., 18 - 32)
  soilPhBufferIndex: number;
  npkBioavailability: {
    nitrogenLevel: string; // e.g., 'Medium-High (42 ppm NO3-N)'
    phosphorusLevel: string; // e.g., 'Optimal (35 ppm Bray-P1)'
    potassiumLevel: string; // e.g., 'High (240 ppm exchangeable K)'
  };
  micronutrients: {
    zincPpm: number;
    ironPpm: number;
    manganesePpm: number;
    boronPpm: number;
  };
  biologicalOrganicActivity: string; // e.g., 'High active carbon, robust vesicular-arbuscular mycorrhizal network'
  microbialDiversityRating: 'Exceptional (Forest-Ag Ecotone)' | 'Robust Native Microbial Biome' | 'Moderate (Fallow Restorative)' | 'Requires Inoculant';
  pubChemCompounds: PubChemSoilCompound[];
  pubMedCitations: PubMedAgronomyCitation[];
}

export interface LegitimacyValidationReport {
  propertyId: string;
  propertyTitle: string;
  legitimacyScore: number; // 0 - 100
  verdict: LegitimacyVerdict;
  summaryVerdictText: string;
  titleAudit: {
    apnValid: boolean;
    countyDocketStatus: string;
    survivingSeniorLiensCount: number;
    wipedJuniorLiensCount: number;
    netSurvivingDebt: number;
    summary: string;
  };
  bioscienceSoilAudit: BioscienceSoilProfile;
  checks: LegitimacyCheck[];
  searchGroundingSources: { title: string; url: string }[];
  mapsGroundingSources: { title: string; uri: string; address?: string }[];
  detailedMemo: string;
  riskFlags: string[];
  recommendation: string;
  verifiedAt: string;
}

export interface SavedPropertyRecord {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  askingOrOpeningBid: number;
  estimatedARV: number;
  distressType: string;
  notes?: string;
  savedAt: string;
}

export interface UserValidationRecord {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  county: string;
  state: string;
  legitimacyScore: number;
  verdict: string;
  riskLevel: string;
  bioscienceScore?: number;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  sources?: { title: string; url?: string; uri?: string }[];
}


