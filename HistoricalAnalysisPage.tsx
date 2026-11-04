import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG, generateRealisticHistoricalSeries } from '../data/agmarknetData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Calendar, BarChart3, Activity, Info } from 'lucide-react';

export const HistoricalAnalysisPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>('crop_paddy');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('mandi_warangal');
  const [timeRangeDays, setTimeRangeDays] = useState<number>(90);

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const selectedMandi = MANDIS_CATALOG.find(m => m.id === selectedMandiId) || MANDIS_CATALOG[0];

  const historicalRecords = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, timeRangeDays);

  // Compute 7-day and 30-day moving averages for trend visualization
  const chartData = historicalRecords.map((r, i, arr) => {
    const slice7 = arr.slice(Math.max(0, i - 6), i + 1);
    const ma7 = Math.round(slice7.reduce((s, v) => s + v.modalPrice, 0) / slice7.length);

    const slice30 = arr.slice(Math.max(0, i - 29), i + 1);
    const ma30 = Math.round(slice30.reduce((s, v) => s + v.modalPrice, 0) / slice30.length);

    return {
      date: r.date.substring(5), // MM-DD
      fullDate: r.date,
      modalPrice: r.modalPrice,
      ma7,
      ma30,
      minPrice: r.minPrice,
      maxPrice: r.maxPrice,
      arrival: r.arrivalQuantity
    };
  });

  // Calculate high, low, avg, and price volatility
  const prices = historicalRecords.map(r => r.modalPrice);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const avgP = Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
  const variance = prices.reduce((acc, v) => acc + Math.pow(v - avgP, 2), 0) / prices.length;
  const stdDev = Math.round(Math.sqrt(variance));
  const volatilityPct = Math.round((stdDev / avgP) * 1000) / 10;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'ధరల సరళి & కాలానుగుణ విశ్లేషణ' : 'Price Trend & Seasonal Cycle Analysis'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Historical price trajectories, 7-day and 30-day moving average smoothing, and seasonal volatility
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 shadow-xs focus:ring-2 focus:ring-emerald-700"
          >
            {CROPS_CATALOG.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedMandiId}
            onChange={(e) => setSelectedMandiId(e.target.value)}
            className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-stone-900 shadow-xs focus:ring-2 focus:ring-emerald-700"
          >
            {MANDIS_CATALOG.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
            {[30, 60, 90, 120].map(d => (
              <button
                key={d}
                onClick={() => setTimeRangeDays(d)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  timeRangeDays === d ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500">Average Modal Price</span>
          <div className="text-2xl font-bold text-stone-900 tabular-nums mt-1">₹{avgP}/q</div>
          <span className="text-[11px] text-stone-400">Past {timeRangeDays} days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500">Period High – Low</span>
          <div className="text-xl font-bold text-stone-900 tabular-nums mt-1">₹{minP} – ₹{maxP}</div>
          <span className="text-[11px] text-stone-400">Spread: ₹{maxP - minP}/q</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500">Price Volatility (Std. Dev)</span>
          <div className="text-2xl font-bold text-emerald-800 tabular-nums mt-1">±₹{stdDev} ({volatilityPct}%)</div>
          <span className="text-[11px] text-stone-400">{selectedCrop.perishable ? 'High volatility commodity' : 'Moderate price stability'}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500">Crop Harvest Season</span>
          <div className="text-xl font-bold text-stone-900 mt-1">{selectedCrop.season}</div>
          <span className="text-[11px] text-stone-400">Shelf life: {selectedCrop.shelfLifeDays} days</span>
        </div>
      </div>

      {/* Primary Chart: Modal Price with Moving Averages */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {selectedCrop.name} – {timeRangeDays}-Day Historical Price Trajectory
            </h3>
            <p className="text-xs text-stone-500">
              Includes 7-day and 30-day moving average curves to filter out weekly auction noise
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-0.5 bg-emerald-800" />
              <span>Modal Price</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-3 h-0.5 bg-amber-500" />
              <span>7-Day MA</span>
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-0.5 bg-blue-500" />
              <span>30-Day MA</span>
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={8} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                domain={['auto', 'auto']}
                tickFormatter={(v) => `₹${v}`}
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(val: any, name: any) => [`₹${val}/q`, name === 'modalPrice' ? 'Modal Price' : name === 'ma7' ? '7-Day Moving Avg' : '30-Day Moving Avg']}
                labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
              />
              <Line type="monotone" dataKey="modalPrice" stroke="#166534" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ma7" stroke="#d97706" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="ma30" stroke="#2563eb" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Insights */}
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs space-y-2 text-stone-600">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>Agricultural Seasonality Context</span>
        </div>
        <p className="leading-relaxed">
          In India, major price troughs typically coincide with peak mandi harvest arrivals (e.g. Kharif arrivals in October–December and Rabi arrivals in March–May). Prices then appreciate during the inter-season lean months. AgriPrice AI harnesses Fourier seasonal harmonic modeling to decompose and predict these cycles with high precision.
        </p>
      </div>

    </div>
  );
};
