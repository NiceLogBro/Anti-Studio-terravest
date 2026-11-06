import {
  InvestmentProperty,
  DistressType,
  SoilProfile,
  FoodCropSuitability,
  BusinessOpportunity,
  ZoningDetails,
  LienRecord,
  LandGrantProgram
} from '../types/property';
import { INITIAL_PROPERTIES } from '../data/mockProperties';

interface RegionArchetype {
  state: string;
  regionName: string;
  counties: string[];
  cities: string[];
  soilSeriesList: Array<{ name: string; taxonomy: string; texture: string; ph: [number, number]; zone: string; drainage: 'Well Drained' | 'Moderately Well Drained' | 'Excessively Drained' | 'Somewhat Poorly Drained'; rainfall: number; rating: 'Prime Farmland' | 'Farmland of Statewide Importance' | 'Prime if Irrigated' }>;
  cropArchetypes: Array<{ name: string; family: string; yield: string; rev: number; water: 'Low - Moderate' | 'Moderate (Drip)' | 'High (Irrigation Mandated)' | 'Very Low (Dryland)'; ph: string; notes: string }>;
  businessArchetypes: Array<{ name: string; category: BusinessOpportunity['category']; capex: number; noi: number; why: string; hurdle: string; citeTitle: string }>;
  zoningArchetypes: Array<{ code: string; title: string; permitted: string[]; conditional: string[] }>;
  distressTypes: DistressType[];
  imageUrls: string[];
}

