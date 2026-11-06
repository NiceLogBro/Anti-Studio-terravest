import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCapRate,
  calculateCashOnCash,
  calculateSurvivingLienExposure,
  calculateEquitySpread,
  calculateMaxAllowableOffer,
  calculateTotalGrantFunding,
  scoreSoilQuality,
  filterAndSortProperties
} from './underwriting';
import { InvestmentProperty, LienRecord, SoilProfile, FilterOptions, LandGrantProgram } from '../types/property';
import { generate100Properties } from './propertyGenerator';
import { validatePropertyLegitimacy } from './deepResearchValidator';


test('calculateCapRate correctly computes capitalization rate percentage', () => {
  // $45,000 NOI on $500,000 total basis = 9.0%
  const cap = calculateCapRate(45000, 500000);
  assert.equal(cap, 9.0);

  // Handles zero or negative cost gracefully
  assert.equal(calculateCapRate(10000, 0), 0);
  assert.equal(calculateCapRate(10000, -100), 0);
});

test('calculateCashOnCash correctly computes annual cash return', () => {
  // $25,000 net cash flow on $150,000 cash out of pocket = 16.67%
  const coc = calculateCashOnCash(25000, 150000);
  assert.equal(coc, 16.67);

  assert.equal(calculateCashOnCash(5000, 0), 0);
});

test('calculateSurvivingLienExposure separates senior surviving liens from wiped junior debt', () => {
  const sampleLiens: LienRecord[] = [
    {
      lienType: 'County Ad Valorem Tax',
      claimant: 'Travis County Tax Assessor',
      amount: 14200,
      priority: 'Super-Priority',
      status: 'Survives Foreclosure',
      notes: 'Delinquent 2 years ad valorem'
    },
    {
      lienType: '1st Mortgage / Deed of Trust',
      claimant: 'Wells Fargo Bank',
      amount: 320000,
      priority: 'Senior',
      status: 'Extinguished at Sale',
      notes: 'Foreclosing party'
    },
    {
      lienType: 'Municipal Weed & Code Enforcement',
      claimant: 'City of Manor Code Dept',
      amount: 3800,
      priority: 'Senior',
      status: 'Must Be Cleared',
      notes: 'Lot clearing violation assessment'
    },
    {
      lienType: '2nd Junior Mortgage',
      claimant: 'Private Lending LLC',
      amount: 45000,
      priority: 'Junior',
      status: 'Extinguished at Sale',
      notes: 'Subordinate HELOC'
    }
  ];

  const result = calculateSurvivingLienExposure(sampleLiens);
  // Surviving = 14200 (tax) + 3800 (code) = 18000
  assert.equal(result.survivingTotal, 18000);
  // Extinguished = 320000 + 45000 = 365000
  assert.equal(result.extinguishedTotal, 365000);
  assert.equal(result.allLiensTotal, 383000);
});

test('calculateEquitySpread calculates net equity and ARV discount', () => {
  // ARV $600,000, Purchase $250,000, Liens clearing $25,000, Rehab $75,000 => Basis $350,000
  // Net equity = $250,000, Discount % = 41.7%
  const spread = calculateEquitySpread(600000, 250000, 25000, 75000);
  assert.equal(spread.totalBasis, 350000);
  assert.equal(spread.netEquity, 250000);
  assert.equal(spread.discountPercentage, 41.7);
});

test('calculateMaxAllowableOffer enforces maximum acquisition ceiling', () => {
  // ARV $500,000, Target LTV 65% = $325,000. CapEx $40,000, Liens $15,000 => MAO = $270,000
  const mao = calculateMaxAllowableOffer(500000, 40000, 15000, 0.65);
  assert.equal(mao, 270000);
});

test('scoreSoilQuality assigns higher scores for Prime Farmland and high drainage', () => {
  const primeSoil: SoilProfile = {
    soilSeries: 'Clarion Loam',
    usdaTaxonomy: 'Fine-loamy, mixed, superactive, mesic Typic Hapludolls',
    textureDescription: 'Rich silt loam',
    phRange: [6.2, 6.8],
    organicMatterPercentage: 4.5,
    drainageClass: 'Well Drained',
    hardinessZone: '5b',
    frostFreeDays: 165,
    annualRainfallInches: 34,
    waterRightsIncluded: true,
    waterTableDepthFt: '6-8 ft',
    nrcsSoilSurveyRating: 'Prime Farmland'
  };

  const poorSoil: SoilProfile = {
    soilSeries: 'Rock Outcrop Complex',
    usdaTaxonomy: 'Lithic Torriorthents',
    textureDescription: 'Shallow rocky clay',
    phRange: [8.4, 8.9],
    organicMatterPercentage: 0.8,
    drainageClass: 'Somewhat Poorly Drained',
    hardinessZone: '9b',
    frostFreeDays: 280,
    annualRainfallInches: 8,
    waterRightsIncluded: false,
    waterTableDepthFt: '> 200 ft',
    nrcsSoilSurveyRating: 'Not Prime'
  };

  const primeScore = scoreSoilQuality(primeSoil);
  const poorScore = scoreSoilQuality(poorSoil);

  assert.ok(primeScore >= 90, `Expected prime score >= 90, got ${primeScore}`);
  assert.ok(poorScore <= 45, `Expected poor score <= 45, got ${poorScore}`);
});

