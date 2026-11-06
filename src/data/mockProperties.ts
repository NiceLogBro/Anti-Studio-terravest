import { InvestmentProperty } from '../types/property';

export const INITIAL_PROPERTIES: InvestmentProperty[] = [
  {
    id: 'prop-austin-travis',
    title: '18.4 AC Highway Corridor Ag-Transition Parcel',
    address: '14205 FM 973 North',
    city: 'Manor',
    county: 'Travis County',
    state: 'TX',
    zipCode: '78653',
    coordinates: { lat: 30.3421, lng: -97.5184 },
    parcelIdAPN: '023451-0104-0000',
    acreage: 18.4,
    distressType: 'Sheriff Foreclosure Auction',
    auctionDate: '2026-11-17 10:00 AM CST',
    auctionVenue: 'Travis County Courthouse Steps (1000 Guadalupe St, Austin, TX)',
    isRedemptionPeriodActive: false,
    propertyType: 'Mixed-Use Commercial & Ag',
    currentCondition: 'Vacant Land',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'High-growth Austin tech corridor frontage with grandfathered 1-D-1 Ag valuation. Excellent dual-use potential for contractor equipment storage yard and high-density heirloom pecan & elderberry orchard.',
    tags: ['Austin Metro', 'SH-130 Corridor', 'High Yield Storage', 'Ag Exemption Active', 'Sheriff Sale'],
    featured: true,
    soil: {
      soilSeries: 'Houston Black Clay',
      usdaTaxonomy: 'Fine, smectitic, thermic Udic Haplusterts',
      textureDescription: 'Deep, dark calcareous clay with high moisture holding capacity',
      phRange: [7.4, 8.2],
      organicMatterPercentage: 3.2,
      drainageClass: 'Moderately Well Drained',
      hardinessZone: '8b',
      frostFreeDays: 250,
      annualRainfallInches: 34.2,
      waterRightsIncluded: true,
      waterTableDepthFt: '14 - 18 ft (Manville WSC available)',
      nrcsSoilSurveyRating: 'Prime Farmland'
    },
    suitableCrops: [
      {
        cropName: 'Improved Texas Pecans (Pawnee / Caddo)',
        scientificFamily: 'Juglandaceae',
        suitabilityScore: 94,
        harvestWindow: 'October - November',
        estYieldPerAcre: '1,400 lbs / acre',
        estGrossRevenuePerAcre: 5600,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '6.5 - 8.0',
        soilTextureFit: 'Deep calcareous alluvium',
        marketDemandRating: 'Strong Wholesale',
        agronomicNotes: 'Houston Black Clay excels at water retention during hot Texas summers; thrives on drip irrigation.'
      },
      {
        cropName: 'American Black Elderberries',
        scientificFamily: 'Adoxaceae',
        suitabilityScore: 89,
        harvestWindow: 'July - August',
        estYieldPerAcre: '3,200 lbs / acre',
        estGrossRevenuePerAcre: 9600,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '6.8 - 7.8',
        soilTextureFit: 'Rich organic clay loam',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'High regional demand for Texas syrup makers and local Austin wellness apothecaries.'
      },
      {
        cropName: 'Drought-Tolerant Black Spanish Grapes',
        scientificFamily: 'Vitaceae',
        suitabilityScore: 86,
        harvestWindow: 'Late August',
        estYieldPerAcre: '4.5 tons / acre',
        estGrossRevenuePerAcre: 8100,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '7.0 - 8.2',
        soilTextureFit: 'Alkaline clay with deep profile',
        marketDemandRating: 'Regional Direct-to-Consumer',
        agronomicNotes: '100% resistant to Pierce’s Disease, ideal for Central Texas Hill Country wine blending.'
      }
    ],
    zoning: {
      code: 'AG-2 / ETJ',
      title: 'Extraterritorial Jurisdiction / General Ag & Rural Commerce',
      jurisdiction: 'Travis County & City of Manor ETJ',
      permittedUses: [
        'Agricultural crop production & livestock',
        'Roadside produce farmstand (up to 2,500 sqft)',
        'Equestrian boarding',
        'Single-family homestead'
      ],
      conditionalUses: [
        'Open contractor equipment storage yard',
        'Commercial agritourism event pavilion',
        'Commercial solar photovoltaic array (up to 5MW)',
        'RV & boat secure staging facility'
      ],
      prohibitedUses: [
        'Heavy chemical industrial',
        'High-density multifamily without municipal sewer hookup',
        'Automotive salvage yard'
      ],
      setbacks: {
        frontFt: 50,
        sideFt: 25,
        rearFt: 35
      },
      maxBuildingHeightFt: 45,
      maxLotCoveragePercent: 30,
      minimumLotSizeAcres: 5.0,
      overlayDistricts: ['Gilleland Creek Watershed Tier 2', 'SH-130 Visual Scenic Buffer'],
      agRollbackTaxRisk: true,
      ordinanceRefUrl: 'https://www.traviscountytx.gov/tnr/development-services/regulations'
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Travis County Tax Assessor-Collector',
        amount: 18450,
        priority: 'Super-Priority',
        status: 'Survives Foreclosure',
        notes: '2 years delinquent rollback tax penalty plus statutory interest'
      },
      {
        lienType: '1st Mortgage / Deed of Trust',
        claimant: 'Lone Star AgCredit',
        amount: 410000,
        priority: 'Senior',
        status: 'Extinguished at Sale',
        notes: 'Foreclosing deed holder triggering sheriff sale'
      },
      {
        lienType: 'Municipal Weed & Code Enforcement',
        claimant: 'Travis County Health & Human Services',
        amount: 2400,
        priority: 'Senior',
        status: 'Must Be Cleared',
        notes: 'Brush abatement and right-of-way sight clearance lien'
      },
      {
        lienType: '2nd Junior Mortgage',
        claimant: 'Austin Private Capital Fund',
        amount: 85000,
        priority: 'Junior',
        status: 'Extinguished at Sale',
        notes: 'Junior mezzanine debt wiped out upon completion of sheriff sale'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-atx-storage',
        name: 'Gated Fleet & Contractor Equipment Staging Yard',
        category: 'Commercial & Storage',
        startupCapex: 185000,
        estAnnualRevenue: 275000,
        estAnnualNOI: 218000,
        paybackPeriodYears: 0.9,
        roiPercentage: 117.8,
        whyUniqueToArea: 'Located 8 minutes from the Samsung Austin Semiconductor $17B Taylor Foundry and 14 miles from Tesla Giga Texas. Subcontractors face an acute shortage of secure gravel laydown yards along the SH-130 corridor.',
        keyRegulatoryHurdle: 'Travis County Chapter 64 Commercial Driveway Permit and stabilized crushed-limestone dust mitigation plan.',
        citations: [
          {
            title: 'Austin Chamber Central Texas Industrial & Infrastructure Infrastructure Report',
            url: 'https://www.austinchamber.com/economic-development/infrastructure',
            sourceType: 'Local Market Study',
            excerpt: 'Severe contractor yard scarcity east of Austin with laydown space leasing for $0.25-$0.45 per sq ft / month.'
          },
          {
            title: 'Travis County TNR Commercial Permitting Guidelines',
            url: 'https://www.traviscountytx.gov/tnr/development-services',
            sourceType: 'Municipal Zoning',
            excerpt: 'Ag-transition ETJ parcels allow low-impact surface vehicle storage with simple detention drainage certification.'
          }
        ]
      },
      {
        id: 'biz-atx-agritourism',
        name: 'Hill Country Orchard Brewery & Smoked Farmstand',
        category: 'Agritourism & Events',
        startupCapex: 320000,
        estAnnualRevenue: 540000,
        estAnnualNOI: 195000,
        paybackPeriodYears: 1.6,
        roiPercentage: 60.9,
        whyUniqueToArea: 'Direct weekend route for Austin urbanites heading to Bastrop and Round Top antique trails; 1-D-1 ag exemption preserves low property tax base while operating a farm brewery under Texas TABC SB-1210 rules.',
        keyRegulatoryHurdle: 'TABC Brewer’s License with farm-winery exemption + TCEQ on-site septic facility (OSSF) engineered system.',
        citations: [
          {
            title: 'Texas A&M AgriLife Agritourism & 1-D-1 Valuation Legal Handbook',
            url: 'https://agrilifeextension.tamu.edu/agricultural-law/',
            sourceType: 'Government / USDA',
            excerpt: 'Texas Property Code Sec. 23.51 protects ag valuation when recreational or farm-to-table activities remain secondary to crop production.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 345000,
      estimatedARV: 820000,
      taxAssessedValue: 560000,
      delinquentTaxesTotal: 18450,
      juniorLiensTotal: 85000,
      estimatedClearingCosts: 20850,
      estimatedCapExRehab: 45000,
      holdingCostsAnnual: 9200,
      redemptionPeriodMonths: 6,
      statutoryRedemptionInterestRate: 25,
      grossRentalPotentialAnnual: 120000,
      netOperatingIncomeProjected: 95000,
      capRate: 23.1,
      cashOnCashReturn: 28.5,
      irr5Year: 38.4,
      lienToValueRatio: 0.05,
      equitySpreadDiscount: 49.9
    }
  },
  {
    id: 'prop-sonoma-russian-river',
    title: '12.5 AC Historic Farmstead & Micro-Vineyard',
    address: '8840 Westside Road',
    city: 'Healdsburg',
    county: 'Sonoma County',
    state: 'CA',
    zipCode: '95448',
    coordinates: { lat: 38.5832, lng: -122.8941 },
    parcelIdAPN: '110-240-018',
    acreage: 12.5,
    distressType: 'Bank-Owned REO',
    auctionDate: '2026-11-05 02:00 PM PST',
    auctionVenue: 'Online Court-Approved Receiver Liquidations (Auction.com / Wells Fargo REO)',
    isRedemptionPeriodActive: false,
    propertyType: 'Specialty Orchard / Vineyard',
    currentCondition: 'Operational Farm Needs Capital',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'World-renowned Goldridge Sandy Loam soil along prime Healdsburg wine country corridor. Bank repossession of defaulted organic estate with active 600-tree olive grove and French Black Truffle inoculated hazelnut orchard.',
    tags: ['Wine Country', 'Russian River AVA', 'Bank REO', 'Prime Terroir', 'Agritourism'],
    featured: true,
    soil: {
      soilSeries: 'Goldridge Sandy Loam',
      usdaTaxonomy: 'Fine-loamy, mixed, superactive, thermic Typic Fragiudults',
      textureDescription: 'Friable, fine sandy loam derived from ancient marine sandstone sediments',
      phRange: [5.8, 6.4],
      organicMatterPercentage: 3.8,
      drainageClass: 'Well Drained',
      hardinessZone: '9b',
      frostFreeDays: 280,
      annualRainfallInches: 41.5,
      waterRightsIncluded: true,
      waterTableDepthFt: '8 - 12 ft (Licensed Russian River Riparian Well)',
      nrcsSoilSurveyRating: 'Prime Farmland'
    },
    suitableCrops: [
      {
        cropName: 'French Périgord Black Truffles (Tuber melanosporum)',
        scientificFamily: 'Tuberaceae / Betulaceae host',
        suitabilityScore: 98,
        harvestWindow: 'December - February',
        estYieldPerAcre: '65 lbs / mature acre',
        estGrossRevenuePerAcre: 52000,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '7.4 - 7.9 (Soil requires lime amendment)',
        soilTextureFit: 'Light, well-aerated sandy loam with superior drainage',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'Sonoma and Napa Michelin-star restaurants purchase local truffles at $800-$1,200/lb; existing 5-year hazelnut grove ready for root inoculate.'
      },
      {
        cropName: 'Heritage Meyer Lemon & Frantoio Olives',
        scientificFamily: 'Oleaceae / Rutaceae',
        suitabilityScore: 95,
        harvestWindow: 'November - January',
        estYieldPerAcre: '4.2 tons / acre',
        estGrossRevenuePerAcre: 18500,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '6.0 - 7.0',
        soilTextureFit: 'Goldridge loam ideal for oil polyphenol density',
        marketDemandRating: 'Regional Direct-to-Consumer',
        agronomicNotes: 'California Extra Virgin Olive Oil Council certified estate mill potential.'
      },
      {
        cropName: 'Cool-Climate Pinot Noir & Chardonnay',
        scientificFamily: 'Vitaceae',
        suitabilityScore: 96,
        harvestWindow: 'September - October',
        estYieldPerAcre: '3.5 tons / acre',
        estGrossRevenuePerAcre: 14000,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '5.8 - 6.5',
        soilTextureFit: 'Goldridge soil is the gold standard for Russian River Valley AVA Pinot Noir',
        marketDemandRating: 'Strong Wholesale',
        agronomicNotes: 'Top boutique wineries pay upwards of $4,000 per ton for certified sustainable fruit.'
      }
    ],
    zoning: {
      code: 'LIA (Land Intensive Agriculture)',
      title: 'Land Intensive Agriculture - Sonoma County Code Sec. 26-04',
      jurisdiction: 'County of Sonoma Permit and Resource Management Dept (PRMD)',
      permittedUses: [
        'Vineyard and orchard cultivation',
        'Single-family residence & agricultural employee housing',
        'Direct retail produce stand under 1,000 sqft',
        'Farm equipment maintenance'
      ],
      conditionalUses: [
        'Boutique estate winery & tasting room (up to 10,000 cases/yr)',
        'Farmstay guest lodging (up to 5 guest rooms in historic structures)',
        'Artisanal commercial food processing / olive oil mill'
      ],
      prohibitedUses: [
        'Commercial solar field outside accessory use',
        'Warehouse distribution',
        'Subdivision into parcels under 10 acres'
      ],
      setbacks: {
        frontFt: 50,
        sideFt: 30,
        rearFt: 30
      },
      maxBuildingHeightFt: 35,
      maxLotCoveragePercent: 20,
      minimumLotSizeAcres: 10.0,
      overlayDistricts: ['Russian River Riparian Corridor 100ft Setback', 'Valley Oak Habitat Protection'],
      agRollbackTaxRisk: false,
      ordinanceRefUrl: 'https://permitsonoma.org/zoning/lia'
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Sonoma County Auditor-Controller',
        amount: 12200,
        priority: 'Super-Priority',
        status: 'Must Be Cleared',
        notes: 'Current year secured property tax installments'
      },
      {
        lienType: '1st Mortgage / Deed of Trust',
        claimant: 'First Republic Bank (JPMorgan Chase)',
        amount: 1450000,
        priority: 'Senior',
        status: 'Extinguished at Sale',
        notes: 'Bank foreclosed; clear title conveyance via Special Warranty Deed'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-sonoma-glamping',
        name: 'Curated Truffle & Wine Country Eco-Farmstay',
        category: 'Hospitality / Eco-Stay',
        startupCapex: 240000,
        estAnnualRevenue: 410000,
        estAnnualNOI: 265000,
        paybackPeriodYears: 0.9,
        roiPercentage: 110.4,
        whyUniqueToArea: 'Healdsburg luxury hotel rooms average $650-$1,100/night. Sonoma County allows agricultural farmstay experiences under PRMD Section 26-88-085, enabling high-margin seasonal farm dinners and truffle foraging escapes.',
        keyRegulatoryHurdle: 'Sonoma County Agricultural Farmstay Zoning Clearance & Transient Occupancy Tax (TOT) registration.',
        citations: [
          {
            title: 'Sonoma County PRMD Farmstay Permit Code Guidelines Sec. 26-88-085',
            url: 'https://permitsonoma.org/regulationsandinitiatives/farmstays',
            sourceType: 'Municipal Zoning',
            excerpt: 'Farmstays permitted by administrative clearance on agricultural parcels when hosted on active farm property.'
          },
          {
            title: 'Sonoma County Tourism Annual Lodging & Agritourism Economic Impact',
            url: 'https://www.sonomacounty.com/partners/tourism-research',
            sourceType: 'Tourism / Chamber',
            excerpt: 'High-income visitor demand for authentic culinary agricultural experiences exceeds supply in Upper Russian River.'
          }
        ]
      },
      {
        id: 'biz-sonoma-oil',
        name: 'Custom-Crush Olive Mill & Tasting Veranda',
        category: 'Artisanal Processing',
        startupCapex: 160000,
        estAnnualRevenue: 290000,
        estAnnualNOI: 145000,
        paybackPeriodYears: 1.1,
        roiPercentage: 90.6,
        whyUniqueToArea: 'Over 120 small private estate olive growers in Healdsburg and Dry Creek lack a certified mobile or local small-batch mill during November harvest.',
        keyRegulatoryHurdle: 'Sonoma County Environmental Health food processor plan check and water discharge permit.',
        citations: [
          {
            title: 'UC Davis Olive Center Processing & Mill Feasibility Analysis',
            url: 'https://olivecenter.ucdavis.edu/',
            sourceType: 'Government / USDA',
            excerpt: 'Custom-crush toll processing provides 48-60% gross operating margins in Northern California premium olive zones.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 980000,
      estimatedARV: 1850000,
      taxAssessedValue: 1250000,
      delinquentTaxesTotal: 12200,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 14500,
      estimatedCapExRehab: 65000,
      holdingCostsAnnual: 16000,
      redemptionPeriodMonths: 0,
      grossRentalPotentialAnnual: 180000,
      netOperatingIncomeProjected: 145000,
      capRate: 13.7,
      cashOnCashReturn: 18.2,
      irr5Year: 27.6,
      lienToValueRatio: 0.01,
      equitySpreadDiscount: 42.7
    }
  },
  {
    id: 'prop-yakima-orchard',
    title: '42.0 AC Tier-1 Irrigated Apple & Hop Farm',
    address: '610 Buena Road',
    city: 'Zillah',
    county: 'Yakima County',
    state: 'WA',
    zipCode: '98953',
    coordinates: { lat: 46.4023, lng: -120.1782 },
    parcelIdAPN: '201103-31002',
    acreage: 42.0,
    distressType: 'Tax Deed Sale',
    auctionDate: '2026-11-20 09:00 AM PST',
    auctionVenue: 'Yakima County Commissioners Hearing Room (128 N 2nd St, Yakima, WA)',
    isRedemptionPeriodActive: true,
    propertyType: 'Agricultural Land',
    currentCondition: 'Operational Farm Needs Capital',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'Senior 1905 Roza Irrigation District water allotment with certified organic Honeycrisp block and high-trellis aroma hop infrastructure. Delinquent multi-year ad valorem tax foreclosure offering massive basis discount.',
    tags: ['Water Rights Senior', 'Organic Certified', 'Hop Trellis', 'Roza District', 'Tax Deed'],
    featured: false,
    soil: {
      soilSeries: 'Warden Silt Loam',
      usdaTaxonomy: 'Coarse-silty, mixed, superactive, mesic Xeric Haplocambids',
      textureDescription: 'Deep, uniform silt loam with exceptional cation exchange capacity and no restrictive layers',
      phRange: [6.6, 7.3],
      organicMatterPercentage: 2.9,
      drainageClass: 'Well Drained',
      hardinessZone: '6b',
      frostFreeDays: 175,
      annualRainfallInches: 9.8,
      waterRightsIncluded: true,
      waterTableDepthFt: '> 6 ft (Full pressurized Roza Irrigation Canal turnout)',
      nrcsSoilSurveyRating: 'Prime Farmland'
    },
    suitableCrops: [
      {
        cropName: 'Aroma & Dual-Purpose Hops (Citra / Mosaic / Cascade)',
        scientificFamily: 'Cannabaceae',
        suitabilityScore: 97,
        harvestWindow: 'Late August - September',
        estYieldPerAcre: '2,100 lbs dried cones / acre',
        estGrossRevenuePerAcre: 23000,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '6.5 - 7.5',
        soilTextureFit: 'Deep alluvial silt loam with high fertility',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'Yakima Valley produces 75% of all United States hops. Existing 18-ft wire trellis in place reduces startup CapEx by $14,000/acre.'
      },
      {
        cropName: 'Organic Honeycrisp & Cosmic Crisp Apples',
        scientificFamily: 'Rosaceae',
        suitabilityScore: 93,
        harvestWindow: 'September - October',
        estYieldPerAcre: '45 bins (38,000 lbs) / acre',
        estGrossRevenuePerAcre: 19500,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '6.5 - 7.0',
        soilTextureFit: 'Deep, well-drained silt loam',
        marketDemandRating: 'Strong Wholesale',
        agronomicNotes: 'Intense sunny days and cold desert nights create world-class brix and fruit color.'
      },
      {
        cropName: 'Bing & Rainier Sweet Cherries',
        scientificFamily: 'Rosaceae',
        suitabilityScore: 91,
        harvestWindow: 'June - July',
        estYieldPerAcre: '7 tons / acre',
        estGrossRevenuePerAcre: 21000,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '6.5 - 7.2',
        soilTextureFit: 'Deep gravelly silt loam',
        marketDemandRating: 'Export Grade',
        agronomicNotes: 'High export price realization to Asian Pacific rim markets via SeaTac cold chain.'
      }
    ],
    zoning: {
      code: 'AG (Exclusive Agricultural)',
      title: 'Yakima County Code Title 19 - Agricultural Zoning',
      jurisdiction: 'Yakima County Planning Division',
      permittedUses: [
        'Commercial agriculture and horticulture',
        'Crop packaging and cold storage for on-site produce',
        'Single-family agricultural dwelling',
        'Farmworker housing conforming to RCW 70.114A'
      ],
      conditionalUses: [
        'Commercial hop pelletizing and custom kiln operation',
        'Commercial cold storage receiving off-site produce',
        'Agricultural tourism and seasonal tasting facility'
      ],
      prohibitedUses: [
        'Residential subdivisions',
        'Non-agricultural commercial retail',
        'Industrial chemical manufacturing'
      ],
      setbacks: {
        frontFt: 40,
        sideFt: 20,
        rearFt: 40
      },
      maxBuildingHeightFt: 40,
      maxLotCoveragePercent: 25,
      minimumLotSizeAcres: 40.0,
      overlayDistricts: ['Roza Irrigation Assessment District', 'Critical Aquifer Recharge Area'],
      agRollbackTaxRisk: false,
      ordinanceRefUrl: 'https://www.yakimacounty.us/297/Planning'
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Yakima County Treasurer',
        amount: 28600,
        priority: 'Super-Priority',
        status: 'Survives Foreclosure',
        notes: 'Delinquent 3 years property taxes + 12% statutory penalty'
      },
      {
        lienType: 'HOA / POA Special Assessment',
        claimant: 'Roza Irrigation District Annual Assessment',
        amount: 4800,
        priority: 'Super-Priority',
        status: 'Must Be Cleared',
        notes: 'Annual water canal maintenance fees'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-yakima-pellet',
        name: 'Micro-Brewery Hop Pelletizing & Cold-Chain Co-Op',
        category: 'Artisanal Processing',
        startupCapex: 175000,
        estAnnualRevenue: 340000,
        estAnnualNOI: 165000,
        paybackPeriodYears: 1.1,
        roiPercentage: 94.2,
        whyUniqueToArea: 'Over 60 craft breweries in Washington, Oregon, and Idaho buy direct from independent growers who can nitrogen-purge pelletize small 50-lb batches.',
        keyRegulatoryHurdle: 'WSDA Food Processor License and clean emission dust collection filter permit.',
        citations: [
          {
            title: 'Washington State Department of Agriculture Craft Beverage Report',
            url: 'https://agr.wa.gov/',
            sourceType: 'Government / USDA',
            excerpt: 'Direct farm-to-brewery pellet contracts yield 35% higher price realization than industrial consolidator brokers.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 410000,
      estimatedARV: 890000,
      taxAssessedValue: 640000,
      delinquentTaxesTotal: 28600,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 33400,
      estimatedCapExRehab: 40000,
      holdingCostsAnnual: 8500,
      redemptionPeriodMonths: 36,
      statutoryRedemptionInterestRate: 12,
      grossRentalPotentialAnnual: 75000,
      netOperatingIncomeProjected: 62000,
      capRate: 12.8,
      cashOnCashReturn: 16.5,
      irr5Year: 24.2,
      lienToValueRatio: 0.04,
      equitySpreadDiscount: 45.7
    }
  },
  {
    id: 'prop-florida-citrus',
    title: '15.2 AC Highway 27 Transition & Nursery Parcel',
    address: '17420 US Highway 27',
    city: 'Clermont',
    county: 'Lake County',
    state: 'FL',
    zipCode: '34714',
    coordinates: { lat: 28.5281, lng: -81.7512 },
    parcelIdAPN: '14-22-26-0002-000-01200',
    acreage: 15.2,
    distressType: 'Pre-Foreclosure / Short Sale',
    auctionDate: '2026-11-28 (Notice of Default Filed)',
    isRedemptionPeriodActive: false,
    propertyType: 'Mixed-Use Commercial & Ag',
    currentCondition: 'Distressed Structures',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'High traffic frontage on US-27 south of Clermont. Former citrus grove transitioning to commercial ag and ornamental nursery. Defaulted bank bridge loan provides immediate value-add repositioning opportunity.',
    tags: ['Orlando MSA', 'US-27 Frontage', 'Nursery Transition', 'Pre-Foreclosure', 'High Traffic'],
    featured: false,
    soil: {
      soilSeries: 'Candler Fine Sand',
      usdaTaxonomy: 'Hyperthermic, uncoated Lamellic Quartzipsamments',
      textureDescription: 'Deep, excessively drained Central Florida Ridge sand with outstanding aeration',
      phRange: [5.5, 6.5],
      organicMatterPercentage: 1.2,
      drainageClass: 'Excessively Drained',
      hardinessZone: '9b',
      frostFreeDays: 340,
      annualRainfallInches: 51.0,
      waterRightsIncluded: true,
      waterTableDepthFt: '18 - 25 ft (St. Johns River Water Mgmt District Consumptive Use Permit)',
      nrcsSoilSurveyRating: 'Prime if Irrigated'
    },
    suitableCrops: [
      {
        cropName: 'Protected Shade-House Ginger & Galangal Root',
        scientificFamily: 'Zingiberaceae',
        suitabilityScore: 94,
        harvestWindow: 'December - February',
        estYieldPerAcre: '28,000 lbs / acre',
        estGrossRevenuePerAcre: 42000,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '5.8 - 6.5',
        soilTextureFit: 'Deep friable sand enables immaculate, damage-free root harvesting',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'High wholesale demand from Florida organic juice bottlers and Asian grocery distributors.'
      },
      {
        cropName: 'Landscape Specimen Palms (Sylvester & Medjool)',
        scientificFamily: 'Arecaceae',
        suitabilityScore: 92,
        harvestWindow: 'Year-round dig',
        estYieldPerAcre: '450 specimens / acre',
        estGrossRevenuePerAcre: 35000,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '6.0 - 7.5',
        soilTextureFit: 'Candler sand prevents root rot in high-humidity climates',
        marketDemandRating: 'Strong Wholesale',
        agronomicNotes: 'Massive residential expansion in Orlando/Clermont creates constant contractor demand.'
      }
    ],
    zoning: {
      code: 'A (Agriculture / Commercial Ag Overlays)',
      title: 'Lake County Land Development Regulations - Chapter 3',
      jurisdiction: 'Lake County Planning & Zoning',
      permittedUses: [
        'Commercial nursery & greenhouse operations',
        'Wholesale agricultural distribution',
        'Farmstead residential',
        'Roadside agricultural market'
      ],
      conditionalUses: [
        'Commercial agrivoltaic solar farm',
        'RV & boat secure outdoor storage facility',
        'Landscape contractor base of operations'
      ],
      prohibitedUses: [
        'Strip retail commercial without Planned Commercial rezoning',
        'High-density residential'
      ],
      setbacks: {
        frontFt: 50,
        sideFt: 25,
        rearFt: 25
      },
      maxBuildingHeightFt: 40,
      maxLotCoveragePercent: 35,
      minimumLotSizeAcres: 5.0,
      overlayDistricts: ['Green Swamp Area of Critical State Concern - Fringe Zone'],
      agRollbackTaxRisk: false,
      ordinanceRefUrl: 'https://www.lakecountyfl.gov/'
    },
    liens: [
      {
        lienType: '1st Mortgage / Deed of Trust',
        claimant: 'First National Bank of Central Florida',
        amount: 520000,
        priority: 'Senior',
        status: 'Must Be Cleared',
        notes: 'Subject of pre-foreclosure short sale negotiation'
      },
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Lake County Tax Collector',
        amount: 9200,
        priority: 'Super-Priority',
        status: 'Must Be Cleared',
        notes: 'Delinquent property taxes'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-fl-shadehouse',
        name: 'Turnkey Wholesale Tropical Shaded Nursery & Direct Depot',
        category: 'High-Value Food Production',
        startupCapex: 135000,
        estAnnualRevenue: 310000,
        estAnnualNOI: 175000,
        paybackPeriodYears: 0.8,
        roiPercentage: 129.6,
        whyUniqueToArea: 'Direct access to US-27 tourist and freight corridor with 28,000 daily vehicle count. Lake County is Florida’s hub for high-margin specimen plant propagation.',
        keyRegulatoryHurdle: 'FDACS Nursery Certificate of Registration and BMP water stewardship filing.',
        citations: [
          {
            title: 'UF / IFAS Extension Florida Nursery and Landscape Industry Economic Study',
            url: 'https://edis.ifas.ufl.edu/',
            sourceType: 'Government / USDA',
            excerpt: 'Central Florida ornamental horticulture delivers steady 30-40% EBITDA margins backed by ongoing sunbelt population migration.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 560000,
      estimatedARV: 950000,
      taxAssessedValue: 710000,
      delinquentTaxesTotal: 9200,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 11000,
      estimatedCapExRehab: 35000,
      holdingCostsAnnual: 11000,
      redemptionPeriodMonths: 0,
      grossRentalPotentialAnnual: 84000,
      netOperatingIncomeProjected: 72000,
      capRate: 11.9,
      cashOnCashReturn: 14.8,
      irr5Year: 23.4,
      lienToValueRatio: 0.01,
      equitySpreadDiscount: 36.2
    }
  },
  {
    id: 'prop-lancaster-pa',
    title: '34.0 AC USDA Prime Organic Certified Farmstead',
    address: '442 Limestone Road',
    city: 'Strasburg',
    county: 'Lancaster County',
    state: 'PA',
    zipCode: '17579',
    coordinates: { lat: 39.9824, lng: -76.1821 },
    parcelIdAPN: '550-12849-0-0000',
    acreage: 34.0,
    distressType: 'Probate / Estate Distress',
    auctionDate: '2026-11-12 11:00 AM EST',
    auctionVenue: 'On-Site Estate Liquidation (Horst Auctioneers)',
    isRedemptionPeriodActive: false,
    propertyType: 'Farmstead with Structures',
    currentCondition: 'Operational Farm Needs Capital',
    imageUrl: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'Estate liquidation of generational limestone valley farmstead. Rated USDA Prime Class I soil. Features historic bank barn, operational dairy parlor converted to organic egg packing, and 3-phase electric.',
    tags: ['Lancaster County', 'Prime Farmland I', 'Certified Organic', 'Bank Barn', 'Probate Sale'],
    featured: true,
    soil: {
      soilSeries: 'Hagerstown Silt Loam',
      usdaTaxonomy: 'Fine, mixed, semiactive, mesic Typic Hapludalfs',
      textureDescription: 'Deep, fertile silt loam underlain by ordovician limestone bedrock',
      phRange: [6.4, 7.0],
      organicMatterPercentage: 4.6,
      drainageClass: 'Well Drained',
      hardinessZone: '7a',
      frostFreeDays: 195,
      annualRainfallInches: 43.8,
      waterRightsIncluded: true,
      waterTableDepthFt: '10 - 15 ft (High output artesian limestone spring)',
      nrcsSoilSurveyRating: 'Prime Farmland'
    },
    suitableCrops: [
      {
        cropName: 'Organic Heritage Garlic & Shallots',
        scientificFamily: 'Amaryllidaceae',
        suitabilityScore: 98,
        harvestWindow: 'July - August',
        estYieldPerAcre: '12,000 lbs / acre',
        estGrossRevenuePerAcre: 36000,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '6.5 - 7.0',
        soilTextureFit: 'Hagerstown silt loam produces robust bulb wrappers and superior storability',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'Wholesale to Philadelphia, NYC, and DC specialty restaurants at $4.50-$6.00/lb bulk.'
      },
      {
        cropName: 'Organic Pastured Poultry / Egg Rotation',
        scientificFamily: 'Avian Agrosystem',
        suitabilityScore: 96,
        harvestWindow: 'Year-round',
        estYieldPerAcre: '350 laying hens / pasture acre',
        estGrossRevenuePerAcre: 24500,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '6.2 - 7.2',
        soilTextureFit: 'Limestone loam supports lush clover-fescue rotational swards',
        marketDemandRating: 'Strong Wholesale',
        agronomicNotes: 'Lancaster County is the premier organic egg logistics hub on the Eastern Seaboard.'
      }
    ],
    zoning: {
      code: 'A (Agricultural Preservation)',
      title: 'Strasburg Township Code Section 27-201',
      jurisdiction: 'Lancaster County Agricultural Land Preservation Board',
      permittedUses: [
        'Agricultural production, dairy, poultry, and crops',
        'Single-family agricultural residence',
        'Custom artisanal grain milling',
        'Farm retail stand under 1,500 sqft'
      ],
      conditionalUses: [
        'Commercial equine boarding and training facility',
        'Agritourism educational farm experiences',
        'Composting of agricultural byproducts'
      ],
      prohibitedUses: [
        'Residential cluster subdivisions',
        'General commercial or industrial warehouses'
      ],
      setbacks: {
        frontFt: 50,
        sideFt: 35,
        rearFt: 50
      },
      maxBuildingHeightFt: 45,
      maxLotCoveragePercent: 20,
      minimumLotSizeAcres: 25.0,
      overlayDistricts: ['Pequea Creek Watershed Agricultural Conservation Easement (Eligible)'],
      agRollbackTaxRisk: false,
      ordinanceRefUrl: 'https://strasburgtownship.com/'
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Lancaster County Treasurer',
        amount: 6400,
        priority: 'Super-Priority',
        status: 'Must Be Cleared',
        notes: 'Estate estate taxes and clean green assessment review'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-lancaster-grains',
        name: 'Heritage Stone-Milled Grain & Artisanal Sourdough Destination',
        category: 'Artisanal Processing',
        startupCapex: 145000,
        estAnnualRevenue: 380000,
        estAnnualNOI: 195000,
        paybackPeriodYears: 0.8,
        roiPercentage: 134.4,
        whyUniqueToArea: 'Lancaster County draws over 9 million tourists annually. Converted historic bank barn offers picturesque backdrop for heritage grain stone milling and weekend agritourism.',
        keyRegulatoryHurdle: 'PA Department of Agriculture Bureau of Food Safety wholesale bakery license.',
        citations: [
          {
            title: 'Penn State Extension Agricultural Entrepreneurship & Heritage Grains',
            url: 'https://extension.psu.edu/',
            sourceType: 'Government / USDA',
            excerpt: 'Direct-market artisanal stone-ground flours capture 4x commodity pricing with strong regional mid-Atlantic retail accounts.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 680000,
      estimatedARV: 1250000,
      taxAssessedValue: 840000,
      delinquentTaxesTotal: 6400,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 8000,
      estimatedCapExRehab: 50000,
      holdingCostsAnnual: 7500,
      redemptionPeriodMonths: 0,
      grossRentalPotentialAnnual: 110000,
      netOperatingIncomeProjected: 92000,
      capRate: 12.5,
      cashOnCashReturn: 16.2,
      irr5Year: 26.8,
      lienToValueRatio: 0.01,
      equitySpreadDiscount: 40.9
    }
  },
  {
    id: 'prop-maricopa-buckeye',
    title: '28.5 AC Grandfathered Water Rights Ag/Industrial Development',
    address: 'S Miller Road & Baseline',
    city: 'Buckeye',
    county: 'Maricopa County',
    state: 'AZ',
    zipCode: '85326',
    coordinates: { lat: 33.3712, lng: -112.5841 },
    parcelIdAPN: '504-32-008B',
    acreage: 28.5,
    distressType: 'Sheriff Foreclosure Auction',
    auctionDate: '2026-11-25 10:00 AM MST',
    auctionVenue: 'Maricopa County Superior Court (201 W Jefferson St, Phoenix, AZ)',
    isRedemptionPeriodActive: false,
    propertyType: 'Rural Industrial',
    currentCondition: 'Vacant Land',
    imageUrl: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'Strategic Phoenix West Valley logistics corridor parcel with Grandfathered Groundwater Rights (IGFR) under Arizona Department of Water Resources. Defaulted land banking fund liquidation.',
    tags: ['Phoenix Metro', 'Grandfathered Water Rights', 'Industrial Corridor', 'Sheriff Auction'],
    featured: false,
    soil: {
      soilSeries: 'Gilman Loam',
      usdaTaxonomy: 'Coarse-loamy, mixed, superactive, hyperthermic Typic Torrifluvents',
      textureDescription: 'Deep, permeable stratified loam on nearly level flood plains',
      phRange: [7.8, 8.4],
      organicMatterPercentage: 1.1,
      drainageClass: 'Well Drained',
      hardinessZone: '9b',
      frostFreeDays: 320,
      annualRainfallInches: 7.2,
      waterRightsIncluded: true,
      waterTableDepthFt: 'Active Buckeye Water Conservation & Drainage District canal turnout',
      nrcsSoilSurveyRating: 'Prime if Irrigated'
    },
    suitableCrops: [
      {
        cropName: 'Medjool Date Palms',
        scientificFamily: 'Arecaceae',
        suitabilityScore: 96,
        harvestWindow: 'September - October',
        estYieldPerAcre: '8,000 lbs / acre',
        estGrossRevenuePerAcre: 32000,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '7.5 - 8.5',
        soilTextureFit: 'Tolerates heat and high mineral soils with ease',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'Arizona Medjool dates command premium export prices to Mediterranean and European importers.'
      },
      {
        cropName: 'Drought-Resilient Agave tequilana (Blue Agave)',
        scientificFamily: 'Asparagaceae',
        suitabilityScore: 93,
        harvestWindow: '6-year piña harvest cycle',
        estYieldPerAcre: '24 tons piñas / acre amortized',
        estGrossRevenuePerAcre: 18000,
        waterRequirement: 'Very Low (Dryland)',
        soilPhPreference: '7.5 - 8.4',
        soilTextureFit: 'Well-drained desert loam',
        marketDemandRating: 'Regional Direct-to-Consumer',
        agronomicNotes: 'Surging demand from regional Arizona craft agave spirit distilleries.'
      }
    ],
    zoning: {
      code: 'RU-43 / Employment Reserve',
      title: 'City of Buckeye General Plan - Employment Overlay',
      jurisdiction: 'City of Buckeye Planning & Zoning',
      permittedUses: [
        'Commercial irrigated agriculture and farming',
        'Agricultural processing and packaging',
        'Single-family residential on 1-acre minimum'
      ],
      conditionalUses: [
        'Open storage of commercial transport equipment',
        'Solar photovoltaic generation facility',
        'Light industrial assembly & logistics depot'
      ],
      prohibitedUses: [
        'Heavy chemical refiners',
        'High-density residential'
      ],
      setbacks: {
        frontFt: 40,
        sideFt: 30,
        rearFt: 40
      },
      maxBuildingHeightFt: 45,
      maxLotCoveragePercent: 35,
      minimumLotSizeAcres: 1.0,
      overlayDistricts: ['ADWR Phoenix Active Management Area (AMA)'],
      agRollbackTaxRisk: false,
      ordinanceRefUrl: 'https://www.buckeyeaz.gov/government/development-services'
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Maricopa County Treasurer',
        amount: 14800,
        priority: 'Super-Priority',
        status: 'Survives Foreclosure',
        notes: 'Delinquent tax roll and irrigation district assessment'
      },
      {
        lienType: '1st Mortgage / Deed of Trust',
        claimant: 'Bridge Bank & Trust',
        amount: 720000,
        priority: 'Senior',
        status: 'Extinguished at Sale',
        notes: 'Senior lender foreclosing; extinguishing subordinated liens'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-buckeye-rv',
        name: 'Covered Solar RV & Off-Road Fleet Staging Depot',
        category: 'Commercial & Storage',
        startupCapex: 290000,
        estAnnualRevenue: 490000,
        estAnnualNOI: 365000,
        paybackPeriodYears: 0.8,
        roiPercentage: 125.8,
        whyUniqueToArea: 'Over 45,000 new suburban master-planned homes in Buckeye and Goodyear have strict HOA rules prohibiting RVs and boats in driveways. Covered canopy with solar generates dual-revenue.',
        keyRegulatoryHurdle: 'City of Buckeye Conditional Use Permit for Commercial Outdoor Vehicle Storage.',
        citations: [
          {
            title: 'City of Buckeye Economic Development Master Plan',
            url: 'https://www.growbuckeye.com/',
            sourceType: 'Municipal Zoning',
            excerpt: 'Fastest growing city in the United States over the past decade with severe infrastructure deficit for recreational vehicle storage.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 495000,
      estimatedARV: 1100000,
      taxAssessedValue: 780000,
      delinquentTaxesTotal: 14800,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 18000,
      estimatedCapExRehab: 40000,
      holdingCostsAnnual: 12000,
      redemptionPeriodMonths: 0,
      grossRentalPotentialAnnual: 130000,
      netOperatingIncomeProjected: 110000,
      capRate: 19.9,
      cashOnCashReturn: 24.5,
      irr5Year: 34.2,
      lienToValueRatio: 0.03,
      equitySpreadDiscount: 49.7
    }
  },
  {
    id: 'prop-asheville-nc',
    title: '22.0 AC Blue Ridge Slope Timber & Eco-Retreat Distress',
    address: '380 Ivy Creek Trail',
    city: 'Weaverville',
    county: 'Buncombe County',
    state: 'NC',
    zipCode: '28787',
    coordinates: { lat: 35.7194, lng: -82.5621 },
    parcelIdAPN: '9742-18-4901-00000',
    acreage: 22.0,
    distressType: 'Distressed Value-Add Land',
    auctionDate: '2026-11-30 01:00 PM EST',
    auctionVenue: 'Private Trustee Liquidation (Direct Lender Workout)',
    isRedemptionPeriodActive: false,
    propertyType: 'Unimproved Acreage',
    currentCondition: 'Vacant Land',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    summaryPitch: 'Pristine mountain parcel 15 minutes north of Asheville with natural springs, mature hardwood timber canopy, and south-facing microclimates. Ideal for high-end boutique glamping retreat and woodland medicinal crops.',
    tags: ['Asheville MSA', 'Mountain Springs', 'Forest Farming', 'Glamping', 'Value-Add'],
    featured: false,
    soil: {
      soilSeries: 'Fannin Loam',
      usdaTaxonomy: 'Fine-loamy, micaceous, mesic Typic Hapludults',
      textureDescription: 'Rich mountain loam high in organic forest humus and micaceous minerals',
      phRange: [5.2, 6.0],
      organicMatterPercentage: 5.4,
      drainageClass: 'Well Drained',
      hardinessZone: '7a',
      frostFreeDays: 185,
      annualRainfallInches: 47.5,
      waterRightsIncluded: true,
      waterTableDepthFt: '2 - 6 ft (Continuous springhead flow, 28 gpm)',
      nrcsSoilSurveyRating: 'Farmland of Statewide Importance'
    },
    suitableCrops: [
      {
        cropName: 'Wild-Simulated American Ginseng (Panax quinquefolius)',
        scientificFamily: 'Araliaceae',
        suitabilityScore: 97,
        harvestWindow: 'September - October (7-10 yr cycle)',
        estYieldPerAcre: '300 lbs dried roots / acre amortized',
        estGrossRevenuePerAcre: 48000,
        waterRequirement: 'Low - Moderate',
        soilPhPreference: '5.2 - 5.8',
        soilTextureFit: 'Fannin micaceous loam on north/northeast hardwood slopes is the native habitat',
        marketDemandRating: 'High Niche / Premium',
        agronomicNotes: 'Wild-simulated Appalachian ginseng commands $600-$900/lb from Asian export buyers.'
      },
      {
        cropName: 'Log-Grown Gourmet Lion’s Mane & Shiitake Mushrooms',
        scientificFamily: 'Hericiaceae / Omphalotaceae',
        suitabilityScore: 95,
        harvestWindow: 'April - November',
        estYieldPerAcre: '4,500 lbs / forest acre',
        estGrossRevenuePerAcre: 31500,
        waterRequirement: 'Moderate (Drip)',
        soilPhPreference: '5.0 - 6.2',
        soilTextureFit: 'Thrives in shaded hardwood understory with high natural humidity',
        marketDemandRating: 'Regional Direct-to-Consumer',
        agronomicNotes: 'Asheville’s thriving culinary scene buys fresh local mushrooms at $12-$16/lb wholesale.'
      }
    ],
    zoning: {
      code: 'OU (Open Use)',
      title: 'Buncombe County Zoning Ordinance - Chapter 78',
      jurisdiction: 'Buncombe County Planning & Development',
      permittedUses: [
        'Agritourism and forest farming',
        'Single-family homes & modular cabins',
        'Campground & rustic yurt lodging',
        'Equestrian facilities'
      ],
      conditionalUses: [
        'Commercial wedding and event venue',
        'Micro-distillery & tasting room',
        'Commercial outdoor recreation park'
      ],
      prohibitedUses: [
        'Heavy industrial chemical storage'
      ],
      setbacks: {
        frontFt: 20,
        sideFt: 10,
        rearFt: 20
      },
      maxBuildingHeightFt: 40,
      maxLotCoveragePercent: 40,
      minimumLotSizeAcres: 0.5,
      overlayDistricts: ['Steep Slope Protection Area (slopes > 35%)', 'Protected Mountain Ridge Overlay'],
      agRollbackTaxRisk: false,
      ordinanceRefUrl: 'https://www.buncombecounty.org/governing/depts/planning/'
    },
    liens: [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: 'Buncombe County Tax Department',
        amount: 4200,
        priority: 'Super-Priority',
        status: 'Must Be Cleared',
        notes: 'Delinquent timber forestry roll assessment'
      }
    ],
    businessIdeas: [
      {
        id: 'biz-asheville-glamping',
        name: 'Nordic Spa & Canopy Geodesic Dome Sanctuary',
        category: 'Hospitality / Eco-Stay',
        startupCapex: 210000,
        estAnnualRevenue: 390000,
        estAnnualNOI: 270000,
        paybackPeriodYears: 0.8,
        roiPercentage: 128.5,
        whyUniqueToArea: 'Buncombe County Open Use zoning provides unmatched flexibility for luxury eco-domes. Asheville tourist market boasts steady year-round occupancy driven by Blue Ridge Parkway leaf-peepers and craft beverage travelers.',
        keyRegulatoryHurdle: 'Buncombe County Steep Slope Erosion Control and engineered spring-fed potable water well permit.',
        citations: [
          {
            title: 'Explore Asheville Tourism Development Authority Annual Report',
            url: 'https://www.ashevillecvb.com/',
            sourceType: 'Tourism / Chamber',
            excerpt: 'Boutique outdoor nature lodging commands 82% average occupancy and $340 ADR in Buncombe County.'
          }
        ]
      }
    ],
    financials: {
      askingOrOpeningBid: 285000,
      estimatedARV: 620000,
      taxAssessedValue: 410000,
      delinquentTaxesTotal: 4200,
      juniorLiensTotal: 0,
      estimatedClearingCosts: 6500,
      estimatedCapExRehab: 25000,
      holdingCostsAnnual: 5400,
      redemptionPeriodMonths: 0,
      grossRentalPotentialAnnual: 65000,
      netOperatingIncomeProjected: 54000,
      capRate: 17.1,
      cashOnCashReturn: 21.4,
      irr5Year: 31.5,
      lienToValueRatio: 0.01,
      equitySpreadDiscount: 49.0
    }
  }
];
