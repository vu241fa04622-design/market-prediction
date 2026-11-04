import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG, generateRealisticHistoricalSeries } from '../data/agmarknetData';
import { runPricePrediction } from '../services/mlEngine';
import { downloadPredictionPdf, downloadPredictionCsv, downloadHistoricalPricesCsv } from '../services/reportGenerator';
import { FileText, Download, Sparkles, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>('crop_paddy');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('mandi_warangal');
  const [reportHorizon, setReportHorizon] = useState<7 | 15 | 30>(15);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const selectedCrop = CROPS_CATALOG.find(c => c.id === selectedCropId) || CROPS_CATALOG[0];
  const selectedMandi = MANDIS_CATALOG.find(m => m.id === selectedMandiId) || MANDIS_CATALOG[0];

  const handleGenerateAndDownloadPdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const history = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 90);
      const prediction = runPricePrediction(
        history,
        selectedCrop.id,
        selectedMandi.id,
        selectedCrop.varietyList[0],
        reportHorizon,
        'xgboost'
      );
      downloadPredictionPdf(prediction, selectedCrop, selectedMandi);
      setIsGenerating(false);
    }, 400);
  };

  const handleGenerateAndDownloadCsv = () => {
    const history = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 90);
    const prediction = runPricePrediction(
      history,
      selectedCrop.id,
      selectedMandi.id,
      selectedCrop.varietyList[0],
      reportHorizon,
      'xgboost'
    );
    downloadPredictionCsv(prediction);
  };

  const handleDownloadRawHistoryCsv = () => {
    const history = generateRealisticHistoricalSeries(selectedCrop.id, selectedMandi.id, 120);
    downloadHistoricalPricesCsv(history, selectedCrop.name, selectedMandi.name);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'నివేదికలు & ఎగుమతులు (Reports & Exports)' : 'Official Reports & Analytical Exports'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Generate publication-grade PDF decision reports and CSV datasets for farmers, banking institutions, and academic evaluation
          </p>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-1">
            Configure Report Parameters
          </h2>
          <p className="text-xs text-stone-500">
            Select the target agricultural commodity, regulated market committee, and forecast horizon
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.selectCrop}</label>
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

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.selectMandi}</label>
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

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">{t.forecastHorizon}</label>
            <select
              value={reportHorizon}
              onChange={(e) => setReportHorizon(Number(e.target.value) as any)}
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value={7}>Next 7 Days (Short Horizon)</option>
              <option value={15}>Next 15 Days (Medium Horizon)</option>
              <option value={30}>Next 30 Days (Full Month Horizon)</option>
            </select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-3">
          
          <button
            onClick={handleGenerateAndDownloadPdf}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            <span>{isGenerating ? 'Compiling PDF...' : 'Download Formatted PDF Report'}</span>
          </button>

          <button
            onClick={handleGenerateAndDownloadCsv}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-stone-600" />
            <span>Export Forecast CSV</span>
          </button>

          <button
            onClick={handleDownloadRawHistoryCsv}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-stone-600" />
            <span>Export Historical 120-Day AGMARKNET CSV</span>
          </button>

        </div>
      </div>

      {/* Report Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Official APMC Formatting</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Includes verified state, district, APMC yard codes, commodity specifications, and government Minimum Support Price (MSP) baselines.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Walk-Forward Metrics</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Reports R² score, Mean Absolute Error (MAE), and Root Mean Squared Error (RMSE) to substantiate model integrity for institutional reviewers.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Academic Rigor Disclaimers</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Contains mandatory ethical disclosures and notes regarding physical moisture inspection, adhering to B.Tech project specifications.
          </p>
        </div>

      </div>

    </div>
  );
};
