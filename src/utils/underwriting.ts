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
