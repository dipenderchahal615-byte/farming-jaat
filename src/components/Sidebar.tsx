import { useState } from 'react';
import { ChatSession, Language, TRANSLATIONS } from '../types';
import MandiWidget from './MandiWidget';
import FertilizerCalc from './FertilizerCalc';
import { Sprout, MessageSquarePlus, Trash2, CloudSun, Leaf, Globe2, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showMandi, setShowMandi] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const t = TRANSLATIONS[language];

  // Pick a simulated weather conseil depending on today's simulated context
  const getWeatherAdvice = () => {
    const hours = new Date().getHours();
    if (hours < 10) return { temp: "22°C", text: t.weatherMild, icon: "🌤️" };
    if (hours < 17) return { temp: "34°C", text: t.weatherHot, icon: "☀️" };
    return { temp: "26°C", text: t.weatherRain, icon: "🌦️" };
  };

  const weather = getWeatherAdvice();

  return (
    <aside className="w-full lg:w-80 sidebar-blur border-r border-emerald-900/40 text-slate-200 flex flex-col h-full overflow-hidden select-none">
      {/* Brand Header */}
      <div className="p-4.5 border-b border-emerald-900/40 flex items-center justify-between bg-black/35">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-emerald-600 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-center logo-glow relative border-2 border-amber-300">
            <Sprout className="w-6 h-6 text-amber-100 stroke-[2.5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 via-white to-green-600 border border-amber-950/20 rounded-full flex items-center justify-center text-[9px] text-white select-none shadow-md">
              🇮🇳
            </div>
          </div>
          <div>
            <h1 className="font-sans font-extrabold text-base text-white leading-tight flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              Kisan Mitra
              <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 px-1 py-0.5 rounded font-black tracking-tight border border-amber-300">PRO</span>
            </h1>
            <p className="text-[10px] text-amber-400 font-bold tracking-wide font-mono uppercase mt-0.5 flex items-center gap-1">
              ✨ {t.appSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Language Selector Segment */}
      <div className="px-4 py-3 border-b border-emerald-900/20 bg-emerald-950/20">
        <div className="flex items-center gap-1.5 justify-between">
          <span className="text-[10px] text-emerald-400 capitalize font-bold flex items-center gap-1 font-mono tracking-wide">
            <Globe2 className="w-3.5 h-3.5" />
            {t.language}
          </span>
          <div className="flex bg-emerald-950 rounded-lg p-0.5 border border-[#0d4f35]/80 shadow-inner">
            <button
              onClick={() => setLanguage('en')}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('pa')}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-all cursor-pointer ${
                language === 'pa'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="p-4 space-y-2">
        <button
          onClick={onCreateSession}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-emerald-950/40 cursor-pointer border border-emerald-500/30 hover:border-emerald-400/50"
        >
          <MessageSquarePlus className="w-4 h-4 text-emerald-100" />
          {t.newChat}
        </button>
      </div>

      {/* Scrollable Middle Column: History and Widgets */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 pb-4">
        {/* Inspection History */}
        <div>
          <div className="flex items-center justify-between mb-2">
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

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin-dark">
            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  id={`session-${sess.id}`}
                  className={`group relative flex items-center justify-between p-2 rounded-lg text-xs transition-all cursor-pointer ${
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

        {/* Collapsible Widgets panel */}
        <div className="space-y-2">
          {/* Weather & Advisory Widget (Non-collapsible because it's a small notification) */}
          <div className="bg-emerald-950/45 border border-emerald-900/25 rounded-xl p-3 flex items-start gap-2.5">
            <div className="text-xl pt-0.5">{weather.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                {t.weatherAlerts} ({weather.temp})
              </p>
              <p className="text-[11px] text-emerald-200 font-sans mt-1 leading-normal">
                {weather.text}
              </p>
            </div>
          </div>

          {/* Mandi Widget Trigger */}
          <div className="border border-emerald-900/25 rounded-xl overflow-hidden bg-emerald-950/15">
            <button
              onClick={() => setShowMandi(!showMandi)}
              className="w-full px-3 py-2.5 hover:bg-[#073021] text-[11px] font-bold hover:text-amber-400 transition-colors flex items-center justify-between text-emerald-300 cursor-pointer"
            >
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                📈 {t.mandiPrices}
              </span>
              {showMandi ? <ChevronUp className="w-3.5 h-3.5 text-amber-500" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
            {showMandi && (
              <div className="p-2 bg-emerald-950/30 border-t border-emerald-900/20">
                <MandiWidget language={language} />
              </div>
            )}
          </div>

          {/* Calculator Widget Trigger */}
          <div className="border border-emerald-900/25 rounded-xl overflow-hidden bg-emerald-950/15">
            <button
              onClick={() => setShowCalc(!showCalc)}
              className="w-full px-3 py-2.5 hover:bg-[#073021] text-[11px] font-bold hover:text-amber-400 transition-colors flex items-center justify-between text-emerald-300 cursor-pointer"
            >
              <span className="uppercase tracking-wider flex items-center gap-1.5">
                🧮 {t.fertilizerCalc}
              </span>
              {showCalc ? <ChevronUp className="w-3.5 h-3.5 text-amber-500" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
            {showCalc && (
              <div className="p-2 bg-emerald-950/30 border-t border-emerald-900/20">
                <FertilizerCalc language={language} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Legal/Agricultural Footer */}
      <div className="p-3 bg-emerald-950 border-t border-emerald-900/15 text-center text-[9px] text-emerald-600/70 font-mono tracking-wide leading-tight">
        🇮🇳 DESI FARMING MITRA AI COMPLIANT
      </div>
    </aside>
  );
}
