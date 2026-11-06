import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Bookmark,
  Trash2,
  ExternalLink,
  Lock,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { InvestmentProperty } from '../types/property';

interface PrivateVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  properties: InvestmentProperty[];
  onOpenReport: (property: InvestmentProperty) => void;
  onSelectProperty: (property: InvestmentProperty) => void;
}

export const PrivateVaultDrawer: React.FC<PrivateVaultDrawerProps> = ({
  isOpen,
  onClose,
  properties,
  onOpenReport,
  onSelectProperty
}) => {
  const { user, signIn, logOut, validations, savedProperties, removeValidation, toggleSave } = useAuth();
  const [activeTab, setActiveTab] = useState<'validations' | 'watchlist'>('validations');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-amber-200 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-800 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
            <FolderLock className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">Private Due Diligence Vault</h3>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                FIRESTORE
              </span>
            </div>
            <p className="text-[11px] text-amber-100">
              {user ? `Logged in as ${user.email}` : 'Private encrypted investor vault'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          title="Close vault"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Auth Banner if not logged in */}
      {!user ? (
        <div className="p-6 bg-gradient-to-b from-amber-50 to-orange-50 text-center space-y-4 border-b border-amber-200">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">Sign In to Save Private Reports</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
              Your property legitimacy audits, survival-lien notes, and custom parcel models persist privately in Firebase Firestore under your account.
            </p>
          </div>
          <button
            onClick={signIn}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Synced with Firestore database</span>
          </div>
          <button
            onClick={logOut}
            className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
          >
            Sign out
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 border-b border-slate-200 bg-white flex space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('validations')}
          className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'validations'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privately Validated ({validations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'watchlist'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Watchlist ({savedProperties.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {activeTab === 'validations' && (
          <>
            {validations.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No Validated Properties Yet</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click "Validate Legitimacy" on any parcel card to run deep research and save the private title & soil audit here.
                </p>
              </div>
            ) : (
              validations.map((v) => {
                const matchedProp = properties.find((p) => p.id === v.propertyId);
                return (
                  <div
                    key={v.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.legitimacyScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            Score: {v.legitimacyScore}/100
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {new Date(v.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
                          {v.propertyTitle}
                        </h4>
                      </div>

                      <button
                        onClick={() => removeValidation(v.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {v.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg line-clamp-2">
                        {v.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {matchedProp && (
                        <button
                          onClick={() => {
                            onSelectProperty(matchedProp);
                            onOpenReport(matchedProp);
                          }}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                        >
                          <span>Open Full Audit Dossier</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'watchlist' && (
          <>
            {savedProperties.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Bookmark className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">Watchlist Empty</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Click the bookmark ribbon on any parcel to pin it to your private investor watchlist.
                </p>
              </div>
            ) : (
              savedProperties.map((sp) => {
                const matchedProp = properties.find((p) => p.id === sp.propertyId);
                return (
                  <div
                    key={sp.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                          {sp.distressType}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                          {sp.propertyTitle}
                        </h4>
                      </div>

                      <button
                        onClick={() => {
                          if (matchedProp) toggleSave(matchedProp);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 text-slate-700">
                      <span>Bid: <strong className="text-slate-900">${sp.askingOrOpeningBid.toLocaleString()}</strong></span>
                      <span>ARV: <strong className="text-emerald-700">${sp.estimatedARV.toLocaleString()}</strong></span>
                    </div>

                    {matchedProp && (
                      <button
                        onClick={() => {
                          onSelectProperty(matchedProp);
                          onClose();
                        }}
                        className="w-full mt-1 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] transition"
                      >
                        View Parcel Details
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};