test('filterAndSortProperties properly filters and sorts property list', () => {
  const dummyProp1: InvestmentProperty = {
    id: 'prop-1',
    title: 'Highland Orchard Foreclosure',
    address: '100 Farm Rd',
    city: 'Yakima',
    county: 'Yakima County',
    state: 'WA',
    zipCode: '98901',
    coordinates: { lat: 46.6, lng: -120.5 },
    parcelIdAPN: '123-456',
    acreage: 25,
    distressType: 'Sheriff Foreclosure Auction',
    isRedemptionPeriodActive: false,
    propertyType: 'Specialty Orchard / Vineyard',
    currentCondition: 'Operational Farm Needs Capital',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    summaryPitch: 'High yield apple and cherry orchard.',
    soil: {
      soilSeries: 'Warden Silt Loam',
      usdaTaxonomy: 'Coarse-silty',
      textureDescription: 'Deep silt loam',
      phRange: [6.5, 7.2],
      organicMatterPercentage: 2.8,
      drainageClass: 'Well Drained',
      hardinessZone: '6b',
      frostFreeDays: 180,
      annualRainfallInches: 10,
      waterRightsIncluded: true,
      waterTableDepthFt: '12 ft',
      nrcsSoilSurveyRating: 'Prime Farmland'
    },
    suitableCrops: [
      {
        cropName: 'Honeycrisp Apples',
        scientificFamily: 'Rosaceae',
        suitabilityScore: 95,
        harvestWindow: 'Sept-Oct',
        estYieldPerAcre: '22,000 lbs',
        estGrossRevenuePerAcre: 18000,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '6.0 - 7.0',
        soilTextureFit: 'Deep loam',
        marketDemandRating: 'Strong Wholesale',
        agronomicNotes: 'High chill hours'
      }
    ],
    zoning: {
      code: 'AG-1',
      title: 'Agricultural Preservation',
      jurisdiction: 'Yakima County',
      permittedUses: ['Orchard', 'Farmstand'],
      conditionalUses: ['Cider Press'],
      prohibitedUses: ['Subdivisions'],
      setbacks: { frontFt: 50, sideFt: 25, rearFt: 50 },
      maxBuildingHeightFt: 35,
      maxLotCoveragePercent: 20,
      minimumLotSizeAcres: 10,
      overlayDistricts: ['Irrigation District #2'],
      agRollbackTaxRisk: false
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Yakima Treasurer',
        amount: 8500,
        priority: 'Super-Priority',
        status: 'Survives Foreclosure',
        notes: 'Tax lien'
      }
    ],
    businessIdeas: [
      {
        id: 'b-1',
        name: 'Hard Cider Tasting & Cidery',
        category: 'Artisanal Processing',
        startupCapex: 120000,
        estAnnualRevenue: 280000,
        estAnnualNOI: 95000,
        paybackPeriodYears: 2.2,
        roiPercentage: 35,
        whyUniqueToArea: 'Thriving Washington cider corridor',
        keyRegulatoryHurdle: 'TABC Winery permit',
        citations: []
      }
    ],
    financials: {
      askingOrOpeningBid: 320000,
      estimatedARV: 550000,
      taxAssessedValue: 420000,
      delinquentTaxesTotal: 8500,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 8500,
      estimatedCapExRehab: 40000,
      holdingCostsAnnual: 6000,
      redemptionPeriodMonths: 0,
      grossRentalPotentialAnnual: 48000,
      netOperatingIncomeProjected: 42000,
      capRate: 11.4,
      cashOnCashReturn: 15.2,
      irr5Year: 22.8,
      lienToValueRatio: 0.02,
      equitySpreadDiscount: 33.0
    },
    tags: ['Orchard', 'Water Rights', 'Cidery Potential']
  };

  const defaultFilters: FilterOptions = {
    searchQuery: '',
    state: '',
    distressTypes: [],
    cropCategories: [],
    businessCategories: [],
    zoningTypes: [],
    minAcreage: 0,
    maxAcreage: 500,
    minPrice: 0,
    maxPrice: 2000000,
    maxLienRisk: 'All',
    soilQualityOnlyPrime: false,
    sortBy: 'cap-rate-high'
  };

  // Match all
  const filteredAll = filterAndSortProperties([dummyProp1], defaultFilters);
  assert.equal(filteredAll.length, 1);

  // Search filter
  const filterMatch = filterAndSortProperties([dummyProp1], {
    ...defaultFilters,
    searchQuery: 'Honeycrisp'
  });
  assert.equal(filterMatch.length, 1);

  const filterNoMatch = filterAndSortProperties([dummyProp1], {
    ...defaultFilters,
    searchQuery: 'NonExistentCrop'
  });
  assert.equal(filterNoMatch.length, 0);

  // Distress type filter
  const filterDistress = filterAndSortProperties([dummyProp1], {
    ...defaultFilters,
    distressTypes: ['Tax Lien Certificate']
  });
  assert.equal(filterDistress.length, 0);
});

