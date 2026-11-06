import React from 'react';
import {
  Gavel,
  TrendingUp,
  Sprout,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
  Scale,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { InvestmentProperty } from '../types/property';
import { calculateTotalGrantFunding } from '../utils/underwriting';

interface SimpleIndexTableProps {
  properties: InvestmentProperty[];
  startIndex: number;
  onSelectProperty: (prop: InvestmentProperty) => void;
  selectedForCompareIds: string[];
  onToggleCompare: (id: string) => void;
  onValidateLegitimacy?: (prop: InvestmentProperty) => void;
}

export const SimpleIndexTable: React.FC<SimpleIndexTableProps> = ({
  properties,
  startIndex,
  onSelectProperty,
  selectedForCompareIds,
  onToggleCompare,
  onValidateLegitimacy,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 overflow-hidden">
      <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Simple 100-Property Master Directory Index
          </span>
          <span className="text-xs text-emerald-700 font-medium">
            (Showing {properties.length} indexed records)
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Click any row for full Soil, Zoning &amp; Financial Dossier
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3.5 text-center w-12">#</th>
              <th className="py-3 px-3.5">Property &amp; Location</th>
              <th className="py-3 px-3">Distress Type</th>
              <th className="py-3 px-3 text-right">Acreage</th>
              <th className="py-3 px-3 text-right">Opening Bid</th>
              <th className="py-3 px-3 text-right">Est. ARV</th>
              <th className="py-3 px-3 text-right">Discount</th>
              <th className="py-3 px-3 text-right">Cap Rate</th>
              <th className="py-3 px-3 text-right">Land Grants</th>
              <th className="py-3 px-3.5">Soil &amp; Terroir</th>
              <th className="py-3 px-3.5">Top Food Crop</th>
              <th className="py-3 px-3.5">Top Business Venture</th>
              <th className="py-3 px-3 text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((prop, idx) => {
              const isCompared = selectedForCompareIds.includes(prop.id);
              const topCrop = prop.suitableCrops[0];
              const topBiz = prop.businessIdeas[0];

              return (
                <tr
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="hover:bg-emerald-50/60 cursor-pointer transition group"
                >
                  <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                    {startIndex + idx + 1}
                  </td>

                  <td className="py-3 px-3.5 max-w-[240px]">
                    <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                      {prop.title}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{prop.city}, {prop.county}, {prop.state}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {prop.distressType.replace(' Auction', '').replace(' / Short Sale', '')}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700 whitespace-nowrap">
                    {prop.acreage} AC
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    ${(prop.financials.askingOrOpeningBid / 1000).toFixed(0)}k
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                    ${(prop.financials.estimatedARV / 1000).toFixed(0)}k
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                    {prop.financials.equitySpreadDiscount}%
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap">
                    {prop.financials.capRate}%
                  </td>

                  <td className="py-3 px-3 text-right font-mono whitespace-nowrap">
                    <div className="font-extrabold text-rose-700 text-xs">
                      ${(calculateTotalGrantFunding(prop.eligibleLandGrants || []) / 1000).toFixed(0)}k
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold">
                      {prop.eligibleLandGrants?.length || 0} Programs
                    </div>
                  </td>

                  <td className="py-3 px-3.5 max-w-[150px]">
                    <div className="font-semibold text-slate-800 truncate">
                      {prop.soil.soilSeries}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium truncate">
                      Zone {prop.soil.hardinessZone} • {prop.soil.drainageClass.split(' ')[0]}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 max-w-[160px]">
                    <div className="font-semibold text-slate-800 truncate">
                      {topCrop ? topCrop.cropName : 'High-Value Crops'}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {topCrop ? topCrop.estYieldPerAcre : ''}
                    </div>
                  </td>

                  <td className="py-3 px-3.5 max-w-[200px]">
                    <div className="font-semibold text-emerald-900 truncate">
                      {topBiz ? topBiz.name : 'Commercial Model'}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono font-bold">
                      {topBiz ? `+$${(topBiz.estAnnualNOI / 1000).toFixed(0)}k/yr NOI` : ''}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {onValidateLegitimacy && (
                        <button
                          onClick={() => onValidateLegitimacy(prop)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition"
                          title="Deep Research & Validate Legitimacy"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition"
                        title="View Full Dossier"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToggleCompare(prop.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          isCompared
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200'
                        }`}
                        title="Compare"
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
