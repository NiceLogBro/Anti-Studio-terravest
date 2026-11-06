import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sprout,
  DollarSign,
  Gavel,
  Check,
  ChevronDown,
  Building2,
  TreePine,
  Sparkles,
  Compass,
  Palmtree,
  Coffee,
  Landmark
} from 'lucide-react';
import { DistressType, FilterOptions } from '../types/property';

interface FilterToolbarProps {
  filters: FilterOptions;
  onChange: (updated: FilterOptions) => void;
  totalResults: number;
}

const ALL_DISTRESS_TYPES: DistressType[] = [
  'Sheriff Foreclosure Auction',
  'Tax Lien Certificate',
  'Tax Deed Sale',
  'Bank-Owned REO',
  'Pre-Foreclosure / Short Sale',
  'Probate / Estate Distress',
  'Distressed Value-Add Land'
];

const LOOK_FOR_PRESETS = [
  {
    label: '🏛️ Land Grants ($500k+)',
    minGrant: 500000,
    tooltip: 'USDA EQIP, REAP & State preservation funding exceeding $500,000'
  },
  {
    label: '🌴 Tropical Fruit & Groves',
    query: 'Tropical',
    crop: 'Dragon Fruit',
    state: 'FL',
    tooltip: 'Dragon fruit, mangoes, papayas & tropical nurseries'
  },
  {
    label: '☕ Kona Coffee & Cacao',
    query: 'Coffee',
    crop: 'Coffee',
    state: 'HI',
    tooltip: 'High-elevation volcanic coffee & bean-to-bar cacao'
  },
  {
    label: '⚖️ Tax Liens Under $250k',
    maxPrice: 250000,
    distress: 'Tax Lien Certificate' as DistressType,
    tooltip: 'High statutory redemption interest rate parcels'
  },
  {
    label: '🔨 Sheriff Foreclosure Auctions',
    distress: 'Sheriff Foreclosure Auction' as DistressType,
    tooltip: 'Courthouse steps judicial sales'
  },
  {
    label: '⛺ Eco-Resort & Glamping',
    business: 'Hospitality / Eco-Stay',
    tooltip: 'High-margin glamping domes & farmstays'
  },
  {
    label: '🌾 Prime Farmland Only',
    primeOnly: true,
    tooltip: 'USDA Prime Class I Soils'
  },
  {
    label: '🚛 RV & Equipment Laydown',
    business: 'Commercial & Storage',
    tooltip: 'Highway corridor contractor laydown & boat/RV storage'
  },
  {
    label: '🏷️ Deep Bargain (>45% Below ARV)',
    sort: 'arv-discount-high' as const,
    tooltip: 'Maximum equity spread and acquisition discount'
  }
];

