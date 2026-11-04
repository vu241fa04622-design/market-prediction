import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Sprout, Globe, UserCheck, LogOut, ChevronDown, BookOpen, ShieldCheck, Database, LayoutDashboard, TrendingUp, DollarSign, GitCompare, Lightbulb, FileText, History } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'prediction', label: t.navPrediction, icon: TrendingUp },
    { id: 'current_prices', label: t.navCurrentPrices, icon: DollarSign },
    { id: 'compare', label: t.navCompare, icon: GitCompare },
    { id: 'recommendation', label: t.navRecommendation, icon: Lightbulb },
    { id: 'trends', label: t.navTrends, icon: TrendingUp },
    { id: 'history', label: t.navHistory, icon: History },
    { id: 'reports', label: t.navReports, icon: FileText },
    { id: 'academic', label: t.navAcademic, icon: BookOpen },
  ];

  if (role === 'admin') {
    navItems.push({ id: 'admin', label: t.navAdmin, icon: ShieldCheck });
  }

  if (role === 'data_manager' || role === 'admin') {
    navItems.push({ id: 'data_manager', label: t.navDataManager, icon: Database });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Upper Navigation Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element Brand Zone */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-sans whitespace-nowrap block leading-tight">
                AgriPrice <span className="text-emerald-600 font-extrabold">AI</span>
              </span>
              <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap block">
                {language === 'te' ? 'రైతు నిర్ణయ మద్దతు వ్యవస్థ' : 'Smart Farmer Decision Support'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-Line, clean typography) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto py-1">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Controls (Language Toggle, Role Switcher, Profile) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'te'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="తెలుగులో చూడండి"
              >
                తెలుగు
              </button>
            </div>

            {/* Role Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors"
                title="Switch demo persona for testing"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline font-semibold">
                  {role === 'farmer' ? t.roleFarmer : role === 'admin' ? t.roleAdmin : t.roleDataManager}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-stone-100 font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                    {t.demoUserSwitch}
                  </div>
                  <button
                    onClick={() => { switchDemoRole('farmer'); setShowRoleDropdown(false); setActiveTab('dashboard'); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${role === 'farmer' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-700'}`}
                  >
                    <div>
                      <div className="font-medium">Deepika</div>
                      <div className="text-[11px] text-stone-500">Farmer · Warangal</div>
                    </div>
                    {role === 'farmer' && <span className="text-emerald-700 text-[10px] font-bold">ACTIVE</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); setShowRoleDropdown(false); setActiveTab('admin'); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${role === 'admin' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-700'}`}
                  >
                    <div>
                      <div className="font-medium">Dr. Ananya Sharma</div>
                      <div className="text-[11px] text-stone-500">System Admin · ML Lead</div>
                    </div>
                    {role === 'admin' && <span className="text-emerald-700 text-[10px] font-bold">ACTIVE</span>}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('data_manager'); setShowRoleDropdown(false); setActiveTab('data_manager'); }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 ${role === 'data_manager' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-700'}`}
                  >
                    <div>
                      <div className="font-medium">Rajesh Patel</div>
                      <div className="text-[11px] text-stone-500">Data Manager · AGMARKNET</div>
                    </div>
                    {role === 'data_manager' && <span className="text-emerald-700 text-[10px] font-bold">ACTIVE</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <img
                  src={user.avatarUrl || '/src/assets/images/avatar_female_farmer_1793765790919.jpg'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-600"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                {t.login}
              </button>
            )}

          </div>
        </div>

        {/* Secondary Sub-Navigation for all viewports & tablet */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 border-t border-stone-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