test('generate100Properties produces exactly 100 valid investment properties', () => {
  const allProps = generate100Properties();
  assert.equal(allProps.length, 100, 'Should generate exactly 100 properties');

  // Verify all have valid required data
  for (const prop of allProps) {
    assert.ok(prop.id, 'Must have ID');
    assert.ok(prop.title, 'Must have title');
    assert.ok(prop.acreage > 0, 'Must have positive acreage');
    assert.ok(prop.financials.askingOrOpeningBid > 0, 'Must have positive price');
    assert.ok(prop.financials.estimatedARV > 0, 'Must have positive ARV');
    assert.ok(prop.suitableCrops.length > 0, 'Must have suitable crops');
    assert.ok(prop.businessIdeas.length > 0, 'Must have business ideas');
    assert.ok(prop.soil.soilSeries, 'Must have soil series');
    assert.ok(prop.eligibleLandGrants && prop.eligibleLandGrants.length >= 2, 'Must have at least 2 land grants');
    for (const grant of prop.eligibleLandGrants) {
      assert.ok(grant.name, 'Grant must have a name');
      assert.ok(grant.maxFundingAmount > 0, 'Grant must have positive max funding');
      assert.ok(grant.implementationSteps.length >= 2, 'Grant must have actionable implementation steps');
      assert.ok(grant.officialUrl.startsWith('http'), 'Grant must have official URL');
    }
  }

  // Verify tropical regions are included (Florida, Hawaii)
  const tropicalProps = allProps.filter((p) => p.state === 'FL' || p.state === 'HI');
  assert.ok(tropicalProps.length >= 20, 'Should contain ample tropical properties');
});

test('calculateTotalGrantFunding correctly sums all available grant caps', () => {
  const grants = [
    { maxFundingAmount: 450000 },
    { maxFundingAmount: 500000 },
    { maxFundingAmount: 125000 }
  ];
  const total = calculateTotalGrantFunding(grants);
  assert.equal(total, 1075000);

  assert.equal(calculateTotalGrantFunding([]), 0);
  assert.equal(calculateTotalGrantFunding(null as any), 0);
});

test('d3 contourDensity correctly generates vector contour thresholds from property coordinates', async () => {
  const d3 = await import('d3');
  const allProps = generate100Properties();

  const mapWidth = 980;
  const mapHeight = 540;
  const minLat = 24.0;
  const maxLat = 50.0;
  const minLng = -125.0;
  const maxLng = -68.0;

  const points = allProps.map((p) => {
    const x = ((p.coordinates.lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = ((maxLat - p.coordinates.lat) / (maxLat - minLat)) * (mapHeight - 80) + 40;
    const weight = scoreSoilQuality(p.soil);
    return { x, y, weight };
  });

  assert.equal(points.length, 100);

  const density = d3
    .contourDensity<{ x: number; y: number; weight: number }>()
    .x((d) => d.x)
    .y((d) => d.y)
    .weight((d) => d.weight)
    .size([mapWidth, mapHeight])
    .bandwidth(35)
    .thresholds(10);

  const contours = density(points);
  assert.ok(contours.length > 0, 'D3 contour density should produce contour polygons');
  assert.equal(contours[0].type, 'MultiPolygon');
  assert.ok(contours[0].coordinates.length > 0, 'First contour should have polygon coordinates');
});




