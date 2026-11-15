import { FilterOptions, InvestmentProperty, LienRecord, SoilProfile } from '../types/property';

/**
 * Calculates Capitalization Rate (Cap Rate)
 * Cap Rate = (Net Operating Income / Total Acquisition Cost) * 100
 */
export function calculateCapRate(annualNOI: number, totalCost: number): number {
  if (totalCost <= 0) return 0;
  const rate = (annualNOI / totalCost) * 100;
  return Number(rate.toFixed(2));
}

/**
 * Calculates Cash-on-Cash Return
 * CoC = (Net Annual Pre-Tax Cash Flow / Total Initial Cash Invested) * 100
 */
export function calculateCashOnCash(
  netAnnualCashFlow: number,
  cashInvested: number
): number {
  if (cashInvested <= 0) return 0;
  const coc = (netAnnualCashFlow / cashInvested) * 100;
  return Number(coc.toFixed(2));
}

/**
 * Calculates Total Senior Surviving Liens
 * Distressed auctions often wipe junior deeds of trust, but super-priority liens
 * (County property taxes, municipal code enforcement) remain attached to the deed.
 */
export function calculateSurvivingLienExposure(liens: LienRecord[]): {
  survivingTotal: number;
  extinguishedTotal: number;
  allLiensTotal: number;
} {
  let survivingTotal = 0;
  let extinguishedTotal = 0;

  for (const lien of liens) {
    if (lien.status === 'Survives Foreclosure' || lien.status === 'Must Be Cleared') {
      survivingTotal += lien.amount;
    } else {
      extinguishedTotal += lien.amount;
    }
  }

  return {
    survivingTotal,
    extinguishedTotal,
    allLiensTotal: survivingTotal + extinguishedTotal,
  };
}

/**
 * Calculates Equity Spread and Discount below ARV
 */
export function calculateEquitySpread(
  arv: number,
  purchaseBid: number,
  clearingCosts: number,
  rehabCapEx: number
): {
  totalBasis: number;
  netEquity: number;
  discountPercentage: number;
} {
  const totalBasis = purchaseBid + clearingCosts + rehabCapEx;
  const netEquity = Math.max(0, arv - totalBasis);
  const discountPercentage = arv > 0 ? ((arv - totalBasis) / arv) * 100 : 0;

  return {
    totalBasis,
    netEquity,
    discountPercentage: Number(discountPercentage.toFixed(1)),
  };
}

/**
 * 70% Rule Maximum Allowable Offer (MAO) adapted for agricultural / commercial distressed property
 * MAO = (ARV * Target LTV) - (Rehab + Lien Clearing Costs)
 */
export function calculateMaxAllowableOffer(
  arv: number,
  rehabCapEx: number,
  clearingCosts: number,
  targetLtv = 0.65
): number {
  const offer = arv * targetLtv - (rehabCapEx + clearingCosts);
  return Math.max(0, Math.round(offer));
}

/**
 * Calculates Total Potential Land Grant Funding available for a parcel
 */
export function calculateTotalGrantFunding(grants: Array<{ maxFundingAmount: number }>): number {
  if (!grants || !Array.isArray(grants)) return 0;
  return grants.reduce((sum, g) => sum + (g.maxFundingAmount || 0), 0);
}

/**
 * Scores soil suitability (0 to 100) based on drainage, pH range, and USDA rating
 */
export function scoreSoilQuality(soil: SoilProfile): number {
  let score = 50;

  if (soil.nrcsSoilSurveyRating === 'Prime Farmland') score += 25;
  else if (soil.nrcsSoilSurveyRating === 'Farmland of Statewide Importance') score += 18;
  else if (soil.nrcsSoilSurveyRating === 'Prime if Irrigated') score += 15;

  if (soil.drainageClass === 'Well Drained') score += 15;
  else if (soil.drainageClass === 'Moderately Well Drained') score += 10;
  else if (soil.drainageClass === 'Somewhat Poorly Drained') score -= 10;

  if (soil.waterRightsIncluded) score += 10;

  return Math.min(100, Math.max(0, score));
}

