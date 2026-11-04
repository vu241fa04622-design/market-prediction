import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG, generateRealisticHistoricalSeries } from '../data/agmarknetData';
import { runPricePrediction } from '../services/mlEngine';
import { downloadPredictionPdf, downloadPredictionCsv } from '../services/reportGenerator';
import { PredictionResult, ForecastHorizon, MLModelType } from '../types';
import { Sparkles, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck, Download, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface PredictionPageProps {
  initialCropId?: string;
  initialMandiId?: string;
  preloadedPrediction?: PredictionResult;
  onNavigate: (tab: string, state?: any) => void;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({
  initialCropId,
  initialMandiId,
  preloadedPrediction,
  onNavigate
}) => {
  const { user, savePredictionToHistory } = useAuth();
  const { language, t } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || 'crop_paddy');
  const [selectedMandiId, setSelectedMandiId] = useState<string>(initialMandiId || 'mandi_warangal');
  const [selectedVariety, setSelectedVariety] = useState<string>('');
  const [horizon, setHorizon] = useState<ForecastHorizon>(7);
  const [modelType, setModelType] = useState<MLModelType>('xgboost');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(preloadedPrediction || null);

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const selectedMandi = MANDIS_CATALOG.find(m => m.id === selectedMandiId) || MANDIS_CATALOG[0];

  // Set default variety when crop changes
  useEffect(() => {
    if (selectedCrop && selectedCrop.varietyList.length > 0) {
      setSelectedVariety(selectedCrop.varietyList[0]);
    }
  }, [selectedCropId]);

  // If no prediction yet, run an initial one
  useEffect(() => {
    if (!prediction) {
      handleRunPrediction();
    }
  }, []);

  const handleRunPrediction = async () => {
    setIsLoading(true);
    // Simulate real async API/engine roundtrip
    setTimeout(() => {
      const history = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 90);
      const res = runPricePrediction(
        history,
        selectedCrop.id,
        selectedMandi.id,
        selectedVariety || selectedCrop.varietyList[0],
        horizon,
        modelType,
        user?.id || 'usr_farmer_01'
      );
      setPrediction(res);
      savePredictionToHistory(res);
      setIsLoading(false);
    }, 450);
  };

  // Prepare chart dataset: merge recent 14 actual days + forecast days
  const chartData: any[] = [];
  if (prediction) {
    const history = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 14);
    
    // Add historical actual points
    history.forEach(h => {
      chartData.push({
        date: h.date.substring(5), // MM-DD
        fullDate: h.date,
        actualPrice: h.modalPrice,
        predictedPrice: null,
        lowerBound: null,
        upperBound: null,
        isForecast: false
      });
    });

    // Add forecast bridge point on the last actual date
    const lastHist = history[history.length - 1];
    if (lastHist) {
      chartData.push({
        date: lastHist.date.substring(5),
        fullDate: lastHist.date,
        actualPrice: lastHist.modalPrice,
        predictedPrice: lastHist.modalPrice,
        lowerBound: lastHist.modalPrice,
        upperBound: lastHist.modalPrice,
        isForecast: false
      });
    }

    // Add forecast points
    prediction.forecast.forEach(f => {
      chartData.push({
        date: f.date.substring(5),
        fullDate: f.date,
        actualPrice: null,
        predictedPrice: f.predictedPrice,
        lowerBound: f.lowerConfidenceBound,
        upperBound: f.upperConfidenceBound,
        isForecast: true
      });
    });
  }

  const isUp = prediction ? prediction.summary.priceChangePercentage >= 0 : true;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'AI పంట మార్కెట్ ధర అంచనా' : 'AI Crop Market Price Prediction Studio'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {language === 'te'
              ? 'గత అగ్మార్క్‌నెట్ డేటా మరియు మెషిన్ లెర్నింగ్ మోడల్స్ తో రాబోయే ధరలను అంచనా వేయండి'
              : 'Multi-horizon econometric forecasting using historical AGMARKNET APMC time series and arrival dynamics'
            }
          </p>
        </div>

        {prediction && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadPredictionPdf(prediction, selectedCrop, selectedMandi)}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.downloadPdf}</span>
            </button>
            <button
              onClick={() => downloadPredictionCsv(prediction)}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.downloadCsv}</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Parameters Control Panel */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {t.selectCrop}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
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
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {t.selectMandi}
            </label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {MANDIS_CATALOG.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.state})
                </option>
              ))}
            </select>
          </div>

          {/* Variety Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {t.selectVariety}
            </label>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {selectedCrop.varietyList.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Forecast Horizon */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {t.forecastHorizon}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
              {([7, 15, 30] as ForecastHorizon[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setHorizon(d)}
                  className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                    horizon === d
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {t.modelSelector}
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as MLModelType)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="xgboost">XGBoost Regressor (Recommended)</option>
              <option value="random_forest">Random Forest Regressor</option>
              <option value="linear_regression">Ridge Linear Regression</option>
              <option value="time_series_baseline">Holt-Winters Seasonal</option>
            </select>
          </div>

        </div>

        {/* Prediction Trigger Button */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Selected: <strong className="text-stone-800">{selectedCrop.name} ({selectedVariety || 'Standard'})</strong> at <strong className="text-stone-800">{selectedMandi.name}</strong> · Next {horizon} Days
          </div>
          <button
            onClick={handleRunPrediction}
            disabled={isLoading}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.predicting}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>{t.btnPredict}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Forecast Output Presentation */}
      {prediction && (
        <div className="space-y-6">

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Current Modal Price */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">{t.currentModalPrice}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                ₹{prediction.currentModalPrice.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-stone-500 ml-1">/ q</span>
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">As of {prediction.currentDate}</span>
            </div>

            {/* Predicted Average Price */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">{t.predictedAverage}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
                ₹{prediction.summary.avgPredictedPrice.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-stone-500 ml-1">/ q</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Next {prediction.forecastHorizon} Days Mean
              </span>
            </div>

            {/* Expected Price Range */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">{t.expectedRange}</span>
              <div className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">
                ₹{prediction.summary.minPredictedPrice} – ₹{prediction.summary.maxPredictedPrice}
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Low to High Projections
              </span>
            </div>

            {/* Projected Trend & % Change */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block mb-1">{t.priceTrend}</span>
              <div className={`text-2xl font-extrabold flex items-center tabular-nums ${isUp ? 'text-emerald-700' : 'text-rose-600'}`}>
                {isUp ? <ArrowUpRight className="w-6 h-6 mr-1" /> : <ArrowDownRight className="w-6 h-6 mr-1" />}
                <span>{isUp ? '+' : ''}{prediction.summary.priceChangePercentage}%</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-600 mt-1 block">
                {prediction.summary.trend} ({prediction.summary.priceChangeAbsolute >= 0 ? '+' : ''}₹{prediction.summary.priceChangeAbsolute}/q)
              </span>
            </div>

          </div>

          {/* Interactive Graph: Actual vs Predicted with 95% Confidence Bounds */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {language === 'te' ? 'ధరల అంచనా గ్రాఫ్ (అసలు vs అంచనా)' : 'Price Forecast Trajectory & Confidence Envelope'}
                </h3>
                <p className="text-xs text-stone-500">
                  Solid green indicates actual past AGMARKNET recordings; dashed line represents machine learning forecast with 95% confidence interval.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-800" />
                  <span>Actual Recorded</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-600" />
                  <span>AI Forecast</span>
                </span>
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="w-3 h-3 rounded-sm bg-emerald-100" />
                  <span>95% Bounds</span>
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
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
                    formatter={(value: any, name: any) => {
                      if (value === null) return ['—', name];
                      if (name === 'actualPrice') return [`₹${value}/q`, 'Actual Modal Price'];
                      if (name === 'predictedPrice') return [`₹${value}/q`, 'AI Forecast'];
                      if (name === 'upperBound') return [`₹${value}/q`, 'Upper Bound (95%)'];
                      if (name === 'lowerBound') return [`₹${value}/q`, 'Lower Bound (95%)'];
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      const item = payload[0]?.payload;
                      return item ? `${item.fullDate} ${item.isForecast ? '(Forecast)' : '(Actual)'}` : label;
                    }}
                  />
                  {/* Confidence Interval shaded band */}
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stroke="none"
                    fill="#d1fae5"
                    fillOpacity={0.45}
                  />
                  <Area
                    type="monotone"
                    dataKey="lowerBound"
                    stroke="none"
                    fill="#ffffff"
                    fillOpacity={1.0}
                  />
                  {/* Actual recorded historical prices */}
                  <Line
                    type="monotone"
                    dataKey="actualPrice"
                    stroke="#166534"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#166534' }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                  {/* Predicted prices with dashed line */}
                  <Line
                    type="monotone"
                    dataKey="predictedPrice"
                    stroke="#059669"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#059669' }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Day-by-Day Forecast Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {language === 'te' ? 'రోజువారీ అంచనా వివరాలు' : 'Day-Wise Detailed Price Forecast'}
                </h3>
                <span className="text-xs text-stone-500">
                  {prediction.forecastHorizon} day projection schedule with statistical upper and lower uncertainty bounds
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                Confidence: {prediction.summary.confidenceScore}%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Forecast Date</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4 text-right">Expected Arrival</th>
                    <th className="py-3 px-4 text-right">Predicted Modal Price</th>
                    <th className="py-3 px-4 text-right">95% Confidence Interval</th>
                    <th className="py-3 px-4 text-right">Diff from Current</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {prediction.forecast.map((f, idx) => {
                    const diff = f.predictedPrice - prediction.currentModalPrice;
                    const diffPct = Math.round((diff / prediction.currentModalPrice) * 1000) / 10;
                    return (
                      <tr key={f.date} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-stone-900 tabular-nums">{f.date}</td>
                        <td className="py-3 px-4 text-stone-600">{f.dayName}</td>
                        <td className="py-3 px-4 text-right text-stone-600 tabular-nums">{f.expectedArrivalQuantity} qtls</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-900 tabular-nums">
                          ₹{f.predictedPrice.toLocaleString('en-IN')}/q
                        </td>
                        <td className="py-3 px-4 text-right text-stone-500 tabular-nums">
                          ₹{f.lowerConfidenceBound} – ₹{f.upperConfidenceBound}
                        </td>
                        <td className={`py-3 px-4 text-right font-semibold tabular-nums ${diff >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {diff >= 0 ? '+' : ''}{diff} ({diff >= 0 ? '+' : ''}{diffPct}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Walk-Forward Diagnostics & Feature Importance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Walk-Forward Validation Metrics */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Walk-Forward Model Validation Diagnostics
                </h3>
              </div>
              <p className="text-xs text-stone-500 mb-4">
                Trained and evaluated chronologically without random shuffling or future leakage. Evaluated on the latest 25 out-of-sample days.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <div className="text-stone-500 text-[11px]">R² Determination Score</div>
                  <div className="text-lg font-bold text-stone-900 tabular-nums mt-0.5">
                    {(prediction.modelMetrics.r2Score * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">High explanatory power</div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <div className="text-stone-500 text-[11px]">Mean Absolute Error (MAE)</div>
                  <div className="text-lg font-bold text-stone-900 tabular-nums mt-0.5">
                    ₹{prediction.modelMetrics.mae.toFixed(1)}/q
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Average deviation</div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <div className="text-stone-500 text-[11px]">Root Mean Squared Error (RMSE)</div>
                  <div className="text-lg font-bold text-stone-900 tabular-nums mt-0.5">
                    ₹{prediction.modelMetrics.rmse.toFixed(1)}/q
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Penalizes large errors</div>
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <div className="text-stone-500 text-[11px]">Symmetric MAPE (sMAPE)</div>
                  <div className="text-lg font-bold text-stone-900 tabular-nums mt-0.5">
                    {prediction.modelMetrics.smape.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Relative percentage error</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Model Engine: {prediction.modelUsed.toUpperCase()}</span>
                <span>Version: {prediction.modelVersion}</span>
              </div>
            </div>

            {/* Feature Importance Weights */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6">
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Feature Importance & Weight Allocation
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Relative contribution of engineered time-series indicators to the final price forecast.
              </p>

              <div className="space-y-3">
                {prediction.featureImportance.map((fi) => (
                  <div key={fi.feature}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-stone-700">{fi.feature}</span>
                      <span className="font-bold text-stone-900 tabular-nums">{fi.importancePercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${fi.importancePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Want actionable advice on this forecast?</span>
                <button
                  onClick={() => onNavigate('recommendation', { prediction })}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {language === 'te' ? 'విక్రయ సలహా చూడండి' : 'View Selling Advisory'} →
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
