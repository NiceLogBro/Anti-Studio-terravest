import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  ExternalLink,
  ChevronDown,
  Layers,
  ShieldCheck,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { InvestmentProperty, ChatMessage } from '../types/property';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  properties: InvestmentProperty[];
  activeProperty?: InvestmentProperty | null;
  onSelectProperty?: (property: InvestmentProperty) => void;
  initialQuestion?: string;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  properties,
  activeProperty,
  onSelectProperty,
  initialQuestion
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: `Hello! I am your **TerraYield AI Land Copilot**.\n\nI can analyze **survival-lien underwriting**, check **USDA EQIP & REAP land grant eligibility**, audit **NRCS soil chemistry & CEC**, and evaluate **local business cash flows**.\n\nSelect a property above or ask any question to get started.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(activeProperty ? activeProperty.id : '');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeProperty) {
      setSelectedPropertyId(activeProperty.id);
    }
  }, [activeProperty]);

  useEffect(() => {
    if (initialQuestion && isOpen) {
      setInputText(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const currentProp = properties.find((p) => p.id === selectedPropertyId);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          propertyContext: currentProp ? {
            title: currentProp.title,
            apn: currentProp.parcelIdAPN,
            county: currentProp.county,
            state: currentProp.state,
            acreage: currentProp.acreage,
            distressType: currentProp.distressType,
            askingOrBid: currentProp.financials.askingOrOpeningBid,
            arv: currentProp.financials.estimatedARV,
            liens: currentProp.liens,
            soil: currentProp.soil,
            suitableCrops: currentProp.suitableCrops,
            zoning: currentProp.zoning,
            grants: currentProp.eligibleLandGrants
          } : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed,
          sources: data.sources
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Error: ${err.message || 'Unable to communicate with Land Copilot'}. Please check your network or try a different query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Validate surviving senior liens vs wiped junior debt',
    'What USDA land grants apply to this property?',
    'Evaluate NRCS soil CEC & crop suitability',
    'Explain zoning setbacks & permitted agritourism'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-amber-200 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-800 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
            <Bot className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">TerraYield AI Land Copilot</h3>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                MULTI-TURN
              </span>
            </div>
            <p className="text-[11px] text-amber-100">Agricultural & Distressed Due Diligence</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          title="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Model & Property Selector Bar */}
      <div className="p-3 bg-amber-50/70 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Model Selector */}
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-rose-600" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            className="p-1 px-2 text-[11px] font-bold bg-white border border-amber-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (General / Deep)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
            <option value="gemini-4-argon">gemini-4-argon (Complex Reasoning)</option>
          </select>
        </div>

        {/* Property Focus Selector */}
        <div className="flex items-center gap-1 max-w-[200px]">
          <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <select
            value={selectedPropertyId}
            onChange={(e) => {
              setSelectedPropertyId(e.target.value);
              const found = properties.find((p) => p.id === e.target.value);
              if (found && onSelectProperty) onSelectProperty(found);
            }}
            className="p-1 px-1.5 text-[11px] font-medium bg-white border border-amber-300 rounded-lg text-slate-800 truncate focus:outline-none"
          >
            <option value="">(No active parcel focus)</option>
            {properties.slice(0, 50).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Parcel Context Badge */}
      {currentProp && (
        <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border-b border-amber-200 text-xs flex items-center justify-between">
          <span className="font-bold text-slate-800 truncate text-[11px]">
            Focused: <span className="text-rose-700">{currentProp.title}</span>
          </span>
          <span className="text-[10px] font-bold text-slate-600 shrink-0">
            ${currentProp.financials.askingOrOpeningBid.toLocaleString()}
          </span>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-rose-600 to-purple-700 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line space-y-2">
                {msg.content}
              </div>

              {/* Citations / Grounding sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Grounded Sources (Live Search)
                  </span>
                  <div className="space-y-1">
                    {msg.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url || s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between text-[11px] text-purple-700 hover:text-purple-900 font-semibold truncate hover:underline"
                      >
                        <span className="truncate">{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-1 text-[10px] opacity-60">
                <span>{msg.timestamp}</span>
                {msg.modelUsed && <span>{msg.modelUsed}</span>}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                <UserIcon className="w-4 h-4 text-amber-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 rounded-bl-none flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>Analyzing parcel title, NRCS soil taxonomy & grants...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 font-medium whitespace-nowrap transition border border-slate-200 shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about liens, zoning, crops, land grants..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 disabled:opacity-40 text-white rounded-xl shadow-md transition"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
