import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  TrendingUp,
  Receipt,
  Bot,
  AlertTriangle,
  ReceiptText,
  Award,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { useFinance, ActiveTab } from '../context/FinanceContext';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

export const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'passport', label: 'FIN AI Passport', icon: FileCheck2, highlight: true },
  { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
  { id: 'payments', label: 'Invoices & Payments', icon: Receipt, badge: '3 Overdue' },
  { id: 'copilot', label: 'FIN AI Copilot', icon: Bot, badge: 'AI' },
  { id: 'risk', label: 'Risk Monitor', icon: AlertTriangle },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  { id: 'credit', label: 'Credit Readiness', icon: Award },
  { id: 'insights', label: 'AI Insights', icon: Sparkles },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
];

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, riskAlerts, businessProfile } = useFinance();
  const activeRiskCount = riskAlerts.filter(r => !r.dismissed).length;

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 p-4 border-r border-slate-800/80 min-h-[calc(100vh-65px)] bg-[#0B0F19]">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
        </p>
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive
                      ? item.highlight
                        ? 'text-white'
                        : 'text-cyan-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.id === 'risk' && activeRiskCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                  {activeRiskCount}
                </span>
              )}

              {item.badge && item.id !== 'risk' && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? item.highlight
                        ? 'bg-white/20 text-white'
                        : 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* FinPass Card Preview Widget */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/20 text-left">
        <div className="flex items-center gap-2 mb-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            Passport Verification
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 truncate">
          {businessProfile.name ? `${businessProfile.name} • Verified` : 'No Profile Verified Yet'}
        </p>
        <button
          onClick={() => setActiveTab('passport')}
          className="w-full py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold text-center transition-colors"
        >
          View Financial Passport
        </button>
      </div>
    </aside>
  );
};

export const MobileNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useFinance();

  const mobileTabs: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'passport', label: 'Passport', icon: FileCheck2, highlight: true },
    { id: 'cashflow', label: 'Forecast', icon: TrendingUp },
    { id: 'payments', label: 'Invoices', icon: Receipt },
    { id: 'copilot', label: 'Copilot', icon: Bot }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl">
      {mobileTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? tab.highlight
                  ? 'text-cyan-400 bg-cyan-500/10 font-bold'
                  : 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
