import { useState } from 'react';
import { MOCK_MANDI_PRICES, Language, TRANSLATIONS } from '../types';
import { Search, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface MandiWidgetProps {
  language: Language;
}

export default function MandiWidget({ language }: MandiWidgetProps) {
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const t = TRANSLATIONS[language];

  const filteredPrices = MOCK_MANDI_PRICES.filter(item => {
    const query = search.toLowerCase();
    const cropText = (item.crop[language] || item.crop.en).toLowerCase();
    const marketText = (item.market[language] || item.market.en).toLowerCase();
    return cropText.includes(query) || marketText.includes(query);
  });

  const handleRefresh = () => {
    // Simulate updating price slightly to show reactive high quality
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="bg-transparent text-emerald-100 flex flex-col h-full p-1">
      <div className="flex items-center justify-between mb-3 border-b border-emerald-850 pb-2">
        <h3 className="font-sans font-semibold text-sm tracking-wide text-emerald-200 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          {t.mandiPrices}
        </h3>
        <button 
          onClick={handleRefresh}
          className="p-1 hover:bg-emerald-800/40 rounded transition-colors text-emerald-400 hover:text-emerald-300"
          title="Refresh Mandi Rates"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.searchMarket}
          className="w-full bg-emerald-900/40 text-xs border border-emerald-800/80 rounded-lg pl-8 pr-3 py-1.5 text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <Search className="w-3.5 h-3.5 text-emerald-500 absolute left-2.5 top-2.5" />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-emerald-800 space-y-2 pr-1">
        {filteredPrices.map((item) => {
          // Micro fluctuations on refresh key
          const fluctuation = refreshKey > 0 ? (item.id.charCodeAt(0) % 3 - 1) * 5 : 0;
          const displayPrice = item.price + fluctuation;

          return (
            <div 
              key={item.id} 
              id={`mandi-${item.id}`}
              className="bg-emerald-900/30 border border-emerald-900/60 hover:border-emerald-800/60 rounded-lg p-2.5 flex items-center justify-between transition-all"
            >
              <div>
                <p className="text-xs font-medium text-emerald-100">
                  {item.crop[language] || item.crop.en}
                </p>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  📍 {item.market[language] || item.market.en}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-mono font-bold text-white">
                  ₹{displayPrice} Qtl
                </p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {item.change === 'up' && (
                    <>
                      <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-[9px] font-mono text-emerald-400">+{item.changeAmount + Math.abs(fluctuation)}</span>
                    </>
                  )}
                  {item.change === 'down' && (
                    <>
                      <TrendingDown className="w-2.5 h-2.5 text-red-400" />
                      <span className="text-[9px] font-mono text-red-400">-{item.changeAmount + Math.abs(fluctuation)}</span>
                    </>
                  )}
                  {item.change === 'stable' && (
                    <>
                      <Minus className="w-2.5 h-2.5 text-emerald-500" />
                      <span className="text-[9px] font-mono text-emerald-500">Stable</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredPrices.length === 0 && (
          <p className="text-[11px] text-emerald-500 text-center py-4">
            No crops found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
