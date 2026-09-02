import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Header: React.FC = () => {
  const {
    businessProfile,
    riskAlerts,
    setIsBusinessModalOpen,
    setActiveTab
  } = useFinance();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const activeRiskCount = riskAlerts.filter(r => !r.dismissed).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                  FinPass AI
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  DEMO BUSINESS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Your Business Financial Passport
              </p>
            </div>
          </div>
        </div>

        {/* Center: Active Business Badge (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-1.5 shadow-inner">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100">
                {businessProfile.name}
              </span>
              <span className="text-[11px] font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {businessProfile.category}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-slate-500" />
              <span>{businessProfile.location}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Notifications, Data Customizer, Business Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customizer Button */}
          <button
            onClick={() => setIsBusinessModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors shadow-sm"
            title="Edit Demo Financial Data"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Edit Demo Data</span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeRiskCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {activeRiskCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-sm text-slate-100">
                      AI Risk Notifications
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {activeRiskCount} Active
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto my-2">
                  {riskAlerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setActiveTab('risk');
                        setShowNotifications(false);
                      }}
                      className={`py-3 px-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-800/50 flex items-start gap-3 ${
                        alert.dismissed ? 'opacity-50' : ''
                      }`}
                    >
                      {alert.severity === 'high' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          {alert.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {alert.description}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveTab('risk');
                    setShowNotifications(false);
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View All Risk Alerts →
                </button>
              </div>
            )}
          </div>

          {/* Profile Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                RK
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-2 py-1">
                  Active Business Profile
                </p>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-cyan-500/30 flex items-center gap-3 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                    RK
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">RK Traders</p>
                    <p className="text-[10px] text-slate-400">Retail • Hyderabad, India</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsBusinessModalOpen(true);
                      setShowProfileSwitcher(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Customize Financial Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