/**
 * Filters and sorts properties based on investor criteria
 */
export function filterAndSortProperties(
  properties: InvestmentProperty[],
  filters: FilterOptions
): InvestmentProperty[] {
  return properties
    .filter((prop) => {
      // Search query (title, address, county, city, tags, business ideas)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchCity = prop.city.toLowerCase().includes(q);
        const matchCounty = prop.county.toLowerCase().includes(q);
        const matchState = prop.state.toLowerCase().includes(q);
        const matchTags = prop.tags.some((t) => t.toLowerCase().includes(q));
        const matchCrops = prop.suitableCrops.some((c) =>
          c.cropName.toLowerCase().includes(q)
        );
        const matchBusiness = prop.businessIdeas.some((b) =>
          b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchCity && !matchCounty && !matchState && !matchTags && !matchCrops && !matchBusiness) {
          return false;
        }
      }

      // State filter
      if (filters.state && prop.state !== filters.state) {
        return false;
      }

      // Distress type
      if (
        filters.distressTypes.length > 0 &&
        !filters.distressTypes.includes(prop.distressType)
      ) {
        return false;
      }

      // Price range
      if (
        prop.financials.askingOrOpeningBid < filters.minPrice ||
        prop.financials.askingOrOpeningBid > filters.maxPrice
      ) {
        return false;
      }

      // Acreage range
      if (
        prop.acreage < filters.minAcreage ||
        prop.acreage > filters.maxAcreage
      ) {
        return false;
      }

      // Soil prime only
      if (filters.soilQualityOnlyPrime) {
        if (
          prop.soil.nrcsSoilSurveyRating !== 'Prime Farmland' &&
          prop.soil.nrcsSoilSurveyRating !== 'Farmland of Statewide Importance'
        ) {
          return false;
        }
      }

      // Crop category match
      if (filters.cropCategories.length > 0) {
        const hasCropMatch = prop.suitableCrops.some((crop) =>
          filters.cropCategories.some((cat) =>
            crop.cropName.toLowerCase().includes(cat.toLowerCase()) ||
            crop.scientificFamily.toLowerCase().includes(cat.toLowerCase())
          )
        );
        if (!hasCropMatch) return false;
      }

      // Business category match
      if (filters.businessCategories.length > 0) {
        const hasBusinessMatch = prop.businessIdeas.some((idea) =>
          filters.businessCategories.includes(idea.category)
        );
        if (!hasBusinessMatch) return false;
      }

      // Zoning type
      if (filters.zoningTypes.length > 0) {
        const hasZoningMatch = filters.zoningTypes.some((z) =>
          prop.zoning.code.toLowerCase().includes(z.toLowerCase()) ||
          prop.zoning.title.toLowerCase().includes(z.toLowerCase())
        );
        if (!hasZoningMatch) return false;
      }

      // Lien Risk Filter
      if (filters.maxLienRisk === 'Clean / Low Risk') {
        const { survivingTotal } = calculateSurvivingLienExposure(prop.liens);
        if (survivingTotal > 20000 || prop.financials.lienToValueRatio > 0.15) {
          return false;
        }
      } else if (filters.maxLienRisk === 'Moderate') {
        if (prop.financials.lienToValueRatio > 0.4) {
          return false;
        }
      }

      // Land Grant Programs Filter
      if (filters.minGrantFunding && filters.minGrantFunding > 0) {
        const totalGrants = calculateTotalGrantFunding(prop.eligibleLandGrants || []);
        if (totalGrants < filters.minGrantFunding) {
          return false;
        }
      }

      if (filters.grantCategory) {
        const hasCategory = (prop.eligibleLandGrants || []).some(
          (g) =>
            g.grantType.toLowerCase().includes(filters.grantCategory!.toLowerCase()) ||
            g.name.toLowerCase().includes(filters.grantCategory!.toLowerCase())
        );
        if (!hasCategory) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.financials.askingOrOpeningBid - b.financials.askingOrOpeningBid;
        case 'price-high':
          return b.financials.askingOrOpeningBid - a.financials.askingOrOpeningBid;
        case 'cap-rate-high':
          return b.financials.capRate - a.financials.capRate;
        case 'acreage-high':
          return b.acreage - a.acreage;
        case 'arv-discount-high':
          return b.financials.equitySpreadDiscount - a.financials.equitySpreadDiscount;
        default:
          return 0;
      }
    });
}

