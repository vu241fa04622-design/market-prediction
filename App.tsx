/**
 * AgriPrice AI - Main Application Component
 * B.Tech CSE Major Project: AI-Based Crop Market Price Prediction & Decision Support
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { TopBar } from './components/TopBar';
import { FarmerDashboard } from './components/FarmerDashboard';
import { CropSelectionPage } from './components/CropSelectionPage';
import { CurrentPricesPage } from './components/CurrentPricesPage';
import { PredictionPage } from './components/PredictionPage';
import { MarketComparisonPage } from './components/MarketComparisonPage';
import { SellingRecommendationPage } from './components/SellingRecommendationPage';
import { HistoricalAnalysisPage } from './components/HistoricalAnalysisPage';
import { PredictionHistoryPage } from './components/PredictionHistoryPage';
import { ReportsPage } from './components/ReportsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { DataManagerPage } from './components/DataManagerPage';
import { AcademicDocPage } from './components/AcademicDocPage';
import { AuthModal } from './components/AuthModal';
import { Sprout, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

function MainLayout() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [navParams, setNavParams] = useState<any>({});
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const handleNavigate = (tab: string, state?: any) => {
    if (state) setNavParams(state);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 antialiased">
      {/* Primary Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        openAuthModal={() => setIsAuthOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <FarmerDashboard onNavigate={handleNavigate} />
        )}

        {activeTab === 'crops' && (
          <CropSelectionPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'current_prices' && (
          <CurrentPricesPage
            initialCropId={navParams.cropId}
            initialMandiId={navParams.mandiId}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'prediction' && (
          <PredictionPage
            initialCropId={navParams.cropId}
            initialMandiId={navParams.mandiId}
            preloadedPrediction={navParams.preloadedPrediction}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'compare' && (
          <MarketComparisonPage
            initialCropId={navParams.cropId}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'recommendation' && (
          <SellingRecommendationPage
            initialCropId={navParams.cropId}
            initialMandiId={navParams.mandiId}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'trends' && (
          <HistoricalAnalysisPage />
        )}

        {activeTab === 'history' && (
          <PredictionHistoryPage onNavigate={handleNavigate} />
        )}

        {activeTab === 'reports' && (
          <ReportsPage />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}

        {activeTab === 'data_manager' && (
          <DataManagerPage />
        )}

        {activeTab === 'academic' && (
          <AcademicDocPage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-800 flex items-center justify-center text-white font-bold text-xs">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <span className="font-semibold text-stone-800">
              AgriPrice AI · Indian Agricultural Market Decision Support System
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-600">
            <button onClick={() => handleNavigate('academic')} className="hover:text-emerald-800 transition-colors">
              Project Report & Viva Q&A
            </button>
            <span>·</span>
            <span className="hover:text-stone-900">
              Data: AGMARKNET (agmarknet.gov.in) & e-NAM
            </span>
            <span>·</span>
            <span className="hover:text-stone-900">
              B.Tech CSE Major Project 2026
            </span>
          </div>

          <div className="text-[11px] text-stone-400">
            Built for Indian Farmers with XGBoost & Time-Series AI
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </LanguageProvider>
  );
}
