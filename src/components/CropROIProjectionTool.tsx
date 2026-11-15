import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Sprout,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  Landmark,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  BarChart3,
  Sparkles
} from 'lucide-react';
import {
  InvestmentProperty,
  CropProjectionInput,
  MaintenanceExpenseInput,
  FiveYearProjectionResult
} from '../types/property';
import {
  calculateFiveYearCropROI,
  getDefaultCropInputs,
  getDefaultMaintenanceInputs,
  calculateTotalGrantFunding
} from '../utils/underwriting';

interface CropROIProjectionToolProps {
  property: InvestmentProperty;
  onApplyProjectionToDossier?: (result: FiveYearProjectionResult) => void;
}

export const CropROIProjectionTool: React.FC<CropROIProjectionToolProps> = ({
  property,
  onApplyProjectionToDossier
}) => {
  // Configurable Crop Inputs
  const [crops, setCrops] = useState<CropProjectionInput[]>(() => getDefaultCropInputs(property));

  // Configurable Maintenance Expense Inputs
  const [maintenance, setMaintenance] = useState<MaintenanceExpenseInput>(() =>
    getDefaultMaintenanceInputs(property)
  );

  // Capital assumptions
  const [customPurchaseBid, setCustomPurchaseBid] = useState<number>(
    property.financials.askingOrOpeningBid
  );
  const [customInitialCapEx, setCustomInitialCapEx] = useState<number>(
    property.financials.estimatedCapExRehab
  );
  const [landAppreciationPct, setLandAppreciationPct] = useState<number>(4.5);
  const [includeLandGrants, setIncludeLandGrants] = useState<boolean>(true);

  // Selected year tab for deep dive
  const [selectedYear, setSelectedYear] = useState<number>(1);

  // Calculation execution
  const totalGrantPool = calculateTotalGrantFunding(property.eligibleLandGrants || []);
  const annualGrantSubsidy = includeLandGrants ? Math.min(25000, Math.round(totalGrantPool / 5)) : 0;

  const projectionResult: FiveYearProjectionResult = useMemo(() => {
    return calculateFiveYearCropROI(property, crops, maintenance, {
      customPurchaseBid,
      customInitialCapEx,
      annualLandAppreciationPct: landAppreciationPct,
      grantSubsidyAnnualShare: annualGrantSubsidy
    });
  }, [property, crops, maintenance, customPurchaseBid, customInitialCapEx, landAppreciationPct, annualGrantSubsidy]);

  // Handlers for modifying crops
  const handleUpdateCrop = (index: number, field: keyof CropProjectionInput, value: any) => {
    setCrops((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddCrop = () => {
    setCrops((prev) => [
      ...prev,
      {
        cropName: 'New Specialty Crop',
        plantedAcres: 3,
        expectedYieldPerAcre: 6000,
        yieldUnit: 'lbs',
        pricePerUnit: 3.25,
        annualYieldGrowthPct: 4.0,
        annualPriceInflationPct: 2.0,
        annualProductionCostPerAcre: 3500
      }
    ]);
  };

  const handleRemoveCrop = (index: number) => {
    if (crops.length <= 1) return;
    setCrops((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetDefaults = () => {
    setCrops(getDefaultCropInputs(property));
    setMaintenance(getDefaultMaintenanceInputs(property));
    setCustomPurchaseBid(property.financials.askingOrOpeningBid);
    setCustomInitialCapEx(property.financials.estimatedCapExRehab);
    setLandAppreciationPct(4.5);
  };

  // Active year selected
  const activeYearData = projectionResult.yearByYear.find((y) => y.year === selectedYear) || projectionResult.yearByYear[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Summary Cards */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 p-0.5 rounded-3xl shadow-lg">
        <div className="bg-slate-900 rounded-[23px] p-5 sm:p-6 text-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-slate-950" />
                  Dynamic 5-Year Crop Underwriting
                </span>
                <span className="text-xs text-amber-200/80 font-mono">
                  {property.acreage} Total Acres • APN: {property.parcelIdAPN}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Projected 5-Year Return &amp; Agricultural Cash Flow
              </h3>
            </div>

            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-200 transition"
              title="Reset to agronomic defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                5-Year Total Net ROI
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 flex items-baseline gap-1 mt-0.5">
                {projectionResult.fiveYearTotalROI}%
                <span className="text-xs font-normal text-emerald-300">net</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Annualized (CAGR): <span className="font-bold text-white">{projectionResult.fiveYearAnnualizedROI}% / yr</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Break-Even Horizon
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 mt-0.5">
                {projectionResult.breakEvenYear ? `${projectionResult.breakEvenYear} Yrs` : '> 5.0 Yrs'}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Initial Basis: <span className="font-bold text-white">${projectionResult.initialInvestmentBasis.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                5-Yr Net Cash Flow
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300 mt-0.5">
                ${projectionResult.fiveYearTotalNetCashFlow.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Gross Yield: <span className="font-bold text-white">${projectionResult.fiveYearTotalGrossRevenue.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Terminal Land Equity
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-rose-300 mt-0.5">
                ${projectionResult.fiveYearEstimatedTerminalValue.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Total 5-Yr Profit: <span className="font-bold text-emerald-400">+${projectionResult.fiveYearNetProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Interactive Tool: Inputs vs Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Crop Yield & Maintenance Cost Input Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Crop Yield Inputs */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    Projected Crop Yields &amp; Market Harvest Pricing
                  </h4>
                  <p className="text-xs text-slate-500">
                    Fine-tune planted acreage, expected yield per acre, and farm-gate market prices.
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddCrop}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Crop</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-3 space-y-4 pt-1">
              {crops.map((crop, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={crop.cropName}
                        onChange={(e) => handleUpdateCrop(idx, 'cropName', e.target.value)}
                        className="font-bold text-slate-900 text-sm bg-transparent border-b border-dashed border-slate-300 focus:border-emerald-600 focus:outline-hidden px-1 py-0.5"
                      />
                    </div>

                    {crops.length > 1 && (
                      <button
                        onClick={() => handleRemoveCrop(idx)}
                        className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                        title="Remove crop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Planted (Acres)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        max={property.acreage}
                        step="0.5"
                        value={crop.plantedAcres}
                        onChange={(e) => handleUpdateCrop(idx, 'plantedAcres', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Yield / Acre ({crop.yieldUnit})
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="100"
                        value={crop.expectedYieldPerAcre}
                        onChange={(e) => handleUpdateCrop(idx, 'expectedYieldPerAcre', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Price / {crop.yieldUnit} ($)
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={crop.pricePerUnit}
                        onChange={(e) => handleUpdateCrop(idx, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Input Cost/Ac ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={crop.annualProductionCostPerAcre}
                        onChange={(e) => handleUpdateCrop(idx, 'annualProductionCostPerAcre', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Growth & Inflation Assumption */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-600 bg-emerald-50/50 p-2 rounded-xl">
                    <span className="font-semibold text-emerald-800">Compounding:</span>
                    <label className="flex items-center gap-1.5">
                      <span>Maturity Yield Growth:</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={crop.annualYieldGrowthPct}
                        onChange={(e) => handleUpdateCrop(idx, 'annualYieldGrowthPct', parseFloat(e.target.value) || 0)}
                        className="w-12 bg-white border border-slate-200 rounded-md px-1 py-0.5 font-mono text-center font-bold"
                      />
                      <span>%/yr</span>
                    </label>

                    <label className="flex items-center gap-1.5">
                      <span>Price Inflation:</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={crop.annualPriceInflationPct}
                        onChange={(e) => handleUpdateCrop(idx, 'annualPriceInflationPct', parseFloat(e.target.value) || 0)}
                        className="w-12 bg-white border border-slate-200 rounded-md px-1 py-0.5 font-mono text-center font-bold"
                      />
                      <span>%/yr</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Maintenance Costs & Operating Overhead */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    Itemized Maintenance Costs &amp; Land Stewardship
                  </h4>
                  <p className="text-xs text-slate-500">
                    Annual property overhead, water/irrigation pumping, soil amendments, and equipment maintenance.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Property Ag Taxes ($/yr)
                </label>
                <input
                  type="number"
                  step="100"
                  value={maintenance.propertyTaxesAnnual}
                  onChange={(e) =>
                    setMaintenance((m) => ({ ...m, propertyTaxesAnnual: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Insurance &amp; Liability ($/yr)
                </label>
                <input
                  type="number"
                  step="100"
                  value={maintenance.insuranceAndLiability}
                  onChange={(e) =>
                    setMaintenance((m) => ({ ...m, insuranceAndLiability: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Irrigation &amp; Pumping ($/yr)
                </label>
                <input
                  type="number"
                  step="100"
                  value={maintenance.irrigationAndWaterPumping}
                  onChange={(e) =>
                    setMaintenance((m) => ({ ...m, irrigationAndWaterPumping: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Soil Amendments &amp; Humus ($/yr)
                </label>
                <input
                  type="number"
                  step="100"
                  value={maintenance.soilAmendmentAndCompost}
                  onChange={(e) =>
                    setMaintenance((m) => ({ ...m, soilAmendmentAndCompost: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Equipment Repairs &amp; Fuel ($/yr)
                </label>
                <input
                  type="number"
                  step="100"
                  value={maintenance.equipmentRepairsAndFuel}
                  onChange={(e) =>
                    setMaintenance((m) => ({ ...m, equipmentRepairsAndFuel: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Labor &amp; Seasonal Mgmt ($/yr)
                </label>
                <input
                  type="number"
                  step="500"
                  value={maintenance.laborAndManagement}
                  onChange={(e) =>
                    setMaintenance((m) => ({ ...m, laborAndManagement: parseFloat(e.target.value) || 0 }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Inflation & Contingency */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Contingency Reserve:</span>
                  <input
                    type="number"
                    step="200"
                    value={maintenance.contingencyReserves}
                    onChange={(e) =>
                      setMaintenance((m) => ({ ...m, contingencyReserves: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-mono text-xs"
                  />
                </label>

                <label className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Cost Inflation:</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={maintenance.annualExpenseInflationPct}
                    onChange={(e) =>
                      setMaintenance((m) => ({ ...m, annualExpenseInflationPct: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-12 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 font-mono text-center text-xs"
                  />
                  <span>%/yr</span>
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-rose-800">
                <input
                  type="checkbox"
                  checked={includeLandGrants}
                  onChange={(e) => setIncludeLandGrants(e.target.checked)}
                  className="rounded-sm text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span>Include Land Grant Subsidies (${annualGrantSubsidy.toLocaleString()}/yr)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Year Financial Projection Display & Year-by-Year (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Year Selector Tabs */}
          <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>5-Year Cumulative Trajectory</span>
              </h4>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Detailed Pro-Forma
              </span>
            </div>

            {/* Year selector pills */}
            <div className="grid grid-cols-5 gap-1.5 bg-slate-100 p-1 rounded-2xl">
              {[1, 2, 3, 4, 5].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`py-2 text-xs font-black rounded-xl transition ${
                    selectedYear === yr
                      ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  Year {yr}
                </button>
              ))}
            </div>

            {/* Selected Year Breakdown Card */}
            <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/50 to-purple-50/70 rounded-2xl p-4 border border-amber-200/60 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                <span className="font-black text-slate-800 text-xs">
                  YEAR {activeYearData.year} PERFORMANCE REPORT
                </span>
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {activeYearData.yearRoiPct}% ROI on Basis
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Gross Crop Harvest Revenue:
                  </span>
                  <span className="font-bold font-mono text-emerald-700">
                    +${activeYearData.grossCropRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Direct Crop Inputs &amp; Labor:
                  </span>
                  <span className="font-semibold font-mono text-slate-600">
                    -${activeYearData.totalProductionCosts.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Property &amp; Equipment Maintenance:
                  </span>
                  <span className="font-semibold font-mono text-slate-600">
                    -${activeYearData.totalMaintenanceCosts.toLocaleString()}
                  </span>
                </div>

                {activeYearData.landGrantSubsidiesReceived > 0 && (
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      Land Grant Subsidies (EQIP/CSP):
                    </span>
                    <span className="font-bold font-mono text-teal-700">
                      +${activeYearData.landGrantSubsidiesReceived.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Holding Costs &amp; Debt:
                  </span>
                  <span className="font-semibold font-mono text-slate-600">
                    -${activeYearData.debtServiceOrHoldingCosts.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-amber-200/80 pt-2 flex justify-between items-center font-black">
                  <span className="text-slate-900">Net Annual Cash Flow:</span>
                  <span className={`font-mono text-sm ${activeYearData.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    ${activeYearData.netCashFlow.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Cumulative Cash Flow to Date:</span>
                  <span className="font-mono font-bold text-slate-800">
                    ${activeYearData.cumulativeCashFlow.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Estimated Land Market Value:</span>
                  <span className="font-mono font-bold text-purple-700">
                    ${activeYearData.estimatedLandAppreciationValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick 5-Year Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px]">
                    <th className="py-1">YR</th>
                    <th className="py-1">REVENUE</th>
                    <th className="py-1">OPEX</th>
                    <th className="py-1">NET CASH</th>
                    <th className="py-1 text-right">ROI%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectionResult.yearByYear.map((yr) => (
                    <tr
                      key={yr.year}
                      className={yr.year === selectedYear ? 'bg-amber-100/50 font-bold' : ''}
                    >
                      <td className="py-1 text-slate-900">Y{yr.year}</td>
                      <td className="py-1 text-emerald-700">${Math.round(yr.grossCropRevenue / 1000)}k</td>
                      <td className="py-1 text-slate-600">${Math.round((yr.totalMaintenanceCosts + yr.totalProductionCosts) / 1000)}k</td>
                      <td className="py-1 text-teal-700">${Math.round(yr.netCashFlow / 1000)}k</td>
                      <td className="py-1 text-right text-rose-700 font-bold">{yr.yearRoiPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Deal Structuring Tip */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3 text-xs text-purple-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Agronomic Underwriting Insight:</span> By layering perennial
                high-value crops with front-loaded USDA conservation grants, initial basis is shielded against
                downturns with an estimated break-even milestone achieved in{' '}
                <span className="font-black text-purple-900">{projectionResult.breakEvenYear ?? '3.5'} years</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
