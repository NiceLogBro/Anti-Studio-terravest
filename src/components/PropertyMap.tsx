import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Gavel,
  Sprout,
  DollarSign,
  TrendingUp,
  Maximize2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldAlert,
  Compass,
  Flame,
  Eye,
  EyeOff
} from 'lucide-react';
import { InvestmentProperty } from '../types/property';
import { D3HeatmapOverlay, D3HeatmapLegend, HeatmapConfig } from './D3HeatmapOverlay';
import { scoreSoilQuality } from '../utils/underwriting';

interface PropertyMapProps {
  properties: InvestmentProperty[];
  onSelectProperty: (property: InvestmentProperty) => void;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [activeProperty, setActiveProperty] = useState<InvestmentProperty | null>(
    properties[0] || null
  );
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [activeOverlay, setActiveOverlay] = useState<'normal' | 'capRate' | 'distress'>('normal');

  // D3 Spatial Heatmap State
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapConfig, setHeatmapConfig] = useState<HeatmapConfig>({
    mode: 'soil-fertility',
    bandwidth: 35,
    opacity: 0.65,
    showContours: true,
    showHeatspots: true,
    showLabels: true,
  });

  const mapWidth = 980;
  const mapHeight = 540;

  const projectCoordinates = (lat: number, lng: number) => {
    const minLat = 24.0;
    const maxLat = 50.0;
    const minLng = -125.0;
    const maxLng = -68.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 80) + 40;
    return { x: Math.max(40, Math.min(mapWidth - 40, x)), y: Math.max(30, Math.min(mapHeight - 30, y)) };
  };

  const filteredProperties = properties.filter((p) => {
    if (selectedRegion === 'All') return true;
    if (selectedRegion === 'Tropical' && ['FL', 'HI'].includes(p.state)) return true;
    if (selectedRegion === 'West' && ['CA', 'WA', 'OR'].includes(p.state)) return true;
    if (selectedRegion === 'Southwest' && ['TX', 'AZ', 'NM'].includes(p.state)) return true;
    if (selectedRegion === 'Southeast' && ['FL', 'NC', 'GA'].includes(p.state)) return true;
    if (selectedRegion === 'Northeast' && ['PA', 'NY'].includes(p.state)) return true;
    return false;
  });

  // Calculate territory average and top hotspot name for D3 Legend
  const { avgScore, topHotspotName } = useMemo(() => {
    if (filteredProperties.length === 0) return { avgScore: 0, topHotspotName: 'None' };

    if (heatmapConfig.mode === 'soil-fertility') {
      const scores = filteredProperties.map((p) => scoreSoilQuality(p.soil));
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const sorted = [...filteredProperties].sort((a, b) => scoreSoilQuality(b.soil) - scoreSoilQuality(a.soil));
      const best = sorted[0];
      return {
        avgScore: avg,
        topHotspotName: `${best?.county || 'Tropical'}, ${best?.state || 'US'} (${best?.soil?.soilSeries || 'Loam'})`,
      };
    } else {
      const discounts = filteredProperties.map((p) => p.financials.equitySpreadDiscount || 30);
      const avg = discounts.reduce((a, b) => a + b, 0) / discounts.length;
      const sorted = [...filteredProperties].sort(
        (a, b) => (b.financials.equitySpreadDiscount || 0) - (a.financials.equitySpreadDiscount || 0)
      );
      const best = sorted[0];
      return {
        avgScore: avg,
        topHotspotName: `${best?.county || 'Corridor'}, ${best?.state || 'US'} (+${best?.financials?.equitySpreadDiscount || 50}%)`,
      };
    }
  }, [filteredProperties, heatmapConfig.mode]);

  return (
    <div className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-lg flex flex-col lg:flex-row h-[720px]">
      {/* Map Interactive Canvas */}
      <div className="flex-1 flex flex-col relative bg-gradient-to-b from-sky-50 via-emerald-50/30 to-amber-50/20 overflow-hidden">
        {/* Map Header Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Spatial Territory Explorer
            </span>
            <span className="text-xs text-emerald-700 font-semibold hidden sm:inline">
              ({filteredProperties.length} active opportunities plotted)
            </span>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['All', 'Tropical', 'West', 'Southwest', 'Southeast', 'Northeast'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* D3 Spatial Heatmap Toggle & Mode Selector */}
          <div className="flex items-center bg-amber-50/80 p-1 rounded-xl text-xs gap-1.5 border border-amber-200/80">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                showHeatmap
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-amber-100/50'
              }`}
              title="Toggle D3 Spatial Heatmap Overlay"
            >
              <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-amber-200' : 'text-rose-500'}`} />
              <span>D3 Heatmap</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  showHeatmap ? 'bg-black/25 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {showHeatmap ? 'ON' : 'OFF'}
              </span>
            </button>

            {showHeatmap && (
              <div className="flex items-center gap-1 border-l border-amber-300/60 pl-1.5">
                <button
                  onClick={() => setHeatmapConfig((prev) => ({ ...prev, mode: 'soil-fertility' }))}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    heatmapConfig.mode === 'soil-fertility'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Soil Fertility & Terroir Scores"
                >
                  🌱 Soil Index
                </button>
                <button
                  onClick={() => setHeatmapConfig((prev) => ({ ...prev, mode: 'market-appreciation' }))}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition cursor-pointer ${
                    heatmapConfig.mode === 'market-appreciation'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Market Appreciation & Equity Spread Trends"
                >
                  📈 Appreciation
                </button>
              </div>
            )}
          </div>

          {/* Overlay Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs gap-1">
            <span className="text-slate-500 px-1.5 text-[11px] font-medium hidden md:inline">Overlay:</span>
            <button
              onClick={() => setActiveOverlay('normal')}
              className={`px-2 py-0.5 rounded-lg font-semibold transition cursor-pointer ${
                activeOverlay === 'normal'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Parcels
            </button>
            <button
              onClick={() => setActiveOverlay('capRate')}
              className={`px-2 py-0.5 rounded-lg font-semibold transition cursor-pointer ${
                activeOverlay === 'capRate'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cap Rate
            </button>
            <button
              onClick={() => setActiveOverlay('distress')}
              className={`px-2 py-0.5 rounded-lg font-semibold transition cursor-pointer ${
                activeOverlay === 'distress'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Distress
            </button>
          </div>
        </div>

        {/* SVG Graphic Map Grid in Bright Tropical Style */}
        <div className="w-full h-full flex items-center justify-center p-4 pt-16">
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full max-h-[580px]"
          >
            <defs>
              <radialGradient id="brightPinGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="brightGrid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#fefce8" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width={mapWidth} height={mapHeight} fill="url(#brightGrid)" rx="16" />

            {/* Latitude and Longitude Grid Lines */}
            {[100, 200, 300, 400, 500].map((y) => (
              <line
                key={`h-${y}`}
                x1="40"
                y1={y}
                x2={mapWidth - 40}
                y2={y}
                stroke="#d1fae5"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}
            {[150, 300, 450, 600, 750, 900].map((x) => (
              <line
                key={`v-${x}`}
                x1={x}
                y1="30"
                x2={x}
                y2={mapHeight - 30}
                stroke="#d1fae5"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Stylized US Outline Path in Lush Tropical Green Contour */}
            <path
              d="M 110,95 L 210,85 L 340,90 L 460,95 L 610,105 L 720,120 L 850,110 L 880,140 L 860,190 L 810,230 L 780,310 L 810,380 L 820,440 L 780,480 L 750,420 L 700,370 L 640,360 L 580,380 L 510,440 L 470,490 L 410,430 L 370,410 L 320,380 L 250,380 L 190,400 L 120,390 L 95,290 L 90,200 Z"
              fill="#e6f7ec"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              opacity="0.9"
            />

            {/* Regional Label Indicators */}
            <text x="140" y="160" fill="#047857" fontSize="13" fontWeight="bold">PACIFIC NW</text>
            <text x="110" y="320" fill="#047857" fontSize="13" fontWeight="bold">CALIFORNIA</text>
            <text x="360" y="440" fill="#047857" fontSize="13" fontWeight="bold">TEXAS TRIANGLE</text>
            <text x="500" y="240" fill="#047857" fontSize="13" fontWeight="bold">CORN BELT</text>
            <text x="760" y="450" fill="#b45309" fontSize="13" fontWeight="bold">🌴 FLORIDA REDLAND</text>
            <text x="800" y="220" fill="#047857" fontSize="13" fontWeight="bold">MID-ATLANTIC</text>

            {/* D3 Spatial Heatmap Overlay Component (Soil Fertility / Market Appreciation) */}
            {showHeatmap && (
              <D3HeatmapOverlay
                properties={filteredProperties}
                width={mapWidth}
                height={mapHeight}
                projectCoords={projectCoordinates}
                config={heatmapConfig}
              />
            )}

            {/* Plot Property Markers */}
            {filteredProperties.slice(0, 40).map((prop) => {
              const { x, y } = projectCoordinates(prop.coordinates.lat, prop.coordinates.lng);
              const isSelected = activeProperty?.id === prop.id;

              let pinColor = '#059669'; // lush emerald
              if (activeOverlay === 'capRate') {
                pinColor = prop.financials.capRate > 15 ? '#059669' : '#0284c7';
              } else if (activeOverlay === 'distress') {
                pinColor = prop.distressType.includes('Tax')
                  ? '#e11d48'
                  : prop.distressType.includes('Sheriff')
                  ? '#d97706'
                  : '#7c3aed';
              }

              return (
                <g
                  key={prop.id}
                  onClick={() => setActiveProperty(prop)}
                  className="cursor-pointer transition-transform duration-200"
                >
                  {/* Outer Pulsing Ring */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="22"
                      fill="url(#brightPinGlow)"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Range Radius Indicator */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 16 : 9}
                    fill={pinColor}
                    fillOpacity={isSelected ? 0.35 : 0.25}
                    stroke={pinColor}
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Center Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill={pinColor}
                  />

                  {/* Marker Tag */}
                  <g transform={`translate(${x}, ${y - 12})`}>
                    <rect
                      x="-38"
                      y="-18"
                      width="76"
                      height="18"
                      rx="9"
                      fill={isSelected ? '#064e3b' : '#ffffff'}
                      stroke={isSelected ? '#10b981' : '#059669'}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="-6"
                      textAnchor="middle"
                      fill={isSelected ? '#a7f3d0' : '#064e3b'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ${(prop.financials.askingOrOpeningBid / 1000).toFixed(0)}k • {prop.financials.capRate}%
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Heatmap Legend or Standard Marker Status Legend */}
        {showHeatmap ? (
          <div className="absolute bottom-4 left-4 z-20">
            <D3HeatmapLegend
              config={heatmapConfig}
              onChangeConfig={(partial) => setHeatmapConfig((prev) => ({ ...prev, ...partial }))}
              propertiesCount={filteredProperties.length}
              avgScore={avgScore}
              topHotspotName={topHotspotName}
            />
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-100 text-[11px] text-slate-700 shadow-sm font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Prime Terroir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Sheriff / Auction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Tax Lien</span>
            </div>
            <button
              onClick={() => setShowHeatmap(true)}
              className="ml-2 text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Flame className="w-3 h-3" />
              <span>Enable D3 Heatmap</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Property Preview Sidebar */}
      {activeProperty && (
        <div className="w-full lg:w-[420px] bg-white border-t lg:border-t-0 lg:border-l border-emerald-100 p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                <Gavel className="w-3.5 h-3.5 text-amber-700" />
                {activeProperty.distressType}
              </span>
              <span className="text-xs font-mono text-emerald-800 font-bold">
                {activeProperty.acreage} ACRES
              </span>
            </div>

            {/* Photo & Title */}
            <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
              <img
                src={activeProperty.imageUrl}
                alt={activeProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold drop-shadow">
                {activeProperty.title}
              </div>
            </div>

            <div>
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {activeProperty.address}, {activeProperty.city}, {activeProperty.county}, {activeProperty.state}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {activeProperty.summaryPitch}
              </p>
            </div>

            {/* Financials Strip */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Opening Bid</div>
                <div className="text-xs font-extrabold text-slate-900 font-mono mt-0.5">
                  ${activeProperty.financials.askingOrOpeningBid.toLocaleString()}
                </div>
              </div>
              <div className="border-x border-emerald-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Est. ARV</div>
                <div className="text-xs font-bold text-slate-600 font-mono mt-0.5">
                  ${activeProperty.financials.estimatedARV.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Cap Rate</div>
                <div className="text-xs font-black text-emerald-700 font-mono mt-0.5">
                  {activeProperty.financials.capRate}%
                </div>
              </div>
            </div>

            {/* Top Business Idea Preview */}
            {activeProperty.businessIdeas[0] && (
              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Top Venture:
                  </span>
                  <span className="font-mono text-teal-800 font-black text-[11px]">
                    ${(activeProperty.businessIdeas[0].estAnnualNOI / 1000).toFixed(0)}k/yr NOI
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {activeProperty.businessIdeas[0].name}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2">
                  {activeProperty.businessIdeas[0].whyUniqueToArea}
                </div>
              </div>
            )}

            {/* Soil & Crop Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Sprout className="w-3.5 h-3.5" /> Soil Series:
                </span>
                <span>{activeProperty.soil.soilSeries}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Drainage: {activeProperty.soil.drainageClass} • Zone {activeProperty.soil.hardinessZone}
              </div>
              {activeProperty.suitableCrops[0] && (
                <div className="text-[11px] text-emerald-700 font-bold pt-1 border-t border-slate-200">
                  Top Crop: {activeProperty.suitableCrops[0].cropName} ({activeProperty.suitableCrops[0].estYieldPerAcre})
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onSelectProperty(activeProperty)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              <span>Launch Full Property Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
