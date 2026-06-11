import { useState } from 'react';
import { FERTILIZER_RECOMMENDATIONS, Language, TRANSLATIONS } from '../types';
import { Calculator, Sprout, Info } from 'lucide-react';

interface FertilizerCalcProps {
  language: Language;
}

const LOCAL_TEXTS: Record<Language, {
  methodLabel: string;
  methodStandard: string;
  methodScientific: string;
  tooltipStandard: string;
  tooltipScientific: string;
  nitrogenNeeded: string;
  phosphorusNeeded: string;
  potassiumNeeded: string;
  pureNutrients: string;
  fertilizerBags: string;
  inKg: string;
  or: string;
}> = {
  en: {
    methodLabel: "Calculation Method",
    methodStandard: "Traditional (Direct)",
    methodScientific: "Scientific (Balanced)",
    tooltipStandard: "Traditional field practice. Urea and DAP calculated independently to meet nitrogen & phosphorus targets.",
    tooltipScientific: "State university method. Urea is reduced because DAP also provides 18% Nitrogen, saving you cost.",
    nitrogenNeeded: "Nitrogen (N)",
    phosphorusNeeded: "Phosphorus (P)",
    potassiumNeeded: "Potassium (K)",
    pureNutrients: "Target Pure Nutrients",
    fertilizerBags: "Recommended Fertilizer Quantities",
    inKg: "kg",
    or: "or"
  },
  hi: {
    methodLabel: "कैलकुलेशन विधि (Method)",
    methodStandard: "पारंपरिक विधि (Direct)",
    methodScientific: "वैज्ञानिक विधि (Balanced)",
    tooltipStandard: "पारंपरिक विधि: खाद की मात्रा सीधी मापी जाती है (जैसे गेहूं में 110 किलो यूरिया और 55 किलो डीएपी)।",
    tooltipScientific: "वैज्ञानिक तरीका: यूरिया की मात्रा कम होती है क्योंकि डीएपी भी 18% नाइट्रोजन प्रदान करता है, जिससे अतिरिक्त बचत होती है।",
    nitrogenNeeded: "नाइट्रोजन (N)",
    phosphorusNeeded: "फास्फोरस (P)",
    potassiumNeeded: "पोटाश (K)",
    pureNutrients: "कुल आवश्यक शुद्ध पोषक तत्व",
    fertilizerBags: "अनुशंसित खाद की मात्रा",
    inKg: "किग्रा",
    or: "या"
  },
  pa: {
    methodLabel: "ਗਣਨਾ ਵਿਧੀ",
    methodStandard: "ਰਵਾਇਤੀ ਵਿਧੀ (Direct)",
    methodScientific: "ਵਿਗਿਆਨਕ ਵਿਧੀ (Balanced)",
    tooltipStandard: "ਰਵਾਇਤੀ ਵਿਧੀ: ਖਾਦ ਦੀ ਸਿੱਧੀ ਗਣਨਾ ਕੀਤੀ ਜਾਂਦੀ ਹੈ (ਜਿਵੇਂ ਕਣਕ ਵਿੱਚ 110 ਕਿੱਲੋ ਯੂਰੀਆ ਅਤੇ 55 ਕਿੱਲੋ ਡੀਏਪੀ ਪ੍ਰਤੀ ਏਕੜ)।",
    tooltipScientific: "ਵਿਗਿਆਨਕ ਤਰੀਕਾ: ਯੂਰੀਆ ਦੀ ਮਾਤਰਾ ਘਟਾਈ ਜਾਂਦੀ ਹੈ ਕਿਉਂਕਿ ਡੀਏਪੀ ਵੀ 18% ਨਾਈਟ੍ਰੋਜਨ ਦਿੰਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਪੈਸੇ ਬਚਦੇ ਹਨ।",
    nitrogenNeeded: "ਨਾਈਟ੍ਰੋਜਨ (N)",
    phosphorusNeeded: "ਫਾਸਫੋਰਸ (P)",
    potassiumNeeded: "ਪੋਟਾਸ਼ (K)",
    pureNutrients: "ਲੋੜੀਂਦੇ ਸ਼ੁੱਧ ਪੌਸ਼ਟਿਕ ਤੱਤ",
    fertilizerBags: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਖਾਦ ਦੀ ਮਾਤਰਾ",
    inKg: "ਕਿੱਲੋ",
    or: "ਜਾਂ"
  }
};

