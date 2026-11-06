import React from 'react';
import {
  X,
  Bookmark,
  MapPin,
  TrendingUp,
  ArrowRight,
  Trash2,
  Scale
} from 'lucide-react';
import { InvestmentProperty } from '../types/property';

interface SavedPropertiesModalProps {
  savedProperties: InvestmentProperty[];
  onClose: () => void;
  onSelectProperty: (prop: InvestmentProperty) => void;
  onRemoveSaved: (propId: string) => void;
  onCompareAll: () => void;
}

export const SavedPropertiesModal: React.FC<SavedPropertiesModalProps> = ({
  savedProperties,
  onClose,
  onSelectProperty,
  onRemoveSaved,
  onCompareAll,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-emerald-100 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
            <h3 className="text-base font-bold text-slate-900">
              Saved Investment Watchlist ({savedProperties.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-2xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
          {savedProperties.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-white p-8 rounded-2xl border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">
                You haven't bookmarked any investment properties yet. Click the bookmark icon on any property card or index row to track it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-300 shadow-xs hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-20 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300">
                        {prop.distressType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                        {prop.title}
                      </h4>
                      <div className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{prop.city}, {prop.county}, {prop.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-slate-900">
                        ${prop.financials.askingOrOpeningBid.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-extrabold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        {prop.financials.capRate}% Cap
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProperty(prop);
                        }}
                        className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRemoveSaved(prop.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 1 && (
          <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              {savedProperties.length} properties saved
            </span>
            <button
              onClick={() => {
                onClose();
                onCompareAll();
              }}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare All Saved</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
