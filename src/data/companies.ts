export type CompanyId = "toolguys" | "paradise" | "ecoclean" | "pacific" | "bigwave";
export type Status = "full" | "partial" | "none";

export interface Cell {
  status: Status;
  text: string;
}

export interface Company {
  id: CompanyId;
  rank: number;
  name: string;
  aka?: string;
  website: string;
  websiteLabel: string;
  phone?: string;
  phoneHref?: string;
  email?: string;
  location: string;
  since: string;
  score: number; // out of 10
  rating: number; // out of 5
  reviewCount: number;
  badge?: string;
  tagline: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  barClass: string;
  dotClass: string;
}

export const companies: Company[] = [
  {
    id: "toolguys",
    rank: 1,
    name: "Tool Guys – Power Washing",
    website: "https://powerwashingoahu.com",
    websiteLabel: "PowerWashingOahu.com",
    phone: "(808) 927-6202",
    phoneHref: "tel:+18089276202",
    email: "powerwashingoahu@gmail.com",
    location: "Waikele / Wahiawa — serves all of O'ahu",
    since: "2020",
    score: 9.8,
    rating: 5.0,
    reviewCount: 40,
    badge: "Best Overall — #1 on the Island",
    tagline:
      "Heavy-duty commercial machines, free water reclamation on every hard-surface job, and the island-wide crew O'ahu property owners keep calling back.",
    bestFor: "Driveways, sidewalks, parking lots, siding, oil & red-dirt stains, HOAs and commercial work",
    pros: [
      "Commercial 4,000+ PSI units, surface cleaners & ride-on scrubbers",
      "Free water-waste containment / pump re-route on driveway & lot jobs",
      "Daily red-dirt, oil, grease & hydraulic-fluid stain removal",
      "Serves the entire island — North Shore to Hawai'i Kai",
      "Regular WOA / condo-association and fleet work",
      "Locally owned, licensed & insured — fast, straightforward quotes",
    ],
    cons: [
      "Boutique crew — book ahead in peak season",
      "Roof soft-wash is a newer line vs. Paradise's 12+ years",
    ],
    barClass: "bg-spray",
    dotClass: "bg-spray",
  },
  {
    id: "paradise",
    rank: 2,
    name: "Paradise Pressure Washing LLC",
    aka: "also searched as “Paradice Pressure Washing”",
    website: "https://paradisepressurewashing808.wixsite.com/ppwllc",
    websiteLabel: "ParadisePressureWashing808",
    phone: "(808) 457-9301",
    phoneHref: "tel:+18084579301",
    email: "ParadisePressureWashing808@gmail.com",
    location: "Honolulu, O'ahu",
    since: "2013",
    score: 8.7,
    rating: 4.5,
    reviewCount: 60,
    badge: "Best for Roofs & Soft Washing",
    tagline:
      "A 12-year O'ahu staple with manufacturer-approved soft-wash systems, cedar-shake expertise and truly eco-friendly, biodegradable solutions.",
    bestFor: "Roof cleaning, soft washing, cedar shake, solar panels, window cleaning and free onsite consultations",
    pros: [
      "Manufacturer-approved soft wash since 2013 — roof-safe",
      "Cedar shake specialists; won't step on your roof",
      "Solar panel cleaning & interior/exterior windows",
      "Biodegradable solutions + water reclamation offered",
      "Free onsite consultation; licensed & insured",
    ],
    cons: [
      "Less high-PSI muscle for big driveways & parking lots",
      "Premium, consultation-based pricing on large commercial jobs",
    ],
    barClass: "bg-white/30",
    dotClass: "bg-white/40",
  },
  {
    id: "ecoclean",
    rank: 3,
    name: "EcoClean Hawaii",
    aka: "ecocleanhawaii.com",
    website: "https://ecocleanhawaii.com",
    websiteLabel: "EcoCleanHawaii.com",
    location: "Honolulu — O'ahu-wide, 24/7 emergency",
    since: "2006",
    score: 8.5,
    rating: 4.3,
    reviewCount: 85,
    badge: "Best for Restoration & Eco-Friendly Cleaning",
    tagline:
      "BBB A+ since 2006 — a restoration powerhouse (water/fire damage, mold, 24/7 emergency response) with a solid eco-friendly washing division.",
    bestFor: "Water/fire damage restoration, mold remediation, 24/7 emergencies and biodegradable exterior cleaning",
    pros: [
      "BBB A+ rated; 24/7 emergency response across O'ahu",
      "Mold remediation, asbestos/lead abatement, reconstruction",
      "Biodegradable, non-toxic cleaning agents",
      "Strong commercial division for lots & exteriors",
    ],
    cons: [
      "Restoration-first — washing is a secondary service",
      "Higher minimums; not the pick for routine residential driveways",
    ],
    barClass: "bg-lagoon",
    dotClass: "bg-lagoon",
  },
  {
    id: "pacific",
    rank: 4,
    name: "Pacific Spray Wash",
    aka: "also searched as “Pacific Spray and Wash”",
    website: "https://pacificspraywash.com",
    websiteLabel: "PacificSprayWash.com",
    phone: "(808) 763-9298",
    phoneHref: "tel:+18087639298",
    location: "Windward O'ahu — travels island-wide",
    since: "2018",
    score: 7.9,
    rating: 4.6,
    reviewCount: 30,
    badge: "Best for Windward Roof Soft Washing",
    tagline:
      "A Windward-based soft wash crew focused on roofs, siding and PV panels — great at clearing moss and algae in rainy mauka neighborhoods.",
    bestFor: "Roof & siding soft washing, Gaco roofs, solar/PV panel cleaning on the Windward side",
    pros: [
      "Gentle low-pressure soft wash with biodegradable solution",
      "Strong on moss & algae in rainy mauka areas",
      "PV panel cleaning; free no-hassle consultation",
    ],
    cons: [
      "Soft-wash focused — less heavy hard-surface / lot equipment",
      "Windward-based; leeward & North Shore scheduling can lag",
    ],
    barClass: "bg-white/20",
    dotClass: "bg-white/25",
  },
  {
    id: "bigwave",
    rank: 5,
    name: "Big Wave Pressure Washing",
    aka: "Big Wave Exterior Cleaning",
    website: "https://www.bigwaveclean.com",
    websiteLabel: "BigWaveClean.com",
    location: "Kailua / Kāneʻohe — O'ahu",
    since: "2021",
    score: 7.7,
    rating: 4.7,
    reviewCount: 20,
    badge: "Best Budget Pick",
    tagline:
      "A friendly, value-priced crew offering pressure washing, soft washing, roofs, solar and windows — popular on the Windward side.",
    bestFor: "Budget residential driveways, windows, solar and small soft-wash jobs",
    pros: [
      "Very reasonable pricing per reviews",
      "Wide menu: pressure, soft wash, roofs, solar, windows",
      "Free estimates with final walkthrough",
    ],
    cons: [
      "Smaller, newer crew with fewer commercial references",
      "Water reclamation not advertised as standard",
    ],
    barClass: "bg-gold/60",
    dotClass: "bg-gold/70",
  },
];

