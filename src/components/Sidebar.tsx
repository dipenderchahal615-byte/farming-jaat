import { useState } from 'react';
import { ChatSession, Language, TRANSLATIONS } from '../types';
import { Sprout, MessageSquarePlus, Trash2, Leaf, Globe2 } from 'lucide-react';

interface SidebarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onClearSessions: () => void;
}

const REGIONS: Record<Language, Record<string, string>> = {
  en: {
    north: "North India (PB, HR, UP)",
    south: "South India (AP, TS, TN, KA)",
    west: "West & Central (MH, GJ, MP)",
    east: "East India (BH, WB, OD)"
  },
  hi: {
    north: "उत्तर भारत (पंजाब, हरियाणा, यूपी)",
    south: "दक्षिण भारत (आंध्र, तेलंगाना, कर्नाटक)",
    west: "पश्चिम व मध्य भारत (महा., गुज., एमपी)",
    east: "पूर्वी भारत (बिहार, बंगाल, ओडिशा)"
  },
  pa: {
    north: "ਉੱਤਰੀ ਭਾਰਤ (ਪੰਜਾਬ, ਹਰਿਆਣਾ, ਯੂ.ਪੀ.)",
    south: "ਦੱਖਣੀ ਭਾਰਤ (ਆਂਧਰਾ, ਤੇਲੰਗਾਨਾ, ਕਰਨਾਟਕ)",
    west: "ਪੱਛਮੀ ਤੇ ਮੱਧ ਭਾਰਤ (ਮਹਾਰਾਸ਼ਟਰ, ਗੁਜਰਾਤ)",
    east: "ਪੂਰਬੀ ਭਾਰਤ (ਬਿਹਾਰ, ਬੰਗਾਲ, ਉੜੀਸਾ)"
  }
};

const SEASONS: Record<Language, Record<string, string>> = {
  en: {
    kharif: "Kharif (Monsoon/Rainy)",
    rabi: "Rabi (Winter Season)",
    zaid: "Zaid (Summer/Short crop)"
  },
  hi: {
    kharif: "खरीफ (मानसून/वर्षा ऋतु)",
    rabi: "रबी (शीतकालीन/सर्दी ऋतु)",
    zaid: "जायद (गर्मी की अल्पावधि फसलें)"
  },
  pa: {
    kharif: "ਖ਼ਰੀਫ਼ (ਸੌਣੀ/ਮੀਂਹ ਦਾ ਮੌਸਮ)",
    rabi: "ਹਾੜੀ (ਸਿਆਲ/ਸਰਦੀਆਂ ਦਾ ਮੌਸਮ)",
    zaid: "ਜ਼ੈਦ (ਹਾੜੀ-ਸੌਣੀ ਵਿਚਕਾਰਲੀਆਂ ਫ਼ਸਲਾਂ)"
  }
};

