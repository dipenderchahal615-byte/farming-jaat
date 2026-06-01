import { useState } from 'react';
import { FERTILIZER_RECOMMENDATIONS, Language, TRANSLATIONS } from '../types';
import { Calculator, Sprout } from 'lucide-react';

interface FertilizerCalcProps {
  language: Language;
}

export default function FertilizerCalc({ language }: FertilizerCalcProps) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [acres, setAcres] = useState<number>(1);

  const t = TRANSLATIONS[language];

  // Look up requirements
  const cropRec = FERTILIZER_RECOMMENDATIONS.find(r => r.crop === selectedCrop) || FERTILIZER_RECOMMENDATIONS[0];

  // Calculate:
  // 1. DAP contains 46% P and 18% N. So P requirement is fully supplied by DAP.
  //    DAP_kg = (P_req * acres) / 0.46
  // 2. DAP_kg also supplies (DAP_kg * 0.18) of N.
  // 3. Urea contains 46% N. Remaining N is supplied by Urea.
  //    Remaining_N = (N_req * acres) - (DAP_kg * 0.18)
  //    Urea_kg = Remaining_N / 0.46
  // 4. MOP/Potash contains 60% K.
  //    MOP_kg = (K_req * acres) / 0.60

  const pRequirementKg = cropRec.phosphorus * acres;
  const nRequirementKg = cropRec.nitrogen * acres;
  const kRequirementKg = cropRec.potassium * acres;

  const dapKg = pRequirementKg / 0.46;
  const nFromDap = dapKg * 0.18;
  const remainingNKg = Math.max(0, nRequirementKg - nFromDap);
  const ureaKg = remainingNKg / 0.46;
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
            className="w-full bg-emerald-900/40 text-xs border border-emerald-800/80 rounded-lg px-2 py-1.5 text-emerald-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {FERTILIZER_RECOMMENDATIONS.map((r) => (
              <option key={r.crop} value={r.crop} className="bg-emerald-950 text-emerald-50 text-xs">
                {r.source}
              </option>
            ))}
          </select>
        </div>

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
            onChange={(e) => setAcres(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
            className="w-full bg-emerald-900/40 text-xs border border-emerald-800/80 rounded-lg px-3 py-1.5 font-mono text-emerald-100 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Calculated Results */}
        <div className="bg-emerald-950/80 border border-emerald-900/60 rounded-lg p-3 space-y-2.5">
          <p className="text-[10px] text-emerald-400 capitalize font-semibold border-b border-emerald-900/50 pb-1 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5" />
            {t.calcBags}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {/* Urea */}
            <div className="text-center p-1.5 bg-emerald-900/20 border border-emerald-800/20 rounded-md">
              <span className="text-[10px] text-emerald-300 block">{t.calcUrea}</span>
              <span className="text-sm font-mono font-bold text-white block mt-1">{ureaBags}</span>
              <span className="text-[8px] text-emerald-500 block uppercase font-mono">Bags</span>
            </div>
            
            {/* DAP */}
            <div className="text-center p-1.5 bg-emerald-900/20 border border-emerald-800/20 rounded-md">
              <span className="text-[10px] text-emerald-300 block">{t.calcDap}</span>
              <span className="text-sm font-mono font-bold text-white block mt-1">{dapBags}</span>
              <span className="text-[8px] text-emerald-500 block uppercase font-mono">Bags</span>
            </div>

            {/* MOP */}
            <div className="text-center p-1.5 bg-emerald-900/20 border border-emerald-800/20 rounded-md">
              <span className="text-[10px] text-emerald-300 block">{t.calcMop}</span>
              <span className="text-sm font-mono font-bold text-white block mt-1">{mopBags}</span>
              <span className="text-[8px] text-emerald-500 block uppercase font-mono">Bags</span>
            </div>
          </div>

          <p className="text-[9px] text-emerald-400 text-center leading-normal italic pt-1 border-t border-emerald-900/40">
            * Dosages based on ideal agricultural soil composition. Check leaf diagnostic tool for visual deficiencies.
          </p>
        </div>
      </div>
    </div>
  );
}
