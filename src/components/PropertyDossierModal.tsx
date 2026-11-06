import React, { useState } from 'react';
import {
  X,
  MapPin,
  TrendingUp,
  Sprout,
  DollarSign,
  Gavel,
  ShieldCheck,
  Building,
  TreePine,
  ExternalLink,
  Sparkles,
  Layers,
  Send,
  Loader2,
  FileText,
  AlertTriangle,
  Scale,
  Printer,
  ChevronRight,
  Info,
  Calendar,
  Droplets,
  BookOpen,
  Landmark,
  CheckCircle2
} from 'lucide-react';
import { InvestmentProperty, BusinessOpportunity, FoodCropSuitability } from '../types/property';
import {
  calculateCapRate,
  calculateCashOnCash,
  calculateEquitySpread,
  calculateSurvivingLienExposure,
  calculateTotalGrantFunding
} from '../utils/underwriting';

interface PropertyDossierModalProps {
  property: InvestmentProperty;
  onClose: () => void;
  onValidateLegitimacy?: (prop: InvestmentProperty) => void;
  onOpenChat?: (initialQuestion?: string) => void;
}

type TabType = 'overview' | 'business' | 'soil' | 'zoning' | 'grants' | 'underwriting' | 'advisor';

export const PropertyDossierModal: React.FC<PropertyDossierModalProps> = ({
  property,
  onClose,
  onValidateLegitimacy,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');


  // Interactive Underwriting Calculator State
  const [calcPurchaseBid, setCalcPurchaseBid] = useState<number>(
    property.financials.askingOrOpeningBid
  );
  const [calcRehabCapEx, setCalcRehabCapEx] = useState<number>(
    property.financials.estimatedCapExRehab
  );
  const [calcHoldingCosts, setCalcHoldingCosts] = useState<number>(
    property.financials.holdingCostsAnnual
  );
  const [calcAnnualNOI, setCalcAnnualNOI] = useState<number>(
    property.financials.netOperatingIncomeProjected
  );

  // AI Advisor Chat State
  const [advisorQuery, setAdvisorQuery] = useState<string>('');
  const [advisorChat, setAdvisorChat] = useState<
    Array<{ role: 'user' | 'advisor'; text: string; citations?: any[] }>
  >([
    {
      role: 'advisor',
      text: `Aloha & welcome! I am your AI Investment & Tropical Agronomy Advisor for **${property.title}**.\nAsk me about zoning bylaws, tropical fruit tree density, surviving tax liens, municipal driveway permits, or 1031 tax exchange timing.`,
    },
  ]);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState<boolean>(false);

  // Underwriting & Land Grant calculations derived live
  const totalGrantFunding = calculateTotalGrantFunding(property.eligibleLandGrants || []);
  const { survivingTotal, extinguishedTotal } = calculateSurvivingLienExposure(property.liens);
  const liveSpread = calculateEquitySpread(
    property.financials.estimatedARV,
    calcPurchaseBid,
    survivingTotal,
    calcRehabCapEx
  );
  const liveCapRate = calculateCapRate(calcAnnualNOI, liveSpread.totalBasis);
  const liveCoC = calculateCashOnCash(
    calcAnnualNOI - calcHoldingCosts,
    liveSpread.totalBasis
  );

  const handleAskAdvisor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!advisorQuery.trim() || isAdvisorLoading) return;

    const userText = advisorQuery.trim();
    setAdvisorQuery('');
    setAdvisorChat((prev) => [...prev, { role: 'user', text: userText }]);
    setIsAdvisorLoading(true);

    try {
      const response = await fetch('/api/ask-property-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyTitle: property.title,
          propertyContext: {
            title: property.title,
            address: property.address,
            county: property.county,
            state: property.state,
            acreage: property.acreage,
            distressType: property.distressType,
            zoning: property.zoning,
            soil: property.soil,
            suitableCrops: property.suitableCrops,
            businessIdeas: property.businessIdeas,
            liens: property.liens,
            financials: property.financials
          },
          question: userText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAdvisorChat((prev) => [
          ...prev,
          { role: 'advisor', text: data.answer, citations: data.citations },
        ]);
      } else {
        setAdvisorChat((prev) => [
          ...prev,
          { role: 'advisor', text: 'Notice: ' + (data.error || 'Failed to process inquiry.') },
        ]);
      }
    } catch (err: any) {
      setAdvisorChat((prev) => [
        ...prev,
        {
          role: 'advisor',
          text: 'Advisor connection failed. Please ensure the server is running.',
        },
      ]);
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-amber-200/90 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-100/70 via-rose-100/70 to-purple-100/50 border-b border-amber-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-rose-100 text-rose-950 border border-rose-300 flex items-center gap-1.5 shadow-xs">
              <Gavel className="w-3.5 h-3.5 text-rose-700" />
              {property.distressType}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
              <span>APN: {property.parcelIdAPN}</span>
              <span>•</span>
              <span className="text-rose-700 font-bold">{property.acreage} ACRES</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print investment memo"
              className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close modal"
              className="p-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-400 border border-slate-200 shadow-xs transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Property Hero Banner */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {property.address}, {property.city}, {property.county}, {property.state} {property.zipCode}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Opening Bid</div>
              <div className="text-lg font-extrabold font-mono text-slate-900">
                ${property.financials.askingOrOpeningBid.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Est. ARV</div>
              <div className="text-lg font-bold font-mono text-slate-600">
                ${property.financials.estimatedARV.toLocaleString()}
              </div>
            </div>

            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-300 text-right">
              <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Cap Rate</div>
              <div className="text-lg font-black font-mono text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {property.financials.capRate}%
              </div>
            </div>

            {onValidateLegitimacy && (
              <button
                onClick={() => onValidateLegitimacy(property)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                title="Deep research and private legitimacy validation"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>Validate Legitimacy</span>
              </button>
            )}
          </div>
        </div>


        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50/80 border-b border-amber-100 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Executive Deal Memo</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'business'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Business Ventures &amp; Citings ({property.businessIdeas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('soil')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'soil'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Soil &amp; Food Crops ({property.suitableCrops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('zoning')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'zoning'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4 text-teal-600" />
            <span>Zoning &amp; Regulations</span>
          </button>

          <button
            onClick={() => setActiveTab('grants')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'grants'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 text-rose-600" />
            <span>Land Grants &amp; Subsidies ({property.eligibleLandGrants?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('underwriting')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'underwriting'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Financials &amp; Liens Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('advisor')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'advisor'
                ? 'border-rose-600 text-rose-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Property Advisor</span>
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Thesis Summary Card */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  Investment Thesis &amp; Market Drivers
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {property.summaryPitch}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {property.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deal Sheet Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 uppercase font-bold">Auction Venue</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {property.auctionVenue || 'County Courthouse Steps'}
                  </div>
                  {property.auctionDate && (
                    <div className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {property.auctionDate}
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 uppercase font-bold">Basis Discount</div>
                  <div className="text-xl font-black text-emerald-700 font-mono mt-1">
                    {property.financials.equitySpreadDiscount}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    ${(property.financials.estimatedARV - property.financials.askingOrOpeningBid).toLocaleString()} below ARV
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 uppercase font-bold">Surviving Liens</div>
                  <div className="text-xl font-black text-amber-700 font-mono mt-1">
                    ${survivingTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Wipes ${extinguishedTotal.toLocaleString()} junior debt
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500 uppercase font-bold">5-Year Projected IRR</div>
                  <div className="text-xl font-black text-teal-700 font-mono mt-1">
                    {property.financials.irr5Year}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    CoC Return: {property.financials.cashOnCashReturn}%
                  </div>
                </div>
              </div>

              {/* Quick Split: Top Business + Soil Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Primary Business Venture
                    </span>
                    <span className="font-mono text-emerald-700 font-extrabold text-xs">
                      +${(property.businessIdeas[0]?.estAnnualNOI / 1000).toFixed(0)}k/yr NOI
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {property.businessIdeas[0]?.name}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {property.businessIdeas[0]?.whyUniqueToArea}
                  </p>
                  <button
                    onClick={() => setActiveTab('business')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>View all venture models &amp; citations</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-lime-600" />
                      Soil &amp; Terroir Classification
                    </span>
                    <span className="font-mono text-emerald-700 font-bold text-xs">
                      Zone {property.soil.hardinessZone}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {property.soil.soilSeries} ({property.soil.drainageClass})
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {property.soil.textureDescription}. pH range {property.soil.phRange[0]} - {property.soil.phRange[1]}.
                  </p>
                  <button
                    onClick={() => setActiveTab('soil')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>View food crop yield matrix</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS VENTURES & CITINGS */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Unique Regional Business Models &amp; Commercial Citings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-margin commercial, tropical agro-forestry, and storage models uniquely fitted to this parcel's corridor and surrounding economic gaps.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {property.businessIdeas.map((idea, index) => (
                  <div
                    key={idea.id || index}
                    className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-4 shadow-sm hover:border-emerald-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                          {idea.category}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1.5">{idea.name}</h4>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-[10px] text-slate-500 font-semibold uppercase">Startup CapEx</div>
                          <div className="text-sm font-bold font-mono text-slate-800">
                            ${idea.startupCapex.toLocaleString()}
                          </div>
                        </div>
                        <div className="border-l border-slate-200 pl-4">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase">Projected Annual NOI</div>
                          <div className="text-sm font-black font-mono text-emerald-700">
                            +${idea.estAnnualNOI.toLocaleString()}
                          </div>
                        </div>
                        <div className="border-l border-slate-200 pl-4">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase">ROI / Payback</div>
                          <div className="text-sm font-bold font-mono text-teal-700">
                            {idea.roiPercentage}% ({idea.paybackPeriodYears} yrs)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Why Unique to This Specific Area:
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {idea.whyUniqueToArea}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Primary Permitting &amp; Regulatory Hurdle:
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {idea.keyRegulatoryHurdle}
                        </p>
                      </div>
                    </div>

                    {/* Citations & Evidence Sources */}
                    {idea.citations && idea.citations.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          Authoritative Market &amp; Government Citings:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {idea.citations.map((cite, cIdx) => (
                            <a
                              key={cIdx}
                              href={cite.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition flex items-start justify-between gap-2 text-xs group"
                            >
                              <div className="space-y-0.5">
                                <div className="font-bold text-emerald-800 group-hover:underline flex items-center gap-1">
                                  <span>{cite.title}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </div>
                                <div className="text-[10px] text-slate-600 line-clamp-2">
                                  "{cite.excerpt}"
                                </div>
                              </div>
                              <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-white text-slate-600 shrink-0 font-bold border border-slate-200">
                                {cite.sourceType}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOIL & FOOD CROPS */}
          {activeTab === 'soil' && (
            <div className="space-y-6">
              {/* Soil Taxonomy Breakdown */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lime-100 text-lime-900 border border-lime-200">
                      USDA NRCS Soil Classification
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">
                      {property.soil.soilSeries} ({property.soil.nrcsSoilSurveyRating})
                    </h4>
                  </div>
                  <div className="text-xs text-slate-600">
                    Taxonomy: <strong className="text-slate-900">{property.soil.usdaTaxonomy}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">pH Range</div>
                    <div className="text-sm font-extrabold text-emerald-700 mt-1 font-mono">
                      {property.soil.phRange[0]} - {property.soil.phRange[1]}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Drainage Class</div>
                    <div className="text-sm font-bold text-slate-800 mt-1">
                      {property.soil.drainageClass}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Hardiness Zone</div>
                    <div className="text-sm font-extrabold text-teal-700 mt-1 font-mono">
                      Zone {property.soil.hardinessZone}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Frost-Free Days</div>
                    <div className="text-sm font-bold text-slate-800 mt-1 font-mono">
                      {property.soil.frostFreeDays} days/yr
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Annual Rainfall</div>
                    <div className="text-sm font-bold text-sky-700 mt-1 font-mono">
                      {property.soil.annualRainfallInches}" / yr
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Water Rights</div>
                    <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-teal-600" />
                      {property.soil.waterRightsIncluded ? 'Deeded / Active' : 'None'}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <strong>Agronomic Soil Profile:</strong> {property.soil.textureDescription}.
                  Water table depth: {property.soil.waterTableDepthFt}.
                </div>
              </div>

              {/* Suitable Food Crops Matrix */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  Suitable Food Crops &amp; Yield Projections
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {property.suitableCrops.map((crop, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-3 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900">{crop.cropName}</h4>
                            <span className="text-xs text-slate-500 italic">
                              ({crop.scientificFamily})
                            </span>
                          </div>
                          <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                            Suitability Score: <strong>{crop.suitabilityScore}/100</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Est. Yield</span>
                            <span className="font-bold text-slate-800">{crop.estYieldPerAcre}</span>
                          </div>
                          <div className="border-l border-slate-200 pl-4">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Gross Rev / AC</span>
                            <span className="font-extrabold text-emerald-700">${crop.estGrossRevenuePerAcre.toLocaleString()}</span>
                          </div>
                          <div className="border-l border-slate-200 pl-4">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Harvest Window</span>
                            <span className="font-bold text-amber-700">{crop.harvestWindow}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Water Requirement:
                          </span>
                          <span className="text-slate-800 font-medium">{crop.waterRequirement}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Market Demand Rating:
                          </span>
                          <span className="text-emerald-800 font-semibold">{crop.marketDemandRating}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">
                            Soil &amp; pH Compatibility:
                          </span>
                          <span className="text-teal-800 font-semibold">Prefers pH {crop.soilPhPreference}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                        <strong>Terroir Rationale:</strong> {crop.agronomicNotes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZONING & REGULATIONS */}
          {activeTab === 'zoning' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-900 border border-teal-200">
                      Zoning Classification: {property.zoning.code}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">
                      {property.zoning.title}
                    </h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Jurisdiction: {property.zoning.jurisdiction}
                    </div>
                  </div>

                  {property.zoning.ordinanceRefUrl && (
                    <a
                      href={property.zoning.ordinanceRefUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs text-emerald-800 font-bold flex items-center gap-1.5 border border-slate-200 transition"
                    >
                      <span>County Ordinance Code</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Permitted vs Conditional vs Prohibited */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Permitted Uses by Right */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Permitted Uses By Right
                    </div>
                    <ul className="space-y-1.5 text-slate-700">
                      {property.zoning.permittedUses.map((use, uIdx) => (
                        <li key={uIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conditional Uses (CUP) */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 uppercase text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Conditional Use Permits (CUP)
                    </div>
                    <ul className="space-y-1.5 text-slate-700">
                      {property.zoning.conditionalUses.map((use, uIdx) => (
                        <li key={uIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prohibited Uses */}
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
                    <div className="font-bold text-rose-900 flex items-center gap-1.5 uppercase text-[11px]">
                      <X className="w-4 h-4 text-rose-600" />
                      Strictly Prohibited
                    </div>
                    <ul className="space-y-1.5 text-slate-700">
                      {property.zoning.prohibitedUses.map((use, uIdx) => (
                        <li key={uIdx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dimensional Standards */}
                <div className="pt-2 border-t border-slate-100">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Dimensional Standards &amp; Setbacks
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Front Setback</span>
                      <span className="font-bold text-slate-800 font-mono mt-0.5 block">{property.zoning.setbacks.frontFt} ft</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Side Setback</span>
                      <span className="font-bold text-slate-800 font-mono mt-0.5 block">{property.zoning.setbacks.sideFt} ft</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Rear Setback</span>
                      <span className="font-bold text-slate-800 font-mono mt-0.5 block">{property.zoning.setbacks.rearFt} ft</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Height</span>
                      <span className="font-bold text-slate-800 font-mono mt-0.5 block">{property.zoning.maxBuildingHeightFt} ft</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Coverage</span>
                      <span className="font-bold text-emerald-700 font-mono mt-0.5 block">{property.zoning.maxLotCoveragePercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Ag Rollback Notice */}
                {property.zoning.agRollbackTaxRisk && (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1 text-amber-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Agricultural Rollback Tax Exemption Clawback Warning
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Converting the entire footprint to non-agricultural commercial storage triggers up to a 5-year rollback tax assessment. Maintain active fruit trees, beekeeping, or nursery plantings on at least 51% of the land area to preserve statutory agricultural valuation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LAND GRANTS & SUBSIDIES */}
          {activeTab === 'grants' && (
            <div className="space-y-6">
              {/* Grant Header & Summary Metric Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-600/10 border border-amber-200/90 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-rose-100 text-rose-900 border border-rose-300">
                      Capital Subsidies &amp; Non-Dilutive Funding
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2 flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-rose-600" />
                      Eligible Federal &amp; State Land Grants
                    </h3>
                    <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
                      We have cross-referenced this parcel's acreage ({property.acreage} AC), USDA soil profile ({property.soil.soilSeries}), zoning classification ({property.zoning.code}), and commercial business models against active federal and state grant catalogs to identify non-dilutive capital you can implement.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 text-center shadow-xs">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Grant Potential</span>
                      <div className="text-2xl font-black font-mono text-rose-700 mt-0.5">
                        ${(totalGrantFunding / 1000).toFixed(0)}k
                      </div>
                    </div>

                    <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 text-center shadow-xs">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Programs Identified</span>
                      <div className="text-2xl font-black font-mono text-amber-700 mt-0.5">
                        {property.eligibleLandGrants?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Net CapEx Basis Reduction:</span>
                    <strong className="text-slate-900">Up to 75% of solar, micro-irrigation &amp; processing infrastructure funded</strong>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Source: USDA Grants.gov, NRCS, and State Departments of Agriculture
                  </span>
                </div>
              </div>

              {/* List of Grants */}
              <div className="space-y-4">
                {(property.eligibleLandGrants || []).map((grant, gIdx) => (
                  <div
                    key={grant.id || gIdx}
                    className="bg-white rounded-2xl border border-amber-200/80 hover:border-rose-400 p-5 space-y-4 shadow-xs transition hover:shadow-md"
                  >
                    {/* Grant Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            {grant.grantType}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{grant.agency}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {grant.name}
                        </h4>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Max Award Ceiling</div>
                        <div className="text-xl font-black font-mono text-emerald-700">
                          ${grant.maxFundingAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Match & Window Banner */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cost-Share / Match Requirement</span>
                        <div className="font-semibold text-slate-800">{grant.matchRequirement}</div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Application Cycle / Deadline</span>
                        <div className="font-semibold text-slate-800">{grant.applicationWindow}</div>
                      </div>
                    </div>

                    {/* Purpose & Eligibility */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5">Program Purpose &amp; Parcel Fit:</span>
                        <p className="text-slate-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                          {grant.purpose}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5">Eligibility Standards:</span>
                        <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                          {grant.eligibilityCriteria}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Implementation Roadmap */}
                    {grant.implementationSteps && grant.implementationSteps.length > 0 && (
                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          How to Implement on This Parcel (Step-by-Step Roadmap):
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {grant.implementationSteps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700"
                            >
                              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-2xs">
                                {sIdx + 1}
                              </span>
                              <span className="text-xs leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Official Portal Link */}
                    <div className="pt-2 flex justify-end">
                      <a
                        href={grant.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                      >
                        <span>Official Government Agency Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FINANCIAL UNDERWRITING & LIENS */}
          {activeTab === 'underwriting' && (
            <div className="space-y-6">
              {/* Lien Waterfall Table */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Title Encumbrance &amp; Lien Priority Waterfall
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Clear accounting of super-priority county tax liens vs junior deeds extinguished at auction.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-semibold">Surviving Obligation</span>
                    <span className="text-base font-extrabold text-amber-700 font-mono">
                      ${survivingTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Lien Type</th>
                        <th className="py-2.5 px-3">Claimant</th>
                        <th className="py-2.5 px-3 font-mono">Amount</th>
                        <th className="py-2.5 px-3">Priority</th>
                        <th className="py-2.5 px-3">Status at Foreclosure</th>
                        <th className="py-2.5 px-3">Legal Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {property.liens.map((lien, lIdx) => (
                        <tr key={lIdx} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{lien.lienType}</td>
                          <td className="py-2.5 px-3 text-slate-600">{lien.claimant}</td>
                          <td className="py-2.5 px-3 font-bold font-mono text-slate-900">
                            ${lien.amount.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                lien.priority === 'Super-Priority'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {lien.priority}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                lien.status === 'Survives Foreclosure' || lien.status === 'Must Be Cleared'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {lien.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 max-w-xs">{lien.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Underwriting Calculator */}
              <div className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-5 shadow-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Live Pro-Forma &amp; Underwriting Calculator
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Slide your purchase bid, CapEx, and target revenue to recalculate live returns instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Slider Controls */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Target Purchase / Auction Bid</span>
                        <span className="font-mono text-emerald-700 font-bold">${calcPurchaseBid.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={50000}
                        max={property.financials.estimatedARV}
                        step={10000}
                        value={calcPurchaseBid}
                        onChange={(e) => setCalcPurchaseBid(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">CapEx / Farm Infrastructure Rehab</span>
                        <span className="font-mono text-amber-700 font-bold">${calcRehabCapEx.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200000}
                        step={5000}
                        value={calcRehabCapEx}
                        onChange={(e) => setCalcRehabCapEx(Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Annual Holding &amp; Property Taxes</span>
                        <span className="font-mono text-slate-700 font-bold">${calcHoldingCosts.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={2000}
                        max={30000}
                        step={1000}
                        value={calcHoldingCosts}
                        onChange={(e) => setCalcHoldingCosts(Number(e.target.value))}
                        className="w-full accent-slate-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-slate-700">Projected Annual Net Operating Income (NOI)</span>
                        <span className="font-mono text-teal-700 font-bold">${calcAnnualNOI.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={20000}
                        max={300000}
                        step={5000}
                        value={calcAnnualNOI}
                        onChange={(e) => setCalcAnnualNOI(Number(e.target.value))}
                        className="w-full accent-teal-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Reactive Live Output Metrics */}
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-5 rounded-2xl border border-emerald-200 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Underwritten Investment Returns
                    </h5>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Basis</span>
                        <div className="text-lg font-black font-mono text-slate-900 mt-1">
                          ${liveSpread.totalBasis.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Net Equity Built</span>
                        <div className="text-lg font-black font-mono text-emerald-700 mt-1">
                          ${liveSpread.netEquity.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
                        <span className="text-[10px] text-emerald-100 uppercase font-bold">Unlevered Cap Rate</span>
                        <div className="text-2xl font-black font-mono mt-0.5">
                          {liveCapRate}%
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Cash-on-Cash Return</span>
                        <div className="text-2xl font-black font-mono text-teal-700 mt-0.5">
                          {liveCoC}%
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between shadow-2xs">
                      <span className="font-semibold">Discount Below Appraised ARV:</span>
                      <strong className="text-emerald-700 font-mono text-sm font-bold">{liveSpread.discountPercentage}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AI PROPERTY ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="space-y-4 flex flex-col h-[520px]">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 flex items-center justify-between shadow-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Investment &amp; Agronomy Consultant (Grounded in Real Deeds &amp; Surveys)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Grounded answers on zoning bylaws, soil amendments, and tax strategies.
                  </p>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {advisorChat.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-emerald-700 text-white rounded-tr-none font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-normal'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 text-[11px]">
                          <span className="font-bold text-emerald-800 block mb-1">
                            Grounding Web Citations:
                          </span>
                          <div className="space-y-1">
                            {msg.citations.map((c: any, cIdx: number) => (
                              <a
                                key={cIdx}
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-emerald-700 hover:underline truncate font-medium"
                              >
                                • {c.title || c.url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAdvisorLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Consulting county land development bylaws and NRCS soil surveys...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Prompts */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
                {[
                  'How do I maintain the ag exemption if I build an eco-retreat?',
                  'What is the statutory redemption period risk for this auction?',
                  'Which companion crops maximize soil fertility here?',
                  'Can I install a commercial gravel driveway?'
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setAdvisorQuery(prompt);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-slate-700 text-[11px] whitespace-nowrap border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskAdvisor} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask any legal, agronomic, or financial question about this parcel..."
                  value={advisorQuery}
                  onChange={(e) => setAdvisorQuery(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="submit"
                  disabled={isAdvisorLoading || !advisorQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Consult</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