export default function Sidebar({
  language,
  setLanguage,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onClearSessions
}: SidebarProps) {
  const [region, setRegion] = useState(() => localStorage.getItem('farmer_region') || 'north');
  const [season, setSeason] = useState(() => localStorage.getItem('farmer_season') || 'kharif');

  const t = TRANSLATIONS[language];

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    localStorage.setItem('farmer_region', newRegion);
  };

  const handleSeasonChange = (newSeason: string) => {
    setSeason(newSeason);
    localStorage.setItem('farmer_season', newSeason);
  };

  return (
    <aside className="w-full lg:w-80 sidebar-blur border-r border-emerald-900/40 text-slate-200 flex flex-col h-full overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-emerald-900/40 flex items-center justify-between bg-black/35">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-emerald-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-center logo-glow relative border border-amber-300">
            <Sprout className="w-5 h-5 text-amber-100 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-sm text-white leading-tight flex items-center gap-1">
              Kisan Mitra
              <span className="text-[8px] bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 px-1 py-0.5 rounded font-black tracking-tight border border-amber-300">PRO</span>
            </h1>
            <p className="text-[9px] text-amber-400 font-bold tracking-wide font-mono uppercase mt-0.5">
              ✨ {t.appSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Segmented Language Selector */}
      <div className="px-4 py-2 border-b border-emerald-900/30">
        <label className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider font-mono flex items-center gap-1 mb-1.5">
          <Globe2 className="w-3.5 h-3.5 text-amber-500" />
          {t.language}
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-emerald-950/50">
          <button
            onClick={() => setLanguage('hi')}
            className={`py-1 px-1.5 text-[11px] font-bold transition-all rounded-lg cursor-pointer text-center ${
              language === 'hi'
                ? 'bg-amber-500 text-emerald-950 shadow-md border border-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/45'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('pa')}
            className={`py-1 px-1.5 text-[11px] font-bold transition-all rounded-lg cursor-pointer text-center ${
              language === 'pa'
                ? 'bg-amber-500 text-emerald-950 shadow-md border border-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/45'
            }`}
          >
            ਪੰਜਾਬੀ
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`py-1 px-1.5 text-[11px] font-bold transition-all rounded-lg cursor-pointer text-center ${
              language === 'en'
                ? 'bg-amber-500 text-emerald-950 shadow-md border border-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/45'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Region Selector */}
      <div className="px-4 py-2 border-b border-emerald-900/30">
        <label className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider font-mono flex items-center gap-1 mb-1.5">
          📍 {language === 'hi' ? 'क्षेत्र' : language === 'pa' ? 'ਖੇਤਰ' : 'Region'}
        </label>
        <select
          value={region}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="w-full bg-black/40 text-slate-100 border border-emerald-900/50 py-1.5 px-2.5 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 outline-none font-sans cursor-pointer focus:border-amber-400"
        >
          <option value="north" className="bg-emerald-950 text-slate-100">{REGIONS[language].north}</option>
          <option value="south" className="bg-emerald-950 text-slate-100">{REGIONS[language].south}</option>
          <option value="west" className="bg-emerald-950 text-slate-100">{REGIONS[language].west}</option>
          <option value="east" className="bg-emerald-950 text-slate-100">{REGIONS[language].east}</option>
        </select>
      </div>

      {/* Season Selector */}
      <div className="px-4 py-2 border-b border-emerald-900/30">
        <label className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider font-mono flex items-center gap-1 mb-1.5">
          🌾 {language === 'hi' ? 'सीज़न' : language === 'pa' ? 'ਸੀਜ਼ਨ' : 'Season'}
        </label>
        <select
          value={season}
          onChange={(e) => handleSeasonChange(e.target.value)}
          className="w-full bg-black/40 text-slate-100 border border-emerald-900/50 py-1.5 px-2.5 rounded-xl text-xs focus:ring-1 focus:ring-amber-500 outline-none font-sans cursor-pointer focus:border-amber-400"
        >
          <option value="kharif" className="bg-emerald-950 text-slate-100">{SEASONS[language].kharif}</option>
          <option value="rabi" className="bg-emerald-950 text-slate-100">{SEASONS[language].rabi}</option>
          <option value="zaid" className="bg-emerald-950 text-slate-100">{SEASONS[language].zaid}</option>
        </select>
      </div>

      {/* Primary Actions */}
      <div className="p-4 shrink-0">
        <button
          onClick={onCreateSession}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-emerald-950/40 cursor-pointer border border-emerald-500/30 hover:border-emerald-400/50"
        >
          <MessageSquarePlus className="w-4 h-4 text-emerald-100" />
          {t.newChat}
        </button>
      </div>

      {/* Scrollable Middle Column: Chat History */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="flex items-center justify-between mb-2 pt-2">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
            {t.history}
          </span>
          {sessions.length > 0 && (
            <button
              onClick={onClearSessions}
              className="text-[9px] text-slate-500 hover:text-red-400 transition-colors flex items-center gap-0.5"
              title={t.clearHistory}
            >
              <Trash2 className="w-3 h-3" />
              {t.clearHistory}
            </button>
          )}
        </div>

        <div className="space-y-1 pr-1">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                id={`session-${sess.id}`}
                className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0d4331] border border-emerald-600 text-white shadow-sm'
                    : 'border border-emerald-950/20 bg-emerald-950/25 hover:bg-[#073021] text-emerald-200 hover:text-white'
                }`}
                onClick={() => onSelectSession(sess.id)}
              >
                <div className="flex items-center gap-2 truncate pr-6">
                  <Leaf className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-emerald-600'}`} />
                  <span className="truncate leading-tight font-medium font-sans">
                    {sess.title}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(sess.id);
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 text-emerald-400 hover:text-red-400 transition-opacity p-0.5 rounded hover:bg-emerald-900/30 cursor-pointer"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="text-center py-6 px-4 bg-emerald-950/20 border border-emerald-900/35 rounded-xl">
              <p className="text-[11px] text-emerald-500 font-medium font-mono">
                {t.noHistory}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simple Legal/Agricultural Footer */}
      <div className="p-3 bg-emerald-950 border-t border-emerald-900/15 text-center text-[9px] text-emerald-600/70 font-mono tracking-wide leading-tight mt-auto">
        &copy; 2026 FARMING AI GPT COOPERATIVE
      </div>
    </aside>
  );
}
