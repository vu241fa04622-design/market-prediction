import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DATASET_REGISTRY } from '../data/agmarknetData';
import { DatasetMeta } from '../types';
import { Database, Upload, CheckCircle2, AlertTriangle, FileSpreadsheet, Trash2, Check, RefreshCw, Download } from 'lucide-react';

export const DataManagerPage: React.FC = () => {
  const { language } = useLanguage();

  const [datasets, setDatasets] = useState<DatasetMeta[]>(DATASET_REGISTRY);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // File parsing simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    // Simulate validation, deduplication, and schema checking
    setTimeout(() => {
      const newDataset: DatasetMeta = {
        id: `ds_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        source: 'AGMARKNET Mandi CSV Upload Portal',
        totalRecords: Math.floor(Math.random() * 25000 + 8000),
        startDate: '2026-01-01',
        endDate: '2026-11-03',
        uploadedBy: 'Rajesh Patel (Data Manager)',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Validated',
        fileSizeMb: Math.round((file.size / (1024 * 1024)) * 10) / 10 || 5.4,
        statesCovered: 5,
        commoditiesCovered: 14
      };

      setDatasets(prev => [newDataset, ...prev]);
      setIsUploading(false);
      setUploadMessage(`Successfully parsed ${file.name}: 100% valid schema, 0 critical anomalies, 14 duplicate rows removed.`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
            <Database className="w-4 h-4 text-emerald-700" />
            <span>AGMARKNET Data Pipeline Management</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Agricultural Dataset Ingestion & Quality Control
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Upload, validate, deduplicate, and register official Indian mandi market price records into MongoDB
          </p>
        </div>
      </div>

      {uploadMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Upload & Ingestion Box */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Upload New Mandi Price Dataset (CSV)
          </h2>
          <p className="text-xs text-stone-500">
            Mandatory columns: Date, State, District, Market, Commodity, Variety, Min Price, Max Price, Modal Price, Arrival Quantity
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              const fakeEvent = { target: { files: e.dataTransfer.files } } as any;
              handleFileUpload(fakeEvent);
            }
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive ? 'border-emerald-600 bg-emerald-50/50' : 'border-stone-300 hover:border-emerald-600'
          }`}
        >
          <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-stone-800">
            Drag and drop your official AGMARKNET or e-NAM CSV file here
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            Supports CSV, TSV up to 50MB · Automatic chronological sorting and outlier screening
          </p>

          <label className="mt-4 inline-block px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {isUploading && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Validating schema integrity, price outliers, and removing duplicate keys...</span>
          </div>
        )}
      </div>

      {/* Active Datasets Catalog */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">
              Active Verified Datasets in Repository ({datasets.length})
            </h3>
          </div>
          <span className="text-xs text-stone-500">Live Ingestion Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Dataset Name & Source</th>
                <th className="py-3 px-4 text-right">Records Count</th>
                <th className="py-3 px-4">Date Coverage</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">File Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {datasets.map((d) => (
                <tr key={d.id} className="hover:bg-stone-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{d.name}</div>
                    <div className="text-[11px] text-stone-500">{d.source}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-stone-900 tabular-nums">
                    {d.totalRecords.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-stone-600 tabular-nums">
                    {d.startDate} to {d.endDate}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    <div>{d.uploadedBy}</div>
                    <div className="text-[11px] text-stone-400">{d.uploadDate}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-stone-600 tabular-nums">
                    {d.fileSizeMb} MB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Cleaning & Preprocessing Pipeline Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
          <div className="font-bold text-stone-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Missing Date Imputation</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Market holidays and Sunday closures are recorded as non-trading days rather than zero prices to avoid distorting moving average trends.
          </p>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
          <div className="font-bold text-stone-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Outlier Clamping</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Prices exceeding 3 standard deviations from the 30-day rolling median are flagged and verified against physical APMC registers.
          </p>
        </div>

        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
          <div className="font-bold text-stone-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Chronological Sorting</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            All records are strictly indexed chronologically by commodity, mandi, and date before feature extraction to eliminate data leakage.
          </p>
        </div>
      </div>

    </div>
  );
};
