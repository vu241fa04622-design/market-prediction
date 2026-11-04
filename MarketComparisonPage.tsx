import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG, generateRealisticHistoricalSeries } from '../data/agmarknetData';
import { MandiComparisonItem } from '../types';
import { GitCompare, MapPin, Truck, TrendingUp, Award, ArrowRight, CheckCircle2, Info } from 'lucide-react';

interface MarketComparisonPageProps {
  initialCropId?: string;
  onNavigate: (tab: string, state?: any) => void;
}

export const MarketComparisonPage: React.FC<MarketComparisonPageProps> = ({ initialCropId, onNavigate }) => {
  const { language, t } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || 'crop_paddy');
  const [referenceMandiId, setReferenceMandiId] = useState<string>('mandi_warangal');

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const referenceMandi = MANDIS_CATALOG.find(m => m.id === referenceMandiId) || MANDIS_CATALOG[0];

  // Generate comparison items across all mandis
  const comparisonList: MandiComparisonItem[] = MANDIS_CATALOG.slice(0, 6).map(mandi => {
    const history = generateRealisticHistoricalSeries(selectedCrop.id, mandi.id, 10);
    const latest = history[history.length - 1];

    // Distance calculation relative to reference mandi
    const isLocal = mandi.id === referenceMandi.id;
    const distanceKm = isLocal ? 0 : Math.abs(mandi.distanceKm - referenceMandi.distanceKm) + 45;
    
    // Road freight model: ₹1.8/km/quintal + ₹35 terminal loading cess
    const estimatedFreight = isLocal ? 0 : Math.round(distanceKm * 0.95 + 35);
    const netRealizablePrice = latest.modalPrice - estimatedFreight;
    const predicted7DayPrice = Math.round(latest.modalPrice * 1.035);

    return {
      mandiId: mandi.id,
      mandiName: mandi.name,
      district: mandi.district,
      state: mandi.state,
      distanceKm,
      latestReportedDate: latest.date,
      minPrice: latest.minPrice,
      maxPrice: latest.maxPrice,
      modalPrice: latest.modalPrice,
      arrivalQuantityQuintals: latest.arrivalQuantity,
      predicted7DayPrice,
      estimatedFreightPerQuintal: estimatedFreight,
      netRealizablePrice,
      ratingScore: mandi.facilities.length >= 3 ? 4.8 : 4.3
    };
  });

  // Sort by net realizable price
  const sortedList = [...comparisonList].sort((a, b) => b.netRealizablePrice - a.netRealizablePrice);
  const bestMandi = sortedList[0];
  const localMandi = comparisonList.find(c => c.mandiId === referenceMandi.id) || comparisonList[0];
  const netArbitrageGain = bestMandi.netRealizablePrice - localMandi.netRealizablePrice;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'వివిధ మార్కెట్ల ధరలు & రవాణా ఖర్చుల పోలిక' : 'Multi-Mandi Wholesale Market Comparison'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'te'
              ? 'స్థానిక మరియు ప్రాంతీయ మార్కెట్ల ధరలు, రవాణా ఖర్చులు పోల్చి అత్యధిక నికర లాభం పొందండి'
              : 'Compare prices across APMC mandis with automated freight deductions to discover true net realizable earnings'
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Crop Selector */}
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

          {/* Reference Mandi Selector */}
          <select
            value={referenceMandiId}
            onChange={(e) => setReferenceMandiId(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 shadow-xs focus:ring-2 focus:ring-emerald-700"
          >
            {MANDIS_CATALOG.map(m => (
              <option key={m.id} value={m.id}>
                Home: {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Best Market Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Highest Net Realization Recommendation</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold mb-1">
            {bestMandi.mandiName}
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
            {bestMandi.mandiId === referenceMandi.id ? (
              <span>Your local mandi ({bestMandi.mandiName}) offers the best net payout because transporting produce to other markets yields higher freight deductions than price premiums.</span>
            ) : (
              <span>
                Even after deducting estimated transport freight of <strong>₹{bestMandi.estimatedFreightPerQuintal}/q</strong> ({bestMandi.distanceKm} km), selling at <strong>{bestMandi.mandiName}</strong> yields a net gain of <strong>+₹{netArbitrageGain}/quintal</strong> over your local yard.
              </span>
            )}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 min-w-44">
          <div className="text-xs text-stone-300">Net Realizable Price</div>
          <div className="text-3xl font-extrabold tabular-nums text-emerald-300 mt-0.5">
            ₹{bestMandi.netRealizablePrice.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-stone-300 ml-1">/ q</span>
          </div>
          <div className="text-[11px] text-stone-300 mt-1">
            Gross: ₹{bestMandi.modalPrice} | Freight: -₹{bestMandi.estimatedFreightPerQuintal}
          </div>
        </div>
      </div>

      {/* Mandis Comparison Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            {selectedCrop.name} – APMC Mandi Comparison Table
          </h3>
          <span className="text-xs text-stone-500">
            Standard Unit: ₹ / Quintal (100 kg)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Mandi & Location</th>
                <th className="py-3.5 px-4 text-center">Transit Dist.</th>
                <th className="py-3.5 px-4 text-right">Reported Modal Price</th>
                <th className="py-3.5 px-4 text-right">Daily Arrival</th>
                <th className="py-3.5 px-4 text-right">Est. Freight / q</th>
                <th className="py-3.5 px-4 text-right">Net Realizable Payout</th>
                <th className="py-3.5 px-4 text-right">Predicted 7D Price</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {sortedList.map((item, idx) => {
                const isTop = idx === 0;
                const isHome = item.mandiId === referenceMandi.id;

                return (
                  <tr
                    key={item.mandiId}
                    className={`transition-colors ${
                      isTop ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-stone-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {isTop && (
                          <span className="p-1 rounded-md bg-emerald-100 text-emerald-800" title="Best Net Realization">
                            <Award className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span>{item.mandiName}</span>
                            {isHome && (
                              <span className="text-[10px] font-semibold bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                                Local
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {item.district}, {item.state}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center text-stone-600 tabular-nums">
                      {item.distanceKm === 0 ? '0 km (At Origin)' : `${item.distanceKm} km`}
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-stone-900 tabular-nums">
                      ₹{item.modalPrice.toLocaleString('en-IN')}/q
                    </td>

                    <td className="py-3.5 px-4 text-right text-stone-600 tabular-nums">
                      {item.arrivalQuantityQuintals.toLocaleString('en-IN')} q
                    </td>

                    <td className="py-3.5 px-4 text-right text-stone-500 tabular-nums">
                      {item.estimatedFreightPerQuintal === 0 ? '₹0' : `-₹${item.estimatedFreightPerQuintal}/q`}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-emerald-900 tabular-nums text-sm">
                      ₹{item.netRealizablePrice.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right text-emerald-700 font-semibold tabular-nums">
                      ₹{item.predicted7DayPrice.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onNavigate('prediction', { cropId: selectedCrop.id, mandiId: item.mandiId })}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-700 rounded-md text-xs font-semibold transition-colors"
                      >
                        Forecast
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Guidance Footer */}
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>Freight Model Logic & Logistics Advice</span>
        </div>
        <p className="leading-relaxed">
          Estimated freight is calculated based on Indian rural commercial transport rates (average ₹1.8 to ₹2.2 per ton-km, plus loading/unloading cess). When transporting produce to distant mandis, verify that produce grade, moisture level, and commission agent arrangements are confirmed in advance.
        </p>
      </div>

    </div>
  );
};
