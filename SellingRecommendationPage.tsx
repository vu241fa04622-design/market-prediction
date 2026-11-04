import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG, generateRealisticHistoricalSeries } from '../data/agmarknetData';
import { runPricePrediction } from '../services/mlEngine';
import { generateSmartSellingRecommendation } from '../services/recommendationEngine';
import { Lightbulb, CheckCircle2, AlertTriangle, Clock, ArrowRight, ShieldCheck, Sparkles, Truck, Layers, HelpCircle } from 'lucide-react';

interface SellingRecommendationPageProps {
  initialCropId?: string;
  initialMandiId?: string;
  onNavigate: (tab: string, state?: any) => void;
}

export const SellingRecommendationPage: React.FC<SellingRecommendationPageProps> = ({
  initialCropId,
  initialMandiId,
  onNavigate
}) => {
  const { language, t } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || 'crop_paddy');
  const [selectedMandiId, setSelectedMandiId] = useState<string>(initialMandiId || 'mandi_warangal');

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const selectedMandi = MANDIS_CATALOG.find(m => m.id === selectedMandiId) || MANDIS_CATALOG[0];

  // Run dynamic prediction and generate recommendation
  const history = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 90);
  const prediction = runPricePrediction(
    history,
    selectedCrop.id,
    selectedMandi.id,
    selectedCrop.varietyList[0],
    15,
    'xgboost'
  );

  const recommendation = generateSmartSellingRecommendation(prediction);

  // Action badge styling
  const actionBadges = {
    HOLD: { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: Clock, label: 'HOLD PRODUCE' },
    SELL_IMMEDIATELY: { bg: 'bg-rose-100 text-rose-900 border-rose-300', icon: AlertTriangle, label: 'SELL IMMEDIATELY' },
    SPLIT_SELL: { bg: 'bg-amber-100 text-amber-900 border-amber-300', icon: Layers, label: 'STAGGERED SELLING (50/50)' },
    DIVERSIFY_MANDI: { bg: 'bg-blue-100 text-blue-900 border-blue-300', icon: Truck, label: 'EXPLORE ALTERNATE MANDI' }
  };

  const badge = actionBadges[recommendation.action];
  const ActionIcon = badge.icon;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'రైతుకు స్మార్ట్ విక్రయ సిఫార్సు వ్యవస్థ' : 'Smart Farmer Selling Decision Support'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'te'
              ? 'ధరల సరళి, రాక ఒత్తిడి, నిల్వ సామర్థ్యం ఆధారంగా లాభదాయక విక్రయ సమయాన్ని నిర్ణయించండి'
              : 'Objective economic decision support combining price trajectories, arrival elasticity, and commodity durability'
            }
          </p>
        </div>

        {/* Crop & Mandi Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 shadow-xs focus:ring-2 focus:ring-emerald-700"
          >
            {CROPS_CATALOG.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({language === 'te' ? c.teluguName : c.category})
              </option>
            ))}
          </select>

          <select
            value={selectedMandiId}
            onChange={(e) => setSelectedMandiId(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 shadow-xs focus:ring-2 focus:ring-emerald-700"
          >
            {MANDIS_CATALOG.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Recommendation Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Top Tag & Title */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${badge.bg}`}>
              <ActionIcon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>

            <span className="text-xs font-semibold text-stone-500">
              Analysis based on <strong>{selectedMandi.name}</strong> · Current Rate: <strong>₹{prediction.currentModalPrice}/q</strong>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
            {language === 'te' ? recommendation.titleTelugu : recommendation.title}
          </h2>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
            {language === 'te' ? recommendation.summaryTelugu : recommendation.summary}
          </p>
        </div>

        {/* 3 Key Operational Directives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-medium text-stone-500">{t.timeframe}</div>
            <div className="text-base font-bold text-stone-900 mt-1">
              {recommendation.recommendedTimeframe}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Optimal trading opportunity window</div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-medium text-stone-500">{t.netBenefit}</div>
            <div className="text-base font-bold text-emerald-800 mt-1">
              {recommendation.expectedNetBenefit}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Estimated price variance vs today</div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-xs font-medium text-stone-500">Commodity Shelf Life</div>
            <div className="text-base font-bold text-stone-900 mt-1">
              {selectedCrop.shelfLifeDays} Days ({selectedCrop.perishable ? 'Perishable' : 'Durable'})
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Post-harvest storage buffer</div>
          </div>

        </div>

        {/* Market Driver Factors Breakdown */}
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide text-xs">
            {t.keyFactors} & Scientific Rationale
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendation.factors.map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {f.impact === 'positive' && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                  {f.impact === 'negative' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                  {f.impact === 'neutral' && <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                  <span className="font-bold text-xs text-stone-900">{f.name}</span>
                </div>
                <p className="text-xs text-stone-600 leading-snug">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alternate Mandi Opportunity (if available) */}
        {recommendation.alternateMarketsSuggestion && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs mb-1">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>Inter-Mandi Arbitrage Opportunity Detected</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>{recommendation.alternateMarketsSuggestion.mandi}</strong> is trading at <strong>₹{recommendation.alternateMarketsSuggestion.currentPrice}/q</strong>. After deducting estimated roundtrip transit of ₹{recommendation.alternateMarketsSuggestion.transportCostPerQuintal}/q ({recommendation.alternateMarketsSuggestion.distanceKm} km), net gain is <strong>+₹{recommendation.alternateMarketsSuggestion.netGainPerQuintal}/q</strong>.
              </p>
            </div>
            <button
              onClick={() => onNavigate('compare', { cropId: selectedCrop.id })}
              className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
            >
              Compare All Mandis →
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="pt-4 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Advisory Protocol:</strong> {recommendation.disclaimer} Always verify physical moisture percentage and commission charges at the mandi weighbridge.
          </p>
        </div>

      </div>

    </div>
  );
};
