import React from 'react';
import {
  X,
  Scale,
  Gavel,
  DollarSign,
  TrendingUp,
  Sprout,
  Sparkles,
  TreePine,
  ShieldAlert,
  ArrowRight,
  Landmark
} from 'lucide-react';
import { InvestmentProperty } from '../types/property';
import { calculateSurvivingLienExposure, calculateTotalGrantFunding } from '../utils/underwriting';

interface ComparisonModalProps {
  properties: InvestmentProperty[];
  onClose: () => void;
  onSelectProperty: (prop: InvestmentProperty) => void;
  onRemoveFromCompare: (propId: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  properties,
  onClose,
  onSelectProperty,
  onRemoveFromCompare,
}) => {
  if (properties.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white border border-emerald-100 rounded-3xl p-8 max-w-md w-full text-center space-y-4 text-slate-800 shadow-2xl">
          <Scale className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Properties Selected</h3>
          <p className="text-xs text-slate-500">
            Click the "Compare" icon on any property card or index row to compare tropical soil, yields, zoning, and business returns side-by-side.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            Return to Finder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-emerald-100 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              Side-by-Side Investment Property Comparison ({properties.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-2xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Matrix Comparison Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 bg-slate-50/40">
          <table className="w-full text-left text-xs border-collapse bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
            <thead>
              <tr>
                <th className="p-3.5 bg-slate-100 text-slate-700 uppercase tracking-wider font-bold w-48 sticky left-0 z-10 border-b border-slate-200">
                  Metric
                </th>
                {properties.map((prop) => (
                  <th
                    key={prop.id}
                    className="p-3.5 bg-emerald-50/50 min-w-[260px] max-w-[300px] border-b border-l border-emerald-100"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm line-clamp-1">
                        {prop.title}
                      </span>
                      <button
                        onClick={() => onRemoveFromCompare(prop.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {prop.city}, {prop.county}, {prop.state}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Photo */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Preview
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100">
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={prop.imageUrl}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Distress Type */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Distress Type
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {prop.distressType}
                    </span>
                    {prop.auctionDate && (
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        {prop.auctionDate}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Opening Bid vs ARV */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Opening Bid / ARV
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100 font-mono">
                    <div className="text-sm font-extrabold text-emerald-700">
                      ${prop.financials.askingOrOpeningBid.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ARV: ${prop.financials.estimatedARV.toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Basis Discount */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Discount Below ARV
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100 font-mono font-black text-amber-700 text-sm">
                    {prop.financials.equitySpreadDiscount}%
                  </td>
                ))}
              </tr>

              {/* Cap Rate & IRR */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Cap Rate / 5-Yr IRR
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100 font-mono">
                    <div className="text-sm font-black text-emerald-700">
                      {prop.financials.capRate}% Cap Rate
                    </div>
                    <div className="text-[11px] text-slate-500">
                      IRR: {prop.financials.irr5Year}%
                    </div>
                  </td>
                ))}
              </tr>

              {/* Acreage & Cost per Acre */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Acreage &amp; $/AC
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100 font-mono">
                    <div className="font-bold text-slate-900">{prop.acreage} ACRES</div>
                    <div className="text-[11px] text-slate-500">
                      ${Math.round(prop.financials.askingOrOpeningBid / prop.acreage).toLocaleString()} / acre
                    </div>
                  </td>
                ))}
              </tr>

              {/* Eligible Land Grants */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  <div className="flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-rose-600" />
                    <span>Eligible Land Grants</span>
                  </div>
                </td>
                {properties.map((prop) => {
                  const grants = prop.eligibleLandGrants || [];
                  const total = calculateTotalGrantFunding(grants);
                  return (
                    <td key={prop.id} className="p-3.5 border-l border-slate-100">
                      <div className="font-extrabold text-rose-700 font-mono text-sm">
                        ${(total / 1000).toFixed(0)}k Potential
                      </div>
                      <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                        {grants.length} Programs (EQIP / REAP)
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {grants.map((g) => g.name.replace(/^USDA\s+/, '')).join(' • ')}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Top Business Idea */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Top Business Venture
                </td>
                {properties.map((prop) => {
                  const idea = prop.businessIdeas[0];
                  return (
                    <td key={prop.id} className="p-3.5 border-l border-slate-100">
                      {idea ? (
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">{idea.name}</span>
                          <span className="text-emerald-700 font-mono font-bold text-[11px] block">
                            +${(idea.estAnnualNOI / 1000).toFixed(0)}k/yr NOI ({idea.roiPercentage}% ROI)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Soil Classification */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Soil Taxonomy
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100">
                    <div className="font-bold text-slate-900">{prop.soil.soilSeries}</div>
                    <div className="text-[11px] text-emerald-700 font-medium">{prop.soil.nrcsSoilSurveyRating}</div>
                    <div className="text-[10px] text-slate-500">
                      pH: {prop.soil.phRange[0]}-{prop.soil.phRange[1]} • Zone {prop.soil.hardinessZone}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Top Food Crop */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Best Food Crop
                </td>
                {properties.map((prop) => {
                  const crop = prop.suitableCrops[0];
                  return (
                    <td key={prop.id} className="p-3.5 border-l border-slate-100">
                      {crop ? (
                        <div>
                          <span className="font-bold text-slate-900 block">{crop.cropName}</span>
                          <span className="text-emerald-700 font-mono text-[11px]">
                            {crop.estYieldPerAcre} (${crop.estGrossRevenuePerAcre.toLocaleString()}/AC)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Surviving Liens */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Surviving Liens Exposure
                </td>
                {properties.map((prop) => {
                  const { survivingTotal } = calculateSurvivingLienExposure(prop.liens);
                  return (
                    <td key={prop.id} className="p-3.5 border-l border-slate-100 font-mono">
                      <span className="font-bold text-amber-700">${survivingTotal.toLocaleString()}</span>
                    </td>
                  );
                })}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-3.5 font-bold text-slate-700 bg-slate-50 sticky left-0 z-10">
                  Action
                </td>
                {properties.map((prop) => (
                  <td key={prop.id} className="p-3.5 border-l border-slate-100">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Full Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
