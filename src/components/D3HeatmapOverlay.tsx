import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { InvestmentProperty } from '../types/property';
import { scoreSoilQuality } from '../utils/underwriting';

export type HeatmapMode = 'soil-fertility' | 'market-appreciation';

export interface HeatmapConfig {
  mode: HeatmapMode;
  bandwidth: number; // 20 - 60
  opacity: number; // 0.2 - 0.9
  showContours: boolean;
  showHeatspots: boolean;
  showLabels: boolean;
}

interface HeatPoint {
  x: number;
  y: number;
  weight: number;
  property: InvestmentProperty;
}

interface D3HeatmapOverlayProps {
  properties: InvestmentProperty[];
  width: number;
  height: number;
  projectCoords: (lat: number, lng: number) => { x: number; y: number };
  config: HeatmapConfig;
  onHoverPoint?: (point: HeatPoint | null) => void;
}

export const D3HeatmapOverlay: React.FC<D3HeatmapOverlayProps> = ({
  properties,
  width,
  height,
  projectCoords,
  config,
  onHoverPoint,
}) => {
  const [hoveredContourVal, setHoveredContourVal] = useState<number | null>(null);

  // 1. Convert properties into projected heat points with weighted values
  const points: HeatPoint[] = useMemo(() => {
    return properties.map((prop) => {
      const { x, y } = projectCoords(prop.coordinates.lat, prop.coordinates.lng);

      let rawWeight = 50;
      if (config.mode === 'soil-fertility') {
        // High scores for Prime Farmland, ideal pH, good drainage, high organic matter
        rawWeight = scoreSoilQuality(prop.soil);
      } else {
        // Market Appreciation Trend based on ARV discount, Cap Rate, and 5-yr IRR
        const spread = prop.financials.equitySpreadDiscount || 30;
        const cap = prop.financials.capRate || 8;
        const irr = prop.financials.irr5Year || 18;
        rawWeight = Math.min(100, Math.max(15, Math.round(spread * 0.8 + cap * 2.0 + irr * 0.6)));
      }

      return {
        x,
        y,
        weight: rawWeight,
        property: prop,
      };
    });
  }, [properties, projectCoords, config.mode]);

  // 2. Generate D3 Contours using d3.contourDensity
  const { contours, colorScale, maxDensity, minDensity } = useMemo(() => {
    if (points.length === 0) {
      return { contours: [], colorScale: () => '#000', maxDensity: 1, minDensity: 0 };
    }

    try {
      const density = d3
        .contourDensity<HeatPoint>()
        .x((d) => d.x)
        .y((d) => d.y)
        .weight((d) => d.weight)
        .size([width, height])
        .bandwidth(config.bandwidth)
        .thresholds(16);

      const computedContours = density(points);

      const densities = computedContours.map((c) => c.value);
      const minD = d3.min(densities) || 0;
      const maxD = d3.max(densities) || 1;

      // Color Interpolator matching Tropical Sunset Palette
      let scale: (val: number) => string;
      if (config.mode === 'soil-fertility') {
        // Soil Fertility: Emerald green (high bio-fertility) -> Lime -> Amber -> Rich Terracotta
        scale = d3
          .scaleLinear<string>()
          .domain([minD, minD + (maxD - minD) * 0.35, minD + (maxD - minD) * 0.7, maxD])
          .range(['#10b981', '#84cc16', '#f59e0b', '#ea580c'])
          .interpolate(d3.interpolateRgb);
      } else {
        // Market Appreciation: Twilight Indigo -> Hibiscus Rose -> Papaya Sunset -> Golden Sun
        scale = d3
          .scaleLinear<string>()
          .domain([minD, minD + (maxD - minD) * 0.35, minD + (maxD - minD) * 0.7, maxD])
          .range(['#6366f1', '#f43f5e', '#f97316', '#fbbf24'])
          .interpolate(d3.interpolateRgb);
      }

      return {
        contours: computedContours,
        colorScale: scale,
        maxDensity: maxD,
        minDensity: minD,
      };
    } catch (err) {
      console.warn('D3 Contour generation notice:', err);
      return { contours: [], colorScale: () => '#10b981', maxDensity: 1, minDensity: 0 };
    }
  }, [points, width, height, config.bandwidth, config.mode]);

  const geoPath = useMemo(() => d3.geoPath(), []);

  return (
    <g className="d3-heatmap-overlay pointer-events-none" style={{ opacity: config.opacity }}>
      <defs>
        {/* Soft blur filter for atmospheric heatmap radiance */}
        <filter id="heatGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" />
        </filter>

        <filter id="softSpotFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="24" />
        </filter>

        {/* Radial Gradients for Point Heatspots */}
        {config.mode === 'soil-fertility' ? (
          <radialGradient id="soilHeatGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#84cc16" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        ) : (
          <radialGradient id="marketHeatGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {/* Layer 1: Atmospheric Gaussian Blurred Thermal Spots */}
      {config.showHeatspots && (
        <g filter="url(#softSpotFilter)" opacity="0.65">
          {points.map((pt, idx) => {
            const radius = 28 + (pt.weight / 100) * 36;
            return (
              <circle
                key={`spot-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={radius}
                fill={config.mode === 'soil-fertility' ? 'url(#soilHeatGrad)' : 'url(#marketHeatGrad)'}
              />
            );
          })}
        </g>
      )}

      {/* Layer 2: Vector Contour Density Iso-Lines & Fills */}
      {config.showContours && (
        <g filter="url(#heatGlowFilter)">
          {contours.map((contour, idx) => {
            const fillCol = colorScale(contour.value);
            const pathData = geoPath(contour);
            if (!pathData) return null;

            return (
              <path
                key={`contour-fill-${idx}`}
                d={pathData}
                fill={fillCol}
                fillOpacity={0.22 + (idx / contours.length) * 0.45}
                stroke={fillCol}
                strokeWidth={1.5}
                strokeOpacity={0.7}
                strokeLinejoin="round"
                onMouseEnter={() => setHoveredContourVal(contour.value)}
                onMouseLeave={() => setHoveredContourVal(null)}
              />
            );
          })}
        </g>
      )}

      {/* Layer 3: Crisp Contour Boundaries with Sunset Glow */}
      {config.showContours && (
        <g>
          {contours.map((contour, idx) => {
            const pathData = geoPath(contour);
            if (!pathData || idx % 2 !== 0) return null;
            const fillCol = colorScale(contour.value);

            return (
              <path
                key={`contour-line-${idx}`}
                d={pathData}
                fill="none"
                stroke={fillCol}
                strokeWidth={idx === contours.length - 1 ? 2.5 : 1}
                strokeDasharray={idx % 4 === 0 ? '6 4' : 'none'}
                strokeOpacity={0.8}
              />
            );
          })}
        </g>
      )}

      {/* Layer 4: Micro-territory Hotspot Markers & Labels */}
      {config.showLabels && (
        <g>
          {points.slice(0, 15).map((pt, idx) => {
            const isHigh = pt.weight >= 85;
            if (!isHigh && idx % 2 !== 0) return null;

            return (
              <g key={`lbl-${idx}`} transform={`translate(${pt.x}, ${pt.y + 14})`}>
                <rect
                  x="-32"
                  y="-8"
                  width="64"
                  height="16"
                  rx="8"
                  fill="#ffffff"
                  fillOpacity="0.88"
                  stroke={config.mode === 'soil-fertility' ? '#059669' : '#e11d48'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={config.mode === 'soil-fertility' ? '#065f46' : '#9f1239'}
                >
                  {config.mode === 'soil-fertility'
                    ? `🌱 ${pt.weight}`
                    : `+${pt.property.financials.equitySpreadDiscount}%`}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};

// Standalone D3 Legend & Analytics Widget for the Heatmap
interface D3HeatmapLegendProps {
  config: HeatmapConfig;
  onChangeConfig: (newConfig: Partial<HeatmapConfig>) => void;
  propertiesCount: number;
  avgScore: number;
  topHotspotName: string;
}

export const D3HeatmapLegend: React.FC<D3HeatmapLegendProps> = ({
  config,
  onChangeConfig,
  propertiesCount,
  avgScore,
  topHotspotName,
}) => {
  const isSoil = config.mode === 'soil-fertility';

  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200 shadow-md text-xs space-y-3 max-w-xs sm:max-w-sm">
      {/* Legend Title & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full animate-ping bg-rose-500" />
          <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">
            D3 Spatial Heatmap
          </span>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            onClick={() => onChangeConfig({ mode: 'soil-fertility' })}
            className={`px-2 py-0.5 rounded-md transition ${
              isSoil ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Soil Fertility
          </button>
          <button
            onClick={() => onChangeConfig({ mode: 'market-appreciation' })}
            className={`px-2 py-0.5 rounded-md transition ${
              !isSoil ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Appreciation
          </button>
        </div>
      </div>

      {/* Gradient Color Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span>{isSoil ? 'Low / Fallow (0)' : 'Moderate Spread (15%)'}</span>
          <span className="text-slate-900 font-extrabold">
            {isSoil ? 'Prime Farmland (100)' : 'Maximum Spread (65%+)'}
          </span>
        </div>

        <div
          className="h-3 rounded-full shadow-inner border border-slate-200"
          style={{
            background: isSoil
              ? 'linear-gradient(to right, #10b981, #84cc16, #f59e0b, #ea580c)'
              : 'linear-gradient(to right, #6366f1, #f43f5e, #f97316, #fbbf24)',
          }}
        />

        <div className="flex justify-between text-[9px] font-mono text-slate-400 px-0.5">
          <span>{isSoil ? 'Zone 8-10' : 'Safe LTV'}</span>
          <span>{isSoil ? 'CEC 18+' : 'High NOI'}</span>
          <span>{isSoil ? 'Volcanic / Loam' : '50%+ Discount'}</span>
        </div>
      </div>

      {/* Heatmap Micro-Controls */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
        {/* Opacity slider */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>Opacity</span>
            <span className="font-mono text-slate-800 font-bold">{Math.round(config.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="0.9"
            step="0.05"
            value={config.opacity}
            onChange={(e) => onChangeConfig({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Bandwidth / Radius slider */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span>Radius / Blur</span>
            <span className="font-mono text-slate-800 font-bold">{config.bandwidth}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="60"
            step="5"
            value={config.bandwidth}
            onChange={(e) => onChangeConfig({ bandwidth: parseInt(e.target.value, 10) })}
            className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-slate-700 pt-0.5">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showContours}
            onChange={(e) => onChangeConfig({ showContours: e.target.checked })}
            className="rounded text-rose-600 accent-rose-600"
          />
          <span>Contours</span>
        </label>

        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showHeatspots}
            onChange={(e) => onChangeConfig({ showHeatspots: e.target.checked })}
            className="rounded text-rose-600 accent-rose-600"
          />
          <span>Glow Nodes</span>
        </label>

        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={config.showLabels}
            onChange={(e) => onChangeConfig({ showLabels: e.target.checked })}
            className="rounded text-rose-600 accent-rose-600"
          />
          <span>Hotspot Tags</span>
        </label>
      </div>

      {/* Dynamic Territory Summary */}
      <div className="p-2 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl border border-amber-200/80 text-[11px] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Regional Average:</span>
          <span className="font-extrabold text-slate-900 font-mono">
            {isSoil ? `${avgScore.toFixed(0)} / 100 (Prime Terroir)` : `${avgScore.toFixed(1)}% ARV Discount`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">High Density Cluster:</span>
          <span className="font-bold text-rose-700 truncate max-w-[140px]">{topHotspotName}</span>
        </div>
      </div>
    </div>
  );
};