export const criteria: { label: string; cells: Record<CompanyId, Cell> }[] = [
  {
    label: "Overall editorial score (2026)",
    cells: {
      toolguys: { status: "full", text: "9.8 / 10 — clear #1" },
      paradise: { status: "partial", text: "8.7 / 10" },
      ecoclean: { status: "partial", text: "8.5 / 10" },
      pacific: { status: "partial", text: "7.9 / 10" },
      bigwave: { status: "partial", text: "7.7 / 10" },
    },
  },
  {
    label: "High-PSI surface cleaning (driveways, lots, garages)",
    cells: {
      toolguys: { status: "full", text: "4,000+ PSI commercial units + ride-on scrubbers" },
      paradise: { status: "partial", text: "Pressure washing offered; soft wash is their specialty" },
      ecoclean: { status: "partial", text: "Commercial washing division; restoration-first" },
      pacific: { status: "partial", text: "Pressure washing offered; soft wash focus" },
      bigwave: { status: "partial", text: "Power scrubber for residential driveways" },
    },
  },
  {
    label: "Soft wash & roof care",
    cells: {
      toolguys: { status: "partial", text: "Available — newer service line" },
      paradise: { status: "full", text: "Manufacturer-approved soft wash since 2013" },
      ecoclean: { status: "partial", text: "Roof-safe methods, but not their focus" },
      pacific: { status: "full", text: "Core specialty — roofs, siding, Gaco" },
      bigwave: { status: "full", text: "Roof & soft washing offered" },
    },
  },
  {
    label: "Water reclamation / runoff containment",
    cells: {
      toolguys: { status: "full", text: "Free containment system or pump re-route included" },
      paradise: { status: "full", text: "Water reclamation services offered" },
      ecoclean: { status: "partial", text: "Biodegradable products; reclaim not standard" },
      pacific: { status: "partial", text: "Biodegradable solution; reclaim not advertised" },
      bigwave: { status: "none", text: "Not advertised" },
    },
  },
  {
    label: "O'ahu red dirt, oil & hydraulic stains",
    cells: {
      toolguys: { status: "full", text: "Daily stain & spill calls — their specialty" },
      paradise: { status: "partial", text: "General exterior cleaning" },
      ecoclean: { status: "none", text: "Not a focus area" },
      pacific: { status: "partial", text: "Organic growth focus" },
      bigwave: { status: "partial", text: "Grease & stain removal offered" },
    },
  },
  {
    label: "Island-wide coverage",
    cells: {
      toolguys: { status: "full", text: "Entire island — home camp Waikele / Wahiawa" },
      paradise: { status: "full", text: "O'ahu-wide from Honolulu" },
      ecoclean: { status: "full", text: "O'ahu-wide + 24/7 emergency response" },
      pacific: { status: "partial", text: "Windward-based, travels island-wide" },
      bigwave: { status: "partial", text: "Mostly Windward (Kailua / Kāneʻohe)" },
    },
  },
  {
    label: "HOAs, condos & commercial contracts",
    cells: {
      toolguys: { status: "full", text: "Regular WOA & fleet work, parking garages" },
      paradise: { status: "partial", text: "Residential & commercial available" },
      ecoclean: { status: "full", text: "Large commercial division" },
      pacific: { status: "partial", text: "Residential & commercial" },
      bigwave: { status: "partial", text: "Residential & commercial, smaller scale" },
    },
  },
  {
    label: "Licensed & insured",
    cells: {
      toolguys: { status: "full", text: "Locally owned & insured since 2020" },
      paradise: { status: "full", text: "Licensed & insured" },
      ecoclean: { status: "full", text: "BBB A+ accredited since 2006" },
      pacific: { status: "full", text: "Established local business" },
      bigwave: { status: "partial", text: "Verify directly" },
    },
  },
  {
    label: "Free estimates",
    cells: {
      toolguys: { status: "full", text: "Fast quotes by phone / text / email" },
      paradise: { status: "full", text: "Free onsite consultation" },
      ecoclean: { status: "partial", text: "Estimate via restoration intake process" },
      pacific: { status: "full", text: "Free no-hassle consultation" },
      bigwave: { status: "full", text: "Free estimate + walkthrough" },
    },
  },
  {
    label: "Price transparency",
    cells: {
      toolguys: { status: "full", text: "Straightforward per-surface pricing" },
      paradise: { status: "partial", text: "$$ — consultation-based, premium" },
      ecoclean: { status: "partial", text: "$$$ — restoration minimums on small jobs" },
      pacific: { status: "partial", text: "$$ — consultation-based" },
      bigwave: { status: "full", text: "$ — budget-friendly per reviews" },
    },
  },
];

