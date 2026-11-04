import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG, generateRealisticHistoricalSeries } from '../data/agmarknetData';
import { downloadHistoricalPricesCsv } from '../services/reportGenerator';
import { DollarSign, Search, Filter, Download, Calendar, MapPin, Tag, TrendingUp, Sparkles } from 'lucide-react';

interface CurrentPricesPageProps {
  initialCropId?: string;
  initialMandiId?: string;
  onNavigate: (tab: string, state?: any) => void;
}

export const CurrentPricesPage: React.FC<CurrentPricesPageProps> = ({
  initialCropId,
  initialMandiId,
  onNavigate
}) => {
  const { language, t } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || 'crop_paddy');
  const [selectedMandiId, setSelectedMandiId] = useState<string>(initialMandiId || 'mandi_warangal');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const selectedMandi = MANDIS_CATALOG.find(m => m.id === selectedMandiId) || MANDIS_CATALOG[0];

  const historicalRecords = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 45);
  const latestRecord = historicalRecords[historicalRecords.length - 1];

  // Filter records by search
  const filteredRecords = historicalRecords
    .slice()
    .reverse()
    .filter(r => {
      if (!searchFilter) return true;
      return (
        r.date.includes(searchFilter) ||
        r.variety.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.market.toLowerCase().includes(searchFilter.toLowerCase())
      );
    });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'తాజా వ్యవసాయ మార్కెట్ ధరలు (AGMARKNET)' : 'Current Wholesale APMC Market Prices'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'te'
              ? 'ప్రభుత్వ అగ్మార్క్‌నెట్ పోర్టల్ నుండి సేకరించిన నిజమైన మార్కెట్ ధరలు (రూపాయలు/క్వింటాల్)'
              : 'Official daily wholesale prices, arrival quantities, and variety quotations across regulated mandis'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadHistoricalPricesCsv(historicalRecords, selectedCrop.name, selectedMandi.name)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>{t.downloadCsv}</span>
          </button>
          <button
            onClick={() => onNavigate('prediction', { cropId: selectedCrop.id, mandiId: selectedMandi.id })}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.quickPredict}</span>
          </button>
        </div>
      </div>

      {/* Filter and Selection Strip */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Crop Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">Select Crop</label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {CROPS_CATALOG.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({language === 'te' ? c.teluguName : c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Mandi Selector */}
          <div>
            <label className="block text-[11px] font-bold text-stone-500 mb-1">Select Mandi</label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {MANDIS_CATALOG.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district}, {m.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative min-w-56">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search date or variety..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

      </div>

      {/* Latest Price Highlight Hero Card */}
      {latestRecord && (
        <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div>
            <div className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OFFICIAL SPOT QUOTATION</span>
            </div>
            <h2 className="text-2xl font-bold">{selectedCrop.name}</h2>
            <div className="text-xs text-stone-400 mt-0.5">
              {selectedMandi.name} · {latestRecord.variety}
            </div>
          </div>

          <div className="border-l border-stone-800 md:pl-6">
            <div className="text-xs text-stone-400">Modal Price (₹/q)</div>
            <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">
              ₹{latestRecord.modalPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Standard Wholesale Rate</div>
          </div>

          <div className="border-l border-stone-800 md:pl-6">
            <div className="text-xs text-stone-400">Min – Max Spread</div>
            <div className="text-xl font-bold text-stone-200 tabular-nums">
              ₹{latestRecord.minPrice} – ₹{latestRecord.maxPrice}
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Grade Quality Band</div>
          </div>

          <div className="border-l border-stone-800 md:pl-6">
            <div className="text-xs text-stone-400">Daily Arrival Volume</div>
            <div className="text-xl font-bold text-stone-200 tabular-nums">
              {latestRecord.arrivalQuantity.toLocaleString('en-IN')} Quintals
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Reported: {latestRecord.date}</div>
          </div>
        </div>
      )}

      {/* Historical Records Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">
            Past Price History Logs ({filteredRecords.length} Records)
          </h3>
          <span className="text-xs text-stone-500">
            Source: AGMARKNET Wholesale Register
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Market Yard</th>
                <th className="py-3 px-4">Commodity & Variety</th>
                <th className="py-3 px-4 text-right">Min Price</th>
                <th className="py-3 px-4 text-right">Max Price</th>
                <th className="py-3 px-4 text-right">Modal Price</th>
                <th className="py-3 px-4 text-right">Arrival Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900 tabular-nums">{r.date}</td>
                  <td className="py-3 px-4 text-stone-700">{r.market}</td>
                  <td className="py-3 px-4 text-stone-600">
                    <span className="font-medium text-stone-800">{r.commodity}</span>
                    <span className="text-stone-400 ml-1">({r.variety})</span>
                  </td>
                  <td className="py-3 px-4 text-right text-stone-600 tabular-nums">₹{r.minPrice}</td>
                  <td className="py-3 px-4 text-right text-stone-600 tabular-nums">₹{r.maxPrice}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900 tabular-nums">
                    ₹{r.modalPrice.toLocaleString('en-IN')}/q
                  </td>
                  <td className="py-3 px-4 text-right text-stone-600 tabular-nums">
                    {r.arrivalQuantity} q
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
