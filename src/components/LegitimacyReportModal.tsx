import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Dna,
  Scale,
  MapPin,
  ExternalLink,
  CheckCircle2,
  BookmarkCheck,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
  Search,
  Globe2,
  Layers,
  FlaskConical,
  BookOpen
} from 'lucide-react';
import { LegitimacyValidationReport, InvestmentProperty } from '../types/property';
import { useAuth } from '../context/AuthContext';

interface LegitimacyReportModalProps {
  report: LegitimacyValidationReport;
  property: InvestmentProperty;
  onClose: () => void;
  onOpenAdvisorChat?: (initialQuestion?: string) => void;
}

export const LegitimacyReportModal: React.FC<LegitimacyReportModalProps> = ({
  report,
  property,
  onClose,
  onOpenAdvisorChat
}) => {
  const { user, signIn, saveValidation, getValidation } = useAuth();
  const [activeTab, setActiveTab] = useState<'audit' | 'bioscience' | 'checklist' | 'grounding' | 'memo'>('audit');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [privateNotes, setPrivateNotes] = useState('');

  const existingRecord = getValidation(report.propertyId);

  const handleSaveToVault = async () => {
    if (!user) {
      await signIn();
      return;
    }
    setIsSaving(true);
    try {
      await saveValidation(report, privateNotes);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save to vault:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const scoreColor =
    report.legitimacyScore >= 90
      ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
      : report.legitimacyScore >= 80
      ? 'text-amber-700 bg-amber-50 border-amber-300'
      : 'text-rose-700 bg-rose-50 border-rose-300';

  const badgeBg =
    report.verdict === 'VERIFIED_LEGITIMATE'
      ? 'bg-emerald-600 text-white'
      : report.verdict === 'CONDITIONAL_CAUTION'
      ? 'bg-amber-600 text-white'
      : 'bg-rose-600 text-white';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-800 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
              <ShieldCheck className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/25 text-amber-200 border border-amber-300/30">
                  Private Due Diligence Report
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>
                  {report.verdict.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 truncate max-w-lg">
                {property.title}
              </h2>
              <p className="text-xs text-amber-100 flex items-center gap-2 mt-0.5">
                <span>APN: {property.parcelIdAPN}</span>
                <span>•</span>
                <span>{property.county}, {property.state}</span>
                <span>•</span>
                <span>Audited: {new Date(report.verifiedAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToVault}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                existingRecord || saveSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-slate-900 hover:bg-amber-50'
              }`}
            >
              {existingRecord || saveSuccess ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Saved in Private Vault</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <span>{user ? 'Save to Vault' : 'Sign in to Save'}</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score & Verdict Highlight Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 via-rose-50 to-orange-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border font-black text-2xl ${scoreColor}`}>
              <span>{report.legitimacyScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Score / 100</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Official Legitimacy Audit Verdict</p>
              <p className="text-sm text-slate-900 font-semibold max-w-xl">
                {report.summaryVerdictText}
              </p>
            </div>
          </div>

          {onOpenAdvisorChat && (
            <button
              onClick={() => onOpenAdvisorChat(`Explain the title and soil findings for ${property.title}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Land Copilot</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex space-x-1 sm:space-x-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Title & Foreclosure Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('bioscience')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'bioscience'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Dna className="w-4 h-4 text-emerald-600" />
            <span>Bioscience & Soil Chemistry</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>5-Point Check Matrix ({report.checks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grounding')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'grounding'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe2 className="w-4 h-4 text-purple-600" />
            <span>Live Grounded Intel ({report.searchGroundingSources.length + report.mapsGroundingSources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'memo'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Underwriter Memo</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
          {/* TAB 1: Title & Foreclosure Audit */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">County Docket Status</span>
                  <p className="text-base font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{report.titleAudit.countyDocketStatus}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Verified with {property.county} appraisal district cadastre.</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Senior Surviving Liens</span>
                  <p className="text-base font-extrabold text-amber-700 mt-1">
                    {report.titleAudit.survivingSeniorLiensCount} Lien(s) (${report.titleAudit.netSurvivingDebt.toLocaleString()})
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Survives auction; included in estimated clearing basis.</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Extinguished Junior Debt</span>
                  <p className="text-base font-extrabold text-emerald-700 mt-1">
                    {report.titleAudit.wipedJuniorLiensCount} Mortgage(s) Wiped
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Legally eliminated upon confirmed sheriff/deed sale.</p>
                </div>
              </div>

              {/* Title Breakdown Card */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-rose-600" />
                  <span>Survival-Lien Underwriting Breakdown</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.titleAudit.summary}
                </p>

                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-2">Lien Type</th>
                        <th className="p-2">Claimant</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Priority</th>
                        <th className="p-2">Legal Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {property.liens.map((lien, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-slate-900">{lien.lienType}</td>
                          <td className="p-2 text-slate-600">{lien.claimant}</td>
                          <td className="p-2 font-semibold text-slate-900">${lien.amount.toLocaleString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                              {lien.priority}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              lien.status === 'Survives Foreclosure' || lien.status === 'Must Be Cleared'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {lien.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bidding & Equity Spread Guidance */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-700">Recommendation</span>
                <p className="font-bold text-sm text-emerald-950">{report.recommendation}</p>
                <p className="text-emerald-800">
                  Target bid at or below ${(property.financials.askingOrOpeningBid * 1.12).toLocaleString()} maintains an equity spread discount of {property.financials.equitySpreadDiscount}% below estimated ARV of ${property.financials.estimatedARV.toLocaleString()}.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Bioscience & Soil Chemistry */}
          {activeTab === 'bioscience' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-700" />
                    <span>Agronomic Bioscience & Soil Health Audit</span>
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Grounded with NRCS taxonomy, PubChem soil chemistry compounds, and peer-reviewed PubMed citations.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700">CEC Rating</span>
                  <p className="text-xl font-black text-emerald-900">
                    {report.bioscienceSoilAudit.cationExchangeCapacity} <span className="text-xs font-semibold">meq/100g</span>
                  </p>
                </div>
              </div>

              {/* Soil Chemistry Bioavailability Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Nitrogen Bioavailability</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{report.bioscienceSoilAudit.npkBioavailability.nitrogenLevel}</p>
                  <p className="text-xs text-slate-500 mt-1">Critical for early leaf expansion in specialty crops.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Phosphorus (Bray-P1)</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{report.bioscienceSoilAudit.npkBioavailability.phosphorusLevel}</p>
                  <p className="text-xs text-slate-500 mt-1">Stimulates root branching & flowering vitality.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Exchangeable Potassium</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">{report.bioscienceSoilAudit.npkBioavailability.potassiumLevel}</p>
                  <p className="text-xs text-slate-500 mt-1">Elevates fruit brix & pest disease resistance.</p>
                </div>
              </div>

              {/* Trace Micronutrients */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Trace Micronutrient Availability (ppm)</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-semibold">Iron (Fe):</span>
                    <span className="font-extrabold text-slate-900 ml-1.5">{report.bioscienceSoilAudit.micronutrients.ironPpm} ppm</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-semibold">Zinc (Zn):</span>
                    <span className="font-extrabold text-slate-900 ml-1.5">{report.bioscienceSoilAudit.micronutrients.zincPpm} ppm</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-semibold">Manganese (Mn):</span>
                    <span className="font-extrabold text-slate-900 ml-1.5">{report.bioscienceSoilAudit.micronutrients.manganesePpm} ppm</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-semibold">Boron (B):</span>
                    <span className="font-extrabold text-slate-900 ml-1.5">{report.bioscienceSoilAudit.micronutrients.boronPpm} ppm</span>
                  </div>
                </div>
              </div>

              {/* PubChem Soil Chemistry Compounds */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-rose-600" />
                    <span>Scientific PubChem Nutrient Compounds</span>
                  </h5>
                  <span className="text-[10px] text-slate-400">NIH National Library of Medicine</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.bioscienceSoilAudit.pubChemCompounds.map((comp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">{comp.name}</span>
                        <a
                          href={`https://pubchem.ncbi.nlm.nih.gov/compound/${comp.cid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                        >
                          <span>CID {comp.cid}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500">{comp.formula}</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{comp.agronomicRole}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PubMed Peer-Reviewed Citations */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                    <span>Peer-Reviewed Agronomy Citations (PubMed)</span>
                  </h5>
                  <span className="text-[10px] text-slate-400">NCBI Entrez Literature</span>
                </div>
                <div className="space-y-3">
                  {report.bioscienceSoilAudit.pubMedCitations.map((cit, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900 leading-snug">{cit.title}</span>
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${cit.pmid}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5"
                        >
                          <span>PMID {cit.pmid}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="text-[10px] text-slate-500">{cit.journal} ({cit.year})</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{cit.finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 5-Point Check Matrix */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Detailed assessment across legal title, surviving debt, NRCS soil taxonomy, physical road access, and legal notice requirements.
              </p>

              <div className="space-y-3">
                {report.checks.map((chk, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 transition ${
                      chk.status === 'PASSED'
                        ? 'bg-white border-slate-200'
                        : chk.status === 'WARNING'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {chk.status === 'PASSED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}
                        <span className="font-extrabold text-slate-900">{chk.item}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        chk.status === 'PASSED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {chk.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">{chk.category}</span>
                    <p className="text-slate-600 leading-relaxed">{chk.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Live Grounded Intelligence */}
          {activeTab === 'grounding' && (
            <div className="space-y-6">
              {/* Google Search Grounding Section */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-4 h-4 text-rose-600" />
                    <span>Google Search Grounding (Live County Records & Auction Notices)</span>
                  </h4>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">gemini-3.8-flash</span>
                </div>
                <p className="text-xs text-slate-600">
                  Search-grounded public notices verifying court foreclosure orders, statutory redemption legalities, and municipal code enforcement filings.
                </p>

                <div className="space-y-2 pt-1">
                  {report.searchGroundingSources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs transition group"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-rose-600 line-clamp-1">{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Google Maps Grounding Section */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>Google Maps Grounding (Verified Regional Infrastructure)</span>
                  </h4>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">gemini-3.8-flash</span>
                </div>
                <p className="text-xs text-slate-600">
                  Proximity verification to USDA Farm Service Agency centers, county deed recorders, and farm supply cooperatives.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {report.mapsGroundingSources.map((mapSrc, i) => (
                    <a
                      key={i}
                      href={mapSrc.uri}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-lg bg-slate-50 hover:bg-purple-50 border border-slate-200 text-xs transition group space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 group-hover:text-purple-700">{mapSrc.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 shrink-0" />
                      </div>
                      {mapSrc.address && <p className="text-[11px] text-slate-500">{mapSrc.address}</p>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Executive Underwriting Memo */}
          {activeTab === 'memo' && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-xs leading-relaxed text-slate-800 space-y-4 whitespace-pre-line font-mono">
                {report.detailedMemo}
              </div>

              {/* Private Notes Field */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <label className="text-xs font-bold text-slate-700">Add Private Investor Notes (Saved to your Firebase Vault)</label>
                <textarea
                  value={privateNotes}
                  onChange={(e) => setPrivateNotes(e.target.value)}
                  placeholder="Enter private bid notes, title binder escrow conditions, attorney comments..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  onClick={handleSaveToVault}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                >
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved to Private Vault!' : 'Save Notes to Vault'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Private Vault storage via Firebase Firestore.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
