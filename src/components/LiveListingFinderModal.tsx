import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Radio,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Sprout,
  Gavel,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  X,
  FileCheck
} from 'lucide-react';
import { VerifiedLiveListing } from '../types/property';

interface LiveListingFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectListingForAnalysis?: (listing: VerifiedLiveListing) => void;
}

export const LiveListingFinderModal: React.FC<LiveListingFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectListingForAnalysis
}) => {
  const [listings, setListings] = useState<VerifiedLiveListing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deepScanSources, setDeepScanSources] = useState<{ title: string; url: string }[]>([]);
  const [scannedAt, setScannedAt] = useState<string>('');

  // Search parameters
  const [selectedState, setSelectedState] = useState<string>('');
  const [distressFilter, setDistressFilter] = useState<string>('');
  const [cropKeyword, setCropKeyword] = useState<string>('');
  const [minAcres, setMinAcres] = useState<number>(5);
  const [maxPrice, setMaxPrice] = useState<number>(1500000);

  // Active inspected listing
  const [activeListing, setActiveListing] = useState<VerifiedLiveListing | null>(null);

  const fetchLiveListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/live-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          distressType: distressFilter,
          minAcreage: minAcres,
          maxPrice: maxPrice,
          cropKeyword: cropKeyword.trim()
        })
      });
      const data = await response.json();
      if (data.success) {
        setListings(data.listings || []);
        setDeepScanSources(data.searchGroundingSources || []);
        setScannedAt(data.scannedAt || new Date().toISOString());
      }
    } catch (err) {
      console.error('Failed to scan live listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveListings();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-amber-200 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Globe className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight">Verified Live Listing Finder</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-slate-950 animate-ping" />
                  Deep Internet Scanning
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Scans county dockets, LandWatch, Crexi &amp; court commissioners with Gemini Search Grounding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveListings}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Scanning Internet...' : 'Rescan Web'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* State filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="">All Agronomic States</option>
              <option value="FL">Florida (Tropical Redland &amp; Citrus)</option>
              <option value="HI">Hawaii (Kona Coffee &amp; Cacao)</option>
              <option value="CA">California (Salinas &amp; Wine Country)</option>
              <option value="TX">Texas (Hill Country &amp; Rio Grande)</option>
              <option value="WA">Washington (Yakima Valley Orchards)</option>
              <option value="GA">Georgia (Pecan &amp; Peach Belts)</option>
            </select>

            {/* Distress Type */}
            <select
              value={distressFilter}
              onChange={(e) => setDistressFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="">All Distress Channels</option>
              <option value="Sheriff Foreclosure">Sheriff Foreclosure Auctions</option>
              <option value="Tax Deed">Tax Deed Sales</option>
              <option value="Pre-Foreclosure">Pre-Foreclosure / Short Sales</option>
              <option value="Bank-Owned REO">Bank-Owned REO</option>
              <option value="Tax Lien">Tax Lien Certificates</option>
            </select>

            {/* Crop Keyword */}
            <div className="relative">
              <input
                type="text"
                placeholder="Target crop (e.g., Avocado, Coffee)..."
                value={cropKeyword}
                onChange={(e) => setCropKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLiveListings()}
                className="bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-rose-500 focus:outline-hidden w-56"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={fetchLiveListings}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-xs transition cursor-pointer"
            >
              Scan Listings
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
            <span>Verified Found: <strong className="text-rose-700">{listings.length}</strong></span>
            {deepScanSources.length > 0 && (
              <>
                <span>•</span>
                <span className="text-purple-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  {deepScanSources.length} Grounded Sources
                </span>
              </>
            )}
          </div>
        </div>

        {/* Internet Grounding Crawl Breadcrumb (if active sources returned) */}
        {deepScanSources.length > 0 && (
          <div className="px-6 py-2 bg-purple-50/80 border-b border-purple-200/60 flex items-center gap-2 overflow-x-auto text-[11px] text-purple-900">
            <span className="font-bold flex items-center gap-1 shrink-0">
              <Globe className="w-3 h-3 text-purple-600" />
              Grounded Web Citations:
            </span>
            <div className="flex items-center gap-2 flex-nowrap">
              {deepScanSources.slice(0, 4).map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded-md bg-white border border-purple-200 hover:border-purple-400 text-purple-800 font-semibold truncate max-w-xs flex items-center gap-1 shadow-2xs"
                >
                  <span className="truncate">{source.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-slate-800">
                Executing Deep Internet Real Estate Scan...
              </h4>
              <p className="text-xs text-slate-500 max-w-md">
                Verifying live auction listings, cross-referencing public court dockets, water rights, and soil records with Google Search Grounding.
              </p>
            </div>
          ) : listings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No matching live listings found</h4>
              <p className="text-xs text-slate-500">
                Try widening your search filters or resetting to view all active auction parcels.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((item) => {
                const discountPct = Math.round(
                  ((item.estimatedMarketValue - item.askingOrOpeningBid) / item.estimatedMarketValue) * 100
                );

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-amber-200/90 hover:border-rose-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 pb-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                          <Gavel className="w-3 h-3 text-rose-700" />
                          {item.distressType}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {item.verificationAudit.verificationConfidence}% Verified
                        </span>
                      </div>

                      {/* Location & Title */}
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {item.location.city}, {item.location.county}, {item.location.state}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm leading-snug group-hover:text-rose-700 transition">
                          {item.title}
                        </h4>
                      </div>

                      {/* Financial Pricing Matrix */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 mt-3 text-center">
                        <div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            Opening Bid
                          </div>
                          <div className="text-sm font-black font-mono text-slate-900">
                            ${item.askingOrOpeningBid.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            Est. Value
                          </div>
                          <div className="text-sm font-bold font-mono text-slate-500 line-through">
                            ${item.estimatedMarketValue.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
                            Spread
                          </div>
                          <div className="text-sm font-black font-mono text-emerald-700">
                            {discountPct}% OFF
                          </div>
                        </div>
                      </div>

                      {/* Agronomic Details */}
                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-emerald-900">Top Crop:</span>
                          <span className="truncate">{item.topRecommendedCrop}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50">
                          <span className="font-bold text-amber-900 block mb-0.5">Water &amp; Irrigation:</span>
                          <span>{item.waterRightsOrIrrigation}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-teal-50/60 p-2.5 rounded-xl border border-teal-200/50">
                          <span className="font-bold text-teal-900 block mb-0.5">Court Docket / Verification Match:</span>
                          <span className="font-mono text-[10px] text-teal-800 block">{item.verificationAudit.countyDocketMatch}</span>
                          <span className="text-slate-500 text-[10px] italic mt-0.5 block">{item.verificationAudit.scanSnippet}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                      >
                        <span>{item.sourceDomain}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {onSelectListingForAnalysis && (
                        <button
                          onClick={() => {
                            onSelectListingForAnalysis(item);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Underwrite 5-Yr ROI</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-slate-50 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Real-time public record sync active. Citations grounded via Google Search API.</span>
          </div>
          <span className="font-mono text-[11px]">
            Scan executed: {new Date(scannedAt || Date.now()).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};