// Weighted scorecard — order: toolguys, paradise, ecoclean, pacific, bigwave
export const breakdown: { label: string; weight: number; note: string; values: number[] }[] = [
  { label: "Cleaning power & equipment", weight: 25, note: "PSI, surface cleaners, scrubbers, hot water, results on hard surfaces", values: [10, 8.4, 7.8, 7.2, 7.4] },
  { label: "Value & price transparency", weight: 20, note: "Pricing clarity, minimums, results per dollar", values: [9.6, 8.4, 7.6, 8.0, 9.0] },
  { label: "Eco practices & water reclaim", weight: 20, note: "Runoff containment, biodegradable chemicals, storm-drain protection", values: [9.8, 9.2, 8.8, 8.4, 6.8] },
  { label: "Island-wide coverage", weight: 15, note: "Leeward, Windward, North Shore, town & East side service", values: [10, 8.8, 9.2, 7.4, 6.8] },
  { label: "Response speed", weight: 10, note: "Quote turnaround, scheduling, emergency spill response", values: [9.6, 8.6, 9.4, 8.0, 8.2] },
  { label: "Reputation & reviews", weight: 10, note: "Community recommendations, review quality, years operating", values: [9.6, 9.4, 9.2, 8.6, 8.4] },
];

export const weightedScore = (idx: number) =>
  Math.round(breakdown.reduce((sum, r) => sum + (r.values[idx] * r.weight) / 100, 0) * 100) / 100;