const REGIONAL_ARCHETYPES: RegionArchetype[] = [
  // 1. Tropical South Florida & Redland Agricultural District
  {
    state: 'FL',
    regionName: 'South Florida / Redland Tropical Belt',
    counties: ['Miami-Dade County', 'Monroe County', 'Collier County', 'Palm Beach County', 'Hendry County'],
    cities: ['Homestead', 'Redland', 'Florida City', 'Immokalee', 'Loxahatchee', 'Clewiston'],
    soilSeriesList: [
      {
        name: 'Krome Very Gravelly Loam',
        taxonomy: 'Loamy-skeletal, carbonatic, hyperthermic Lithic Udorthents',
        texture: 'Oolitic limestone gravel with organic humus matrix, ideal for tropical tree root anchorage',
        ph: [7.5, 8.4],
        zone: '10b',
        drainage: 'Well Drained',
        rainfall: 62.0,
        rating: 'Prime if Irrigated'
      },
      {
        name: 'Margate Fine Sand',
        taxonomy: 'Siliceous, hyperthermic Mollic Psammaquents',
        texture: 'Deep sandy alluvium with high organic sub-horizon over limestone bedrock',
        ph: [6.8, 7.6],
        zone: '10b',
        drainage: 'Moderately Well Drained',
        rainfall: 58.5,
        rating: 'Prime Farmland'
      }
    ],
    cropArchetypes: [
      {
        name: 'Tropical Dragon Fruit (Pitaya Roja)',
        family: 'Cactaceae',
        yield: '14,000 lbs / acre',
        rev: 35000,
        water: 'Low - Moderate',
        ph: '6.0 - 7.5',
        notes: 'Thrives in South Florida sun; concrete trellis posts provide hurricane-resilient support.'
      },
      {
        name: 'Nam Doc Mai & Kent Mangoes',
        family: 'Anacardiaceae',
        yield: '160 bu (8,000 lbs) / acre',
        rev: 28000,
        water: 'Low - Moderate',
        ph: '6.5 - 8.0',
        notes: 'Dry winter induction period triggers prolific floral bloom with zero freeze risk.'
      },
      {
        name: 'Red Lady Papaya & Passionfruit',
        family: 'Caricaceae / Passifloraceae',
        yield: '32,000 lbs / acre',
        rev: 38000,
        water: 'Moderate (Drip)',
        ph: '6.2 - 7.8',
        notes: 'Rapid 9-month cash-flow turn; premium pricing at South Florida resort distributors.'
      },
      {
        name: 'West Indian Guava & Mamey Sapote',
        family: 'Myrtaceae / Sapotaceae',
        yield: '18,000 lbs / acre',
        rev: 31000,
        water: 'Moderate (Drip)',
        ph: '6.5 - 7.8',
        notes: 'Extremely high demand across Miami Latino culinary grocers and specialty markets.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Tropical Agro-Tourism Fruit Stand & Smoothie Bar',
        category: 'Agritourism & Events',
        capex: 145000,
        noi: 185000,
        why: 'Direct corridor on route to the Florida Keys and Everglades National Park sees over 3.2M annual drive-by tourists seeking authentic tropical fruit experiences.',
        hurdle: 'Miami-Dade County Agritourism Chapter 33-B zoning clearance and health department food permit.',
        citeTitle: 'UF/IFAS Tropical Research and Education Center Economic Report'
      },
      {
        name: 'High-Margin Rare Exotic Plant & Palm Nursery',
        category: 'High-Value Food Production',
        capex: 120000,
        noi: 160000,
        why: 'Luxury landscape contractors in Miami Beach, Naples, and Palm Beach consistently pay top dollar for mature specimen palms and tropical foliage.',
        hurdle: 'FDACS Division of Plant Industry certified nursery registration.',
        citeTitle: 'Florida Department of Agriculture Horticulture Census'
      },
      {
        name: 'Artisanal Tropical Fruit Winery & Tasting Pergola',
        category: 'Artisanal Processing',
        capex: 210000,
        noi: 240000,
        why: 'Specialty wines crafted from mango, lychee, and passion fruit capture premium tourist margins under Florida Farm Winery statutory exemptions.',
        hurdle: 'Florida DBPR Division of Alcoholic Beverages & Tobacco certified farm winery license.',
        citeTitle: 'Florida Farm Winery Association Economic Impact Analysis'
      }
    ],
    zoningArchetypes: [
      {
        code: 'AU (Agricultural District)',
        title: 'Miami-Dade Agricultural & Intensive Rural Commerce',
        permitted: ['Tropical fruit groves', 'Commercial wholesale nurseries', 'Single-family farm residence', 'Packing houses for on-site produce'],
        conditional: ['Agritourism venue and tasting pavilion', 'Commercial farmstand retail', 'Equestrian boarding']
      }
    ],
    distressTypes: ['Tax Lien Certificate', 'Sheriff Foreclosure Auction', 'Pre-Foreclosure / Short Sale', 'Bank-Owned REO'],
    imageUrls: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596785236251-71fa49ac6760?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 2. Hawaii & Island Agro-Forestry
  {
    state: 'HI',
    regionName: 'Hawaii Islands / Kona & Hilo Belt',
    counties: ['Hawaii County', 'Maui County', 'Honolulu County', 'Kauai County'],
    cities: ['Captain Cook', 'Kailua-Kona', 'Hilo', 'Kula', 'Kapaa', 'Waimea'],
    soilSeriesList: [
      {
        name: 'Kapunapuna Silty Clay Loam',
        taxonomy: 'Medial-skeletal, ferrihydritic, isohyperthermic Typic Hydrudands',
        texture: 'Rich volcanic andisols naturally enriched with potassium, phosphorus, and high organic humus',
        ph: [5.6, 6.4],
        zone: '11a',
        drainage: 'Well Drained',
        rainfall: 74.0,
        rating: 'Prime Farmland'
      },
      {
        name: 'Honokaa Silty Clay',
        taxonomy: 'Hydrous, ferrihydritic, isohyperthermic Acrudoxic Hydrudands',
        texture: 'Weathered volcanic ash with incredible porosity and water percolation',
        ph: [5.8, 6.5],
        zone: '11b',
        drainage: 'Well Drained',
        rainfall: 85.0,
        rating: 'Prime Farmland'
      }
    ],
    cropArchetypes: [
      {
        name: '100% Kona Typica Coffee & Cacao',
        family: 'Rubiaceae / Malvaceae',
        yield: '1,800 lbs roasted beans / acre',
        rev: 45000,
        water: 'Moderate (Drip)',
        ph: '5.5 - 6.5',
        notes: 'Cloud-belt afternoon mist and volcanic soil provide the global benchmark for specialty coffee.'
      },
      {
        name: 'Hawaiian Macadamia Nuts',
        family: 'Proteaceae',
        yield: '4,000 lbs in-shell / acre',
        rev: 22000,
        water: 'Low - Moderate',
        ph: '5.5 - 6.8',
        notes: 'Low maintenance tree crop with 50+ year commercial productive lifespan.'
      },
      {
        name: 'Bourbon Vanilla Orchid & Cardamom',
        family: 'Orchidaceae / Zingiberaceae',
        yield: '250 lbs cured beans / shaded acre',
        rev: 62500,
        water: 'Moderate (Drip)',
        ph: '5.8 - 6.8',
        notes: 'Intercropped under native ohia canopy; commanding $250-$350/lb from culinary pastry chefs.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Off-Grid Eco-Resort & Coffee Roastery Tasting Lanai',
        category: 'Hospitality / Eco-Stay',
        capex: 240000,
        noi: 310000,
        why: 'Hawaii tourism numbers surpass 9M annual visitors; eco-travelers willingly pay $380-$600/night for authentic farmstay bungalows with volcanic views.',
        hurdle: 'Hawaii County Special Management Area (SMA) Minor Permit and catchment water purification system.',
        citeTitle: 'Hawaii Department of Agriculture Specialty Crop Benchmark'
      },
      {
        name: 'Single-Origin Bean-to-Bar Cacao & Vanilla Workshop',
        category: 'Artisanal Processing',
        capex: 160000,
        noi: 195000,
        why: 'Hawaii is the only US state capable of commercial cacao production. Direct estate retail yields 500% over wholesale.',
        hurdle: 'Hawaii Department of Health Food Safety Branch commercial kitchen certificate.',
        citeTitle: 'University of Hawaii CTAHR Cacao Economic Model'
      }
    ],
    zoningArchetypes: [
      {
        code: 'A-5a (Agricultural District)',
        title: 'Hawaii County Agricultural 5-Acre Minimum',
        permitted: ['Agricultural cultivation and forestry', 'Single-family farm dwelling', 'Processing of agricultural goods from premises'],
        conditional: ['Farmstay guest cabins', 'Commercial retail farmstand', 'Commercial solar renewable generation']
      }
    ],
    distressTypes: ['Probate / Estate Distress', 'Bank-Owned REO', 'Distressed Value-Add Land', 'Tax Deed Sale'],
    imageUrls: [
      'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596785236251-71fa49ac6760?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 3. Central & Coastal California (Wine Country, Central Coast, Central Valley)
  {
    state: 'CA',
    regionName: 'California Central Coast & Valleys',
    counties: ['Sonoma County', 'Monterey County', 'San Luis Obispo County', 'Santa Barbara County', 'Fresno County', 'San Joaquin County'],
    cities: ['Paso Robles', 'Salinas', 'Healdsburg', 'Santa Maria', 'Fresno', 'Lodi', 'Bakersfield'],
    soilSeriesList: [
      {
        name: 'Yolo Silty Clay Loam',
        taxonomy: 'Fine-silty, mixed, superactive, nonacid, thermic Typic Xerorthents',
        texture: 'Deep alluvial silt loam with legendary fertility and nutrient-holding ability',
        ph: [6.8, 7.4],
        zone: '9a',
        drainage: 'Well Drained',
        rainfall: 22.0,
        rating: 'Prime Farmland'
      },
      {
        name: 'Linne Calcareous Clay Loam',
        taxonomy: 'Fine, mixed, superactive, thermic Typic Calciudolls',
        texture: 'Chalky limestone and shale subsoils delivering remarkable minerality and drainage',
        ph: [7.4, 8.2],
        zone: '9b',
        drainage: 'Well Drained',
        rainfall: 18.5,
        rating: 'Farmland of Statewide Importance'
      }
    ],
    cropArchetypes: [
      {
        name: 'Boutique Rhone & Heritage Wine Grapes (Syrah / Grenache)',
        family: 'Vitaceae',
        yield: '4.5 tons / acre',
        rev: 18000,
        water: 'Low - Moderate',
        ph: '6.5 - 7.5',
        notes: 'Limestone slopes replicate Southern Rhone terroir; high phenolic maturity with controlled deficit irrigation.'
      },
      {
        name: 'Mission & Arbequina Estate Olives',
        family: 'Oleaceae',
        yield: '4 tons / acre',
        rev: 16000,
        water: 'Low - Moderate',
        ph: '6.0 - 7.8',
        notes: 'Drought-tolerant staple; olive oil direct-to-consumer sales command $36/bottle.'
      },
      {
        name: 'Pistachios & Chandler Walnuts',
        family: 'Anacardiaceae / Juglandaceae',
        yield: '3,800 lbs / acre',
        rev: 14500,
        water: 'Moderate (Drip)',
        ph: '7.0 - 8.2',
        notes: 'Global demand from European and Asian confectionery and snack sectors.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Boutique Custom-Crush Winery & Olive Oil Bar',
        category: 'Artisanal Processing',
        capex: 260000,
        noi: 280000,
        why: 'California Central Coast tasting rooms draw weekend travelers from Los Angeles and Bay Area; high bottle margins offset operating costs.',
        hurdle: 'County Conditional Use Permit (CUP) for commercial tasting room and wastewater treatment approval.',
        citeTitle: 'California Department of Food and Agriculture Viticulture Study'
      },
      {
        name: 'Solar-Shaded Agricultural Cold Storage Co-Op',
        category: 'Commercial & Storage',
        capex: 310000,
        noi: 340000,
        why: 'Local small organic growers face multi-week backlogs at industrial refrigerated packhouses during harvest peak.',
        hurdle: 'PG&E interconnection agreement and county commercial building permit.',
        citeTitle: 'UC Davis Agricultural and Resource Economics Energy Analysis'
      }
    ],
    zoningArchetypes: [
      {
        code: 'AG (Agriculture Preservation)',
        title: 'California County Agricultural Zone Sec. 22.08',
        permitted: ['Vineyards and orchards', 'Agricultural processing up to 5,000 sqft', 'Primary farm residence'],
        conditional: ['Commercial tasting room', 'Agritourism farmstays (up to 4 units)', 'Renewable solar energy facilities']
      }
    ],
    distressTypes: ['Bank-Owned REO', 'Sheriff Foreclosure Auction', 'Pre-Foreclosure / Short Sale', 'Tax Deed Sale'],
    imageUrls: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 4. Texas Triangle & Hill Country
  {
    state: 'TX',
    regionName: 'Texas Hill Country & Austin Tech Corridor',
    counties: ['Travis County', 'Williamson County', 'Hays County', 'Bastrop County', 'Comal County', 'Gillespie County'],
    cities: ['Austin', 'Manor', 'Georgetown', 'Dripping Springs', 'Fredericksburg', 'New Braunfels'],
    soilSeriesList: [
      {
        name: 'Houston Black Clay',
        taxonomy: 'Fine, smectitic, thermic Udic Haplusterts',
        texture: 'Deep, dark calcareous heavy clay famous for water holding capacity during hot summer droughts',
        ph: [7.5, 8.2],
        zone: '8b',
        drainage: 'Moderately Well Drained',
        rainfall: 34.5,
        rating: 'Prime Farmland'
      },
      {
        name: 'Doss Silty Clay',
        taxonomy: 'Clayey-skeletal, carbonatic, thermic Shallow Typic Calciustolls',
        texture: 'Gravelly limestone clay loam on undulating hills; outstanding for drought-hardy roots',
        ph: [7.6, 8.4],
        zone: '8a',
        drainage: 'Well Drained',
        rainfall: 31.0,
        rating: 'Farmland of Statewide Importance'
      }
    ],
    cropArchetypes: [
      {
        name: 'Improved Texas Pecans (Pawnee / Caddo)',
        family: 'Juglandaceae',
        yield: '1,500 lbs / acre',
        rev: 6000,
        water: 'Moderate (Drip)',
        ph: '6.8 - 8.0',
        notes: 'Native state tree; strong resistance to scab; deep clay soils support massive root systems.'
      },
      {
        name: 'Spanish Black Grapes & Blanc Du Bois',
        family: 'Vitaceae',
        yield: '5 tons / acre',
        rev: 9500,
        water: 'Low - Moderate',
        ph: '7.2 - 8.2',
        notes: 'Immune to Pierce Disease, ideal for Fredericksburg wine trail sourcing.'
      },
      {
        name: 'Culinary Lavender & Rosemary Herbs',
        family: 'Lamiaceae',
        yield: '3,500 bundles / acre',
        rev: 21000,
        water: 'Very Low (Dryland)',
        ph: '7.5 - 8.5',
        notes: 'High tourist u-pick draw with zero deer damage.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Contractor Equipment Staging & Laydown Yard',
        category: 'Commercial & Storage',
        capex: 175000,
        noi: 225000,
        why: 'East Austin tech corridor expansion has created severe shortage of secured gravel yards for subcontractors.',
        hurdle: 'County Chapter 64 Commercial Driveway Permit and stormwater detention certification.',
        citeTitle: 'Austin Real Estate Council Industrial & Infrastructure Report'
      },
      {
        name: 'Hill Country Orchard Brewery & Smoked BBQ Farmstand',
        category: 'Agritourism & Events',
        capex: 290000,
        noi: 240000,
        why: 'Preserves 1-D-1 Ag property tax appraisal under Texas Property Code Sec. 23.51 while serving urban day-trippers.',
        hurdle: 'TABC Farm-Brewery License and TCEQ engineered on-site sewage facility (OSSF).',
        citeTitle: 'Texas A&M AgriLife Extension Agritourism Legal Guide'
      }
    ],
    zoningArchetypes: [
      {
        code: 'AG-2 / ETJ',
        title: 'Texas Extraterritorial Jurisdiction / General Ag',
        permitted: ['Ag production', 'Single-family residence', 'Produce stand', 'Equestrian'],
        conditional: ['Open contractor storage', 'Commercial solar', 'Agritourism pavilion']
      }
    ],
    distressTypes: ['Sheriff Foreclosure Auction', 'Tax Lien Certificate', 'Probate / Estate Distress'],
    imageUrls: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 5. Pacific Northwest (Washington / Oregon Orchards & Hops)
  {
    state: 'WA',
    regionName: 'Pacific Northwest Yakima & Willamette Basin',
    counties: ['Yakima County', 'Chelan County', 'Marion County', 'Hood River County', 'Grant County'],
    cities: ['Yakima', 'Wenatchee', 'Zillah', 'Hood River', 'Salem', 'Prosser'],
    soilSeriesList: [
      {
        name: 'Warden Silt Loam',
        taxonomy: 'Coarse-silty, mixed, superactive, mesic Xeric Haplocambids',
        texture: 'Deep, uniform silt loam with exceptional moisture holding and nutrient retention',
        ph: [6.6, 7.3],
        zone: '6b',
        drainage: 'Well Drained',
        rainfall: 10.2,
        rating: 'Prime Farmland'
      }
    ],
    cropArchetypes: [
      {
        name: 'Aroma & Dual-Purpose Hops (Citra / Mosaic)',
        family: 'Cannabaceae',
        yield: '2,200 lbs dried cones / acre',
        rev: 24000,
        water: 'Moderate (Drip)',
        ph: '6.5 - 7.5',
        notes: 'Yakima Valley accounts for 75% of total US hop crop; high direct craft brewery contract margins.'
      },
      {
        name: 'Organic Honeycrisp & Cosmic Crisp Apples',
        family: 'Rosaceae',
        yield: '42,000 lbs / acre',
        rev: 21000,
        water: 'Moderate (Drip)',
        ph: '6.5 - 7.2',
        notes: 'Sunny days and chilly high-desert nights produce unmatched color and sugar density.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Micro-Brewery Hop Pelletizing & Cold-Chain Co-Op',
        category: 'Artisanal Processing',
        capex: 180000,
        noi: 175000,
        why: 'Direct farm-to-brewery contracts bypass broker discounts and deliver 35% higher price realization.',
        hurdle: 'WSDA Food Processor License and dust collection emission clearance.',
        citeTitle: 'Washington State Department of Agriculture Craft Beverage Study'
      }
    ],
    zoningArchetypes: [
      {
        code: 'AG (Exclusive Agriculture)',
        title: 'Washington State Agricultural Preservation',
        permitted: ['Commercial agriculture', 'Cold storage for on-farm produce', 'Farmworker housing'],
        conditional: ['Commercial hop pelletizing facility', 'Agritourism tasting room']
      }
    ],
    distressTypes: ['Tax Deed Sale', 'Bank-Owned REO', 'Distressed Value-Add Land'],
    imageUrls: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 6. Southeast Mountain & Foothills (Carolinas / Georgia / Tennessee)
  {
    state: 'NC',
    regionName: 'Appalachian & Blue Ridge Foothills',
    counties: ['Buncombe County', 'Henderson County', 'Haywood County', 'Transylvania County', 'Rabun County'],
    cities: ['Asheville', 'Hendersonville', 'Weaverville', 'Brevard', 'Clayton'],
    soilSeriesList: [
      {
        name: 'Fannin Micaceous Loam',
        taxonomy: 'Fine-loamy, micaceous, mesic Typic Hapludults',
        texture: 'Rich mountain loam packed with organic forest humus and micaceous minerals',
        ph: [5.2, 6.0],
        zone: '7a',
        drainage: 'Well Drained',
        rainfall: 48.0,
        rating: 'Farmland of Statewide Importance'
      }
    ],
    cropArchetypes: [
      {
        name: 'Wild-Simulated American Ginseng & Goldenseal',
        family: 'Araliaceae',
        yield: '320 lbs dried roots / acre',
        rev: 52000,
        water: 'Low - Moderate',
        ph: '5.2 - 5.8',
        notes: 'Grown under shaded north-facing hardwood timber; commands $700-$900/lb from Asian export buyers.'
      },
      {
        name: 'Gourmet Shiitake & Lion’s Mane Forest Mushrooms',
        family: 'Hericiaceae / Omphalotaceae',
        yield: '4,800 lbs / shaded acre',
        rev: 33000,
        water: 'Moderate (Drip)',
        ph: '5.0 - 6.2',
        notes: 'High natural mountain humidity produces robust caps sold to regional culinary restaurants.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Nordic Forest Spa & Canopy Geodesic Domes',
        category: 'Hospitality / Eco-Stay',
        capex: 215000,
        noi: 275000,
        why: 'Asheville eco-tourism delivers 82% annual occupancy with $340 average daily rates.',
        hurdle: 'Steep slope erosion control ordinance and engineered spring-fed potable water well permit.',
        citeTitle: 'Buncombe County Tourism Development Economic Report'
      }
    ],
    zoningArchetypes: [
      {
        code: 'OU (Open Use)',
        title: 'Buncombe County Flexible Rural Open Use',
        permitted: ['Forest farming', 'Single-family homes and modular yurts', 'Rustic camping'],
        conditional: ['Commercial wedding pavilion', 'Outdoor recreation facility']
      }
    ],
    distressTypes: ['Distressed Value-Add Land', 'Probate / Estate Distress', 'Sheriff Foreclosure Auction'],
    imageUrls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 7. Southwest Arid & Sunbelt (Arizona / New Mexico / Nevada)
  {
    state: 'AZ',
    regionName: 'Southwest Sunbelt & Desert Agriculture',
    counties: ['Maricopa County', 'Pinal County', 'Yuma County', 'Pima County'],
    cities: ['Buckeye', 'Casa Grande', 'Yuma', 'Marana', 'Goodyear'],
    soilSeriesList: [
      {
        name: 'Gilman Fine Sandy Loam',
        taxonomy: 'Coarse-loamy, mixed, superactive, hyperthermic Typic Torrifluvents',
        texture: 'Deep, highly permeable stratified desert loam on level plains with outstanding root penetration',
        ph: [7.8, 8.4],
        zone: '9b',
        drainage: 'Well Drained',
        rainfall: 7.5,
        rating: 'Prime if Irrigated'
      }
    ],
    cropArchetypes: [
      {
        name: 'Medjool Date Palms',
        family: 'Arecaceae',
        yield: '8,500 lbs / acre',
        rev: 34000,
        water: 'Moderate (Drip)',
        ph: '7.5 - 8.5',
        notes: 'High solar radiation and mineral-rich soils produce sweet, caramel-like export quality dates.'
      },
      {
        name: 'Blue Agave (Agave tequilana)',
        family: 'Asparagaceae',
        yield: '25 tons piñas / acre amortized',
        rev: 19000,
        water: 'Very Low (Dryland)',
        ph: '7.5 - 8.4',
        notes: 'Drought-proof crop; burgeoning demand from regional Arizona craft agave spirit distilleries.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Solar-Canopy RV & Off-Road Fleet Staging Depot',
        category: 'Commercial & Storage',
        capex: 295000,
        noi: 375000,
        why: 'Fastest growing suburban housing markets in the US have strict HOA bylaws banning RV/boat parking in driveways.',
        hurdle: 'City Conditional Use Permit for Commercial Outdoor Vehicle Storage.',
        citeTitle: 'Maricopa Association of Governments Infrastructure Analysis'
      }
    ],
    zoningArchetypes: [
      {
        code: 'RU-43 (Rural Reserve)',
        title: 'Maricopa County Rural Employment Overlay',
        permitted: ['Irrigated farming', 'Single family residential', 'Ag processing'],
        conditional: ['Open storage of transport equipment', 'Solar photovoltaic facility']
      }
    ],
    distressTypes: ['Sheriff Foreclosure Auction', 'Pre-Foreclosure / Short Sale', 'Bank-Owned REO'],
    imageUrls: [
      'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 8. Mid-Atlantic & Lancaster Organic Belt (Pennsylvania / Maryland / Virginia)
  {
    state: 'PA',
    regionName: 'Mid-Atlantic Limestone Organic Belt',
    counties: ['Lancaster County', 'York County', 'Chester County', 'Berks County'],
    cities: ['Strasburg', 'Lititz', 'Ephrata', 'Oxford', 'Elverson'],
    soilSeriesList: [
      {
        name: 'Hagerstown Silt Loam',
        taxonomy: 'Fine, mixed, semiactive, mesic Typic Hapludalfs',
        texture: 'Deep, fertile limestone valley loam rated USDA Prime Class I Farmland',
        ph: [6.4, 7.0],
        zone: '7a',
        drainage: 'Well Drained',
        rainfall: 43.5,
        rating: 'Prime Farmland'
      }
    ],
    cropArchetypes: [
      {
        name: 'Organic Heritage Garlic & Shallots',
        family: 'Amaryllidaceae',
        yield: '12,500 lbs / acre',
        rev: 37500,
        water: 'Low - Moderate',
        ph: '6.5 - 7.0',
        notes: 'Supplies high-end farm-to-table restaurants across Philadelphia, NYC, and Washington DC.'
      },
      {
        name: 'Organic Pastured Egg & Poultry Rotation',
        family: 'Avian Agrosystem',
        yield: '380 laying hens / pasture acre',
        rev: 26000,
        water: 'Low - Moderate',
        ph: '6.2 - 7.2',
        notes: 'Rotational grazing builds soil organic matter while yielding top retail egg contracts.'
      }
    ],
    businessArchetypes: [
      {
        name: 'Historic Bank Barn Stone-Milled Grain Bakery',
        category: 'Artisanal Processing',
        capex: 155000,
        noi: 205000,
        why: 'Lancaster County attracts 9M tourists annually looking for heritage food experiences.',
        hurdle: 'PA Department of Agriculture wholesale bakery food safety license.',
        citeTitle: 'Penn State Extension Agricultural Entrepreneurship Study'
      }
    ],
    zoningArchetypes: [
      {
        code: 'A (Agricultural Preservation)',
        title: 'Lancaster County Agricultural Land Preservation',
        permitted: ['Ag production', 'Artisanal grain milling', 'Farm retail stand'],
        conditional: ['Agritourism educational farm experiences', 'Equine facility']
      }
    ],
    distressTypes: ['Probate / Estate Distress', 'Tax Lien Certificate', 'Bank-Owned REO'],
    imageUrls: [
      'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];

/**
 * Generates actionable Federal and State land grants for a property
 */
export function getEligibleLandGrantsForProperty(
  state: string,
  acreage: number,
  businessCategory: string,
  topBizName: string,
  soilRating: string
): LandGrantProgram[] {
  const grants: LandGrantProgram[] = [];

  // 1. USDA EQIP (Environmental Quality Incentives Program)
  grants.push({
    id: `grant-eqip-${state.toLowerCase()}-${Math.round(acreage)}`,
    name: 'USDA EQIP Ag Conservation & Irrigation Cost-Share',
    agency: 'USDA Natural Resources Conservation Service (NRCS)',
    grantType: 'Federal Cost-Share',
    maxFundingAmount: Math.min(450000, Math.round(acreage * 12500 + 45000)),
    matchRequirement: 'Up to 75% federal reimbursement (90% for beginning or historically underserved producers)',
    purpose: 'Funding for micro-irrigation/drip lines, seasonal high-tunnel hoop houses, soil organic amendments, and erosion control windbreaks.',
    eligibilityCriteria: 'Agricultural producers with documented control of deeded land and gross farm income within USDA AGI statutory limits ($900k AGI).',
    implementationSteps: [
      'Obtain USDA Farm Service Agency (FSA) Farm & Tract number at local county service center.',
      'Request free NRCS comprehensive conservation site assessment and soil moisture audit.',
      'Submit Form NRCS-CPA-1200 prioritizing Practice 325 (High Tunnel) and Practice 441 (Irrigation Micro-System).',
      'Execute 3-to-5 year contract and receive staged progress disbursements upon installation inspection.'
    ],
    applicationWindow: 'Continuous intake with quarterly ranking batches (State cutoffs in Nov/Feb/May)',
    officialUrl: 'https://www.nrcs.usda.gov/programs-initiatives/eqip-environmental-quality-incentives'
  });

  // 2. USDA REAP (Rural Energy for America Program)
  grants.push({
    id: `grant-reap-${state.toLowerCase()}-${Math.round(acreage)}`,
    name: 'USDA REAP Commercial Ag Solar & Energy Independence Grant',
    agency: 'USDA Rural Development',
    grantType: 'Renewable Energy Grant',
    maxFundingAmount: Math.min(500000, Math.max(75000, Math.round(acreage * 15000 + 60000))),
    matchRequirement: '50% federal grant covering up to 50% of total renewable project costs',
    purpose: 'Installation of commercial ag solar arrays, ground-mount PV canopy over farm storage/parking, geothermal, and zero-emission microgrids.',
    eligibilityCriteria: 'Agricultural producers generating at least 50% of gross revenue from farming, or eligible rural small commercial businesses.',
    implementationSteps: [
      'Complete site solar insolation feasibility analysis and interconnection pre-study with local utility.',
      'Obtain active SAM.gov Unique Entity Identifier (UEI) and CAGE code registration.',
      'File USDA Form RD 4280-3A with verified contractor turnkey installation quotes.',
      'Receive official federal grant commitment before purchasing solar panels or energizing system.'
    ],
    applicationWindow: 'Quarterly review deadlines: March 31, June 30, September 30, December 31',
    officialUrl: 'https://www.rd.usda.gov/programs-services/energy-programs/rural-energy-america-program-renewable-energy-systems-energy-efficiency-improvement-guaranteed-loans'
  });

  // 3. USDA Value-Added Producer Grant (VAPG) or Beginning Farmer Grant
  if (
    businessCategory === 'Artisanal Processing' ||
    businessCategory === 'High-Value Food Production' ||
    businessCategory === 'Agritourism & Events'
  ) {
    grants.push({
      id: `grant-vapg-${state.toLowerCase()}-${Math.round(acreage)}`,
      name: 'USDA Value-Added Producer Grant (VAPG)',
      agency: 'USDA Rural Development',
      grantType: 'Value-Added Ag Grant',
      maxFundingAmount: 250000,
      matchRequirement: '1:1 dollar-for-dollar matching funds (cash, operational equity, or inventory)',
      purpose: `Working capital to process raw harvest into high-margin branded products for ${topBizName} (packaging, culinary extraction, label design, cold storage logistics).`,
      eligibilityCriteria: 'Independent agricultural producers, farmer cooperatives, and majority producer-owned agro-ventures.',
      implementationSteps: [
        'Complete third-party commercial feasibility study and 3-year business pro-forma.',
        'Document customer intent / purchase orders from regional wholesalers, restaurants, or estate retail.',
        'Submit comprehensive grant application via Grants.gov during the annual federal cycle.',
        'Deploy funds to cover processing payroll, certified packaging, and retail brand launch.'
      ],
      applicationWindow: 'Annual competitive window (typically closes in April/May)',
      officialUrl: 'https://www.rd.usda.gov/programs-services/business-programs/value-added-producer-grants'
    });
  } else {
    grants.push({
      id: `grant-bfrdp-${state.toLowerCase()}-${Math.round(acreage)}`,
      name: 'USDA Beginning Farmer & Rancher Capital & Land Support',
      agency: 'USDA Farm Service Agency (FSA)',
      grantType: 'New & Beginning Farmer',
      maxFundingAmount: 300000,
      matchRequirement: 'No cash match required; 5% down payment for land acquisition participation loans',
      purpose: 'Infrastructure modernization, equipment subsidies, and low-interest down payment capital for operators within their first 10 years.',
      eligibilityCriteria: 'Operators who have not operated a farm for more than 10 consecutive years and participate materially in farm operations.',
      implementationSteps: [
        'Complete Form FSA-2001 (Request for Direct Loan / Assistance).',
        'Demonstrate agricultural business plan with 3-year cash flow projections.',
        'Pair with FSA County Committee mentorship and conservation compliance signoff.'
      ],
      applicationWindow: 'Open year-round / rolling acceptance',
      officialUrl: 'https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/beginning-farmers-and-ranchers-loans'
    });
  }

  // 4. Region & State Specific Grant
  switch (state) {
    case 'FL':
      grants.push({
        id: `grant-state-fl-bmp-${Math.round(acreage)}`,
        name: 'Florida FDACS Agricultural BMP Water & Precision Nutrient Grant',
        agency: 'Florida Dept of Agriculture & Consumer Services (FDACS) Office of Ag Water Policy',
        grantType: 'State Preservation',
        maxFundingAmount: 100000,
        matchRequirement: '75% state reimbursement (25% producer cost-share)',
        purpose: 'Direct cost-share for precision GPS soil moisture telemetry, drip irrigation retrofits, and hurricane-rated fertigation containment in South Florida.',
        eligibilityCriteria: 'Parcels enrolled in the Florida FDACS Best Management Practices (BMP) Notice of Intent (NOI) program.',
        implementationSteps: [
          'Enroll parcel APN in the FDACS Ag BMP Program and pass initial field verification.',
          'Request cost-share application through local South Florida Soil & Water Conservation District.',
          'Procure approved precision irrigation and nutrient equipment; submit invoices for 75% reimbursement.'
        ],
        applicationWindow: 'Continuous state fiscal year enrollment',
        officialUrl: 'https://www.fdacs.gov/Agriculture-Industry/Water/Agricultural-Best-Management-Practices'
      });
      break;

    case 'HI':
      grants.push({
        id: `grant-state-hi-adc-${Math.round(acreage)}`,
        name: 'Hawaii HDOA Agribusiness Development & Diversified Crops Grant',
        agency: 'State of Hawaii Department of Agriculture (HDOA) & ADC',
        grantType: 'State Preservation',
        maxFundingAmount: 125000,
        matchRequirement: '20% applicant matching funds',
        purpose: 'Establishment of certified cacao fermentaries, coffee micro-mills, vanilla shade houses, and off-grid catchment water purification.',
        eligibilityCriteria: 'Commercial producers on Hawaii agricultural-zoned lands promoting food sustainability and local value-added export production.',
        implementationSteps: [
          'Submit Hawaii Tax Clearance and Certificate of Good Standing via Hawaii DCCA.',
          'Prepare project summary detailing job creation and local island food security impact.',
          'Submit application to HDOA Market Development Branch during the biennial RFP cycle.'
        ],
        applicationWindow: 'Spring legislative funding cycles (Feb - June)',
        officialUrl: 'https://hdoa.hawaii.gov/add/'
      });
      break;

    case 'CA':
      grants.push({
        id: `grant-state-ca-hsp-${Math.round(acreage)}`,
        name: 'California CDFA Healthy Soils Program (HSP) Incentives',
        agency: 'California Department of Food and Agriculture (CDFA)',
        grantType: 'State Preservation',
        maxFundingAmount: 100000,
        matchRequirement: 'Zero matching requirement (100% direct grant disbursement)',
        purpose: 'Incentive payments for compost application, multi-species cover cropping, biochar soil integration, and hedgerow planting.',
        eligibilityCriteria: 'California agricultural operations with soil carbon sequestration management commitments.',
        implementationSteps: [
          'Use the CDFA COMET-Planner tool to quantify estimated greenhouse gas reductions on the parcel.',
          'Submit project work plan through CDFA electronic portal.',
          'Execute agreement and implement practices; submit annual soil carbon lab tests for grant payouts.'
        ],
        applicationWindow: 'Annual winter/spring solicitation',
        officialUrl: 'https://www.cdfa.ca.gov/oefi/healthysoils/'
      });
      break;

    case 'TX':
      grants.push({
        id: `grant-state-tx-yfg-${Math.round(acreage)}`,
        name: 'Texas Department of Agriculture Young Farmer Grant (YFG)',
        agency: 'Texas Department of Agriculture (TDA) & Texas Ag Finance Authority (TAFA)',
        grantType: 'New & Beginning Farmer',
        maxFundingAmount: 20000,
        matchRequirement: '1:1 dollar-for-dollar cash match',
        purpose: 'Capital grants for agricultural production facilities, specialized harvesting machinery, and high-margin direct-to-consumer processing.',
        eligibilityCriteria: 'Texas agricultural producers between 18 and 45 years of age with operational control of the parcel.',
        implementationSteps: [
          'Draft business narrative emphasizing commercial viability and market gap fulfillment in Texas.',
          'Provide verified bank statement confirming 1:1 matching cash availability.',
          'Submit via TDA online grants portal during biannual spring or fall rounds.'
        ],
        applicationWindow: 'Biannual rounds (March and October deadlines)',
        officialUrl: 'https://www.texasagriculture.gov/Grants-Services/Young-Farmer-Grant'
      });
      break;

    case 'WA':
      grants.push({
        id: `grant-state-wa-scbg-${Math.round(acreage)}`,
        name: 'Washington WSDA Specialty Crop & Irrigation Efficiency Grant',
        agency: 'Washington State Department of Agriculture (WSDA)',
        grantType: 'State Preservation',
        maxFundingAmount: 150000,
        matchRequirement: '25% applicant cost share',
        purpose: 'Cold storage modernization, automated frost protection systems, and organic certification cost offsets for berry and specialty orchards.',
        eligibilityCriteria: 'Washington commercial growers of USDA-defined specialty crops (fruits, vegetables, tree nuts, horticulture).',
        implementationSteps: [
          'Submit pre-proposal concept to WSDA Specialty Crop Program coordinator.',
          'Upon invitation, submit full project proposal including letters of community support.',
          'Deploy grant funds across project milestones with quarterly performance reports.'
        ],
        applicationWindow: 'Annual cycle (January concept deadlines)',
        officialUrl: 'https://agr.wa.gov/services/grants/specialty-crop-block-grant'
      });
      break;

    case 'NC':
      grants.push({
        id: `grant-state-nc-adfp-${Math.round(acreage)}`,
        name: 'North Carolina ADFP Farmland Preservation & Ag Enterprise Grant',
        agency: 'N.C. Department of Agriculture & Consumer Services (NCDA&CS)',
        grantType: 'State Preservation',
        maxFundingAmount: 250000,
        matchRequirement: 'Cost-share varying from 10% to 30%',
        purpose: 'Preservation of family agricultural lands, construction of value-added processing hubs, and agritourism educational facilities.',
        eligibilityCriteria: 'Landowners with qualifying county voluntary agricultural district (VAD) status or eligible farm enterprises.',
        implementationSteps: [
          'Confirm parcel participation or eligibility for county Voluntary Ag District (VAD).',
          'Partner with local soil and water conservation district on the application proposal.',
          'Submit grant package to ADFP Advisory Committee for review.'
        ],
        applicationWindow: 'Annual fall solicitation (typically October - December)',
        officialUrl: 'https://www.ncadfp.org/'
      });
      break;

    case 'AZ':
      grants.push({
        id: `grant-state-az-water-${Math.round(acreage)}`,
        name: 'Arizona Department of Agriculture Ag-Water Efficiency Grant',
        agency: 'Arizona Department of Agriculture (AZDA)',
        grantType: 'State Preservation',
        maxFundingAmount: 150000,
        matchRequirement: '50% cost-share reimbursement',
        purpose: 'Subsurface drip conversion, laser land leveling, and smart automated soil hydration telemetry in arid desert microclimates.',
        eligibilityCriteria: 'Commercial agricultural landholders with grandfathered groundwater irrigation rights or surface canal allotments.',
        implementationSteps: [
          'Provide irrigation district water certificate and parcel acreage verification.',
          'Submit engineering blueprint of proposed drip or precision conversion.',
          'Complete installation and submit flow-meter efficiency audit for grant payout.'
        ],
        applicationWindow: 'Biannual grant windows (Spring and Fall)',
        officialUrl: 'https://agriculture.az.gov/grants'
      });
      break;

    case 'PA':
      grants.push({
        id: `grant-state-pa-first-${Math.round(acreage)}`,
        name: 'Pennsylvania First Industries Ag Excellence & Processing Grant',
        agency: 'Pennsylvania Commonwealth Financing Authority (CFA) & Dept of Agriculture',
        grantType: 'State Preservation',
        maxFundingAmount: 200000,
        matchRequirement: '50% non-state matching funds',
        purpose: 'Construction of on-farm commercial processing kitchens, grain cleaning silos, cold storage, and heritage agro-enterprises.',
        eligibilityCriteria: 'Pennsylvania agricultural producers, processors, and farm cooperatives.',
        implementationSteps: [
          'Coordinate with local County Industrial Development Authority or economic development agency.',
          'Submit CFA Single Application for Assistance online with business financial statements.',
          'Execute board approval and receive reimbursement disbursements against approved invoices.'
        ],
        applicationWindow: 'Continuous quarterly review cycles',
        officialUrl: 'https://dced.pa.gov/programs/first-industries-fund-fif/'
      });
      break;

    default:
      grants.push({
        id: `grant-state-generic-${state.toLowerCase()}-${Math.round(acreage)}`,
        name: `${state} Ag Enterprise & Farmland Sustainability Grant`,
        agency: `${state} Department of Agriculture`,
        grantType: 'State Preservation',
        maxFundingAmount: 100000,
        matchRequirement: '30% applicant cost share',
        purpose: 'Modernization of agricultural production infrastructure, agritourism facilities, and farmstead renewable microgrids.',
        eligibilityCriteria: 'State-certified agricultural producers with demonstrable rural economic impact.',
        implementationSteps: [
          'Register with state department of agriculture vendor directory.',
          'Submit project proposal with contractor cost estimates.',
          'Execute state grant agreement and submit inspection milestones.'
        ],
        applicationWindow: 'Annual state budget fiscal cycle',
        officialUrl: 'https://www.usda.gov/'
      });
      break;
  }

  return grants;
}

/**
 * Generates 100 high-quality, realistic distressed investment properties
 */
export function generate100Properties(): InvestmentProperty[] {
  // Ensure initial properties have full grant assignments
  const properties: InvestmentProperty[] = INITIAL_PROPERTIES.map((p) => ({
    ...p,
    eligibleLandGrants:
      p.eligibleLandGrants && p.eligibleLandGrants.length > 0
        ? p.eligibleLandGrants
        : getEligibleLandGrantsForProperty(
            p.state,
            p.acreage,
            p.businessIdeas[0]?.category || 'High-Value Food Production',
            p.businessIdeas[0]?.name || 'Ag Venture',
            p.soil.nrcsSoilSurveyRating
          )
  }));

  const targetCount = 100;
  let idCounter = 101;

  while (properties.length < targetCount) {
    const regionIdx = (properties.length) % REGIONAL_ARCHETYPES.length;
    const region = REGIONAL_ARCHETYPES[regionIdx];

    const county = region.counties[(properties.length * 3) % region.counties.length];
    const city = region.cities[(properties.length * 5) % region.cities.length];
    const soil = region.soilSeriesList[properties.length % region.soilSeriesList.length];
    const distress = region.distressTypes[(properties.length * 7) % region.distressTypes.length];
    const zoning = region.zoningArchetypes[0];
    const topBiz = region.businessArchetypes[properties.length % region.businessArchetypes.length];
    const imgUrl = region.imageUrls[properties.length % region.imageUrls.length];

    // Acreage between 5 and 85 acres
    const acreage = Number((5 + ((properties.length * 7.3) % 80)).toFixed(1));

    // Pricing based on acreage & region
    const basePricePerAcre = region.state === 'HI' ? 38000 : region.state === 'CA' ? 32000 : region.state === 'FL' ? 26000 : 16000;
    const askingPrice = Math.round((acreage * basePricePerAcre * (0.55 + ((properties.length % 5) * 0.08))) / 1000) * 1000;
    const discountPercent = Number((32 + ((properties.length * 3.7) % 24)).toFixed(1));
    const arv = Math.round(askingPrice / (1 - discountPercent / 100));
    const delinquentTax = Math.round(askingPrice * (0.015 + ((properties.length % 4) * 0.008)));
    const clearingCost = Math.round(delinquentTax + 3200);
    const rehab = Math.round(askingPrice * 0.08);
    const noi = topBiz.noi;
    const capRate = Number(((noi / (askingPrice + clearingCost + rehab)) * 100).toFixed(1));
    const irr = Number((capRate + 12.5).toFixed(1));
    const coc = Number((capRate * 1.15).toFixed(1));

    const crops: FoodCropSuitability[] = region.cropArchetypes.map((crop, cIdx) => ({
      cropName: crop.name,
      scientificFamily: crop.family,
      suitabilityScore: Math.min(99, 88 + ((cIdx + properties.length) % 11)),
      harvestWindow: (cIdx % 2 === 0) ? 'July - October' : 'November - March',
      estYieldPerAcre: crop.yield,
      estGrossRevenuePerAcre: crop.rev,
      waterRequirement: crop.water,
      soilPhPreference: crop.ph,
      soilTextureFit: soil.texture,
      marketDemandRating: (cIdx % 2 === 0) ? 'High Niche / Premium' : 'Regional Direct-to-Consumer',
      agronomicNotes: crop.notes
    }));

    const businessIdeas: BusinessOpportunity[] = [
      {
        id: `biz-${idCounter}-1`,
        name: topBiz.name,
        category: topBiz.category,
        startupCapex: topBiz.capex,
        estAnnualRevenue: Math.round(topBiz.noi * 1.6),
        estAnnualNOI: topBiz.noi,
        paybackPeriodYears: Number((topBiz.capex / topBiz.noi).toFixed(1)),
        roiPercentage: Number(((topBiz.noi / topBiz.capex) * 100).toFixed(1)),
        whyUniqueToArea: topBiz.why,
        keyRegulatoryHurdle: topBiz.hurdle,
        citations: [
          {
            title: topBiz.citeTitle,
            url: 'https://www.usda.gov/',
            sourceType: 'Government / USDA',
            excerpt: 'Documented strong commercial ROI for diversified agro-ventures in this regional corridor.'
          }
        ]
      }
    ];

    const liens: LienRecord[] = [
      {
        lienType: 'County Ad Valorem Tax',
        claimant: `${county} Tax Collector`,
        amount: delinquentTax,
        priority: 'Super-Priority',
        status: 'Survives Foreclosure',
        notes: 'Secured delinquent property tax arrears'
      }
    ];

    if (distress.includes('Foreclosure') || distress.includes('Sheriff')) {
      liens.push({
        lienType: '1st Mortgage / Deed of Trust',
        claimant: 'Regional Farm Credit Bank',
        amount: Math.round(askingPrice * 1.1),
        priority: 'Senior',
        status: 'Extinguished at Sale',
        notes: 'Foreclosing deed holder triggering liquidation'
      });
    }

    const propNumber = properties.length + 1;
    const title = `${acreage} AC ${city} ${region.state === 'FL' || region.state === 'HI' ? 'Tropical' : 'Prime'} ${distress.split(' ')[0]} Investment Parcel`;

    properties.push({
      id: `prop-gen-${idCounter}`,
      title,
      address: `${100 + idCounter * 12} ${city} Highway ${70 + (idCounter % 50)}`,
      city,
      county,
      state: region.state,
      zipCode: `${30000 + (idCounter * 71) % 60000}`,
      coordinates: {
        lat: Number((25.0 + (idCounter * 1.37) % 23.0).toFixed(4)),
        lng: Number((-122.0 + (idCounter * 2.11) % 45.0).toFixed(4))
      },
      parcelIdAPN: `${Math.floor(100000 + (idCounter * 8321) % 899999)}-${Math.floor(1000 + (idCounter * 491) % 8999)}`,
      acreage,
      distressType: distress,
      auctionDate: `2026-11-${10 + (idCounter % 20)} 10:00 AM`,
      isRedemptionPeriodActive: distress.includes('Tax') || distress.includes('Foreclosure'),
      propertyType: (region.state === 'FL' || region.state === 'HI') ? 'Specialty Orchard / Vineyard' : (acreage > 30 ? 'Agricultural Land' : 'Mixed-Use Commercial & Ag'),
      currentCondition: (idCounter % 3 === 0) ? 'Distressed Structures' : 'Vacant Land',
      imageUrl: imgUrl,
      summaryPitch: `Exceptional ${acreage}-acre opportunity in ${county}, ${region.state}. Features ${soil.name} with ${soil.drainage} profile. Substantial ${discountPercent}% basis discount below appraised market value with strong ${topBiz.category} revenue potential.`,
      tags: [region.state, county, distress, soil.name.split(' ')[0], 'High Yield'],
      soil: {
        soilSeries: soil.name,
        usdaTaxonomy: soil.taxonomy,
        textureDescription: soil.texture,
        phRange: soil.ph,
        organicMatterPercentage: Number((2.5 + ((idCounter % 5) * 0.6)).toFixed(1)),
        drainageClass: soil.drainage,
        hardinessZone: soil.zone,
        frostFreeDays: soil.zone.startsWith('1') ? 340 : 220,
        annualRainfallInches: soil.rainfall,
        waterRightsIncluded: true,
        waterTableDepthFt: '8 - 14 ft',
        nrcsSoilSurveyRating: soil.rating
      },
      suitableCrops: crops,
      zoning: {
        code: zoning.code,
        title: zoning.title,
        jurisdiction: `${county} Planning & Development`,
        permittedUses: zoning.permitted,
        conditionalUses: zoning.conditional,
        prohibitedUses: ['Heavy toxic manufacturing', 'High-density unsewered subdivision'],
        setbacks: { frontFt: 40, sideFt: 25, rearFt: 35 },
        maxBuildingHeightFt: 40,
        maxLotCoveragePercent: 25,
        minimumLotSizeAcres: 5.0,
        overlayDistricts: ['Regional Watershed Management District'],
        agRollbackTaxRisk: region.state === 'TX'
      },
      liens,
      businessIdeas,
      eligibleLandGrants: getEligibleLandGrantsForProperty(
        region.state,
        acreage,
        topBiz.category,
        topBiz.name,
        soil.rating
      ),
      financials: {
        askingOrOpeningBid: askingPrice,
        estimatedARV: arv,
        taxAssessedValue: Math.round(askingPrice * 0.9),
        delinquentTaxesTotal: delinquentTax,
        juniorLiensTotal: 0,
        estimatedClearingCosts: clearingCost,
        estimatedCapExRehab: rehab,
        holdingCostsAnnual: Math.round(askingPrice * 0.02),
        redemptionPeriodMonths: distress.includes('Tax') ? 12 : 6,
        statutoryRedemptionInterestRate: 18,
        grossRentalPotentialAnnual: Math.round(noi * 1.3),
        netOperatingIncomeProjected: noi,
        capRate,
        cashOnCashReturn: coc,
        irr5Year: irr,
        lienToValueRatio: Number((delinquentTax / arv).toFixed(2)),
        equitySpreadDiscount: discountPercent
      }
    });

    idCounter++;
  }

  return properties;
}