import {
  CropProjectionInput,
  MaintenanceExpenseInput,
  CropYearProjection,
  FiveYearProjectionResult
} from '../types/property';

/**
 * Calculates 5-Year Financial Projection incorporating:
 * - Crop yield growth (maturity curve)
 * - Unit market price inflation
 * - Variable crop production expenses
 * - Itemized property & equipment maintenance costs
 * - Inflation escalation on maintenance
 * - Land grant subsidies & capital offsets
 * - Property terminal land appreciation (compounded)
 * - Returns 5-Year CAGR, Total ROI, and Break-Even timeline
 */
export function calculateFiveYearCropROI(
  property: InvestmentProperty,
  crops: CropProjectionInput[],
  maintenance: MaintenanceExpenseInput,
  options?: {
    customPurchaseBid?: number;
    customInitialCapEx?: number;
    annualLandAppreciationPct?: number; // default 4.5%
    grantSubsidyAnnualShare?: number; // annual grant drawdown
  }
): FiveYearProjectionResult {
  const purchasePrice = options?.customPurchaseBid ?? property.financials.askingOrOpeningBid;
  const initialCapEx = options?.customInitialCapEx ?? property.financials.estimatedCapExRehab;
  const { survivingTotal } = calculateSurvivingLienExposure(property.liens);
  const closingAndClearing = property.financials.estimatedClearingCosts || (survivingTotal + 3500);

  // Total initial cash basis
  const initialInvestmentBasis = Math.max(1, purchasePrice + initialCapEx + closingAndClearing);
  const landAppreciationRate = (options?.annualLandAppreciationPct ?? 4.5) / 100;

  // Annual land grant subsidy amortized (e.g., EQIP or CSP over 5 years)
  const totalGrantPool = calculateTotalGrantFunding(property.eligibleLandGrants || []);
  const annualGrantSubsidy = options?.grantSubsidyAnnualShare ?? Math.min(25000, Math.round(totalGrantPool / 5));

  const yearByYear: CropYearProjection[] = [];
  let cumulativeCashFlow = 0;
  let breakEvenYear: number | null = null;
  let fiveYearTotalGrossRevenue = 0;
  let fiveYearTotalMaintenanceExpenses = 0;

  let currentLandValue = property.financials.estimatedARV || (purchasePrice * 1.35);

  for (let year = 1; year <= 5; year++) {
    // 1. Calculate Crop Revenue and Direct Production Costs
    let yearGrossCropRev = 0;
    let yearCropProdCosts = 0;

    for (const crop of crops) {
      // Yield increases with maturity up to peak in year 4/5
      const maturityMultiplier = Math.pow(1 + crop.annualYieldGrowthPct / 100, year - 1);
      const priceMultiplier = Math.pow(1 + crop.annualPriceInflationPct / 100, year - 1);

      const effectiveYieldPerAcre = crop.expectedYieldPerAcre * maturityMultiplier;
      const effectivePrice = crop.pricePerUnit * priceMultiplier;
      const totalUnitsHarvested = effectiveYieldPerAcre * crop.plantedAcres;

      const cropGross = totalUnitsHarvested * effectivePrice;
      const cropCosts = crop.annualProductionCostPerAcre * crop.plantedAcres * Math.pow(1 + 0.025, year - 1);

      yearGrossCropRev += cropGross;
      yearCropProdCosts += cropCosts;
    }

    const cropNetMargin = yearGrossCropRev - yearCropProdCosts;

    // 2. Calculate Itemized Maintenance Costs with Inflation
    const expenseInflation = Math.pow(1 + maintenance.annualExpenseInflationPct / 100, year - 1);
    const baseMaintenanceSum =
      maintenance.propertyTaxesAnnual +
      maintenance.insuranceAndLiability +
      maintenance.irrigationAndWaterPumping +
      maintenance.soilAmendmentAndCompost +
      maintenance.equipmentRepairsAndFuel +
      maintenance.laborAndManagement +
      maintenance.contingencyReserves;

    const totalMaintenanceCosts = Math.round(baseMaintenanceSum * expenseInflation);

    // 3. Subsidies & Net Operating Income
    const subsidies = year <= 3 ? annualGrantSubsidy : Math.round(annualGrantSubsidy * 0.5); // Grants front-loaded
    const netOperatingIncome = Math.round(cropNetMargin - totalMaintenanceCosts + subsidies);

    // Debt service or property holding costs
    const holdingCosts = Math.round((property.financials.holdingCostsAnnual || 4500) * Math.pow(1.02, year - 1));
    const netCashFlow = netOperatingIncome - holdingCosts;

    cumulativeCashFlow += netCashFlow;

    // Land Appreciation Terminal Track
    currentLandValue = Math.round(currentLandValue * (1 + landAppreciationRate));

    // Annual ROI on Basis
    const yearRoiPct = Number(((netCashFlow / initialInvestmentBasis) * 100).toFixed(2));

    // Check break-even point
    if (cumulativeCashFlow >= initialInvestmentBasis && breakEvenYear === null) {
      const priorCumulative = cumulativeCashFlow - netCashFlow;
      const deficit = initialInvestmentBasis - priorCumulative;
      const fraction = netCashFlow > 0 ? deficit / netCashFlow : 1;
      breakEvenYear = Number(((year - 1) + Math.min(0.99, Math.max(0.01, fraction))).toFixed(1));
    }

    fiveYearTotalGrossRevenue += yearGrossCropRev;
    fiveYearTotalMaintenanceExpenses += totalMaintenanceCosts + yearCropProdCosts;

    yearByYear.push({
      year,
      grossCropRevenue: Math.round(yearGrossCropRev),
      totalProductionCosts: Math.round(yearCropProdCosts),
      cropNetMargin: Math.round(cropNetMargin),
      totalMaintenanceCosts,
      landGrantSubsidiesReceived: subsidies,
      netOperatingIncome,
      debtServiceOrHoldingCosts: holdingCosts,
      netCashFlow,
      cumulativeCashFlow,
      estimatedLandAppreciationValue: currentLandValue,
      yearRoiPct
    });
  }

  const fiveYearTotalNetCashFlow = cumulativeCashFlow;
  const terminalLandEquity = currentLandValue;
  // Total Net Profit = All Cumulative Cash Flows + Land Value Gain above Basis
  const landGain = terminalLandEquity - purchasePrice;
  const fiveYearNetProfit = fiveYearTotalNetCashFlow + landGain;

  // 5-Year Total ROI % = (Net Profit / Initial Investment Basis) * 100
  const fiveYearTotalROI = Number(((fiveYearNetProfit / initialInvestmentBasis) * 100).toFixed(1));

  // Annualized Compound ROI (CAGR)
  const totalReturnMultiple = (initialInvestmentBasis + fiveYearNetProfit) / initialInvestmentBasis;
  const fiveYearAnnualizedROI = totalReturnMultiple > 0
    ? Number(((Math.pow(totalReturnMultiple, 1 / 5) - 1) * 100).toFixed(1))
    : 0;

  return {
    propertyId: property.id,
    propertyTitle: property.title,
    initialInvestmentBasis: Math.round(initialInvestmentBasis),
    breakEvenYear,
    fiveYearTotalGrossRevenue: Math.round(fiveYearTotalGrossRevenue),
    fiveYearTotalMaintenanceExpenses: Math.round(fiveYearTotalMaintenanceExpenses),
    fiveYearTotalNetCashFlow: Math.round(fiveYearTotalNetCashFlow),
    fiveYearEstimatedTerminalValue: Math.round(currentLandValue),
    fiveYearNetProfit: Math.round(fiveYearNetProfit),
    fiveYearAnnualizedROI,
    fiveYearTotalROI,
    yearByYear
  };
}