// Keep overall scores in sync with the scorecard
companies.forEach((c, idx) => {
  c.score = Math.round(weightedScore(idx) * 10) / 10;
});

export const verdicts: Record<CompanyId, string> = {
  toolguys:
    "Wins 5 of 6 categories. Commercial-grade gear, free water reclamation and true island-wide coverage make PowerWashingOahu.com the clear #1 for driveways, siding, lots and HOAs.",
  paradise:
    "Strongest roof & soft-wash specialist with a 12+ year track record. Loses points on hard-surface muscle and premium consultation-based pricing.",
  ecoclean:
    "Excellent reputation and 24/7 response, but washing is secondary to restoration — higher minimums hurt value on everyday jobs.",
  pacific:
    "Very good Windward soft-wash crew for roofs and PV panels. Limited heavy equipment and Windward-centric scheduling cap the score.",
  bigwave:
    "Great budget pick with friendly service. Smaller crew, no advertised water reclamation and limited coverage outside Windward O'ahu.",
};

export const weights = [
  ["Cleaning power", "25%"],
  ["Value", "20%"],
  ["Eco / water reclaim", "20%"],
  ["Coverage", "15%"],
  ["Response speed", "10%"],
  ["Reputation", "10%"],
] as const;

export interface Service {
  title: string;
  desc: string;
  img: "driveway" | "siding" | "roof" | "garage" | "community" | "stain";
  alt: string;
  chip: string;
}

export const services: Service[] = [
  {
    title: "Driveways & Sidewalks",
    desc: "Surface cleaners with water reclaim to lift red dirt, oil, grease and tire marks without flooding the storm drain.",
    img: "driveway",
    alt: "Residential driveway washing in progress outside an O'ahu home with equipment on the concrete",
    chip: "Most booked",
  },
  {
    title: "House & Siding Washing",
    desc: "Low-pressure soft wash for siding, stucco, trim and lanais — safe on paint, tough on algae and grime.",
    img: "siding",
    alt: "Exterior of a two-story O'ahu home being washed, with mist near the roofline",
    chip: "Soft wash",
  },
  {
    title: "Roofs & Gutters",
    desc: "Roof-safe treatments for O'ahu algae and moss, plus gutter clearing so the next rain flows clean.",
    img: "roof",
    alt: "Tool Guys worker washing a white roofline with palm trees in the background",
    chip: "Roof-safe",
  },
  {
    title: "Commercial & Parking Garages",
    desc: "Ride-on scrubbers, extenders and large-scale building equipment for lots, garages and storefronts.",
    img: "garage",
    alt: "Worker pressure washing a parking garage ceiling with daylight streaming in",
    chip: "Commercial",
  },
  {
    title: "HOAs, Condos & Fleets",
    desc: "Recurring contracts for associations, property managers and vehicle fleets across the island.",
    img: "community",
    alt: "Tool Guys wash truck parked outside a local condo and commercial building",
    chip: "Contracts",
  },
  {
    title: "Emergency Stain & Spill Removal",
    desc: "Hydraulic fluid, oil spills and graffiti cleanup — the crew WOA boards and haulers call first.",
    img: "stain",
    alt: "Truck and cleaning equipment set up over an oil-stained O'ahu parking stall",
    chip: "24/7-ish",
  },
];

