import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CROPS_CATALOG, MANDIS_CATALOG } from '../data/agmarknetData';
import { CropInfo } from '../types';
import { Search, Filter, Sparkles, TrendingUp, DollarSign, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

interface CropSelectionPageProps {
  onNavigate: (tab: string, state?: any) => void;
}

export const CropSelectionPage: React.FC<CropSelectionPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');

  const categories = ['All', 'Cereal', 'Pulse', 'Vegetable', 'Spice', 'Cash Crop', 'Oilseed'];
  const states = ['All', 'Telangana', 'Andhra Pradesh', 'Maharashtra', 'Punjab', 'Madhya Pradesh'];

  const filteredCrops = CROPS_CATALOG.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teluguName.includes(searchQuery) ||
      c.varietyList.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {language === 'te' ? 'పంటల జాబితా & ఎంపిక' : 'Agricultural Commodity Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Searchable registry of major Indian food crops, cash crops, and spices with official MSP benchmarks
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop name, Telugu name, or variety (e.g. Sona Masuri, Teja, Sharbati)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

        </div>

        {/* Category Pills (Functional filter tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-stone-500 mr-2 shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-all p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {crop.category}
                </span>
                <span className="text-xs font-medium text-stone-400">
                  {crop.season} Season
                </span>
              </div>

              <h2 className="text-lg font-bold text-stone-900">
                {crop.name}
              </h2>
              <div className="text-xs font-semibold text-stone-500 mb-2">
                {crop.teluguName}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {crop.description}
              </p>

              {/* Varieties list */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-stone-500 block mb-1">Common Varieties:</span>
                <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                  {crop.varietyList.map((v, i) => (
                    <span key={v} className="bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key specifications */}
              <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-stone-50 border border-stone-100 mb-4">
                <div>
                  <span className="text-stone-400 block">Govt. MSP</span>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {crop.mspPrice > 0 ? `₹${crop.mspPrice}/q` : 'Market Determined'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">Storage Durability</span>
                  <span className="font-bold text-stone-900">
                    {crop.shelfLifeDays} Days ({crop.perishable ? 'Perishable' : 'Durable'})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => onNavigate('prediction', { cropId: crop.id })}
                className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Forecast Prices</span>
              </button>

              <button
                onClick={() => onNavigate('current_prices', { cropId: crop.id })}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Spot Rates
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
