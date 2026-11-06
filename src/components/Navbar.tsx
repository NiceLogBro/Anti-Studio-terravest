import {
  TrendingUp,
  MapPin,
  Sparkles,
  Layers,
  Scale,
  Bookmark,
  Gavel,
  Sprout,
  TableProperties,
  ShieldCheck,
  Bot,
  User as UserIcon,
  LogIn,
  FolderLock
} from 'lucide-react';
import { InvestmentProperty } from '../types/property';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  properties: InvestmentProperty[];
  savedPropertyIds: string[];
  selectedForCompareIds: string[];
  activeView: 'grid' | 'table' | 'map' | 'compare';
  onViewChange: (view: 'grid' | 'table' | 'map' | 'compare') => void;
  onOpenCustomAnalyzer: () => void;
  onOpenSavedModal: () => void;
  onOpenVault: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  properties,
  savedPropertyIds,
  selectedForCompareIds,
  activeView,
  onViewChange,
  onOpenCustomAnalyzer,
  onOpenSavedModal,
  onOpenVault,
  onOpenChat
}) => {
  const { user, signIn, logOut, validations } = useAuth();

  const avgDiscount = properties.length
    ? (
        properties.reduce((acc, p) => acc + p.financials.equitySpreadDiscount, 0) /
        properties.length
      ).toFixed(1)
    : '0';

  const highestCapRate = properties.length
    ? Math.max(...properties.map((p) => p.financials.capRate)).toFixed(1)
    : '0';

  const auctionCount = properties.filter((p) =>
    p.distressType.includes('Auction') || p.distressType.includes('Sale')
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-sm text-slate-800">
      {/* Top Banner / Tropical Sunset Market Ticker */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-50 font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
          <span className="font-black text-amber-200 tracking-wide uppercase text-[11px] flex items-center gap-1">
            🌅 SUNSET-RADAR:
          </span>
          <span>{properties.length} investment parcels indexed across South Florida, Hawaii &amp; US Agronomic Belts</span>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
            <span className="text-amber-200">Due Diligence:</span>
            <span className="font-bold text-white font-mono">{validations.length} Privately Audited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-200">🏛️ Land Grants:</span>
            <span className="font-bold text-white font-mono">$98.4M Tracked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>Avg Discount:</span>
            <span className="font-bold text-white font-mono">{avgDiscount}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-200" />
            <span>Top Cap Rate:</span>
            <span className="font-bold text-white font-mono">{highestCapRate}%</span>
          </div>
        </div>

        <div className="text-amber-100 text-[11px] font-medium hidden sm:block">
          🌴 USDA NRCS Soil Taxonomy &amp; Deep Research Validation
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand identity in vibrant tropical sunset styling */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md shadow-rose-500/25 ring-2 ring-amber-200 shrink-0">
            <Sprout className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 font-serif">
                Terra<span className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">Yield</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-100 to-rose-100 text-rose-900 border border-rose-200">
                100 Properties
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              Agro-Forestry, Land Grants, Distressed Liens &amp; Deep Research Legitimacy
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="hidden lg:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onViewChange('grid')}
            aria-label="Visual Deal Cards"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'grid'
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => onViewChange('table')}
            aria-label="Simple Index Table"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'table'
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5 text-teal-600" />
            <span>Index Directory</span>
          </button>

          <button
            onClick={() => onViewChange('map')}
            aria-label="Spatial Geographic Map"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'map'
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Map</span>
          </button>

          <button
            onClick={() => onViewChange('compare')}
            aria-label="Compare selected properties"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeView === 'compare'
                ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-cyan-600" />
            <span>Compare</span>
            {selectedForCompareIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 text-white font-bold">
                {selectedForCompareIds.length}
              </span>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Copilot Toggle */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition shadow-xs"
            title="Open Gemini AI Land Copilot"
          >
            <Bot className="w-4 h-4 text-purple-700" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>

          {/* Private Vault Button */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition shadow-xs relative"
            title="Open Private Due Diligence Vault"
          >
            <FolderLock className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Private Vault</span>
            {validations.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-600 text-white font-bold">
                {validations.length}
              </span>
            )}
          </button>

          {/* Custom Analyzer */}
          <button
            onClick={onOpenCustomAnalyzer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-md shadow-rose-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">Analyze Parcel</span>
          </button>

          {/* Google Sign-in / User Profile */}
          {user ? (
            <button
              onClick={onOpenVault}
              className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-xs"
              title={`Logged in as ${user.email}`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="font-semibold text-slate-800 hidden xl:inline truncate max-w-[100px]">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs"
              title="Sign in with Google"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

