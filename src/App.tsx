/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterToolbar } from './components/FilterToolbar';
import { PropertyCard } from './components/PropertyCard';
import { SimpleIndexTable } from './components/SimpleIndexTable';
import { PropertyMap } from './components/PropertyMap';
import { PropertyDossierModal } from './components/PropertyDossierModal';
import { CustomParcelModal } from './components/CustomParcelModal';
import { ComparisonModal } from './components/ComparisonModal';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { LegitimacyReportModal } from './components/LegitimacyReportModal';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { PrivateVaultDrawer } from './components/PrivateVaultDrawer';
import { FilterOptions, InvestmentProperty, LegitimacyValidationReport } from './types/property';
import { generate100Properties } from './utils/propertyGenerator';
import { filterAndSortProperties } from './utils/underwriting';
import { useAuth } from './context/AuthContext';
import {
  Sparkles,
  Gavel,
  Sprout,
  ShieldAlert,
  Layers,
  MapPin,
  TrendingUp,
  RotateCcw,
  Plus,
  ChevronLeft,
  ChevronRight,
  TableProperties,
  ShieldCheck,
  Bot,
  FolderLock,
  Loader2
} from 'lucide-react';

export default function App() {
  const { user, saveValidation } = useAuth();

  // Initialize with full 100 properties catalog
  const [properties, setProperties] = useState<InvestmentProperty[]>(() => generate100Properties());
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-austin-travis', 'prop-sonoma-russian-river']);
  const [selectedForCompareIds, setSelectedForCompareIds] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'grid' | 'table' | 'map' | 'compare'>('grid');
  const [selectedProperty, setSelectedProperty] = useState<InvestmentProperty | null>(null);
  const [isCustomAnalyzerOpen, setIsCustomAnalyzerOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  // Deep Research & Legitimacy Validation State
  const [isValidatingLegitimacy, setIsValidatingLegitimacy] = useState<boolean>(false);
  const [validatingPropertyTitle, setValidatingPropertyTitle] = useState<string>('');
  const [activeLegitimacyReport, setActiveLegitimacyReport] = useState<LegitimacyValidationReport | null>(null);
  const [reportModalProperty, setReportModalProperty] = useState<InvestmentProperty | null>(null);

  // Private Vault & Chatbot Drawers
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');

  // Simple Pagination & Indexing State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    state: '',
    distressTypes: [],
    cropCategories: [],
    businessCategories: [],
    zoningTypes: [],
    minAcreage: 0,
    maxAcreage: 100,
    minPrice: 0,
    maxPrice: 2000000,
    maxLienRisk: 'All',
    soilQualityOnlyPrime: false,
    sortBy: 'cap-rate-high'
  });

  // Fetch from server database on mount
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length >= 100) {
          setProperties(data.data);
        }
      })
      .catch((err) => {
        console.warn('Seeded full 100 properties locally; backend notification:', err);
      });
  }, []);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return filterAndSortProperties(properties, filters);
  }, [properties, filters]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Paginated subset
  const totalPages = Math.ceil(filteredProperties.length / pageSize) || 1;
  const paginatedProperties = useMemo(() => {
    if (pageSize >= 100) return filteredProperties;
    const start = (currentPage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, currentPage, pageSize]);

  // Saved properties list
  const savedProperties = useMemo(() => {
    return properties.filter((p) => savedPropertyIds.includes(p.id));
  }, [properties, savedPropertyIds]);

  // Comparison properties list
  const compareProperties = useMemo(() => {
    return properties.filter((p) => selectedForCompareIds.includes(p.id));
  }, [properties, selectedForCompareIds]);

  const toggleSave = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompareIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleCustomPropertyCreated = (newProp: InvestmentProperty) => {
    setProperties((prev) => [newProp, ...prev]);
    setIsCustomAnalyzerOpen(false);
    setSelectedProperty(newProp);
  };

  // Deep Research & Legitimacy Validation Trigger
  const handleValidateLegitimacy = async (prop: InvestmentProperty) => {
    setIsValidatingLegitimacy(true);
    setValidatingPropertyTitle(prop.title);

    try {
      const response = await fetch('/api/deep-research/validate-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: prop.id,
          propertyData: prop
        })
      });

      const data = await response.json();
      if (data.success && data.report) {
        setActiveLegitimacyReport(data.report);
        setReportModalProperty(prop);
        if (user) {
          saveValidation(data.report);
        }
      } else {
        throw new Error(data.error || 'Failed to generate legitimacy audit');
      }
    } catch (err: any) {
      console.error('Validation error:', err);
    } finally {
      setIsValidatingLegitimacy(false);
      setValidatingPropertyTitle('');
    }
  };

  const handleOpenAdvisorFromReport = (question?: string) => {
    setActiveLegitimacyReport(null);
    if (question) setChatInitialQuestion(question);
    setIsChatbotOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f4] text-slate-900 flex flex-col font-sans selection:bg-rose-300 selection:text-rose-950">
      {/* Top Navbar with Google Sign-in & Vault */}
      <Navbar
        properties={properties}
        savedPropertyIds={savedPropertyIds}
        selectedForCompareIds={selectedForCompareIds}
        activeView={activeView}
        onViewChange={(view) => {
          if (view === 'compare' && selectedForCompareIds.length === 0) {
            if (filteredProperties.length >= 2) {
              setSelectedForCompareIds([filteredProperties[0].id, filteredProperties[1].id]);
            }
          }
          setActiveView(view);
        }}
        onOpenCustomAnalyzer={() => setIsCustomAnalyzerOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenChat={() => setIsChatbotOpen(true)}
      />

      {/* Main Filter Toolbar & Quick Target Presets */}
      <FilterToolbar
        filters={filters}
        onChange={setFilters}
        totalResults={filteredProperties.length}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Simple Indexing Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-xs text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              Showing {pageSize >= 100 ? 1 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredProperties.length)} of {filteredProperties.length} properties
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">
              100 Total Parcels in Master Registry
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Show:</span>
              <button
                onClick={() => {
                  setPageSize(12);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  pageSize === 12
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                12
              </button>
              <button
                onClick={() => {
                  setPageSize(24);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  pageSize === 24
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                24
              </button>
              <button
                onClick={() => {
                  setPageSize(100);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  pageSize >= 100
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All 100
              </button>
            </div>

            {/* Pagination Controls */}
            {pageSize < 100 && totalPages > 1 && (
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-rose-600 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  {totalPages > 6 && <span className="text-slate-400 px-1">...</span>}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 text-slate-600 transition"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* VIEW 1: DEAL GRID */}
        {activeView === 'grid' && (
          <div className="space-y-6">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-amber-200 p-8 space-y-4 shadow-sm">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Properties Matched Active Search</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try broadening your price or acreage sliders, removing crop category filters, or analyze a custom parcel with AI.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        state: '',
                        distressTypes: [],
                        cropCategories: [],
                        businessCategories: [],
                        zoningTypes: [],
                        minAcreage: 0,
                        maxAcreage: 100,
                        minPrice: 0,
                        maxPrice: 2000000,
                        maxLienRisk: 'All',
                        soilQualityOnlyPrime: false,
                        sortBy: 'cap-rate-high'
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>

                  <button
                    onClick={() => setIsCustomAnalyzerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Analyze Custom Parcel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={setSelectedProperty}
                    isSaved={savedPropertyIds.includes(property.id)}
                    onToggleSave={toggleSave}
                    isSelectedForCompare={selectedForCompareIds.includes(property.id)}
                    onToggleCompare={toggleCompare}
                    onValidateLegitimacy={handleValidateLegitimacy}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SIMPLE MASTER INDEX TABLE */}
        {activeView === 'table' && (
          <div className="space-y-4">
            <SimpleIndexTable
              properties={paginatedProperties}
              startIndex={(currentPage - 1) * pageSize}
              onSelectProperty={setSelectedProperty}
              selectedForCompareIds={selectedForCompareIds}
              onToggleCompare={toggleCompare}
              onValidateLegitimacy={handleValidateLegitimacy}
            />
          </div>
        )}

        {/* VIEW 3: SPATIAL MAP */}
        {activeView === 'map' && (
          <PropertyMap
            properties={filteredProperties}
            onSelectProperty={setSelectedProperty}
          />
        )}

        {/* VIEW 4: COMPARISON MATRIX */}
        {activeView === 'compare' && (
          <div className="space-y-4">
            <ComparisonModal
              properties={compareProperties.length > 0 ? compareProperties : filteredProperties.slice(0, 3)}
              onClose={() => setActiveView('grid')}
              onSelectProperty={setSelectedProperty}
              onRemoveFromCompare={(id) =>
                setSelectedForCompareIds((prev) => prev.filter((pId) => pId !== id))
              }
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200/80 text-slate-500 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 font-serif">TerraYield AI</span>
            <span className="text-slate-500">— 100-Property Agro-Forestry, Land Grants &amp; Deep Research Legitimacy Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-slate-500 font-medium">
            <span>🌴 South Florida Redland Fruit Belts</span>
            <span>•</span>
            <span>🌺 Hawaii Volcanic Terroir</span>
            <span>•</span>
            <span>USDA NRCS Soil Survey</span>
            <span>•</span>
            <span>Grounded via Google Search &amp; Maps</span>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setIsVaultOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-800 border border-amber-300 rounded-2xl shadow-xl hover:bg-amber-50 transition transform hover:-translate-y-0.5 text-xs font-bold"
          title="Open Private Due Diligence Vault"
        >
          <FolderLock className="w-4 h-4 text-amber-600" />
          <span>Private Vault</span>
        </button>

        <button
          onClick={() => setIsChatbotOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 hover:from-amber-500 hover:to-rose-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 text-xs font-extrabold cursor-pointer"
          title="Open AI Land Copilot Chat"
        >
          <Bot className="w-5 h-5 text-amber-200 animate-bounce" />
          <span>AI Land Copilot</span>
        </button>
      </div>

      {/* Loading Overlay during Deep Research Validation */}
      {isValidatingLegitimacy && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-amber-200">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                Privately Validating Parcel
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1 line-clamp-2">
                {validatingPropertyTitle || 'Investment Parcel'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Synthesizing county court dockets, super-priority surviving tax liens, NRCS soil cation exchange capacity (CEC), and Google Maps spatial access...
            </p>
          </div>
        </div>
      )}

      {/* Full Property Dossier Modal */}
      {selectedProperty && (
        <PropertyDossierModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onValidateLegitimacy={handleValidateLegitimacy}
          onOpenChat={(q) => {
            if (q) setChatInitialQuestion(q);
            setIsChatbotOpen(true);
          }}
        />
      )}

      {/* Custom Parcel AI Scout Modal */}
      {isCustomAnalyzerOpen && (
        <CustomParcelModal
          onClose={() => setIsCustomAnalyzerOpen(false)}
          onPropertyCreated={handleCustomPropertyCreated}
        />
      )}

      {/* Saved Properties Watchlist Modal */}
      {isSavedModalOpen && (
        <SavedPropertiesModal
          savedProperties={savedProperties}
          onClose={() => setIsSavedModalOpen(false)}
          onSelectProperty={setSelectedProperty}
          onRemoveSaved={(id) => toggleSave(id)}
          onCompareAll={() => {
            setSelectedForCompareIds(savedPropertyIds);
            setActiveView('compare');
          }}
        />
      )}

      {/* Legitimacy Report Modal */}
      {activeLegitimacyReport && reportModalProperty && (
        <LegitimacyReportModal
          report={activeLegitimacyReport}
          property={reportModalProperty}
          onClose={() => {
            setActiveLegitimacyReport(null);
            setReportModalProperty(null);
          }}
          onOpenAdvisorChat={handleOpenAdvisorFromReport}
        />
      )}

      {/* Private Due Diligence Vault Drawer */}
      <PrivateVaultDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        properties={properties}
        onOpenReport={handleValidateLegitimacy}
        onSelectProperty={setSelectedProperty}
      />

      {/* AI Land Copilot Multi-Turn Chatbot Drawer */}
      <ChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        properties={properties}
        activeProperty={selectedProperty}
        onSelectProperty={setSelectedProperty}
        initialQuestion={chatInitialQuestion}
      />
    </div>
  );
}