/**
 * Builds sensible default crop inputs from the property's agronomic profile
 */
export function getDefaultCropInputs(property: InvestmentProperty): CropProjectionInput[] {
  if (property.suitableCrops && property.suitableCrops.length > 0) {
    return property.suitableCrops.slice(0, 3).map((crop, idx) => {
      // Allocate acreage across top crops
      const share = idx === 0 ? 0.6 : idx === 1 ? 0.25 : 0.15;
      const plantedAcres = Math.max(1, Math.round(property.acreage * share * 10) / 10);

      // Parse yield string if formatted like "14,000 lbs / acre" or "450 bushels / acre"
      const numMatch = crop.estYieldPerAcre.replace(/,/g, '').match(/\d+/);
      const expectedYield = numMatch ? parseInt(numMatch[0], 10) : 8000;
      const isLbs = crop.estYieldPerAcre.toLowerCase().includes('lb');
      const isBushel = crop.estYieldPerAcre.toLowerCase().includes('bushel');
      const isTon = crop.estYieldPerAcre.toLowerCase().includes('ton');

      const unit = isLbs ? 'lbs' : isBushel ? 'bushels' : isTon ? 'tons' : 'crates';
      const pricePerUnit = isLbs
        ? Number((crop.estGrossRevenuePerAcre / Math.max(1, expectedYield)).toFixed(2))
        : isBushel
        ? 14.5
        : 4.5;

      return {
        cropName: crop.cropName,
        plantedAcres,
        expectedYieldPerAcre: expectedYield,
        yieldUnit: unit,
        pricePerUnit: Math.max(0.5, pricePerUnit),
        annualYieldGrowthPct: 4.0,
        annualPriceInflationPct: 2.5,
        annualProductionCostPerAcre: Math.round(crop.estGrossRevenuePerAcre * 0.32)
      };
    });
  }

  // Fallback default
  return [
    {
      cropName: 'Organic Specialty Crop',
      plantedAcres: Math.max(2, Math.round(property.acreage * 0.7)),
      expectedYieldPerAcre: 9500,
      yieldUnit: 'lbs',
      pricePerUnit: 2.85,
      annualYieldGrowthPct: 4.5,
      annualPriceInflationPct: 2.5,
      annualProductionCostPerAcre: 5200
    }
  ];
}

/**
 * Builds sensible default maintenance inputs from property scale and type
 */
export function getDefaultMaintenanceInputs(property: InvestmentProperty): MaintenanceExpenseInput {
  const acres = property.acreage;
  const price = property.financials.askingOrOpeningBid;

  const propertyTaxes = Math.round(price * 0.012); // ~1.2% effective ag rate
  const insurance = Math.round(Math.max(1200, acres * 85));
  const waterPumping = Math.round(Math.max(1500, acres * 140));
  const soilAmendment = Math.round(Math.max(1800, acres * 120));
  const equipmentFuel = Math.round(Math.max(2200, acres * 160));
  const labor = Math.round(Math.max(4000, acres * 350));
  const reserves = Math.round(Math.max(1000, acres * 60));

  return {
    propertyTaxesAnnual: propertyTaxes,
    insuranceAndLiability: insurance,
    irrigationAndWaterPumping: waterPumping,
    soilAmendmentAndCompost: soilAmendment,
    equipmentRepairsAndFuel: equipmentFuel,
    laborAndManagement: labor,
    contingencyReserves: reserves,
    annualExpenseInflationPct: 3.0
  };
}