export default function FertilizerCalc({ language }: FertilizerCalcProps) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [acres, setAcres] = useState<number | string>(1);
  const [calcMethod, setCalcMethod] = useState<'standard' | 'scientific'>('standard');

  const t = TRANSLATIONS[language];
  const lt = LOCAL_TEXTS[language] || LOCAL_TEXTS['en'];

  // Look up requirements
  const cropRec = FERTILIZER_RECOMMENDATIONS.find(r => r.crop === selectedCrop) || FERTILIZER_RECOMMENDATIONS[0];

  const parsedAcres = Math.max(0, parseFloat(acres.toString()) || 0);

  const pRequirementKg = cropRec.phosphorus * parsedAcres;
  const nRequirementKg = cropRec.nitrogen * parsedAcres;
  const kRequirementKg = cropRec.potassium * parsedAcres;

  // 1. DAP contains 46% P and 18% N.
  const dapKg = pRequirementKg / 0.46;
  const nFromDap = dapKg * 0.18;

  // 2. Remaining Nitrogen calculation based on chosen method
  const remainingNKg = calcMethod === 'scientific' 
    ? Math.max(0, nRequirementKg - nFromDap) 
    : nRequirementKg;

  // 3. Urea contains 46% N
  const ureaKg = remainingNKg / 0.46;

  // 4. MOP contains 60% K
  const mopKg = kRequirementKg / 0.60;

  // Convert to 50kg bags
  const dapBags = Math.ceil((dapKg / 50) * 10) / 10;
  const ureaBags = Math.ceil((ureaKg / 50) * 10) / 10;
  const mopBags = Math.ceil((mopKg / 50) * 10) / 10;

  return (
    <div className="bg-transparent text-emerald-100 flex flex-col p-1">
      <div className="flex items-center gap-2 mb-3 border-b border-emerald-850 pb-2">
        <Calculator className="w-4 h-4 text-emerald-400" />
        <h3 className="font-sans font-semibold text-sm tracking-wide text-emerald-200">
          {t.fertilizerCalc}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Crop Selection */}
        <div>
          <label className="block text-[10px] text-emerald-400 uppercase tracking-wider mb-1 font-mono">
            {t.selectCrop}
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full bg-emerald-900/40 text-xs border border-emerald-800/80 rounded-lg px-2 py-1.5 text-emerald-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {FERTILIZER_RECOMMENDATIONS.map((r) => (
              <option key={r.crop} value={r.crop} className="bg-emerald-950 text-emerald-50 text-xs">
                {r.source}
              </option>
            ))}
          </select>
        </div>

        {/* Acreage Input & Method selection layout */}
        <div className="grid grid-cols-2 gap-2">
          {/* Acreage Input */}
          <div>
            <label className="block text-[10px] text-emerald-400 uppercase tracking-wider mb-1 font-mono">
              {t.acreageInput}
            </label>
            <input
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className="w-full bg-emerald-900/40 text-xs border border-emerald-800/80 rounded-lg px-2 py-1.5 font-mono text-emerald-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Method Selector */}
          <div>
            <label className="block text-[10px] text-emerald-400 uppercase tracking-wider mb-1 font-mono">
              {lt.methodLabel}
            </label>
            <select
              value={calcMethod}
              onChange={(e) => setCalcMethod(e.target.value as 'standard' | 'scientific')}
              className="w-full bg-emerald-900/40 text-xs border border-emerald-800/80 rounded-lg px-1 py-1.5 text-emerald-100 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="standard" className="bg-emerald-950 text-emerald-50 text-[11px]">
                {lt.methodStandard}
              </option>
              <option value="scientific" className="bg-emerald-950 text-emerald-50 text-[11px]">
                {lt.methodScientific}
              </option>
            </select>
          </div>
        </div>

        {/* Advisory dynamic explanation block */}
        <div className="flex gap-1.5 bg-emerald-950/40 border border-emerald-900/40 p-2 rounded-lg text-[10px] leading-normal text-emerald-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            {calcMethod === 'standard' ? lt.tooltipStandard : lt.tooltipScientific}
          </p>
        </div>

        {/* Pure Nutrient Summary */}
        <div className="bg-emerald-950/30 border border-emerald-900/20 rounded-lg p-2.5 space-y-1.5">
          <p className="text-[9px] text-emerald-400 uppercase tracking-wider font-mono font-bold">
            📊 {lt.pureNutrients} ({parsedAcres} Acre)
          </p>
          <div className="flex justify-between items-center text-[11px] text-emerald-100 font-mono">
            <span>{lt.nitrogenNeeded}: <strong className="text-white">{nRequirementKg.toFixed(1)} {lt.inKg}</strong></span>
            <span>{lt.phosphorusNeeded}: <strong className="text-white">{pRequirementKg.toFixed(1)} {lt.inKg}</strong></span>
            <span>{lt.potassiumNeeded}: <strong className="text-white">{kRequirementKg.toFixed(1)} {lt.inKg}</strong></span>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="bg-emerald-950/80 border border-emerald-900/60 rounded-lg p-3 space-y-2.5">
          <p className="text-[10px] text-emerald-400 capitalize font-semibold border-b border-emerald-900/50 pb-1 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5" />
            {lt.fertilizerBags}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {/* Urea */}
            <div className="text-center p-1.5 bg-emerald-900/20 border border-emerald-800/20 rounded-md">
              <span className="text-[10px] text-emerald-300 block">{t.calcUrea}</span>
              <span className="text-sm font-mono font-bold text-white block mt-1">{ureaBags}</span>
              <span className="text-[8px] text-emerald-500 block uppercase font-mono">Bags</span>
              <span className="text-[8px] text-emerald-400 block font-mono mt-0.5">({ureaKg.toFixed(1)} {lt.inKg})</span>
            </div>
            
            {/* DAP */}
            <div className="text-center p-1.5 bg-emerald-900/20 border border-emerald-800/20 rounded-md">
              <span className="text-[10px] text-emerald-300 block">{t.calcDap}</span>
              <span className="text-sm font-mono font-bold text-white block mt-1">{dapBags}</span>
              <span className="text-[8px] text-emerald-500 block uppercase font-mono">Bags</span>
              <span className="text-[8px] text-emerald-400 block font-mono mt-0.5">({dapKg.toFixed(1)} {lt.inKg})</span>
            </div>

            {/* MOP */}
            <div className="text-center p-1.5 bg-emerald-900/20 border border-emerald-800/20 rounded-md">
              <span className="text-[10px] text-emerald-300 block">{t.calcMop}</span>
              <span className="text-sm font-mono font-bold text-white block mt-1">{mopBags}</span>
              <span className="text-[8px] text-emerald-500 block uppercase font-mono">Bags</span>
              <span className="text-[8px] text-emerald-400 block font-mono mt-0.5">({mopKg.toFixed(1)} {lt.inKg})</span>
            </div>
          </div>

          <p className="text-[9px] text-emerald-400 text-center leading-normal italic pt-1 border-t border-emerald-900/40">
            * 1 bag = 50 kg. Dosages based on State Agricultural guidelines. Check leaf diagnostic tool for real plant needs.
          </p>
        </div>
      </div>
    </div>
  );
}

