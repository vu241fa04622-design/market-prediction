import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PredictionResult } from '../types';
import { downloadPredictionPdf, downloadPredictionCsv } from '../services/reportGenerator';
import { CROPS_CATALOG, MANDIS_CATALOG } from '../data/agmarknetData';
import { History, Download, Trash2, Eye, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface PredictionHistoryPageProps {
  onNavigate: (tab: string, state?: any) => void;
}

export const PredictionHistoryPage: React.FC<PredictionHistoryPageProps> = ({ onNavigate }) => {
  const { savedPredictions, deletePredictionFromHistory } = useAuth();
  const { language, t } = useLanguage();
  const [selectedPred, setSelectedPred] = useState<PredictionResult | null>(savedPredictions[0] || null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'రైతు అంచనాల చరిత్ర & సమీక్ష' : 'Prediction Log & Historical Backtesting'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Audit past forecasts, monitor model reliability over time, and compare with actual spot prices
          </p>
        </div>

        <button
          onClick={() => onNavigate('prediction')}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>{t.quickPredict}</span>
        </button>
      </div>

      {savedPredictions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <History className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900 mb-1">No Past Predictions Recorded</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            Generate your first AI crop price forecast to save it to your historical audit log.
          </p>
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            Run Price Prediction
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* History List Column */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Saved Forecasts ({savedPredictions.length})
            </h3>

            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {savedPredictions.map((p) => {
                const isSelected = selectedPred?.id === p.id;
                const isUp = p.summary.priceChangePercentage >= 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPred(p)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-stone-900 text-sm">
                          {p.cropName}
                        </div>
                        <div className="text-xs text-stone-600 mt-0.5">
                          {p.mandi}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1">
                          {p.currentDate} · {p.forecastHorizon} Days · {p.modelUsed.toUpperCase()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-stone-900 tabular-nums">
                          ₹{p.summary.avgPredictedPrice}
                        </div>
                        <div className={`text-[11px] font-bold flex items-center justify-end ${isUp ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isUp ? '+' : ''}{p.summary.priceChangePercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                      <span>R² Score: {(p.modelMetrics.r2Score * 100).toFixed(0)}%</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePredictionFromHistory(p.id);
                          if (selectedPred?.id === p.id) {
                            setSelectedPred(savedPredictions.find(x => x.id !== p.id) || null);
                          }
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Forecast Audit View */}
          <div className="lg:col-span-2">
            {selectedPred ? (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800">PREDICTION AUDIT RECORD</span>
                    <h2 className="text-xl font-bold text-stone-900">
                      {selectedPred.cropName} ({selectedPred.variety})
                    </h2>
                    <span className="text-xs text-stone-500">
                      Market: {selectedPred.mandi} ({selectedPred.state}) · Generated on {selectedPred.currentDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const crop = CROPS_CATALOG.find(c => c.name === selectedPred.cropName) || CROPS_CATALOG[0];
                        const mandi = MANDIS_CATALOG.find(m => m.name === selectedPred.mandi) || MANDIS_CATALOG[0];
                        downloadPredictionPdf(selectedPred, crop, mandi);
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => downloadPredictionCsv(selectedPred)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => onNavigate('prediction', { preloadedPrediction: selectedPred })}
                      className="px-3 py-1.5 bg-emerald-800 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Open in Studio
                    </button>
                  </div>
                </div>

                {/* Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[11px] text-stone-500">Base Modal Price</div>
                    <div className="text-base font-bold text-stone-900 tabular-nums">
                      ₹{selectedPred.currentModalPrice}/q
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[11px] text-stone-500">Projected Mean</div>
                    <div className="text-base font-bold text-emerald-800 tabular-nums">
                      ₹{selectedPred.summary.avgPredictedPrice}/q
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[11px] text-stone-500">Forecast Horizon</div>
                    <div className="text-base font-bold text-stone-900">
                      {selectedPred.forecastHorizon} Days
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                    <div className="text-[11px] text-stone-500">Model R² Score</div>
                    <div className="text-base font-bold text-emerald-800 tabular-nums">
                      {(selectedPred.modelMetrics.r2Score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Day-by-day table */}
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <div className="p-3 bg-stone-50 border-b border-stone-200 font-bold text-xs text-stone-700">
                    Stored Daily Forecast Trajectory ({selectedPred.forecast.length} Days)
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase border-b border-stone-200">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Day</th>
                          <th className="py-2 px-3 text-right">Predicted Price</th>
                          <th className="py-2 px-3 text-right">95% Confidence Band</th>
                          <th className="py-2 px-3 text-right">Expected Arrival</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {selectedPred.forecast.map(f => (
                          <tr key={f.date} className="hover:bg-stone-50">
                            <td className="py-2 px-3 font-semibold text-stone-800 tabular-nums">{f.date}</td>
                            <td className="py-2 px-3 text-stone-600">{f.dayName}</td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-900 tabular-nums">₹{f.predictedPrice}</td>
                            <td className="py-2 px-3 text-right text-stone-500 tabular-nums">₹{f.lowerConfidenceBound} – ₹{f.upperConfidenceBound}</td>
                            <td className="py-2 px-3 text-right text-stone-600 tabular-nums">{f.expectedArrivalQuantity} q</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400">
                  Model Engine: {selectedPred.modelUsed.toUpperCase()} · Model Version: {selectedPred.modelVersion} · Saved to Local Storage Audit Registry
                </div>

              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-500 border border-stone-200">
                Select a prediction from the list to view complete backtesting diagnostics.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
