import {
  Gavel,
  MapPin,
  TrendingUp,
  Sprout,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Scale,
  Bookmark,
  Check,
  Building,
  Sparkles,
  TreePine,
  Layers,
  Landmark,
  ShieldCheck
} from 'lucide-react';
import { InvestmentProperty } from '../types/property';
import { calculateSurvivingLienExposure, calculateTotalGrantFunding } from '../utils/underwriting';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: InvestmentProperty;
  onSelect: (prop: InvestmentProperty) => void;
  isSaved: boolean;
  onToggleSave: (propId: string) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (propId: string) => void;
  onValidateLegitimacy?: (prop: InvestmentProperty) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved,
  onToggleSave,
  isSelectedForCompare,
  onToggleCompare,
  onValidateLegitimacy
}) => {
  const { getValidation } = useAuth();
  const existingVal = getValidation(property.id);
  const topBusinessIdea = property.businessIdeas[0];
  const topCrop = property.suitableCrops[0];
  const { survivingTotal } = calculateSurvivingLienExposure(property.liens);
  const totalGrants = calculateTotalGrantFunding(property.eligibleLandGrants || []);


  const getDistressBadgeColor = (distress: string) => {
    if (distress.includes('Foreclosure') || distress.includes('Sheriff')) {
      return 'bg-amber-100 text-amber-950 border-amber-300';
    }
    if (distress.includes('Tax')) {
      return 'bg-rose-100 text-rose-950 border-rose-300';
    }
    if (distress.includes('Bank') || distress.includes('REO')) {
      return 'bg-orange-100 text-orange-950 border-orange-300';
    }
    return 'bg-emerald-100 text-emerald-950 border-emerald-300';
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100/90 hover:border-rose-400 transition-all duration-300 overflow-hidden flex flex-col group shadow-sm hover:shadow-xl hover:shadow-rose-950/10">
      {/* Image & Tropical Badges Header */}
      <div 
        onClick={() => onSelect(property)} 
        className="relative h-52 w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={property.imageUrl}
          alt={property.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 items-start">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 shadow-sm ${getDistressBadgeColor(
                property.distressType
              )}`}
            >
              <Gavel className="w-3.5 h-3.5" />
              {property.distressType}
            </span>

            {property.auctionDate && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-amber-800 border border-amber-200 shadow-xs">
                Auction: {property.auctionDate.split(' ')[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Compare Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(property.id);
              }}
              title="Add to comparison"
              aria-label="Add to comparison"
              className={`p-2 rounded-xl backdrop-blur-md transition shadow-xs ${
                isSelectedForCompare
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-emerald-700 border border-emerald-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(property.id);
              }}
              title={isSaved ? 'Remove from saved' : 'Save property'}
              aria-label={isSaved ? 'Remove from saved' : 'Save property'}
              className={`p-2 rounded-xl backdrop-blur-md transition shadow-xs ${
                isSaved
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/90 text-slate-700 hover:bg-white hover:text-amber-600 border border-emerald-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Image Overlay: Acreage & ARV Discount Banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="text-white drop-shadow">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-slate-950 tracking-wider shadow-xs">
              {property.acreage} ACRES
            </span>
            <div className="text-xs text-emerald-100 flex items-center gap-1 mt-1 font-mono">
              <span>APN: {property.parcelIdAPN}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400 text-amber-950 shadow-sm border border-amber-300">
              {property.financials.equitySpreadDiscount}% BELOW ARV
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div onClick={() => onSelect(property)} className="cursor-pointer">
          {/* Location & Title */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {property.city}, {property.county}, {property.state}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {property.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
            {property.summaryPitch}
          </p>
        </div>

        {/* Financial Highlights Bar */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 rounded-xl border border-emerald-100 text-center">
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Opening Bid</div>
            <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
              ${(property.financials.askingOrOpeningBid / 1000).toFixed(0)}k
            </div>
          </div>

          <div className="border-x border-emerald-200/60">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Est. ARV</div>
            <div className="text-sm font-bold text-slate-600 font-mono mt-0.5">
              ${(property.financials.estimatedARV / 1000).toFixed(0)}k
            </div>
          </div>

          <div>
            <div className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Cap Rate</div>
            <div className="text-sm font-black text-emerald-700 font-mono mt-0.5 flex items-center justify-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              {property.financials.capRate}%
            </div>
          </div>
        </div>

        {/* Feature 0: Eligible Land Grants */}
        {property.eligibleLandGrants && property.eligibleLandGrants.length > 0 && (
          <div className="p-2.5 bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50/60 border border-amber-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-rose-600" />
                Land Grants Available:
              </span>
              <span className="font-mono text-rose-700 font-extrabold text-[12px]">
                ${(totalGrants / 1000).toFixed(0)}k Max
              </span>
            </div>
            <div className="text-[11px] text-slate-700 font-medium truncate">
              {property.eligibleLandGrants.map((g) => g.name.replace(/^USDA\s+/, '')).slice(0, 2).join(' • ')}
            </div>
          </div>
        )}

        {/* Feature 1: Unique Business Idea */}
        {topBusinessIdea && (
          <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Venture Opportunity:
              </span>
              <span className="font-mono text-emerald-700 font-bold text-[11px]">
                +${(topBusinessIdea.estAnnualNOI / 1000).toFixed(0)}k/yr NOI
              </span>
            </div>

            <div className="text-xs font-bold text-slate-800 line-clamp-1">
              {topBusinessIdea.name}
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
              {topBusinessIdea.whyUniqueToArea}
            </p>
          </div>
        )}

        {/* Feature 2: Soil & Suitable Food Crops */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
              <TreePine className="w-3 h-3 text-emerald-600" />
              Soil &amp; Terroir
            </div>
            <div className="font-bold text-slate-800 truncate">
              {property.soil.soilSeries}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium truncate">
              Zone {property.soil.hardinessZone} • {property.soil.drainageClass.split(' ')[0]}
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
              <Sprout className="w-3 h-3 text-lime-600" />
              Top Food Crop
            </div>
            <div className="font-bold text-slate-800 truncate">
              {topCrop?.cropName || 'Organic Crops'}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium truncate">
              {topCrop?.estYieldPerAcre || 'High Yield'}
            </div>
          </div>
        </div>

        {/* Feature 3: Zoning & Surviving Liens */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px] font-semibold border border-slate-200">
              {property.zoning.code}
            </span>
            <span className="truncate max-w-[120px] text-[11px]">
              {property.zoning.title}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            <span>
              Liens: <strong className="text-slate-800">${survivingTotal.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Legitimacy Validation Status / Action */}
        {existingVal ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privately Audited: {existingVal.legitimacyScore}/100</span>
            </div>
            {onValidateLegitimacy && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onValidateLegitimacy(property);
                }}
                className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                View Audit
              </button>
            )}
          </div>
        ) : onValidateLegitimacy ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onValidateLegitimacy(property);
            }}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deep Research &amp; Validate Legitimacy</span>
          </button>
        ) : null}

        {/* Primary Action Button */}
        <button
          onClick={() => onSelect(property)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 hover:from-amber-500 hover:to-rose-600 text-white transition flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md cursor-pointer"
        >
          <span>Examine Property Dossier</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
