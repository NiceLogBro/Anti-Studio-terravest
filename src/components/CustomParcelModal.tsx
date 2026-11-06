import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  DollarSign,
  Gavel,
  TreePine,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building,
  HelpCircle
} from 'lucide-react';
import { DistressType, InvestmentProperty } from '../types/property';

interface CustomParcelModalProps {
  onClose: () => void;
  onPropertyCreated: (newProp: InvestmentProperty) => void;
}

export const CustomParcelModal: React.FC<CustomParcelModalProps> = ({
  onClose,
  onPropertyCreated,
}) => {
  const [address, setAddress] = useState('21400 SW 248th Street');
  const [city, setCity] = useState('Homestead');
  const [county, setCounty] = useState('Miami-Dade County');
  const [state, setState] = useState('FL');
  const [zipCode, setZipCode] = useState('33031');
  const [acreage, setAcreage] = useState<number>(10.0);
  const [price, setPrice] = useState<number>(260000);
  const [distressType, setDistressType] = useState<DistressType>('Tax Lien Certificate');
  const [currentUse, setCurrentUse] = useState('Abandoned Tropical Grove & Nursery');
  const [notes, setNotes] = useState(
    'Redland agricultural belt; former dragon fruit and lychee grove. Looking to evaluate exotic agro-tourism and high-margin tropical fruit yields.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [statusStep, setStatusStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!address || !county || !state || price <= 0 || acreage <= 0) {
      setErrorMsg('Please enter valid address, county, state, acreage, and price.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setStatusStep('Scouting satellite parcel coordinates & county deed records...');

    try {
      const stepTimer1 = setTimeout(() => {
        setStatusStep('Classifying USDA NRCS Soil Survey & hardiness zone...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setStatusStep('Analyzing county zoning bylaws & conditional use permits...');
      }, 3000);

      const stepTimer3 = setTimeout(() => {
        setStatusStep('Synthesizing high-ROI unique business models & grounding citings...');
      }, 4500);

      const response = await fetch('/api/analyze-custom-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          city,
          county,
          state,
          zipCode,
          acreage,
          price,
          distressType,
          currentUse,
          notes,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();
      if (data.success && data.property) {
        setStatusStep('Evaluation complete! Launching Property Dossier...');
        setTimeout(() => {
          onPropertyCreated(data.property);
        }, 600);
      } else {
        setErrorMsg(data.error || 'Failed to complete AI property evaluation.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while contacting AI evaluation server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-emerald-100 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Analyze Any Custom Parcel or Address
              </h3>
              <p className="text-xs text-slate-500">
                AI evaluates soil taxonomy, tropical food crops, zoning bylaws, and unique local business models with citings.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-2xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAnalyze} className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Street Address / Parcel APN</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 21400 SW 248th Street or APN 30-6812-000-0120"
                required
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">City / Township</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Homestead"
                required
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">County &amp; State</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="e.g. Miami-Dade County"
                  required
                  disabled={isLoading}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="FL"
                  maxLength={2}
                  required
                  disabled={isLoading}
                  className="w-16 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-center text-slate-900 placeholder-slate-400 focus:outline-none uppercase font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Total Acreage</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                placeholder="10.0"
                required
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Asking Price or Opening Bid ($)</label>
              <input
                type="number"
                step="5000"
                min="1000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="260000"
                required
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Distress Category</label>
              <select
                value={distressType}
                onChange={(e) => setDistressType(e.target.value as DistressType)}
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Sheriff Foreclosure Auction">Sheriff Foreclosure Auction</option>
                <option value="Tax Lien Certificate">Tax Lien Certificate</option>
                <option value="Tax Deed Sale">Tax Deed Sale</option>
                <option value="Bank-Owned REO">Bank-Owned REO</option>
                <option value="Pre-Foreclosure / Short Sale">Pre-Foreclosure / Short Sale</option>
                <option value="Probate / Estate Distress">Probate / Estate Distress</option>
                <option value="Distressed Value-Add Land">Distressed Value-Add Land</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Current Use / Land Condition</label>
              <input
                type="text"
                value={currentUse}
                onChange={(e) => setCurrentUse(e.target.value)}
                placeholder="e.g. Overgrown Tropical Grove, Abandoned Nursery"
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Investor Goals &amp; Local Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Target crops (e.g. Dragon fruit, Coffee, Vanilla), tourism highway access, or storage..."
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Loading Animation States */}
          {isLoading && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>AI Agro-Intelligence Engine Active</span>
              </div>
              <p className="text-emerald-800 text-[11px] font-mono">{statusStep}</p>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleAnalyze(e)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run AI Evaluation &amp; Find Citings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