const STATE_INDEX_PILLS = [
  { label: 'All Regions', value: '' },
  { label: '🌴 Florida', value: 'FL' },
  { label: '🌺 Hawaii', value: 'HI' },
  { label: '🍇 California', value: 'CA' },
  { label: '⭐ Texas', value: 'TX' },
  { label: '🍎 Washington', value: 'WA' },
  { label: '🌲 N. Carolina', value: 'NC' },
  { label: '🌵 Arizona', value: 'AZ' },
  { label: '🌾 Pennsylvania', value: 'PA' }
];

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onChange,
  totalResults
}) => {
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);

  const applyLookFor = (preset: typeof LOOK_FOR_PRESETS[0]) => {
    const updated = { ...filters };
    if (preset.query) updated.searchQuery = preset.query;
    if (preset.crop) updated.cropCategories = [preset.crop];
    if (preset.state) updated.state = preset.state;
    if (preset.maxPrice) updated.maxPrice = preset.maxPrice;
    if (preset.distress) updated.distressTypes = [preset.distress];
    if (preset.business) updated.businessCategories = [preset.business];
    if (preset.primeOnly !== undefined) updated.soilQualityOnlyPrime = preset.primeOnly;
    if (preset.sort) updated.sortBy = preset.sort;
    if ((preset as any).minGrant) updated.minGrantFunding = (preset as any).minGrant;
    onChange(updated);
  };

  const toggleDistressType = (type: DistressType) => {
    const exists = filters.distressTypes.includes(type);
    const updated = exists
      ? filters.distressTypes.filter((t) => t !== type)
      : [...filters.distressTypes, type];
    onChange({ ...filters, distressTypes: updated });
  };

  const handleReset = () => {
    onChange({
      searchQuery: '',
      state: '',
      distressTypes: [],
      cropCategories: [],
      businessCategories: [],
      zoningTypes: [],
      minAcreage: 0,
      maxAcreage: 100,
      minPrice: 0,
      maxPrice: 2000000,
      maxLienRisk: 'All',
      soilQualityOnlyPrime: false,
      minGrantFunding: 0,
      grantCategory: '',
      sortBy: 'cap-rate-high'
    });
  };

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.state ? 1 : 0) +
    filters.distressTypes.length +
    filters.cropCategories.length +
    filters.businessCategories.length +
    (filters.soilQualityOnlyPrime ? 1 : 0) +
    (filters.maxLienRisk !== 'All' ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 2000000 ? 1 : 0) +
    (filters.minAcreage > 0 || filters.maxAcreage < 100 ? 1 : 0) +
    ((filters.minGrantFunding || 0) > 0 ? 1 : 0);

  return (
    <div className="bg-white border-b border-amber-100 shadow-xs py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* "LOOK FOR..." Quick Target Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-950 shrink-0">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="uppercase tracking-wider text-[11px]">Look for:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {LOOK_FOR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyLookFor(preset)}
                title={preset.tooltip}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-gradient-to-r from-amber-50 to-rose-50 hover:from-amber-100 hover:to-rose-100 text-slate-800 border border-amber-200/80 shadow-2xs transition hover:scale-102 active:scale-98 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Search & Simple Index Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Simple Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600" />
            <input
              type="text"
              placeholder="Search 100 properties: location, soil series, crop (e.g. Mango, Truffle, Pecan), APN, or business idea..."
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-sm pl-10 pr-12 py-2.5 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition shadow-inner"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChange({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Actions & Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prime Soil Toggle */}
            <button
              onClick={() =>
                onChange({
                  ...filters,
                  soilQualityOnlyPrime: !filters.soilQualityOnlyPrime
                })
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                filters.soilQualityOnlyPrime
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-lime-500" />
              <span>Prime Farmland Only</span>
              {filters.soilQualityOnlyPrime && <Check className="w-3.5 h-3.5 text-lime-300" />}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 text-xs">
              <span className="text-slate-500 mr-2 font-medium hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-4"
              >
                <option value="cap-rate-high">Highest Cap Rate</option>
                <option value="arv-discount-high">Deepest ARV Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="acreage-high">Largest Acreage</option>
              </select>
            </div>

            {/* Advanced Filters Button */}
            <button
              onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isAdvancedExpanded || activeFiltersCount > 0
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-bold">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isAdvancedExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleReset}
                title="Reset all filters"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* State / Region Quick Index Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            Region Index:
          </span>
          {STATE_INDEX_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => onChange({ ...filters, state: pill.value })}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-semibold transition ${
                filters.state === pill.value
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {isAdvancedExpanded && (
          <div className="pt-3 border-t border-emerald-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200 text-xs bg-emerald-50/40 p-4 rounded-2xl border">
            {/* Distress Type Multi-Select */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Gavel className="w-4 h-4 text-amber-600" />
                <span>Distress Categories</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {ALL_DISTRESS_TYPES.map((type) => {
                  const isSelected = filters.distressTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleDistressType(type)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type.replace(' Auction', '').replace(' / Short Sale', '')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price & Acreage Range */}
            <div className="space-y-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1 text-emerald-700">
                  <DollarSign className="w-3.5 h-3.5" /> Max Price
                </span>
                <span className="font-mono text-emerald-700">
                  ${(filters.maxPrice / 1000).toLocaleString()}k
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={50000}
                value={filters.maxPrice}
                onChange={(e) =>
                  onChange({ ...filters, maxPrice: Number(e.target.value) })
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />

              <div className="flex items-center justify-between font-bold text-slate-800 pt-1">
                <span className="flex items-center gap-1 text-teal-700">
                  <TreePine className="w-3.5 h-3.5" /> Min Acreage
                </span>
                <span className="font-mono text-teal-700">
                  {filters.minAcreage} - {filters.maxAcreage} AC
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={filters.minAcreage}
                onChange={(e) =>
                  onChange({ ...filters, minAcreage: Number(e.target.value) })
                }
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Lien Risk Filter */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Title &amp; Lien Risk Level</span>
              </div>
              <div className="space-y-1.5">
                {(['All', 'Clean / Low Risk', 'Moderate', 'High Yield / Complex'] as const).map(
                  (risk) => (
                    <label
                      key={risk}
                      className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-emerald-700 font-medium"
                    >
                      <input
                        type="radio"
                        name="lienRisk"
                        checked={filters.maxLienRisk === risk}
                        onChange={() => onChange({ ...filters, maxLienRisk: risk })}
                        className="accent-emerald-600"
                      />
                      <span>{risk}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Results count & Quick Summary */}
            <div className="space-y-2 bg-gradient-to-br from-emerald-100/60 to-teal-100/60 p-3.5 rounded-xl border border-emerald-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wide">
                  Active Index Match
                </span>
                <div className="text-2xl font-black text-emerald-900 font-mono mt-1">
                  {totalResults} <span className="text-sm font-medium text-emerald-700">properties</span>
                </div>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className="w-full py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Index Status Line */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5 font-medium">
          <div>
            Showing <strong className="text-emerald-800">{totalResults}</strong> of 100 properties matching active criteria
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleReset}
              className="text-emerald-700 hover:text-emerald-900 underline font-semibold"
            >
              Reset to all 100 properties
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