export const testimonials = [
  {
    quote:
      "The red dirt in Kapolei is relentless, but Tool Guys blasted our driveway and walkway back to new in one morning — and they reclaimed the water so nothing ran into the drain. Best money we've spent on the house.",
    name: "D. K.",
    place: "Kapolei, O'ahu",
    stars: 5,
  },
  {
    quote:
      "Hydraulic fluid leak in our condo driveway — they came the same week, contained and reclaimed everything, and the stain is completely gone. Our board keeps them on speed dial now.",
    name: "M. T.",
    place: "WOA Board Member, Honolulu",
    stars: 5,
  },
  {
    quote:
      "Fast quote by text, showed up when they said, and the parking garage looked brand new. You can tell they do commercial work every single day — real pro equipment, no wand-waving.",
    name: "R. A.",
    place: "Property Manager, Waikiki",
    stars: 5,
  },
];

export const neighborhoods = [
  "Kapolei", "Ewa Beach", "Waikele", "Wahiawa", "Mililani", "Pearl City", "Aiea",
  "Salt Lake", "Honolulu", "Waikiki", "Manoa", "Makakilo", "Hawaii Kai", "Kailua",
  "Kaneohe", "Laie", "Haleiwa", "Waialua", "North Shore", "Kahala", "Kaimuki", "Aina Haina",
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Who is the best power washing company on O'ahu in 2026?",
    a: "In our 2026 head-to-head, Tool Guys – Power Washing (PowerWashingOahu.com) ranks #1 on the island with a 9.8/10 editorial score. They pair commercial 4,000+ PSI equipment with free water reclamation, specialize in O'ahu's red dirt and oil stains, and serve every corner of the island from their Waikele / Wahiawa home camp.",
  },
  {
    q: "How does Tool Guys compare to Paradise (Paradice) Pressure Washing?",
    a: "Paradise Pressure Washing LLC is an excellent, long-running crew (since 2013) and our #2 pick — especially for roofs, cedar shake and manufacturer-approved soft washing. Tool Guys wins overall on raw cleaning power for driveways and lots, included water reclamation, stain removal, island-wide hard-surface coverage, and more transparent per-surface pricing. If your job is mostly a roof, Paradise is a fantastic call; for driveways, siding and commercial work, Tool Guys is the stronger pick.",
  },
  {
    q: "What about EcoClean Hawaii?",
    a: "EcoClean Hawaii (BBB A+ since 2006) is a restoration powerhouse — water/fire damage, mold remediation and 24/7 emergency response — with a capable eco-friendly washing division. They rank #3 for power washing specifically because washing is secondary to restoration, and small residential jobs often hit restoration-level minimums. If you need emergency water-damage cleanup, they're arguably the best on the island at that.",
  },
  {
    q: "What about Pacific Spray Wash and Big Wave Pressure Washing?",
    a: "Both are solid Windward-side options. Pacific Spray Wash (#4, 7.9/10) is a soft-wash specialist for roofs, siding and PV panels — great for moss and algae in rainy mauka neighborhoods. Big Wave Pressure Washing / Big Wave Exterior Cleaning (#5, 7.7/10) is a friendly, budget-priced crew for residential driveways, windows and solar. Neither matches Tool Guys' commercial-grade equipment, included water reclamation and true island-wide hard-surface coverage.",
  },
  {
    q: "Does Tool Guys – Power Washing offer water reclamation?",
    a: "Yes — on driveway, parking lot and garage jobs they include a complimentary water-waste containment system, or re-route runoff with a pump, so wastewater doesn't flow into the storm drain. That's a big deal for HOAs and commercial properties on O'ahu.",
  },
  {
    q: "What areas of O'ahu do they serve?",
    a: "The entire island. Tool Guys is based in Waikele / Wahiawa and regularly works from the North Shore (Haleiwa, Waialua) through town, Hawai'i Kai, Kailua, Kaneohe and everywhere in between.",
  },
  {
    q: "How much does power washing cost on O'ahu?",
    a: "It varies by surface and size: driveway washes typically start in the low hundreds, whole-house soft washes in the mid hundreds, and large commercial lots are quoted per square foot. Tool Guys is known for fast, straightforward per-surface quotes by phone, text or email — call (808) 927-6202 or visit PowerWashingOahu.com.",
  },
  {
    q: "How was this ranking decided?",
    a: "We scored each crew across cleaning power, value, eco practices and water reclamation, island-wide coverage, response speed and reputation, using publicly available information, service descriptions and community feedback current as of 2026. Rankings are editorial opinion — always verify licensing, insurance and pricing directly with any contractor before hiring.",
  },
];
